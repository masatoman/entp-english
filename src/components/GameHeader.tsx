import { Heart, Plus, Star, Target, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { StarData } from "../types/starSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { getLevelManager } from "../utils/levelManager";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

// 章情報の定義
const CHAPTER_INFO = {
  1: { name: "初級編", color: "bg-green-500", description: "基礎から始める英語学習" },
  2: { name: "中級編", color: "bg-blue-500", description: "実用的な英語力を身につける" },
  3: { name: "上級編", color: "bg-purple-500", description: "高度な英語表現をマスター" },
  4: { name: "専門編", color: "bg-red-500", description: "専門分野の英語を習得" },
  5: { name: "達人編", color: "bg-yellow-500", description: "ネイティブレベルを目指す" },
};

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
  const progressPercentage =
    requiredXP > 0 ? Math.min(100, (progressXP / requiredXP) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white p-4 shadow-lg border-b border-blue-600/30" style={{
      background: 'linear-gradient(to right, rgb(30 58 138), rgb(55 48 163), rgb(88 28 135))',
      color: 'white'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* 上段: ユーザー情報とレベル */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* ユーザー情報 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* レベルアバター */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-base sm:text-lg border-2 sm:border-3 border-white shadow-xl">
              {userLevel.level || 1}
            </div>
            
            {/* 章アバター（スマホでは非表示） */}
            <div className="hidden sm:flex w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full items-center justify-center text-white font-bold text-sm border-2 border-white/70 shadow-lg">
              {userLevel.chapter || 2}
            </div>
            
            <div>
              <div className="text-base sm:text-lg font-bold text-white drop-shadow-md" style={{ 
                color: 'white', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
              }}>
                Level {userLevel.level || 1}
              </div>
              <div className="text-xs sm:text-sm text-blue-200 font-medium" style={{ 
                color: 'rgb(191 219 254)', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)' 
              }}>
                第{userLevel.chapter || 2}章 • {CHAPTER_INFO[userLevel.chapter || 2]?.name || "中級編"}
              </div>
            </div>
          </div>

          {/* XP進捗 */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-3 sm:mx-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm text-blue-200 font-medium" style={{ 
                color: 'rgb(191 219 254)', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)' 
              }}>経験値</span>
              <span className="text-xs sm:text-sm text-white font-bold drop-shadow-md" style={{ 
                color: 'white', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
              }}>
                {progressXP.toFixed(0)}/{requiredXP} XP
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 sm:h-3 bg-blue-900/50 border border-blue-500/40"
            />
            
            {/* 章の進捗（スマホでは非表示） */}
            <div className="hidden sm:flex items-center justify-between text-xs text-blue-300 mt-1" style={{ 
              color: 'rgb(147 197 253)', 
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)' 
            }}>
              <span>第{userLevel.chapter || 2}章進捗</span>
              <span>{((userLevel.level || 1) % 10 * 10).toFixed(0)}%</span>
            </div>
          </div>

          {/* デイリークエストボタン */}
          {onQuestClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onQuestClick}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 border-2 border-white/20 shadow-lg font-bold relative text-xs sm:text-sm px-2 sm:px-3"
              style={{
                background: 'linear-gradient(to right, rgb(16 185 129), rgb(20 184 166))',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">クエスト</span>
              <span className="sm:hidden">🎯</span>
              {showQuestBadge && questCompletedCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold">
                  {questCompletedCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* 下段: リソース表示 */}
        <div className="flex items-center justify-around bg-indigo-900/40 rounded-lg p-2 sm:p-3 shadow-inner border border-blue-600/30">
          {/* 体力（ハート） */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-sm sm:text-lg font-bold text-white drop-shadow-md" style={{ 
                color: 'white', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
              }}>
                {heartSystem.current}/{heartSystem.max}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const manager = getLevelManager();
                if (manager.recoverAllHearts) {
                  manager.recoverAllHearts();
                  console.log("♥ 体力を全回復しました");
                } else {
                  console.log("♥ 回復機能が利用できません");
                }
              }}
              className="text-red-300 hover:text-red-200 hover:bg-red-500/20 p-0.5 sm:p-1 hidden sm:block"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
          </div>

          {/* スタミナ（星） */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-sm sm:text-lg font-bold text-white drop-shadow-md" style={{ 
                color: 'white', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
              }}>
                {starSystem.current}/{starSystem.max}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const manager = getLevelManager();
                if (manager.recoverAllStars) {
                  manager.recoverAllStars();
                  setStarSystem(manager.getStarSystem());
                  console.log("⭐ スタミナを全回復しました");
                } else {
                  console.log("⭐ 回復機能が利用できません");
                }
              }}
              className="text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20 p-0.5 sm:p-1 hidden sm:block"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
          </div>

          {/* ガチャコイン */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🪙</span>
              <span className="text-lg font-bold text-white drop-shadow-md" style={{ 
                color: 'white', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
              }}>
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
            <span className="text-lg font-bold text-white drop-shadow-md">
              {totalXP.toLocaleString()}
            </span>
            <span className="text-sm text-blue-200 font-medium">XP</span>
          </div>
        </div>

        {/* 回復時間表示（必要時のみ） */}
        {(heartSystem.current < heartSystem.max ||
          starSystem.current < starSystem.max) && (
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-blue-200 font-medium">
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
