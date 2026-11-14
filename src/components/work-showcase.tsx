"use client";

import { LockSimpleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";

import { Gallery } from "@/components/gallery";
import { useMediaQuery } from "@/components/use-media-query";
import { StackList } from "@/components/link-button";
import type { WorkItem } from "@/content/projects";

/**
 * Company work as a list with one large preview. On extra-wide screens (it sits in the
 * band's right column), pointing at or choosing an item swaps the preview beside the list;
 * narrower, each item shows its own preview inline.
 */
export function WorkShowcase({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState(0);
  // The side-by-side preview only exists from xl; below that, choosing an item would change nothing.
  const wide = useMediaQuery("(min-width: 80rem)");

  return (
    <div className="mt-8 grid gap-10 xl:grid-cols-[2fr_3fr] xl:gap-10">
      <div className="divide-y divide-line border-t border-line">
        {items.map((item, i) => (
          <article key={item.name} onPointerEnter={() => setActive(i)} className="relative py-8 xl:pl-6">
            {i === active && (
              <motion.span
                layoutId="work-marker"
                className="absolute inset-y-8 left-0 hidden w-0.5 rounded-full bg-star xl:block"
                transition={{ type: "spring", bounce: 0, visualDuration: 0.35 }}
              />
            )}
            <h4 className="text-xl font-semibold tracking-tight">
              {wide ? (
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`text-left text-xl font-semibold tracking-tight transition-colors xl:cursor-pointer ${
                    i === active ? "text-ink" : "text-ink xl:text-muted xl:hover:text-ink"
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                item.name
              )}
            </h4>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{item.summary}</p>
            <div className="mt-5">
              <StackList items={item.stack} />
            </div>
            <div className="mt-8 xl:hidden">
              <Preview item={item} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden xl:block">
        <div className="sticky top-24 grid">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              className={`[grid-area:1/1] ${i === active ? "" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              inert={i !== active}
            >
              <Preview item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Preview({ item }: { item: WorkItem }) {
  if (item.shots.length > 0) {
    return <Gallery shots={item.shots} label={item.name} sizes="(min-width: 1024px) 780px, 100vw" />;
  }
  return (
    <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface p-6 text-center">
      <LockSimpleIcon className="size-6 text-star" aria-hidden />
      <p className="max-w-[32ch] text-sm text-muted">Screens from this one stay with the company.</p>
    </div>
  );
}
