import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { MotionRoot } from "@/components/motion-root";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Spotlight } from "@/components/spotlight";
import { THEME_SCRIPT } from "@/components/theme";
import { site } from "@/content/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.role.toLowerCase()}`,
    template: `%s | ${site.brand}`,
  },
  description:
    "Projects by Christian Jose: Hoshikopi, Hoshimono and Hoshiask. Web apps for orders, groceries and help desks, built test-first.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <MotionRoot>
          <Spotlight />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </MotionRoot>
      </body>
    </html>
  );
}
