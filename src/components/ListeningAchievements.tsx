import {
  Calendar,
  CheckCircle,
  Circle,
  Headphones,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ListeningAchievement } from "../data/listeningAchievements";
import { ListeningProgress, ListeningStatistics } from "../types";
import {
  AchievementProgress,
  listeningAchievementManager,
} from "../utils/listeningAchievementManager";
import { listeningProgressManager } from "../utils/listeningProgressManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface ListeningAchievementsProps {
  userId: string;
}

export const ListeningAchievements: React.FC<ListeningAchievementsProps> = ({
  userId,
}) => {
  const [listeningStats, setListeningStats] =
    useState<ListeningStatistics | null>(null);
  const [completedAchievements, setCompletedAchievements] = useState<
    ListeningAchievement[]
  >([]);
  const [incompleteAchievements, setIncompleteAchievements] = useState<
    {
      achievement: ListeningAchievement;
      progress: AchievementProgress | null;
    }[]
  >([]);
  const [recentProgress, setRecentProgress] = useState<ListeningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListeningData();
  }, [userId]);

  const loadListeningData = async () => {
    try {
      setLoading(true);

      // リスニング統計を取得
      const stats = await listeningProgressManager.getUserStatistics(userId);
      setListeningStats(stats);

      // 達成済みアチーブメントを取得
      const completed =
        await listeningAchievementManager.getCompletedAchievements(userId);
      setCompletedAchievements(completed);

      // 未達成アチーブメントを取得
      const incomplete =
        await listeningAchievementManager.getIncompleteAchievements(userId);
      setIncompleteAchievements(incomplete);

      // 最近の進捗を取得
      const recent = await listeningProgressManager.getRecentProgress(
        userId,
        10
      );
      setRecentProgress(recent);
    } catch (error) {
      console.error("リスニングデータ読み込みエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const getPartDisplayName = (part: string) => {
    switch (part) {
      case "part1":
        return "Part 1 (写真描写)";
      case "part2":
        return "Part 2 (応答問題)";
      case "part3":
        return "Part 3 (会話問題)";
      case "part4":
        return "Part 4 (説明文問題)";
      default:
        return part;
    }
  };

  const getDifficultyDisplayName = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初級";
      case "intermediate":
        return "中級";
      case "advanced":
        return "上級";
      default:
        return difficulty;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800";
      case "uncommon":
        return "bg-green-100 text-green-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">データを読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* リスニング統計サマリー */}
      {listeningStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="w-5 h-5 mr-2" />
              リスニング学習統計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {listeningStats.totalSessions}
                </div>
                <div className="text-sm text-muted-foreground">
                  総セッション数
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {listeningStats.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">総問題数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {listeningStats.averageScore}%
                </div>
                <div className="text-sm text-muted-foreground">平均スコア</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatDuration(listeningStats.totalTimeSpent)}
                </div>
                <div className="text-sm text-muted-foreground">総学習時間</div>
              </div>
            </div>

            {/* 連続学習日数 */}
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      連続学習日数
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {listeningStats.currentStreak}日
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">最長記録</div>
                  <div className="text-lg font-medium text-orange-600">
                    {listeningStats.longestStreak}日
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 達成済みアチーブメント */}
      {completedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              達成済みリスニング実績 ({completedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-green-700">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-green-600 font-medium">
                      +{achievement.reward.xp} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 未達成アチーブメント */}
      {incompleteAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-gray-500" />
              未達成リスニング実績 ({incompleteAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incompleteAchievements.map(({ achievement, progress }) => {
                const progressValue = progress?.currentValue || 0;
                const progressPercentage =
                  (progressValue / achievement.condition.value) * 100;

                return (
                  <div
                    key={achievement.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Circle className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {achievement.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">進捗</span>
                        <span className="font-medium">
                          {progressValue} / {achievement.condition.value}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          報酬: {achievement.reward.xp} XP
                        </div>
                        {progress?.lastUpdated && (
                          <div className="text-xs text-muted-foreground">
                            最終更新: {formatDate(progress.lastUpdated)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 最近の学習履歴 */}
      {recentProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              最近の学習履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProgress.map((session) => (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {session.score}%
                    </div>
                    <div>
                      <div className="font-medium">
                        {getPartDisplayName(session.part)} -{" "}
                        {getDifficultyDisplayName(session.difficulty)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.correctAnswers}/{session.totalQuestions} 正解
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(session.completedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDuration(session.timeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* データがない場合 */}
      {!listeningStats ||
        (listeningStats.totalSessions === 0 &&
          completedAchievements.length === 0 &&
          incompleteAchievements.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  リスニング学習を始めましょう
                </h3>
                <p className="text-muted-foreground mb-4">
                  リスニング学習を開始すると、ここに詳細な進捗と実績が表示されます。
                </p>
                <Button onClick={() => (window.location.href = "/listening")}>
                  リスニング学習を開始
                </Button>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};
