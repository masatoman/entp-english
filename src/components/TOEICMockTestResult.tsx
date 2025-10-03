import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TOEICTestResult } from "../types/mockTest";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface TOEICMockTestResultProps {
  result: TOEICTestResult;
  onRetake?: () => void;
  onExit?: () => void;
}

export const TOEICMockTestResult: React.FC<TOEICMockTestResultProps> = ({
  result,
  onRetake,
  onExit,
}) => {
  const navigate = useNavigate();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 800) return "text-green-600";
    if (score >= 600) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (
    score: number
  ): "default" | "secondary" | "destructive" => {
    if (score >= 800) return "default";
    if (score >= 600) return "secondary";
    return "destructive";
  };

  const getPartIcon = (part: number) => {
    switch (part) {
      case 1:
        return "📷";
      case 2:
        return "💬";
      case 3:
        return "👥";
      case 4:
        return "📢";
      case 5:
        return "✏️";
      case 6:
        return "📝";
      case 7:
        return "📖";
      default:
        return "❓";
    }
  };

  const getPartName = (part: number): string => {
    switch (part) {
      case 1:
        return "写真描写問題";
      case 2:
        return "応答問題";
      case 3:
        return "会話問題";
      case 4:
        return "説明文問題";
      case 5:
        return "短文穴埋め問題";
      case 6:
        return "長文穴埋め問題";
      case 7:
        return "読解問題";
      default:
        return "不明";
    }
  };

  const getImprovementTrend = (score: number) => {
    if (score >= 800)
      return { icon: TrendingUp, color: "text-green-600", text: "優秀" };
    if (score >= 600)
      return { icon: TrendingUp, color: "text-yellow-600", text: "良好" };
    if (score >= 400)
      return { icon: Minus, color: "text-orange-600", text: "普通" };
    return { icon: TrendingDown, color: "text-red-600", text: "要改善" };
  };

  const trend = getImprovementTrend(result.score.total);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* ヘッダー */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit || (() => navigate(-1))}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">TOEIC模擬テスト結果</h1>
            <p className="text-gray-600">
              テスト完了: {result.completedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 総合スコア */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>総合スコア</span>
                </span>
                <Badge
                  variant={getScoreBadge(result.score.total)}
                  className="text-lg px-3 py-1"
                >
                  {result.score.total}点
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      result.score.listening
                    )}`}
                  >
                    {result.score.listening}
                  </div>
                  <div className="text-sm text-gray-600">リスニング</div>
                  <div className="text-xs text-gray-500">
                    パーセンタイル: {result.score.percentile}%
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      result.score.reading
                    )}`}
                  >
                    {result.score.reading}
                  </div>
                  <div className="text-sm text-gray-600">リーディング</div>
                  <div className="text-xs text-gray-500">
                    パーセンタイル: {result.score.percentile}%
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      result.score.total
                    )}`}
                  >
                    {result.score.total}
                  </div>
                  <div className="text-sm text-gray-600">トータル</div>
                  <div className="text-xs text-gray-500">
                    パーセンタイル: {result.score.percentile}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">正解数</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.correctAnswers}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">不正解</p>
                    <p className="text-2xl font-bold text-red-600">
                      {result.incorrectAnswers}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">未回答</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {result.unanswered}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 時間情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>テスト時間</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg">所要時間</span>
                <span className="text-xl font-bold">
                  {formatTime(result.timeSpent)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* パート別詳細結果 */}
          <Card>
            <CardHeader>
              <CardTitle>パート別詳細結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.detailedResults.map((detail) => (
                  <div key={detail.part} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getPartIcon(detail.part)}
                        </span>
                        <div>
                          <div className="font-medium">Part {detail.part}</div>
                          <div className="text-sm text-gray-600">
                            {getPartName(detail.part)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {detail.correct}/{detail.total}
                        </div>
                        <div className="text-sm text-gray-600">
                          {detail.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={detail.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 改善提案 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <trend.icon className={`w-5 h-5 ${trend.color}`} />
                <span>改善提案</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onRetake} className="px-6">
              再挑戦
            </Button>
            <Button onClick={onExit || (() => navigate(-1))} className="px-6">
              完了
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOEICMockTestResult;
