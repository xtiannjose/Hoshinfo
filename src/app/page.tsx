import { ArrowRightIcon, ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";

import { LinkButton, StackList } from "@/components/link-button";
import { Shot } from "@/components/shot";
import { projects, work, type Project } from "@/content/projects";
import { site } from "@/content/site";

const [hoshikopi, ...others] = projects;

// Stagger for the hero's load-in (see .rise in globals.css).
const step = (i: number) => ({ "--i": i }) as CSSProperties;

export default function Home() {
  return (
    <>
      <Hero />
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-8 px-4 pt-24 sm:px-6 md:pt-32">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Projects</h2>
        <p className="mt-3 max-w-[60ch] text-muted">
          Three products I designed and built end to end, from the first planning doc to the deployed app.
        </p>
        <Featured project={hoshikopi} />
        <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-10">
          {others.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <Practice />
      <Work />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[6fr_5fr]">
      <div>
        <p className="rise text-sm text-muted" style={step(0)}>
          {site.name}, {site.role.toLowerCase()}
        </p>
        <h1
          className="rise mt-4 text-4xl font-semibold leading-[1.05] tracking-tighter text-balance md:text-5xl"
          style={step(1)}
        >
          I build web apps for orders, tickets and groceries.
        </h1>
        <p className="rise mt-6 max-w-[46ch] text-lg leading-relaxed text-muted" style={step(2)}>
          Next.js, Laravel and Postgres, built test-first with the business rules written down before the code.
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3" style={step(3)}>
          <LinkButton href="#projects">
            See projects <ArrowRightIcon className="size-4" aria-hidden />
          </LinkButton>
          <LinkButton href={site.github} variant="secondary">
            <GithubLogoIcon className="size-4" aria-hidden /> GitHub
          </LinkButton>
        </div>
      </div>
      <div className="rise relative pb-10 lg:pb-14" style={step(2)}>
        <Shot shot={hoshikopi.cover} sizes="(min-width: 1024px) 600px, 100vw" preload />
        <div className="absolute -bottom-2 right-4 w-[24%] max-w-36 sm:right-8">
          <Shot shot={hoshikopi.phone} sizes="150px" />
        </div>
      </div>
    </section>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton href={`/projects/${project.slug}`}>
        Case study <ArrowRightIcon className="size-4" aria-hidden />
      </LinkButton>
      {project.live && (
        <LinkButton href={project.live} variant="secondary">
          Live site <ArrowUpRightIcon className="size-4" aria-hidden />
        </LinkButton>
      )}
      <LinkButton href={project.code} variant="secondary">
        Code <ArrowUpRightIcon className="size-4" aria-hidden />
      </LinkButton>
    </div>
  );
}

function Featured({ project }: { project: Project }) {
  return (
    <article className="reveal mt-12 grid items-center gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
      <Link href={`/projects/${project.slug}`} className="block transition hover:-translate-y-1">
        <Shot shot={project.gallery[1]} sizes="(min-width: 1024px) 640px, 100vw" />
      </Link>
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
        <p className="mt-3 text-lg text-ink">{project.tagline}</p>
        <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-6">
          <StackList items={project.stack} />
        </div>
        <div className="mt-8">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal flex flex-col">
      <Link href={`/projects/${project.slug}`} className="block transition hover:-translate-y-1">
        <Shot shot={project.cover} sizes="(min-width: 768px) 540px, 100vw" />
      </Link>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight">{project.name}</h3>
      <p className="mt-3 max-w-[52ch] text-muted">{project.tagline}</p>
      <div className="mt-5">
        <StackList items={project.stack} />
      </div>
      <div className="mt-7">
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

const facts = [
  { figure: "1,182", label: "PHPUnit tests in Hoshiask", detail: "Run twice in CI, on SQLite and on PostgreSQL 16, next to PHPStan, a dependency audit and a secret scan." },
  { figure: "472", label: "automated tests in Hoshimono", detail: "391 Vitest and 81 Playwright tests with axe accessibility checks, plus Lighthouse budgets." },
  { figure: "387", label: "automated tests in Hoshikopi", detail: "193 Vitest tests on a real Postgres database and 194 Playwright tests in a browser." },
  { figure: "39", label: "decision records across the three", detail: "Each hard-to-reverse choice is written down with its reason, before the code." },
];

function Practice() {
  return (
    <section id="practice" className="mx-auto max-w-6xl px-4 pt-28 sm:px-6 md:pt-36">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How I build</h2>
      <p className="mt-3 max-w-[60ch] text-muted">
        Money, stock and order status are the parts that hurt when they break, so they get written down first and tested
        hardest.
      </p>
      <dl className="reveal mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-[3fr_2fr_2fr]">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`flex flex-col justify-between gap-6 rounded-xl border p-6 ${
              i === 0
                ? "border-transparent bg-star-soft lg:row-span-2"
                : i === 3
                  ? "border-line bg-ink text-bg lg:col-span-2"
                  : "border-line bg-surface"
            }`}
          >
            <dt className={`text-sm ${i === 3 ? "opacity-75" : "text-muted"}`}>{fact.label}</dt>
            <dd>
              <span className={`block font-semibold tracking-tighter ${i === 0 ? "text-6xl md:text-7xl" : "text-4xl"}`}>
                {fact.figure}
              </span>
              <span className={`mt-3 block max-w-[46ch] text-sm leading-relaxed ${i === 3 ? "opacity-75" : "text-muted"}`}>
                {fact.detail}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-8 px-4 pt-28 sm:px-6 md:pt-36">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">At iOne Resources</h2>
      <p className="mt-3 max-w-[60ch] text-muted">
        Work I build for the company. The code is theirs, so these are here to look at, without links.
      </p>
      <div className="mt-10 divide-y divide-line border-t border-line">
        {work.map((item) => (
          <article key={item.name} className="reveal grid gap-6 py-8 md:grid-cols-[2fr_3fr] md:gap-10">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{item.name}</h3>
              <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{item.summary}</p>
              <div className="mt-5">
                <StackList items={item.stack} />
              </div>
            </div>
            {item.shot && <Shot shot={item.shot} sizes="(min-width: 768px) 640px, 100vw" />}
          </article>
        ))}
      </div>
    </section>
  );
}
