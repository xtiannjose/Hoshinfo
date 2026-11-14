import { GithubLogoIcon, StarIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="mx-auto flex h-16 w-full max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <StarIcon weight="fill" className="size-5 text-star" aria-hidden />
        {site.brand}
      </Link>
      <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-2">
        <Link href="/#projects" className="rounded-full px-3 py-2 text-muted hover:text-ink">
          Projects
        </Link>
        <Link href="/#work" className="rounded-full px-3 py-2 text-muted hover:text-ink">
          Work
        </Link>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-full p-2 text-muted hover:text-ink"
          aria-label="GitHub"
        >
          <GithubLogoIcon className="size-5" aria-hidden />
        </a>
      </nav>
    </header>
  );
}
