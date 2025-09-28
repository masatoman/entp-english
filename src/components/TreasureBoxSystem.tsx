import { useEffect, useState } from "react";
import { TreasureBox, TreasureReward } from "../types/adrenalineSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TreasureBoxSystemProps {
  onBoxOpened?: (rewards: TreasureReward[]) => void;
}

export default function TreasureBoxSystem({
  onBoxOpened,
}: TreasureBoxSystemProps) {
  const [treasureBoxes, setTreasureBoxes] = useState<TreasureBox[]>([]);
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  const [showRewards, setShowRewards] = useState<TreasureReward[] | null>(null);
  const [forceShow, setForceShow] = useState(false); // 強制表示フラグ

  useEffect(() => {
    const loadTreasureBoxes = () => {
      const system = adrenalineManager.getSystem();
      setTreasureBoxes(system.treasureBoxes.filter((box) => !box.isOpened));
    };

    loadTreasureBoxes();

    // AdrenalineEffectsからの宝箱開封イベントをリスン
    const handleOpenTreasureBoxes = (event: CustomEvent) => {
      console.log("🎁 宝箱開封イベント受信:", event.detail);
      setForceShow(true); // 強制表示を有効化
      loadTreasureBoxes(); // 宝箱リストを更新して表示
    };

    window.addEventListener(
      "openTreasureBoxes",
      handleOpenTreasureBoxes as EventListener
    );

    // 報酬表示中はintervalを停止（showRewardsがnullの場合のみ更新）
    const interval = setInterval(() => {
      if (!showRewards) {
        loadTreasureBoxes();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "openTreasureBoxes",
        handleOpenTreasureBoxes as EventListener
      );
    };
  }, [showRewards]); // showRewardsを依存関係に追加

  const handleOpenBox = async (boxId: string) => {
    console.log("🔍 宝箱開封開始:", boxId);
    setOpeningBox(boxId);

    // 開封アニメーション
    console.log("🔍 開封アニメーション開始（1.5秒）");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("🔍 開封アニメーション完了");

    const rewards = adrenalineManager.openTreasureBox(boxId);
    console.log("🔍 adrenalineManager.openTreasureBox結果:", rewards);

    // 報酬を適用
    const levelManager = getLevelManager();
    let totalXPGained = 0;
    let heartsRecovered = 0;
    let starsRecovered = 0;

    rewards.forEach((reward) => {
      switch (reward.type) {
        case "xp":
          levelManager.addXP(reward.amount);
          totalXPGained += reward.amount;
          console.log(`⚡ XP獲得: +${reward.amount} (累計: +${totalXPGained})`);
          break;
        case "hearts":
          const beforeHearts = levelManager.getHeartSystem().current;
          levelManager.recoverAllHearts();
          const afterHearts = levelManager.getHeartSystem().current;
          heartsRecovered = afterHearts - beforeHearts;
          console.log(
            `❤️ 体力回復: ${beforeHearts} → ${afterHearts} (+${heartsRecovered})`
          );
          break;
        case "stars":
          const beforeStars = levelManager.getStarSystem().current;
          levelManager.recoverAllStars();
          const afterStars = levelManager.getStarSystem().current;
          starsRecovered = afterStars - beforeStars;
          console.log(
            `⭐ スタミナ回復: ${beforeStars} → ${afterStars} (+${starsRecovered})`
          );
          break;
        case "gacha_ticket":
          // ガチャチケットの処理（実装予定）
          console.log(`🎫 ガチャチケット×${reward.amount}を獲得！`);
          break;
        case "special_item":
          // 特別アイテムの処理（実装予定）
          console.log(`✨ 特別アイテム「${reward.description}」を獲得！`);
          break;
      }
    });
    saveLevelManager();

    console.log("🎁 宝箱開封完了 - 総報酬:", {
      totalXPGained,
      heartsRecovered,
      starsRecovered,
      totalRewards: rewards.length,
    });

    setShowRewards(rewards);
    setOpeningBox(null);

    console.log("🔍 宝箱UI状態更新:", {
      showRewards: rewards,
      rewardsLength: rewards.length,
      openingBox: null,
    });

    // 一時的な解決策：アラートで報酬を表示
    const rewardSummary = rewards
      .map(
        (r) =>
          `${
            r.type === "xp"
              ? "⚡"
              : r.type === "hearts"
              ? "❤️"
              : r.type === "stars"
              ? "⭐"
              : r.type === "gacha_ticket"
              ? "🎫"
              : "✨"
          } ${r.description}: +${r.amount}`
      )
      .join("\n");

    alert(
      `🎉 宝箱開封完了！\n\n${rewardSummary}\n\n合計: ${rewards.length}個の報酬を獲得しました！`
    );

    // 報酬表示中は宝箱リストを更新しない（報酬表示完了後に更新）
    const system = adrenalineManager.getSystem();
    setTreasureBoxes(system.treasureBoxes.filter((box) => !box.isOpened));

    onBoxOpened?.(rewards);
  };

  const getBoxIcon = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "📦";
      case "silver":
        return "🎁";
      case "gold":
        return "✨";
      case "rainbow":
        return "🌈";
      default:
        return "📦";
    }
  };

  const getBoxColor = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-100";
      case "silver":
        return "border-gray-400 bg-gradient-to-br from-gray-50 to-slate-100";
      case "gold":
        return "border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-100";
      case "rainbow":
        return "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-100";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getBoxName = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "ブロンズ宝箱";
      case "silver":
        return "シルバー宝箱";
      case "gold":
        return "ゴールド宝箱";
      case "rainbow":
        return "レインボー宝箱";
      default:
        return "宝箱";
    }
  };

  console.log("🔍 TreasureBoxSystem レンダリング状態:", {
    treasureBoxesLength: treasureBoxes.length,
    showRewards: showRewards ? showRewards.length : null,
    showRewardsExists: !!showRewards,
    openingBox,
  });

  // 報酬表示または宝箱がある場合、または強制表示の場合のみ表示
  if (!showRewards && treasureBoxes.length === 0 && !forceShow) {
    console.log("🔍 TreasureBoxSystem: 表示条件を満たさないため非表示");
    return null;
  }

  // 宝箱がない場合は強制表示フラグをリセット
  if (treasureBoxes.length === 0 && forceShow) {
    console.log("🔍 TreasureBoxSystem: 宝箱がないため強制表示フラグをリセット");
    setForceShow(false);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
        {showRewards ? (
          // 報酬表示画面（大幅改善）
          <>
            {console.log("🔍 報酬表示画面をレンダリング中:", showRewards)}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-100 animate-pulse">
              <CardHeader className="text-center">
                <div className="text-6xl mb-2 animate-bounce">🎉</div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  宝箱開封完了！
                </CardTitle>
                <div className="text-lg font-semibold text-orange-700 mt-2">
                  素晴らしい報酬を獲得しました！
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {showRewards.map((reward, index) => (
                    <div
                      key={index}
                      className={`
                      p-4 rounded-xl border-3 flex items-center justify-between transform hover:scale-105 transition-all animate-bounce
                      ${
                        reward.rarity === "legendary"
                          ? "border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg"
                          : ""
                      }
                      ${
                        reward.rarity === "epic"
                          ? "border-yellow-500 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-lg"
                          : ""
                      }
                      ${
                        reward.rarity === "rare"
                          ? "border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md"
                          : ""
                      }
                      ${
                        reward.rarity === "common"
                          ? "border-gray-500 bg-gradient-to-r from-gray-100 to-slate-100 shadow-sm"
                          : ""
                      }
                    `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl animate-pulse">
                          {reward.type === "xp"
                            ? "⚡"
                            : reward.type === "hearts"
                            ? "❤️"
                            : reward.type === "stars"
                            ? "⭐"
                            : reward.type === "gacha_ticket"
                            ? "🎫"
                            : "✨"}
                        </span>
                        <div>
                          <div className="font-bold text-lg text-gray-800">
                            {reward.description}
                          </div>
                          <Badge
                            variant="outline"
                            className={`
                            text-sm font-medium
                            ${
                              reward.rarity === "legendary"
                                ? "border-purple-500 text-purple-700 bg-purple-50"
                                : ""
                            }
                            ${
                              reward.rarity === "epic"
                                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                : ""
                            }
                            ${
                              reward.rarity === "rare"
                                ? "border-blue-500 text-blue-700 bg-blue-50"
                                : ""
                            }
                            ${
                              reward.rarity === "common"
                                ? "border-gray-500 text-gray-700 bg-gray-50"
                                : ""
                            }
                          `}
                          >
                            {reward.rarity === "legendary"
                              ? "🌟 伝説級"
                              : reward.rarity === "epic"
                              ? "💎 エピック"
                              : reward.rarity === "rare"
                              ? "💙 レア"
                              : "⚪ 通常"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          +{reward.amount}
                        </div>
                        <div className="text-sm text-green-500 font-medium">
                          {reward.type === "xp"
                            ? "XP"
                            : reward.type === "hearts"
                            ? "体力"
                            : reward.type === "stars"
                            ? "スタミナ"
                            : reward.type === "gacha_ticket"
                            ? "チケット"
                            : "アイテム"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 総獲得表示 */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-green-400">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700 mb-2">
                      🏆 総獲得報酬 🏆
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {showRewards
                            .filter((r) => r.type === "xp")
                            .reduce((sum, r) => sum + r.amount, 0)}
                        </div>
                        <div className="text-xs text-blue-500">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {showRewards.filter((r) => r.type === "hearts")
                            .length > 0
                            ? "FULL"
                            : "0"}
                        </div>
                        <div className="text-xs text-red-500">体力</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">
                          {showRewards
                            .filter((r) => r.type === "gacha_ticket")
                            .reduce((sum, r) => sum + r.amount, 0)}
                        </div>
                        <div className="text-xs text-yellow-500">チケット</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowRewards(null);
                    setForceShow(false); // 強制表示フラグをリセット
                    // 報酬表示完了後に宝箱リストを更新
                    const system = adrenalineManager.getSystem();
                    setTreasureBoxes(
                      system.treasureBoxes.filter((box) => !box.isOpened)
                    );
                    console.log("🔍 報酬表示完了 - 宝箱リスト更新");
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold text-lg py-3"
                  size="lg"
                >
                  🚀 学習を続ける 🚀
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          // 宝箱選択画面
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                🎁 宝箱を開封しよう！ 🎁
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                学習の成果で宝箱を獲得しました！
                <br />
                どの宝箱から開封しますか？
              </div>

              <div className="space-y-3">
                {treasureBoxes.map((box) => (
                  <Card
                    key={box.id}
                    className={`
                      cursor-pointer transition-all hover:scale-105 border-2
                      ${getBoxColor(box.type)}
                      ${openingBox === box.id ? "animate-pulse" : ""}
                    `}
                    onClick={() => !openingBox && handleOpenBox(box.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">
                            {getBoxIcon(box.type)}
                          </span>
                          <div>
                            <div className="font-bold text-lg">
                              {getBoxName(box.type)}
                            </div>
                            <div className="text-xs text-gray-600">
                              レア度: {(box.rarity * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        {openingBox === box.id ? (
                          <div className="animate-spin text-2xl">⭐</div>
                        ) : (
                          <div className="text-lg">👆</div>
                        )}
                      </div>

                      {openingBox === box.id && (
                        <div className="mt-3 text-center">
                          <div className="text-sm font-medium text-gray-700">
                            開封中...
                          </div>
                          <div className="text-xs text-gray-500">
                            素晴らしい報酬が待っています！
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
