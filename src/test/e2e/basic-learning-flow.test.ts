/**
 * ENTP英語学習アプリ - 基本学習フロー E2Eテスト
 *
 * 主要学習モードの自動テスト
 * - 語彙学習
 * - 文法クイズ
 * - 英作文
 * - 総合テスト
 */

// @ts-ignore
import { expect, test } from "@playwright/test";

test.describe("基本学習フロー E2Eテスト", () => {
  test.beforeEach(async ({ page }: any) => {
    // 各テスト前にホーム画面に移動
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("ホーム画面の表示確認", async ({ page }: any) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/ENTP英語学習アプリ/);

    // 主要ナビゲーションボタンの存在確認
    await expect(
      page.locator('[data-testid="vocabulary-learning"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="grammar-quiz"]')).toBeVisible();
    await expect(page.locator('[data-testid="essay-writing"]')).toBeVisible();
    await expect(page.locator('[data-testid="combined-test"]')).toBeVisible();

    // XP・レベルシステムの表示確認
    await expect(page.locator('[data-testid="xp-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="level-display"]')).toBeVisible();

    // ハートシステムの表示確認
    await expect(page.locator('[data-testid="heart-system"]')).toBeVisible();
  });

  test("語彙学習フロー", async ({ page }: any) => {
    // 語彙学習ボタンをクリック
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    // 語彙学習ページの表示確認
    await expect(page).toHaveURL(/.*vocabulary/);

    // レベル選択の存在確認
    await expect(page.locator('[data-testid="level-selector"]')).toBeVisible();

    // カテゴリー選択の存在確認
    await expect(
      page.locator('[data-testid="category-selector"]')
    ).toBeVisible();

    // 学習開始ボタンの存在確認
    await expect(page.locator('[data-testid="start-learning"]')).toBeVisible();

    // 初級レベルを選択
    await page.click('[data-testid="level-beginner"]');

    // TOEICカテゴリーを選択
    await page.click('[data-testid="category-toeic"]');

    // 学習開始
    await page.click('[data-testid="start-learning"]');
    await page.waitForLoadState("networkidle");

    // 語彙カードの表示確認
    await expect(page.locator('[data-testid="vocabulary-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="word-display"]')).toBeVisible();

    // カードフリップ機能のテスト
    await page.click('[data-testid="flip-card"]');
    await expect(page.locator('[data-testid="meaning-display"]')).toBeVisible();

    // 次のカードへ進む
    await page.click('[data-testid="next-card"]');
    await expect(page.locator('[data-testid="vocabulary-card"]')).toBeVisible();
  });

  test("文法クイズフロー", async ({ page }: any) => {
    // 文法クイズボタンをクリック
    await page.click('[data-testid="grammar-quiz"]');
    await page.waitForLoadState("networkidle");

    // 文法クイズページの表示確認
    await expect(page).toHaveURL(/.*grammar/);

    // カテゴリー選択の存在確認
    await expect(
      page.locator('[data-testid="grammar-category-selector"]')
    ).toBeVisible();

    // 難易度選択の存在確認
    await expect(
      page.locator('[data-testid="difficulty-selector"]')
    ).toBeVisible();

    // 基本文型カテゴリーを選択
    await page.click('[data-testid="category-basic-sentence"]');

    // 簡単難易度を選択
    await page.click('[data-testid="difficulty-easy"]');

    // クイズ開始
    await page.click('[data-testid="start-quiz"]');
    await page.waitForLoadState("networkidle");

    // 問題表示の確認
    await expect(
      page.locator('[data-testid="question-display"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();

    // 選択肢の存在確認（簡単レベル）
    await expect(page.locator('[data-testid="option-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="option-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="option-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="option-4"]')).toBeVisible();

    // 回答選択
    await page.click('[data-testid="option-1"]');

    // 回答送信
    await page.click('[data-testid="submit-answer"]');

    // 結果表示の確認
    await expect(page.locator('[data-testid="result-display"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="explanation-display"]')
    ).toBeVisible();

    // 次の問題へ進む
    await page.click('[data-testid="next-question"]');
    await expect(
      page.locator('[data-testid="question-display"]')
    ).toBeVisible();
  });

  test("英作文フロー", async ({ page }: any) => {
    // 英作文ボタンをクリック
    await page.click('[data-testid="essay-writing"]');
    await page.waitForLoadState("networkidle");

    // 英作文ページの表示確認
    await expect(page).toHaveURL(/.*essay/);

    // プロンプト表示の確認
    await expect(page.locator('[data-testid="essay-prompt"]')).toBeVisible();
    await expect(page.locator('[data-testid="prompt-text"]')).toBeVisible();

    // テキストエリアの存在確認
    await expect(page.locator('[data-testid="essay-textarea"]')).toBeVisible();

    // 英作文を入力
    const essayText =
      "I think that learning English is very important for my future career. It will help me communicate with people from different countries and expand my opportunities.";
    await page.fill('[data-testid="essay-textarea"]', essayText);

    // 自己評価機能の確認
    await expect(page.locator('[data-testid="self-evaluation"]')).toBeVisible();

    // 保存ボタンの存在確認
    await expect(page.locator('[data-testid="save-essay"]')).toBeVisible();

    // 英作文を保存
    await page.click('[data-testid="save-essay"]');

    // 保存完了の確認
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test("総合テストフロー", async ({ page }: any) => {
    // 総合テストボタンをクリック
    await page.click('[data-testid="combined-test"]');
    await page.waitForLoadState("networkidle");

    // 総合テストページの表示確認
    await expect(page).toHaveURL(/.*combined/);

    // テスト設定の存在確認
    await expect(page.locator('[data-testid="test-settings"]')).toBeVisible();

    // 問題数選択の確認
    await expect(
      page.locator('[data-testid="question-count-selector"]')
    ).toBeVisible();

    // 10問テストを選択
    await page.click('[data-testid="question-count-10"]');

    // テスト開始
    await page.click('[data-testid="start-test"]');
    await page.waitForLoadState("networkidle");

    // 問題表示の確認
    await expect(page.locator('[data-testid="test-question"]')).toBeVisible();
    await expect(page.locator('[data-testid="question-number"]')).toBeVisible();

    // 回答入力（記述式）
    await page.fill('[data-testid="answer-input"]', "Test answer");

    // 回答送信
    await page.click('[data-testid="submit-answer"]');

    // 次の問題へ進む
    await page.click('[data-testid="next-question"]');

    // 複数問題の回答テスト
    for (let i = 0; i < 3; i++) {
      await page.fill('[data-testid="answer-input"]', `Answer ${i + 1}`);
      await page.click('[data-testid="submit-answer"]');
      await page.click('[data-testid="next-question"]');
    }

    // テスト完了
    await page.click('[data-testid="finish-test"]');

    // 結果表示の確認
    await expect(page.locator('[data-testid="test-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-display"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="analysis-display"]')
    ).toBeVisible();
  });

  test("データ永続化の確認", async ({ page }: any) => {
    // 語彙学習でXPを獲得
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="level-beginner"]');
    await page.click('[data-testid="category-toeic"]');
    await page.click('[data-testid="start-learning"]');
    await page.waitForLoadState("networkidle");

    // カードをいくつか学習
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="flip-card"]');
      await page.click('[data-testid="next-card"]');
    }

    // XP値を記録
    const xpBeforeReload = await page
      .locator('[data-testid="xp-display"]')
      .textContent();

    // ページをリロード
    await page.reload();
    await page.waitForLoadState("networkidle");

    // XP値が保持されていることを確認
    const xpAfterReload = await page
      .locator('[data-testid="xp-display"]')
      .textContent();
    expect(xpAfterReload).toBe(xpBeforeReload);
  });

  test("エラーハンドリングの確認", async ({ page }: any) => {
    // 存在しないページにアクセス
    await page.goto("/non-existent-page");

    // エラーページの表示確認
    await expect(page.locator('[data-testid="error-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // ホームに戻るボタンの確認
    await expect(page.locator('[data-testid="go-home"]')).toBeVisible();

    // ホームに戻る
    await page.click('[data-testid="go-home"]');
    await expect(page).toHaveURL("/");
  });
});
