import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/browser',
  use: {
    baseURL: 'http://127.0.0.1:4321/physics/',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
  },
  webServer: {
    command: `sh -c 'trap "npx astro preview stop" EXIT; npx astro preview --host 127.0.0.1; sleep infinity'`,
    url: 'http://127.0.0.1:4321/physics/',
    reuseExistingServer: !process.env['CI'],
  },
});
