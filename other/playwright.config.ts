import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: 0,

  use: {
    baseURL: 'https://dev.d5q9i5ebfuc1x.amplifyapp.com/',
    trace: 'on-first-retry',
  },

  projects: [
    // デスクトップ版（Chromium）
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth/storageState.json', // ← 保存済みログインセッションを再利用
      },
    },
    // モバイル版（iPhone 15）
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 15'],
        storageState: 'auth/storageState.json',
      },
    },
  ],
});
