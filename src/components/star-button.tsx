"use client";

import { SparkleIcon, StarIcon } from "@phosphor-icons/react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";

const MAX = 5;
const KEY = "hoshinfo:stars";

// The visitor's own count, kept in this browser only. Storage can be blocked, so every access is guarded.
const listeners = new Set<() => void>();
let memory: number | null = null;
function readStars() {
  try {
    return Math.min(MAX, Math.max(0, Number(localStorage.getItem(KEY)) || 0));
  } catch {
    return 0;
  }
}
function writeStars(n: number) {
  try {
    localStorage.setItem(KEY, String(n));
  } catch {
    // Not saved; the count still updates for this visit.
  }
  memory = n;
  listeners.forEach((listener) => listener());
}
const snapshot = () => memory ?? readStars();
const subscribe = (listener: () => void) => {
  // Another tab changed the count: drop the cached value and read storage again.
  const fromOtherTab = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    memory = null;
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", fromOtherTab);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", fromOtherTab);
  };
};

/**
 * "Leave a star": each press fills the star a fifth more and throws a few sparkles, up to five.
 * Reduced motion keeps the fill and drops the sparkles and the twitch.
 */
export function StarButton() {
  const stars = useSyncExternalStore(subscribe, snapshot, () => 0);
  const [bursts, setBursts] = useState<number[]>([]);
  // Announced only after a press in this visit, not on every page load.
  const [said, setSaid] = useState("");
  const next = useRef(0);
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();
  const full = stars >= MAX;

  function give() {
    if (full) return;
    writeStars(stars + 1);
    setSaid(`${stars + 1} of ${MAX} stars given`);
    if (reduce || !scope.current) return;
    animate(scope.current, { scale: [1, 1.3, 1], rotate: [0, -14, 0] }, { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] });
    const id = next.current++;
    setBursts((list) => [...list, id]);
    setTimeout(() => setBursts((list) => list.filter((b) => b !== id)), 700);
  }

  return (
    <div>
      <button
        type="button"
        onClick={give}
        aria-disabled={full}
        aria-label={full ? `Thanks, ${MAX} of ${MAX} stars given` : `Leave a star, ${stars} of ${MAX} given`}
        className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-3 pr-4 text-sm font-medium transition hover:border-muted active:translate-y-px aria-disabled:cursor-default aria-disabled:hover:border-line"
      >
        <span ref={scope} className="relative grid size-6 place-items-center">
          <StarIcon className="col-start-1 row-start-1 size-6 text-muted" aria-hidden />
          <motion.span
            className="col-start-1 row-start-1"
            initial={false}
            animate={{ clipPath: `inset(${100 - (stars / MAX) * 100}% 0 0 0)` }}
            transition={{ type: "spring", bounce: 0, visualDuration: 0.4 }}
          >
            <StarIcon weight="fill" className="size-6 text-star" aria-hidden />
          </motion.span>
          {bursts.map((id) => (
            <Burst key={id} turn={id} />
          ))}
        </span>
        <span aria-hidden>{full ? "Thanks for the stars" : "Leave a star"}</span>
        <span aria-hidden className="font-mono text-xs text-muted">
          {stars}/{MAX}
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {said}
      </span>
    </div>
  );
}

/** Six sparkles flying out from the star; `turn` rotates the pattern so bursts differ. */
function Burst({ turn }: { turn: number }) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((i * 60 + turn * 23) * Math.PI) / 180;
    return (
      <motion.span
        key={i}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 text-star"
        initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
        animate={{ x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, opacity: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SparkleIcon weight="fill" className="size-3" />
      </motion.span>
    );
  });
}
