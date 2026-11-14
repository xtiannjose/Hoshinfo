"use client";

import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { motion, transform, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";

import { Gallery } from "@/components/gallery";
import { TierLink } from "@/components/tier-link";
import { useMediaQuery } from "@/components/use-media-query";
import type { Shot } from "@/content/projects";

export type RailSlide = {
  slug: string;
  name: string;
  tagline: string;
  live?: string;
  code: string;
  shots: Shot[];
};

// Same query as the `pinned:` variant in globals.css, which lays the rail out before any JS runs.
const PINNED = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
// The strip steps back to this scale as you start moving through it (also in globals.css).
const SETTLED = 0.92;
// Ruler geometry, in px: a 30px slot per item, then 4 one-pixel ticks, all 9px apart.
const SLOT = 30;
const GAP = 9;
const TICKS = 4;
const PITCH = SLOT + GAP + TICKS * (1 + GAP);
// Lines the first slide up with the page column (the same steps as max-w-page px-4 sm:px-6 lg:px-8).
const GUTTER =
  "px-4 scroll-px-4 sm:px-6 sm:scroll-px-6 lg:px-[max(2rem,calc((100%-88rem)/2+2rem))] lg:scroll-px-[max(2rem,calc((100%-88rem)/2+2rem))]";

/**
 * Where each item (the slides, then the GitHub card) sits along the strip, from 0 to 1: the point
 * at which it reaches the gutter. Items that never can (the strip runs out first) share the rest of
 * the way evenly, so every stop is distinct and the last one is 1.
 */
function placeItems(lefts: number[], lead: number, distance: number) {
  if (distance <= 0) return lefts.map((_, i) => (lefts.length > 1 ? i / (lefts.length - 1) : 0));
  const raw = lefts.map((left) => Math.min(1, Math.max(0, (left - lead) / distance)));
  const firstOut = raw.findIndex((p, i) => i > 0 && (p >= 1 || i === raw.length - 1));
  const from = raw[firstOut - 1];
  const rest = raw.length - firstOut;
  return raw.map((p, i) => (i < firstOut ? p : from + ((1 - from) * (i - firstOut + 1)) / rest));
}

/**
 * Projects as a horizontal strip. On a wide screen with a fine pointer, scrolling the page moves
 * the strip sideways while it stays pinned under the header. On touch screens and with reduced
 * motion it is a plain swipeable row. The ruler shows where you are either way; its slots jump.
 */
export function ProjectRail({
  title,
  intro,
  slides,
  more,
}: {
  title: string;
  intro: string;
  slides: RailSlide[];
  more: string;
}) {
  const pinned = useMediaQuery(PINNED);
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // How far the strip moves (pinned) and where each item stops, kept out of React state.
  const distance = useMotionValue(0);
  const stops = useMotionValue<number[]>([]);

  const page = useScroll({ target: section, offset: ["start 64px", "end end"] });
  const row = useScroll({ container: track });
  const x = useTransform(() => -page.scrollYProgress.get() * distance.get());
  const scale = useTransform(page.scrollYProgress, [0, 0.15], [1, SETTLED]);
  const count = slides.length + 1;
  const along = (p: number) => {
    const at = stops.get();
    return at.length === count ? transform(p, at, at.map((_, i) => i * PITCH)) : 0;
  };
  const markerPinned = useTransform(() => along(page.scrollYProgress.get()));
  const markerRow = useTransform(() => along(row.scrollXProgress.get()));

  useEffect(() => {
    const strip = track.current;
    const view = stage.current;
    if (!strip || !view) return;
    const measure = () => {
      const items = [...strip.children] as HTMLElement[];
      const lead = parseFloat(getComputedStyle(strip).paddingLeft);
      if (pinned) {
        const travel = Math.max(0, strip.offsetWidth * SETTLED - view.clientWidth);
        distance.set(travel);
        stops.set(placeItems(items.map((el) => el.offsetLeft * SETTLED), lead * SETTLED, travel));
      } else {
        stops.set(placeItems(items.map((el) => el.offsetLeft), lead, strip.scrollWidth - strip.clientWidth));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    observer.observe(view);
    return () => observer.disconnect();
  }, [pinned, distance, stops]);

  /** Bring item `i` (the GitHub card is the last) to its stop on the strip. */
  function go(i: number, smooth = true) {
    const strip = track.current;
    const p = stops.get()[i];
    if (!strip || !section.current || p === undefined) return;
    const behavior = smooth && !reduce ? "smooth" : "instant";
    if (pinned) {
      const top = section.current.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top + p * distance.get(), behavior });
    } else {
      strip.scrollTo({ left: p * (strip.scrollWidth - strip.clientWidth), behavior });
    }
  }

  return (
    <section
      id="projects"
      ref={section}
      aria-labelledby="projects-title"
      className="rail relative scroll-mt-16 pt-28 md:pt-36 pinned:mt-20 pinned:pt-0"
      style={{ "--slides": slides.length } as CSSProperties}
    >
      <div
        ref={stage}
        className="flex flex-col gap-8 pinned:sticky pinned:top-16 pinned:h-[calc(100dvh-4rem)] pinned:justify-center pinned:overflow-clip"
      >
        <div className="mx-auto flex w-full max-w-page flex-wrap items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 id="projects-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-[60ch] text-muted">{intro}</p>
          </div>
          <nav aria-label="Jump to a project" className="relative flex items-center" style={{ gap: GAP }}>
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className="flex items-center" style={{ gap: GAP }}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={i < slides.length ? `Go to ${slides[i].name}` : "Go to more on GitHub"}
                  className="h-[18px] rounded-[3px] border border-muted transition-colors hover:border-ink"
                  style={{ width: SLOT }}
                />
                {i < count - 1 &&
                  Array.from({ length: TICKS }, (_, t) => <span key={t} aria-hidden className="h-[18px] w-px bg-muted/50" />)}
              </span>
            ))}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-[18px] rounded-[3px] bg-star ring-1 ring-star-ink ring-inset forced-colors:bg-[Highlight]"
              style={{ width: SLOT, x: pinned ? markerPinned : markerRow }}
            />
          </nav>
        </div>

        <motion.div
          ref={track}
          style={pinned ? { x, scale } : undefined}
          className={`relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pinned:w-max pinned:origin-left pinned:snap-none pinned:overflow-visible pinned:pb-0 ${GUTTER}`}
        >
          {slides.map((slide, i) => (
            // Slide width: also in the .rail height in globals.css.
            <article
              key={slide.slug}
              // Keyboard focus on an item off to the side brings it into view.
              onFocus={(event) => event.target.matches(":focus-visible") && go(i, false)}
              className="w-[85vw] shrink-0 snap-start sm:w-[70vw] lg:w-[min(70vw,calc((100dvh-24rem)*1.6))]"
            >
              <div className="mb-2 flex flex-col text-sm sm:flex-row sm:items-baseline sm:gap-3">
                <h3 className="shrink-0 font-medium text-ink">{slide.name}</h3>
                <p className="text-muted">{slide.tagline}</p>
              </div>
              {/* Mounted look: a 4px rim and 12px corners around 8px-cornered media. */}
              <div className="rounded-xl border border-line bg-surface p-1">
                <Gallery
                  bare
                  shots={slide.shots}
                  label={`${slide.name} case study`}
                  href={`/projects/${slide.slug}`}
                  sizes="(min-width: 1024px) min(70vw, calc(160vh - 38.4rem)), (min-width: 640px) 70vw, 85vw"
                />
                <div className="mt-1 flex gap-1">
                  <TierLink href={`/projects/${slide.slug}`}>Case study</TierLink>
                  {slide.live && <TierLink href={slide.live}>Live site</TierLink>}
                  <TierLink href={slide.code}>Code</TierLink>
                </div>
              </div>
            </article>
          ))}
          <a
            href={more}
            target="_blank"
            rel="noreferrer"
            onFocus={(event) => event.target.matches(":focus-visible") && go(slides.length, false)}
            className="group mt-7 flex w-64 shrink-0 snap-start flex-col justify-between rounded-xl border border-line bg-surface p-6 transition-colors hover:border-muted"
          >
            <GithubLogoIcon className="size-8 text-muted transition-colors group-hover:text-ink" aria-hidden />
            <span className="flex items-center gap-2 font-medium">
              More on GitHub
              <ArrowUpRightIcon
                className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
