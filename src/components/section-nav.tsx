"use client";

import { StarIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The current section on the home page: of the sections inside a band from 12% to 50% down the
 * viewport, the last one in `ids` order. "Last" lets the final section win at the bottom of a tall
 * window, where it can never scroll up to the top. Both navs use the same band, so they agree.
 */
function useActiveSection(ids: string[]) {
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
        setActive(list.findLast((id) => inBand.get(id)) ?? null);
      },
      { rootMargin: "-12% 0px -50% 0px" },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname, key]);

  return pathname === "/" ? active : null;
}

// `show` sets where each header link appears; the bar stays on one line on a phone.
const headerLinks = [
  { id: "experience", label: "Experience", show: "hidden md:block" },
  { id: "projects", label: "Projects", show: "" },
  { id: "toolbox", label: "Toolbox", show: "" },
];

/** Header links; a pill marks the current section, below lg (from lg the band's own nav marks it). */
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
          className="absolute inset-0 -z-10 rounded-full border border-line bg-surface lg:hidden"
          transition={{ type: "spring", bounce: 0.15, visualDuration: 0.35 }}
        />
      )}
      {label}
    </Link>
  ));
}

/** The Experience band's own vertical nav (wide screens); a small gold star slides to the current row. */
export function BandNav({ items }: { items: { id: string; label: string }[] }) {
  const current = useActiveSection(items.map((i) => i.id));

  return (
    <nav aria-label="Sections">
      <ul className="space-y-1">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={current === id ? "location" : undefined}
              className={`relative flex items-center py-1.5 pl-6 text-base font-medium tracking-tight transition-colors ${
                current === id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {current === id && (
                <motion.span
                  layoutId="band-current"
                  className="absolute left-0 grid size-4 place-items-center text-star"
                  transition={{ type: "spring", bounce: 0.2, visualDuration: 0.3 }}
                >
                  <StarIcon weight="fill" className="size-3.5" aria-hidden />
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
