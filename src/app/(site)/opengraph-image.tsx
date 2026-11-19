import { ogCard, ogSize } from "@/components/og-card";
import { getSite, readProjects } from "@/content";

export const alt = "Portfolio preview: name, role and projects";
export const size = ogSize;
export const contentType = "image/png";

// The site's link preview: name, role and the projects.
export default function OpengraphImage() {
  const site = getSite();
  return ogCard({
    label: "Portfolio",
    title: site.name,
    line: site.role,
    footer: readProjects()
      .map((p) => p.name)
      .join("  ·  "),
  });
}
