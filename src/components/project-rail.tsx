"use client";

import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { motion, transform, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { Gallery } from "@/components/gallery";
import { PhoneInset } from "@/components/shot";
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
  phone: Shot;
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
 * Where each item (intro, slides, GitHub card) stops along the strip, from 0 to 1. An item stops
 * where its left edge meets the gutter. One that cannot get that far (the strip runs out first)
 * stops where its right edge meets the far gutter instead, so it ends fully in view. Stops always
 * rise, and the last one is 1.
 */
function placeItems(items: { left: number; right: number }[], lead: number, view: number, distance: number) {
  const n = items.length;
  if (distance <= 0) return items.map((_, i) => (n > 1 ? i / (n - 1) : 0));
  const stops = items.map(({ left, right }) =>
    left - lead <= distance ? (left - lead) / distance : (right + lead - view) / distance,
  );
  for (let i = 0; i < n; i++) stops[i] = Math.min(1, Math.max(i === 0 ? 0 : stops[i - 1] + 1e-3, stops[i]));
  stops[n - 1] = 1;
  return stops;
}

/**
 * The top of the home page: an intro card, then the projects, as one horizontal strip. On a wide
 * screen with a fine pointer, scrolling the page moves the strip sideways while it stays pinned
 * under the header. On touch screens and with reduced motion it is a plain swipeable row. The
 * ruler shows where you are either way; its slots jump.
 */
export function ProjectRail({
  lead,
  children,
  slides,
  more,
}: {
  /** The small label above the intro card. */
  lead: { name: string; role: string };
  /** The intro card's content (the page's h1 lives here). */
  children: ReactNode;
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
  // Items on the strip, in order: the intro card, each project, the GitHub card.
  const names = ["the introduction", ...slides.map((slide) => slide.name), "more on GitHub"];
  const count = names.length;
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
        const scaled = items.map((el) => ({ left: el.offsetLeft * SETTLED, right: (el.offsetLeft + el.offsetWidth) * SETTLED }));
        stops.set(placeItems(scaled, lead * SETTLED, view.clientWidth, travel));
        for (const el of items) el.style.scrollSnapAlign = "";
      } else {
        const max = strip.scrollWidth - strip.clientWidth;
        const edges = items.map((el) => ({ left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth }));
        stops.set(placeItems(edges, lead, strip.clientWidth, max));
        // An item that cannot reach the start snaps by its end, which is exactly where its stop puts it.
        for (const el of items) el.style.scrollSnapAlign = el.offsetLeft - lead > max ? "end" : "";
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    observer.observe(view);
    return () => observer.disconnect();
  }, [pinned, distance, stops]);

  /** Bring item `i` (0 is the intro card, the GitHub card is the last) to its stop on the strip. */
  function go(i: number, smooth = true) {
    const strip = track.current;
    const p = stops.get()[i];
    if (!strip || !section.current || p === undefined) return;
    const behavior = smooth && !reduce ? "smooth" : "instant";
    if (pinned && stage.current) {
      // The pin's real length (from CSS), which can differ from the travel by a classic scrollbar's width.
      const length = section.current.offsetHeight - stage.current.offsetHeight;
      const top = section.current.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top + p * length, behavior });
    } else {
      strip.scrollTo({ left: p * (strip.scrollWidth - strip.clientWidth), behavior });
    }
  }

  return (
    <section
      id="showcase"
      ref={section}
      className="rail relative scroll-mt-16 pt-8 md:pt-12 pinned:pt-0"
      style={{ "--slides": slides.length } as CSSProperties}
    >
      <div
        ref={stage}
        className="flex flex-col gap-6 pinned:sticky pinned:top-16 pinned:h-[calc(100dvh-4rem)] pinned:justify-center pinned:overflow-clip"
      >
        <div className="mx-auto flex w-full max-w-page justify-center px-4 sm:px-6 lg:px-8">
          <nav aria-label="Jump along the strip" className="relative flex items-center" style={{ gap: GAP }}>
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className="flex items-center" style={{ gap: GAP }}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to ${names[i]}`}
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
          {/* Intro card width: also in the .rail height in globals.css. */}
          <article
            onFocus={(event) => event.target.matches(":focus-visible") && go(0, false)}
            className="flex w-[85vw] shrink-0 snap-start flex-col sm:w-[26rem] lg:w-[28rem]"
          >
            <div className="mb-2 flex items-baseline gap-3 text-sm">
              <p className="font-medium text-ink">{lead.name}</p>
              <p className="text-muted">{lead.role}</p>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-8 rounded-xl border border-line bg-surface p-6 sm:p-8">
              {children}
            </div>
          </article>
          {slides.map((slide, i) => (
            // Slide width: also in the .rail height in globals.css. 54.5rem lets the first project sit fully
            // beside the intro card inside the page column (84rem = 28rem card + 1.5rem gap + 54.5rem).
            <article
              key={slide.slug}
              // Keyboard focus on an item off to the side brings it into view.
              onFocus={(event) => event.target.matches(":focus-visible") && go(i + 1, false)}
              className="w-[85vw] shrink-0 snap-start sm:w-[70vw] lg:w-[min(70vw,calc((100dvh-17rem)*1.6),54.5rem)]"
            >
              {/* One line, so every frame on the strip starts at the same height; the full tagline is in Projects below. */}
              <div className="mb-2 flex items-baseline gap-3 text-sm">
                <h2 className="shrink-0 font-medium text-ink">{slide.name}</h2>
                <p className="min-w-0 truncate text-muted">{slide.tagline}</p>
              </div>
              {/* Mounted look: a 4px rim and 12px corners around 8px-cornered media. */}
              <div className="rounded-xl border border-line bg-surface p-1">
                <Gallery
                  bare
                  preload={i === 0}
                  shots={slide.shots}
                  label={`${slide.name} case study`}
                  href={`/projects/${slide.slug}`}
                  sizes="(min-width: 1024px) min(70vw, calc(160vh - 27.2rem), 54.5rem), (min-width: 640px) 70vw, 85vw"
                  overlay={<PhoneInset shot={slide.phone} />}
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
            onFocus={(event) => event.target.matches(":focus-visible") && go(count - 1, false)}
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
