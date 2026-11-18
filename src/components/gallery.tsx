"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState, type PointerEvent } from "react";

import { PhoneInset, Shot } from "@/components/shot";
import type { Shot as ShotData } from "@/content";

/**
 * A stack of screenshots. With a mouse, moving across the picture flips through them;
 * the segment buttons below do the same for touch and keyboard. The caption follows.
 */
export function Gallery({
  shots,
  label,
  sizes,
  href,
  bare = false,
  preload = false,
  phones = false,
  shotClass,
}: {
  shots: ShotData[];
  /** Names the group of buttons and, with `href`, the link. */
  label: string;
  sizes: string;
  href?: string;
  /** Mounted inside a frame: no lift, inset controls, smaller caption. */
  bare?: boolean;
  /** Load the first shot early (it is the largest thing on screen). */
  preload?: boolean;
  /** Show each screen's phone version in its corner; it changes with the screen and hides when there is none. */
  phones?: boolean;
  /** Extra classes for each screenshot, such as a height cap that crops it. */
  shotClass?: string;
}) {
  const [index, setIndex] = useState(0);
  // The other shots load once someone shows interest, not with the page.
  const [warm, setWarm] = useState(false);

  function scrub(event: PointerEvent<HTMLElement>) {
    // Mouse hover only; with a button held the pointer is dragging something (the carousel row).
    if (event.pointerType !== "mouse" || event.buttons !== 0) return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const next = Math.floor(((event.clientX - left) / width) * shots.length);
    setIndex(Math.min(shots.length - 1, Math.max(0, next)));
  }

  const stack = shots.map(
    (shot, i) =>
      (warm || i === index) && (
        <motion.div
          key={shot.src}
          className="relative [grid-area:1/1]"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-hidden={i !== index}
        >
          <Shot shot={shot} sizes={sizes} bare={bare} preload={preload && i === 0} className={shotClass} />
          {phones && shot.phone && <PhoneInset shot={shot.phone} />}
        </motion.div>
      ),
  );

  const frame = bare
    ? "relative grid"
    : "relative grid transition duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none";
  const controls = bare ? "mt-1 px-3" : "mt-3";
  const gap = shots.length > 1 ? (bare ? "" : "mt-1") : bare ? "mt-2" : "mt-3";

  return (
    // Warm on real pointer movement: a pinned rail sliding under a still cursor fires pointerenter too.
    <figure onPointerMove={() => setWarm(true)} onFocus={() => setWarm(true)}>
      {href ? (
        <Link href={href} aria-label={label} onPointerMove={scrub} className={frame}>
          {stack}
        </Link>
      ) : (
        <div onPointerMove={scrub} className={frame}>
          {stack}
        </div>
      )}
      {shots.length > 1 && (
        <div role="group" aria-label={`${label}: screenshots`} className={`flex gap-1.5 ${controls}`}>
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={shot.alt}
              aria-pressed={i === index}
              className="group flex-1 py-3"
            >
              {/* 3:1 against the page in both schemes; the current one is also thicker, not only gold. */}
              <span
                className={`block rounded-full transition-colors ${
                  i === index ? "h-1 bg-star-ink" : "h-0.5 bg-muted/70 group-hover:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      )}
      <figcaption
        className={`text-muted ${bare ? "px-3 pb-1 text-[13px]" : "text-sm"} ${gap}`}
      >
        {shots[index].caption}
      </figcaption>
    </figure>
  );
}
