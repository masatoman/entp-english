import { ArrowLeft, Brain, CheckCircle, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LearningItem,
  LearningProgress,
  LearningQuestion,
} from "../types/learningItem";
import { LearningItemManager } from "../utils/learningItemManager";
import { SpeechSynthesisManager } from "../utils/speechSynthesis";
import { calculateVocabularyXP } from "../utils/xpCalculator";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

/**
 * 統合学習コンポーネント
 * 単語学習と問題演習を統合的に提供
 */

interface LearningSession {
  items: LearningItem[];
  currentIndex: number;
  mode: "card" | "question" | "mixed";
  progress: Map<string, LearningProgress>;
}

export default function IntegratedLearning() {
  const navigate = useNavigate();
  const { level, category, mode } = useParams();

  const [session, setSession] = useState<LearningSession | null>(null);
  const [currentItem, setCurrentItem] = useState<LearningItem | null>(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<LearningQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    startTime: Date.now(),
    xpEarned: 0,
  });

  useEffect(() => {
    initializeSession();
  }, [level, category, mode]);

  const initializeSession = () => {
    const actualLevel = level as "beginner" | "intermediate" | "advanced";
    const actualMode = (mode as "card" | "question" | "mixed") || "mixed";

    // 学習項目を取得
    const items = LearningItemManager.getFilteredLearningItems(
      actualLevel,
      category,
      "vocabulary"
    );

    if (items.length === 0) {
      console.warn("No learning items found for the specified criteria");
      return;
    }

    // 学習進捗を取得
    const progressMap = new Map<string, LearningProgress>();
    items.forEach((item) => {
      const progress = LearningItemManager.getLearningProgress(item.id);
      if (progress) {
        progressMap.set(item.id, progress);
      }
    });

    const newSession: LearningSession = {
      items: items.slice(0, 10), // 最初は10項目に制限
      currentIndex: 0,
      mode: actualMode,
      progress: progressMap,
    };

    setSession(newSession);
    setCurrentItem(items[0]);

    // モードに応じて最初のコンテンツを設定
    if (actualMode === "question" || actualMode === "mixed") {
      setCurrentQuestion(selectQuestionForItem(items[0]));
    }
  };

  const selectQuestionForItem = (
    item: LearningItem
  ): LearningQuestion | null => {
    if (item.questions.length === 0) return null;

    // 簡単な問題から始める
    const easyQuestions = item.questions.filter((q) => q.difficulty === "easy");
    if (easyQuestions.length > 0) {
      return easyQuestions[0];
    }

    return item.questions[0];
  };

  const handleCardResponse = (known: boolean) => {
    if (!currentItem || !session) return;

    // XP計算
    const xpGained = known ? calculateVocabularyXP(1, currentItem.level) : 5;
    setSessionStats((prev) => ({
      ...prev,
      xpEarned: prev.xpEarned + xpGained,
    }));

    // 進捗を更新
    updateProgress(currentItem.id, known);

    // 次の項目に進む
    moveToNext();
  };

  const handlePlayAudio = async (text: string) => {
    if (isSpeaking) return;

    try {
      setIsSpeaking(true);
      await SpeechSynthesisManager.speak(text);
    } catch (error) {
      console.error("音声再生エラー:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleQuestionSubmit = () => {
    if (!currentQuestion || !currentItem) return;

    const isCorrect =
      userAnswer.toLowerCase().trim() ===
      currentQuestion.correctAnswer.toString().toLowerCase().trim();

    // XP計算
    const baseXP = calculateVocabularyXP(1, currentItem.level);
    const difficultyMultiplier =
      currentQuestion.difficulty === "easy"
        ? 1
        : currentQuestion.difficulty === "medium"
        ? 1.5
        : 2;
    const xpGained = isCorrect ? Math.round(baseXP * difficultyMultiplier) : 2;

    setSessionStats((prev) => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
      xpEarned: prev.xpEarned + xpGained,
    }));

    setShowAnswer(true);

    // 進捗を更新
    updateProgress(currentItem.id, isCorrect);
  };

  const updateProgress = (itemId: string, success: boolean) => {
    if (!session) return;

    let progress = session.progress.get(itemId);

    if (!progress) {
      // 新しい進捗を作成
      progress = {
        itemId,
        userId: "default", // TODO: 実際のユーザーIDを使用
        masteryLevel: 0,
        confidence: 0,
        lastStudied: new Date(),
        studyCount: 0,
        totalStudyTime: 0,
        aspects: {
          meaning: 0,
          usage: 0,
          grammar: 0,
          pronunciation: 0,
          context: 0,
        },
        questionResults: [],
        studyHistory: [],
        nextReviewDate: new Date(),
        reviewInterval: 1,
        reviewCount: 0,
      };
    }

    // 進捗を更新
    progress.studyCount++;
    progress.lastStudied = new Date();

    if (success) {
      progress.masteryLevel = Math.min(100, progress.masteryLevel + 10);
      progress.confidence = Math.min(100, progress.confidence + 15);
    } else {
      progress.confidence = Math.max(0, progress.confidence - 5);
    }

    // 保存
    LearningItemManager.saveLearningProgress(progress);
    session.progress.set(itemId, progress);
  };

  const moveToNext = () => {
    if (!session) return;

    const nextIndex = session.currentIndex + 1;

    if (nextIndex >= session.items.length) {
      // セッション完了
      showSessionResults();
      return;
    }

    const nextItem = session.items[nextIndex];
    setCurrentItem(nextItem);
    setSession((prev) => (prev ? { ...prev, currentIndex: nextIndex } : null));

    // 次のコンテンツを設定
    if (session.mode === "question" || session.mode === "mixed") {
      setCurrentQuestion(selectQuestionForItem(nextItem));
    }

    // リセット
    setShowAnswer(false);
    setUserAnswer("");
  };

  const showSessionResults = () => {
    // TODO: 結果画面に遷移
    console.log("Session completed:", sessionStats);
    navigate("/learning/results");
  };

  if (!session || !currentItem) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>学習セッションを準備中...</p>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (session.currentIndex / session.items.length) * 100;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold">統合学習</h1>
            <p className="text-sm text-gray-600">
              {level} • {category} • {mode}モード
            </p>
          </div>

          <div className="text-right text-sm text-gray-600">
            {session.currentIndex + 1} / {session.items.length}
          </div>
        </div>

        {/* 進捗バー */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">学習進捗</span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                正解: {sessionStats.correct}
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 text-blue-600 mr-1" />
                総問題: {sessionStats.total}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-orange-600 mr-1" />
                {Math.round((Date.now() - sessionStats.startTime) / 1000)}s
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 学習コンテンツ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              {currentItem.content}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {currentItem.partOfSpeech} • {currentItem.category}
            </p>
          </CardHeader>

          <CardContent>
            {(session.mode === "card" || session.mode === "mixed") && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    {currentItem.content}
                  </h3>
                  <p className="text-lg text-gray-700">{currentItem.meaning}</p>
                </div>

                {currentItem.examples.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">例文</h4>
                    <p className="italic">
                      "{currentItem.examples[0].sentence}"
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentItem.examples[0].translation}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => handleCardResponse(false)}
                    className="flex-1"
                  >
                    まだ覚えていない
                  </Button>
                  <Button
                    onClick={() => handleCardResponse(true)}
                    className="flex-1"
                  >
                    覚えている
                  </Button>
                </div>
              </div>
            )}

            {(session.mode === "question" || session.mode === "mixed") &&
              currentQuestion && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2">問題</h4>
                    <p>{currentQuestion.prompt}</p>
                  </div>

                  {currentQuestion.type === "multiple_choice" &&
                    currentQuestion.options && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              userAnswer === option ? "default" : "outline"
                            }
                            onClick={() => setUserAnswer(option)}
                            className="w-full text-left justify-start"
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Button>
                        ))}
                      </div>
                    )}

                  {currentQuestion.type === "fill_blank" && (
                    <div>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="回答を入力してください"
                      />
                    </div>
                  )}

                  {showAnswer && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">解説</h4>
                      <p>{currentQuestion.explanation}</p>
                      <Button onClick={moveToNext} className="mt-4">
                        次へ
                      </Button>
                    </div>
                  )}

                  {!showAnswer && (
                    <Button
                      onClick={handleQuestionSubmit}
                      disabled={!userAnswer}
                      className="w-full"
                    >
                      回答する
                    </Button>
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
