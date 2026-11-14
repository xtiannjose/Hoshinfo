"use client";

import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";

import { Gallery } from "@/components/gallery";
import { TierLink } from "@/components/tier-link";
import type { Shot } from "@/content/projects";

export type CarouselSlide = {
  slug: string;
  name: string;
  tagline: string;
  live?: string;
  code: string;
  shots: Shot[];
};

// Ruler geometry, in px: a 30px slot per card, then 4 one-pixel ticks, all 9px apart.
const SLOT = 30;
const GAP = 9;
const TICKS = 4;
// A mouse drag shorter than this is a click; one longer than DRAG_ON leans to the next card.
const DRAG_CLICK = 5;
const DRAG_ON = 60;
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
 * phone in the corner) that moves on to the next card every 10s and loops forward for ever: a
 * hidden second copy of the cards follows the real ones, and once the row comes to rest inside the
 * copy it jumps back one lap, to the same picture. The gold fill in the
 * current ruler slot is the clock: its animationend advances the row (see .timer in globals.css),
 * so pausing the fill pauses the row. It keeps moving; it only holds while a keyboard user is
 * inside it or while it is off screen, and reduced motion turns the clock, and so the autoplay,
 * off. Swipes, mouse drags and the ruler's slots move it by hand.
 */
export function ProjectCarousel({ heading, slides }: { heading: ReactNode; slides: CarouselSlide[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stops = useRef<number[]>([]);
  // Distance from a card to its copy; the row jumps back by this much once it rests on a copy.
  const lap = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const n = slides.length;
  const [active, setActive] = useState(0);
  // Bumped on every tick so the clock restarts even when the row could not move.
  const [tick, setTick] = useState(0);
  const [held, setHeld] = useState(false);
  // A mouse drag in progress: where it started, and whether it has moved far enough to count.
  const drag = useRef<{ x: number; left: number; from: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
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
      lap.current = items[n] ? items[n].offsetLeft - items[0].offsetLeft : 0;
      // A card that cannot reach the start snaps by its end, which is exactly where its stop puts it.
      for (const el of items) el.style.scrollSnapAlign = el.offsetLeft - lead > max ? "end" : "";
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => {
      observer.disconnect();
      clearTimeout(settle.current);
    };
  }, [n]);

  // The card nearest the scroll position is the current one, however the row got there. When the row
  // comes to rest on a copy, it jumps back one lap: same picture, now on the real cards.
  useMotionValueEvent(scrollXProgress, "change", (p) => {
    setActive(nearestTo(p) % n);
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const strip = track.current;
      if (strip && !drag.current?.moved && lap.current && strip.scrollLeft >= lap.current - 1) strip.scrollLeft -= lap.current;
    }, 150);
  });

  function nearestTo(p: number) {
    const at = stops.current;
    let nearest = 0;
    for (let i = 1; i < at.length; i++) if (Math.abs(at[i] - p) < Math.abs(at[nearest] - p)) nearest = i;
    return nearest;
  }

  function go(i: number) {
    const strip = track.current;
    const p = stops.current[i];
    if (!strip || p === undefined) return;
    strip.scrollTo({ left: p * (strip.scrollWidth - strip.clientWidth), behavior: reduce ? "instant" : "smooth" });
  }

  /** Show a project from the ruler, always moving forward (to its copy if it is behind). */
  function show(real: number) {
    const at = nearestTo(scrollXProgress.get());
    const base = at >= n ? n : 0;
    go(Math.min(2 * n - 1, base + real + (real < at % n ? n : 0)));
  }

  function advance() {
    setTick((t) => t + 1);
    const p = scrollXProgress.get();
    const next = stops.current.findIndex((stop) => stop > p + 0.01);
    go(next === -1 ? 0 : next);
  }

  // Mouse drag: the row follows the pointer with snapping off, then settles on a card. Touch
  // already scrolls the row natively, so only the mouse is handled here.
  function dragStart(event: PointerEvent<HTMLDivElement>) {
    const strip = track.current;
    if (!strip || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, left: strip.scrollLeft, from: nearestTo(scrollXProgress.get()), moved: false };
  }

  function dragMove(event: PointerEvent<HTMLDivElement>) {
    const strip = track.current;
    const d = drag.current;
    if (!strip || !d) return;
    // The button came up somewhere we never heard about (released off the row before the drag began).
    if (!(event.buttons & 1)) return dragEnd(event);
    if (!d.moved) {
      if (Math.abs(event.clientX - d.x) < DRAG_CLICK) return;
      d.moved = true;
      strip.setPointerCapture(event.pointerId);
      strip.style.scrollSnapType = "none";
      // Start from where the row is now: an autoplay glide may have moved it since the press.
      d.x = event.clientX;
      d.left = strip.scrollLeft;
      setDragging(true);
    }
    strip.scrollLeft = d.left - (event.clientX - d.x);
  }

  function dragEnd(event: PointerEvent<HTMLDivElement>) {
    const strip = track.current;
    const d = drag.current;
    drag.current = null;
    if (!strip || !d?.moved) return;
    setDragging(false);
    const max = strip.scrollWidth - strip.clientWidth;
    let target = nearestTo(max > 0 ? strip.scrollLeft / max : 0);
    // A firm drag that would land back on the same card moves one card that way instead.
    const dx = event.clientX - d.x;
    if (target === d.from && Math.abs(dx) > DRAG_ON) target = Math.min(2 * n - 1, Math.max(0, d.from + (dx < 0 ? 1 : -1)));
    go(target);
    // Snapping back on only after the glide has started, so the row does not jump to a snap point first.
    strip.style.scrollSnapType = "";
  }

  const paused = held || dragging || !inView;

  return (
    <section
      ref={section}
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="pt-8 md:pt-10"
      // Keyboard focus holds the row so it does not slide away from the focused link; a mouse click does not.
      onFocus={(event) => event.target.matches(":focus-visible") && setHeld(true)}
      // Only when focus leaves the carousel altogether.
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
      // Any touch or click starts the 10s count over, so a card does not slide away mid-tap.
      onPointerDownCapture={() => setTick((t) => t + 1)}
    >
      {/* The page title on the left, the ruler on the right; on a phone the ruler drops under the title. */}
      <div className="mx-auto flex w-full max-w-page flex-wrap items-end justify-between gap-x-6 gap-y-5 px-4 sm:px-6 lg:px-8">
        {heading}
        <div role="group" aria-label="Choose a project" className="flex items-start" style={{ gap: GAP }}>
          {slides.map((slide, i) => (
            <span key={slide.slug} className="flex items-start" style={{ gap: GAP }}>
              <button
                type="button"
                onClick={() => show(i)}
                aria-current={i === active}
                className="group flex flex-col items-center gap-1.5 text-xs"
              >
                <span
                  className="relative h-[18px] overflow-hidden rounded-[3px] border border-muted transition-colors group-hover:border-ink group-aria-[current=true]:border-2 group-aria-[current=true]:border-star-ink"
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
                </span>
                <span className="text-muted transition-colors group-hover:text-ink group-aria-[current=true]:font-medium group-aria-[current=true]:text-ink">
                  {slide.name}
                </span>
              </button>
              {i < slides.length - 1 &&
                Array.from({ length: TICKS }, (_, t) => <span key={t} aria-hidden className="h-[18px] w-px bg-muted/50" />)}
            </span>
          ))}
        </div>
      </div>

      <div
        ref={track}
        onPointerDown={dragStart}
        onPointerMove={dragMove}
        onPointerUp={dragEnd}
        onPointerCancel={dragEnd}
        // A drag is not a click: swallow the click that ends one, and stop the browser dragging images and links.
        onClickCapture={(event) => {
          if (!dragging && !drag.current?.moved) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onDragStart={(event) => event.preventDefault()}
        className={`relative mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        } ${GUTTER}`}
      >
        {[...slides, ...slides].map((slide, i) => (
          <article
            key={`${slide.slug}-${i < n ? "card" : "copy"}`}
            {...(i < n
              ? {
                  onFocus: (event: FocusEvent) => event.target.matches(":focus-visible") && go(i),
                  "aria-roledescription": "slide",
                  "aria-label": `${i + 1} of ${n}: ${slide.name}`,
                }
              : // The copy is only there for the loop: not read out, not focusable, not clickable.
                { "aria-hidden": true, inert: true })}
            // Sized so a whole card (screens, caption, links) fits under the header on a desktop screen.
            className="w-[85vw] shrink-0 snap-start sm:w-[70vw] lg:w-[min(70vw,calc((100dvh-22rem)*1.6))]"
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
                sizes="(min-width: 1024px) min(70vw, calc(160vh - 35.2rem)), (min-width: 640px) 70vw, 85vw"
                phones
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
