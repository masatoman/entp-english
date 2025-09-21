import { Check, Star, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { CoinSystem, DailyQuest, DailyQuestSystem } from "../types/dailyQuest";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface DailyQuestPanelProps {
  onClose: () => void;
}

export default function DailyQuestPanel({ onClose }: DailyQuestPanelProps) {
  const [questSystem, setQuestSystem] = useState<DailyQuestSystem | null>(null);
  const [coinSystem, setCoinSystem] = useState<CoinSystem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null);

  useEffect(() => {
    const loadData = () => {
      const quests = dailyQuestManager.getQuestSystem();
      const coins = dailyQuestManager.getCoinSystem();
      setQuestSystem(quests);
      setCoinSystem(coins);
    };

    loadData();

    // 1秒ごとに更新（進捗反映のため）
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 背景クリックで閉じる
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // スワイプダウンで閉じる（モバイル用）
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({
      y: touch.clientY,
      time: Date.now(),
    });
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = event.changedTouches[0];
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;

    // 下向きに50px以上、かつ速度が0.5以上でスワイプダウンと判定
    if (deltaY > 50 && velocity > 0.5) {
      onClose();
    }
    
    setTouchStart(null);
  };

  if (!questSystem || !coinSystem) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>デイリークエストを読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = dailyQuestManager.getCompletionStats();

  const getRarityColor = (rarity: DailyQuest["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500";
      case "epic":
        return "from-purple-400 to-pink-500";
      case "rare":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-300 to-gray-400";
    }
  };

  const getRarityBorder = (rarity: DailyQuest["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-400";
      case "epic":
        return "border-purple-400";
      case "rare":
        return "border-blue-400";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 pt-8 sm:pt-16"
      onClick={handleBackgroundClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Card 
        ref={modalRef}
        className="w-full max-w-sm sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-2xl font-bold">
                デイリークエスト
              </CardTitle>
              <p className="text-teal-100 mt-1 text-sm sm:text-base">
                全てのコンテンツを楽しもう！
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">


          {/* クエスト一覧 */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">
              今日のクエスト
            </h3>
            {questSystem.availableQuests.map((quest) => (
              <Card
                key={quest.id}
                className={`border-2 ${getRarityBorder(quest.rarity)} ${
                  quest.isCompleted ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* クエストアイコンとレアリティ */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${getRarityColor(
                          quest.rarity
                        )} flex items-center justify-center text-lg sm:text-2xl text-white shadow-lg`}
                      >
                        {quest.icon}
                      </div>
                      {quest.isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* クエスト情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                          {quest.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            quest.rarity === "legendary"
                              ? "border-yellow-400 text-yellow-700"
                              : quest.rarity === "epic"
                              ? "border-purple-400 text-purple-700"
                              : quest.rarity === "rare"
                              ? "border-blue-400 text-blue-700"
                              : "border-gray-400 text-gray-700"
                          }`}
                        >
                          {quest.rarity === "legendary"
                            ? "🌟 伝説"
                            : quest.rarity === "epic"
                            ? "💎 エピック"
                            : quest.rarity === "rare"
                            ? "💙 レア"
                            : "⚪ 通常"}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        {quest.description}
                      </p>

                      {/* 進捗バー */}
                      <div className="mb-2 sm:mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">進捗</span>
                          <span className="text-xs text-gray-600">
                            {quest.currentProgress}/{quest.targetAmount}
                          </span>
                        </div>
                        <Progress
                          value={
                            (quest.currentProgress / quest.targetAmount) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      {/* 報酬表示 */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">
                          報酬:
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {quest.rewards.map((reward, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
                            >
                              <span className="text-sm">
                                {reward.type === "xp" ? "⚡" : "🪙"}
                              </span>
                              <span className="text-xs font-medium">
                                +{reward.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 完了状態 */}
                      {quest.isCompleted && (
                        <div className="mt-2 flex items-center space-x-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">完了済み</span>
                          {quest.completedAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(quest.completedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 全完了ボーナス */}
          {stats.completed === stats.total && stats.total > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-400">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-lg font-bold text-green-700 mb-1">
                  本日のクエスト全完了！
                </h3>
                <p className="text-sm text-green-600">
                  素晴らしい！明日も新しいクエストでお待ちしています
                </p>
                <div className="mt-3 flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">+100 ボーナスXP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">🪙</span>
                    <span className="text-sm font-medium">
                      +50 コイン
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* クローズボタン */}
          <div className="text-center pt-3 sm:pt-4">
            <Button onClick={onClose} className="w-full" size="sm">
              学習を続ける
            </Button>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
              - 空白タップ・ESCキー・スワイプダウンで閉じる -
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
