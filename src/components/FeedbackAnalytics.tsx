import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackData, useDataManager } from "@/hooks/useDataManager";
import {
  BarChart3,
  Bug,
  Download,
  Lightbulb,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface AnalyticsData {
  totalFeedback: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  ratingDistribution: Record<number, number>;
  aspectRatings: {
    design: number;
    usability: number;
    performance: number;
    content: number;
    gamification: number;
  };
  userTypeBreakdown: Record<string, number>;
  recentFeedback: FeedbackData[];
  topIssues: Array<{ issue: string; count: number }>;
  topSuggestions: Array<{ suggestion: string; count: number }>;
}

const FeedbackAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<"all" | "week" | "month">(
    "all"
  );
  const { getUserFeedback } = useDataManager();

  useEffect(() => {
    loadAnalyticsData();
  }, [filterPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const feedbackData = await getUserFeedback();

      // フィルタリング
      const filteredData = filterFeedbackByPeriod(feedbackData, filterPeriod);

      // 分析データの計算
      const analytics = calculateAnalytics(filteredData);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error("フィードバック分析データ読み込みエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFeedbackByPeriod = (
    feedback: FeedbackData[],
    period: string
  ): FeedbackData[] => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (period) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return feedback;
    }

    return feedback.filter((f) => new Date(f.timestamp) >= cutoffDate);
  };

  const calculateAnalytics = (feedback: FeedbackData[]): AnalyticsData => {
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        categoryBreakdown: {},
        ratingDistribution: {},
        aspectRatings: {
          design: 0,
          usability: 0,
          performance: 0,
          content: 0,
          gamification: 0,
        },
        userTypeBreakdown: {},
        recentFeedback: [],
        topIssues: [],
        topSuggestions: [],
      };
    }

    // 基本統計
    const totalFeedback = feedback.length;
    const averageRating =
      feedback.reduce((sum, f) => sum + f.overallRating, 0) / totalFeedback;

    // カテゴリー別集計
    const categoryBreakdown = feedback.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 評価分布
    const ratingDistribution = feedback.reduce((acc, f) => {
      acc[f.overallRating] = (acc[f.overallRating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // 詳細評価の平均
    const aspectRatings = {
      design:
        feedback.reduce((sum, f) => sum + f.specificRating.design, 0) /
        totalFeedback,
      usability:
        feedback.reduce((sum, f) => sum + f.specificRating.usability, 0) /
        totalFeedback,
      performance:
        feedback.reduce((sum, f) => sum + f.specificRating.performance, 0) /
        totalFeedback,
      content:
        feedback.reduce((sum, f) => sum + f.specificRating.content, 0) /
        totalFeedback,
      gamification:
        feedback.reduce((sum, f) => sum + f.specificRating.gamification, 0) /
        totalFeedback,
    };

    // ユーザータイプ別集計
    const userTypeBreakdown = feedback.reduce((acc, f) => {
      if (f.userType) {
        acc[f.userType] = (acc[f.userType] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // 最近のフィードバック（最新5件）
    const recentFeedback = feedback
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 5);

    // トップイシュー（バグ報告から抽出）
    const issues = feedback
      .filter((f) => f.bugs.trim())
      .map((f) => f.bugs.trim())
      .reduce((acc, issue) => {
        acc[issue] = (acc[issue] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topIssues = Object.entries(issues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));

    // トップ提案（改善提案から抽出）
    const suggestions = feedback
      .filter((f) => f.suggestions.trim())
      .map((f) => f.suggestions.trim())
      .reduce((acc, suggestion) => {
        acc[suggestion] = (acc[suggestion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topSuggestions = Object.entries(suggestions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([suggestion, count]) => ({ suggestion, count }));

    return {
      totalFeedback,
      averageRating,
      categoryBreakdown,
      ratingDistribution,
      aspectRatings,
      userTypeBreakdown,
      recentFeedback,
      topIssues,
      topSuggestions,
    };
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const exportData = {
      period: filterPeriod,
      timestamp: new Date().toISOString(),
      analytics: analyticsData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-analytics-${filterPeriod}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalFeedback === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              フィードバックデータがありません
            </h3>
            <p className="text-gray-500">
              ユーザーからのフィードバックを収集すると、ここに分析結果が表示されます。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            フィードバック分析
          </h1>
          <p className="text-gray-600 mt-1">
            ユーザーフィードバックの詳細分析とインサイト
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">全期間</option>
            <option value="week">過去1週間</option>
            <option value="month">過去1ヶ月</option>
          </select>
          <Button onClick={exportAnalytics} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総フィードバック数</p>
                <p className="text-2xl font-bold">
                  {analyticsData.totalFeedback}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均評価</p>
                <p className="text-2xl font-bold">
                  {analyticsData.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ユーザータイプ</p>
                <p className="text-2xl font-bold">
                  {Object.keys(analyticsData.userTypeBreakdown).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">改善提案</p>
                <p className="text-2xl font-bold">
                  {analyticsData.topSuggestions.length}
                </p>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細分析 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="ratings">評価分析</TabsTrigger>
          <TabsTrigger value="issues">課題・提案</TabsTrigger>
          <TabsTrigger value="recent">最近のフィードバック</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* カテゴリー別分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">カテゴリー別分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analyticsData.categoryBreakdown).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">{category}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(count / analyticsData.totalFeedback) * 100}
                            className="w-20"
                          />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ユーザータイプ別分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ユーザータイプ別分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analyticsData.userTypeBreakdown).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(count / analyticsData.totalFeedback) * 100}
                            className="w-20"
                          />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 評価分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">評価分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">★ {rating}</span>
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={
                            ((analyticsData.ratingDistribution[rating] || 0) /
                              analyticsData.totalFeedback) *
                            100
                          }
                          className="w-20"
                        />
                        <span className="text-sm font-medium">
                          {analyticsData.ratingDistribution[rating] || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 詳細評価 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">詳細評価</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analyticsData.aspectRatings).map(
                    ([aspect, rating]) => (
                      <div key={aspect} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{aspect}</span>
                          <span className="font-medium">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                        <Progress value={(rating / 5) * 100} />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* トップイシュー */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  トップイシュー
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topIssues.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.topIssues.map(({ issue, count }, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="destructive" className="text-xs">
                            {count}件
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{issue}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    報告されたイシューはありません
                  </p>
                )}
              </CardContent>
            </Card>

            {/* トップ提案 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  トップ提案
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.topSuggestions.map(
                      ({ suggestion, count }, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {count}件
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{suggestion}</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">改善提案はありません</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">最近のフィードバック</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {feedback.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: feedback.overallRating }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.timestamp).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {feedback.feedback}
                    </p>
                    {feedback.userType && (
                      <Badge variant="secondary" className="text-xs">
                        {feedback.userType}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackAnalytics;
