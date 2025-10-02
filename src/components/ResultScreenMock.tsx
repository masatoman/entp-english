import {
  Award,
  Clock,
  Crown,
  Flame,
  Heart,
  Sparkles,
  Star,
  Sword,
  Target,
  Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// 結果データの型定義
interface BattleResult {
  victory: boolean;
  score: number;
  maxScore: number;
  timeUsed: number;
  maxTime: number;
  comboCount: number;
  maxCombo: number;
  accuracy: number;
  questionsAnswered: number;
  totalQuestions: number;
  xpGained: number;
  levelUp: boolean;
  newLevel?: number;
  achievements: Achievement[];
  rewards: Reward[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  isNew: boolean;
}

interface Reward {
  type: "xp" | "item" | "currency" | "unlock";
  name: string;
  amount?: number;
  description: string;
  icon: string;
}

// モックデータ
const mockResult: BattleResult = {
  victory: true,
  score: 850,
  maxScore: 1000,
  timeUsed: 180,
  maxTime: 300,
  comboCount: 12,
  maxCombo: 15,
  accuracy: 85,
  questionsAnswered: 17,
  totalQuestions: 20,
  xpGained: 150,
  levelUp: true,
  newLevel: 16,
  achievements: [
    {
      id: "combo-master",
      name: "コンボマスター",
      description: "10連続正解を達成",
      icon: "🔥",
      rarity: "rare",
      isNew: true,
    },
    {
      id: "speed-demon",
      name: "スピードデーモン",
      description: "3分以内でクリア",
      icon: "⚡",
      rarity: "epic",
      isNew: true,
    },
    {
      id: "accuracy-expert",
      name: "精度の達人",
      description: "85%以上の正確性",
      icon: "🎯",
      rarity: "common",
      isNew: false,
    },
  ],
  rewards: [
    {
      type: "xp",
      name: "経験値",
      amount: 150,
      description: "レベルアップのための経験値",
      icon: "⭐",
    },
    {
      type: "item",
      name: "魔法の巻物",
      amount: 1,
      description: "新しい語彙を学習できる",
      icon: "📜",
    },
    {
      type: "currency",
      name: "ゴールド",
      amount: 50,
      description: "ショップで使用可能",
      icon: "🪙",
    },
    {
      type: "unlock",
      name: "新エリア開放",
      amount: 1,
      description: "レッドゾーンがアンロックされました",
      icon: "🗺️",
    },
  ],
};

// レアリティ別の色設定
const rarityColors = {
  common: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-800",
    accent: "bg-gray-500",
  },
  rare: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    accent: "bg-blue-500",
  },
  epic: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-800",
    accent: "bg-purple-500",
  },
  legendary: {
    bg: "bg-gradient-to-br from-yellow-100 to-orange-100",
    border: "border-yellow-300",
    text: "text-orange-800",
    accent: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
};

// アニメーション用の状態
const useAnimatedNumber = (target: number, duration: number = 2000) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（easeOut）
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(startValue + (target - startValue) * easeOut);

      setCurrent(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return current;
};

// アチーブメントカードコンポーネント
const AchievementCard: React.FC<{
  achievement: Achievement;
  index: number;
}> = ({ achievement, index }) => {
  const colors = rarityColors[achievement.rarity];

  return (
    <Card
      className={`${colors.bg} ${
        colors.border
      } border-2 transition-all duration-500 transform hover:scale-105 ${
        achievement.isNew ? "ring-4 ring-yellow-400 ring-opacity-50" : ""
      }`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-bold ${colors.text}`}>{achievement.name}</h3>
              {achievement.isNew && (
                <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
              )}
            </div>
            <p className={`text-sm ${colors.text} opacity-75`}>
              {achievement.description}
            </p>
          </div>
          <div className="text-right">
            <Badge className={`${colors.accent} text-white`}>
              {achievement.rarity.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 報酬カードコンポーネント
const RewardCard: React.FC<{
  reward: Reward;
  index: number;
}> = ({ reward, index }) => {
  return (
    <Card
      className="bg-gradient-to-br from-green-100 to-blue-100 border-green-300 border-2 transition-all duration-500 transform hover:scale-105"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{reward.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-green-800">{reward.name}</h3>
              {reward.amount && (
                <span className="text-green-700 font-bold">
                  +{reward.amount}
                </span>
              )}
            </div>
            <p className="text-sm text-green-700 opacity-75">
              {reward.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
const ResultScreenMock: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const animatedScore = useAnimatedNumber(mockResult.score, 2000);
  const animatedXP = useAnimatedNumber(mockResult.xpGained, 1500);
  const animatedAccuracy = useAnimatedNumber(mockResult.accuracy, 1000);

  useEffect(() => {
    const timer = setTimeout(() => setShowResults(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showResults) {
      const steps = [
        () => setCurrentStep(1), // スコア表示
        () => setCurrentStep(2), // 統計表示
        () => setCurrentStep(3), // アチーブメント表示
        () => setCurrentStep(4), // 報酬表示
        () => setCurrentStep(5), // 完了
      ];

      steps.forEach((step, index) => {
        setTimeout(step, (index + 1) * 800);
      });
    }
  }, [showResults]);

  if (!showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-purple-800 mb-2">
            戦闘終了！
          </h2>
          <p className="text-gray-600">結果を計算中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              戦闘結果
            </h1>
          </div>

          {mockResult.levelUp && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 border-2 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-800">
                  レベルアップ！ Lv.{mockResult.newLevel} 達成！
                </span>
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          )}
        </div>

        {/* スコア表示 */}
        {currentStep >= 1 && (
          <Card className="mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300 border-2 animate-fadeIn">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-yellow-800 mb-4">
                  {mockResult.victory ? "勝利！" : "敗北..."}
                </h2>

                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-700">
                      {animatedScore}
                    </div>
                    <div className="text-sm text-yellow-600">
                      / {mockResult.maxScore} 点
                    </div>
                  </div>

                  <div className="w-32 h-32 relative">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 120 120"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${
                          (animatedScore / mockResult.maxScore) * 314
                        } 314`}
                        className="text-yellow-500 transition-all duration-2000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-700">
                        {Math.round(
                          (animatedScore / mockResult.maxScore) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 統計表示 */}
        {currentStep >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300 border-2 animate-slideInLeft">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">
                  {Math.floor(mockResult.timeUsed / 60)}:
                  {(mockResult.timeUsed % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-blue-600">使用時間</div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-red-100 to-pink-100 border-red-300 border-2 animate-slideInLeft"
              style={{ animationDelay: "100ms" }}
            >
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-800">
                  {mockResult.comboCount}
                </div>
                <div className="text-sm text-red-600">最大コンボ</div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 border-2 animate-slideInLeft"
              style={{ animationDelay: "200ms" }}
            >
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">
                  {animatedAccuracy}%
                </div>
                <div className="text-sm text-green-600">正確性</div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300 border-2 animate-slideInLeft"
              style={{ animationDelay: "300ms" }}
            >
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">
                  +{animatedXP}
                </div>
                <div className="text-sm text-purple-600">獲得XP</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* アチーブメント表示 */}
        {currentStep >= 3 && (
          <Card className="mb-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 border-2 animate-fadeIn">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-purple-800">
                  達成した実績
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockResult.achievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 報酬表示 */}
        {currentStep >= 4 && (
          <Card className="mb-6 bg-gradient-to-br from-green-100 to-blue-100 border-green-300 border-2 animate-fadeIn">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-green-800">獲得報酬</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResult.rewards.map((reward, index) => (
                  <RewardCard key={index} reward={reward} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* アクションボタン */}
        {currentStep >= 5 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              <Sword className="w-4 h-4 mr-2" />
              次の戦闘へ
            </Button>

            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Heart className="w-4 h-4 mr-2" />
              回復して再挑戦
            </Button>

            <Button
              variant="outline"
              className="border-gray-500 text-gray-600 hover:bg-gray-50 font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Crown className="w-4 h-4 mr-2" />
              ワールドマップへ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultScreenMock;
