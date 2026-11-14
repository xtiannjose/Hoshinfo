import { ArrowRightIcon, ArrowUpRightIcon, TestTubeIcon } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";

import { HeroShowcase } from "@/components/hero-showcase";
import { LinkButton, StackList } from "@/components/link-button";
import { ProjectRail } from "@/components/project-rail";
import { BandNav } from "@/components/section-nav";
import { SocialLinks } from "@/components/social-links";
import { WorkShowcase } from "@/components/work-showcase";
import { projects, toolbox, usedIn, work } from "@/content/projects";
import { about, certifications, education, experience, site } from "@/content/site";

// Stagger for the hero's load-in (see .rise in globals.css).
const step = (i: number) => ({ "--i": i }) as CSSProperties;

// The hero already shows each cover, so the strip's galleries open on the other screens.
const slides = projects.map(({ slug, name, tagline, live, code, gallery, cover }) => ({
  slug,
  name,
  tagline,
  live,
  code,
  shots: [...gallery.filter((shot) => shot.kind === "desktop"), cover],
}));

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <ProjectRail
        title="Projects"
        intro="Three products I designed and built end to end, from the first planning doc to tested, working code."
        slides={slides}
        more={site.github}
      />
      <section id="work" className="mx-auto max-w-page scroll-mt-20 px-4 pt-28 sm:px-6 md:pt-36 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">At iOne Resources</h2>
        <p className="mt-3 max-w-[60ch] text-muted">
          Work I build for the company. The code is theirs, so these are here to look at, without links.
        </p>
        <WorkShowcase items={work} />
      </section>
      <Toolbox />
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
        <div className="rise mt-8 flex flex-wrap items-center gap-3" style={step(3)}>
          <LinkButton href="#projects">
            See projects <ArrowRightIcon className="size-4" aria-hidden />
          </LinkButton>
          <SocialLinks />
        </div>
      </div>
      <div className="rise" style={step(2)}>
        <HeroShowcase slides={projects.map(({ slug, name, label, cover, phone }) => ({ slug, name, label, cover, phone }))} />
      </div>
    </section>
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

/** About, Experience and Education share one band: a pinned column on the left, the story scrolling on the right. */
function Story() {
  const [lead, ...rest] = about;
  const now = experience[0];
  return (
    <div className="mx-auto grid max-w-page gap-x-14 px-4 pt-28 sm:px-6 md:pt-36 lg:grid-cols-12 lg:px-8">
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 flex flex-col gap-10">
          <p className="max-w-[30ch] text-muted">
            {now.title} at <span className="text-ink">{now.org}</span>, and maker of Hoshikopi, Hoshimono and Hoshiask.
          </p>
          <BandNav
            items={[
              { id: "about", label: "About" },
              { id: "experience", label: "Experience" },
              { id: "education", label: "Education" },
            ]}
          />
          <SocialLinks />
        </div>
      </aside>

      <div className="lg:col-span-8">
        <section id="about" aria-labelledby="about-title" className="scroll-mt-20">
          <BandLabel id="about-title">About</BandLabel>
          <div className="reveal">
            <p className="text-2xl leading-snug tracking-tight text-balance md:text-3xl">{lead}</p>
            {rest.map((paragraph) => (
              <p key={paragraph} className="mt-6 max-w-[65ch] text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 lg:hidden">
            <SocialLinks />
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 pt-24 md:pt-32">
          <BandLabel id="experience-title">Experience</BandLabel>
          {/* Pointing at one entry dims the others a little on wide screens (90% keeps muted text above 4.5:1).
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
        </section>

        <section id="education" aria-labelledby="education-title" className="scroll-mt-20 pt-24 md:pt-32">
          <BandLabel id="education-title">Education</BandLabel>
          <div className="reveal grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-8">
            <p className="pt-1 font-mono text-xs text-muted">{education.period}</p>
            <div>
              <h3 className="font-semibold tracking-tight">
                {education.degree}, {education.school}
              </h3>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{education.thesis}</p>
              <div className="mt-4">
                <StackList items={education.stack} />
              </div>
            </div>
          </div>
          <h3 className="mt-14 font-semibold tracking-tight">Certifications</h3>
          <ul className="reveal mt-5 space-y-3">
            {certifications.map((cert) => (
              <li key={cert.name} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <span className="font-mono text-xs leading-6 text-muted">{cert.date}</span>
                <span className="leading-6">{cert.name}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Toolbox() {
  return (
    <section id="toolbox" className="mx-auto max-w-page scroll-mt-20 px-4 pt-28 sm:px-6 md:pt-36 lg:px-8">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Toolbox</h2>
      <p className="mt-3 max-w-[60ch] text-muted">What I build with, and where each tool is used.</p>
      <div className="reveal mt-10 grid gap-10 sm:grid-cols-3 lg:gap-14">
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
