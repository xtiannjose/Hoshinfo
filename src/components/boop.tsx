"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

// One spring for every boop on the site, so they read as one system.
const spring = { type: "spring", stiffness: 300, damping: 10 } as const;

/**
 * A quick springy twitch when the pointer arrives, then back to rest after `hold` ms.
 * Taps trigger it on touch. Does nothing for people who ask for reduced motion.
 */
export function Boop({
  children,
  rotate = 0,
  scale = 1,
  x = 0,
  y = 0,
  hold = 150,
  fromParent = false,
}: {
  children: ReactNode;
  rotate?: number;
  scale?: number;
  x?: number;
  y?: number;
  hold?: number;
  /** Fire when the pointer enters the parent (say, a whole link), not just this element. */
  fromParent?: boolean;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reduce = useReducedMotion();

  function boop() {
    if (reduce || !scope.current) return;
    animate(scope.current, { rotate, scale, x, y }, spring);
    setTimeout(() => scope.current && animate(scope.current, { rotate: 0, scale: 1, x: 0, y: 0 }, spring), hold);
  }
  // The listener on the parent always calls the latest boop.
  const latest = useRef(boop);
  useEffect(() => {
    latest.current = boop;
  });

  useEffect(() => {
    const parent = fromParent ? scope.current?.parentElement : null;
    if (!parent) return;
    const enter = (event: PointerEvent) => event.pointerType === "mouse" && latest.current();
    parent.addEventListener("pointerenter", enter);
    return () => parent.removeEventListener("pointerenter", enter);
  }, [fromParent, scope]);

  return (
    <span
      ref={scope}
      className="inline-flex"
      onPointerEnter={(event) => !fromParent && event.pointerType === "mouse" && boop()}
      onPointerDown={(event) => event.pointerType !== "mouse" && boop()}
    >
      {children}
    </span>
  );
}
