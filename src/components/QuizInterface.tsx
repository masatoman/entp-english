import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseColors } from "../styles/colors";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";

export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  choices?: string[];
}

export interface QuizInterfaceProps {
  title: string;
  subtitle?: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
  showGameHeader?: boolean;
  showAdrenalineEffects?: boolean;
  showTreasureBoxModal?: boolean;
  onTreasureBoxModalClose?: () => void;
  children?: React.ReactNode; // カスタムコンテンツ用
}

export default function QuizInterface({
  title,
  subtitle,
  questions,
  onComplete,
  onBack,
  showGameHeader = false,
  showAdrenalineEffects = false,
  showTreasureBoxModal = false,
  onTreasureBoxModalClose,
  children,
}: QuizInterfaceProps) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setCurrentAnswer(answer);
    setShowExplanation(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedAnswer("");
    setUserInput("");
    setCurrentAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      onComplete(score, totalQuestions);
    }
  };

  const handleSubmit = () => {
    const answer = currentQuestion.choices ? selectedAnswer : userInput;
    if (answer.trim()) {
      handleAnswer(answer);
    }
  };

  const canSubmit = currentQuestion.choices ? selectedAnswer : userInput.trim();

  if (isComplete) {
    return (
      <div
        className="min-h-screen p-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 結果サマリー */}
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
                <Button onClick={onBack} className="w-full">
                  戻る
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

          {/* カスタムコンテンツ */}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      {/* ゲームヘッダー */}
      {showGameHeader && children}

      {/* アドレナリンエフェクト */}
      {showAdrenalineEffects && children}

      {/* 宝箱結果モーダル */}
      {showTreasureBoxModal && children}

      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && (
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {subtitle}
                </Badge>
              </div>
            )}
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
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.choices ? (
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, index) => (
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

            {/* 解説表示 */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  {isCorrect ? (
                    <div className="flex items-center text-green-600">
                      <span className="text-2xl mr-2">✓</span>
                      <span className="text-lg font-semibold">正解！</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <span className="text-2xl mr-2">✗</span>
                      <span className="text-lg font-semibold">不正解</span>
                    </div>
                  )}
                </div>

                {!isCorrect && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="text-sm font-medium text-green-800 mb-1">
                      正解:
                    </div>
                    <div className="text-green-700">
                      {currentQuestion.correctAnswer}
                    </div>
                  </div>
                )}

                <div className="mb-4 p-3 bg-white border rounded">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    解説:
                  </div>
                  <div className="text-blue-700 text-sm">
                    {currentQuestion.explanation}
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full">
                  {currentQuestionIndex < questions.length - 1
                    ? "次の問題"
                    : "完了"}
                </Button>
              </div>
            )}

            {!showExplanation && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full"
                >
                  回答する
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
