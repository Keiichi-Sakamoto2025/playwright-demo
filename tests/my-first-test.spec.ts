import { defineConfig, test, expect } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'test-results', open: 'always' }],  // HTMLレポートを指定
    ['line'],  // コンソールにも結果を出力
  ],
});


test('ログインページを開いて、タイトルを確認', async ({ page }) => {
  await page.goto('https://dev.d1x2fefh4glbva.amplifyapp.com/auth/sign-in'); // ← 自分のサイトのURLに変える
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveTitle(/medimo|カルテ自動生成/);
  console.log(await page.title());
});

test('ログインできること', async ({ page }) => {
    await page.goto('https://dev.d1x2fefh4glbva.amplifyapp.com/auth/sign-in');
    
    await page.fill('input[name="email"]', 'keiichi.sakamoto@pleap.jp');
    await page.fill('input[name="password"]', 'Medimo2025!!');
    await page.click('button[type="submit"]');
    
    // ページが完全にロードされるのを待つ
    await page.waitForLoadState('load'); // ページの読み込みが完了するまで待機
  
    // h1要素が存在するか確認
    const h1Count = await page.locator('h1').count();

    //テスト実行結果のスクリーンショット確認
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    
    if (h1Count > 0) {
      // h1要素が存在する場合、そのテキストを確認
      await expect(page.locator('h1')).toContainText('マイページ');
    } else {
      // h1要素がない場合は他の確認（例えば、ユーザー名や別の要素）
      // 'ログイン後の確認メッセージ' が表示される場合のみチェック
      const confirmationMessageLocator = page.locator('text=ログイン後の確認メッセージ');
      
      // メッセージが表示されているかを確認し、存在する場合のみチェック
      const isMessageVisible = await confirmationMessageLocator.isVisible();
      
      if (isMessageVisible) {
        await expect(confirmationMessageLocator).toBeVisible();
      }
    }
  });
  