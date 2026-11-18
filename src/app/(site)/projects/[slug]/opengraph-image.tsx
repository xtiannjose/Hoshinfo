import { notFound } from "next/navigation";

import { ogCard, ogSize } from "@/components/og-card";
import { getSite, readProjects } from "@/content";

export const alt = "Case study preview: project name and what it is";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return readProjects().map((project) => ({ slug: project.slug }));
}

// A case study's link preview: the project's name and tagline.
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = readProjects().find((p) => p.slug === slug);
  if (!project) notFound();
  const site = getSite();
  return ogCard({ label: `${site.brand}  ·  Case study`, title: project.name, line: project.tagline, footer: `${site.name}, ${site.role}` });
}
