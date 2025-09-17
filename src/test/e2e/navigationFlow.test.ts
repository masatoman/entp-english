import { expect, test } from "@playwright/test";

test.describe("ページ遷移・ナビゲーションテスト", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("文法クイズの完全フローテスト", async ({ page }) => {
    // 1. ホーム → 文法クイズ
    await page.click("text=文法クイズ");
    await page.waitForURL("**/learning/grammar/category");
    await expect(page.locator("text=カテゴリー選択")).toBeVisible();

    // 2. カテゴリー選択 → 時制
    await page.click("text=時制");
    await page.waitForURL("**/learning/grammar/difficulty/tenses");
    await expect(page.locator("text=難易度選択")).toBeVisible();

    // 3. 難易度選択 → 簡単
    await page.click("text=簡単");
    await page.waitForURL("**/learning/grammar/question/tenses/easy");

    // 4. 問題ページが正常に表示されることを確認
    await expect(page.locator("text=文法クイズ")).toBeVisible();
    await expect(page.locator("text=時制")).toBeVisible();
    await expect(page.locator("text=簡単")).toBeVisible();
    await expect(page.locator("text=問題 1 / 10")).toBeVisible();

    // 5. 問題が実際に表示されることを確認
    const questionText = page.locator('[data-slot="card-title"]');
    await expect(questionText).toBeVisible();

    // 6. 選択肢が表示されることを確認
    const choiceButtons = page.locator('button:has-text("I")');
    await expect(choiceButtons.first()).toBeVisible();

    // 7. 問題に回答
    await choiceButtons.first().click();
    await page.click("text=回答する");

    // 8. 次の問題に進むことを確認
    await expect(page.locator("text=問題 2 / 10")).toBeVisible();
  });

  test("語彙学習の完全フローテスト", async ({ page }) => {
    // 1. ホーム → 語彙学習
    await page.click("text=語彙学習");
    await page.waitForURL("**/learning/vocabulary/difficulty");
    await expect(page.locator("text=難易度選択")).toBeVisible();

    // 2. 難易度選択 → 初級
    await page.click("text=初級");
    await page.waitForURL("**/learning/vocabulary/category**");
    await expect(page.locator("text=カテゴリー選択")).toBeVisible();

    // 3. カテゴリー選択 → TOEIC
    await page.click("text=TOEIC");
    await page.waitForURL("**/learning/vocabulary/study/**");

    // 4. 語彙カードページが正常に表示されることを確認
    await expect(page.locator("text=語彙学習")).toBeVisible();
    await expect(page.locator("text=初級")).toBeVisible();
  });

  test("事前学習の完全フローテスト", async ({ page }) => {
    // 1. ホーム → 事前学習
    await page.click("text=事前学習");
    await page.waitForURL("**/learning/pre-study/menu");
    await expect(page.locator("text=📚 事前学習")).toBeVisible();

    // 2. コンテンツ選択 → 英文の基本構造
    await page.click("text=英文の基本構造");
    await page.waitForURL("**/learning/pre-study/content/**");

    // 3. コンテンツページが正常に表示されることを確認
    await expect(page.locator("text=英文の基本構造")).toBeVisible();
    await expect(page.locator("text=SVO")).toBeVisible();
  });

  test("ガチャシステムの完全フローテスト", async ({ page }) => {
    // 1. ホーム → ガチャ
    await page.click("text=TOEIC単語ガチャ");
    await page.waitForURL("**/games/gacha");
    await expect(page.locator("text=TOEIC単語ガチャ")).toBeVisible();

    // 2. コレクション表示
    await page.click("text=コレクション");
    await expect(page.locator("text=コレクション統計")).toBeVisible();

    // 3. カード詳細（既存カードがある場合）
    const cardElements = page.locator('[data-testid="gacha-card"]');
    const cardCount = await cardElements.count();

    if (cardCount > 0) {
      await cardElements.first().click();
      await page.waitForURL("**/games/gacha/card/**");
      await expect(page.locator("text=ガチャに戻る")).toBeVisible();
    }
  });

  test("英作文の完全フローテスト", async ({ page }) => {
    // 1. ホーム → 英作文
    await page.click("text=英作文");
    await page.waitForURL("**/learning/essay-writing");
    await expect(page.locator("text=英作文").first()).toBeVisible();

    // 2. 課題選択（最初の要素を選択）
    await page.locator("text=自己紹介文を書こう").first().click();
    await expect(page.locator("text=課題の指示")).toBeVisible();
    await expect(page.locator("text=🎯 推奨語彙")).toBeVisible();

    // 3. 英作文入力
    await page.fill("textarea", "I am a student. I like English.");
    await expect(page.locator("text=6語")).toBeVisible();

    // 4. 提出
    await page.click("text=提出する");
    await expect(page.locator("text=英作文完了！")).toBeVisible();
  });

  test("実績・統計ページのテスト", async ({ page }) => {
    // 1. ホーム → 実績
    await page.click("text=実績");
    await page.waitForURL("**/progress/achievements");
    await expect(page.locator("text=実績")).toBeVisible();

    // 2. 戻るボタンテスト
    await page.click('button:has-text("戻る")');
    await page.waitForURL("/");
    await expect(page.locator("text=ENTP英語学習アプリ")).toBeVisible();

    // 3. ホーム → 成長ダッシュボード
    await page.click("text=成長ダッシュボード");
    await page.waitForURL("**/progress/dashboard");

    // 成長ダッシュボードが表示されるか確認（エラーの場合は空白）
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(100); // 空白でないことを確認
  });

  test("タイムアタックの完全フローテスト", async ({ page }) => {
    // 1. ホーム → タイムアタック
    await page.click("text=タイムアタック");
    await page.waitForURL("**/learning/time-attack");
    await expect(page.locator("text=タイムアタックモード")).toBeVisible();

    // 2. ゲーム開始
    await page.click("text=スタート！");

    // 3. ゲーム画面が表示されることを確認
    await expect(page.locator("text=残り時間")).toBeVisible();
  });

  test("総合テストの完全フローテスト", async ({ page }) => {
    // 1. ホーム → 総合テスト
    await page.click("text=総合テスト");
    await page.waitForURL("**/learning/combined-test");
    await expect(page.locator("text=総合テスト").first()).toBeVisible();
  });

  test("設定画面のテスト", async ({ page }) => {
    // 1. ホーム → 設定（ステータス設定ボタン経由）
    await page.click("text=ステータス設定");
    await page.waitForURL("**/settings/app");
    await expect(page.locator("text=アプリ設定")).toBeVisible();

    // 2. 戻るボタンテスト
    await page.click('button:has-text("戻る")');
    await page.waitForURL("/");
  });

  test("タワーディフェンス（無効化）テスト", async ({ page }) => {
    // タワーディフェンスが無効化されていることを確認
    await page.goto("http://localhost:3000/games/tower-defense");

    // ページが表示されるかエラーハンドリングされることを確認
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(30);
  });

  test("文法クイズ結果ページテスト", async ({ page }) => {
    // 結果ページに直接アクセス
    await page.goto(
      "http://localhost:3000/learning/grammar/results/tenses/easy"
    );

    // 結果ページが表示されるかエラーハンドリングされることを確認
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(30);
  });

  test("Enhanced文法クイズテスト", async ({ page }) => {
    // Enhanced文法クイズページ
    await page.goto(
      "http://localhost:3000/learning/grammar/quiz/basic-grammar/easy"
    );

    // ページが正常に表示されることを確認
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(30);
  });

  test("直接URL アクセステスト（全ページ網羅）", async ({ page }) => {
    const testUrls = [
      // ホーム
      "/",

      // 語彙学習系
      "/learning/vocabulary/difficulty",
      "/learning/vocabulary/category?difficulty=beginner",
      "/learning/vocabulary/study/beginner/toeic",

      // 文法クイズ系
      "/learning/grammar/category",
      "/learning/grammar/difficulty/basic-grammar",
      "/learning/grammar/quiz/tenses/easy",
      "/learning/grammar/question/tenses/easy",
      "/learning/grammar/results/tenses/easy",

      // 事前学習系
      "/learning/pre-study/menu",
      "/learning/pre-study/content/basic-grammar-theory",

      // その他学習機能
      "/learning/combined-test",
      "/learning/time-attack",
      "/learning/essay-writing",

      // ゲーム機能
      "/games/tower-defense",
      "/games/gacha",
      "/games/gacha/result",
      "/games/gacha/card/1",

      // 進捗・統計
      "/progress/achievements",
      "/progress/dashboard",

      // 設定
      "/settings/app",
    ];

    for (const url of testUrls) {
      await page.goto(`http://localhost:3000${url}`);

      // ページが空白でないことを確認
      const pageContent = await page.textContent("body");
      expect(pageContent?.length, `URL ${url} is blank`).toBeGreaterThan(30);

      // エラーメッセージがないことを確認
      const hasError = await page.locator("text=エラー").count();
      expect(hasError, `URL ${url} has error`).toBe(0);

      // 読み込み中で止まっていないことを確認
      await page.waitForTimeout(3000);
      const isStillLoading = await page.locator("text=読み込み中").count();
      expect(isStillLoading, `URL ${url} stuck in loading`).toBe(0);
    }
  });

  test("戻るボタンの完全テスト", async ({ page }) => {
    const navigationTests = [
      {
        path: "/learning/grammar/category",
        backDestination: "/",
        description: "文法カテゴリー → ホーム",
      },
      {
        path: "/learning/grammar/difficulty/basic-grammar",
        backDestination: "/learning/grammar/category",
        description: "文法難易度 → カテゴリー",
      },
      {
        path: "/learning/vocabulary/difficulty",
        backDestination: "/",
        description: "語彙難易度 → ホーム",
      },
      {
        path: "/learning/pre-study/menu",
        backDestination: "/",
        description: "事前学習メニュー → ホーム",
      },
      {
        path: "/games/gacha",
        backDestination: "/",
        description: "ガチャ → ホーム",
      },
      {
        path: "/progress/achievements",
        backDestination: "/",
        description: "実績 → ホーム",
      },
    ];

    for (const test of navigationTests) {
      await page.goto(`http://localhost:3000${test.path}`);
      await page.waitForLoadState("networkidle");

      // 戻るボタンをクリック
      await page.click('button:has-text("戻る")');

      // 正しい遷移先に移動することを確認
      await page.waitForURL(`**${test.backDestination}`);

      console.log(`✅ ${test.description}: 成功`);
    }
  });

  test("エラーハンドリングテスト", async ({ page }) => {
    // 1. 存在しないカテゴリー
    await page.goto(
      "http://localhost:3000/learning/grammar/question/nonexistent/easy"
    );

    // エラーハンドリングされているか確認
    const pageContent = await page.textContent("body");
    expect(pageContent?.length).toBeGreaterThan(30); // 空白でない

    // 2. 存在しない難易度
    await page.goto(
      "http://localhost:3000/learning/grammar/question/tenses/nonexistent"
    );

    const pageContent2 = await page.textContent("body");
    expect(pageContent2?.length).toBeGreaterThan(50);

    // 3. 不正なURL形式
    await page.goto("http://localhost:3000/learning/grammar/question/");

    // リダイレクトまたは適切なエラーページが表示されることを確認
    await page.waitForTimeout(2000);
    const finalUrl = page.url();
    expect(finalUrl).not.toContain("/learning/grammar/question/");
  });

  test("レスポンシブ対応テスト", async ({ page }) => {
    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });

    const testUrls = [
      "/",
      "/learning/grammar/category",
      "/learning/vocabulary/difficulty",
      "/learning/essay-writing",
      "/games/gacha",
    ];

    for (const url of testUrls) {
      await page.goto(`http://localhost:3000${url}`);
      await page.waitForLoadState("networkidle");

      // モバイルで正常に表示されることを確認
      const pageContent = await page.textContent("body");
      expect(
        pageContent?.length,
        `Mobile view for ${url} is blank`
      ).toBeGreaterThan(30);

      // スクロール可能であることを確認
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  });

  test("パフォーマンステスト", async ({ page }) => {
    const urls = [
      "/",
      "/learning/grammar/category",
      "/learning/grammar/question/tenses/easy",
      "/learning/vocabulary/difficulty",
      "/learning/essay-writing",
      "/games/gacha",
    ];

    for (const url of urls) {
      const startTime = Date.now();

      await page.goto(`http://localhost:3000${url}`);
      await page.waitForLoadState("networkidle");

      const loadTime = Date.now() - startTime;

      // 各ページの読み込みが10秒以内（初回読み込みを考慮）
      expect(loadTime, `Page ${url} load time too slow`).toBeLessThan(10000);

      console.log(`📊 ${url}: ${loadTime}ms`);
    }
  });

  test("Router対応漏れ検知テスト", async ({ page }) => {
    // props形式のままでRouter対応されていないコンポーネントを検知
    const propsBasedUrls = [
      "/learning/grammar/question/basic-grammar/easy",
      "/learning/grammar/quiz/modals/normal",
      "/learning/grammar/results/passive/hard",
      "/learning/vocabulary/study/intermediate/business",
      "/learning/pre-study/content/tenses-theory",
      "/games/gacha/card/5",
    ];

    for (const url of propsBasedUrls) {
      await page.goto(`http://localhost:3000${url}`);
      await page.waitForTimeout(3000);

      // JavaScript エラーをチェック
      const errors = await page.evaluate(() => {
        return window.console.error || [];
      });

      // ページが空白でないことを確認
      const pageContent = await page.textContent("body");
      expect(
        pageContent?.length,
        `URL ${url} is blank (props not converted)`
      ).toBeGreaterThan(30);

      // "Cannot convert object to primitive value" エラーがないことを確認
      const hasConversionError =
        pageContent?.includes("Cannot convert") || false;
      expect(hasConversionError, `URL ${url} has conversion error`).toBe(false);

      console.log(`✅ ${url}: OK`);
    }
  });

  test("全コンポーネントの基本レンダリングテスト", async ({ page }) => {
    const componentTests = [
      {
        url: "/",
        expectedTexts: [
          "ENTP英語学習アプリ",
          "事前学習",
          "文法クイズ",
          "語彙学習",
        ],
        description: "ホーム画面",
      },
      {
        url: "/learning/vocabulary/difficulty",
        expectedTexts: ["難易度選択", "初級", "中級", "上級"],
        description: "語彙難易度選択",
      },
      {
        url: "/learning/grammar/category",
        expectedTexts: ["カテゴリー選択", "基本文型", "時制", "助動詞"],
        description: "文法カテゴリー選択",
      },
      {
        url: "/learning/pre-study/menu",
        expectedTexts: ["📚 事前学習", "英文の基本構造"],
        description: "事前学習メニュー",
      },
      {
        url: "/learning/essay-writing",
        expectedTexts: ["英作文", "🔗 学習連携状況", "自己紹介文を書こう"],
        description: "英作文",
      },
      {
        url: "/games/gacha",
        expectedTexts: ["TOEIC単語ガチャ", "コレクション統計", "パックを選択"],
        description: "ガチャシステム",
      },
      {
        url: "/progress/achievements",
        expectedTexts: ["実績", "合計XP", "連続学習"],
        description: "実績画面",
      },
    ];

    for (const test of componentTests) {
      await page.goto(`http://localhost:3000${test.url}`);
      await page.waitForLoadState("networkidle");

      console.log(`🧪 Testing: ${test.description}`);

      // 各期待テキストが表示されることを確認
      for (const expectedText of test.expectedTexts) {
        await expect(
          page.locator(`text=${expectedText}`).first(),
          `${test.description}: "${expectedText}" not found`
        ).toBeVisible();
      }

      console.log(`✅ ${test.description}: 全要素確認済み`);
    }
  });

  test("エラーバウンダリテスト", async ({ page }) => {
    // 意図的にエラーを発生させるテストケース
    const errorProneUrls = [
      "/learning/grammar/question/nonexistent/easy",
      "/learning/vocabulary/study/invalid/invalid",
      "/games/gacha/card/999999",
      "/learning/pre-study/content/nonexistent",
      "/learning/grammar/results/invalid/invalid",
    ];

    for (const url of errorProneUrls) {
      await page.goto(`http://localhost:3000${url}`);
      await page.waitForTimeout(2000);

      // エラーページまたは適切なフォールバックが表示されることを確認
      const pageContent = await page.textContent("body");

      // 完全に空白でないことを確認
      expect(
        pageContent?.length,
        `URL ${url} shows blank error page`
      ).toBeGreaterThan(15);

      // JavaScriptエラーが表示されていないことを確認
      const hasJSError =
        pageContent?.includes("TypeError") ||
        pageContent?.includes("ReferenceError") ||
        pageContent?.includes("Cannot convert");
      expect(hasJSError, `URL ${url} shows JavaScript error`).toBe(false);

      console.log(`🛡️ ${url}: エラーハンドリング OK`);
    }
  });
});
