import { ArrowRightIcon, ArrowUpRightIcon, TestTubeIcon } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";

import { Gallery } from "@/components/gallery";
import { LinkButton, StackList } from "@/components/link-button";
import { ProjectRail } from "@/components/project-rail";
import { BandNav } from "@/components/section-nav";
import { PhoneInset } from "@/components/shot";
import { SocialLinks } from "@/components/social-links";
import { WorkShowcase } from "@/components/work-showcase";
import { projects, toolbox, usedIn, work, type Project } from "@/content/projects";
import { experience, site } from "@/content/site";

// Stagger for the intro card's load-in (see .rise in globals.css).
const step = (i: number) => ({ "--i": i }) as CSSProperties;

// A project's desktop screens, cover first.
const screens = (project: Project) => [project.cover, ...project.gallery.filter((shot) => shot.kind === "desktop")];

const slides = projects.map((project) => ({
  slug: project.slug,
  name: project.name,
  tagline: project.tagline,
  live: project.live,
  code: project.code,
  phone: project.phone,
  shots: screens(project),
}));

export default function Home() {
  return (
    <>
      <ProjectRail lead={{ name: site.name, role: site.role }} slides={slides} more={site.github}>
        <div>
          <h1
            className="rise text-3xl font-semibold leading-[1.05] tracking-tighter text-balance md:text-4xl"
            style={step(0)}
          >
            I build web apps for orders, tickets and groceries.
          </h1>
          <p className="rise mt-5 text-lg leading-relaxed text-muted" style={step(1)}>
            Next.js, Laravel and Postgres, built test-first with the business rules written down before the code.
          </p>
        </div>
        <div className="rise" style={step(2)}>
          <SocialLinks />
        </div>
      </ProjectRail>
      <Story />
    </>
  );
}

/** Small label that names a section: pinned under the header on narrow screens, read-only for screen readers on wide ones. */
function BandLabel({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="sticky top-16 z-10 -mx-4 mb-6 bg-bg/80 px-4 py-3 text-sm font-semibold backdrop-blur-md sm:-mx-6 sm:px-6 lg:sr-only"
    >
      {children}
    </h2>
  );
}

/**
 * Everything under the carousel: a pinned column on the left (who, and a nav whose star follows
 * the section in view) and Experience, Projects and Toolbox scrolling on the right.
 */
function Story() {
  const now = experience[0];
  return (
    // scroll-mt-28 on links and buttons: keyboard focus never lands hidden under the sticky header and labels.
    <div className="mx-auto grid max-w-page gap-x-14 px-4 pt-28 sm:px-6 md:pt-36 lg:grid-cols-12 lg:px-8 [&_:is(a,button)]:scroll-mt-28">
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 flex flex-col gap-10">
          <p className="max-w-[30ch] text-muted">
            {now.title} at <span className="text-ink">{now.org}</span>, and maker of Hoshikopi, Hoshimono and Hoshiask.
          </p>
          <BandNav
            items={[
              { id: "experience", label: "Experience" },
              { id: "projects", label: "Projects" },
              { id: "toolbox", label: "Toolbox" },
            ]}
          />
          <SocialLinks />
        </div>
      </aside>

      <div className="lg:col-span-8">
        <Experience />
        <Projects />
        <Toolbox />
      </div>
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20">
      <BandLabel id="experience-title">Experience</BandLabel>
      {/* Pointing at one linked entry dims the others a little on wide screens (90% keeps muted text above 4.5:1).
          isolate keeps each card layer inside the list. */}
      <ol className="reveal group/list isolate space-y-10 lg:space-y-4">
        {experience.map((role) => {
          const external = role.href?.startsWith("http");
          const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon;
          return (
            <li
              key={`${role.org} ${role.period}`}
              data-linked={role.href ? "" : undefined}
              className="group relative grid gap-3 transition-opacity duration-150 sm:grid-cols-[8rem_1fr] sm:gap-8 lg:py-4 lg:group-has-[li[data-linked]:focus-within]/list:opacity-90 lg:group-has-[li[data-linked]:hover]/list:opacity-90 lg:focus-within:opacity-100! lg:hover:opacity-100!"
            >
              {/* Linked entries only: the card grows outward from the text, so the text stays aligned. */}
              {role.href && (
                <div
                  aria-hidden
                  className="absolute -inset-x-6 inset-y-0 -z-10 hidden rounded-xl border border-transparent transition-colors duration-150 motion-reduce:transition-none lg:block lg:group-focus-within:border-line lg:group-focus-within:bg-surface lg:group-hover:border-line lg:group-hover:bg-surface"
                />
              )}
              <p className="pt-1 font-mono text-xs text-muted">{role.period}</p>
              <div>
                <h3 className="font-semibold tracking-tight">
                  {role.href ? (
                    <a
                      href={role.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-flex items-baseline gap-1.5 transition-colors after:absolute after:inset-0 group-hover:text-star-ink lg:after:-inset-x-6"
                    >
                      {role.title}, {role.org}
                      <Arrow
                        className="size-3.5 self-center transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </a>
                  ) : (
                    `${role.title}, ${role.org}`
                  )}
                </h3>
                <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{role.summary}</p>
                {role.highlights && (
                  <ul className="mt-3 max-w-[62ch] list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-star">
                    {role.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <StackList items={role.stack} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* The company work sits with the role it came from. */}
      <div id="work" className="scroll-mt-20 pt-20">
        <h3 className="text-xl font-semibold tracking-tight">At iOne Resources</h3>
        <p className="mt-2 max-w-[60ch] text-muted">
          Work I build for the company. The code is theirs, so these are here to look at, without links.
        </p>
        <WorkShowcase items={work} />
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 pt-24 md:pt-32">
      <BandLabel id="projects-title">Projects</BandLabel>
      <p className="max-w-[60ch] text-muted">
        Three products I designed and built end to end, from the first planning doc to tested, working code.
      </p>
      <div className="mt-12 space-y-24">
        {projects.map((project) => (
          <ProjectShowcase key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

/** One project's own showcase: its screens (phone in the corner), what it does, how it is built, and the links. */
function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article aria-labelledby={`${project.slug}-title`} className="reveal">
      <h3 id={`${project.slug}-title`} className="text-2xl font-semibold tracking-tight">
        {project.name}
      </h3>
      <p className="mt-2 max-w-[60ch] text-lg text-muted">{project.tagline}</p>
      <div className="mt-6">
        <Gallery
          shots={screens(project)}
          label={`${project.name} case study`}
          href={`/projects/${project.slug}`}
          sizes="(min-width: 1024px) 880px, 100vw"
          overlay={<PhoneInset shot={project.phone} />}
        />
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <p className="leading-relaxed text-muted">{project.summary}</p>
          <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-star">
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <dl className="space-y-4">
            {project.build.slice(0, 2).map((item) => (
              <div key={item.title}>
                <dt className="text-sm font-medium">{item.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <StackList items={project.stack} />
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
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
    </article>
  );
}

function Toolbox() {
  return (
    <section id="toolbox" aria-labelledby="toolbox-title" className="scroll-mt-20 pt-24 md:pt-32">
      <BandLabel id="toolbox-title">Toolbox</BandLabel>
      <p className="max-w-[60ch] text-muted">What I build with, and where each tool is used.</p>
      <div className="reveal mt-10 grid gap-10 sm:grid-cols-3">
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
    </section>
  );
}
