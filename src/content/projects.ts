import {
  siAlpinedotjs,
  siBetterauth,
  siLaravel,
  siNextdotjs,
  siPhp,
  siPostgresql,
  siPrisma,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
} from "simple-icons";

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  kind: "desktop" | "phone";
  /** Pixel size of the file: shots are taken at 2x. */
  size: [number, number];
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  live?: string;
  code: string;
  cover: Shot;
  phone: Shot;
  gallery: Shot[];
  features: string[];
  build: { title: string; body: string }[];
};

/** Work done at iOne Resources: shown, not linked (the code is the company's). */
export type WorkItem = {
  /** Anchor of its showcase on the home page. */
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  /** Empty when the screens cannot be shown. */
  shots: Shot[];
};

const desktop = (folder: string, file: string, alt: string, caption: string): Shot => ({
  src: `/shots/${folder}/${file}.png`,
  alt,
  caption,
  kind: "desktop",
  size: [2880, 1800],
});

const phone = (
  folder: string,
  file: string,
  alt: string,
  caption: string,
  size: [number, number] = [780, 1688],
): Shot => ({
  src: `/shots/${folder}/${file}.png`,
  alt,
  caption,
  kind: "phone",
  size,
});

export const projects: Project[] = [
  {
    slug: "hoshikopi",
    name: "Hoshikopi",
    tagline: "A concept cafe in Pasig with order-ahead pickup and a Stars loyalty card.",
    summary:
      "The full website of an invented cafe: the menu, ordering ahead for a pickup time, Stars, events and a Bar Screen for the baristas. It is a portfolio piece, so the cafe is labelled as a concept and payments run in PayMongo test mode.",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma 7", "Tailwind CSS 4", "Vitest", "Playwright", "Vercel"],
    live: "https://hoshikopi.vercel.app",
    code: "https://github.com/xtiannjose/Hoshikopi",
    cover: desktop("hoshikopi", "home-night", "Hoshikopi home page in the Night palette", "Home after 6 PM Manila time, in the Night palette."),
    phone: phone("hoshikopi", "item-phone", "Hoshi Latte page on a phone", "A drink page on a phone."),
    gallery: [
      desktop("hoshikopi", "home", "Hoshikopi home page in the Day palette", "The same home page by day: the palette follows the cafe's clock."),
      desktop("hoshikopi", "menu", "Coffee section of the Hoshikopi menu", "The menu, with prices from the server and Barista Pick badges."),
      desktop("hoshikopi", "item", "Hoshi Latte with size, milk, sugar and ice choices", "Build a drink: every choice and its price change is checked again at checkout."),
      desktop("hoshikopi", "events", "Hoshikopi events page", "Events with sign-ups, plus the weekly ones that need no booking."),
      desktop("hoshikopi", "cafe", "Hoshikopi visit page with hours and amenities", "Hours, directions and amenities for planning a visit."),
      phone("hoshikopi", "home-phone", "Hoshikopi home page on a phone", "Home on a phone."),
    ],
    features: [
      "Order ahead: pick a size, milk and add-ons, then a 15-minute pickup window.",
      "Pickup windows fill up, and two people can never book the last slot.",
      "Stars loyalty: a Star for every drink, rewards to spend, and a birthday treat.",
      "Events with seat sign-ups and an add-to-calendar file.",
      "A Bar Screen for baristas that refreshes on its own as orders move.",
      "Staff sign in with a second factor, and the manager gets sales reports.",
    ],
    build: [
      {
        title: "The server prices everything",
        body: "Money is whole centavos, never floats. The cart and checkout recompute every price, so a changed number in the browser does nothing.",
      },
      {
        title: "One door for order status",
        body: "Every status change goes through a single transition function and a table of allowed moves. Payment status only comes from verified webhooks.",
      },
      {
        title: "Capacity under a row lock",
        body: "Placing an order locks the pickup window's row in Postgres, so the last slot cannot be sold twice.",
      },
      {
        title: "Prerendered, refreshed by tag",
        body: "Public pages are static and refresh when the menu, hours or content change, using Next.js 16 Cache Components.",
      },
      {
        title: "Tested against a real database",
        body: "193 Vitest tests run against a Postgres test database, and 194 Playwright tests drive a real browser. 14 decision records explain the choices.",
      },
    ],
  },
  {
    slug: "hoshimono",
    name: "Hoshimono",
    tagline: "An online supermarket for Metro Manila households, with same-day delivery slots.",
    summary:
      "Groceries from browsing to the doorstep: a searchable catalogue, a cart, delivery slots, cash on delivery or online payment, and the staff screens that pick, pack and send every order from one hub.",
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma 7", "Better Auth", "Tailwind CSS 4", "Vitest", "Playwright"],
    code: "https://github.com/xtiannjose/Hoshimono",
    cover: desktop("hoshimono", "home", "Hoshimono storefront home page", "The storefront: aisles, fresh picks and the delivery promise up top."),
    phone: phone("hoshimono", "home-phone-412", "Hoshimono storefront on a phone", "The storefront on a phone.", [824, 1830]),
    gallery: [
      desktop("hoshimono", "recipe", "Chicken Adobo recipe with its ingredients list", "Recipe to cart: ingredients scale with the servings, and pantry staples start unticked."),
      desktop("hoshimono", "search", "Search results for gatas", "Search understands Filipino and typos: \"gatas\" finds six kinds of milk."),
      desktop("hoshimono", "product", "Carabao Mangoes product page, sold by weight", "A Product sold by weight, with a plain note on how the final price is set."),
      desktop("hoshimono", "cart", "Hoshimono cart with substitution choices", "The cart, with a substitute choice and picker notes for every item."),
      desktop("hoshimono", "checkout", "Checkout with two-hour delivery slots", "Checkout holds the chosen two-hour slot while the shopper pays."),
      desktop("hoshimono", "stock", "Staff stock screen", "Staff see what is on the shelf, reserved and free, with low stock flagged."),
      desktop("hoshimono", "home-dark", "Hoshimono storefront in dark mode", "The storefront in dark mode, which follows the system setting."),
      phone("hoshimono", "product-phone-412", "A product page on a phone", "A Product page on a phone.", [824, 1830]),
    ],
    features: [
      "Browse aisles or search in English or Filipino, typos included.",
      "Fill a cart, choose a substitute for each item, and leave notes for the picker.",
      "Pick a two-hour delivery slot, then pay by GCash, card or cash on delivery.",
      "Recipes that add their ingredients to the cart, scaled to the servings.",
      "Staff screens for orders, picking, dispatch, cash, stock, slots and refunds.",
      "The whole shop in Filipino, and an installable app with offline basics.",
    ],
    build: [
      {
        title: "Weighed items, settled fairly",
        body: "Items sold by weight charge an estimate at checkout, settle to the packed weight at picking (never above the estimate) and refund the difference in one go.",
      },
      {
        title: "The last unit sells once",
        body: "Tests race orders for the last unit and carts for one slot against a real Postgres database.",
      },
      {
        title: "Payments behind one interface",
        body: "PayMongo and a stand-in provider share one interface, and every webhook is deduplicated before it touches an Order.",
      },
      {
        title: "A modular monolith",
        body: "13 modules talk only through their index files, enforced by an ESLint rule that has its own test.",
      },
      {
        title: "Search on plain Postgres",
        body: "Full-text search, trigrams and a Filipino and English synonym list, with no search service to run.",
      },
      {
        title: "Checked on every merge",
        body: "391 Vitest tests, 81 Playwright tests with axe accessibility checks, and Lighthouse budgets. 22 decision records explain the choices.",
      },
    ],
  },
  {
    slug: "hoshiask",
    name: "Hoshiask",
    tagline: "A help desk for organisations with field offices: a client portal and a staff console.",
    summary:
      "Clients file tickets in their own portal. Staff assign, answer, escalate, merge and close them, with SLA reminders, a knowledge base, reports and a full audit trail.",
    stack: ["Laravel 13", "PHP 8.3", "PostgreSQL", "Alpine.js", "Tailwind CSS 4", "PHPUnit", "Playwright"],
    code: "https://github.com/xtiannjose/Hoshiask",
    cover: desktop("hoshiask", "dashboard", "Hoshiask staff dashboard", "The staff dashboard: open, aging and Severity 1 tickets at a glance."),
    phone: phone("hoshiask", "client-phone", "Hoshiask client portal on a phone", "The client portal on a phone."),
    gallery: [
      desktop("hoshiask", "tickets", "Hoshiask staff ticket list with filters", "The ticket list: tabs, saved views, filters by office and severity, and bulk actions."),
      desktop("hoshiask", "ticket", "A ticket with public replies and internal notes", "What staff see: public replies and internal notes on one thread."),
      desktop("hoshiask", "client-ticket", "The same ticket in the client portal", "What the client sees: the same ticket, public replies only."),
      desktop("hoshiask", "reports", "Hoshiask monthly reports chart", "Reports compare tickets received and completed over 12 months."),
      desktop("hoshiask", "dashboard-dark", "Hoshiask staff dashboard in dark mode", "The staff dashboard in dark mode."),
      phone("hoshiask", "ticket-phone", "A client ticket on a phone", "A ticket and its conversation on a phone."),
    ],
    features: [
      "Clients file and follow tickets in their own portal; staff work them in a separate console.",
      "Tickets move from Open to Closed or Cancelled, with several assignees, escalation and merging of duplicates.",
      "Public replies and internal notes share one thread, and clients only ever see the public side.",
      "SLA reminders, and stale tickets close or cancel themselves after a warning.",
      "Monthly and custom reports, CSV and PDF export, and saved ticket views.",
      "An audit trail, consent tracking and a clean-up that removes personal details from old tickets.",
    ],
    build: [
      {
        title: "The office lives on the ticket",
        body: "Each ticket stores its own field office, so reports stay right when a client moves or their account is deleted.",
      },
      {
        title: "Privacy that keeps the numbers",
        body: "The clean-up removes names and contact details but keeps the ticket row, so past reports and response times never change.",
      },
      {
        title: "One clock for every SLA",
        body: "Every cut-off goes through one business-hours clock that can count around the clock or only working hours.",
      },
      {
        title: "No inline scripts",
        body: "A strict Content Security Policy, made possible by Alpine's CSP build. Backups are encrypted with AES-256-GCM and can be verified and restored.",
      },
      {
        title: "Tested on two databases",
        body: "1,182 PHPUnit tests run on SQLite and again on PostgreSQL 16, with 105 Vitest tests and 20 Playwright tests that include axe accessibility checks.",
      },
    ],
  },
];

export const work: WorkItem[] = [
  {
    slug: "ione-website",
    name: "iOne website",
    summary:
      "The new company site for an ICT provider, replacing an old WordPress site: solutions, case studies, a news section with an online editor, and a meeting request form.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    shots: [desktop("ione", "website", "iOne Resources website home page", "The iOne Resources home page.")],
  },
  {
    slug: "ione-helpdesk",
    name: "iOne Helpdesk",
    summary:
      "The support desk iOne runs with its clients: separate client and staff portals, SLA tracking, escalation, a knowledge base and audit logging.",
    stack: ["Laravel", "PHP", "PostgreSQL"],
    shots: [],
  },
];

/** Tools for the Toolbox section. `logo` is a Simple Icons path; tools it lacks get a generic glyph. */
export type Tool = { name: string; logo?: string };

export const toolbox: { group: string; tools: Tool[] }[] = [
  {
    group: "Frontend",
    tools: [
      { name: "Next.js", logo: siNextdotjs.path },
      { name: "TypeScript", logo: siTypescript.path },
      { name: "Tailwind CSS", logo: siTailwindcss.path },
      { name: "Alpine.js", logo: siAlpinedotjs.path },
    ],
  },
  {
    group: "Backend and data",
    tools: [
      { name: "Laravel", logo: siLaravel.path },
      { name: "PHP", logo: siPhp.path },
      { name: "PostgreSQL", logo: siPostgresql.path },
      { name: "Prisma", logo: siPrisma.path },
      { name: "Better Auth", logo: siBetterauth.path },
    ],
  },
  {
    group: "Testing and shipping",
    tools: [
      { name: "Vitest", logo: siVitest.path },
      { name: "Playwright" },
      { name: "PHPUnit" },
      { name: "Vercel", logo: siVercel.path },
    ],
  },
];

/** Names of the projects and work whose stack lists this tool, at any version ("Next.js 16" counts, "PHPUnit" is not "PHP"). */
export const usedIn = (tool: string) =>
  [...projects, ...work]
    .filter((item) => item.stack.some((entry) => entry === tool || entry.startsWith(`${tool} `)))
    .map((item) => item.name);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
