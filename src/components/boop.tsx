"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

// One ease-out tween for every boop on the site, no overshoot, so they read as one system with the rest of the motion.
const tween = { duration: 0.18, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * A quick twitch when the pointer arrives, then back to rest after `hold` ms.
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
    animate(scope.current, { rotate, scale, x, y }, tween);
    setTimeout(() => scope.current && animate(scope.current, { rotate: 0, scale: 1, x: 0, y: 0 }, tween), hold);
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
