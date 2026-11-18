import type { Metadata } from "next";

import { MissingPage } from "@/components/missing-page";
import { SiteChrome } from "@/components/site-chrome";
import { getSite } from "@/content";

export function generateMetadata(): Metadata {
  const site = getSite();
  return { title: `Page not found | ${site.brand}`, description: site.description };
}

// Any address no route matches (e.g. /foo), and unknown case studies, which src/proxy.ts sends here.
// It renders outside the site's layout, so it brings the site's chrome itself.
export default function NotFound() {
  return (
    <SiteChrome>
      <MissingPage />
    </SiteChrome>
  );
}
