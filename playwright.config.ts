import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/editor',
  fullyParallel: false,
  use: {
    baseURL: process.env.EDITOR_TEST_URL || 'http://127.0.0.1:4321',
    channel: 'chrome',
    headless: true,
  },
});
