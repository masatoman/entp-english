import { ArrowLeft, Gift, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { baseColors } from "../styles/colors";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { GachaSystem as GachaSystemUtil } from "../utils/gachaSystem";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import GameHeader from "./GameHeader";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CardCollectionGrid } from "./ui/card-collection-grid";

interface GachaSystemProps {
  onBack: () => void;
  userXP: number;
  onXPChange: (newXP: number) => void;
}

export const GachaSystemComponent: React.FC<GachaSystemProps> = ({
  onBack,
  userXP,
  onXPChange,
}) => {
  const navigate = useNavigate();
  // コンポーネントマウント時にページトップにスクロール
  useScrollToTop();
  const [isOpening, setIsOpening] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [userGachaData, setUserGachaData] = useState(
    GachaSystemUtil.getUserGachaData()
  );
  const [availablePacks] = useState(GachaSystemUtil.getAvailablePacks());
  const [showCollection, setShowCollection] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"xp" | "coins">("xp");
  const [coinSystem, setCoinSystem] = useState(
    dailyQuestManager.getCoinSystem()
  );

  // 時間ベースの回復システム用の定期更新
  useEffect(() => {
    const updateAvailablePacks = () => {
      const updatedData =
        GachaSystemUtil.updateAvailablePacksCount(userGachaData);
      setUserGachaData(updatedData);
      setCoinSystem(dailyQuestManager.getCoinSystem());
    };

    // 初回実行
    updateAvailablePacks();

    // 30秒ごとに更新
    const interval = setInterval(updateAvailablePacks, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenPack = async (
    packId: string,
    paymentType?: "xp" | "coins"
  ) => {
    const pack = GachaSystemUtil.getPackById(packId);
    if (!pack) return;

    // 支払い方法を決定（パラメータ優先、なければ現在の設定）
    const finalPaymentMethod = paymentType || paymentMethod;

    // 支払い方法に応じてチェック
    if (finalPaymentMethod === "xp") {
      const canOpen = GachaSystemUtil.canOpenPack(packId, userXP);
      if (!canOpen.canOpen) {
        alert(canOpen.reason);
        return;
      }
    } else if (finalPaymentMethod === "coins") {
      const coinCost = 1; // 統一価格: 全パック1コイン
      if (!dailyQuestManager.canAffordCoins(coinCost)) {
        alert(
          `コインが不足しています。必要: ${coinCost}枚, 所持: ${coinSystem.current}枚`
        );
        return;
      }
    }

    setIsOpening(true);
    setSelectedPack(packId);

    // アニメーション演出
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      console.log("Opening pack:", packId, "with userXP:", userXP);
      const cards = GachaSystemUtil.openPackAndSave(packId);
      console.log("Cards drawn:", cards);

      // 支払い処理
      if (finalPaymentMethod === "xp") {
        const newXP = userXP - pack.cost;
        console.log("XP支払い:", userXP, "→", newXP);
        onXPChange(newXP);
      } else if (finalPaymentMethod === "coins") {
        const coinCost = 1; // 統一価格: 全パック1コイン
        dailyQuestManager.spendCoins(coinCost);
        setCoinSystem(dailyQuestManager.getCoinSystem());
        console.log("コイン支払い:", coinCost, "枚");
      }

      // 語彙学習システムに追加
      console.log("Adding cards to vocabulary system...");
      GachaSystemUtil.addToVocabularySystem(cards);

      // ユーザーデータを更新
      console.log("Updating user gacha data...");
      setUserGachaData(GachaSystemUtil.getUserGachaData());
      console.log("Pack opening completed successfully");

      // デイリークエスト進捗更新
      dailyQuestManager.recordGachaUsage();

      // 開封状態をリセット
      setIsOpening(false);
      setSelectedPack(null);

      // 結果画面に遷移（一時的にローカルストレージに保存）
      const resultData = {
        cards,
        packName: pack.name,
        timestamp: Date.now(),
      };
      localStorage.setItem("gachaResult", JSON.stringify(resultData));
      navigate("/games/gacha/result");
    } catch (error) {
      console.error("Error opening pack:", error);
      alert(
        "ガチャの開封中にエラーが発生しました: " +
          (error instanceof Error ? error.message : "不明なエラー")
      );
      console.error("Error details:", {
        packId,
        userXP,
        packCost: pack.cost,
        error: error instanceof Error ? error.message : String(error),
      });
      alert(
        `パックの開封中にエラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      // エラー時も開封状態をリセット
      setIsOpening(false);
      setSelectedPack(null);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      {/* ゲームヘッダー */}
      <GameHeader />

      <div className="max-w-6xl mx-auto p-6">
        {/* ページタイトル */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gift className="w-8 h-8 text-purple-600" />
              TOEIC単語ガチャ
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCollection(!showCollection)}
              className="flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              {showCollection ? "パック選択" : "コレクション"}
            </Button>
          </div>
        </div>

        {/* コレクション統計 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 mb-4 shadow-sm">
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-gray-600 text-xs">総カード</div>
              <div className="font-bold text-lg">
                {userGachaData.collection.totalCards}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-xs">ユニーク</div>
              <div className="font-bold text-lg">
                {userGachaData.collection.uniqueCards}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-xs">開封数</div>
              <div className="font-bold text-lg">
                {userGachaData.totalPacks}
              </div>
            </div>
          </div>
        </div>

        {/* パック選択またはコレクション表示 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {showCollection ? "所持カードコレクション" : "パックを選択"}
          </h2>
          {!showCollection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePacks.map((pack) => {
                const canOpenXP = GachaSystemUtil.canOpenPack(pack.id, userXP);
                const coinCost = 1; // 統一価格: 全パック1コイン
                const canOpenCoins = dailyQuestManager.canAffordCoins(coinCost);

                return (
                  <Card
                    key={pack.id}
                    className={`p-4 transition-all hover:shadow-lg ${
                      selectedPack === pack.id ? "ring-2 ring-purple-500" : ""
                    } ${
                      !canOpenXP.canOpen && !canOpenCoins ? "opacity-60" : ""
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {pack.description}
                    </p>

                    <div className="space-y-3">
                      {/* 支払い方法ボタン */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPack(pack.id, "xp");
                          }}
                          disabled={
                            !canOpenXP.canOpen ||
                            isOpening ||
                            userXP < pack.cost
                          }
                          className="flex-1 flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          <span className="font-bold">{pack.cost} XP</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPack(pack.id, "coins");
                          }}
                          disabled={
                            !canOpenCoins || isOpening || coinSystem.current < 1
                          }
                          className="flex-1 flex items-center gap-2"
                        >
                          <span>🪙</span>
                          <span className="font-bold">1 コイン</span>
                        </Button>
                      </div>

                      {/* 開封状態表示 */}
                      {isOpening && selectedPack === pack.id && (
                        <div className="text-center text-sm text-gray-600">
                          開封中...
                        </div>
                      )}
                    </div>

                    {(!canOpenXP.canOpen || !canOpenCoins) && (
                      <div className="text-xs text-red-600 mt-2">
                        {!canOpenXP.canOpen && (
                          <div>XP不足: {canOpenXP.reason}</div>
                        )}
                        {!canOpenCoins && (
                          <div>コイン不足: {coinCost}枚必要</div>
                        )}
                        {canOpenXP.nextPackTime && (
                          <div className="mt-1 text-gray-500">
                            次の回復:{" "}
                            {(() => {
                              const remaining = Math.max(
                                0,
                                canOpenXP.nextPackTime - Date.now()
                              );
                              const minutes = Math.ceil(
                                remaining / (1000 * 60)
                              );
                              return `${minutes}分後`;
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* コレクション表示 */
            <div>
              {userGachaData.ownedCards.length === 0 ? (
                <Card className="text-center py-12">
                  <Gift className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    まだカードを所持していません
                  </h3>
                  <p className="text-gray-500 mb-4">
                    パックを開封してカードを集めよう！
                  </p>
                  <Button
                    onClick={() => setShowCollection(false)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    パックを開封する
                  </Button>
                </Card>
              ) : (
                <div>
                  {/* コレクション統計 */}
                  <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {userGachaData.ownedCards.length}
                      </div>
                      <div className="text-xs text-gray-600">総カード数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {userGachaData.collection.uniqueCards}
                      </div>
                      <div className="text-xs text-gray-600">
                        ユニークカード
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {
                          userGachaData.ownedCards.filter(
                            (card) =>
                              card.rarity === "rare" ||
                              card.rarity === "epic" ||
                              card.rarity === "legendary"
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-600">レア以上</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {
                          userGachaData.ownedCards.filter(
                            (card) => card.rarity === "legendary"
                          ).length
                        }
                      </div>
                      <div className="text-xs text-gray-600">
                        レジェンダリー
                      </div>
                    </div>
                  </div>

                  {/* レアリティ別フィルター */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCollection(!showCollection)}
                      className="text-xs"
                    >
                      全て
                    </Button>
                    {[
                      {
                        rarity: "common",
                        name: "コモン",
                        color: "text-gray-700 border-gray-400",
                      },
                      {
                        rarity: "uncommon",
                        name: "アンコモン",
                        color: "text-green-700 border-green-500",
                      },
                      {
                        rarity: "rare",
                        name: "レア",
                        color: "text-blue-700 border-blue-500",
                      },
                      {
                        rarity: "epic",
                        name: "エピック",
                        color: "text-purple-700 border-purple-500",
                      },
                      {
                        rarity: "legendary",
                        name: "レジェンダリー",
                        color: "text-yellow-700 border-yellow-500",
                      },
                    ].map(({ rarity, name, color }) => {
                      const count = userGachaData.ownedCards.filter(
                        (card) => card.rarity === rarity
                      ).length;
                      return (
                        <Button
                          key={rarity}
                          variant="outline"
                          size="sm"
                          className={`text-xs ${color} border-2`}
                        >
                          {name} ({count})
                        </Button>
                      );
                    })}
                  </div>

                  {/* カードコレクション */}
                  <CardCollectionGrid
                    cards={userGachaData.ownedCards}
                    onCardClick={(card) => {
                      // カード詳細画面に遷移
                      navigate(`/games/gacha/card/${card.id}`);
                    }}
                    title="マイコレクション"
                    showFilters={true}
                    showSearch={true}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 開封アニメーション */}
        {isOpening && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">パックを開封中...</h3>
              <p className="text-gray-600">素晴らしいカードが待っています！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ルーター用のラッパーコンポーネント
export default function GachaSystem() {
  const navigate = useNavigate();
  const [userXP, setUserXP] = useState(1000); // 初期値を1000に設定

  // XPの初期化
  useEffect(() => {
    try {
      const manager = getLevelManager();
      const xp = manager.userLevel.xp;
      console.log("Initial XP loaded:", xp);
      setUserXP(xp || 1000); // デフォルト値を1000に設定
    } catch (error) {
      console.error("Error getting initial XP:", error);
      setUserXP(1000); // エラー時は1000に設定
    }
  }, []);

  const handleXPChange = (newXP: number) => {
    console.log("handleXPChange called with:", newXP);
    setUserXP(newXP);
    // LevelManagerにXPを保存
    try {
      const manager = getLevelManager();
      const currentXP = manager.userLevel.xp;
      console.log("Current XP in manager:", currentXP, "Setting to:", newXP);

      // XPの差分を計算して追加
      const xpDifference = newXP - currentXP;
      if (xpDifference !== 0) {
        manager.addXP(xpDifference);
      }
      saveLevelManager();
      console.log("XP updated successfully");
    } catch (error) {
      console.error("Error updating XP:", error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <GachaSystemComponent
      onBack={handleBack}
      userXP={userXP}
      onXPChange={handleXPChange}
    />
  );
}
