"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Site-wide: Motion skips transform and layout animation for people who ask for reduced motion. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
