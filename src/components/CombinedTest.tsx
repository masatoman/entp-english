import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CombinedTestQuestion,
  getCombinedTestQuestions,
  shuffleArray,
} from "../data/combinedTest";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { GachaSystem } from "../utils/gachaSystem";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { SoundManager } from "../utils/soundManager";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

// Router対応のため、propsは削除

interface XPAnimationProps {
  show: boolean;
  xp: number;
  onComplete: () => void;
}

function XPAnimation({ show, xp, onComplete }: XPAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-emerald-500 text-foreground px-6 py-4 rounded-full shadow-xl flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span className="text-lg font-semibold">+{xp} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Timer({
  timeLimit,
  onTimeUp,
}: {
  timeLimit: number;
  onTimeUp: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = ((timeLimit - timeLeft) / timeLimit) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock
            className={`w-5 h-5 ${
              timeLeft <= 10 ? "text-red-500" : "text-blue-500"
            }`}
          />
          <span className={`font-mono ${timeLeft <= 10 ? "text-red-500" : ""}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${
          timeLeft <= 10 ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"
        }`}
      />
    </div>
  );
}

export default function CombinedTest() {
  const navigate = useNavigate();
  useScrollToTop();
  const [questions, setQuestions] = useState<CombinedTestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [currentXP, setCurrentXP] = useState(0);

  // 相乗効果データ
  const [, setPersonalizedData] = useState({
    gachaVocabCount: 0,
    preStudyCompleted: 0,
    weakAreas: [] as string[],
    strongAreas: [] as string[],
    personalizedQuestions: 0,
  });

  useEffect(() => {
    try {
      const userGachaData = GachaSystem.getUserGachaData();
      const preStudyProgress = DataManager.getPreStudyProgress();

      setPersonalizedData({
        gachaVocabCount: userGachaData.ownedCards.length,
        preStudyCompleted: preStudyProgress.completedContents.length,
        weakAreas: ["tenses", "modals"], // TODO: 実際の弱点分析と連携
        strongAreas: ["basic-grammar"], // TODO: 実際の強み分析と連携
        personalizedQuestions: Math.min(userGachaData.ownedCards.length, 5),
      });
    } catch (error) {
      console.log("パーソナライズデータの取得に失敗:", error);
    }
  }, []);
  const [, setTimeUp] = useState(false);

  useEffect(() => {
    // ハートを消費して学習を開始
    const levelManager = getLevelManager();
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      navigate("/");
      return;
    }

    const allQuestions = getCombinedTestQuestions();
    const selectedQuestions = shuffleArray(allQuestions).slice(0, 8); // 8問に設定
    setQuestions(selectedQuestions);
    saveLevelManager();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

  const handleTimeUp = () => {
    if (!showResult) {
      setTimeUp(true);
      handleSubmitAnswer(true);
    }
  };

  const handleSubmitAnswer = (isTimeUp = false) => {
    if (!currentQuestion) return;

    let answer = "";
    if (currentQuestion.type === "multiple-choice") {
      answer = selectedOption;
    } else {
      answer = userAnswer.trim();
    }

    if (!answer && !isTimeUp) return;

    const correct = checkAnswer(answer, currentQuestion.correctAnswer);
    setIsCorrect(correct);

    // 効果音を再生
    if (correct) {
      SoundManager.sounds.correct();
      setScore((prev) => prev + 1);
      setTotalXP((prev) => prev + currentQuestion.xpReward);
      setCurrentXP(currentQuestion.xpReward);
      setShowXPAnimation(true);
    } else {
      SoundManager.sounds.incorrect();
    }

    setShowResult(true);
    setTimeUp(false);
  };

  const checkAnswer = (userAns: string, correctAns: string): boolean => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();
    const userNormalized = normalize(userAns);
    const correctNormalized = normalize(correctAns);

    // 完全一致チェック
    if (userNormalized === correctNormalized) return true;

    // 英作文の場合の厳格なチェック
    if (currentQuestion.type === "text-input") {
      // 空文字や短すぎる入力は不正解
      if (userNormalized.length < 5) return false;

      // 単語数チェック（最低3単語以上）
      const userWords = userNormalized.split(/\s+/).filter((w) => w.length > 0);
      if (userWords.length < 3) return false;

      const correctWords = correctNormalized
        .split(/\s+/)
        .filter((w) => w.length > 1); // 全ての単語をチェック対象に

      // 重要な単語が含まれているかチェック（完全一致のみ）
      const matchedWords = correctWords.filter((word) =>
        userWords.includes(word)
      );

      // 必須キーワードの存在確認（問題で指定された語彙）
      const requiredVocabulary = currentQuestion.vocabulary || [];
      const vocabularyMatches = requiredVocabulary.filter((vocab) =>
        userNormalized.includes(vocab.toLowerCase())
      );

      // 基本条件：
      // 1. 80%以上の単語が一致
      // 2. 指定された語彙の80%以上を使用
      const wordMatchRate = matchedWords.length / correctWords.length;
      const vocabMatchRate =
        requiredVocabulary.length > 0
          ? vocabularyMatches.length / requiredVocabulary.length
          : 1;

      console.log("英作文判定:", {
        userInput: userAns,
        correctAnswer: correctAns,
        userWords,
        correctWords,
        matchedWords,
        requiredVocabulary,
        vocabularyMatches,
        wordMatchRate,
        vocabMatchRate,
        isCorrect: wordMatchRate >= 0.8 && vocabMatchRate >= 0.8,
      });

      return wordMatchRate >= 0.8 && vocabMatchRate >= 0.8;
    }

    return false;
  };

  const handleNext = () => {
    setShowResult(false);
    setUserAnswer("");
    setSelectedOption("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // テスト完了
      SoundManager.sounds.complete();
      const accuracy = (score / questions.length) * 100;

      // デイリークエスト進捗更新（80%以上の場合）
      if (accuracy >= 80) {
        dailyQuestManager.recordCombinedTestCompletion();
      }

      alert(
        `テスト完了！\nスコア: ${score}/${
          questions.length
        }\n正解率: ${accuracy.toFixed(1)}%\n獲得XP: ${totalXP}`
      );
      navigate("/");
    }
  };

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>テスト問題を準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">総合テスト</h1>
          <div className="w-10" />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">進捗</span>
            <span className="text-sm">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Timer */}
        <Timer timeLimit={currentQuestion.timeLimit} onTimeUp={handleTimeUp} />

        {/* Score and XP */}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-sm">
            スコア: {score} / {questions.length}
          </Badge>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>XP: {totalXP}</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-3">
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="text-xs">
                {currentQuestion.difficulty === "beginner"
                  ? "初級"
                  : currentQuestion.difficulty === "intermediate"
                  ? "中級"
                  : "上級"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentQuestion.grammarPattern}
              </Badge>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">{currentQuestion.instruction}</h3>

              {/* Vocabulary display */}
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700 mb-2">使用する単語:</p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.vocabulary.map((word, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-800"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Answer area */}
            {currentQuestion.type === "multiple-choice" ? (
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`
                      block p-3 border rounded-lg cursor-pointer transition-colors
                      ${
                        selectedOption === option
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOption === option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">あなたの回答:</label>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="英文を入力してください..."
                  className="text-base"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={() => handleSubmitAnswer()}
          disabled={(!userAnswer.trim() && !selectedOption) || showResult}
          className="w-full h-12"
        >
          回答する
        </Button>

        {/* Result Dialog */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle
                className={`text-center flex items-center justify-center space-x-2 ${
                  isCorrect ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <span>{isCorrect ? "正解！" : "不正解"}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium">正解:</span>
                  <p className="text-emerald-600 font-medium">
                    {currentQuestion.correctAnswer}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">解説:</span>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
                {isCorrect && (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{currentQuestion.xpReward} XP獲得！
                    </span>
                  </div>
                )}
              </div>
              <Button onClick={handleNext} className="w-full">
                {currentQuestionIndex + 1 < questions.length
                  ? "次の問題"
                  : "完了"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* XP Animation */}
        <XPAnimation
          show={showXPAnimation}
          xp={currentXP}
          onComplete={handleXPAnimationComplete}
        />

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
