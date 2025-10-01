import { Coins, Heart, Star, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { StarData } from "../types/starSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { getLevelManager } from "../utils/levelManager";
import { Button } from "./ui/button";

// 章情報の定義
const CHAPTER_INFO = {
  1: {
    name: "初級編",
    color: "bg-green-500",
    description: "基礎から始める英語学習",
  },
  2: {
    name: "中級編",
    color: "bg-blue-500",
    description: "実用的な英語力を身につける",
  },
  3: {
    name: "上級編",
    color: "bg-purple-500",
    description: "高度な英語表現をマスター",
  },
  4: {
    name: "専門編",
    color: "bg-red-500",
    description: "専門分野の英語を習得",
  },
  5: {
    name: "達人編",
    color: "bg-yellow-500",
    description: "ネイティブレベルを目指す",
  },
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

      // スターシステム更新
      const levelManager = getLevelManager();
      setStarSystem(levelManager.getStarSystem());

      // デイリーボーナス更新
      const multiplier = adrenalineManager.updateDailyBonus();
      setDailyMultiplier(multiplier);
    };

    updateResources();
    const interval = setInterval(updateResources, 1000); // 1秒に短縮して即座に反映
    return () => clearInterval(interval);
  }, []); // 依存配列を空にして無限再レンダリングを防ぐ

  // XP進捗計算（既にlevelManager内で計算済み）
  const currentLevel = userLevel.level || 1;
  const totalXP = userLevel.xp || 0; // ✅ 正しいプロパティ名
  const progressPercentage = userLevel.progress || 0; // ✅ 既に計算済みの進捗%を使用

  return (
    <div
      className="relative overflow-hidden shadow-2xl border-b-2 border-white/20"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
      }}
    >
      {/* 動的な背景効果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4">
        {/* ヘッダー全体レイアウト */}
        <div
          className="flex items-center justify-between"
          style={{ height: "60px" }}
        >
          {/* 左側: レベル&進捗ゲージ */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* レベル&進捗セクション */}
            <div className="flex flex-col gap-1">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <div
                  className="text-lg font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  Level {userLevel.level || 1}
                </div>
              </div>
              {/* 進捗ゲージ */}
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg p-1"
                style={{ width: "140px" }}
              >
                <div
                  className="h-2 bg-gray-800/50 rounded overflow-hidden"
                  style={{ height: "8px" }}
                >
                  <div
                    className="h-full rounded transition-all duration-300 shadow-lg"
                    style={{
                      width: `${progressPercentage}%`,
                      background: "linear-gradient(90deg, #ffd700, #ffed4e)",
                      boxShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* アイコン群 */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* ハート（体力） */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2">
                <Heart
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#ff4757" }}
                />
                <span
                  className="text-xs sm:text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {heartSystem.current}/{heartSystem.max}
                </span>
              </div>

              {/* スター（スタミナ） */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2">
                <Star
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#ffa502" }}
                />
                <span
                  className="text-xs sm:text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {starSystem.current}/{starSystem.max}
                </span>
              </div>

              {/* コイン（スマホでは非表示） */}
              <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 items-center gap-2">
                <Coins className="w-5 h-5" style={{ color: "#ffd700" }} />
                <span
                  className="text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {coinSystem.current}
                </span>
              </div>

              {/* XP（スマホでは非表示） */}
              <div className="hidden md:flex bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "#00d2ff" }} />
                <span
                  className="text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {totalXP || 0}
                </span>
              </div>
            </div>
          </div>

          {/* 右側: 倍率表示（スマホでは非表示） */}
          <div className="hidden lg:flex items-center gap-2">
            {/* デイリーボーナス */}
            {dailyMultiplier > 1.0 && (
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-blue-400/50">
                ×{dailyMultiplier.toFixed(1)} XP
              </div>
            )}

            {/* 総合効果 */}
            {dailyMultiplier > 1.0 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-orange-400/50">
                ×{dailyMultiplier.toFixed(1)} 総合効果
              </div>
            )}

            {/* コンボ効果 */}
            {adrenalineManager.calculateTotalMultiplier() > 1.0 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-purple-400/50">
                ×{adrenalineManager.calculateTotalMultiplier().toFixed(1)}{" "}
                コンボ
              </div>
            )}

            {/* デイリークエストボタン */}
            {onQuestClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onQuestClick}
                className="header-button font-bold relative text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl px-2 sm:px-4 py-2"
                style={{
                  background: "linear-gradient(135deg, #00d4aa, #00a085)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 4px 15px rgba(0, 212, 170, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #00a085, #00d4aa)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #00d4aa, #00a085)";
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                <Target className="w-4 h-4 mr-1 sm:mr-2 hidden sm:inline" />
                <span className="hidden sm:inline">クエスト</span>
                <span className="sm:hidden">🎯</span>
                {showQuestBadge && questCompletedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                    {questCompletedCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
