# Hoshinfo

Christian Jose's portfolio: the Hoshi projects ([Hoshikopi](https://github.com/xtiannjose/Hoshikopi), [Hoshimono](https://github.com/xtiannjose/Hoshimono), [Hoshiask](https://github.com/xtiannjose/Hoshiask)) with screenshots and short case studies, plus a look at work built at iOne Resources (no links: that code is private).

Next.js 16 (Cache Components), TypeScript, Tailwind CSS 4, Geist and Phosphor icons, with [Keystatic](https://keystatic.com) as the editor. Every page is prerendered; there is no database: content is JSON in `content/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run test:e2e   # Playwright checks against that build; first time: npx playwright install chromium
```

CI (`.github/workflows/ci.yml`) runs lint, the build and the Playwright checks on every pull request and every push to `main`, editor saves included. The checks in `e2e/` cover every page at four widths (no errors, no sideways scroll, link previews), the 404 pages, WCAG 2.2 AA in Day and Night with axe, the skip link, the Projects dropdown, the clock-driven theme, the carousel fitting on screen, the editor's pencils, the security headers, and `robots.txt` and the sitemap.

## Where things are

| What | Where |
| --- | --- |
| Name, role, links, email, intro lines | `content/site.json` |
| Experience, Toolbox | `content/experience.json`, `content/toolbox.json` |
| Projects and case studies | `content/projects/<address>.json` |
| iOne work | `content/work/<address>.json` |
| Screenshots | `public/shots/<address>/` |
| Editor fields | `keystatic.config.ts` |
| How pages read the content | `src/content/index.ts` |
| Where the numbers come from (test counts, versions, decisions) | `docs/facts/` |
| Colours and motion | `src/app/globals.css` |

## Editing

Open `/keystatic` to add or change projects, company work, experience, the toolbox and site details, screenshots included.

- **On your computer:** `npm run dev`, then http://127.0.0.1:3000/keystatic. Saving writes the files in `content/` and `public/shots/`; commit and push them like any change.
- **On the live site:** https://hoshinfo.vercel.app/keystatic, after the one-time GitHub setup below. You sign in with GitHub, and only accounts with write access to this repository can save. Each save is a commit to `main`, which Vercel deploys in about a minute.

Once you are signed in to the editor, pencil buttons appear on the site itself (on the page title, each section heading, each project and the case studies) and open that content's form; visitors never see them, and in `npm run dev` they always show.

Keystatic names screenshot files after their place in the form (`gallery/2/image.png`), so reordering screenshots renames their files; that is expected.

### One-time GitHub setup for the live editor

1. Create `.env.local` with `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`, run `npm run dev` and open http://127.0.0.1:3000/keystatic, then **Log in with GitHub**, which leads to Keystatic's setup page.
2. Under **Deployed App URL** enter `https://hoshinfo.vercel.app` (this registers the live site's sign-in callback), leave the organization blank, and click **Create GitHub App**. On GitHub, confirm the app name and create it. Keystatic writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to `.env`, which git ignores. Keep the two secrets out of the repository and out of chats.
3. Install the new GitHub App on the Hoshinfo repository only (GitHub offers this right after creating it).
4. Add the four variables to the Vercel project (Settings, Environment Variables, Production) and redeploy.
5. Remove `NEXT_PUBLIC_KEYSTATIC_STORAGE` from `.env.local` to edit local files again.

If the Deployed App URL was left blank, add `https://hoshinfo.vercel.app/api/keystatic/github/oauth/callback` as a callback URL in the app's settings on GitHub.

Until the variables are on Vercel, the live editor's API answers 404 and the rest of the site is unaffected.

## Screenshots

Desktop shots are 1440x900 at 2x (2880x1800 px), phone shots 390 or 412 px wide at 2x. The site reads each file's pixel size itself. They are taken with Playwright from the live Hoshikopi site and from local runs of Hoshimono and Hoshiask on fictional demo data. Before adding one, check it shows no real names, phone numbers or addresses.

## Deploy

Vercel, imported from GitHub. The site needs no environment variables; the live editor needs the four from the GitHub setup above.
