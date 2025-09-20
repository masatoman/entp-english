import { Star, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DailyChallenge, DailyChallengeProgress } from "../types";
import { DailyChallengeManager } from "../utils/dailyChallengeManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

/**
 * デイリーチャレンジカード
 * ENTPの新奇性追求と変化への欲求に対応
 */
export function DailyChallengeCard() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [progress, setProgress] = useState<DailyChallengeProgress | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const todayChallenge = DailyChallengeManager.getTodayChallenge();
    const challengeProgress = DailyChallengeManager.getProgress();
    const challengeStats = DailyChallengeManager.getStats();

    setChallenge(todayChallenge);
    setProgress(challengeProgress);
    setStats(challengeStats);
  }, []);

  const handleStartChallenge = () => {
    if (!challenge) return;

    // チャレンジタイプに応じて適切な学習画面に遷移
    switch (challenge.type) {
      case "vocabulary":
        navigate("/learning/vocabulary/difficulty?challenge=true");
        break;
      case "grammar":
        navigate("/learning/grammar/category?challenge=true");
        break;
      case "time-attack":
        navigate("/learning/time-attack?challenge=true");
        break;
      case "creative":
        navigate("/learning/essay-writing?challenge=true");
        break;
      case "efficiency":
        navigate(
          "/learning/vocabulary/difficulty?challenge=true&mode=efficiency"
        );
        break;
      default:
        navigate("/learning/vocabulary/difficulty");
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "vocabulary":
        return "📚";
      case "grammar":
        return "✏️";
      case "time-attack":
        return "⏱️";
      case "creative":
        return "✨";
      case "efficiency":
        return "🚀";
      default:
        return "🎯";
    }
  };

  const getChallengeTypeLabel = (type: string): string => {
    switch (type) {
      case "vocabulary":
        return "語彙";
      case "grammar":
        return "文法";
      case "time-attack":
        return "タイムアタック";
      case "creative":
        return "創作";
      case "efficiency":
        return "効率";
      default:
        return "チャレンジ";
    }
  };

  if (!challenge || !progress || !stats) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-0 shadow-lg overflow-hidden ${
        challenge.isCompleted ? "opacity-75" : ""
      }`}
    >
      {/* カラーバー */}
      <div className={`h-2 ${challenge.color}`} />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{challenge.icon}</div>
            <div>
              <h3 className="font-bold text-lg">スペシャルミッション</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {challenge.name}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  今日限定
                </Badge>
              </div>
            </div>
          </div>

          {challenge.isCompleted && (
            <div className="text-green-500 text-2xl">✅</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* チャレンジ説明 */}
        <p className="text-sm text-gray-700">{challenge.description}</p>

        {/* ルール表示 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">クリア条件</h4>
          <div className="space-y-1">
            {challenge.rules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-xs text-gray-600">
                  {rule.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 報酬情報 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">
                ボーナス報酬
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-800">
                +{challenge.bonusXP} XP
              </div>
              <div className="text-xs text-yellow-600">
                {challenge.bonusMultiplier}x倍率
              </div>
            </div>
          </div>
        </div>

        {/* ストリーク情報 */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                チャレンジストリーク
              </span>
            </div>
            <div className="text-sm font-bold text-orange-800">
              {stats.currentStreak}日連続
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="pt-2">
          {challenge.isCompleted ? (
            <Button disabled className="w-full h-12 bg-green-500 text-white">
              <div className="flex items-center space-x-2">
                <span>✅ 今日のチャレンジ完了！</span>
              </div>
            </Button>
          ) : (
            <Button
              onClick={handleStartChallenge}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>チャレンジ開始</span>
              </div>
            </Button>
          )}
        </div>

        {/* 統計情報（小さく表示） */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>総完了: {stats.totalCompleted}回</span>
            <span>完了率: {Math.round(stats.completionRate * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * デイリーチャレンジ詳細モーダル（将来的に実装）
 */
export function DailyChallengeModal() {
  // TODO: チャレンジの詳細情報とルール説明を表示するモーダル
  return null;
}
