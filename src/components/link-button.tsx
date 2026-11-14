import Link from "next/link";
import type { ReactNode } from "react";

// Shape rule for the whole site: things you press are pills, pictures and panels are 12px.
const base = "nudge inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium";
const look = {
  // A pushable pill: the face sits 2px above a gold edge, lifts on hover and drops on press.
  primary:
    "bg-ink text-bg -translate-y-0.5 transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover/button:-translate-y-1 group-active/button:translate-y-0 group-active/button:duration-75 motion-reduce:transition-none",
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
  const props = {
    href,
    ...(external ? { target: "_blank", rel: "noreferrer" } : {}),
    "data-out": external || undefined,
  };
  if (variant === "primary") {
    return (
      <Link {...props} className="group/button inline-flex rounded-full bg-star-ink">
        <span className={`${base} ${look.primary}`}>{children}</span>
      </Link>
    );
  }
  return (
    <Link {...props} className={`${base} ${look.secondary}`}>
      {children}
    </Link>
  );
}

export function StackList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}
