"use client";

import { StarIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The id of the section crossing a thin horizontal band, on the home page. `band` is an
 * IntersectionObserver rootMargin; the default band runs across the middle of the viewport.
 */
function useActiveSection(ids: string[], band = "-45% 0px -50% 0px") {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    if (pathname !== "/") return;
    const list = key.split(" ");
    const inBand = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting);
        setActive(list.find((id) => inBand.get(id)) ?? null);
      },
      { rootMargin: band },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname, key, band]);

  return pathname === "/" ? active : null;
}

// `show` sets where each header link appears. Experience steps aside on wide screens,
// where the Experience band has its own nav, so only one marker moves at a time.
const headerLinks = [
  { id: "experience", label: "Experience", show: "hidden md:block lg:hidden" },
  { id: "projects", label: "Projects", show: "" },
  { id: "work", label: "Work", show: "" },
  { id: "toolbox", label: "Toolbox", show: "hidden md:block" },
];

/** Header links; a pill marks the current section. */
export function SectionNav() {
  const current = useActiveSection(headerLinks.map((l) => l.id));

  return headerLinks.map(({ id, label, show }) => (
    <Link
      key={id}
      href={`/#${id}`}
      aria-current={current === id ? "location" : undefined}
      className={`relative isolate rounded-full px-3 py-2 transition-colors ${
        current === id ? "text-ink" : "text-muted hover:text-ink"
      } ${show}`}
    >
      {current === id && (
        <motion.span
          layoutId="nav-current"
          className="absolute inset-0 -z-10 rounded-full border border-line bg-surface"
          transition={{ type: "spring", bounce: 0.15, visualDuration: 0.35 }}
        />
      )}
      {label}
    </Link>
  ));
}

/** The Experience band's own vertical nav (wide screens); a small gold star slides to the current row. */
export function BandNav({ items }: { items: { id: string; label: string }[] }) {
  // Band just under the header: a section reached through this nav sits at the top, so it counts as current.
  const current = useActiveSection(
    items.map((i) => i.id),
    "-12% 0px -87% 0px",
  );

  return (
    <nav aria-label="Sections">
      <ul className="space-y-1">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={current === id ? "location" : undefined}
              className={`relative flex items-center py-2 pl-7 text-lg font-medium tracking-tight transition-colors ${
                current === id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {current === id && (
                <motion.span
                  layoutId="band-current"
                  className="absolute left-0 grid size-5 place-items-center text-star"
                  transition={{ type: "spring", bounce: 0.2, visualDuration: 0.3 }}
                >
                  <StarIcon weight="fill" className="size-4" aria-hidden />
                </motion.span>
              )}
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
