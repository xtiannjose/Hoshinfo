import type { MetadataRoute } from "next";

import { getSite, readProjects } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite();
  return [
    { url: new URL("/", url).toString(), priority: 1 },
    ...readProjects().map((p) => ({ url: new URL(`/projects/${p.slug}`, url).toString(), priority: 0.8 })),
  ];
}
