import {
  Award,
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../data/achievements";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export default function GrowthDashboard() {
  const navigate = useNavigate();
  useScrollToTop();

  // 仮のユーザー統計データ（実際の実装では適切なデータソースから取得）
  const userStats: UserStats = {
    totalXP: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    studyTimeMinutes: 0,
    achievements: [],
    preStudySessions: [],
  };
  // 成長指標の計算
  const calculateGrowthMetrics = () => {
    const sessions = userStats.preStudySessions || [];
    const completedSessions = sessions.filter(
      (s) => s.completed && s.comprehensionRating
    );

    if (completedSessions.length === 0) {
      return {
        averageComprehension: 0,
        comprehensionImprovement: 0,
        totalStudyDays: 0,
        recentImprovement: 0,
        categoryProgress: {},
        streakGrowth: 0,
        learningConsistency: 0,
        actualLearningTime: 0,
        confidenceScore: 0,
      };
    }

    // 理解度の向上を計算（最近の10セッション vs 最初の10セッション）
    const recentSessions = completedSessions.slice(-10);
    const earlySessions = completedSessions.slice(0, 10);

    const recentAvg =
      recentSessions.reduce((sum, s) => sum + (s.comprehensionRating || 0), 0) /
      recentSessions.length;
    const earlyAvg =
      earlySessions.length > 0
        ? earlySessions.reduce(
            (sum, s) => sum + (s.comprehensionRating || 0),
            0
          ) / earlySessions.length
        : recentAvg;

    const comprehensionImprovement = recentAvg - earlyAvg;

    // 学習日数の計算
    const studyDates = new Set(
      completedSessions.map((s) => new Date(s.startTime).toDateString())
    );
    const totalStudyDays = studyDates.size;

    // 分野別進捗
    const categoryProgress: Record<
      string,
      { count: number; avgRating: number }
    > = {};
    completedSessions.forEach((session) => {
      const category = session.contentId.split("_")[1] || "unknown";
      if (!categoryProgress[category]) {
        categoryProgress[category] = { count: 0, avgRating: 0 };
      }
      categoryProgress[category].count++;
      categoryProgress[category].avgRating += session.comprehensionRating || 0;
    });

    // 平均評価を計算
    Object.keys(categoryProgress).forEach((category) => {
      categoryProgress[category].avgRating /= categoryProgress[category].count;
    });

    // 学習の一貫性を計算（連続学習日数）
    const learningConsistency = userStats.currentStreak;

    // 実際の学習時間を計算（セッション時間の合計）
    const actualLearningTime = completedSessions.reduce((total, session) => {
      const sessionTime = session.endTime
        ? (session.endTime - session.startTime) / 1000 / 60
        : 3; // デフォルト3分
      return total + sessionTime;
    }, 0);

    // 信頼度スコアを計算（学習時間と評価の一貫性）
    const avgSessionTime = actualLearningTime / completedSessions.length;
    const timeBasedConfidence = Math.min(avgSessionTime / 3, 1); // 3分を基準とした信頼度
    const ratingConsistency =
      1 -
      (Math.max(...completedSessions.map((s) => s.comprehensionRating || 0)) -
        Math.min(...completedSessions.map((s) => s.comprehensionRating || 0))) /
        4;
    const confidenceScore = (timeBasedConfidence + ratingConsistency) / 2;

    return {
      averageComprehension: recentAvg,
      comprehensionImprovement,
      totalStudyDays,
      recentImprovement: recentAvg,
      categoryProgress,
      streakGrowth: userStats.currentStreak,
      learningConsistency,
      actualLearningTime,
      confidenceScore,
    };
  };

  const metrics = calculateGrowthMetrics();

  // 成長レベルを計算
  const getGrowthLevel = (improvement: number) => {
    if (improvement >= 1.5)
      return {
        level: "S",
        color: "from-purple-500 to-pink-500",
        text: "ネイティブレベル！",
      };
    if (improvement >= 1.0)
      return {
        level: "A",
        color: "from-green-500 to-emerald-500",
        text: "ビジネス英語OK！",
      };
    if (improvement >= 0.5)
      return {
        level: "B",
        color: "from-blue-500 to-cyan-500",
        text: "日常会話できます！",
      };
    if (improvement >= 0)
      return {
        level: "C",
        color: "from-yellow-500 to-orange-500",
        text: "基礎は完璧！",
      };
    return {
      level: "D",
      color: "from-gray-500 to-slate-500",
      text: "基礎固め中",
    };
  };

  const growthLevel = getGrowthLevel(metrics.comprehensionImprovement);

  // 理解度に基づく実用的な表現を生成
  const getComprehensionDescription = (avgComprehension: number) => {
    if (avgComprehension >= 4.5)
      return "英検1級レベル！ネイティブと対等に話せます";
    if (avgComprehension >= 4.0)
      return "英検準1級レベル！ビジネス英語で活躍できます";
    if (avgComprehension >= 3.5) return "英検2級レベル！日常会話は完璧です";
    if (avgComprehension >= 3.0) return "英検3級レベル！基本的な会話ができます";
    if (avgComprehension >= 2.5) return "英検4級レベル！簡単な会話ができます";
    if (avgComprehension >= 2.0)
      return "英検5級レベル！挨拶と自己紹介ができます";
    return "基礎学習中！一緒に頑張りましょう";
  };

  const comprehensionDescription = getComprehensionDescription(
    metrics.averageComprehension
  );

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)` }}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← 戻る
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            成長ダッシュボード
          </h1>
          <div className="w-10" />
        </div>

        {/* 成長レベル表示 */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${growthLevel.color} mb-4`}
              >
                <span className="text-2xl font-bold text-white">
                  {growthLevel.level}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2">{growthLevel.text}</h2>
              <p className="text-gray-600">
                理解度向上: {metrics.comprehensionImprovement > 0 ? "+" : ""}
                {metrics.comprehensionImprovement.toFixed(1)}ポイント
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 主要指標 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {metrics.averageComprehension.toFixed(1)}
              </div>
              <div className="text-sm opacity-90">現在の理解度</div>
              <div className="text-xs opacity-75 mt-1">
                {comprehensionDescription}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{metrics.totalStudyDays}</div>
              <div className="text-sm opacity-90">学習日数</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {userStats.currentStreak}
              </div>
              <div className="text-sm opacity-90">連続学習日</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.totalXP}</div>
              <div className="text-sm opacity-90">総獲得XP</div>
            </CardContent>
          </Card>
        </div>

        {/* 理解度の向上グラフ */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              理解度の向上
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">理解度向上率</span>
                <span className="text-lg font-bold text-green-600">
                  {metrics.comprehensionImprovement > 0 ? "+" : ""}
                  {metrics.comprehensionImprovement.toFixed(1)}ポイント
                </span>
              </div>
              <Progress
                value={Math.min(
                  Math.max((metrics.comprehensionImprovement + 2) * 25, 0),
                  100
                )}
                className="h-3"
              />
              <div className="text-sm text-gray-500">
                {metrics.comprehensionImprovement > 0
                  ? `🎉 素晴らしい！${metrics.comprehensionImprovement.toFixed(
                      1
                    )}ポイント向上！${comprehensionDescription}`
                  : metrics.comprehensionImprovement === 0
                  ? `✨ ${comprehensionDescription}`
                  : `💪 ${comprehensionDescription}`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 学習の信頼度分析 */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              学習の信頼度分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.confidenceScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">信頼度スコア</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {metrics.confidenceScore >= 0.8
                      ? "高信頼度"
                      : metrics.confidenceScore >= 0.6
                      ? "中信頼度"
                      : "要改善"}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.actualLearningTime.toFixed(0)}分
                  </div>
                  <div className="text-sm text-gray-600">総学習時間</div>
                  <div className="text-xs text-gray-500 mt-1">
                    実際に学習した時間
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {metrics.learningConsistency}日
                  </div>
                  <div className="text-sm text-gray-600">連続学習</div>
                  <div className="text-xs text-gray-500 mt-1">学習の一貫性</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  💡 信頼度の説明
                </h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div>
                    • <strong>学習時間</strong>:
                    実際に学習した時間が長いほど信頼度が上がります
                  </div>
                  <div>
                    • <strong>評価の一貫性</strong>:
                    理解度評価が安定しているほど信頼度が上がります
                  </div>
                  <div>
                    • <strong>継続性</strong>:
                    連続学習日数が多いほど信頼度が上がります
                  </div>
                </div>
              </div>

              {metrics.confidenceScore < 0.6 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">
                    ⚠️ 理解度評価の改善提案
                  </h4>
                  <div className="text-sm text-red-700 space-y-1">
                    <div>
                      • 理解度評価は<strong>正直に</strong>行いましょう
                    </div>
                    <div>
                      • 分からない場合は<strong>星1-2</strong>を選んでください
                    </div>
                    <div>
                      • 低い評価でも<strong>復習の機会</strong>
                      として活用できます
                    </div>
                    <div>
                      • 正確な評価が<strong>真の成長</strong>につながります
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 分野別スキル向上 */}
        {Object.keys(metrics.categoryProgress).length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                分野別スキル向上
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.categoryProgress).map(
                  ([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {data.count}回学習
                          </span>
                          <Badge variant="secondary">
                            平均 {data.avgRating.toFixed(1)}★
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={(data.avgRating / 5) * 100}
                        className="h-2"
                      />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 学習の軌跡 */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              学習の軌跡
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">初回学習</div>
                    <div className="text-sm text-gray-600">
                      {userStats.preStudySessions?.[0]
                        ? new Date(
                            userStats.preStudySessions[0].startTime
                          ).toLocaleDateString()
                        : "まだ学習していません"}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">スタート</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {metrics.totalStudyDays}
                  </div>
                  <div>
                    <div className="font-medium">現在の学習日数</div>
                    <div className="text-sm text-gray-600">
                      継続的な学習を続けています
                    </div>
                  </div>
                </div>
                <Badge variant="default">継続中</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ★
                  </div>
                  <div>
                    <div className="font-medium">理解度向上</div>
                    <div className="text-sm text-gray-600">
                      {metrics.comprehensionImprovement > 0
                        ? `${metrics.comprehensionImprovement.toFixed(
                            1
                          )}ポイント向上`
                        : "安定した理解度を維持"}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {metrics.comprehensionImprovement > 0 ? "成長中" : "安定"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 次の目標 */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              次の目標
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">英検1級レベル達成</span>
                <Progress
                  value={(metrics.averageComprehension / 5) * 100}
                  className="w-32 h-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">連続学習30日</span>
                <Progress
                  value={(userStats.currentStreak / 30) * 100}
                  className="w-32 h-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">総学習日100日</span>
                <Progress
                  value={(metrics.totalStudyDays / 100) * 100}
                  className="w-32 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
