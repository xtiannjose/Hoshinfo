import { ArrowDownIcon } from "@phosphor-icons/react/ssr";

import type { Tier } from "@/content";

/**
 * A case study's "How it fits together", written for readers who do not program: numbered tiers from
 * top to bottom (who uses it, the website, what it relies on), joined by arrows. Each box says what a
 * part does in plain words, with its technical name small underneath for technical readers. Plain
 * boxes and text, so it follows Day and Night and reads as a list.
 */
export function Architecture({ tiers }: { tiers: Tier[] }) {
  return (
    <ol className="mt-8 max-w-5xl">
      {tiers.map((tier, i) => (
        <li key={tier.label}>
          {i > 0 && <ArrowDownIcon className="mx-auto my-3 size-5 text-muted" aria-hidden />}
          <section
            aria-label={tier.label}
            className={`rounded-2xl border p-4 sm:p-5 ${tier.highlight ? "border-star bg-star-soft" : "border-line"}`}
          >
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <span
                aria-hidden
                className="grid size-6 place-items-center rounded-full border border-line bg-surface font-mono text-xs text-muted"
              >
                {i + 1}
              </span>
              {tier.label}
            </h3>
            <ul className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-3">
              {tier.nodes.map((node) => (
                <li key={node.name} className="rounded-xl border border-line bg-surface p-4">
                  <p className="font-medium">{node.name}</p>
                  {node.detail && <p className="mt-1 text-sm leading-relaxed text-muted">{node.detail}</p>}
                  {node.tech && (
                    <p className="mt-3 inline-block rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
                      <span className="sr-only">Built with </span>
                      {node.tech}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </li>
      ))}
    </ol>
  );
}
