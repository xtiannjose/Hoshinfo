"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";

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

/**
 * The top of the home page: the projects as a row of framed cards (desktop screens with the
 * phone in the corner), one project at a time, centred, with nothing peeking in from the sides.
 * It moves on every 10s and loops forward for ever: the row holds a hidden copy of the cards on
 * each side of the real ones, and once it comes to rest on a copy it jumps one lap to the same
 * picture on the real cards. The gold fill in the current ruler slot is the clock: its
 * animationend advances the row (see .timer in globals.css), so pausing the fill pauses the row.
 * It holds only while a keyboard user is inside it, while it is off screen, or during a drag;
 * reduced motion turns the clock off. Swipes, mouse drags, the arrows and the ruler move it by hand.
 */
export function ProjectCarousel({ heading, slides }: { heading: ReactNode; slides: CarouselSlide[] }) {
  const n = slides.length;
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // The scroll position that centres each card (copies included), and the width of one lap.
  const centres = useRef<number[]>([]);
  const lap = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Index into the row (0..3n-1); the real cards are n..2n-1.
  const [current, setCurrent] = useState(n);
  // Bumped on every tick so the clock restarts even when the row could not move.
  const [tick, setTick] = useState(0);
  const [held, setHeld] = useState(false);
  // A mouse drag in progress: where it started, and whether it has moved far enough to count.
  const drag = useRef<{ x: number; left: number; from: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(section, { amount: 0.4 });
  const reduce = useReducedMotion();
  const { scrollX } = useScroll({ container: track });
  const active = current % n;

  // Measure before the first paint, and start centred on the first real card.
  useLayoutEffect(() => {
    const strip = track.current;
    if (!strip) return;
    let placed = false;
    const measure = () => {
      const items = [...strip.children] as HTMLElement[];
      centres.current = items.map((el) => el.offsetLeft + el.offsetWidth / 2 - strip.clientWidth / 2);
      lap.current = items[n].offsetLeft - items[0].offsetLeft;
      if (!placed) {
        strip.scrollLeft = centres.current[n];
        placed = true;
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => {
      observer.disconnect();
      clearTimeout(settle.current);
    };
  }, [n]);

  function nearest(left: number) {
    const at = centres.current;
    let best = 0;
    for (let i = 1; i < at.length; i++) if (Math.abs(at[i] - left) < Math.abs(at[best] - left)) best = i;
    return best;
  }

  // The card nearest the middle is the current one, however the row got there. Once the row rests
  // on a copy, it jumps a lap back onto the real cards: same picture, so nobody sees it.
  useMotionValueEvent(scrollX, "change", (left) => {
    if (!centres.current.length) return;
    setCurrent(nearest(left));
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const strip = track.current;
      if (!strip || drag.current?.moved) return;
      const at = nearest(strip.scrollLeft);
      if (at < n) strip.scrollLeft += lap.current;
      else if (at >= 2 * n) strip.scrollLeft -= lap.current;
    }, 150);
  });

  function go(i: number) {
    const strip = track.current;
    const left = centres.current[Math.max(0, Math.min(3 * n - 1, i))];
    if (!strip || left === undefined) return;
    strip.scrollTo({ left, behavior: reduce ? "instant" : "smooth" });
  }

  /** Show a project from the ruler, always moving forward (to its copy if it is behind). */
  function show(real: number) {
    go(current - active + real + (real < active ? n : 0));
  }

  function advance() {
    setTick((t) => t + 1);
    go(current + 1);
  }

  // Mouse drag: the row follows the pointer with snapping off, then settles on a card. Touch
  // already scrolls the row natively, so only the mouse is handled here.
  function dragStart(event: PointerEvent<HTMLDivElement>) {
    const strip = track.current;
    if (!strip || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, left: strip.scrollLeft, from: nearest(strip.scrollLeft), moved: false };
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
    let target = nearest(strip.scrollLeft);
    // A firm drag that would land back on the same card moves one card that way instead.
    const dx = event.clientX - d.x;
    if (target === d.from && Math.abs(dx) > DRAG_ON) target = d.from + (dx < 0 ? 1 : -1);
    go(target);
    // Snapping back on only after the glide has started, so the row does not jump to a snap point first.
    strip.style.scrollSnapType = "";
  }

  const paused = held || dragging || !inView;
  const arrow =
    "-mt-[7px] grid size-8 place-items-center rounded-full border border-line text-muted transition hover:border-muted hover:text-ink active:translate-y-px";

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
      {/* The page title on the left; arrows and the ruler on the right (under the title on a phone). */}
      <div className="mx-auto flex w-full max-w-page flex-wrap items-end justify-between gap-x-6 gap-y-5 px-4 sm:px-6 lg:px-8">
        {heading}
        <div className="flex items-start gap-3 select-none">
          <button type="button" onClick={() => go(current - 1)} aria-label="Previous project" className={arrow}>
            <CaretLeftIcon className="size-4" aria-hidden />
          </button>
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
                {i < n - 1 &&
                  Array.from({ length: TICKS }, (_, t) => <span key={t} aria-hidden className="h-[18px] w-px bg-muted/50" />)}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => go(current + 1)} aria-label="Next project" className={arrow}>
            <CaretRightIcon className="size-4" aria-hidden />
          </button>
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
        className={`relative mt-6 flex snap-x snap-mandatory overflow-x-auto pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* A copy of the cards, the real cards, then another copy: the copies are only there for the loop. */}
        {[...slides, ...slides, ...slides].map((slide, i) => {
          const real = i >= n && i < 2 * n;
          return (
            <article
              key={`${slide.slug}-${i}`}
              {...(real
                ? {
                    onFocus: (event: FocusEvent) => event.target.matches(":focus-visible") && go(i),
                    "aria-roledescription": "slide",
                    "aria-label": `${(i % n) + 1} of ${n}: ${slide.name}`,
                  }
                : // Not read out, not focusable, not clickable.
                  { "aria-hidden": true, inert: true })}
              // One slide per screen width, so only one project shows. The outgoing card fades as it leaves.
              className={`w-full shrink-0 snap-center transition-opacity duration-500 motion-reduce:transition-none ${
                i === current ? "" : "opacity-40"
              } ${i === n ? "[scroll-initial-target:nearest]" : ""}`}
            >
              {/* The whole card fits on screen under the header. --fit is the height left for the picture (23rem
                  is the header, title row, name row and controls around it). Screens are 16:10, so to stay wide
                  the picture is cropped from the bottom down to --fit, and the card narrows only past 2.4:1, which
                  is also what keeps the phone inset inside the picture. The floors keep a landscape phone readable,
                  where it cannot fit anyway. */}
              <div className="mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[max(32rem,calc(var(--fit)*2.4))] [--fit:max(14rem,calc(100svh-23rem))]">
                  <div className="mb-3 flex items-baseline gap-3">
                    <h2 className="shrink-0 text-lg font-semibold tracking-tight text-ink">{slide.name}</h2>
                    <p className="min-w-0 truncate text-muted">{slide.tagline}</p>
                  </div>
                  {/* Mounted look: a 4px rim and 12px corners around 8px-cornered media. */}
                  <div className="rounded-xl border border-line bg-surface p-1">
                    <Gallery
                      bare
                      preload={i === n}
                      shots={slide.shots}
                      label={`${slide.name} case study`}
                      href={`/projects/${slide.slug}`}
                      sizes="(min-width: 1408px) 1344px, 100vw"
                      phones
                      shotClass="max-h-(--fit) object-cover object-top"
                    />
                    <div className="mt-1 flex gap-1">
                      <TierLink href={`/projects/${slide.slug}`}>Case study</TierLink>
                      {slide.live && <TierLink href={slide.live}>Live site</TierLink>}
                      <TierLink href={slide.code}>Code</TierLink>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
