import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Development only: Keystatic's GitHub sign-in returns to 127.0.0.1, which the dev server
  // otherwise refuses (it trusts only localhost), leaving the editor blank.
  allowedDevOrigins: ["127.0.0.1"],
  // Pages read content/*.json with fs (src/content/index.ts). Every page is prerendered, but an unknown
  // /projects/<slug> renders at request time, so the JSON ships with the server functions.
  outputFileTracingIncludes: {
    "/**/*": ["./content/**/*.json"],
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
