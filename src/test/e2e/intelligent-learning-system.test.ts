/**
 * ENTP英語学習アプリ - インテリジェント学習システム E2Eテスト
 *
 * インテリジェント学習機能の自動テスト
 * - 個人化学習システム
 * - 統合学習システム
 * - 適応的難易度調整
 * - 弱点分析システム
 * - 学習分析・インサイト
 * - シナジーシステム
 */

import { expect, test } from "@playwright/test";

test.describe("インテリジェント学習システム E2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にホーム画面に移動
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("個人化学習システムの動作確認", async ({ page }) => {
    // 個人化学習ページにアクセス
    await page.click('[data-testid="personalized-learning"]');
    await page.waitForLoadState("networkidle");

    // 個人化ダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="personalized-dashboard"]')
    ).toBeVisible();

    // 学習パターン分析の確認
    await expect(
      page.locator('[data-testid="learning-pattern-analysis"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="preferred-learning-times"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="strong-categories"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="weak-categories"]')).toBeVisible();

    // 推奨コンテンツの確認
    await expect(
      page.locator('[data-testid="recommended-content"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="content-recommendation"]')
    ).toBeVisible();

    // 推奨コンテンツをクリックして学習開始
    await page.click('[data-testid="start-recommended-content"]');
    await page.waitForLoadState("networkidle");

    // 推奨コンテンツが開始されることを確認
    await expect(
      page.locator('[data-testid="learning-session"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="personalized-guidance"]')
    ).toBeVisible();
  });

  test("統合学習システムの動作確認", async ({ page }) => {
    // 統合学習ページにアクセス
    await page.click('[data-testid="integrated-learning"]');
    await page.waitForLoadState("networkidle");

    // 統合学習ダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="integrated-dashboard"]')
    ).toBeVisible();

    // 機能連携の確認
    await expect(
      page.locator('[data-testid="function-integration"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="vocabulary-grammar-link"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="listening-writing-link"]')
    ).toBeVisible();

    // 統合学習セッションの開始
    await page.click('[data-testid="start-integrated-session"]');
    await page.waitForLoadState("networkidle");

    // 統合学習セッションの確認
    await expect(
      page.locator('[data-testid="integrated-session"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="multi-skill-exercise"]')
    ).toBeVisible();

    // 複数スキルの組み合わせ学習をテスト
    await expect(
      page.locator('[data-testid="vocabulary-grammar-exercise"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="listening-writing-exercise"]')
    ).toBeVisible();

    // 学習進捗の確認
    await expect(
      page.locator('[data-testid="integrated-progress"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="skill-synergy-effect"]')
    ).toBeVisible();
  });

  test("適応的難易度調整の動作確認", async ({ page }) => {
    // 文法クイズで適応的難易度調整をテスト
    await page.click('[data-testid="grammar-quiz"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="category-basic-sentence"]');
    await page.click('[data-testid="difficulty-adaptive"]');
    await page.click('[data-testid="start-quiz"]');
    await page.waitForLoadState("networkidle");

    // 適応的難易度の表示確認
    await expect(
      page.locator('[data-testid="adaptive-difficulty"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="current-difficulty-level"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="target-accuracy"]')).toBeVisible();

    // 目標正答率の確認（75%）
    const targetAccuracy = await page
      .locator('[data-testid="target-accuracy"]')
      .textContent();
    expect(targetAccuracy).toContain("75%");

    // 連続正解で難易度上昇をテスト
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="option-1"]');
      await page.click('[data-testid="submit-answer"]');

      // 難易度調整の確認
      await expect(
        page.locator('[data-testid="difficulty-adjustment"]')
      ).toBeVisible();

      await page.click('[data-testid="next-question"]');
    }

    // 難易度上昇の確認
    const newDifficultyLevel = await page
      .locator('[data-testid="current-difficulty-level"]')
      .textContent();
    expect(newDifficultyLevel).not.toBe("初級");

    // 連続不正解で難易度下降をテスト
    for (let i = 0; i < 3; i++) {
      // 間違った回答を選択
      await page.click('[data-testid="option-2"]');
      await page.click('[data-testid="submit-answer"]');

      // 難易度調整の確認
      await expect(
        page.locator('[data-testid="difficulty-adjustment"]')
      ).toBeVisible();

      await page.click('[data-testid="next-question"]');
    }

    // 難易度下降の確認
    const adjustedDifficultyLevel = await page
      .locator('[data-testid="current-difficulty-level"]')
      .textContent();
    expect(adjustedDifficultyLevel).not.toBe(newDifficultyLevel);
  });

  test("弱点分析システムの動作確認", async ({ page }) => {
    // 弱点分析ページにアクセス
    await page.click('[data-testid="weakness-analysis"]');
    await page.waitForLoadState("networkidle");

    // 弱点分析ダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="weakness-dashboard"]')
    ).toBeVisible();

    // 分析結果の確認
    await expect(
      page.locator('[data-testid="analysis-results"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="weak-categories"]')).toBeVisible();
    await expect(page.locator('[data-testid="weak-skills"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="improvement-areas"]')
    ).toBeVisible();

    // 具体的な改善提案の確認
    await expect(
      page.locator('[data-testid="improvement-suggestions"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="suggestion-item"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="estimated-improvement-time"]')
    ).toBeVisible();

    // 改善提案をクリック
    await page.click('[data-testid="apply-suggestion"]');

    // 改善計画の表示確認
    await expect(
      page.locator('[data-testid="improvement-plan"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="plan-steps"]')).toBeVisible();
    await expect(page.locator('[data-testid="plan-timeline"]')).toBeVisible();

    // 改善計画の開始
    await page.click('[data-testid="start-improvement-plan"]');

    // 改善セッションの開始確認
    await expect(
      page.locator('[data-testid="improvement-session"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="focused-practice"]')
    ).toBeVisible();
  });

  test("学習分析・インサイトの動作確認", async ({ page }) => {
    // 学習分析ページにアクセス
    await page.click('[data-testid="learning-analytics"]');
    await page.waitForLoadState("networkidle");

    // 学習分析ダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="analytics-dashboard"]')
    ).toBeVisible();

    // 学習統計の確認
    await expect(
      page.locator('[data-testid="learning-statistics"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="study-time-chart"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="accuracy-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-chart"]')).toBeVisible();

    // 学習パターンの確認
    await expect(
      page.locator('[data-testid="learning-patterns"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="peak-performance-times"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="concentration-periods"]')
    ).toBeVisible();

    // 詳細分析の確認
    await expect(
      page.locator('[data-testid="detailed-analysis"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="category-performance"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="skill-development"]')
    ).toBeVisible();

    // インサイトの確認
    await expect(
      page.locator('[data-testid="learning-insights"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="insight-item"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="insight-explanation"]')
    ).toBeVisible();

    // インサイトをクリックして詳細表示
    await page.click('[data-testid="view-insight-details"]');

    // 詳細インサイトの表示確認
    await expect(page.locator('[data-testid="insight-details"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="insight-recommendations"]')
    ).toBeVisible();
  });

  test("シナジーシステムの動作確認", async ({ page }) => {
    // シナジーダッシュボードにアクセス
    await page.click('[data-testid="synergy-dashboard"]');
    await page.waitForLoadState("networkidle");

    // シナジーダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="synergy-dashboard"]')
    ).toBeVisible();

    // 機能連携の確認
    await expect(
      page.locator('[data-testid="function-synergies"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="synergy-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="synergy-effect"]')).toBeVisible();

    // シナジー効果の詳細確認
    await expect(
      page.locator('[data-testid="synergy-description"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="synergy-benefits"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="synergy-requirements"]')
    ).toBeVisible();

    // アクティブなシナジーの確認
    await expect(
      page.locator('[data-testid="active-synergies"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="synergy-status"]')).toBeVisible();

    // シナジーをアクティベート
    await page.click('[data-testid="activate-synergy"]');

    // シナジーアクティベーションの確認
    await expect(
      page.locator('[data-testid="synergy-activated"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="synergy-bonus"]')).toBeVisible();

    // シナジー効果のテスト
    await page.click('[data-testid="test-synergy-effect"]');

    // シナジー効果の確認
    await expect(
      page.locator('[data-testid="synergy-effect-result"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="enhanced-learning"]')
    ).toBeVisible();
  });

  test("事前学習コンテンツの動作確認", async ({ page }) => {
    // 事前学習ページにアクセス
    await page.click('[data-testid="pre-learning"]');
    await page.waitForLoadState("networkidle");

    // 事前学習ダッシュボードの表示確認
    await expect(
      page.locator('[data-testid="pre-learning-dashboard"]')
    ).toBeVisible();

    // 学習コンテンツの確認
    await expect(
      page.locator('[data-testid="learning-content"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="content-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="content-title"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="content-description"]')
    ).toBeVisible();

    // スター消費の確認
    await expect(page.locator('[data-testid="star-cost"]')).toBeVisible();

    // 事前学習コンテンツを選択
    await page.click('[data-testid="select-content"]');

    // コンテンツ詳細の表示確認
    await expect(page.locator('[data-testid="content-details"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="content-materials"]')
    ).toBeVisible();

    // 学習開始
    await page.click('[data-testid="start-pre-learning"]');

    // 事前学習セッションの確認
    await expect(
      page.locator('[data-testid="pre-learning-session"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="learning-material"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="understanding-check"]')
    ).toBeVisible();

    // 理解度評価のテスト
    await page.click('[data-testid="understanding-excellent"]');
    await page.click('[data-testid="submit-evaluation"]');

    // 評価結果の確認
    await expect(
      page.locator('[data-testid="evaluation-result"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="learning-effectiveness"]')
    ).toBeVisible();
  });

  test("統合学習効果の測定確認", async ({ page }) => {
    // 複数の学習モードを連続実行
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="level-beginner"]');
    await page.click('[data-testid="category-toeic"]');
    await page.click('[data-testid="start-learning"]');
    await page.waitForLoadState("networkidle");

    // 語彙学習を完了
    await page.click('[data-testid="flip-card"]');
    await page.click('[data-testid="next-card"]');
    await page.click('[data-testid="complete-session"]');

    // 文法クイズに移動
    await page.click('[data-testid="grammar-quiz"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="category-basic-sentence"]');
    await page.click('[data-testid="difficulty-easy"]');
    await page.click('[data-testid="start-quiz"]');
    await page.waitForLoadState("networkidle");

    // 文法クイズを完了
    await page.click('[data-testid="option-1"]');
    await page.click('[data-testid="submit-answer"]');
    await page.click('[data-testid="complete-quiz"]');

    // 学習分析ページで統合効果を確認
    await page.click('[data-testid="learning-analytics"]');
    await page.waitForLoadState("networkidle");

    // 統合学習効果の確認
    await expect(
      page.locator('[data-testid="integrated-learning-effect"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="synergy-bonus"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="learning-momentum"]')
    ).toBeVisible();

    // 学習効率の向上確認
    await expect(
      page.locator('[data-testid="efficiency-improvement"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="retention-rate"]')).toBeVisible();
  });
});
