import { test, expect, Page, Locator } from '@playwright/test';

// ===== 各種定義 =====
const llmModes = ['gpt4o_azure', 'gpt4o_mini_azure', 'claude3_5sonnet', 'o1-mini'] as const;

const promptLabels: Record<string, string> = {
  '590': '再診用①：主訴ごとに分離式',
  '591': '再診用②：Sを主訴ごとに分けない',
  '593': '診療メモ：医師と患者の話者を分離',
  '588': 'インフォームドコンセント',
  '592': '紹介状作成',
  '589': '初診用サマリー形式',
  '595': 'テスト',
  '594': '紹介状の返答文作成',
};

// ランダム選択ユーティリティ
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== テスト本体 =====
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
  

  // ===== LLMモードのランダム選択・設定 =====
  const selectedLLM = getRandomElement([...llmModes]);
  console.log(`使用しているLLMモード: ${selectedLLM}`);

  const llmSelect = page.locator('select[name="llm_setting"]');
  await llmSelect.selectOption(selectedLLM);

  const actualLLM = await page.$eval('select[name="llm_setting"]', el => (el as HTMLSelectElement).value);
  expect(actualLLM).toBe(selectedLLM);

  // ===== プロンプトのランダム選択・表示確認 =====
  const selectedPrompt = getRandomElement(Object.keys(promptLabels));
  const expectedPromptLabel = promptLabels[selectedPrompt];
  console.log(`使用しているプロンプト種類: ${selectedPrompt}`);

  const promptSelect = page.locator('select[name="prompt_setting"]');
  await promptSelect.selectOption(selectedPrompt);

  const promptOption = promptSelect.locator(`option[value="${selectedPrompt}"]`);
  await expect(promptOption).toHaveText(expectedPromptLabel); // 値のラベルを確認

  // ▼ 選択された値をログに出す
  const actualPromptValue = await page.$eval('select[name="prompt_setting"]', el => (el as HTMLSelectElement).value);
  console.log(`✅ 選択された値: ${actualPromptValue}`);

  const updateButton = page.getByRole('button', { name: /^更新$/ }).nth(0);
  await expect(updateButton).toBeVisible();
  await updateButton.click();

  await page.waitForTimeout(5000); // 5000ms = 5秒

/*/ ===== 所属組織のランダム選択・更新 =====
const organizationSelect = page.locator('select[name="organization_id"]');
await organizationSelect.waitFor({ state: 'visible' });

// 現在の選択値を取得
const currentOrgValue = await organizationSelect.inputValue();
console.log('現在の所属組織:', currentOrgValue);

// 選択肢から現在値以外を取得
const availableOrgValues = await organizationSelect.locator('option').evaluateAll((options, current) =>
  options
    .map(opt => (opt as HTMLOptionElement).value)
    .filter(val => val !== 'null' && val !== current),
  currentOrgValue
);

// 値が存在しなければ中断
if (availableOrgValues.length === 0) {
  throw new Error('⚠️ 選択可能な異なる所属組織がありません');
}

// ランダムに選択
const selectedOrg = getRandomElement(availableOrgValues);
console.log(`🆕 選択された所属組織: ${selectedOrg}`);

// 選択を反映
await organizationSelect.selectOption(selectedOrg);

// イベントを強制発火（Reactなどの対策）
await organizationSelect.evaluate((el: HTMLSelectElement) => {
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
});

// 反映確認
const selectedValue = await organizationSelect.inputValue();
expect(selectedValue).toBe(selectedOrg);
console.log('✅ 反映された所属組織:', selectedValue);

await page.screenshot({ path: 'select.png', fullPage: true });

// Locator 型で明示
const orgSection: Locator = organizationSelect.locator('..').locator('..');

// 更新ボタン取得
const orgUpdateButton = orgSection.getByRole('button', { name: '更新' });
await expect(orgUpdateButton).toBeVisible();

// 更新を待つ
const [response] = await Promise.all([
  page.waitForResponse(res =>
    res.url().includes('/admin/users') &&
    res.request().method() === 'PATCH' &&
    res.ok()
  ),
  orgUpdateButton.click()
]);

// 更新後の確認（1秒待機ののち）
await page.waitForTimeout(1000);
const afterUpdateValue = await organizationSelect.inputValue();
console.log('🔁 更新後の所属組織:', afterUpdateValue);
await page.screenshot({ path: 'update.png', fullPage: true });

expect(afterUpdateValue).toBe(selectedOrg);

*/

});