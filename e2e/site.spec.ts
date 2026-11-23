import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/projects/hoshikopi", "/projects/hoshimono", "/projects/hoshiask"];

/** Scrolls the page through once, so lazy images have loaded before checks. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

test.describe("every page", () => {
  for (const path of pages) {
    test(`${path} loads without errors, sideways scroll or missing previews`, async ({ page }) => {
      test.slow(); // four widths per page; Firefox needs the extra time
      const errors: string[] = [];
      // Safari reports a background prefetch (?_rsc=) that the next navigation cancels, sometimes as a
      // console error and sometimes as an uncaught one; neither is a fault in the page.
      const record = (text: string) => !/_rsc=.*access control checks/.test(text) && errors.push(text);
      page.on("pageerror", (e) => record(e.message));
      page.on("console", (m) => m.type() === "error" && record(m.text()));
      for (const width of [1440, 768, 390, 360]) {
        await page.setViewportSize({ width, height: 800 });
        // Firefox revalidates a page it has just loaded and reports 304 Not Modified.
        expect([200, 304]).toContain((await page.goto(path))?.status());
        await scrollThrough(page);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth, `page wider than ${width}px`).toBeLessThanOrEqual(width);
      }
      expect(errors).toEqual([]);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    });
  }

  for (const path of ["/foo", "/projects/does-not-exist"]) {
    test(`${path} is a 404 with a way back`, async ({ page }) => {
      expect((await page.goto(path))?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page could not be found");
      await expect(page.getByRole("link", { name: "Home page" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached(); // the site's chrome
    });
  }
});

test.describe("accessibility (WCAG 2.2 AA)", () => {
  for (const [theme, hour] of [["Day", 10], ["Night", 21]] as const) {
    for (const path of ["/", "/projects/hoshikopi"]) {
      test(`${path} in ${theme}`, async ({ page }) => {
        test.slow(); // axe on the full home page takes longer in Firefox
        await page.clock.setFixedTime(new Date(2026, 10, 19, hour));
        await page.goto(path);
        await scrollThrough(page);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          // Carousel cards off screen are faded on purpose; they reach full colour as they slide in.
          .exclude('article[aria-roledescription="slide"].opacity-40')
          .analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
      });
    }
  }

  test("the first Tab is a skip link to the content", async ({ page, browserName }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: "Skip to content" });
    // Safari's Tab skips links on every site unless the user turns on "Press Tab to highlight each item"
    // (or uses Option+Tab, which this WebKit build cannot press), so there it is focused directly.
    if (browserName === "webkit") await skip.focus();
    else await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("header", () => {
  test("Projects dropdown: caret hover, keyboard and Escape", async ({ page }) => {
    await page.goto("/");
    const caret = page.getByRole("button", { name: "Project case studies" });
    const menu = page.locator("#projects-menu");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" }).hover();
    await expect(menu).toHaveCount(0);
    await caret.hover();
    await expect(menu).toBeVisible();
    await page.mouse.move(700, 700);
    await expect(menu).toHaveCount(0);
    await caret.focus();
    await page.keyboard.press("Enter");
    await expect(caret).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(caret).toBeFocused();
  });

  test("Day and Night follow the clock, and a pinned choice survives a reload", async ({ page }) => {
    const theme = () => page.evaluate(() => document.documentElement.dataset.theme);
    await page.clock.setFixedTime(new Date(2026, 10, 19, 10));
    await page.goto("/");
    expect(await theme()).toBe("day");
    await page.clock.setFixedTime(new Date(2026, 10, 19, 20));
    await page.reload();
    expect(await theme()).toBe("night");
    await page.getByTitle("Day").filter({ visible: true }).first().click(); // header switch, or the footer's on phones
    await page.reload();
    expect(await theme()).toBe("day");
  });
});

test("case studies show How it fits together: numbered tiers, plain words, technical names", async ({ page }) => {
  await page.goto("/projects/hoshiask");
  const diagram = page.locator("section[aria-labelledby=architecture-title]");
  await expect(diagram.getByRole("heading", { level: 2 })).toHaveText("How it fits together");
  // The tier numbers are hidden from screen readers, so the headings' names are the words alone.
  const tiers = diagram.getByRole("heading", { level: 3 });
  await expect(tiers).toHaveCount(3);
  for (const [i, name] of ["People who use it", "The help desk", "What the website relies on"].entries()) {
    await expect(tiers.nth(i)).toHaveAccessibleName(name);
  }
  await expect(diagram.getByText("Database", { exact: true })).toBeVisible();
  await expect(diagram.getByText("PostgreSQL 16")).toBeVisible(); // the technical name, small
});

test("the carousel card fits on screen", async ({ page }) => {
  for (const [width, height] of [[1920, 950], [1440, 800], [1280, 720]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const bottom = await page.evaluate(() => document.querySelector('[aria-roledescription="slide"] .rounded-xl.border')!.getBoundingClientRect().bottom);
    expect(bottom, `${width}x${height}`).toBeLessThanOrEqual(height);
  }
});

test("contact: Get in touch emails the owner", async ({ page }) => {
  await page.goto("/");
  const contact = page.getByRole("link", { name: "Get in touch" });
  await expect(contact).toHaveCount(2); // under the page title and in the footer
  for (const link of await contact.all()) await expect(link).toHaveAttribute("href", /^mailto:[^@\s]+@[^@\s]+\.\w+$/);
  expect(await page.getByRole("link", { name: /^Email / }).count()).toBeGreaterThan(0); // footer icon, and the header's from lg up
});

test("edit pencils: hidden from visitors, shown to the signed-in owner", async ({ page, context }) => {
  const pencils = page.locator('a[href^="/keystatic/"]:not([inert] *)');
  await page.goto("/");
  await expect(pencils).toHaveCount(0);
  await context.addCookies([{ name: "keystatic-gh-access-token", value: "x", domain: "localhost", path: "/" }]);
  await page.reload();
  await expect(page.getByRole("link", { name: "Edit experience" })).toHaveAttribute("href", "/keystatic/singleton/experience");
});

test("the editor loads none of the site's styles", async ({ request }) => {
  // Both share the root layout's font file; the site's own stylesheet (its tokens, Tailwind's reset)
  // must stay off the editor, or it would restyle Keystatic.
  const sheets = async (path: string) => {
    const html = await (await request.get(path)).text();
    const hrefs = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    return Promise.all(hrefs.map(async (href) => (await request.get(href)).text()));
  };
  const hasSiteStyles = (css: string) => css.includes("--star-soft");
  expect((await sheets("/")).some(hasSiteStyles)).toBe(true);
  expect((await sheets("/keystatic")).some(hasSiteStyles)).toBe(false);
});

test("security headers: strict policy on the site, framing blocked on the editor", async ({ request }) => {
  const site = (await request.get("/")).headers();
  expect(site["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(site["content-security-policy"]).toContain("connect-src 'self'");
  expect(site["content-security-policy"]).not.toContain("vercel.live"); // the toolbar is for previews only
  expect(site["x-content-type-options"]).toBe("nosniff");
  const editor = (await request.get("/keystatic")).headers();
  expect(editor["content-security-policy"]).toBe("frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
  expect(editor["x-frame-options"]).toBe("DENY");
});

test("robots.txt and the sitemap list the case studies, not the editor", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /keystatic");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of pages.slice(1)) expect(sitemap).toContain(path);
});
