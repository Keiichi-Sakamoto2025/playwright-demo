import { test as setup, expect } from '@playwright/test';

setup('ログイン状態を保存', async ({ page }) => {
  await page.goto('https://dev.d1x2fefh4glbva.amplifyapp.com/auth/sign-in');

  await page.fill('input[name="email"]', 'keiichi.sakamoto@pleap.jp');
  await page.fill('input[name="password"]', 'Medimo2025!!');
  await page.click('button[type="submit"]');

  // ログイン後のURL確認
  await expect(page).toHaveURL(/\/consults(\/|$|\?)/);

  // 認証状態を保存
  await page.context().storageState({ path: 'auth/storageState.json' });
});
