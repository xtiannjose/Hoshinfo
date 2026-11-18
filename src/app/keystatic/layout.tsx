import type { Metadata } from "next";

import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Hoshinfo editor",
  robots: { index: false, follow: false },
};

// The editor is a separate app inside the root document: none of the site's styles, header or footer.
export default function KeystaticLayout() {
  return <KeystaticApp />;
}
