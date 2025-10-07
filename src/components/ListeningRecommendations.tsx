// リスニング結果に基づく語彙推奨コンポーネント
import { BookOpen, Star, Target, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listeningGachaIntegration,
  ListeningRecommendation,
} from "../utils/listeningGachaIntegration";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface ListeningRecommendationsProps {
  userId: string;
  sessionScore: number;
  sessionPart: string;
  onStartVocabularyLearning?: () => void;
}

export const ListeningRecommendations: React.FC<
  ListeningRecommendationsProps
> = ({ userId, sessionScore, sessionPart, onStartVocabularyLearning }) => {
  const [recommendations, setRecommendations] = useState<
    ListeningRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecommendations();
  }, [userId, sessionScore]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const recs = await listeningGachaIntegration.getRecommendedWordsForGacha(
        userId
      );
      setRecommendations(recs);
      console.log(`🎯 推奨語彙読み込み完了: ${recs.length}個`);
    } catch (error) {
      console.error("推奨語彙読み込みエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordSelect = (wordEnglish: string) => {
    setSelectedWords((prev) =>
      prev.includes(wordEnglish)
        ? prev.filter((w) => w !== wordEnglish)
        : [...prev, wordEnglish]
    );
  };

  const handleStartVocabularyLearning = () => {
    if (selectedWords.length > 0) {
      // 選択された語彙で語彙学習を開始
      const selectedRecommendations = recommendations.filter((rec) =>
        selectedWords.includes(rec.word.english)
      );

      // 語彙学習ページに遷移（選択された語彙をパラメータとして渡す）
      const wordIds = selectedRecommendations
        .map((rec) => rec.word.id)
        .join(",");
      navigate(
        `/vocabulary?recommended=${wordIds}&source=listening&part=${sessionPart}`
      );
    } else {
      // 推奨語彙で語彙学習を開始
      const wordIds = recommendations
        .slice(0, 10)
        .map((rec) => rec.word.id)
        .join(",");
      navigate(
        `/vocabulary?recommended=${wordIds}&source=listening&part=${sessionPart}`
      );
    }

    if (onStartVocabularyLearning) {
      onStartVocabularyLearning();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Target className="w-4 h-4" />;
      case "medium":
        return <TrendingUp className="w-4 h-4" />;
      case "low":
        return <Star className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            推奨語彙を分析中...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            推奨語彙
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              リスニングデータが不足しています。
              <br />
              もう少しリスニング学習を続けてから推奨語彙を確認してください。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          リスニングスコアに基づく推奨語彙
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          あなたのリスニングパフォーマンスを分析して、効果的な語彙を推奨しています。
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* セッション結果サマリー */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">
                今回のセッション結果
              </h4>
              <p className="text-sm text-blue-700">
                Part {sessionPart.replace("part", "")} - スコア: {sessionScore}%
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {sessionScore}%
              </div>
              <Progress value={sessionScore} className="w-20 h-2 mt-1" />
            </div>
          </div>
        </div>

        {/* 推奨語彙一覧 */}
        <div className="space-y-4">
          <h4 className="font-semibold">
            推奨語彙 ({recommendations.length}個)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {recommendations.map((rec, _index) => (
              <div
                key={rec.word.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedWords.includes(rec.word.english)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleWordSelect(rec.word.english)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      {rec.word.english}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rec.word.japanese}
                    </div>
                  </div>
                  <Badge
                    className={`${getPriorityColor(
                      rec.priority
                    )} flex items-center gap-1`}
                  >
                    {getPriorityIcon(rec.priority)}
                    {rec.priority}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500 mb-2">{rec.reason}</div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.word.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Level {rec.word.level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleStartVocabularyLearning}
            className="flex-1"
            disabled={recommendations.length === 0}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {selectedWords.length > 0
              ? `選択した語彙で学習開始 (${selectedWords.length}個)`
              : "推奨語彙で学習開始"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/listening")}>
            リスニングに戻る
          </Button>
        </div>

        {/* 選択された語彙の確認 */}
        {selectedWords.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>{selectedWords.length}個</strong>
              の語彙が選択されています。
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedWords.map((word) => (
                <Badge key={word} variant="secondary" className="text-xs">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
