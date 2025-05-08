import { test as setup, expect } from '@playwright/test';

setup('ログイン状態を保存', async ({ page }) => {
  await page.goto('https://your-app.com/login');

  await page.fill('#username', 'your-username');
  await page.fill('#password', 'your-password');
  await page.click('button[type="submit"]');

  // ログイン後のURL確認
  await expect(page).toHaveURL('https://your-app.com/dashboard');

  // 認証状態を保存
  await page.context().storageState({ path: 'auth/storageState.json' });
});
