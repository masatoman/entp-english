import { categoryLabels } from "../constants";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category, UserAnswer } from "../types";
import { calculateTotalSessionXP } from "../utils/xpCalculator";
import { QuestionData } from "./Question";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

// Router対応のため、props interfaceを削除


const difficultyLabels = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

export default function Results() {
  const navigate = useNavigate();
  const { category: urlCategory, difficulty: urlDifficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  useScrollToTop();

  // URL パラメータの型変換
  const category = urlCategory as Category;
  const difficulty = urlDifficulty as "easy" | "normal" | "hard";

  // 仮のデータ（実際の実装では適切なデータソースから取得）
  const questions: QuestionData[] = [];
  const userAnswers: UserAnswer[] = [];
  const sessionDuration = 0;
  const score = userAnswers.filter((answer) => answer.isCorrect).length;
  const percentage = Math.round((score / questions.length) * 100);
  const xpEarned = calculateTotalSessionXP(
    userAnswers,
    difficulty,
    category,
    sessionDuration
  );

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "素晴らしい！";
    if (percentage >= 60) return "よくできました！";
    return "もう少し頑張りましょう！";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">結果</h1>
          <div className="w-10" />
        </div>
        {/* Score */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>結果発表</CardTitle>
            <div className="space-y-2">
              <div className={`text-4xl ${getScoreColor()}`}>
                {score} / {questions.length}
              </div>
              <div className={`text-xl ${getScoreColor()}`}>{percentage}%</div>
              <p className="text-muted-foreground">{getScoreMessage()}</p>
              <div className="flex justify-center space-x-2">
                <Badge variant="outline">{categoryLabels[category]}</Badge>
                <Badge variant="outline">{difficultyLabels[difficulty]}</Badge>
              </div>
              {xpEarned > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-3 p-2 bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-700 font-medium">
                    +{xpEarned} XP 獲得！
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>解答と解説</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(
                (a) => a.questionId === question.id
              );
              const isCorrect = userAnswer?.isCorrect || false;

              return (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">
                      問題 {index + 1}
                    </span>
                    <Badge variant={isCorrect ? "default" : "destructive"}>
                      {isCorrect ? "正解" : "不正解"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {question.japanese}
                    </p>

                    {userAnswer && (
                      <div className="p-2 bg-muted rounded text-sm">
                        <span className="font-medium">あなたの回答：</span>
                        <br />
                        {userAnswer.answer}
                      </div>
                    )}

                    <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                      <span className="font-medium text-green-800">正解：</span>
                      <br />
                      <span className="text-green-700">
                        {question.correctAnswer}
                      </span>
                    </div>

                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <span className="font-medium text-blue-800">解説：</span>
                      <br />
                      <span className="text-blue-700">
                        {question.explanation}
                      </span>
                    </div>
                  </div>

                  {index < questions.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={() =>
              navigate(`/learning/grammar/question/${category}/${difficulty}`)
            }
            className="w-full"
            size="lg"
          >
            同じ設定でもう一度
          </Button>
          <Button
            onClick={() => navigate(`/learning/grammar/difficulty/${category}`)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            難易度を変更
          </Button>
          <Button
            onClick={() => navigate("/learning/grammar/category")}
            variant="outline"
            className="w-full"
            size="lg"
          >
            カテゴリーを変更
          </Button>
        </div>
      </div>
    </div>
  );
}
