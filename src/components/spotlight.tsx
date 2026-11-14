"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect } from "react";

import { useMediaQuery } from "@/components/use-media-query";

/**
 * A faint gold glow that follows the mouse, painted behind the page content.
 * Desktop mouse only; nothing for touch or for people who ask for reduced motion.
 */
export function Spotlight() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const background = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, color-mix(in oklab, var(--star) 7%, transparent), transparent 80%)`;

  const on = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)");

  useEffect(() => {
    if (!on) return;
    const follow = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", follow, { passive: true });
    return () => {
      window.removeEventListener("pointermove", follow);
      // Turned off (window narrowed, reduced motion switched on): park the glow off-screen.
      x.set(-1000);
      y.set(-1000);
    };
  }, [on, x, y]);

  // Fixed and -z-10: stays under the cursor while scrolling, and under the text.
  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background }} />;
}
