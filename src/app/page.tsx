import { ArrowRightIcon, ArrowUpRightIcon, GithubLogoIcon, TestTubeIcon } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";

import { Gallery } from "@/components/gallery";
import { HeroShowcase } from "@/components/hero-showcase";
import { LinkButton, StackList } from "@/components/link-button";
import { WorkShowcase } from "@/components/work-showcase";
import { projects, toolbox, usedIn, work, type Project } from "@/content/projects";
import { site } from "@/content/site";

const [featured, ...others] = projects;

// Stagger for the hero's load-in (see .rise in globals.css).
const step = (i: number) => ({ "--i": i }) as CSSProperties;

// The hero already shows each cover, so the galleries open on the other screens.
const screens = (project: Project) => [...project.gallery.filter((shot) => shot.kind === "desktop"), project.cover];

export default function Home() {
  return (
    <>
      <Hero />
      <section id="projects" className="mx-auto max-w-page scroll-mt-8 px-4 pt-24 sm:px-6 md:pt-32 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Projects</h2>
        <p className="mt-3 max-w-[60ch] text-muted">
          Three products I designed and built end to end, from the first planning doc to the deployed app.
        </p>
        <Featured project={featured} />
        <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
          {others.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <Toolbox />
      <section id="work" className="mx-auto max-w-page scroll-mt-8 px-4 pt-28 sm:px-6 md:pt-36 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">At iOne Resources</h2>
        <p className="mt-3 max-w-[60ch] text-muted">
          Work I build for the company. The code is theirs, so these are here to look at, without links.
        </p>
        <WorkShowcase items={work} />
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-page items-center gap-12 px-4 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
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
      <div className="rise" style={step(2)}>
        <HeroShowcase slides={projects.map(({ slug, name, label, cover, phone }) => ({ slug, name, label, cover, phone }))} />
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
    <article className="reveal mt-12 grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <Gallery
          shots={screens(project)}
          label={`${project.name} case study`}
          href={`/projects/${project.slug}`}
          sizes="(min-width: 1024px) 880px, 100vw"
        />
      </div>
      <div className="lg:col-span-4">
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
      <Gallery
        shots={screens(project)}
        label={`${project.name} case study`}
        href={`/projects/${project.slug}`}
        sizes="(min-width: 768px) 650px, 100vw"
      />
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

function Toolbox() {
  return (
    <section id="toolbox" className="mx-auto max-w-page px-4 pt-28 sm:px-6 md:pt-36 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Toolbox</h2>
          <p className="mt-3 max-w-[40ch] text-muted">What I build with, and where each tool is used.</p>
        </div>
        <div className="reveal grid gap-10 sm:grid-cols-3 lg:col-span-8">
          {toolbox.map(({ group, tools }) => (
            <div key={group}>
              <h3 className="text-sm text-muted">{group}</h3>
              <ul className="mt-5 space-y-5">
                {tools.map((tool) => (
                  <li key={tool.name} className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface">
                      {tool.logo ? (
                        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                          <path d={tool.logo} />
                        </svg>
                      ) : (
                        // Only the test runners lack a Simple Icons logo.
                        <TestTubeIcon className="size-5" aria-hidden />
                      )}
                    </span>
                    <span>
                      <span className="block font-medium">{tool.name}</span>
                      <span className="block text-sm text-muted">{usedIn(tool.name).join(", ")}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
