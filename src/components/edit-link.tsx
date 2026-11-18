"use client";

import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

// Keystatic's GitHub sign-in sets this cookie for the whole site (not httpOnly: the editor reads
// it in the browser). Only its presence is checked here, never its value.
const SIGNED_IN = "keystatic-gh-access-token=";

const canEdit = () => process.env.NODE_ENV === "development" || document.cookie.includes(SIGNED_IN);
// Cookies have no change event; the check runs again on every page load.
const subscribe = () => () => {};

/**
 * A pencil that opens this content's form in the editor (/keystatic/<path>). Shown only to someone
 * signed in to the editor on this browser, and always in development, where the editor needs no
 * sign-in. Visitors never see it; the pages stay static. A visitor who found the address would still
 * meet the editor's GitHub sign-in.
 */
export function EditLink({ path, label }: { path: string; label: string }) {
  const show = useSyncExternalStore(subscribe, canEdit, () => false);
  if (!show) return null;
  return (
    <a
      href={`/keystatic/${path}`}
      aria-label={label}
      title={label}
      className="inline-grid size-8 shrink-0 place-items-center self-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-muted hover:text-ink"
    >
      <PencilSimpleIcon className="size-4" aria-hidden />
    </a>
  );
}
