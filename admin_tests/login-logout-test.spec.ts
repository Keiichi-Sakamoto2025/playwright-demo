import { test, expect } from '@playwright/test';

test('ログインできること + プロンプト確認', async ({ page }) => {
  await page.goto('https://dev.d5q9i5ebfuc1x.amplifyapp.com/');
  await page.fill('input[name="email"]', 'keiichi.sakamoto@pleap.jp');
  await page.fill('input[name="password"]', 'Medimo2025!!');

  await Promise.all([
    page.waitForURL(/\/admin\/users/),
    page.click('button[type="submit"]'),
  ]);

  const row = page.locator('tr', { hasText: '坂本恵一' });
  await expect(row).toBeVisible({ timeout: 10000 });

  const openLink = row.locator('a', { hasText: '開く' });
  await expect(openLink).toBeVisible({ timeout: 10000 });
  await openLink.click();

  await expect(page.locator('text=坂本恵一テスト医療')).toBeVisible({ timeout: 10000 });

});
