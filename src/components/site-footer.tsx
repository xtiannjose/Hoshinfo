import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 flex w-full max-w-page flex-col gap-2 border-t border-line px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <p>
        {site.name}, {site.role.toLowerCase()}.
      </p>
      <p>
        <a href={site.github} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink">
          GitHub
        </a>
        <span className="mx-2" aria-hidden>
          /
        </span>
        Built with Next.js, hosted on Vercel.
      </p>
    </footer>
  );
}
