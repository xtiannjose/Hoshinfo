import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { LinkButton } from "@/components/link-button";
import { readProjects } from "@/content";

/** The 404 page's content: what happened, and the pages people most likely wanted. */
export function MissingPage() {
  return (
    <section className="mx-auto max-w-page px-4 pt-20 sm:px-6 md:pt-28 lg:px-8">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tighter md:text-5xl">This page could not be found.</h1>
      <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">
        The address may be mistyped, or the page has moved. These are the places to look:
      </p>
      <div className="mt-8">
        <LinkButton href="/">
          Home page <ArrowRightIcon className="size-4" aria-hidden />
        </LinkButton>
      </div>
      <h2 className="mt-14 text-sm text-muted">Case studies</h2>
      <ul className="mt-4 grid max-w-3xl gap-3 sm:grid-cols-3">
        {readProjects().map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="block h-full rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted"
            >
              <span className="block font-medium">{project.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{project.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
