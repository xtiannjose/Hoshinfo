"use client";

import { LockSimpleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useState } from "react";

import { Gallery } from "@/components/gallery";
import { StackList } from "@/components/link-button";
import type { WorkItem } from "@/content/projects";

/**
 * Company work as a list with one large preview. On wide screens, pointing at or
 * choosing an item swaps the preview beside the list; on narrow ones each item
 * shows its own preview inline.
 */
export function WorkShowcase({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
      <div className="divide-y divide-line border-t border-line">
        {items.map((item, i) => (
          <article key={item.name} onPointerEnter={() => setActive(i)} className="relative py-8 lg:pl-6">
            {i === active && (
              <motion.span
                layoutId="work-marker"
                className="absolute inset-y-8 left-0 hidden w-0.5 rounded-full bg-star lg:block"
                transition={{ type: "spring", bounce: 0, visualDuration: 0.35 }}
              />
            )}
            <h3>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`text-left text-xl font-semibold tracking-tight transition-colors lg:cursor-pointer ${
                  i === active ? "text-ink" : "text-ink lg:text-muted lg:hover:text-ink"
                }`}
              >
                {item.name}
              </button>
            </h3>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{item.summary}</p>
            <div className="mt-5">
              <StackList items={item.stack} />
            </div>
            <div className="mt-8 lg:hidden">
              <Preview item={item} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-8 grid">
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
      <p className="max-w-[32ch] text-sm text-muted">An internal tool, so its screens stay with the company.</p>
    </div>
  );
}
