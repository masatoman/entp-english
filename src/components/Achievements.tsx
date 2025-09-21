import { ArrowLeft, Flame, Star, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Achievement,
  getTierColor,
  getTierTextColor,
  UserStats,
} from "../data/achievements";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

// ルーター対応版 - propsは不要

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progressPercentage =
    (achievement.progress / achievement.maxProgress) * 100;
  const tierColor = getTierColor(achievement.tier);
  const tierTextColor = getTierTextColor(achievement.tier);

  return (
    <Card
      className={`
      relative overflow-hidden transition-all duration-300 border-2
      ${
        achievement.isUnlocked
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg"
          : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
      }
    `}
    >
      {achievement.isUnlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`
              text-3xl p-2 rounded-full bg-gradient-to-br ${tierColor}
              ${achievement.isUnlocked ? "opacity-100" : "opacity-50 grayscale"}
            `}
            >
              {achievement.icon}
            </div>
            <div>
              <h3
                className={`font-medium ${
                  achievement.isUnlocked ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {achievement.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          </div>
          <Badge
            variant={achievement.isUnlocked ? "default" : "secondary"}
            className={`text-xs ${achievement.isUnlocked ? tierTextColor : ""}`}
          >
            {achievement.tier.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">進捗</span>
          <span
            className={
              achievement.isUnlocked
                ? "text-emerald-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {achievement.progress} / {achievement.maxProgress}
          </span>
        </div>

        <Progress
          value={progressPercentage}
          className={`h-2 ${achievement.isUnlocked ? "" : "opacity-50"}`}
        />

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">
              {achievement.xpReward} XP
            </span>
          </div>
          {achievement.isUnlocked && (
            <Badge variant="outline" className="text-xs text-emerald-600">
              獲得済み
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-md">
      <CardContent className="p-4 text-center">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${color} mb-3`}
        >
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        <div className="text-2xl font-semibold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function Achievements() {
  const navigate = useNavigate();
  // ページトップにスクロール
  useScrollToTop();

  const [userStats, setUserStats] = useState<UserStats>(
    DataManager.getUserStats()
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // データを読み込み
    const stats = DataManager.getUserStats();
    const achievementsData = DataManager.getAchievements();

    setUserStats(stats);
    setAchievements(achievementsData);

    // 実績ページ訪問をデイリークエストに記録
    dailyQuestManager.recordAchievementsVisit();
  }, []);

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">実績</h1>
          <div className="w-10" />
        </div>

        {/* Total XP Display */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-foreground border-0 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 mr-2" />
              <span className="text-lg">合計XP</span>
            </div>
            <div className="text-5xl font-bold mb-2">
              {userStats.totalXP.toLocaleString()}
            </div>
            <div className="text-blue-100">継続は力なり！</div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-foreground border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">連続学習</div>
                  <div className="text-2xl font-bold">
                    {userStats.currentStreak}日
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">最長記録</div>
                <div className="text-lg font-medium">
                  {userStats.longestStreak}日
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Target}
            label="正解率"
            value={`${userStats.averageScore}%`}
            color="from-emerald-500 to-green-600"
          />
          <StatCard
            icon={Star}
            label="総問題数"
            value={userStats.totalQuestionsAnswered}
            color="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Achievement Progress Summary */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              実績進捗
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">獲得済み</span>
              <span className="font-medium">
                {unlockedAchievements.length} / {achievements.length}
              </span>
            </div>
            <Progress
              value={(unlockedAchievements.length / achievements.length) * 100}
              className="h-3"
            />
          </CardContent>
        </Card>

        {/* 既知単語統計 */}
        {(() => {
          const knownWordsStats = KnownWordsManager.getKnownWordsStats();
          return knownWordsStats.total > 0 ? (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Target className="w-5 h-5 mr-2 text-emerald-600" />
                  既知単語
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {knownWordsStats.total}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      マスター済み
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {knownWordsStats.recentlyMarked.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      今週追加
                    </div>
                  </div>
                </div>

                {/* レベル別統計 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    レベル別
                  </div>
                  {Object.entries(knownWordsStats.byLevel).map(
                    ([level, count]) => (
                      <div
                        key={level}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm capitalize">{level}</span>
                        <Badge variant="outline" className="text-xs">
                          {count}語
                        </Badge>
                      </div>
                    )
                  )}
                </div>

                {/* カテゴリ別統計 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    カテゴリ別
                  </div>
                  {Object.entries(knownWordsStats.byCategory).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm capitalize">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {count}語
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null;
        })()}

        {/* 事前学習の理解度統計 */}
        {userStats.preStudyProgress &&
          userStats.preStudyProgress.totalContentsStudied > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  事前学習の理解度
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.preStudyProgress.totalContentsStudied}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      学習コンテンツ数
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.preStudyProgress.averageComprehension.toFixed(
                        1
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      平均理解度
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      理解度分布
                    </span>
                  </div>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        userStats.preStudySessions?.filter(
                          (session) => session.comprehensionRating === rating
                        ).length || 0;
                      const percentage =
                        userStats.preStudyProgress!.totalContentsStudied > 0
                          ? (count /
                              userStats.preStudyProgress!
                                .totalContentsStudied) *
                            100
                          : 0;

                      return (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <div className="flex items-center space-x-1 w-16">
                            <span className="text-sm text-yellow-500">
                              {"★".repeat(rating)}
                              {"☆".repeat(5 - rating)}
                            </span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 分野別理解度 */}
                {Object.keys(userStats.preStudyProgress.contentsByCategory)
                  .length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      分野別学習数
                    </div>
                    <div className="space-y-1">
                      {Object.entries(
                        userStats.preStudyProgress.contentsByCategory
                      ).map(([category, count]) => (
                        <div
                          key={category}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm capitalize">{category}</span>
                          <span className="text-sm font-medium">{count}個</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 個別コンテンツの理解度一覧 */}
                {userStats.preStudySessions &&
                  userStats.preStudySessions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        学習したコンテンツ一覧
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {userStats.preStudySessions
                          .filter((session) => session.completed)
                          .map((session, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                session.comprehensionRating === 1
                                  ? "bg-red-50 border-red-200"
                                  : session.comprehensionRating === 2
                                  ? "bg-orange-50 border-orange-200"
                                  : session.comprehensionRating === 3
                                  ? "bg-yellow-50 border-yellow-200"
                                  : session.comprehensionRating === 4
                                  ? "bg-blue-50 border-blue-200"
                                  : session.comprehensionRating === 5
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {session.contentId}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(
                                    session.startTime
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {session.comprehensionRating ? (
                                    <>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                          key={star}
                                          className={`text-sm ${
                                            star <= session.comprehensionRating!
                                              ? "text-yellow-500"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          ★
                                        </span>
                                      ))}
                                    </>
                                  ) : (
                                    <span className="text-xs text-gray-500">
                                      評価なし
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {session.comprehensionRating === 1 &&
                                    "要復習"}
                                  {session.comprehensionRating === 2 &&
                                    "要改善"}
                                  {session.comprehensionRating === 3 && "普通"}
                                  {session.comprehensionRating === 4 && "良い"}
                                  {session.comprehensionRating === 5 && "完璧"}
                                  {!session.comprehensionRating && "未評価"}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

        {/* Unlocked Achievements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Star className="w-5 h-5 mr-2 text-emerald-600" />
            獲得済み実績 ({unlockedAchievements.length})
          </h2>
          <div className="space-y-3">
            {unlockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-gray-500" />
              未獲得実績 ({lockedAchievements.length})
            </h2>
            <div className="space-y-3">
              {lockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
