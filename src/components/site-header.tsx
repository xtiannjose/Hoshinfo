import { GithubLogoIcon, StarIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { Boop } from "@/components/boop";
import { SectionNav } from "@/components/section-nav";
import { site } from "@/content/site";

// Layers: the header is z-20, sticky section labels z-10 under it, the cursor glow -z-10 under everything.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Boop rotate={24} scale={1.18} fromParent>
            <StarIcon weight="fill" className="size-5 text-star" aria-hidden />
          </Boop>
          {site.brand}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          <SectionNav />
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="ml-1 rounded-full p-2 text-muted hover:text-ink"
            aria-label="GitHub"
          >
            <Boop rotate={-10} scale={1.1} fromParent>
              <GithubLogoIcon className="size-5" aria-hidden />
            </Boop>
          </a>
        </nav>
      </div>
    </header>
  );
}
