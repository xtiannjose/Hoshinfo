import { SocialLinks } from "@/components/social-links";
import { StarButton } from "@/components/star-button";
import { ThemeSwitch } from "@/components/theme-switch";
import { getSite } from "@/content";

export function SiteFooter() {
  const site = getSite();
  return (
    <footer className="mx-auto mt-32 w-full max-w-page px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 border-t border-line py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Thanks for stopping by.</p>
          <p className="mt-1 text-sm text-muted">If something here was worth a look, leave a star.</p>
        </div>
        <StarButton />
        {/* Phones only: the header has no room for it there. */}
        <div className="sm:hidden">
          <ThemeSwitch name="theme-footer" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name}, {site.role.toLowerCase()}.
        </p>
        <div className="flex items-center gap-4">
          <p>Built with Next.js, hosted on Vercel.</p>
          <SocialLinks size="sm" />
        </div>
      </div>
    </footer>
  );
}
