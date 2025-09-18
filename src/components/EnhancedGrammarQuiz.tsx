import {
  ArrowLeft,
  CheckCircle,
  Heart,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useNavigate, useParams } from "react-router-dom";
import { getRandomEnglishTip } from "../data/englishTips";
import {
  calculateXPReward,
  determineQuestionRank,
} from "../data/enhancedQuestions";
import { getGrammarQuizQuestions } from "../data/grammarQuizCategorized";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category, QuestionWithRank } from "../types";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { calculateNewXP } from "../utils/newXpCalculator";
import {
  filterQuestionsByLevel,
  selectWeightedQuestion,
} from "../utils/questionAdapter";
import { SoundManager } from "../utils/soundManager";
import { QuestionRankDisplay } from "./QuestionRankDisplay";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

// Router対応のため、props interfaceを削除

interface DropZoneProps {
  blankId: string;
  droppedWord: string | null;
  onDrop: (blankId: string, word: string) => void;
}

interface DraggableWordProps {
  word: string;
}

// Detect if device supports touch
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

function DropZone({ blankId, droppedWord, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "word",
    drop: (item: { word: string }) => onDrop(blankId, item.word),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <span
      ref={drop}
      className={`
        inline-block min-w-[80px] h-8 px-3 mx-1 border-2 border-dashed rounded-md
        flex items-center justify-center text-center
        ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${droppedWord ? "bg-blue-100 border-blue-400 border-solid" : ""}
        transition-all duration-200
      `}
    >
      {droppedWord || "?"}
    </span>
  );
}

function DraggableWord({ word }: DraggableWordProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "word",
    item: { word },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={drag}
      className={`
        inline-block px-3 py-1 mx-1 mb-2 bg-blue-100 text-blue-800 rounded-md cursor-move
        hover:bg-blue-200 transition-colors duration-200
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      {word}
    </span>
  );
}

export default function EnhancedGrammarQuiz() {
  const navigate = useNavigate();
  const { category: urlCategory, difficulty: urlDifficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  useScrollToTop();

  // URL パラメータの型変換
  const category = urlCategory as Category;
  const difficulty =
    (urlDifficulty as "beginner" | "intermediate" | "advanced") ||
    "intermediate";
  const [questions, setQuestions] = useState<QuestionWithRank[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState<
    boolean | null
  >(null);
  const [currentTip, setCurrentTip] = useState<any>(null);
  const [levelManager] = useState(() => getLevelManager());
  const [heartSystem, setHeartSystem] = useState(levelManager.getHeartSystem());
  const [userLevel, setUserLevel] = useState(levelManager.getLevel());
  const [statusAllocation] = useState(levelManager.getStatusAllocation());

  useEffect(() => {
    // ハートを消費して学習を開始
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      navigate(`/learning/grammar/difficulty/${category}`);
      return;
    }

    // 問題を生成
    generateQuestions();
    setSessionStartTime(Date.now());
    setHeartSystem(levelManager.getHeartSystem());
    saveLevelManager();
  }, []);

  const generateQuestions = () => {
    console.log(
      "Generating questions for category:",
      category,
      "difficulty:",
      difficulty
    );
    const originalQuestions = getGrammarQuizQuestions(difficulty, category);
    console.log("Original questions:", originalQuestions);

    if (!originalQuestions || originalQuestions.length === 0) {
      console.error("No grammar questions found for difficulty:", difficulty);
      setQuestions([]);
      return;
    }

    const enhancedQuestions = originalQuestions.map((q, index) => {
      // 文法クイズ用の変換
      const rank = determineQuestionRank(userLevel.level);
      const skillField = "grammar";
      const xpReward = calculateXPReward(rank);

      return {
        id: q.id,
        question: q.sentence,
        options: q.options,
        correctAnswer: q.blanks.map((b) => b.correctAnswer).join(" "),
        explanation: q.explanation,
        category: "basic-grammar" as Category,
        difficulty: "normal" as const,
        rank,
        skillField,
        xpReward,
        blanks: q.blanks, // 文法クイズ特有のblanks情報を保持
      } as QuestionWithRank & { blanks: any[] };
    });

    console.log("Enhanced questions:", enhancedQuestions);

    // レベルに応じてフィルタリング
    const filteredQuestions = filterQuestionsByLevel(
      enhancedQuestions,
      userLevel.level
    );
    console.log("Filtered questions:", filteredQuestions);

    // ステータス配分に基づいて問題を選択
    const selectedQuestions: QuestionWithRank[] = [];
    const questionCount = 8;

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
          selectedQuestions.push(selectedQuestion);
        }
      }
    }

    console.log("Selected questions:", selectedQuestions);
    setQuestions(selectedQuestions);
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // 問題が変わった時に選択肢をシャッフル
  useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      const shuffled = [...currentQuestion.options].sort(
        () => Math.random() - 0.5
      );
      setShuffledOptions(shuffled);
      setUserAnswers({});
      setShowFeedback(false); // Reset feedback display
      setCurrentAnswerCorrect(null); // Reset answer status
      setCurrentTip(null); // Reset tip
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleDrop = (blankId: string, word: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [blankId]: word,
    }));
  };

  const checkCurrentAnswer = () => {
    if (!currentQuestion || !(currentQuestion as any).blanks) return false;

    let isCorrect = true;
    for (const blank of (currentQuestion as any).blanks) {
      const userAnswer = userAnswers[blank.id];
      if (!userAnswer || userAnswer !== blank.correctAnswer) {
        isCorrect = false;
        break;
      }
    }
    return isCorrect;
  };

  const handleNext = () => {
    // 現在の問題の正解をチェック
    const isCorrect = checkCurrentAnswer();
    setCurrentAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // 豆知識を設定
    setCurrentTip(getRandomEnglishTip("grammar"));

    // 解説を表示
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setCurrentAnswerCorrect(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setShowResults(true);

    // XP計算とレベルアップ処理
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    const xpGained = calculateNewXP(
      questions.length > 0
        ? questions.map((q, index) => ({
            questionId: q.id,
            answer: userAnswers[`blank_${index}`] || "",
            isCorrect: score > 0, // スコアが0より大きければ正解
          }))
        : [],
      currentQuestion?.rank || "normal",
      true
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

  const renderSentenceWithBlanks = () => {
    if (!currentQuestion || !currentQuestion.blanks) return null;

    const sentence = currentQuestion.question;
    const blanks = currentQuestion.blanks;

    // 文を単語に分割
    const words = sentence.split(" ");
    const result = [];

    let blankIndex = 0;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // 空欄の位置をチェック
      const blank = blanks.find((b) => b.position === i + 1);
      if (blank) {
        result.push(
          <DropZone
            key={`blank_${blankIndex}`}
            blankId={blank.id}
            droppedWord={userAnswers[blank.id] || null}
            onDrop={handleDrop}
          />
        );
        blankIndex++;
      } else {
        result.push(
          <span key={i} className="mx-1">
            {word}
          </span>
        );
      }
    }

    return result;
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    generateQuestions();
    setSessionStartTime(Date.now());
  };

  // 問題が読み込まれていない場合の表示
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() =>
                      navigate(`/learning/grammar/difficulty/${category}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800">
                    文法クイズ
                  </h1>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-lg text-gray-600">問題を読み込み中...</div>
                <div className="text-sm text-gray-500">
                  しばらくお待ちください
                </div>
                <Button onClick={handleRestart} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  再読み込み
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">クイズ結果</h1>
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
                <div className="text-4xl font-bold text-blue-600">
                  {score} / {questions.length}
                </div>
                <div className="text-lg text-gray-600">
                  正解率: {Math.round((score / questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">
                  獲得XP: {questions.reduce((sum, q) => sum + q.xpReward, 0)}
                </div>

                {/* 問題ごとの解説 */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    問題解説
                  </h3>
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="text-left p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="font-medium text-gray-800 mb-2">
                        問題 {index + 1}: {question.question}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>解説:</strong> {question.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={handleRestart} className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    もう一度挑戦
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/learning/grammar/difficulty/${category}`)
                    }
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

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-lg text-gray-600">
                {questions.length === 0
                  ? "問題が見つかりませんでした"
                  : "問題を読み込み中..."}
              </div>
              <Button
                onClick={() =>
                  navigate(`/learning/grammar/difficulty/${category}`)
                }
                className="mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() =>
                      navigate(`/learning/grammar/difficulty/${category}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800">
                    文法クイズ
                  </h1>
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
              {!currentQuestion ? (
                <div className="text-center space-y-4">
                  <div className="text-lg text-gray-600">
                    問題を読み込み中...
                  </div>
                  <div className="text-sm text-gray-500">
                    しばらくお待ちください
                  </div>
                  <Button onClick={handleRestart} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    再読み込み
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                      {currentQuestion.question}
                    </h2>
                    <p className="text-sm text-gray-600">
                      空欄に適切な単語をドラッグして文を完成させてください
                    </p>
                  </div>

                  <div className="text-center text-lg">
                    {renderSentenceWithBlanks()}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      単語を選んでください
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {shuffledOptions.map((option, index) => (
                        <DraggableWord key={index} word={option} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 解説表示 */}
          {showFeedback && currentQuestion && (
            <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* 正解/不正解の表示 */}
                  <div className="flex items-center justify-center space-x-2">
                    {currentAnswerCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="text-xl font-bold text-green-600">
                          正解！
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-500" />
                        <span className="text-xl font-bold text-red-600">
                          不正解
                        </span>
                      </>
                    )}
                  </div>

                  {/* 正解の表示 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">正解:</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {currentQuestion.blanks
                        ?.map((blank) => blank.correctAnswer)
                        .join(" ")}
                    </div>
                  </div>

                  {/* 解説 */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">解説:</div>
                    <div className="text-gray-800">
                      {currentQuestion.explanation}
                    </div>
                  </div>

                  {/* 英語の豆知識・格言表示 */}
                  {currentTip && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm text-purple-700 mb-2 font-medium">
                        {currentTip.type === "quote"
                          ? "💭 英語の格言"
                          : "💡 英語の豆知識"}
                      </div>
                      <div className="text-purple-800 mb-2 font-semibold">
                        "{currentTip.content}"
                      </div>
                      <div className="text-sm text-purple-600 mb-1">
                        {currentTip.translation}
                      </div>
                      {currentTip.explanation && (
                        <div className="text-xs text-purple-500 italic">
                          {currentTip.explanation}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-purple-600">
                        {currentAnswerCorrect
                          ? `+${currentQuestion.xpReward}XP 獲得！`
                          : "正解を覚えて次回に活かしましょう！"}
                      </div>
                    </div>
                  )}

                  {/* 続行ボタン */}
                  <Button onClick={handleContinue} size="lg" className="mt-4">
                    {currentQuestionIndex < questions.length - 1
                      ? "次の問題へ"
                      : "結果を見る"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ナビゲーション */}
          {!showFeedback && (
            <div className="flex justify-center">
              <Button onClick={handleNext} size="lg">
                {currentQuestionIndex < questions.length - 1
                  ? "次の問題"
                  : "答え合わせ"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
