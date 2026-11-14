// Everything about the owner lives here, so a name or link changes in one place.
export const site = {
  brand: "Hoshinfo",
  name: "Christian Jose",
  role: "Full-stack developer",
  github: "https://github.com/xtiannjose",
  url: "https://hoshinfo.vercel.app",
};

/** The About section, one string per paragraph. Only facts the rest of the site already states. */
export const about = [
  "I'm Christian, a full-stack developer. I build web apps for the parts of a business that hurt when they break: orders, stock, payments and support tickets.",
  "At iOne Resources I build the company website and the help desk it runs with its clients. In my own time I design and ship complete products: a concept cafe with order-ahead pickup, an online grocery and a help desk.",
  "I work mostly in Next.js and Laravel on Postgres. I write the business rules down before the code, record every hard-to-reverse choice with its reason, and test against a real database.",
];

export type Role = {
  /** Shown in the date column, e.g. "2024 - Now". */
  period: string;
  title: string;
  org: string;
  /** Where the entry leads: a section of this page or an outside link. */
  href: string;
  summary: string;
  stack: string[];
};

// Newest first. Add earlier jobs, study or certificates as more entries.
export const experience: Role[] = [
  {
    period: "Now",
    title: "Full-stack developer",
    org: "iOne Resources",
    href: "#work",
    summary:
      "I build the new company website, which replaced an old WordPress site, and the help desk iOne runs with its clients: separate client and staff portals, SLA tracking, escalation and audit logging.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Laravel", "PHP", "PostgreSQL", "Vercel"],
  },
  {
    period: "2026",
    title: "Designer and developer",
    org: "Hoshi projects",
    href: "#projects",
    summary:
      "Three products of my own, each designed and built end to end, from the first planning doc to the deployed app, with decision records and tests in a real browser.",
    stack: ["Next.js", "Laravel", "PostgreSQL", "Prisma", "Vitest", "Playwright", "PHPUnit"],
  },
];
