import { Flame, Heart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../data/achievements";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { DataManager } from "../utils/dataManager";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";

export default function Home() {
  const navigate = useNavigate();
  const { refreshLevel } = useLevelSystem();
  const { heartSystem } = useHeartSystem();

  const [userStats, setUserStats] = useState<UserStats>(
    DataManager.getUserStats()
  );

  useEffect(() => {
    const refreshData = () => {
      const stats = DataManager.getUserStats();
      setUserStats(stats);
      refreshLevel();
    };

    refreshData();
  }, [refreshLevel]);

  const canStartLearning = heartSystem.current > 0;

  // 予測TOEICスコアの計算（簡易版）
  const calculateTOEICPrediction = () => {
    const baseScore = 320; // 初期スコア
    const correctRate =
      userStats.totalQuestionsAnswered > 0
        ? userStats.correctAnswers / userStats.totalQuestionsAnswered
        : 0;
    const questionsBonus = Math.min(
      userStats.totalQuestionsAnswered * 0.3,
      100
    );
    const accuracyBonus = correctRate * 50;
    return Math.round(baseScore + questionsBonus + accuracyBonus);
  };

  const toeicPrediction = calculateTOEICPrediction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ヘッダー：ストリーク & 予測TOEICスコア */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-3">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">連続学習</p>
                <p className="text-3xl font-bold text-orange-600">
                  {userStats.currentStreak || 0}日
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600 text-right">予測スコア</p>
                <p className="text-3xl font-bold text-blue-600">
                  {toeicPrediction}点
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* 目標までの進捗 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>現在地: {toeicPrediction}点</span>
              <span>目標: 450点</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    ((toeicPrediction - 320) / (450 - 320)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              3ヶ月で+130点達成まで あと{Math.max(450 - toeicPrediction, 0)}点
            </p>
          </div>
        </div>

        {/* 今日の目標（朝・昼・夜） */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ☀️ 今日の目標（1日9分）
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 朝の3分 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    朝の3分
                  </span>
                  <span className="text-xs text-gray-500">+50 XP</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">単語クイズ5問</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">未完了</p>
              </div>

              {/* 昼の1分 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    昼の1分
                  </span>
                  <span className="text-xs text-gray-500">+30 XP</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">文法問題1問</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">未完了</p>
              </div>

              {/* 夜の2分 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    夜の2分
                  </span>
                  <span className="text-xs text-gray-500">+40 XP</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">振り返り3問</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">未完了</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              全部完了で +120 XP 🎉
            </p>
          </CardContent>
        </Card>

        {/* コア5機能 */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">学習メニュー</h2>

          {/* 1. 3分クイズ（おまかせ） */}
          <SelectionCard
            id="quick-quiz"
            title="🎲 おまかせ3分クイズ"
            description="文法・単語のミックス問題（推奨）"
            icon="⚡"
            difficulty="3分"
            detail="必要体力: 1 ♥"
            onClick={() =>
              canStartLearning && navigate("/learning/grammar/category")
            }
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
          />

          {/* 2. ガチャシステム */}
          <SelectionCard
            id="gacha"
            title="🎰 単語ガチャ"
            description="新しい単語をゲット！レアカードを集めよう"
            icon="🎁"
            difficulty="ガチャ"
            detail="XP消費"
            onClick={() => navigate("/games/gacha")}
          />

          {/* 3. 成長グラフ */}
          <SelectionCard
            id="growth"
            title="📈 成長グラフ"
            description="予測TOEICスコアと1週間前との比較"
            icon="📊"
            difficulty="分析"
            detail="体力不要"
            onClick={() => navigate("/progress/dashboard")}
          />

          {/* 4. 実績（ストリーク確認） */}
          <SelectionCard
            id="achievements"
            title="🏆 実績・ストリーク"
            description="学習の進捗とストリーク保護カード"
            icon="🔥"
            difficulty="進捗"
            detail="体力不要"
            onClick={() => navigate("/progress/achievements")}
          />

          {/* 5. 詳細メニュー */}
          <SelectionCard
            id="more"
            title="⚙️ その他の機能"
            description="文法カテゴリ選択・語彙学習・設定など"
            icon="📋"
            difficulty="詳細"
            detail="体力不要"
            onClick={() => navigate("/menu/all")}
          />
        </div>

        {/* 体力不足時の警告 */}
        {!canStartLearning && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">
                    体力が不足しています
                  </h3>
                  <p className="text-sm text-yellow-700">
                    体力が回復するまで待つか、ガチャ・成長グラフなど体力不要の機能を利用してください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 簡易統計 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-600">今日のXP</p>
              <p className="text-2xl font-bold text-blue-600">
                {userStats.todayXP || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-600">正解率</p>
              <p className="text-2xl font-bold text-purple-600">
                {userStats.totalQuestionsAnswered > 0
                  ? (
                      (userStats.correctAnswers /
                        userStats.totalQuestionsAnswered) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-gray-600">累計問題数</p>
              <p className="text-2xl font-bold text-green-600">
                {userStats.totalQuestionsAnswered || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 初回起動時のウィザード案内 */}
        {userStats.totalQuestionsAnswered === 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                🎉 ようこそ！
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                まずは学力診断テストで現在地を確認しましょう
              </p>
              <Button
                onClick={() => navigate("/diagnostic-test")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                学力診断テストを開始
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
