import Link from "next/link";
import type { ReactNode } from "react";

// Shape rule for the whole site: things you press are pills, pictures and panels are 12px.
const base = "nudge inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium";
const look = {
  // A pushable pill: the face sits 2px above a gold edge, lifts on hover and drops on press.
  primary:
    "bg-ink text-bg -translate-y-0.5 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:-translate-y-1 group-active/button:translate-y-0 group-active/button:duration-75 motion-reduce:transition-none",
  secondary: "border border-line text-ink transition hover:border-muted active:translate-y-px",
};

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof look;
}) {
  const external = href.startsWith("http");
  // Email links are plain anchors: the router has no page to fetch for them.
  const Anchor = href.startsWith("mailto:") ? "a" : Link;
  const props = {
    href,
    ...(external ? { target: "_blank", rel: "noreferrer" } : {}),
    "data-out": external || undefined,
  };
  if (variant === "primary") {
    return (
      <Anchor {...props} className="group/button inline-flex rounded-full bg-star-ink">
        <span className={`${base} ${look.primary}`}>{children}</span>
      </Anchor>
    );
  }
  return (
    <Anchor {...props} className={`${base} ${look.secondary}`}>
      {children}
    </Anchor>
  );
}

/** The tools behind a project or role: one quiet line of meta, not a row of tags. */
export function StackList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs leading-5 text-muted" aria-label="Built with">
      {/* Each dot belongs to the item before it, so a wrapped line never starts with one. */}
      {items.map((item, i) => (
        <li key={item}>
          {item}
          {i < items.length - 1 && <span aria-hidden>&nbsp;·</span>}
        </li>
      ))}
    </ul>
  );
}
