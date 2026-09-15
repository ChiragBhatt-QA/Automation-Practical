import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'https://thekanaa.com/ar-sa/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testMatch: /authentication\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', testMatch: /authentication\.spec\.ts/, use: { ...devices['iPhone 13'] } },
    { name: 'local-mock', testMatch: /local-mock-otp\.spec\.ts/, use: { baseURL: 'http://127.0.0.1:4173' } },
  ],
  webServer: { command: 'node mock-app/server.js', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
