import type { Metadata } from "next";

import { MissingPage } from "@/components/missing-page";

export const metadata: Metadata = { title: "Page not found" };

// notFound() inside the site, e.g. /projects/<unknown>.
export default function NotFound() {
  return <MissingPage />;
}
