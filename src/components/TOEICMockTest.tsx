import { ArrowLeft, Clock, Pause, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allTOEICQuestions } from "../data/toeicMockTestQuestions";
import {
  TOEICQuestion,
  TOEICTestConfig,
  TOEICTestResult,
  TOEICTestSession,
} from "../types/mockTest";
import { PreStudyTOEICIntegrationManager } from "../utils/preStudyTOEICIntegration";
import { toeicMockTestManager } from "../utils/toeicMockTestManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface TOEICMockTestProps {
  testConfig: TOEICTestConfig;
  onComplete?: (result: TOEICTestResult) => void;
  onExit?: () => void;
}

export const TOEICMockTest: React.FC<TOEICMockTestProps> = ({
  testConfig,
  onComplete,
  onExit,
}) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<TOEICTestSession | null>(null);
  const [questions, setQuestions] = useState<TOEICQuestion[]>([]);
  const [preStudyBoosts, setPreStudyBoosts] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // テストセッションを開始
    const newSession = toeicMockTestManager.startTest(testConfig);
    setSession(newSession);

    // 事前学習ブーストを取得
    const progress =
      PreStudyTOEICIntegrationManager.getPreStudyProgressForTOEIC();
    setPreStudyBoosts(progress.availableBoosts);

    // 問題を生成
    const testQuestions = generateTestQuestions(testConfig);
    setQuestions(testQuestions);

    // タイマーを設定
    setTimeRemaining(testConfig.timeLimit * 60); // 分を秒に変換

    return () => {
      // コンポーネントアンマウント時にセッションを保存
      if (session) {
        toeicMockTestManager.clearSession();
      }
    };
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isPaused]);

  const generateTestQuestions = (config: TOEICTestConfig): TOEICQuestion[] => {
    const filteredQuestions = allTOEICQuestions.filter((question) => {
      // テストタイプに応じてフィルタリング
      if (config.testType === "listening" && question.part > 4) return false;
      if (config.testType === "reading" && question.part <= 4) return false;

      // パートでフィルタリング
      if (config.parts.length > 0 && !config.parts.includes(question.part))
        return false;

      // 難易度でフィルタリング
      if (
        config.difficulty !== "mixed" &&
        question.difficulty !== config.difficulty
      )
        return false;

      return true;
    });

    return filteredQuestions.slice(
      0,
      config.questionCount.listening + config.questionCount.reading
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (session && currentQuestion) {
      toeicMockTestManager.recordAnswer(currentQuestion.id, answerIndex);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const handleComplete = () => {
    if (session) {
      const result = toeicMockTestManager.completeTest();
      onComplete?.(result);
    }
  };

  const handleTimeUp = () => {
    if (session) {
      const result = toeicMockTestManager.completeTest();
      onComplete?.(result);
    }
  };

  const handleExit = () => {
    if (session && !session.completed) {
      setShowConfirmExit(true);
    } else {
      onExit?.();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!session || !currentQuestion) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>テストを準備中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>終了</span>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">TOEIC模擬テスト</h1>
                <p className="text-sm text-gray-600">
                  {testConfig.testType === "listening" && "リスニング"}
                  {testConfig.testType === "reading" && "リーディング"}
                  {testConfig.testType === "full" && "フルテスト"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* タイマー */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span
                  className={`font-mono text-lg ${
                    timeRemaining < 300 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* 一時停止ボタン */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center space-x-2"
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
                <span>{isPaused ? "再開" : "一時停止"}</span>
              </Button>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>
                問題 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span>{Math.round(progress)}% 完了</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">Part {currentQuestion.part}</Badge>
                  <Badge variant="secondary">{currentQuestion.section}</Badge>
                  <Badge
                    variant={
                      currentQuestion.difficulty === "easy"
                        ? "default"
                        : currentQuestion.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {currentQuestion.difficulty === "easy"
                      ? "易"
                      : currentQuestion.difficulty === "medium"
                      ? "中"
                      : "難"}
                  </Badge>
                  {preStudyBoosts && preStudyBoosts.synergyMultiplier > 1.0 && (
                    <Badge variant="default" className="bg-green-500">
                      ✨ {preStudyBoosts.synergyMultiplier.toFixed(1)}x Boost
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  問題 {currentQuestion.questionNumber}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 問題文 */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-4">
                  {currentQuestion.question}
                </h3>

                {/* 音声再生ボタン（リスニング問題の場合） */}
                {currentQuestion.audioUrl && (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // 音声再生の実装
                        console.log("Playing audio:", currentQuestion.audioUrl);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>音声を再生</span>
                    </Button>
                  </div>
                )}

                {/* 画像表示（Part 1の場合） */}
                {currentQuestion.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="TOEIC Part 1 Question"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}

                {/* 長文（Part 6, 7の場合） */}
                {currentQuestion.readingPassage && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {currentQuestion.readingPassage}
                    </pre>
                  </div>
                )}
              </div>

              {/* 選択肢 */}
              <div className="space-y-3">
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* ナビゲーションボタン */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  前の問題
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    次の問題
                  </Button>

                  {currentQuestionIndex === questions.length - 1 && (
                    <Button
                      onClick={handleComplete}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      テスト完了
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 確認ダイアログ */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>テストを終了しますか？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                現在の進捗は保存されますが、テストは完了扱いになります。
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmExit(false)}
                >
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleComplete();
                    setShowConfirmExit(false);
                  }}
                >
                  終了
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TOEICMockTest;
