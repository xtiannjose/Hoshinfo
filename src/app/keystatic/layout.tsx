import type { Metadata } from "next";

import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Hoshinfo editor",
  robots: { index: false, follow: false },
};

// Its own root layout: the editor is a separate app, without the site's header, footer and theme.
export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
