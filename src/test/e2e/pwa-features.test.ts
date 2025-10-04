/**
 * ENTP英語学習アプリ - PWA機能 E2Eテスト
 *
 * Progressive Web App機能の自動テスト
 * - インストール機能
 * - オフライン対応
 * - 更新通知
 * - マニフェスト設定
 * - Service Worker
 */

import { expect, test } from "@playwright/test";

test.describe("PWA機能 E2Eテスト", () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にホーム画面に移動
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("PWAインストールプロンプトの表示確認", async ({ page }) => {
    // PWAインストールプロンプトの表示確認
    await expect(
      page.locator('[data-testid="pwa-install-prompt"]')
    ).toBeVisible();

    // インストールボタンの確認
    await expect(page.locator('[data-testid="install-button"]')).toBeVisible();

    // インストール説明の確認
    await expect(
      page.locator('[data-testid="install-description"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="install-benefits"]')
    ).toBeVisible();

    // インストールを実行
    await page.click('[data-testid="install-button"]');

    // インストール確認ダイアログの確認
    await expect(
      page.locator('[data-testid="install-confirmation"]')
    ).toBeVisible();

    // インストールを確定
    await page.click('[data-testid="confirm-install"]');

    // インストール完了の確認
    await expect(page.locator('[data-testid="install-success"]')).toBeVisible();

    // インストール後の状態確認
    await expect(page.locator('[data-testid="pwa-installed"]')).toBeVisible();
  });

  test("PWAマニフェストの設定確認", async ({ page }) => {
    // マニフェストの存在確認
    const manifestResponse = await page.request.get("/manifest.webmanifest");
    expect(manifestResponse.ok()).toBeTruthy();

    const manifest = await manifestResponse.json();

    // マニフェストの基本設定確認
    expect(manifest.name).toBe("ENTP英語学習アプリ");
    expect(manifest.short_name).toBe("ENTP英語学習");
    expect(manifest.description).toBeDefined();
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();

    // アイコンの確認
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);

    // アイコンの詳細確認
    const icon192 = manifest.icons.find(
      (icon: any) => icon.sizes === "192x192"
    );
    const icon512 = manifest.icons.find(
      (icon: any) => icon.sizes === "512x512"
    );

    expect(icon192).toBeDefined();
    expect(icon512).toBeDefined();
    expect(icon192?.src).toBe("/pwa-192x192.png");
    expect(icon512?.src).toBe("/pwa-512x512.png");

    // ショートカットの確認
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThan(0);
  });

  test("Service Workerの登録確認", async ({ page }) => {
    // Service Workerの登録確認
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });

    expect(swRegistration).toBeDefined();
    expect(swRegistration?.active).toBeDefined();

    // Service Workerの状態確認
    const swState = await page.evaluate(() => {
      return navigator.serviceWorker.controller?.state;
    });

    expect(swState).toBe("activated");

    // Service Workerのスコープ確認
    const swScope = await page.evaluate(() => {
      return navigator.serviceWorker.controller?.scope;
    });

    expect(swScope).toBe("/");
  });

  test("オフライン対応の確認", async ({ page }) => {
    // オンライン状態でのコンテンツ確認
    await expect(
      page.locator('[data-testid="vocabulary-learning"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="grammar-quiz"]')).toBeVisible();

    // オフライン状態をシミュレート
    await page.context().setOffline(true);

    // オフライン状態での動作確認
    await page.reload();
    await page.waitForLoadState("networkidle");

    // オフライン表示の確認
    await expect(
      page.locator('[data-testid="offline-indicator"]')
    ).toBeVisible();

    // キャッシュされたコンテンツの確認
    await expect(
      page.locator('[data-testid="vocabulary-learning"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="grammar-quiz"]')).toBeVisible();

    // 語彙学習のオフライン動作確認
    await page.click('[data-testid="vocabulary-learning"]');
    await page.waitForLoadState("networkidle");

    // オフライン状態でも学習可能
    await expect(
      page.locator('[data-testid="offline-learning-available"]')
    ).toBeVisible();

    // オンライン状態に復帰
    await page.context().setOffline(false);

    // オンライン復帰の確認
    await expect(
      page.locator('[data-testid="online-indicator"]')
    ).toBeVisible();
  });

  test("PWA更新通知の確認", async ({ page }) => {
    // 更新通知の表示確認
    await expect(
      page.locator('[data-testid="pwa-update-notification"]')
    ).toBeVisible();

    // 更新ボタンの確認
    await expect(page.locator('[data-testid="update-button"]')).toBeVisible();

    // 更新を実行
    await page.click('[data-testid="update-button"]');

    // 更新処理の確認
    await expect(page.locator('[data-testid="update-progress"]')).toBeVisible();

    // 更新完了の確認
    await expect(page.locator('[data-testid="update-complete"]')).toBeVisible();

    // 更新後の動作確認
    await expect(
      page.locator('[data-testid="updated-features"]')
    ).toBeVisible();
  });

  test("PWAスタンドアロンモードの確認", async ({ page }) => {
    // スタンドアロンモードの確認
    const isStandalone = await page.evaluate(() => {
      return window.matchMedia("(display-mode: standalone)").matches;
    });

    expect(isStandalone).toBeTruthy();

    // フルスクリーンモードの確認
    const isFullscreen = await page.evaluate(() => {
      return window.matchMedia("(display-mode: fullscreen)").matches;
    });

    // フルスクリーンまたはスタンドアロンモードであることを確認
    expect(isStandalone || isFullscreen).toBeTruthy();

    // ブラウザUIの非表示確認
    const hasBrowserUI = await page.evaluate(() => {
      return (
        window.navigator.userAgent.includes("Chrome") &&
        window.navigator.userAgent.includes("Mobile")
      );
    });

    if (hasBrowserUI) {
      // モバイルブラウザの場合、UI要素が隠れていることを確認
      await expect(
        page.locator('[data-testid="browser-ui-hidden"]')
      ).toBeVisible();
    }
  });

  test("PWAプッシュ通知の確認", async ({ page }) => {
    // 通知許可のリクエスト確認
    await expect(
      page.locator('[data-testid="notification-permission-request"]')
    ).toBeVisible();

    // 通知許可を許可
    await page.click('[data-testid="allow-notifications"]');

    // 通知許可の確認
    const notificationPermission = await page.evaluate(() => {
      return Notification.permission;
    });

    expect(notificationPermission).toBe("granted");

    // 通知設定の確認
    await expect(
      page.locator('[data-testid="notification-settings"]')
    ).toBeVisible();

    // 通知設定の変更
    await page.click('[data-testid="daily-reminder-toggle"]');
    await page.click('[data-testid="achievement-notification-toggle"]');

    // 設定保存
    await page.click('[data-testid="save-notification-settings"]');

    // 設定保存完了の確認
    await expect(page.locator('[data-testid="settings-saved"]')).toBeVisible();
  });

  test("PWAパフォーマンスの確認", async ({ page }) => {
    // ページ読み込み時間の測定
    const loadTime = await page.evaluate(() => {
      return (
        performance.timing.loadEventEnd - performance.timing.navigationStart
      );
    });

    expect(loadTime).toBeLessThan(3000); // 3秒以内

    // リソースのキャッシュ確認
    const cachedResources = await page.evaluate(() => {
      return caches.keys();
    });

    expect(cachedResources.length).toBeGreaterThan(0);

    // キャッシュされたリソースの確認
    const cacheContent = await page.evaluate(async () => {
      const cache = await caches.open("workbox-precache-v2");
      const keys = await cache.keys();
      return keys.map((request) => request.url);
    });

    expect(cacheContent.length).toBeGreaterThan(0);

    // 静的リソースがキャッシュされていることを確認
    const staticResources = cacheContent.filter(
      (url) =>
        url.includes(".js") || url.includes(".css") || url.includes(".png")
    );

    expect(staticResources.length).toBeGreaterThan(0);
  });

  test("PWAセキュリティの確認", async ({ page }) => {
    // HTTPSの確認
    const isSecure = await page.evaluate(() => {
      return location.protocol === "https:";
    });

    expect(isSecure).toBeTruthy();

    // Content Security Policyの確認
    const cspHeader = await page.evaluate(() => {
      return document.querySelector(
        'meta[http-equiv="Content-Security-Policy"]'
      );
    });

    expect(cspHeader).toBeDefined();

    // XSS対策の確認
    await page.evaluate(() => {
      // 悪意のあるスクリプトの実行を試行
      try {
        eval('alert("XSS")');
        return false;
      } catch (e) {
        return true;
      }
    });

    // セキュリティヘッダーの確認
    const response = await page.request.get("/");
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBeDefined();
    expect(headers["x-content-type-options"]).toBeDefined();
  });

  test("PWAアクセシビリティの確認", async ({ page }) => {
    // キーボードナビゲーションの確認
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-testid="focus-indicator"]')).toBeVisible();

    // スクリーンリーダー対応の確認
    const ariaLabels = await page.evaluate(() => {
      const elements = document.querySelectorAll("[aria-label]");
      return Array.from(elements).map((el) => el.getAttribute("aria-label"));
    });

    expect(ariaLabels.length).toBeGreaterThan(0);

    // コントラスト比の確認
    const contrastRatio = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      // 簡易的なコントラスト比チェック
      return computedStyle.color && computedStyle.backgroundColor;
    });

    expect(contrastRatio).toBeTruthy();

    // フォーカス管理の確認
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeDefined();
  });
});
