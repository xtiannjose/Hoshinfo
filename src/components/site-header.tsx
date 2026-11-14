import { StarIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { Boop } from "@/components/boop";
import { SectionNav } from "@/components/section-nav";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/content/site";

// Layers: the header is z-20, the cursor glow -z-10 under everything.
// Three columns with the nav centred between the brand and the profile links.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 w-full max-w-page grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 justify-self-start font-semibold tracking-tight">
          <Boop rotate={24} scale={1.18} fromParent>
            <StarIcon weight="fill" className="size-5 text-star" aria-hidden />
          </Boop>
          {/* On a phone only the star shows, so the nav fits on one line. */}
          <span className="sr-only sm:not-sr-only">{site.brand}</span>
        </Link>
        <nav aria-label="Main" className="flex items-center text-sm">
          <SectionNav />
        </nav>
        <div className="hidden justify-self-end sm:block">
          <SocialLinks size="sm" />
        </div>
      </div>
    </header>
  );
}
