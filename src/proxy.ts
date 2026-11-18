import fs from "node:fs";
import path from "node:path";

import { NextResponse, type NextRequest } from "next/server";

/**
 * An unknown case study answers 404 from the start. Without this, Next streams the page's shell with
 * a 200 before the page finds out the project does not exist (Cache Components has no
 * dynamicParams = false). Known projects pass straight through to their prerendered pages.
 * Reads content/projects on each request (one file check), so a project added in the editor counts at once.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  const known = /^[a-z0-9-]+$/.test(slug) && fs.existsSync(path.join(process.cwd(), "content/projects", `${slug}.json`));
  // Rewriting to an address no route matches renders the 404 page with a 404 status.
  return known ? NextResponse.next() : NextResponse.rewrite(new URL("/_unknown-project", request.url));
}

export const config = { matcher: "/projects/:slug" };
