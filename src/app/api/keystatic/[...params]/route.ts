import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "../../../../../keystatic.config";

// Saves edits: to the files on disk in development, through GitHub on the live site.
// Outside development Keystatic needs the GitHub App's secrets (it throws without them, which would
// fail the build). Until they are set on the deployment, the editor's API answers 404 instead.
const ready =
  process.env.NODE_ENV === "development" ||
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET);

const notSetUp = () => new Response("The editor is not set up on this deployment yet.", { status: 404 });

export const { GET, POST } = ready ? makeRouteHandler({ config }) : { GET: notSetUp, POST: notSetUp };
