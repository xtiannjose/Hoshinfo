import type { ReactNode } from "react";

import { MotionRoot } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Spotlight } from "@/components/spotlight";

import "../app/globals.css";

/**
 * The site around a page: its styles, the skip link, header and footer. Used by the site's layout and
 * by the root 404 page (which renders outside that layout); never by the editor.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      {/* First stop for keyboard users: past the header and the carousel controls. */}
      <a
        href="#main"
        className="sr-only rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>
      <MotionRoot>
        <Spotlight />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 scroll-mt-20 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </MotionRoot>
    </>
  );
}
