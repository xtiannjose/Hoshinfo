"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { MotionConfig, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useState, type PointerEvent } from "react";

import { Shot } from "@/components/shot";
import type { Project } from "@/content/projects";

type Slide = Pick<Project, "slug" | "name" | "label" | "cover" | "phone">;

const lean = { stiffness: 150, damping: 20 };

/**
 * The hero's slideshow: each project's desktop and phone screens, moving on every 6s.
 * The timer bar under the active tab drives the change (see .timer in globals.css), so
 * pausing the bar pauses the show. Hover, focus or the pause button stop it; reduced
 * motion turns the timer, and so the autoplay, off.
 */
export function HeroShowcase({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduce = useReducedMotion();

  // Pointer position over the stage, -0.5 to 0.5 each way, turned into a slight lean.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), lean);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), lean);

  function follow(event: PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - left) / width - 0.5);
    y.set((event.clientY - top) / height - 0.5);
  }

  function leave() {
    x.set(0);
    y.set(0);
    setHeld(false);
  }

  const next = () => setActive((active + 1) % slides.length);

  return (
    <MotionConfig reducedMotion="user">
      {/* Keyboard focus holds the show; a mouse click on a tab should not. */}
      <div onFocus={(event) => event.target.matches(":focus-visible") && setHeld(true)} onBlur={() => setHeld(false)}>
        <div
          className="[perspective:1400px]"
          onPointerEnter={() => setHeld(true)}
          onPointerMove={follow}
          onPointerLeave={leave}
        >
          <motion.div className="grid" style={{ rotateX, rotateY }}>
            {slides.map((slide, i) => (
              <motion.div
                key={slide.slug}
                className={`relative pb-10 [grid-area:1/1] lg:pb-14 ${i === active ? "" : "pointer-events-none"}`}
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                inert={i !== active}
              >
                <Link href={`/projects/${slide.slug}`} aria-label={`${slide.name} case study`} className="block">
                  <Shot shot={slide.cover} sizes="(min-width: 1024px) 760px, 100vw" preload={i === 0} />
                </Link>
                <motion.div
                  className="absolute -bottom-2 right-4 w-[22%] max-w-40 sm:right-8"
                  initial={false}
                  animate={{ y: i === active ? 0 : 40 }}
                  transition={{ type: "spring", bounce: 0, visualDuration: 0.8, delay: i === active ? 0.12 : 0 }}
                >
                  <Shot shot={slide.phone} sizes="160px" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 flex items-start gap-4">
          <div className="grid flex-1 grid-cols-3 gap-4">
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                aria-label={`Show ${slide.name}, ${slide.label}`}
                className="group text-left"
              >
                <span className="block h-0.5 overflow-hidden rounded-full bg-line">
                  {i === active && (
                    <span
                      className="timer block h-full origin-left bg-star"
                      style={{ animationPlayState: held || stopped ? "paused" : "running" }}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
                <span
                  className={`mt-3 block text-sm font-medium transition-colors ${
                    i === active ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {slide.name}
                </span>
                <span className="block text-xs text-muted">{slide.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStopped(!stopped)}
            aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
            className="rounded-full border border-line p-2 text-muted transition hover:border-muted hover:text-ink motion-reduce:hidden"
          >
            {stopped ? <PlayIcon className="size-4" aria-hidden /> : <PauseIcon className="size-4" aria-hidden />}
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}
