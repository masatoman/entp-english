import { Coins, Heart, Star, Target, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { StarData } from "../types/starSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { getLevelManager } from "../utils/levelManager";
import { formatDisplayNumber } from "../utils/numberDisplayUtils";
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
  onChallengeClick?: () => void;
  showChallengeBadge?: boolean;
  challengeCompletedCount?: number;
}

export default function GameHeader({
  onQuestClick,
  showQuestBadge = true,
  questCompletedCount = 0,
  onChallengeClick,
  showChallengeBadge = true,
  challengeCompletedCount = 0,
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

  // 数値表示の制限とフォーマット
  const levelDisplay = formatDisplayNumber(currentLevel, "level");
  const xpDisplay = formatDisplayNumber(totalXP, "xp");
  const coinDisplay = formatDisplayNumber(coinSystem.current, "coins");
  const heartDisplay = formatDisplayNumber(heartSystem.current, "hearts");
  const heartMaxDisplay = formatDisplayNumber(heartSystem.max, "hearts");
  const starDisplay = formatDisplayNumber(starSystem.current, "stars");
  const starMaxDisplay = formatDisplayNumber(starSystem.max, "stars");
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
        {/* ヘッダー全体レイアウト - 全部左寄せ */}
        <div className="flex items-center gap-2 sm:gap-4 py-2">
          {/* Level + ステータスバー（セット） */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col gap-1">
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 cursor-help"
                title={`レベル: ${levelDisplay.full}${
                  levelDisplay.isLimited ? " (制限済み)" : ""
                }`}
              >
                <div
                  className="text-lg font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  Level {levelDisplay.display}
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

            {/* 倍率表示（PCのみ） */}
            {dailyMultiplier > 1 && (
              <div className="hidden md:flex items-center">
                <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div
                    className="text-sm font-bold flex items-center gap-1"
                    style={{
                      color: "#000000",
                      textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    {dailyMultiplier.toFixed(1)}x
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2x2の一塊 */}
          <div className="flex flex-col gap-1">
            {/* 上段: ハート・星 */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* ハート（体力） */}
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-help"
                title={`体力: ${heartDisplay.full}/${heartMaxDisplay.full}${
                  heartDisplay.isLimited ? " (制限済み)" : ""
                }`}
              >
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
                  {heartDisplay.display}/{heartMaxDisplay.display}
                </span>
              </div>

              {/* スター（スタミナ） */}
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-help"
                title={`スタミナ: ${starDisplay.full}/${starMaxDisplay.full}${
                  starDisplay.isLimited ? " (制限済み)" : ""
                }`}
              >
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
                  {starDisplay.display}/{starMaxDisplay.display}
                </span>
              </div>
            </div>

            {/* 下段: コイン・XP */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* コイン */}
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-help"
                title={`コイン: ${coinDisplay.full}${
                  coinDisplay.isLimited ? " (制限済み)" : ""
                }`}
              >
                <Coins
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#ffd700" }}
                />
                <span
                  className="text-xs sm:text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {coinDisplay.display}
                </span>
              </div>

              {/* XP */}
              <div
                className="bg-white/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 cursor-help"
                title={`XP: ${xpDisplay.full}${
                  xpDisplay.isLimited ? " (制限済み)" : ""
                }`}
              >
                <Zap
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#00d2ff" }}
                />
                <span
                  className="text-xs sm:text-sm font-bold"
                  style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {xpDisplay.display}
                </span>
              </div>
            </div>
          </div>

          {/* デイリー・スペシャルミッションセット */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* デイリークエスト */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onQuestClick}
              className="relative p-2 hover:bg-white/20 transition-colors"
            >
              <Trophy className="w-5 h-5" style={{ color: "#ffd700" }} />
              {showQuestBadge && questCompletedCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {questCompletedCount}
                </span>
              )}
            </Button>

            {/* スペシャルチャレンジ */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onChallengeClick}
              className="relative p-2 hover:bg-white/20 transition-colors"
            >
              <Target className="w-5 h-5" style={{ color: "#ff6b6b" }} />
              {showChallengeBadge && challengeCompletedCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {challengeCompletedCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
