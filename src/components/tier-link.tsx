import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";

/** One button of the action row under a framed card (8px corners inside the frame's 12px). */
export function TierLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon;
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-line/50 text-sm font-medium transition-colors hover:bg-line focus-visible:bg-line"
    >
      {children}
      <Arrow
        className={`size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1"
        }`}
        aria-hidden
      />
    </Link>
  );
}
