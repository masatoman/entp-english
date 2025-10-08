/**
 * ENTP英語学習アプリ - ゲーミフィケーション機能 E2Eテスト
 *
 * 高度なゲーミフィケーション機能の自動テスト
 * - ガチャシステム
 * - アドレナリンシステム
 * - 宝箱システム
 * - ハートシステム
 * - XP・レベルシステム
 * - 日替わりクエスト
 */

// @ts-ignore
import { expect, test } from "@playwright/test";

test.describe("ゲーミフィケーション機能 E2Eテスト", () => {
  test.beforeEach(async ({ page }: any) => {
    // 各テスト前にホーム画面に移動
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("ガチャシステムの動作確認", async ({ page }: any) => {
    // ガチャページにアクセス
    await page.click('[data-testid="gacha-system"]');
    await page.waitForLoadState("networkidle");

    // ガチャページの表示確認
    await expect(page).toHaveURL(/.*gacha/);

    // コイン表示の確認
    await expect(page.locator('[data-testid="coin-display"]')).toBeVisible();

    // ガチャボタンの存在確認
    await expect(page.locator('[data-testid="gacha-button"]')).toBeVisible();

    // ガチャを実行（コインが十分にある場合）
    const coinAmount = await page
      .locator('[data-testid="coin-display"]')
      .textContent();
    const coins = parseInt(coinAmount?.match(/\d+/)?.[0] || "0");

    if (coins >= 100) {
      await page.click('[data-testid="gacha-button"]');

      // ガチャアニメーションの確認
      await expect(
        page.locator('[data-testid="gacha-animation"]')
      ).toBeVisible();

      // カード獲得の確認
      await expect(page.locator('[data-testid="card-reveal"]')).toBeVisible();
      await expect(page.locator('[data-testid="card-rarity"]')).toBeVisible();
      await expect(page.locator('[data-testid="card-details"]')).toBeVisible();

      // コレクションに追加されることを確認
      await page.click('[data-testid="add-to-collection"]');
      await expect(
        page.locator('[data-testid="collection-updated"]')
      ).toBeVisible();
    }
  });

  test("アドレナリンシステムの動作確認", async ({ page }: any) => {
    // 文法クイズでアドレナリンシステムをテスト
    await page.click('[data-testid="grammar-quiz"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="category-basic-sentence"]');
    await page.click('[data-testid="difficulty-easy"]');
    await page.click('[data-testid="start-quiz"]');
    await page.waitForLoadState("networkidle");

    // アドレナリンゲージの表示確認
    await expect(
      page.locator('[data-testid="adrenaline-gauge"]')
    ).toBeVisible();

    // 連続正解でコンボシステムをテスト
    for (let i = 0; i < 3; i++) {
      // 正解を選択（最初の選択肢が正解と仮定）
      await page.click('[data-testid="option-1"]');
      await page.click('[data-testid="submit-answer"]');

      // コンボ表示の確認
      await expect(page.locator('[data-testid="combo-display"]')).toBeVisible();

      // 次の問題へ
      await page.click('[data-testid="next-question"]');
    }

    // クリティカルヒットの確認
    await expect(page.locator('[data-testid="critical-hit"]')).toBeVisible();

    // フィーバータイムの確認
    await expect(page.locator('[data-testid="fever-time"]')).toBeVisible();
  });

  test("宝箱システムの動作確認", async ({ page }: any) => {
    // 語彙学習で宝箱を獲得
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="level-beginner"]');
    await page.click('[data-testid="category-toeic"]');
    await page.click('[data-testid="start-learning"]');
    await page.waitForLoadState("networkidle");

    // 複数のカードを学習して宝箱を獲得
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="flip-card"]');
      await page.click('[data-testid="next-card"]');
    }

    // 宝箱獲得の通知確認
    await expect(
      page.locator('[data-testid="treasure-box-notification"]')
    ).toBeVisible();

    // 宝箱ページに移動
    await page.click('[data-testid="treasure-box-system"]');
    await page.waitForLoadState("networkidle");

    // 宝箱一覧の表示確認
    await expect(
      page.locator('[data-testid="treasure-box-list"]')
    ).toBeVisible();

    // 宝箱を開封
    await page.click('[data-testid="open-treasure-box"]');

    // 開封アニメーションの確認
    await expect(
      page.locator('[data-testid="opening-animation"]')
    ).toBeVisible();

    // 報酬表示の確認
    await expect(page.locator('[data-testid="reward-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="reward-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="reward-amount"]')).toBeVisible();
  });

  test("ハートシステムの動作確認", async ({ page }: any) => {
    // ハート表示の確認
    await expect(page.locator('[data-testid="heart-display"]')).toBeVisible();

    const initialHearts = await page
      .locator('[data-testid="heart-count"]')
      .textContent();

    // 語彙学習でハートを消費
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="level-beginner"]');
    await page.click('[data-testid="category-toeic"]');
    await page.click('[data-testid="start-learning"]');
    await page.waitForLoadState("networkidle");

    // 学習セッションを完了
    await page.click('[data-testid="flip-card"]');
    await page.click('[data-testid="next-card"]');
    await page.click('[data-testid="complete-session"]');

    // ハートが消費されることを確認
    const heartsAfterLearning = await page
      .locator('[data-testid="heart-count"]')
      .textContent();
    expect(parseInt(heartsAfterLearning || "0")).toBeLessThan(
      parseInt(initialHearts || "0")
    );

    // ハート不足時の制限確認
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="level-beginner"]');
    await page.click('[data-testid="category-toeic"]');

    // ハート不足の場合のメッセージ確認
    if (parseInt(heartsAfterLearning || "0") === 0) {
      await expect(
        page.locator('[data-testid="insufficient-hearts"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="wait-for-recovery"]')
      ).toBeVisible();
    }
  });

  test("XP・レベルシステムの動作確認", async ({ page }: any) => {
    // XP・レベル表示の確認
    await expect(page.locator('[data-testid="xp-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="level-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="xp-progress-bar"]')).toBeVisible();

    const initialXP = await page
      .locator('[data-testid="xp-amount"]')
      .textContent();
    // const _initialLevel = await page
    //   .locator('[data-testid="current-level"]')
    //   .textContent();

    // 文法クイズでXPを獲得
    await page.click('[data-testid="grammar-quiz"]');
    await page.waitForLoadState("networkidle");

    await page.click('[data-testid="category-basic-sentence"]');
    await page.click('[data-testid="difficulty-easy"]');
    await page.click('[data-testid="start-quiz"]');
    await page.waitForLoadState("networkidle");

    // 複数問題に回答
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="option-1"]');
      await page.click('[data-testid="submit-answer"]');
      await page.click('[data-testid="next-question"]');
    }

    // XP獲得の確認
    await expect(page.locator('[data-testid="xp-gained"]')).toBeVisible();

    // レベルアップの確認（十分なXPがある場合）
    const xpAfterQuiz = await page
      .locator('[data-testid="xp-amount"]')
      .textContent();
    // const _levelAfterQuiz = await page
    //   .locator('[data-testid="current-level"]')
    //   .textContent();

    if (parseInt(xpAfterQuiz || "0") > parseInt(initialXP || "0")) {
      await expect(
        page.locator('[data-testid="level-up-notification"]')
      ).toBeVisible();
    }
  });

  test("日替わりクエストの動作確認", async ({ page }: any) => {
    // 日替わりクエストページにアクセス
    await page.click('[data-testid="daily-quest"]');
    await page.waitForLoadState("networkidle");

    // クエスト一覧の表示確認
    await expect(page.locator('[data-testid="quest-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="quest-item"]')).toBeVisible();

    // クエスト詳細の確認
    await expect(page.locator('[data-testid="quest-title"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="quest-description"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="quest-reward"]')).toBeVisible();
    await expect(page.locator('[data-testid="quest-progress"]')).toBeVisible();

    // クエストの進捗確認
    const progressText = await page
      .locator('[data-testid="quest-progress"]')
      .textContent();
    expect(progressText).toMatch(/\d+\/\d+/);

    // 完了可能なクエストがある場合、完了をテスト
    if (progressText?.includes("完了")) {
      await page.click('[data-testid="complete-quest"]');

      // 完了アニメーションの確認
      await expect(
        page.locator('[data-testid="quest-completed-animation"]')
      ).toBeVisible();

      // 報酬獲得の確認
      await expect(
        page.locator('[data-testid="quest-reward-gained"]')
      ).toBeVisible();
    }

    // スペシャルミッションの確認
    await expect(page.locator('[data-testid="special-mission"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="special-mission-title"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="special-mission-bonus"]')
    ).toBeVisible();
  });

  test("XPショップの動作確認", async ({ page }: any) => {
    // XPショップページにアクセス
    await page.click('[data-testid="xp-shop"]');
    await page.waitForLoadState("networkidle");

    // ショップアイテムの表示確認
    await expect(page.locator('[data-testid="shop-items"]')).toBeVisible();
    await expect(page.locator('[data-testid="shop-item"]')).toBeVisible();

    // アイテム詳細の確認
    await expect(page.locator('[data-testid="item-name"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="item-description"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="item-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="item-effect"]')).toBeVisible();

    // 購入可能なアイテムをテスト
    const itemPrice = await page
      .locator('[data-testid="item-price"]')
      .first()
      .textContent();
    const currentXP = await page
      .locator('[data-testid="xp-amount"]')
      .textContent();

    if (
      parseInt(currentXP || "0") >=
      parseInt(itemPrice?.match(/\d+/)?.[0] || "0")
    ) {
      await page.click('[data-testid="buy-item"]');

      // 購入確認ダイアログの確認
      await expect(
        page.locator('[data-testid="purchase-confirmation"]')
      ).toBeVisible();

      // 購入を確定
      await page.click('[data-testid="confirm-purchase"]');

      // 購入完了の確認
      await expect(
        page.locator('[data-testid="purchase-success"]')
      ).toBeVisible();

      // XPが消費されることを確認
      const xpAfterPurchase = await page
        .locator('[data-testid="xp-amount"]')
        .textContent();
      expect(parseInt(xpAfterPurchase || "0")).toBeLessThan(
        parseInt(currentXP || "0")
      );
    }
  });

  test("スターシステムの動作確認", async ({ page }: any) => {
    // スター表示の確認
    await expect(page.locator('[data-testid="star-display"]')).toBeVisible();

    const initialStars = await page
      .locator('[data-testid="star-count"]')
      .textContent();

    // 事前学習機能でスターを消費
    await page.click('[data-testid="pre-learning"]');
    await page.waitForLoadState("networkidle");

    // 事前学習コンテンツの選択
    await page.click('[data-testid="pre-learning-content"]');

    // スター消費の確認
    const starsAfterConsumption = await page
      .locator('[data-testid="star-count"]')
      .textContent();
    expect(parseInt(starsAfterConsumption || "0")).toBeLessThan(
      parseInt(initialStars || "0")
    );

    // 事前学習コンテンツの表示確認
    await expect(
      page.locator('[data-testid="pre-learning-material"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="understanding-check"]')
    ).toBeVisible();

    // 理解度評価のテスト
    await page.click('[data-testid="understanding-good"]');
    await page.click('[data-testid="submit-evaluation"]');

    // 評価結果の確認
    await expect(
      page.locator('[data-testid="evaluation-result"]')
    ).toBeVisible();
  });
});
