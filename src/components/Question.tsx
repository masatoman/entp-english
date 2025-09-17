import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestions } from "../data/questions";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category } from "../types";
import { getLevelManager } from "../utils/levelManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";

export interface QuestionData {
  id: number;
  japanese: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  choices?: string[];
}

const categoryLabels: Record<Category, string> = {
  "basic-grammar": "基本文型",
  tenses: "時制",
  modals: "助動詞",
  passive: "受動態",
  relative: "関係詞",
  subjunctive: "仮定法",
  comparison: "比較",
  participle: "分詞・動名詞",
  infinitive: "不定詞",
};

const difficultyLabels = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

export default function Question() {
  const navigate = useNavigate();
  const { category: urlCategory, difficulty: urlDifficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  useScrollToTop();

  // URL パラメータの型変換とバリデーション
  const category = urlCategory as Category;
  const difficulty = urlDifficulty as "easy" | "normal" | "hard";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  // 問題データを取得
  useEffect(() => {
    if (category && difficulty) {
      try {
        const questionData = getQuestions(category, difficulty);
        setQuestions(questionData);
      } catch (error) {
        console.error("問題データの取得に失敗:", error);
        navigate("/learning/grammar/category");
      }
    }
  }, [category, difficulty, navigate]);

  if (!category || !difficulty || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              問題を読み込んでいます...
            </h2>
            <Button onClick={() => navigate("/learning/grammar/category")}>
              カテゴリー選択に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);

      // XP獲得
      const levelManager = getLevelManager();
      const xpReward = Math.round(score * 10 + totalQuestions * 2);
      levelManager.addXP(xpReward);
    }
  };

  const handleBack = () => {
    navigate(`/learning/grammar/difficulty/${category}`);
  };

  const handleSubmit = () => {
    const answer = difficulty === "easy" ? selectedAnswer : userInput;
    if (answer.trim()) {
      handleAnswer(answer);
      setSelectedAnswer("");
      setUserInput("");
    }
  };

  const canSubmit = difficulty === "easy" ? selectedAnswer : userInput.trim();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">問題完了！</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <p className="text-xl mb-2">
                  正解数: {score} / {totalQuestions}
                </p>
                <p className="text-lg text-gray-600">
                  正解率: {Math.round((score / totalQuestions) * 100)}%
                </p>
                <Badge className="mt-2">
                  +{Math.round(score * 10 + totalQuestions * 2)} XP獲得！
                </Badge>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/learning/grammar/category")}
                  className="w-full"
                >
                  カテゴリー選択に戻る
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  ホームに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">文法クイズ</h1>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[difficulty]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              問題 {questionNumber} / {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-700">
              スコア: {score}
            </span>
          </div>
          <Progress
            value={(questionNumber / totalQuestions) * 100}
            className="h-2"
          />
        </div>

        {/* Question */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {currentQuestion.japanese}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {difficulty === "easy" ? (
              <div className="space-y-3">
                {currentQuestion.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === choice ? "default" : "outline"}
                    className="w-full text-left justify-start p-4 h-auto"
                    onClick={() => setSelectedAnswer(choice)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            ) : (
              <div>
                <Textarea
                  placeholder="英語で回答してください..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] mb-4"
                />
                <div className="text-sm text-gray-600 mb-4">
                  ヒント:{" "}
                  {currentQuestion.hint || "文法に注意して回答してください"}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full"
              >
                回答する
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
