import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

// The site's Content Security Policy. Next's own inline scripts differ on every page, and nonces would
// make every page dynamic, so scripts keep 'unsafe-inline' (Hoshikopi's ADR 0013 makes the same call).
// What it does block: scripts, styles and fonts from other sites, sending data anywhere but this site
// (connect-src, img-src), plugins, <base> tricks, and being framed. Development adds what hot reload needs.
// Preview deployments (VERCEL_ENV, set at build time) also allow Vercel's toolbar and comments, with the
// hosts Vercel's docs list; production never does.
const preview = process.env.VERCEL_ENV === "preview";
const toolbar = (hosts: string) => (preview ? ` ${hosts}` : "");
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${toolbar("https://vercel.live")}`,
  `style-src 'self' 'unsafe-inline'${toolbar("https://vercel.live")}`,
  `img-src 'self' data: blob:${toolbar("https://vercel.live https://vercel.com")}`,
  `font-src 'self'${toolbar("https://vercel.live https://assets.vercel.com")}`,
  `connect-src 'self'${dev ? " ws:" : ""}${toolbar("https://vercel.live wss://ws-us3.pusher.com")}`,
  ...(preview ? ["frame-src https://vercel.live"] : []),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// The editor talks to GitHub from the browser; it gets only the rules that cannot break it.
// frame-ancestors matters most here: no other site may load the editor in a hidden frame.
const editorCsp = "frame-ancestors 'none'; object-src 'none'; base-uri 'self'";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Development only: Keystatic's GitHub sign-in returns to 127.0.0.1, which the dev server
  // otherwise refuses (it trusts only localhost), leaving the editor blank.
  allowedDevOrigins: ["127.0.0.1"],
  // Pages read content/*.json with fs (src/content/index.ts) and src/proxy.ts checks content/projects on
  // each case study request, so the JSON ships with the server functions.
  outputFileTracingIncludes: {
    "/**/*": ["./content/**/*.json"],
  },
  // Later rules override earlier ones for the same header.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      { source: "/((?!keystatic|api/keystatic).*)", headers: [{ key: "Content-Security-Policy", value: siteCsp }] },
      { source: "/keystatic/:path*", headers: [{ key: "Content-Security-Policy", value: editorCsp }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
