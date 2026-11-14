"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState, type PointerEvent } from "react";

import { Shot } from "@/components/shot";
import type { Shot as ShotData } from "@/content/projects";

/**
 * A stack of screenshots. With a mouse, moving across the picture flips through them;
 * the segment buttons below do the same for touch and keyboard. The caption follows.
 */
export function Gallery({
  shots,
  label,
  sizes,
  href,
}: {
  shots: ShotData[];
  /** Names the group of buttons and, with `href`, the link. */
  label: string;
  sizes: string;
  href?: string;
}) {
  const [index, setIndex] = useState(0);
  // The other shots load once someone shows interest, not with the page.
  const [warm, setWarm] = useState(false);

  function scrub(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const next = Math.floor(((event.clientX - left) / width) * shots.length);
    setIndex(Math.min(shots.length - 1, Math.max(0, next)));
  }

  const stack = shots.map(
    (shot, i) =>
      (warm || i === index) && (
        <motion.div
          key={shot.src}
          className="[grid-area:1/1]"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-hidden={i !== index}
        >
          <Shot shot={shot} sizes={sizes} />
        </motion.div>
      ),
  );

  const frame = "grid transition duration-300 ease-out hover:-translate-y-1";

  return (
    <figure onPointerEnter={() => setWarm(true)} onFocus={() => setWarm(true)}>
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
        <div role="group" aria-label={`${label}: screenshots`} className="mt-3 flex gap-1.5">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={shot.alt}
              aria-pressed={i === index}
              className="group flex-1 py-3"
            >
              <span
                className={`block h-0.5 rounded-full transition-colors ${
                  i === index ? "bg-star" : "bg-line group-hover:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      )}
      <figcaption className={`text-sm text-muted ${shots.length > 1 ? "mt-1" : "mt-3"}`}>{shots[index].caption}</figcaption>
    </figure>
  );
}
