import React from "react";
import { adrenalineManager } from "../utils/adrenalineManager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

/**
 * 確率的機能のテスト用コンポーネント
 * 開発環境でのみ表示される
 */
export const ProbabilityFeatureTester: React.FC = () => {
  // 開発環境でのみ表示
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleForceTreasureBox = () => {
    console.log("🧪 宝箱強制獲得テスト開始");
    const box = adrenalineManager.forceEarnTreasureBox("normal");
    console.log("🧪 宝箱獲得:", box);

    // 宝箱開封イベントを発火
    window.dispatchEvent(
      new CustomEvent("openTreasureBoxes", {
        detail: { treasureBoxes: [box] },
      })
    );
  };

  const handleForceCriticalHit = () => {
    console.log("🧪 クリティカルヒット強制発動テスト開始");
    const events = adrenalineManager.forceTriggerEvents();
    console.log("🧪 発動イベント:", events);
  };

  const handleForceFeverTime = () => {
    console.log("🧪 フィーバータイム強制発動テスト開始");
    // フィーバータイムを強制発動するには、複数回の正解処理が必要
    for (let i = 0; i < 5; i++) {
      const events = adrenalineManager.forceTriggerEvents();
      if (events.some((e) => e.type === "fever_time_start")) {
        console.log("🧪 フィーバータイム発動成功:", events);
        break;
      }
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-yellow-50 border-yellow-200 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">
          🧪 確率的機能テスト
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={handleForceTreasureBox}
          className="w-full text-xs bg-yellow-500 hover:bg-yellow-600 text-white"
          size="sm"
        >
          🎁 宝箱強制獲得
        </Button>
        <Button
          onClick={handleForceCriticalHit}
          className="w-full text-xs bg-purple-500 hover:bg-purple-600 text-white"
          size="sm"
        >
          ⚡ クリティカルヒット強制発動
        </Button>
        <Button
          onClick={handleForceFeverTime}
          className="w-full text-xs bg-pink-500 hover:bg-pink-600 text-white"
          size="sm"
        >
          🎆 フィーバータイム強制発動
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProbabilityFeatureTester;
