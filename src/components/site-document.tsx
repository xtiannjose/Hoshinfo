import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { MotionRoot } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Spotlight } from "@/components/spotlight";
import { THEME_SCRIPT } from "@/components/theme";

import "../app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The whole site document: fonts, theme, header and footer around a page. Shared by the site's root
 * layout and by global-not-found.tsx, which skips layouts (the editor has its own root layout, so
 * there is no single one to wrap an unknown address in).
 */
export function SiteDocument({ children }: { children: ReactNode }) {
  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* A Pages Router rule; in the App Router a root document writes <head> directly. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
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
      </body>
    </html>
  );
}
