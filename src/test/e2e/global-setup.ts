/**
 * ENTP英語学習アプリ - E2Eテスト グローバルセットアップ
 *
 * 全テスト実行前の初期設定
 * - テスト環境の準備
 * - データの初期化
 * - ブラウザ設定
 */

import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 E2Eテスト グローバルセットアップ開始");

  // ブラウザを起動してテスト環境を準備
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // アプリケーションにアクセスして初期化
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    console.log("✅ アプリケーション初期化完了");

    // テスト用データの初期化
    await page.evaluate(() => {
      // ローカルストレージをクリア
      localStorage.clear();

      // IndexedDBをクリア
      if ("indexedDB" in window) {
        indexedDB.deleteDatabase("entp-english-app");
      }

      // セッションストレージをクリア
      sessionStorage.clear();
    });

    console.log("✅ テストデータ初期化完了");

    // PWA機能の準備
    await page.evaluate(async () => {
      // Service Workerの登録確認
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker登録完了:", registration);
        } catch (error) {
          console.log("Service Worker登録エラー:", error);
        }
      }

      // 通知許可のリクエスト
      if ("Notification" in window) {
        try {
          const permission = await Notification.requestPermission();
          console.log("通知許可状態:", permission);
        } catch (error) {
          console.log("通知許可リクエストエラー:", error);
        }
      }
    });

    console.log("✅ PWA機能準備完了");

    // テスト環境の設定
    await page.addInitScript(() => {
      // テスト環境フラグを設定
      window.__TEST_ENV__ = true;

      // デバッグログを有効化
      window.__DEBUG__ = true;

      // テスト用の設定を適用
      window.__TEST_CONFIG__ = {
        skipAnimations: true,
        fastMode: true,
        mockData: true,
      };
    });

    console.log("✅ テスト環境設定完了");

    // 基本的な機能の動作確認
    await page.evaluate(() => {
      // 基本的なDOM要素の存在確認
      const homeButton = document.querySelector(
        '[data-testid="vocabulary-learning"]'
      );
      const grammarButton = document.querySelector(
        '[data-testid="grammar-quiz"]'
      );

      if (!homeButton || !grammarButton) {
        throw new Error("基本的なUI要素が見つかりません");
      }
    });

    console.log("✅ 基本機能確認完了");
  } catch (error) {
    console.error("❌ グローバルセットアップエラー:", error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log("🎉 E2Eテスト グローバルセットアップ完了");
}

export default globalSetup;
