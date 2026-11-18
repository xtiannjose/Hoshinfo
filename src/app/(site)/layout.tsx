import type { Metadata } from "next";

import { SiteDocument } from "@/components/site-document";
import { getSite } from "@/content";

export function generateMetadata(): Metadata {
  const site = getSite();
  const title = `${site.name}, ${site.role.toLowerCase()}`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | ${site.brand}` },
    description: site.description,
    alternates: { canonical: "/" },
    // Link previews (LinkedIn, Slack, email). The image is opengraph-image.tsx next to this file.
    openGraph: { type: "website", siteName: site.brand, title, description: site.description, url: "/" },
    twitter: { card: "summary_large_image" },
  };
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteDocument>{children}</SiteDocument>;
}
