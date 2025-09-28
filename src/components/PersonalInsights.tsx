import {
  ArrowLeft,
  Brain,
  Lightbulb,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseColors } from "../styles/colors";
import { LearningAnalytics, LearningInsight } from "../types";
import { LearningAnalyzer } from "../utils/learningAnalyzer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

/**
 * パーソナル学習インサイト画面
 * ENTPの知的好奇心と自己理解欲求に対応
 */
function PersonalInsights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<LearningInsight | null>(null);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // 分析実行（少し時間をかけて「分析中」感を演出）
    setTimeout(() => {
      const generatedInsights = LearningAnalyzer.generateLearningInsight();
      const analyticsData = LearningAnalyzer.getAnalytics();

      setInsights(generatedInsights);
      setAnalytics(analyticsData);
      setIsAnalyzing(false);
    }, 1500);
  }, []);

  const getLearnerTypeColor = (type: string): string => {
    switch (type) {
      case "効率重視型":
        return "bg-blue-500";
      case "探求型":
        return "bg-purple-500";
      case "競争型":
        return "bg-red-500";
      case "創造型":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLearnerTypeIcon = (type: string) => {
    switch (type) {
      case "効率重視型":
        return <Target className="w-6 h-6" />;
      case "探求型":
        return <Brain className="w-6 h-6" />;
      case "競争型":
        return <TrendingUp className="w-6 h-6" />;
      case "創造型":
        return <Lightbulb className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  if (isAnalyzing) {
    return (
      <div
        className="min-h-screenp-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-md mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">学習分析中...</h1>
            <div className="w-9" />
          </div>

          {/* 分析中表示 */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-lg font-semibold mb-2">
                あなたの学習パターンを分析中
              </h2>
              <p className="text-muted-foreground text-sm">
                学習データから個人の特性を解析しています...
              </p>
              <Progress value={75} className="mt-4 h-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!insights || !analytics) {
    return (
      <div
        className="min-h-screenp-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-md mx-auto text-center pt-20">
          <p>分析データを読み込めませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screenp-4"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">あなたの学習インサイト</h1>
          <div className="w-9" />
        </div>

        <div className="space-y-4">
          {/* 学習者タイプカード */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div
              className={`h-2 ${getLearnerTypeColor(insights.learnerType)}`}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-full ${getLearnerTypeColor(
                    insights.learnerType
                  )} text-black`}
                >
                  {getLearnerTypeIcon(insights.learnerType)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{insights.learnerType}</h2>
                  <p className="text-sm text-muted-foreground">
                    信頼度 {Math.round(insights.confidenceScore * 100)}%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">
                {insights.uniquePattern}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  最終分析:{" "}
                  {new Date(insights.lastAnalyzed).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  ENTP最適化
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 強みカード */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                あなたの強み
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.primaryStrengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 改善エリアカード */}
          {insights.improvementAreas.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  成長ポイント
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* パーソナライズ推奨カード */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-green-500" />
                あなた専用のアドバイス
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.personalizedRecommendations.map(
                  (recommendation, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-green-800">
                          {recommendation}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* 学習統計カード */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-500" />
                学習統計
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.totalStudySessions}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    学習セッション
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analytics.averageAccuracy * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    平均正解率
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">学習トレンド</span>
                  <Badge
                    variant={
                      analytics.improvementTrend === "上昇中"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {analytics.improvementTrend}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">得意分野</div>
                  <div className="flex flex-wrap gap-1">
                    {analytics.strongestCategories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/progress/achievements")}
              className="h-12"
            >
              実績を見る
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="h-12 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              学習を始める
            </Button>
          </div>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

export default PersonalInsights;
