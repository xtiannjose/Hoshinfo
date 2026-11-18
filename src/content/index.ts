import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

/**
 * The site's content, edited at /keystatic (keystatic.config.ts) and stored as JSON under content/.
 * Read with sync file reads, which Next prerenders like module imports; in development every
 * request reads the files again, so a save shows on refresh. Server only.
 *
 * Unknown /projects/<slug> addresses render at request time (Cache Components has no
 * dynamicParams = false), so that path reads only the JSON, which next.config.ts ships with the
 * route, and never a screenshot: header names and slug lookups go through readProjects().
 */

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  kind: "desktop" | "phone";
  /** Pixel size of the file, read from the file itself. */
  size: [number, number];
  /** For a desktop shot: the same page on a phone, if there is one. */
  phone?: Shot;
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
  /** Who it was built for, e.g. iOne Resources. */
  company: string;
  summary: string;
  stack: string[];
  /** Empty when the screens cannot be shown. */
  shots: Shot[];
};

export type Role = {
  /** Shown in the date column, e.g. "Nov 2025 - Now". */
  period: string;
  title: string;
  org: string;
  /** Where the entry leads, if anywhere: a section of this page or an outside link. */
  href?: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

/** `logo` is a Simple Icons path; tools without one get a generic glyph. */
export type Tool = { name: string; logo?: string };

// The JSON as Keystatic writes it. Optional fields can be missing, null or "".
type RawScreen = { kind?: "desktop" | "phone"; image: string; alt: string; caption: string; phone?: string | null };
type RawProject = Omit<Project, "slug" | "live" | "cover" | "phone" | "gallery"> & {
  slug: string;
  order: number;
  live?: string | null;
  cover: RawScreen;
  phone: RawScreen;
  gallery: RawScreen[];
};
type RawWork = Omit<WorkItem, "slug" | "shots"> & { slug: string; order: number; shots: RawScreen[] };

const root = path.join(process.cwd(), "content");
const read = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

/** Every entry of a collection folder, slug from the file name, in `order` then name order. */
function entries<T extends { order: number; name: string }>(dir: string): (T & { slug: string })[] {
  return fs
    .readdirSync(path.join(root, dir))
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ ...read<T>(`${dir}/${file}`), slug: file.slice(0, -".json".length) }))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

// Sizes by file, so a page that shows a screenshot several times reads its header once.
const sizes = new Map<string, [number, number]>();

/** Width and height of a file under public/. The first 64 kB hold them for PNG, WebP and most JPEGs. */
function sizeOf(src: string): [number, number] {
  const file = path.join(process.cwd(), "public", src);
  const key = `${file}:${fs.statSync(file).mtimeMs}`;
  let size = sizes.get(key);
  if (!size) {
    const fd = fs.openSync(file, "r");
    const head = new Uint8Array(65536);
    const bytes = fs.readSync(fd, head, 0, head.length, 0);
    fs.closeSync(fd);
    let dims;
    try {
      dims = imageSize(head.subarray(0, bytes));
    } catch {
      dims = imageSize(fs.readFileSync(file)); // a JPEG with a long header
    }
    if (!dims.width || !dims.height) throw new Error(`Cannot read the size of ${src}`);
    size = [dims.width, dims.height];
    sizes.set(key, size);
  }
  return size;
}

function shot(raw: RawScreen, kind: Shot["kind"] = raw.kind ?? "desktop"): Shot {
  return {
    src: raw.image,
    alt: raw.alt,
    caption: raw.caption,
    kind,
    size: sizeOf(raw.image),
    ...(raw.phone && {
      phone: { src: raw.phone, alt: `${raw.alt}, on a phone`, caption: raw.caption, kind: "phone" as const, size: sizeOf(raw.phone) },
    }),
  };
}

export const getSite = () =>
  read<{
    brand: string;
    name: string;
    role: string;
    description: string;
    projectsIntro: string;
    github: string;
    linkedin: string;
    url: string;
  }>("site.json");

export const getExperience = (): Role[] =>
  read<{ roles: Role[] }>("experience.json").roles.map((role) => ({ ...role, href: role.href || undefined }));

/** Projects without their screenshots: names and links, cheap to read. */
export const readProjects = () => entries<RawProject>("projects");

function project(raw: RawProject & { slug: string }): Project {
  return {
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline,
    summary: raw.summary,
    stack: raw.stack,
    live: raw.live || undefined,
    code: raw.code,
    cover: shot(raw.cover, "desktop"),
    phone: shot(raw.phone, "phone"),
    gallery: raw.gallery.map((s) => shot(s)),
    features: raw.features,
    build: raw.build,
  };
}

export const getProjects = (): Project[] => readProjects().map(project);

export function getProject(slug: string): Project | undefined {
  const raw = readProjects().find((p) => p.slug === slug);
  return raw && project(raw);
}

export const getWork = (): WorkItem[] =>
  entries<RawWork>("work").map((w) => ({
    slug: w.slug,
    name: w.name,
    company: w.company,
    summary: w.summary,
    stack: w.stack,
    shots: w.shots.map((s) => shot(s, "desktop")),
  }));

/** The SVG path of a Simple Icons logo, by its slug. An unknown slug gets the generic glyph, not a failed build. */
function logo(slug: string): string | undefined {
  const file = path.join(process.cwd(), "node_modules/simple-icons/icons", `${path.basename(slug)}.svg`);
  if (!slug || !fs.existsSync(file)) return undefined;
  return fs.readFileSync(file, "utf8").match(/ d="([^"]+)"/)?.[1];
}

export const getToolbox = (): { group: string; tools: Tool[] }[] =>
  read<{ groups: { name: string; tools: { name: string; logo: string }[] }[] }>("toolbox.json").groups.map((g) => ({
    group: g.name,
    tools: g.tools.map((t) => ({ name: t.name, logo: logo(t.logo) })),
  }));

/** Names of the projects and work whose stack lists this tool, at any version ("Next.js 16" counts, "PHPUnit" is not "PHP"). */
export const usedIn = (tool: string, items: { name: string; stack: string[] }[]) =>
  items.filter((item) => item.stack.some((entry) => entry === tool || entry.startsWith(`${tool} `))).map((item) => item.name);
