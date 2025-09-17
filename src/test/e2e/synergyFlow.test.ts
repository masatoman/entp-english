import { expect, test } from "@playwright/test";

test.describe("相乗効果システム E2E テスト", () => {
  test.beforeEach(async ({ page }) => {
    // ローカルストレージをクリア
    await page.goto("http://localhost:3001/");
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test("理論→実践学習フローの完全テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // 1. 事前学習で理論を学ぶ
    await page.click("text=事前学習");
    await page.waitForURL("**/learning/pre-study/menu");

    await page.click("text=英文の基本構造");
    await page.waitForURL("**/learning/pre-study/content/**");

    // コンテンツ内容の確認
    await expect(page.locator("text=英文の基本構造")).toBeVisible();
    await expect(page.locator("text=SVO")).toBeVisible();

    // 完了ボタンをクリック（スター消費）
    await page.click("text=完了");

    // 2. 文法クイズで練習
    await page.goto("http://localhost:3001/learning/grammar/category");
    await page.click("text=基本文型");
    await page.waitForURL("**/learning/grammar/difficulty/**");

    await page.click("text=簡単");
    await page.waitForURL("**/learning/grammar/question/**");

    // 問題が表示されることを確認
    await expect(page.locator('[data-testid="question-text"]')).toBeVisible();

    // 3. 英作文で実践
    await page.goto("http://localhost:3001/learning/essay-writing");

    // 学習連携状況の確認
    await expect(page.locator("text=🔗 学習連携状況")).toBeVisible();
    await expect(page.locator("text=完了した事前学習")).toBeVisible();

    // 推奨課題の選択
    await page.click("text=自己紹介文を書こう");

    // 推奨語彙・重点文法の表示確認
    await expect(page.locator("text=🎯 推奨語彙")).toBeVisible();
    await expect(page.locator("text=📚 重点文法")).toBeVisible();
    await expect(page.locator("text=be動詞")).toBeVisible();

    // 英作文入力
    await page.fill("textarea", "I am a student. I work hard.");
    await page.click("text=提出する");

    // 完了画面の確認
    await expect(page.locator("text=英作文完了！")).toBeVisible();
    await expect(page.locator("text=+15XP")).toBeVisible();
  });

  test("ガチャ語彙活用フローの完全テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // 1. ガチャでカード獲得
    await page.click("text=TOEIC単語ガチャ");
    await page.waitForURL("**/games/gacha");

    // コレクション統計の確認
    await expect(page.locator("text=コレクション統計")).toBeVisible();
    await expect(page.locator("text=総カード数")).toBeVisible();

    // パック開封（XPが十分な場合）
    const xpText = await page.locator("text=/所持XP/").textContent();
    if (xpText && parseInt(xpText.replace(/\D/g, "")) >= 100) {
      await page.click("text=TOEIC基礎パック");
      await page.waitForURL("**/games/gacha/result**");

      // 開封結果の確認
      await expect(page.locator("text=開封結果")).toBeVisible();
      await expect(page.locator("text=獲得したカード")).toBeVisible();
    }

    // 2. 語彙学習で定着
    await page.click("text=語彙学習で使用する");
    await page.waitForURL("**/learning/vocabulary/difficulty");

    await page.click("text=初級");
    await page.waitForURL("**/learning/vocabulary/category**");

    await page.click("text=TOEIC");
    await page.waitForURL("**/learning/vocabulary/study/**");

    // 語彙カードの表示確認
    await expect(page.locator('[data-testid="vocabulary-card"]')).toBeVisible();

    // 3. 英作文で活用
    await page.goto("http://localhost:3001/learning/essay-writing");

    // ガチャ語彙が推奨語彙に反映されることを確認
    await page.click("text=TOEIC語彙を使ったビジネス場面描写");
    await expect(page.locator("text=🎯 推奨語彙")).toBeVisible();
  });

  test("タイムアタック相乗効果テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/learning/time-attack");

    // ゲーム説明の確認
    await expect(page.locator("text=タイムアタックモード")).toBeVisible();
    await expect(page.locator("text=10問連続で挑戦")).toBeVisible();

    // ゲーム開始
    await page.click("text=スタート！");

    // 問題画面の表示確認
    await expect(
      page.locator('[data-testid="question-container"]')
    ).toBeVisible();
    await expect(page.locator("text=残り時間")).toBeVisible();

    // ガチャ語彙を使った問題の確認
    const questionText = await page
      .locator('[data-testid="question-text"]')
      .textContent();
    expect(questionText).toContain("を英語で言うと");

    // 選択肢の確認
    await expect(page.locator('[data-testid="option-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="option-1"]')).toBeVisible();
  });

  test("機能横断型実績システムテスト", async ({ page }) => {
    await page.goto("http://localhost:3001/progress/achievements");

    // 実績画面の基本表示確認
    await expect(page.locator("text=実績")).toBeVisible();
    await expect(page.locator("text=実績進捗")).toBeVisible();

    // 統計情報の確認
    await expect(page.locator("text=合計XP")).toBeVisible();
    await expect(page.locator("text=連続学習")).toBeVisible();
    await expect(page.locator("text=正解率")).toBeVisible();

    // 実績カテゴリーの確認
    await expect(page.locator("text=獲得済み実績")).toBeVisible();
  });

  test("レスポンシブデザインテスト", async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3001/");

    // ホーム画面のモバイル表示確認
    await expect(page.locator("text=ENTP英語学習アプリ")).toBeVisible();
    await expect(page.locator("text=統計")).toBeVisible(); // 短縮表示

    // 学習カードがモバイルで正常表示されることを確認
    await expect(page.locator("text=事前学習")).toBeVisible();
    await expect(page.locator("text=文法クイズ")).toBeVisible();
    await expect(page.locator("text=英作文")).toBeVisible();

    // タブレットサイズでテスト
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // タブレット表示の確認
    await expect(page.locator("text=統計を表示")).toBeVisible(); // 完全表示

    // デスクトップサイズでテスト
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    // デスクトップ表示の確認
    await expect(page.locator("text=統計を表示")).toBeVisible();
    await expect(page.locator("text=ステータス設定")).toBeVisible();
  });

  test("エラーハンドリング・境界値テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // 体力0での学習試行
    await page.evaluate(() => {
      // 体力を0に設定
      const heartData = { current: 0, max: 3, lastRecoveryTime: Date.now() };
      localStorage.setItem(
        "userStats",
        JSON.stringify({
          hearts: heartData,
          stars: { current: 3, max: 3, lastRecoveryTime: Date.now() },
        })
      );
    });
    await page.reload();

    // 体力不足での学習試行
    await page.click("text=文法クイズ");

    // 警告メッセージの確認
    await expect(page.locator("text=体力が不足")).toBeVisible();

    // 不正なURL直接アクセス
    await page.goto("http://localhost:3001/invalid-route");

    // ホームにリダイレクトされることを確認
    await page.waitForURL("**/");
    await expect(page.locator("text=ENTP英語学習アプリ")).toBeVisible();
  });

  test("パフォーマンステスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // 初回読み込み時間の測定
    const navigationStart = await page.evaluate(
      () => performance.timing.navigationStart
    );
    const loadComplete = await page.evaluate(
      () => performance.timing.loadEventEnd
    );
    const loadTime = loadComplete - navigationStart;

    // 初回読み込みが5秒以下であることを確認
    expect(loadTime).toBeLessThan(5000);

    // 画面遷移速度の測定
    const transitionStart = Date.now();
    await page.click("text=英作文");
    await page.waitForURL("**/learning/essay-writing");
    const transitionEnd = Date.now();
    const transitionTime = transitionEnd - transitionStart;

    // 画面遷移が2秒以下であることを確認
    expect(transitionTime).toBeLessThan(2000);
  });

  test("データ永続化テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // 学習データを生成
    await page.click("text=事前学習");
    await page.click("text=英文の基本構造");
    await page.click("text=完了");

    // ブラウザを再起動してデータ永続化を確認
    await page.reload();

    // データが保持されていることを確認
    await page.click("text=事前学習");
    await expect(page.locator("text=完了した事前学習")).toBeVisible();
    await expect(page.locator("text=1件")).toBeVisible();
  });

  test("オフライン対応テスト", async ({ page }) => {
    await page.goto("http://localhost:3001/");

    // オフライン状態をシミュレート
    await page.context().setOffline(true);

    // 基本機能が動作することを確認
    await expect(page.locator("text=ENTP英語学習アプリ")).toBeVisible();

    // ローカルデータ依存の機能が動作することを確認
    await page.click("text=実績");
    await expect(page.locator("text=実績")).toBeVisible();

    // オンラインに復帰
    await page.context().setOffline(false);
  });
});
