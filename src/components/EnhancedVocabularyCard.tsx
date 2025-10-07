import {
  ArrowLeft,
  CheckCircle,
  Heart,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getVocabularyByDifficulty } from "../data/vocabulary";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";
// import { DataManager } from "../utils/dataManager"; // 未使用
import { QuestionWithRank, SkillField } from "../types";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { calculateNewXP } from "../utils/newXpCalculator";
import {
  convertQuestionToEnhanced,
  filterQuestionsByLevel,
  selectWeightedQuestion,
} from "../utils/questionAdapter";
import { SoundManager } from "../utils/soundManager";
import { QuestionRankDisplay } from "./QuestionRankDisplay";

interface EnhancedVocabularyCardProps {
  onBack: () => void;
  difficulty?: "beginner" | "intermediate" | "advanced";
  category?: string;
}

interface VocabularyQuestion extends QuestionWithRank {
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export function EnhancedVocabularyCard({
  onBack,
  difficulty = "beginner",
  category,
}: EnhancedVocabularyCardProps) {
  const [questions, setQuestions] = useState<VocabularyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  // const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [levelManager] = useState(() => getLevelManager());
  const [heartSystem, setHeartSystem] = useState(levelManager.getHeartSystem());
  const [userLevel, setUserLevel] = useState(levelManager.getLevel());
  const [statusAllocation] = useState(levelManager.getStatusAllocation());

  useEffect(() => {
    // ハートを消費して学習を開始
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      onBack();
      return;
    }

    // 問題を生成（カテゴリを考慮）
    generateQuestions(category);
    // setSessionStartTime(Date.now());
    setHeartSystem(levelManager.getHeartSystem());
    saveLevelManager();
  }, []);

  const generateQuestions = (selectedCategory?: string) => {
    const vocabularyItems = selectedCategory
      ? getVocabularyByDifficulty(difficulty).filter(
          (item) => item.category === selectedCategory
        )
      : getVocabularyByDifficulty(difficulty);
    const enhancedQuestions: VocabularyQuestion[] = vocabularyItems.map(
      (item, index) => {
        const baseQuestion = convertQuestionToEnhanced(
          {
            id: index + 1,
            japanese: item.meaning,
            correctAnswer: item.word,
            explanation: `${item.word}: ${item.meaning}`,
            choices: [
              item.word,
              item.word + "s",
              item.word + "ed",
              item.word + "ing",
            ],
          },
          "basic-grammar",
          "normal",
          userLevel.level
        );

        return {
          ...baseQuestion,
          word: item.word,
          meaning: item.meaning,
          example: item.example,
          exampleTranslation: item.exampleTranslation,
          skillField: "vocabulary" as SkillField,
        };
      }
    );

    // レベルに応じてフィルタリング
    const filteredQuestions = filterQuestionsByLevel(
      enhancedQuestions,
      userLevel.level,
      "vocabulary"
    );

    // ステータス配分に基づいて問題を選択
    const selectedQuestions: VocabularyQuestion[] = [];
    const questionCount = 10;

    for (let i = 0; i < questionCount; i++) {
      const availableQuestions = filteredQuestions.filter(
        (q) => !selectedQuestions.some((sq) => sq.id === q.id)
      );

      if (availableQuestions.length > 0) {
        const selectedQuestion = selectWeightedQuestion(
          availableQuestions,
          statusAllocation
        );
        if (selectedQuestion) {
          selectedQuestions.push(selectedQuestion as VocabularyQuestion);
        }
      }
    }

    setQuestions(selectedQuestions);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === question.word) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // XP計算とレベルアップ処理
    // const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    const xpGained = calculateNewXP(
      questions.map((q, index) => ({
        questionId: q.id,
        answer: userAnswers[index] || "",
        isCorrect: userAnswers[index] === q.word,
      })),
      'normal'
    );

    const levelUpResult = levelManager.addXP(xpGained);
    setUserLevel(levelManager.getLevel());
    saveLevelManager();

    // 音声フィードバック
    if (levelUpResult.leveledUp) {
      SoundManager.sounds.levelUp();
    } else {
      SoundManager.sounds.complete();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    generateQuestions();
    // setSessionStartTime(Date.now());
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  語彙学習結果
                </h1>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">
                    {heartSystem.current}/{heartSystem.max}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-green-600">
                  {score} / {questions.length}
                </div>
                <div className="text-lg text-gray-600">
                  正解率: {Math.round((score / questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">
                  獲得XP: {questions.reduce((sum, q) => sum + q.xpReward, 0)}
                </div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleRestart} className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    もう一度挑戦
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ホームに戻る
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-lg text-gray-600">問題を読み込み中...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userAnswer = userAnswers[currentQuestionIndex];
  const isCorrect = userAnswer === currentQuestion.word;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button onClick={onBack} variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">語彙学習</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">
                    {heartSystem.current}/{heartSystem.max}
                  </span>
                </div>
                <Badge variant="secondary">Level {userLevel.level}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  問題 {currentQuestionIndex + 1}/{questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  スコア: {score} / {questions.length}
                </span>
                <QuestionRankDisplay
                  rank={currentQuestion.rank}
                  showXP={true}
                  question={currentQuestion}
                  size="sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 問題 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentQuestion.meaning}
                </h2>
                <p className="text-sm text-gray-600">
                  この意味の英単語を選択してください
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant={userAnswer === option ? "default" : "outline"}
                    className={`h-16 text-lg ${
                      userAnswer === option
                        ? isCorrect
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                        : ""
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {userAnswer && (
                <div className="text-center space-y-4">
                  <div
                    className={`flex items-center justify-center space-x-2 ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium">
                      {isCorrect ? "正解！" : "不正解"}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">例文</h3>
                    <p className="text-gray-700 mb-2">
                      {currentQuestion.example}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentQuestion.exampleTranslation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <div className="flex justify-center">
          <Button onClick={handleNext} size="lg" disabled={!userAnswer}>
            {currentQuestionIndex < questions.length - 1
              ? "次の問題"
              : "答え合わせ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
