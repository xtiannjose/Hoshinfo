import { defineConfig, devices } from "@playwright/test";

// Runs against the production build: `npm run build`, then `npm run test:e2e`.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  // Desktop Chrome, and Safari's engine on an iPhone (where most phone visitors are). For Firefox and
  // desktop Safari too, add { name: "firefox", use: devices["Desktop Firefox"] } and
  // { name: "webkit", use: devices["Desktop Safari"] } and run `npx playwright install firefox webkit`.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone", use: { ...devices["iPhone 15"] } },
  ],
  webServer: { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
