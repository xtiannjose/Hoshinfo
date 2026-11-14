"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Gallery } from "@/components/gallery";
import { PhoneInset } from "@/components/shot";
import { TierLink } from "@/components/tier-link";
import type { Shot } from "@/content/projects";

export type CarouselSlide = {
  slug: string;
  name: string;
  tagline: string;
  live?: string;
  code: string;
  shots: Shot[];
  phone: Shot;
};

// Ruler geometry, in px: a 30px slot per card, then 4 one-pixel ticks, all 9px apart.
const SLOT = 30;
const GAP = 9;
const TICKS = 4;
// Lines the first card up with the page column (the same steps as max-w-page px-4 sm:px-6 lg:px-8).
const GUTTER =
  "px-4 scroll-px-4 sm:px-6 sm:scroll-px-6 lg:px-[max(2rem,calc((100%-88rem)/2+2rem))] lg:scroll-px-[max(2rem,calc((100%-88rem)/2+2rem))]";

/**
 * Where each card stops along the row, from 0 to 1. A card stops where its left edge meets the
 * gutter. One that cannot get that far (the row runs out first) stops where its right edge meets
 * the far gutter instead, so it ends fully in view. Stops always rise, and the last one is 1.
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
 * The top of the home page: the projects as a row of framed cards (desktop screens with the
 * phone in the corner) that moves on to the next card every 6s and loops. The gold fill in the
 * current ruler slot is the clock: its animationend advances the row (see .timer in globals.css),
 * so pausing the fill pauses the row. Hover, keyboard focus, the pause button, or the row being
 * off screen hold it; reduced motion turns the clock, and so the autoplay, off. Swipes and the
 * ruler's slots move it by hand.
 */
export function ProjectCarousel({ slides }: { slides: CarouselSlide[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stops = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  // Bumped on every tick so the clock restarts even when the row could not move.
  const [tick, setTick] = useState(0);
  const [held, setHeld] = useState(false);
  const [stopped, setStopped] = useState(false);
  const inView = useInView(section, { amount: 0.4 });
  const reduce = useReducedMotion();
  const { scrollXProgress } = useScroll({ container: track });

  useEffect(() => {
    const strip = track.current;
    if (!strip) return;
    const measure = () => {
      const items = [...strip.children] as HTMLElement[];
      const lead = parseFloat(getComputedStyle(strip).paddingLeft);
      const max = strip.scrollWidth - strip.clientWidth;
      const edges = items.map((el) => ({ left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth }));
      stops.current = placeItems(edges, lead, strip.clientWidth, max);
      // A card that cannot reach the start snaps by its end, which is exactly where its stop puts it.
      for (const el of items) el.style.scrollSnapAlign = el.offsetLeft - lead > max ? "end" : "";
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);

  // The card nearest the scroll position is the current one, however the row got there.
  useMotionValueEvent(scrollXProgress, "change", (p) => {
    const at = stops.current;
    let nearest = 0;
    for (let i = 1; i < at.length; i++) if (Math.abs(at[i] - p) < Math.abs(at[nearest] - p)) nearest = i;
    setActive(nearest);
  });

  function go(i: number) {
    const strip = track.current;
    const p = stops.current[i];
    if (!strip || p === undefined) return;
    strip.scrollTo({ left: p * (strip.scrollWidth - strip.clientWidth), behavior: reduce ? "instant" : "smooth" });
  }

  function advance() {
    setTick((t) => t + 1);
    go((active + 1) % slides.length);
  }

  const paused = held || stopped || !inView;

  return (
    <section
      ref={section}
      aria-roledescription="carousel"
      aria-label="Projects"
      className="pt-8 md:pt-10"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      // Keyboard focus holds the row; a mouse click inside it should not.
      onFocus={(event) => event.target.matches(":focus-visible") && setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="mx-auto flex w-full max-w-page items-center justify-center gap-3 px-4 sm:px-6 lg:px-8">
        <div role="group" aria-label="Choose a project" className="flex items-center" style={{ gap: GAP }}>
          {slides.map((slide, i) => (
            <span key={slide.slug} className="flex items-center" style={{ gap: GAP }}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${slide.name}`}
                aria-current={i === active}
                className="relative h-[18px] overflow-hidden rounded-[3px] border border-muted transition-colors hover:border-ink"
                style={{ width: SLOT }}
              >
                {i === active && (
                  <span
                    key={tick}
                    aria-hidden
                    className="timer absolute inset-0 origin-left bg-star forced-colors:bg-[Highlight]"
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={advance}
                  />
                )}
              </button>
              {i < slides.length - 1 &&
                Array.from({ length: TICKS }, (_, t) => <span key={t} aria-hidden className="h-[18px] w-px bg-muted/50" />)}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStopped(!stopped)}
          aria-label={stopped ? "Play the project carousel" : "Pause the project carousel"}
          className="rounded-full p-1.5 text-muted transition-colors hover:text-ink motion-reduce:hidden"
        >
          {stopped ? <PlayIcon className="size-3.5" aria-hidden /> : <PauseIcon className="size-3.5" aria-hidden />}
        </button>
      </div>

      <div
        ref={track}
        className={`relative mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${GUTTER}`}
      >
        {slides.map((slide, i) => (
          <article
            key={slide.slug}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.name}`}
            // Sized so a whole card (screens, caption, links) fits under the header on a desktop screen.
            className="w-[85vw] shrink-0 snap-start sm:w-[70vw] lg:w-[min(70vw,calc((100dvh-19rem)*1.6))]"
          >
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
                sizes="(min-width: 1024px) min(70vw, calc(160vh - 30.4rem)), (min-width: 640px) 70vw, 85vw"
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
      </div>
    </section>
  );
}
