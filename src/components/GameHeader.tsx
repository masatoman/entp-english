import { Heart, Plus, Star, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { StarData } from "../types/starSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { getLevelManager } from "../utils/levelManager";
import { calculateRecoveredStars } from "../utils/starUtils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface GameHeaderProps {
  onQuestClick?: () => void;
  showQuestBadge?: boolean;
  questCompletedCount?: number;
}

export default function GameHeader({
  onQuestClick,
  showQuestBadge = true,
  questCompletedCount = 0,
}: GameHeaderProps) {
  const navigate = useNavigate();
  const { userLevel } = useLevelSystem();
  const { heartSystem, processRecovery } = useHeartSystem();

  // スターシステム
  const [starSystem, setStarSystem] = useState<StarData>(() => {
    const levelManager = getLevelManager();
    return levelManager.getStarSystem();
  });

  // コインシステム
  const [coinSystem, setCoinSystem] = useState(
    dailyQuestManager.getCoinSystem()
  );

  // デイリーボーナス
  const [dailyMultiplier, setDailyMultiplier] = useState(1.0);

  // 定期更新
  useEffect(() => {
    const updateResources = () => {
      // コインシステム更新
      setCoinSystem(dailyQuestManager.getCoinSystem());

      // デイリーボーナス更新
      const multiplier = adrenalineManager.updateDailyBonus();
      setDailyMultiplier(multiplier);
    };

    updateResources();
    const interval = setInterval(updateResources, 10000); // 10秒に変更
    return () => clearInterval(interval);
  }, []); // 依存配列を空にして無限再レンダリングを防ぐ

  // XP進捗計算（LevelDisplayと同じロジックを使用）
  const currentLevel = userLevel.level || 1;
  const totalXP = userLevel.totalXP || 0;
  const currentLevelXP = (currentLevel - 1) * 100;
  const nextLevelXP = currentLevel * 100;
  const progressXP = Math.max(0, totalXP - currentLevelXP);
  const requiredXP = nextLevelXP - currentLevelXP;
  const progressPercentage = requiredXP > 0 ? Math.min(100, (progressXP / requiredXP) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        {/* 上段: ユーザー情報とレベル */}
        <div className="flex items-center justify-between mb-4">
          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
              {userLevel.level || 1}
            </div>
            <div>
              <div className="text-lg font-bold">Level {userLevel.level || 1}</div>
              <div className="text-sm text-purple-200">中級編</div>
            </div>
          </div>

          {/* XP進捗 */}
          <div className="flex-1 max-w-md mx-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-purple-200">経験値</span>
              <span className="text-sm text-white font-medium">
                {progressXP.toFixed(0)}/{requiredXP} XP
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-purple-900/50"
            />
          </div>

          {/* デイリークエストボタン */}
          {onQuestClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onQuestClick}
              className="border-teal-400 text-teal-300 hover:bg-teal-400/20 relative"
            >
              <Target className="w-4 h-4 mr-1" />
              クエスト
              {showQuestBadge && questCompletedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {questCompletedCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* 下段: リソース表示 */}
        <div className="flex items-center justify-between">
          {/* 体力（ハート） */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-lg font-bold text-white">
                {heartSystem.current}/{heartSystem.max}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const manager = getLevelManager();
                if (manager.addHeart()) {
                  console.log("♥ 体力を1回復しました");
                } else {
                  console.log("♥ 体力は既に最大です");
                }
              }}
              className="text-red-300 hover:text-red-200 hover:bg-red-500/20 p-1"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* スタミナ（星） */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold text-white">
                {starSystem.current}/{starSystem.max}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const currentStats = DataManager.getUserStats();
                const updatedStats = {
                  ...currentStats,
                  stars: {
                    ...currentStats.stars,
                    current: Math.min(
                      currentStats.stars.current + 1,
                      currentStats.stars.max
                    ),
                    lastRecoveryTime: Date.now(),
                  },
                };
                DataManager.saveUserStats(updatedStats);
                setStarSystem(updatedStats.stars);
                console.log("⭐ スタミナを1回復しました");
              }}
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20 p-1"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* ガチャコイン */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🪙</span>
              <span className="text-lg font-bold text-yellow-300">
                {coinSystem.current}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                dailyQuestManager.addCoins(10, "special");
                setCoinSystem(dailyQuestManager.getCoinSystem());
                console.log("🪙 コインを10枚追加しました");
              }}
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20 p-1"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* デイリーボーナス表示 */}
          {dailyMultiplier > 1.0 && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-400/30">
              <span className="text-sm">📅</span>
              <div className="text-sm">
                <span className="text-yellow-300 font-bold">
                  ×{dailyMultiplier.toFixed(1)}
                </span>
                <span className="text-yellow-200 ml-1">XP</span>
              </div>
            </div>
          )}

          {/* 総XP表示 */}
          <div className="flex items-center space-x-1">
            <span className="text-sm">⚡</span>
            <span className="text-lg font-bold text-blue-300">
              {totalXP.toLocaleString()}
            </span>
            <span className="text-sm text-blue-200">XP</span>
          </div>
        </div>

        {/* 回復時間表示（必要時のみ） */}
        {(heartSystem.current < heartSystem.max ||
          starSystem.current < starSystem.max) && (
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-purple-300">
            {heartSystem.current < heartSystem.max && (
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>5分で回復</span>
              </div>
            )}
            {starSystem.current < starSystem.max && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>10分で回復</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
