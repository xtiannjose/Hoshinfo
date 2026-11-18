import type { MetadataRoute } from "next";

import { getSite } from "@/content";

export default function robots(): MetadataRoute.Robots {
  const { url } = getSite();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/"] },
    sitemap: new URL("/sitemap.xml", url).toString(),
  };
}
