import Link from "next/link";
import type { ReactNode } from "react";

// Shape rule for the whole site: things you press are pills, pictures and panels are 12px.
const look = {
  primary: "bg-ink text-bg hover:opacity-90",
  secondary: "border border-line text-ink hover:border-muted",
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
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition active:translate-y-px ${look[variant]}`}
    >
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
