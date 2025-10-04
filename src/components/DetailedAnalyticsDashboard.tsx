import { ArrowLeft, Award, Target, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const DetailedAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // モックデータを生成（実際の実装では DetailedLearningAnalyzer を使用）
      const mockData = {
        totalTime: 7200, // 2時間
        averageAccuracy: 75.5,
        totalSessions: 12,
        totalXP: 2450,
        categoryPerformance: {
          vocabulary: { accuracy: 78.5, sessions: 4 },
          grammar: { accuracy: 72.0, sessions: 3 },
          listening: { accuracy: 76.2, sessions: 3 },
          writing: { accuracy: 71.8, sessions: 2 },
        },
        difficultyPerformance: {
          beginner: { accuracy: 85.0, sessions: 5 },
          intermediate: { accuracy: 72.5, sessions: 4 },
          advanced: { accuracy: 65.0, sessions: 3 },
        },
        timeTrends: [
          { period: "今週", time: 1800 },
          { period: "先週", time: 2100 },
          { period: "3週間前", time: 1500 },
          { period: "4週間前", time: 1800 },
        ],
        accuracyTrends: [
          { period: "今週", accuracy: 76.5 },
          { period: "先週", accuracy: 74.2 },
          { period: "3週間前", accuracy: 72.8 },
          { period: "4週間前", accuracy: 70.5 },
        ],
        recommendations: [
          {
            title: "語彙力の向上",
            description:
              "中級レベルの語彙問題で正答率が向上しています。上級レベルにも挑戦してみましょう。",
            actions: ["上級語彙学習", "TOEIC語彙特訓", "実践的語彙練習"],
          },
          {
            title: "文法の基礎固め",
            description:
              "基本文法は安定していますが、応用問題で改善の余地があります。",
            actions: ["文法基礎復習", "応用問題練習", "TOEIC文法対策"],
          },
          {
            title: "リスニング強化",
            description:
              "リスニングは順調に伸びています。より長い文章に挑戦してみましょう。",
            actions: [
              "長文リスニング",
              "TOEIC Part 3,4対策",
              "実践的リスニング",
            ],
          },
        ],
      };

      setAnalytics(mockData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("学習データの読み込みに失敗しました。");
      setLoading(false);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>学習データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          再試行
        </Button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">詳細学習分析</h1>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">詳細学習分析</h1>
          <p>まだ学習データがありません。</p>
          <p>学習を開始して、ここにあなたの進捗を表示しましょう！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">詳細学習分析</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総学習時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(analytics.totalTime)}
            </div>
            <p className="text-xs text-muted-foreground">過去30日間</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均正答率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">全カテゴリー</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              学習セッション
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">過去30日間</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総獲得XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalXP}</div>
            <p className="text-xs text-muted-foreground">累計</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <Target className="h-4 w-4 mr-2" />
            パフォーマンス
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            トレンド
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Award className="h-4 w-4 mr-2" />
            推奨事項
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリー別パフォーマンス</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.categoryPerformance).map(
                  ([category, data]: [string, any]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">
                          {category}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              data.accuracy >= 80
                                ? "default"
                                : data.accuracy >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {data.accuracy.toFixed(1)}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {data.sessions}セッション
                          </span>
                        </div>
                      </div>
                      <Progress value={data.accuracy} className="h-2" />
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>難易度別パフォーマンス</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.difficultyPerformance).map(
                  ([difficulty, data]: [string, any]) => (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">
                          {difficulty}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              data.accuracy >= 80
                                ? "default"
                                : data.accuracy >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {data.accuracy.toFixed(1)}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {data.sessions}セッション
                          </span>
                        </div>
                      </div>
                      <Progress value={data.accuracy} className="h-2" />
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>学習トレンド</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">学習時間</h3>
              <div className="space-y-2">
                {analytics.timeTrends.map((trend: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted rounded"
                  >
                    <span className="font-medium">{trend.period}</span>
                    <span className="text-sm">{formatTime(trend.time)}</span>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold mt-4 mb-2">正答率</h3>
              <div className="space-y-2">
                {analytics.accuracyTrends.map((trend: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted rounded"
                  >
                    <span className="font-medium">{trend.period}</span>
                    <Badge
                      variant={
                        trend.accuracy >= 80
                          ? "default"
                          : trend.accuracy >= 60
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {trend.accuracy.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>改善推奨事項</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.recommendations.map((rec: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rec.actions.map((action: string, actionIndex: number) => (
                      <Badge key={actionIndex} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAnalyticsDashboard;
