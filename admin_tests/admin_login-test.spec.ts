import { test, expect } from '@playwright/test';

test('ログインできること', async ({ page }) => {
  await page.goto('https://dev.d5q9i5ebfuc1x.amplifyapp.com/');

  await page.fill('input[name="email"]', 'keiichi.sakamoto@pleap.jp');
  await page.fill('input[name="password"]', 'Medimo2025!!');

  await Promise.all([
    page.waitForURL(/\/admin\/users/),
    page.click('button[type="submit"]'),
  ]);

  console.log('After login URL:', page.url());

  // ログアウトボタンの表示確認（複数ある場合に備えて1つ選ぶ）
  const logoutButton = page.getByRole('button', { name: /^ログアウト$/ }).nth(0);
  await expect(logoutButton).toBeVisible();

    // ログアウトを実行
    await logoutButton.click();

    // ログアウト後にログイン画面に戻る or URLを確認
    await expect(page).toHaveURL(/\/(login|signin|auth|)$/);
  
    // ログインフォームの表示でログアウト完了を確認
    await expect(page.locator('input[name="email"]')).toBeVisible();
});



  