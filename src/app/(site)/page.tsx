import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BuildingsIcon,
  LockSimpleIcon,
  StarIcon,
  TestTubeIcon,
} from "@phosphor-icons/react/ssr";
import type { CSSProperties, ReactNode } from "react";

import { EditLink } from "@/components/edit-link";
import { Gallery } from "@/components/gallery";
import { LinkButton, StackList } from "@/components/link-button";
import { ProjectCarousel } from "@/components/project-carousel";
import {
  getExperience,
  getProjects,
  getSite,
  getToolbox,
  getWork,
  usedIn,
  type Project,
  type Role,
  type Tool,
  type WorkItem,
} from "@/content";

// A text link inside a line of muted text.
const inlineLink = "text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-muted";

// A project's desktop screens, cover first.
const screens = (project: Project) => [project.cover, ...project.gallery.filter((shot) => shot.kind === "desktop")];

export default function Home() {
  const site = getSite();
  const roles = getExperience();
  const projects = getProjects();
  const work = getWork();
  const slides = projects.map((project) => ({
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    live: project.live,
    code: project.code,
    shots: screens(project),
  }));

  return (
    <>
      <ProjectCarousel
        slides={slides}
        heading={
          <div>
            <div className="flex items-center gap-3">
              <h1 className="rise text-2xl font-semibold tracking-tight md:text-3xl" style={{ "--i": 0 } as CSSProperties}>
                {site.name}
              </h1>
              <EditLink path="singleton/site" label="Edit site details: name, role, links and intro lines" />
            </div>
            <p className="rise mt-1 flex flex-wrap items-center gap-x-2 text-muted" style={{ "--i": 1 } as CSSProperties}>
              <StarIcon weight="fill" className="size-3.5 text-star" aria-hidden />
              {/* Roles are newest first, so the first one is the current job. */}
              {roles[0] ? `${site.role} at ${roles[0].org}` : site.role}
              <span aria-hidden>·</span>
              <a href={`mailto:${site.email}`} className={inlineLink}>
                Get in touch
              </a>
            </p>
            <p className="rise mt-3 text-ink" style={{ "--i": 2 } as CSSProperties}>
              {site.intro}
            </p>
          </div>
        }
      />
      <Story>
        <Experience roles={roles} />
        <Projects intro={site.projectsIntro} projects={projects} work={work} />
        <Toolbox groups={getToolbox()} items={[...projects, ...work]} />
      </Story>
    </>
  );
}

/** A section heading; `edit` adds the editor's pencil beside it (only the signed-in owner sees it). */
function SectionTitle({ id, children, edit }: { id: string; children: string; edit: { path: string; label: string } }) {
  return (
    <div className="flex items-center gap-3">
      <h2 id={id} className="text-3xl font-semibold tracking-tight md:text-4xl">
        {children}
      </h2>
      <EditLink {...edit} />
    </div>
  );
}

/** Everything under the carousel, full width. The header nav's star marks the section in view. */
function Story({ children }: { children: ReactNode }) {
  return (
    // scroll-mt-28 on links and buttons: keyboard focus never lands hidden under the sticky header.
    <div className="mx-auto max-w-page px-4 pt-24 sm:px-6 md:pt-28 lg:px-8 [&_:is(a,button)]:scroll-mt-28">
      {children}
    </div>
  );
}

function Experience({ roles }: { roles: Role[] }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20">
      <SectionTitle id="experience-title" edit={{ path: "singleton/experience", label: "Edit experience" }}>
        Experience
      </SectionTitle>
      {/* Pointing at one linked entry dims the others a little on wide screens (90% keeps muted text above 4.5:1).
          isolate keeps each card layer inside the list. */}
      <ol className="group/list isolate mt-10 space-y-10 lg:space-y-4">
        {roles.map((role) => {
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
                <h3 className="font-semibold">
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
                  <ul className="mt-3 max-w-[62ch] list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted marker:text-muted">
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

    </section>
  );
}

function Projects({ intro, projects, work }: { intro: string; projects: Project[]; work: WorkItem[] }) {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 pt-24 md:pt-32">
      <SectionTitle id="projects-title" edit={{ path: "collection/projects", label: "Edit or add personal projects" }}>
        Projects
      </SectionTitle>
      <p className="mt-3 max-w-[72ch] text-muted">{intro}</p>
      <div className="mt-12 space-y-24">
        {work.map((item) => (
          <CompanyShowcase key={item.slug} item={item} />
        ))}
        {projects.map((project) => (
          <ProjectShowcase key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

/** Says whose project it is: a clear badge above the name. */
function Kind({ icon, children }: { icon: "star" | "company"; children: string }) {
  const Icon = icon === "star" ? StarIcon : BuildingsIcon;
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-base font-medium text-ink">
      <Icon weight="fill" className="size-4 text-star" aria-hidden />
      {children}
    </p>
  );
}

/** One project's own showcase: its screens (phone in the corner) beside what it does, how it is built, and the links. */
function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className="grid scroll-mt-20 gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-7">
        <Gallery
          shots={screens(project)}
          label={`${project.name} case study`}
          href={`/projects/${project.slug}`}
          sizes="(min-width: 1024px) 780px, 100vw"
          phones
        />
      </div>
      <div className="lg:col-span-5">
        <Kind icon="star">Personal project</Kind>
        <div className="mt-4 flex items-center gap-3">
          <h3 id={`${project.slug}-title`} className="text-3xl font-semibold tracking-tight">
            {project.name}
          </h3>
          <EditLink path={`collection/projects/item/${project.slug}`} label={`Edit ${project.name}`} />
        </div>
        <p className="mt-2 text-lg text-muted">{project.tagline}</p>
        {/* The general idea only; features and how it is built are on the case study. */}
        <p className="mt-5 leading-relaxed text-muted">{project.summary}</p>
        <div className="mt-6">
          <StackList items={project.stack} />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
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
      </div>
    </article>
  );
}

/** A project built at iOne Resources: the code is the company's, so only a live site is linked. */
function CompanyShowcase({ item }: { item: WorkItem }) {
  return (
    <article
      id={item.slug}
      aria-labelledby={`${item.slug}-title`}
      className="grid scroll-mt-20 gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-7">
        {item.shots.length > 0 ? (
          <Gallery shots={item.shots} label={item.name} sizes="(min-width: 1024px) 780px, 100vw" />
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface p-6 text-center">
            <LockSimpleIcon className="size-6 text-star" aria-hidden />
            <p className="max-w-[36ch] text-sm text-muted">Screens from this one stay with the company</p>
          </div>
        )}
      </div>
      <div className="lg:col-span-5">
        <Kind icon="company">{`Company work at ${item.company}`}</Kind>
        <div className="mt-4 flex items-center gap-3">
          <h3 id={`${item.slug}-title`} className="text-3xl font-semibold tracking-tight">
            {item.name}
          </h3>
          <EditLink path={`collection/work/item/${item.slug}`} label={`Edit ${item.name}`} />
        </div>
        <p className="mt-5 leading-relaxed text-muted">{item.summary}</p>
        <p className="mt-2 text-sm text-muted">
          The code belongs to {item.company}, so {item.live ? "only the live site is linked" : "there are no links"}.
        </p>
        <div className="mt-5">
          <StackList items={item.stack} />
        </div>
        {item.live && (
          <div className="mt-7">
            <LinkButton href={item.live}>
              Live site <ArrowUpRightIcon className="size-4" aria-hidden />
            </LinkButton>
          </div>
        )}
      </div>
    </article>
  );
}

function Toolbox({ groups, items }: { groups: { group: string; tools: Tool[] }[]; items: { name: string; stack: string[] }[] }) {
  return (
    <section id="toolbox" aria-labelledby="toolbox-title" className="scroll-mt-20 pt-24 md:pt-32">
      <SectionTitle id="toolbox-title" edit={{ path: "singleton/toolbox", label: "Edit the toolbox" }}>
        Toolbox
      </SectionTitle>
      <p className="mt-3 max-w-[60ch] text-muted">What I build with, and where each tool is used.</p>
      <div className="mt-10 grid gap-10 sm:grid-cols-3 lg:gap-14">
        {groups.map(({ group, tools }) => (
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
                      // Tools without a Simple Icons logo, such as the test runners.
                      <TestTubeIcon className="size-5" aria-hidden />
                    )}
                  </span>
                  <span>
                    <span className="block font-medium">{tool.name}</span>
                    <span className="block text-sm text-muted">{usedIn(tool.name, items).join(", ")}</span>
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
