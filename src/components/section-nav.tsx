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
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "toolbox", label: "Toolbox" },
];

/** The header's section links; a small gold star slides to the section you are reading. */
export function SectionNav() {
  const current = useActiveSection(headerLinks.map((l) => l.id));

  return headerLinks.map(({ id, label }) => (
    <Link
      key={id}
      href={`/#${id}`}
      aria-current={current === id ? "location" : undefined}
      className={`relative flex items-center py-2 pl-[1.125rem] pr-2 transition-colors sm:pl-5 sm:pr-3 ${
        current === id ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {current === id && (
        <motion.span
          layoutId="nav-star"
          aria-hidden
          className="absolute left-0 grid size-4 place-items-center text-star sm:left-0.5"
          transition={{ type: "spring", bounce: 0.2, visualDuration: 0.35 }}
        >
          <StarIcon weight="fill" className="size-3.5" />
        </motion.span>
      )}
      {label}
    </Link>
  ));
}
