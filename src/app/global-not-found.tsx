import type { Metadata } from "next";

import { MissingPage } from "@/components/missing-page";
import { SiteDocument } from "@/components/site-document";
import { getSite } from "@/content";

export function generateMetadata(): Metadata {
  const site = getSite();
  return { title: `Page not found | ${site.brand}`, description: site.description };
}

// Any address no route matches, e.g. /foo. It skips layouts, so it brings the whole site document.
export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <MissingPage />
    </SiteDocument>
  );
}
