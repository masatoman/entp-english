/**
 * BGMプレイヤーコンポーネント
 * 全ページでBGMを自動再生・制御する
 */

import { useEffect } from "react";
import { bgmManager } from "../utils/bgmManager";

export function BGMPlayer() {
  useEffect(() => {
    // コンポーネントマウント時にBGMを初期化・再生
    const initializeBGM = async () => {
      try {
        await bgmManager.initialize();

        // ユーザーがBGMを有効にしている場合のみ再生
        if (bgmManager.isEnabled()) {
          await bgmManager.play();
        }
      } catch (error) {
        console.warn("BGM初期化エラー:", error);
      }
    };

    initializeBGM();

    // クリーンアップ関数（必要に応じて）
    return () => {
      // ページ遷移時はBGMを停止しない（継続再生のため）
      // bgmManager.stop();
    };
  }, []);

  // このコンポーネントはUIを表示しない
  return null;
}
