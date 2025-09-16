import {
  ArrowLeft,
  ChevronRight,
  Crown,
  Diamond,
  Gift,
  Star,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { GachaPack, WordCard } from "../types/gacha";
import { GachaSystem } from "../utils/gachaSystem";
import { CardDetailContent } from "./CardDetailContent";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

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
  const [drawnCards, setDrawnCards] = useState<WordCard[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [userGachaData, setUserGachaData] = useState(
    GachaSystem.getUserGachaData()
  );
  const [availablePacks] = useState(GachaSystem.getAvailablePacks());
  const [selectedCard, setSelectedCard] = useState<WordCard | null>(null);
  const [showCollection, setShowCollection] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(false);

  // レアリティに応じたアイコンと色を取得
  const getRarityInfo = (rarity: WordCard["rarity"]) => {
    switch (rarity) {
      case "common":
        return {
          icon: Star,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
        };
      case "uncommon":
        return {
          icon: Star,
          color: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
        };
      case "rare":
        return {
          icon: Zap,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-300",
        };
      case "epic":
        return {
          icon: Crown,
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-300",
        };
      case "legendary":
        return {
          icon: Diamond,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        };
      default:
        return {
          icon: Star,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
        };
    }
  };

  const handleOpenPack = async (packId: string) => {
    const pack = GachaSystem.getPackById(packId);
    if (!pack) return;

    const canOpen = GachaSystem.canOpenPack(packId, userXP);
    if (!canOpen.canOpen) {
      alert(canOpen.reason);
      return;
    }

    setIsOpening(true);
    setSelectedPack(packId);

    // アニメーション演出
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const cards = GachaSystem.openPackAndSave(packId);
      setDrawnCards(cards);

      // XPを消費
      onXPChange(userXP - pack.cost);

      // 語彙学習システムに追加
      GachaSystem.addToVocabularySystem(cards);

      // ユーザーデータを更新
      setUserGachaData(GachaSystem.getUserGachaData());
    } catch (error) {
      console.error("Error opening pack:", error);
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
    }

    setIsOpening(false);
  };

  const getPackThemeIcon = (theme: GachaPack["theme"]) => {
    switch (theme) {
      case "part1_2":
        return "🎧";
      case "part3_4":
        return "💬";
      case "part5_6":
        return "📝";
      case "part7":
        return "📖";
      case "mixed":
        return "🎯";
      default:
        return "📦";
    }
  };

  const getScoreBandColor = (scoreBand: string) => {
    switch (scoreBand) {
      case "400-500":
        return "bg-green-100 text-green-800";
      case "500-600":
        return "bg-blue-100 text-blue-800";
      case "600-700":
        return "bg-purple-100 text-purple-800";
      case "700-800":
        return "bg-orange-100 text-orange-800";
      case "800+":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // カード詳細画面を表示
  if (showCardDetail && selectedCard) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCardDetail(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-600" />
              カード詳細
            </h1>
          </div>
        </div>

        {/* カード詳細コンテンツ */}
        <CardDetailContent card={selectedCard} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
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
          <div className="text-right">
            <div className="text-sm text-gray-600">所持XP</div>
            <div className="text-2xl font-bold text-purple-600">{userXP}</div>
          </div>
        </div>
      </div>

      {/* コレクション統計 */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-2">コレクション統計</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">総カード数</div>
            <div className="font-bold">
              {userGachaData.collection.totalCards}
            </div>
          </div>
          <div>
            <div className="text-gray-600">ユニークカード</div>
            <div className="font-bold">
              {userGachaData.collection.uniqueCards}
            </div>
          </div>
          <div>
            <div className="text-gray-600">開封パック数</div>
            <div className="font-bold">{userGachaData.totalPacks}</div>
          </div>
          <div>
            <div className="text-gray-600">本日開封数</div>
            <div className="font-bold">{userGachaData.dailyPacksUsed}/5</div>
          </div>
        </div>
      </Card>

      {/* パック選択またはコレクション表示 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {showCollection ? "所持カードコレクション" : "パックを選択"}
        </h2>
        {!showCollection ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePacks.map((pack) => {
              const canOpen = GachaSystem.canOpenPack(pack.id, userXP);
              const RarityIcon = getRarityInfo(
                pack.rarity === "normal"
                  ? "common"
                  : pack.rarity === "premium"
                  ? "rare"
                  : "legendary"
              ).icon;

              return (
                <Card
                  key={pack.id}
                  className={`p-4 transition-all hover:shadow-lg cursor-pointer ${
                    selectedPack === pack.id ? "ring-2 ring-purple-500" : ""
                  } ${!canOpen.canOpen ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    canOpen.canOpen && !isOpening && handleOpenPack(pack.id)
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getPackThemeIcon(pack.theme)}
                      </span>
                      <RarityIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBandColor(
                        pack.targetScore
                      )}`}
                    >
                      {pack.targetScore}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {pack.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-purple-600">
                      {pack.cost} XP
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canOpen.canOpen && !isOpening
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {isOpening && selectedPack === pack.id
                        ? "開封中..."
                        : canOpen.canOpen
                        ? "クリックして開封"
                        : "開封不可"}
                    </div>
                  </div>

                  {!canOpen.canOpen && (
                    <div className="text-xs text-red-600 mt-2">
                      {canOpen.reason}
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
                    <div className="text-xs text-gray-600">ユニークカード</div>
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
                    <div className="text-xs text-gray-600">レジェンダリー</div>
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
                  {["common", "uncommon", "rare", "epic", "legendary"].map(
                    (rarity) => {
                      const count = userGachaData.ownedCards.filter(
                        (card) => card.rarity === rarity
                      ).length;
                      const rarityInfo = getRarityInfo(
                        rarity as WordCard["rarity"]
                      );
                      return (
                        <Button
                          key={rarity}
                          variant="outline"
                          size="sm"
                          className={`text-xs ${rarityInfo.color} border-current`}
                        >
                          {rarityInfo.label} ({count})
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* カードグリッド */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userGachaData.ownedCards.map((card, index) => {
                    const rarityInfo = getRarityInfo(card.rarity);
                    const RarityIcon = rarityInfo.icon;

                    return (
                      <Card
                        key={`collection-${card.id}-${index}`}
                        className={`p-3 text-center transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${rarityInfo.bgColor} ${rarityInfo.borderColor} border-2`}
                        onClick={() => {
                          setSelectedCard(card);
                          setShowCardDetail(true);
                        }}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <RarityIcon
                            className={`w-4 h-4 ${rarityInfo.color}`}
                          />
                        </div>

                        <h4 className="font-bold text-xs mb-1 line-clamp-1">
                          {card.word}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {card.meaning}
                        </p>

                        <div className="flex items-center justify-between">
                          <div
                            className={`inline-block px-1 py-0.5 rounded-full text-xs font-medium ${rarityInfo.bgColor} ${rarityInfo.color}`}
                          >
                            {card.rarity.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-xs text-blue-600">
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 開封結果 */}
      {drawnCards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">開封結果</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {drawnCards.map((card, index) => {
              const rarityInfo = getRarityInfo(card.rarity);
              const RarityIcon = rarityInfo.icon;

              return (
                <Card
                  key={`${card.id}-${index}`}
                  className={`p-3 text-center transition-all hover:scale-105 cursor-pointer ${rarityInfo.bgColor} ${rarityInfo.borderColor} border-2`}
                  onClick={() => {
                    setSelectedCard(card);
                    setShowCardDetail(true);
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <RarityIcon className={`w-5 h-5 ${rarityInfo.color}`} />
                  </div>

                  <h4 className="font-bold text-sm mb-1">{card.word}</h4>
                  <p className="text-xs text-gray-600 mb-2">{card.meaning}</p>

                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${rarityInfo.bgColor} ${rarityInfo.color}`}
                  >
                    {card.rarity.toUpperCase()}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {card.partOfSpeech}
                  </div>

                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    クリックで詳細
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {drawnCards.length}
              枚のカードを獲得しました！語彙学習で使用できます。
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 カードをクリックすると詳細情報が見れます
            </p>
          </div>
        </div>
      )}

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
  );
};
