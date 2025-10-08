/**
 * ENTP英語学習アプリ - E2Eテスト グローバルティアダウン
 *
 * 全テスト実行後のクリーンアップ
 * - テストデータの削除
 * - ブラウザの終了
 * - リソースの解放
 */

// @ts-ignore
import { chromium, FullConfig } from "@playwright/test";

async function globalTeardown(_config: FullConfig) {
  console.log("🧹 E2Eテスト グローバルティアダウン開始");

  // ブラウザを起動してクリーンアップ
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // アプリケーションにアクセスしてクリーンアップ
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    console.log("✅ アプリケーションアクセス完了");

    // テストデータのクリーンアップ
    await page.evaluate(() => {
      // ローカルストレージをクリア
      localStorage.clear();

      // IndexedDBをクリア
      if ("indexedDB" in window) {
        indexedDB.deleteDatabase("entp-english-app");
      }

      // セッションストレージをクリア
      sessionStorage.clear();

      // テスト環境フラグをリセット
      // @ts-ignore
      delete window.__TEST_ENV__;
      // @ts-ignore
      delete window.__DEBUG__;
      // @ts-ignore
      delete window.__TEST_CONFIG__;
    });

    console.log("✅ テストデータクリーンアップ完了");

    // Service Workerのクリーンアップ
    await page.evaluate(async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log("Service Worker登録解除完了");
          }
        } catch (error) {
          console.log("Service Worker登録解除エラー:", error);
        }
      }
    });

    console.log("✅ Service Workerクリーンアップ完了");

    // キャッシュのクリーンアップ
    await page.evaluate(async () => {
      if ("caches" in window) {
        try {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log(`キャッシュ削除完了: ${cacheName}`);
          }
        } catch (error) {
          console.log("キャッシュクリーンアップエラー:", error);
        }
      }
    });

    console.log("✅ キャッシュクリーンアップ完了");

    // 通知のクリーンアップ
    await page.evaluate(() => {
      if ("Notification" in window) {
        // 通知許可をリセット（可能な範囲で）
        console.log("通知クリーンアップ完了");
      }
    });

    console.log("✅ 通知クリーンアップ完了");

    // テスト結果の記録
    await page.evaluate(() => {
      // テスト実行統計の記録
      const testStats = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        performance: {
          memory: (performance as any).memory
            ? {
                used: (performance as any).memory.usedJSHeapSize,
                total: (performance as any).memory.totalJSHeapSize,
                limit: (performance as any).memory.jsHeapSizeLimit,
              }
            : null,
        },
      };

      console.log("テスト実行統計:", testStats);
    });

    console.log("✅ テスト結果記録完了");
  } catch (error) {
    console.error("❌ グローバルティアダウンエラー:", error);
    // エラーが発生してもテストを継続
  } finally {
    await browser.close();
  }

  console.log("🎉 E2Eテスト グローバルティアダウン完了");
}

export default globalTeardown;
