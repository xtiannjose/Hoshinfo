import { EnvelopeSimpleIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react/ssr";

import { Boop } from "@/components/boop";
import { getSite } from "@/content";

/** Round icon-only links to the owner's profiles. "md" sits next to a pill button; "sm" fits the footer. */
export function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const site = getSite();
  const links = [
    { href: site.github, label: "GitHub", Icon: GithubLogoIcon },
    { href: site.linkedin, label: "LinkedIn", Icon: LinkedinLogoIcon },
    { href: `mailto:${site.email}`, label: `Email ${site.email}`, Icon: EnvelopeSimpleIcon },
  ];
  const box = size === "sm" ? "size-9" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-5";
  return (
    <ul className="flex gap-2">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            // Profiles open in a new tab; email opens the mail app, so no empty tab is left behind.
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            aria-label={label}
            title={label}
            className={`flex ${box} items-center justify-center rounded-full border border-line text-muted transition hover:border-muted hover:text-ink active:translate-y-px`}
          >
            <Boop rotate={-10} scale={1.15} fromParent>
              <Icon className={icon} aria-hidden />
            </Boop>
          </a>
        </li>
      ))}
    </ul>
  );
}
