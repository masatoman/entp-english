import { ArrowLeft, Clock, RotateCcw, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestions } from "../data/questions";
import { Category } from "../types";
import { questionStatsManager } from "../utils/questionStatsManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

interface QuestionListItemProps {
  questionId: number;
  japanese: string;
  index: number;
  category: Category;
  difficulty: "easy" | "normal" | "hard";
  onQuestionSelect: (questionId: number) => void;
}

function QuestionListItem({
  questionId,
  japanese,
  index,
  category,
  difficulty,
  onQuestionSelect,
}: QuestionListItemProps) {
  const stats = questionStatsManager.getQuestionStats(questionId);
  const successRate = questionStatsManager.getSuccessRate(questionId);
  const formattedStats = questionStatsManager.getFormattedStats(questionId);

  const getStatusColor = () => {
    if (!stats || stats.attempts === 0) return "bg-gray-100 border-gray-200";
    if (successRate >= 80) return "bg-green-50 border-green-200";
    if (successRate >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusBadge = () => {
    if (!stats || stats.attempts === 0)
      return { text: "未挑戦", variant: "secondary" as const };
    if (successRate >= 80)
      return { text: "習得済み", variant: "default" as const };
    if (successRate >= 60)
      return { text: "要復習", variant: "outline" as const };
    return { text: "要強化", variant: "destructive" as const };
  };

  const statusBadge = getStatusBadge();

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor()}`}
      onClick={() => onQuestionSelect(questionId)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              問題 {index + 1}
            </Badge>
            <Badge variant={statusBadge.variant} className="text-xs">
              {statusBadge.text}
            </Badge>
          </div>
          {stats && stats.attempts > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>{formattedStats}</span>
              <span>({successRate}%)</span>
            </div>
          )}
        </div>

        <p className="text-sm font-medium mb-3 text-foreground">{japanese}</p>

        {stats && stats.attempts > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>正答率</span>
              <span>{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-1" />

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <RotateCcw className="w-3 h-3" />
                <span>挑戦回数: {stats.attempts}</span>
              </div>
              {stats.averageTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>平均: {Math.round(stats.averageTime)}秒</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function QuestionListView() {
  const navigate = useNavigate();
  const { category, difficulty } = useParams<{
    category: Category;
    difficulty: "easy" | "normal" | "hard";
  }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({
    total: 0,
    completed: 0,
    averageSuccess: 0,
  });

  useEffect(() => {
    if (category && difficulty) {
      const questionData = getQuestions(category, difficulty);
      setQuestions(questionData);

      // 全体統計を計算
      const stats = questionStatsManager.getCategoryStats(category, difficulty);
      const totalQuestions = questionData.length;
      const completedQuestions = stats.filter((s) => s.attempts > 0).length;
      const averageSuccess =
        stats.length > 0
          ? Math.round(
              stats.reduce(
                (sum, s) =>
                  sum + questionStatsManager.getSuccessRate(s.questionId),
                0
              ) / stats.length
            )
          : 0;

      setOverallStats({
        total: totalQuestions,
        completed: completedQuestions,
        averageSuccess: completedQuestions > 0 ? averageSuccess : 0,
      });
    }
  }, [category, difficulty]);

  const handleQuestionSelect = (questionId: number) => {
    navigate(
      `/learning/grammar/question/${category}/${difficulty}/${questionId}`
    );
  };

  const handleBack = () => {
    navigate(`/learning/grammar/difficulty/${category}`);
  };

  const handleResetStats = () => {
    if (
      category &&
      difficulty &&
      window.confirm("この難易度の全ての統計をリセットしますか？")
    ) {
      questionStatsManager.resetCategoryStats(category, difficulty);
      window.location.reload();
    }
  };

  const getCategoryTitle = (cat: Category) => {
    const { categoryLabels } = require("../constants");
    return categoryLabels[cat] || cat;
  };

  const getDifficultyTitle = (diff: "easy" | "normal" | "hard") => {
    const titles = {
      easy: "簡単",
      normal: "普通",
      hard: "難しい",
    };
    return titles[diff];
  };

  if (!category || !difficulty) {
    return <div>エラー: カテゴリーまたは難易度が指定されていません</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold">問題一覧</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{getCategoryTitle(category)}</span>
              <span>•</span>
              <span>{getDifficultyTitle(difficulty)}</span>
            </div>
          </div>
          <Button variant="ghost" onClick={handleResetStats} className="p-2">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* 全体統計 */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">学習進捗</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {overallStats.completed}
                </div>
                <div className="text-xs text-muted-foreground">挑戦済み</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {overallStats.total}
                </div>
                <div className="text-xs text-muted-foreground">総問題数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {overallStats.averageSuccess}%
                </div>
                <div className="text-xs text-muted-foreground">平均正答率</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>進捗率</span>
                <span>
                  {Math.round(
                    (overallStats.completed / overallStats.total) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(overallStats.completed / overallStats.total) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* 問題一覧 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>問題を選択</span>
          </h3>

          {questions.map((question, index) => (
            <QuestionListItem
              key={question.id}
              questionId={question.id}
              japanese={question.japanese}
              index={index}
              category={category}
              difficulty={difficulty}
              onQuestionSelect={handleQuestionSelect}
            />
          ))}
        </div>

        {/* 説明 */}
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              💡 <strong>学習のコツ</strong>
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 正答率が低い問題を重点的に復習</li>
              <li>• 全問題で80%以上を目指そう</li>
              <li>• 習得済みの問題も定期的に復習</li>
            </ul>
          </CardContent>
        </Card>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
