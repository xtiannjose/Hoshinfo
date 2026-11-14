"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Shot } from "@/components/shot";
import { TierLink } from "@/components/tier-link";
import type { Project } from "@/content/projects";

type Slide = Pick<Project, "slug" | "name" | "label" | "tagline" | "live" | "code" | "cover" | "phone">;

/** Stacks one block per slide in the same cell and shows the active one, so the height never jumps. */
function Swap({ active, children }: { active: number; children: ReactNode[] }) {
  return (
    <div className="grid">
      {children.map((child, i) => (
        <div key={i} className={`[grid-area:1/1] ${i === active ? "" : "invisible"}`} aria-hidden={i !== active}>
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * The hero: one framed card per project (desktop screen with the phone mounted in its corner),
 * moving on every 6s. The gold bar under the active segment drives the change (see .timer in
 * globals.css), so pausing the bar pauses the show. Hover, keyboard focus or the pause button
 * hold it; reduced motion turns the timer, and so the autoplay, off.
 */
export function HeroShowcase({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [stopped, setStopped] = useState(false);
  const current = slides[active];
  const next = () => setActive((active + 1) % slides.length);

  return (
    <div
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      // Keyboard focus holds the show; a mouse click on a segment should not.
      onFocus={(event) => event.target.matches(":focus-visible") && setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <Swap active={active}>
        {slides.map((slide) => (
          <div key={slide.slug} className="mb-2 flex flex-col text-sm sm:flex-row sm:items-baseline sm:gap-3">
            <p className="shrink-0 font-medium text-ink">{slide.name}</p>
            <p className="text-muted">{slide.tagline}</p>
          </div>
        ))}
      </Swap>

      {/* Mounted look: a 4px rim and 12px corners around 8px-cornered media. */}
      <div className="rounded-xl border border-line bg-surface p-1">
        <div className="grid">
          {slides.map((slide, i) => (
            <motion.div
              key={slide.slug}
              className={`relative [grid-area:1/1] ${i === active ? "" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              inert={i !== active}
            >
              <Link href={`/projects/${slide.slug}`} aria-label={`${slide.name} case study`} className="block">
                <Shot shot={slide.cover} bare sizes="(min-width: 1024px) 760px, 100vw" preload={i === 0} />
              </Link>
              {/* The phone sits inside the screen's corner, so both stay fully in view. */}
              <motion.div
                className="pointer-events-none absolute bottom-3 right-3 w-[19%] max-w-36 rounded-[10px] border border-line bg-surface p-0.5 shadow-[0_16px_32px_-12px_rgb(0_0_0/0.45)] sm:bottom-4 sm:right-4"
                initial={false}
                animate={{ y: i === active ? 0 : 16 }}
                transition={{ type: "spring", bounce: 0, visualDuration: 0.6, delay: i === active ? 0.1 : 0 }}
              >
                <Shot shot={slide.phone} bare sizes="150px" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-1.5 px-3">
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              aria-label={`Show ${slide.name}, ${slide.label}`}
              className="group flex-1 py-3"
            >
              <span
                className={`block h-0.5 overflow-hidden rounded-full transition-colors ${
                  i === active ? "bg-line" : "bg-line group-hover:bg-muted"
                }`}
              >
                {i === active && (
                  <span
                    className="timer block h-full origin-left bg-star"
                    style={{ animationPlayState: held || stopped ? "paused" : "running" }}
                    onAnimationEnd={next}
                  />
                )}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStopped(!stopped)}
            aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
            className="ml-1 rounded-full p-1.5 text-muted transition-colors hover:text-ink motion-reduce:hidden"
          >
            {stopped ? <PlayIcon className="size-3.5" aria-hidden /> : <PauseIcon className="size-3.5" aria-hidden />}
          </button>
        </div>

        <Swap active={active}>
          {slides.map((slide) => (
            <p key={slide.slug} className="px-3 pb-1 text-[13px] text-muted">
              {slide.cover.caption}
            </p>
          ))}
        </Swap>

        <div className="mt-1 flex gap-1">
          <TierLink href={`/projects/${current.slug}`}>Case study</TierLink>
          {current.live && <TierLink href={current.live}>Live site</TierLink>}
          <TierLink href={current.code}>Code</TierLink>
        </div>
      </div>
    </div>
  );
}
