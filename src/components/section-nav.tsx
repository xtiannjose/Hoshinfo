"use client";

import { CaretDownIcon, StarIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type NavProject = { slug: string; name: string; tagline: string };

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

/**
 * The header's section links; a small gold star slides to the section you are reading.
 * Projects also has a caret that opens a list of the case studies.
 */
export function SectionNav({ projects }: { projects: NavProject[] }) {
  const current = useActiveSection(headerLinks.map((l) => l.id));

  return headerLinks.map(({ id, label }) => {
    const link = <SectionLink key={id} id={id} label={label} current={current === id} />;
    return id === "projects" ? (
      <ProjectsMenu key={id} projects={projects}>
        {link}
      </ProjectsMenu>
    ) : (
      link
    );
  });
}

/**
 * A disclosure, not an ARIA menu: a button that shows and hides a list of plain links, so Tab moves
 * through them as usual. Escape closes it and puts focus back on the button; so does a click or
 * focus anywhere outside it. A mouse also opens it by pointing at the caret and closes it by leaving
 * the caret and the list.
 */
function ProjectsMenu({ projects, children }: { projects: NavProject[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  // How the last press on the button came: a mouse has already opened the list by pointing at it.
  const pressedWith = useRef("");
  const pathname = usePathname();
  const hover = (to: boolean) => (event: PointerEvent) => event.pointerType === "mouse" && setOpen(to);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => !root.current?.contains(event.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("focusin", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("focusin", close);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative flex items-center"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        setOpen(false);
        toggle.current?.focus();
      }}
    >
      {children}
      {/* The hover area: the caret and the list, not the Projects link. It runs the full height of the
          link so the pointer reaches the list's top edge without leaving it. Not positioned, so the list
          still centres under the whole Projects item. */}
      <div className="flex items-center self-stretch" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="projects-menu"
          aria-label="Project case studies"
          onPointerDown={(event) => (pressedWith.current = event.pointerType)}
          // A mouse click keeps it open (pointing already opened it); touch and keyboard toggle it.
          onClick={() => {
            const mouse = pressedWith.current === "mouse";
            pressedWith.current = "";
            setOpen((o) => mouse || !o);
          }}
          className="-ml-1.5 grid size-6 place-items-center sm:size-7 rounded-full text-muted transition-colors hover:text-ink aria-expanded:text-ink sm:-ml-2"
        >
          <CaretDownIcon
            weight="bold"
            className={`size-3 transition-transform sm:size-3.5 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {open && (
          // pt-3 rather than a margin: the gap is part of the menu, so the pointer can cross it without leaving.
          <div className="absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3">
            <ul
              id="projects-menu"
              className="rounded-xl border border-line bg-surface p-1.5 shadow-[0_16px_32px_-12px_rgb(0_0_0/0.35)]"
            >
              {projects.map(({ slug, name, tagline }) => {
                const href = `/projects/${slug}`;
                return (
                  <li key={slug}>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 transition-colors hover:bg-line/50 focus-visible:bg-line/50 aria-[current=page]:bg-star-soft"
                    >
                      <span className="block font-medium text-ink">{name}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted">{tagline}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLink({ id, label, current }: { id: string; label: string; current: boolean }) {
  return (
    <Link
      href={`/#${id}`}
      aria-current={current ? "location" : undefined}
      className={`relative flex items-center py-2 pl-[1.125rem] pr-2 transition-colors sm:pl-6 sm:pr-3 ${
        current ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {current && (
        <motion.span
          layoutId="nav-star"
          aria-hidden
          className="absolute left-0 grid size-4 place-items-center text-star sm:left-0.5 sm:size-5"
          transition={{ type: "spring", bounce: 0.2, visualDuration: 0.35 }}
        >
          <StarIcon weight="fill" className="size-3.5 sm:size-4" />
        </motion.span>
      )}
      {label}
    </Link>
  );
}
