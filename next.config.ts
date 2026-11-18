import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
