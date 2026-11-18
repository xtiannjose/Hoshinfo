import { collection, config, fields, singleton } from "@keystatic/core";

/**
 * The site editor at /keystatic. Content is JSON under content/, read by src/content/index.ts.
 * Locally (npm run dev) edits are written to the files here; on the live site they are commits to
 * GitHub, which Vercel then deploys. NEXT_PUBLIC_KEYSTATIC_STORAGE=github tries GitHub mode locally,
 * which is how the GitHub App is first set up.
 */
const github = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

// Screenshots are stored in public/shots/<entry>/ and referenced as /shots/<entry>/<file>.
const shotFiles = { directory: "public/shots", publicPath: "/shots/" };
const required = { validation: { isRequired: true } } as const;

const text = (label: string, description?: string) => fields.text({ label, description, ...required });
const paragraph = (label: string, description?: string) => fields.text({ label, description, multiline: true, ...required });
const stack = fields.array(fields.text({ label: "Tool", ...required }), {
  label: "Stack",
  description: "Tools as they should read, e.g. \"Next.js 16\". The Toolbox lists a project under a tool when a stack entry is the tool's name, with or without a version.",
  itemLabel: (props) => props.value,
});

const phoneImage = fields.image({
  label: "Same page on a phone",
  description: "Optional. Shown in the corner of the screenshot.",
  ...shotFiles,
});
const screenFields = {
  image: fields.image({ label: "Screenshot", description: "Desktop screens at 2880 × 1800 (16:10).", ...shotFiles, ...required }),
  alt: text("Alt text", "What the screenshot shows, for people who cannot see it."),
  caption: text("Caption"),
};
/** A desktop screenshot, optionally with the same page on a phone. */
const screen = (label: string) => fields.object({ ...screenFields, phone: phoneImage }, { label });

export default config({
  storage: github ? { kind: "github", repo: { owner: "xtiannjose", name: "Hoshinfo" } } : { kind: "local" },
  ui: {
    brand: { name: "Hoshinfo" },
    navigation: { Projects: ["projects", "work"], About: ["site", "experience", "toolbox"] },
  },
  collections: {
    projects: collection({
      label: "Personal projects",
      path: "content/projects/*",
      format: { data: "json" },
      slugField: "name",
      columns: ["order"],
      schema: {
        name: fields.slug({
          name: { label: "Name", ...required },
          slug: { label: "Address", description: "The case study's link: /projects/<address>." },
        }),
        order: fields.integer({ label: "Order", description: "Lower numbers show first in the carousel and lists.", defaultValue: 100, ...required }),
        tagline: text("Tagline", "One line under the name."),
        summary: paragraph("Summary", "The general idea, shown on the home page and the case study."),
        live: fields.url({ label: "Live site", description: "Optional." }),
        code: fields.url({ label: "Code", description: "The GitHub repository.", ...required }),
        stack,
        cover: screen("Cover screenshot"),
        phone: fields.object(
          { image: fields.image({ label: "Screenshot", description: "Phone screens at 780 × 1688.", ...shotFiles, ...required }), alt: screenFields.alt, caption: screenFields.caption },
          { label: "Main phone screenshot" },
        ),
        gallery: fields.array(
          fields.object({
            kind: fields.select({
              label: "Kind",
              options: [
                { label: "Desktop", value: "desktop" },
                { label: "Phone", value: "phone" },
              ],
              defaultValue: "desktop",
            }),
            ...screenFields,
            phone: phoneImage,
          }),
          { label: "More screenshots", description: "Desktop ones show in the carousel and \"A closer look\"; phone ones under \"On a phone\".", itemLabel: (props) => props.fields.caption.value },
        ),
        features: fields.array(fields.text({ label: "Feature", multiline: true, ...required }), {
          label: "What it does",
          description: "Shown on the case study.",
          itemLabel: (props) => props.value,
        }),
        build: fields.array(fields.object({ title: text("Title"), body: paragraph("Text") }), {
          label: "How it is built",
          description: "Shown on the case study.",
          itemLabel: (props) => props.fields.title.value,
        }),
      },
    }),
    work: collection({
      label: "Company work",
      path: "content/work/*",
      format: { data: "json" },
      slugField: "name",
      columns: ["order"],
      schema: {
        name: fields.slug({
          name: { label: "Name", ...required },
          slug: { label: "Address", description: "Its anchor on the home page: /#<address>. Experience entries can link to it." },
        }),
        order: fields.integer({ label: "Order", description: "Lower numbers show first.", defaultValue: 100, ...required }),
        company: text("Company", "Who it was built for. Shown as \"Company work at <company>\"."),
        summary: paragraph("Summary"),
        stack,
        shots: fields.array(screen("Screenshot"), {
          label: "Screenshots",
          description: "Leave empty when the screens cannot be shown.",
          itemLabel: (props) => props.fields.caption.value,
        }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: "Site details",
      path: "content/site",
      format: { data: "json" },
      schema: {
        brand: text("Brand", "The name in the header, e.g. Hoshinfo."),
        name: text("Your name"),
        role: text("Role", "Under the page title, e.g. Software Developer."),
        description: paragraph("Search description", "The summary search engines and link previews show."),
        projectsIntro: paragraph("Projects intro", "The line under the Projects heading on the home page."),
        email: fields.text({
          label: "Contact email",
          description: "Behind every \"Get in touch\" button and the envelope icon.",
          validation: { isRequired: true, pattern: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "An email address" } },
        }),
        github: fields.url({ label: "GitHub profile", ...required }),
        linkedin: fields.url({ label: "LinkedIn profile", ...required }),
        url: fields.url({ label: "Site address", description: "The live site's own address.", ...required }),
      },
    }),
    experience: singleton({
      label: "Experience",
      path: "content/experience",
      format: { data: "json" },
      schema: {
        roles: fields.array(
          fields.object({
            period: text("Period", "Shown in the date column, e.g. \"Nov 2025 - Now\"."),
            title: text("Job title"),
            org: text("Company"),
            href: fields.text({ label: "Link", description: "Optional. A home page section such as #ione-website, or an outside link." }),
            summary: paragraph("Summary"),
            highlights: fields.array(fields.text({ label: "Highlight", multiline: true, ...required }), { label: "Highlights", itemLabel: (props) => props.value }),
            stack,
          }),
          { label: "Roles", description: "Newest first. Drag to reorder. Keep phone, address, email and references off the site.", itemLabel: (props) => `${props.fields.title.value}, ${props.fields.org.value}` },
        ),
      },
    }),
    toolbox: singleton({
      label: "Toolbox",
      path: "content/toolbox",
      format: { data: "json" },
      schema: {
        groups: fields.array(
          fields.object({
            name: text("Group name"),
            tools: fields.array(
              fields.object({
                name: text("Tool name", "Match how projects write it in their stack, without the version."),
                logo: fields.text({
                  label: "Logo",
                  description: "Optional. The tool's slug on simpleicons.org, e.g. nextdotjs. Empty shows a generic icon.",
                }),
              }),
              { label: "Tools", itemLabel: (props) => props.fields.name.value },
            ),
          }),
          { label: "Groups", itemLabel: (props) => props.fields.name.value },
        ),
      },
    }),
  },
});
