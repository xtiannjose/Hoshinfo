import { EnvelopeSimpleIcon } from "@phosphor-icons/react/ssr";

import { LinkButton } from "@/components/link-button";
import { SocialLinks } from "@/components/social-links";
import { ThemeSwitch } from "@/components/theme-switch";
import { getSite } from "@/content";

export function SiteFooter() {
  const site = getSite();
  return (
    <footer className="mx-auto mt-32 w-full max-w-page px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 border-t border-line py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Want to work together?</p>
          <p className="mt-1 text-sm text-muted">
            Email me at{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-muted">
              {site.email}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`mailto:${site.email}`}>
            <EnvelopeSimpleIcon className="size-4" aria-hidden /> Get in touch
          </LinkButton>
        </div>
        {/* Phones only: the header has no room for it there. */}
        <div className="sm:hidden">
          <ThemeSwitch name="theme-footer" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name}, {site.role.toLowerCase()}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <p>Built with Next.js, hosted on Vercel</p>
          <SocialLinks size="sm" />
        </div>
      </div>
    </footer>
  );
}
