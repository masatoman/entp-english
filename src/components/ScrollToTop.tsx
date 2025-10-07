import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ページ遷移時に自動的にページトップにスクロールするコンポーネント
 * React Routerのルート変更を監視し、新しいページに移動した際に
 * スクロール位置を最上部にリセットします
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ページ遷移時にスムーズにトップまでスクロール
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]); // pathnameが変更されるたびに実行

  return null; // このコンポーネントは何もレンダリングしない
}
