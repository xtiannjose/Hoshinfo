import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LinkButton, StackList } from "@/components/link-button";
import { Shot } from "@/components/shot";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const desktops = project.gallery.filter((shot) => shot.kind === "desktop");
  const phones = [project.phone, ...project.gallery.filter((shot) => shot.kind === "phone")];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <article className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeftIcon className="size-4" aria-hidden /> All projects
      </Link>

      <header className="rise mt-8 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">{project.name}</h1>
        <p className="mt-4 text-xl leading-snug text-balance">{project.tagline}</p>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.live && (
            <LinkButton href={project.live}>
              Live site <ArrowUpRightIcon className="size-4" aria-hidden />
            </LinkButton>
          )}
          <LinkButton href={project.code} variant={project.live ? "secondary" : "primary"}>
            Code <ArrowUpRightIcon className="size-4" aria-hidden />
          </LinkButton>
        </div>
        <div className="mt-6">
          <StackList items={project.stack} />
        </div>
      </header>

      <figure className="rise mt-12">
        <Shot shot={project.cover} sizes="(min-width: 1152px) 1104px, 100vw" preload />
        <figcaption className="mt-3 text-sm text-muted">{project.cover.caption}</figcaption>
      </figure>

      {(project.features.length > 0 || project.build.length > 0) && (
        <div className="mt-20 grid gap-14 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {project.features.length > 0 && (
            <section className="reveal">
              <h2 className="text-2xl font-semibold tracking-tight">What it does</h2>
              <ul className="mt-6 space-y-4">
                {project.features.map((feature) => (
                  <li key={feature} className="leading-relaxed text-muted">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.build.length > 0 && (
            <section className="reveal">
              <h2 className="text-2xl font-semibold tracking-tight">How it is built</h2>
              <dl className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {project.build.map((item) => (
                  <div key={item.title}>
                    <dt className="font-medium">{item.title}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}

      {desktops.length > 0 && (
        <section className="mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">A closer look</h2>
          <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2">
            {desktops.map((shot, i) => (
              <figure key={shot.src} className={`reveal ${i === 0 && desktops.length % 2 === 1 ? "md:col-span-2" : ""}`}>
                <Shot shot={shot} sizes={i === 0 && desktops.length % 2 === 1 ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 768px) 540px, 100vw"} />
                <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">On a phone</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:max-w-xl">
          {phones.map((shot) => (
            <figure key={shot.src} className="reveal">
              <Shot shot={shot} sizes="(min-width: 640px) 280px, 45vw" />
              <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-24 flex items-center justify-between gap-6 rounded-xl border border-line bg-surface p-6 transition hover:border-muted"
      >
        <span>
          <span className="block text-sm text-muted">Next project</span>
          <span className="mt-1 block text-2xl font-semibold tracking-tight">{next.name}</span>
        </span>
        <ArrowRightIcon className="size-6 transition group-hover:translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}
