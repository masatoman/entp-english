import { useEffect } from "react";

/**
 * コンポーネントマウント時にページトップにスクロールするカスタムフック
 *
 * @param dependencies - 依存配列（省略可能）
 * 指定した依存関係が変更されたときにスクロールを実行
 *
 * @example
 * // 基本的な使用法（コンポーネントマウント時のみ）
 * useScrollToTop();
 *
 * @example
 * // 特定の値が変更されたときにもスクロール
 * useScrollToTop([userId, pageId]);
 */
export function useScrollToTop(dependencies: any[] = []) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, dependencies);
}

/**
 * 即座にページトップにスクロールする関数（アニメーションなし）
 * ボタンクリックなどのイベントハンドラーで使用
 */
export function scrollToTopInstant() {
  window.scrollTo(0, 0);
}

/**
 * スムーズにページトップにスクロールする関数
 * ボタンクリックなどのイベントハンドラーで使用
 */
export function scrollToTopSmooth() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
