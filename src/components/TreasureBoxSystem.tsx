import { useState, useEffect } from "react";
import { TreasureBox, TreasureReward } from "../types/adrenalineSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TreasureBoxSystemProps {
  onBoxOpened?: (rewards: TreasureReward[]) => void;
}

export default function TreasureBoxSystem({ onBoxOpened }: TreasureBoxSystemProps) {
  const [treasureBoxes, setTreasureBoxes] = useState<TreasureBox[]>([]);
  const [openingBox, setOpeningBox] = useState<string | null>(null);
  const [showRewards, setShowRewards] = useState<TreasureReward[] | null>(null);

  useEffect(() => {
    const loadTreasureBoxes = () => {
      const system = adrenalineManager.getSystem();
      setTreasureBoxes(system.treasureBoxes.filter(box => !box.isOpened));
    };

    loadTreasureBoxes();
    const interval = setInterval(loadTreasureBoxes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBox = async (boxId: string) => {
    setOpeningBox(boxId);
    
    // 開封アニメーション
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const rewards = adrenalineManager.openTreasureBox(boxId);
    
    // 報酬を適用
    const levelManager = getLevelManager();
    rewards.forEach(reward => {
      switch (reward.type) {
        case "xp":
          levelManager.addXP(reward.amount);
          break;
        case "hearts":
          levelManager.recoverAllHearts();
          break;
        case "stars":
          levelManager.recoverAllStars();
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

    setShowRewards(rewards);
    setOpeningBox(null);
    
    // 宝箱リストを更新
    const system = adrenalineManager.getSystem();
    setTreasureBoxes(system.treasureBoxes.filter(box => !box.isOpened));
    
    onBoxOpened?.(rewards);
  };

  const getBoxIcon = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze": return "📦";
      case "silver": return "🎁";
      case "gold": return "✨";
      case "rainbow": return "🌈";
      default: return "📦";
    }
  };

  const getBoxColor = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze": return "border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-100";
      case "silver": return "border-gray-400 bg-gradient-to-br from-gray-50 to-slate-100";
      case "gold": return "border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-100";
      case "rainbow": return "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-100";
      default: return "border-gray-300 bg-white";
    }
  };

  const getBoxName = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze": return "ブロンズ宝箱";
      case "silver": return "シルバー宝箱";
      case "gold": return "ゴールド宝箱";
      case "rainbow": return "レインボー宝箱";
      default: return "宝箱";
    }
  };

  if (treasureBoxes.length === 0 && !showRewards) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md mx-auto p-4">
        {showRewards ? (
          // 報酬表示画面
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                🎉 宝箱開封完了！ 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-lg font-semibold text-gray-800">
                獲得した報酬
              </div>
              
              <div className="space-y-2">
                {showRewards.map((reward, index) => (
                  <div 
                    key={index}
                    className={`
                      p-3 rounded-lg border-2 flex items-center justify-between
                      ${reward.rarity === "legendary" ? "border-purple-400 bg-purple-50" : ""}
                      ${reward.rarity === "epic" ? "border-yellow-400 bg-yellow-50" : ""}
                      ${reward.rarity === "rare" ? "border-blue-400 bg-blue-50" : ""}
                      ${reward.rarity === "common" ? "border-gray-400 bg-gray-50" : ""}
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {reward.type === "xp" ? "⚡" : 
                         reward.type === "hearts" ? "❤️" :
                         reward.type === "stars" ? "⭐" :
                         reward.type === "gacha_ticket" ? "🎫" : "✨"}
                      </span>
                      <div>
                        <div className="font-medium text-sm">{reward.description}</div>
                        <Badge variant="outline" className="text-xs">
                          {reward.rarity === "legendary" ? "伝説" :
                           reward.rarity === "epic" ? "エピック" :
                           reward.rarity === "rare" ? "レア" : "通常"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      +{reward.amount}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setShowRewards(null)} 
                className="w-full mt-4"
                size="lg"
              >
                続ける
              </Button>
            </CardContent>
          </Card>
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
                学習の成果で宝箱を獲得しました！<br/>
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
                          <span className="text-3xl">{getBoxIcon(box.type)}</span>
                          <div>
                            <div className="font-bold text-lg">{getBoxName(box.type)}</div>
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
