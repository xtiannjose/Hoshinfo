import { GithubLogoIcon } from "@phosphor-icons/react/ssr";

import { Boop } from "@/components/boop";
import { StarButton } from "@/components/star-button";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-32 w-full max-w-page px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 border-t border-line py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Thanks for stopping by.</p>
          <p className="mt-1 text-sm text-muted">If something here was worth a look, leave a star.</p>
        </div>
        <StarButton />
      </div>
      <div className="flex flex-col gap-2 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name}, {site.role.toLowerCase()}.
        </p>
        <p className="flex items-center gap-2">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-ink"
          >
            <Boop rotate={-10} scale={1.1} fromParent>
              <GithubLogoIcon className="size-4" aria-hidden />
            </Boop>
            GitHub
          </a>
          <span aria-hidden>/</span>
          Built with Next.js, hosted on Vercel.
        </p>
      </div>
    </footer>
  );
}
