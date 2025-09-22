import { ArrowLeft, Clock, Flame, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../data/questions";
import { getVocabularyWords } from "../data/vocabulary";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { GachaSystem } from "../utils/gachaSystem";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface TimeAttackQuestion {
  id: number | string;
  type: "grammar" | "vocabulary";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  timeLimit: number; // 秒
}

interface QuestionResult {
  question: TimeAttackQuestion;
  userAnswer: string;
  isCorrect: boolean;
  timeUsed: number;
}

export default function TimeAttackMode() {
  const navigate = useNavigate();
  useScrollToTop();
  const [questions, setQuestions] = useState<TimeAttackQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [showExplanations, setShowExplanations] = useState(false);

  // 相乗効果データ取得
  const [synergyStats, setSynergyStats] = useState({
    gachaVocabCount: 0,
    grammarCategoriesStudied: 0,
  });

  useEffect(() => {
    try {
      const userGachaData = GachaSystem.getUserGachaData();
      setSynergyStats({
        gachaVocabCount: userGachaData.ownedCards.length,
        grammarCategoriesStudied: 3, // TODO: 実際の文法学習進捗と連携
      });
    } catch (error) {
      console.log("相乗効果データの取得に失敗:", error);
    }
  }, []);

  // 相乗効果を活用したタイムアタック問題を生成
  const generateTimeAttackQuestions = (): TimeAttackQuestion[] => {
    const timeAttackQuestions: TimeAttackQuestion[] = [];

    // ガチャで獲得した語彙を活用
    try {
      const userGachaData = GachaSystem.getUserGachaData();
      const ownedVocabulary = userGachaData.ownedCards.slice(0, 6); // 最大6問

      if (ownedVocabulary.length > 0) {
        ownedVocabulary.forEach((card, index) => {
          // 他の語彙からダミー選択肢を作成
          const otherCards = userGachaData.ownedCards
            .filter((c) => c.id !== card.id)
            .slice(0, 3);

          if (otherCards.length >= 3) {
            timeAttackQuestions.push({
              id: `gacha-${card.id}`,
              type: "vocabulary",
              question: `「${card.meaning}」を英語で言うと？`,
              options: [card.word, ...otherCards.map((c) => c.word)].sort(
                () => Math.random() - 0.5
              ),
              correctAnswer: card.word,
              explanation: `ガチャ語彙: ${card.word} - ${card.meaning}`,
              timeLimit: 8, // ガチャ語彙は短時間で
            });
          }
        });
      }
    } catch (error) {
      console.log("ガチャ語彙の取得に失敗:", error);
    }

    // 文法問題を追加（学習済みカテゴリー優先）
    const grammarCategories = ["basic-grammar", "tenses", "modals"];
    grammarCategories.forEach((category) => {
      if (timeAttackQuestions.length < 10) {
        const categoryQuestions = getQuestions(category as any, "easy").slice(
          0,
          2
        );
        categoryQuestions.forEach((q) => {
          timeAttackQuestions.push({
            id: `grammar-${category}-${q.id}`,
            type: "grammar",
            question: q.japanese,
            options: q.choices,
            correctAnswer: q.correctAnswer,
            explanation: `文法復習: ${q.explanation}`,
            timeLimit: 12, // 文法問題は少し長めに
          });
        });
      }
    });

    // 不足分は従来の語彙問題で補完（既知単語を除外）
    if (timeAttackQuestions.length < 10) {
      const allVocabularyWords = getVocabularyWords("beginner", "all");
      const unknownVocabularyWords =
        KnownWordsManager.filterUnknownWords(allVocabularyWords);
      const vocabularyWords = unknownVocabularyWords.slice(
        0,
        10 - timeAttackQuestions.length
      );
      vocabularyWords.forEach((word, index) => {
        timeAttackQuestions.push({
          id: `vocab-${1000 + index}`,
          type: "vocabulary",
          question: `「${word.japanese}」を英語で言うと？`,
          options: [
            word.word,
            vocabularyWords[(index + 1) % vocabularyWords.length].word,
            vocabularyWords[(index + 2) % vocabularyWords.length].word,
            vocabularyWords[(index + 3) % vocabularyWords.length].word,
          ].sort(() => Math.random() - 0.5),
          correctAnswer: word.word,
          explanation: word.meaning,
          timeLimit: 10,
        });
      });
    }

    return timeAttackQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  // ゲーム開始
  const startGame = () => {
    // ハートを消費して学習を開始
    const levelManager = getLevelManager();
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      navigate("/");
      return;
    }

    const newQuestions = generateTimeAttackQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsPlaying(true);
    setIsCompleted(false);
    setShowResult(false);
    setQuestionResults([]);
    setShowExplanations(false);

    if (newQuestions.length > 0) {
      setTimeLeft(newQuestions[0].timeLimit);
    }
    saveLevelManager();
  };

  // タイマー
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 時間切れ
          handleAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isCompleted]);

  // 回答処理
  const handleAnswer = (answer: string) => {
    if (!isPlaying || showResult) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    const timeUsed = currentQuestion.timeLimit - timeLeft;

    // 回答履歴を保存
    const result: QuestionResult = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect: correct,
      timeUsed: timeUsed,
    };
    setQuestionResults(prev => [...prev, result]);

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      // コンボボーナス計算
      const baseScore = 100;
      const comboBonus = Math.min(newCombo * 10, 100); // 最大100点のコンボボーナス
      const timeBonus = Math.max(timeLeft * 2, 0); // 残り時間ボーナス

      setScore((prev) => prev + baseScore + comboBonus + timeBonus);
    } else {
      setCombo(0);
    }

    // 結果表示後、次の問題へ
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        // ゲーム終了
        setIsCompleted(true);
        setIsPlaying(false);
        saveResults();
      } else {
        // 次の問題へ
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setTimeLeft(questions[nextIndex].timeLimit);
          setShowResult(false);
          setSelectedAnswer("");
        }
      }
    }, 2000);
  };

  // 結果保存
  const saveResults = () => {
    const xpEarned = Math.floor(score / 10); // スコアの1/10をXPに
    const sessionData = {
      date: new Date().toISOString().split("T")[0],
      type: "time-attack",
      score: score,
      maxCombo: maxCombo,
      questionsAnswered: currentQuestionIndex + 1,
      xpEarned: xpEarned,
      duration: 0, // タイムアタックは時間制限なので0
    };

    DataManager.recordLearningSession(sessionData);

    // デイリークエスト進捗更新
    dailyQuestManager.recordTimeAttackCompletion();
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">タイムアタック結果</h1>
            <div className="w-10" />
          </div>

          {/* Results */}
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-orange-800 mb-2">
                タイムアタック完了！
              </h2>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">スコア</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {score.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">最大コンボ</span>
                  <span className="text-2xl font-bold text-red-600">
                    {maxCombo}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">正解数</span>
                  <span className="text-2xl font-bold text-green-600">
                    {currentQuestionIndex + 1}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">獲得XP</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.floor(score / 10)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  onClick={() => setShowExplanations(!showExplanations)}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  {showExplanations ? "解説を隠す" : "解説を見る"}
                </Button>
                <Button onClick={startGame} className="w-full" size="lg">
                  もう一度挑戦
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  ホームに戻る
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 解説セクション */}
          {showExplanations && questionResults.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-center">
                  📚 問題解説
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questionResults.map((result, index) => (
                  <Card 
                    key={index}
                    className={`border-2 ${
                      result.isCorrect 
                        ? "border-green-300 bg-green-50" 
                        : "border-red-300 bg-red-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          result.isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{result.question.question}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">あなたの回答:</span>
                              <span className={`font-medium ${
                                result.isCorrect ? "text-green-600" : "text-red-600"
                              }`}>
                                {result.userAnswer}
                              </span>
                            </div>
                            
                            {!result.isCorrect && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">正解:</span>
                                <span className="font-medium text-green-600">
                                  {result.question.correctAnswer}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">回答時間:</span>
                              <span className="font-medium">
                                {result.timeUsed.toFixed(1)}秒
                              </span>
                            </div>
                            
                            {result.question.explanation && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>💡 解説:</strong> {result.question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">タイムアタック</h1>
            <div className="w-10" />
          </div>

          {/* Instructions */}
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">
                タイムアタックモード
              </h2>
              <p className="text-gray-700 mb-6">
                制限時間内に連続で正解を重ねて高スコアを目指そう！
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span>各問題に制限時間あり</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <span>連続正解でコンボボーナス</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span>残り時間でタイムボーナス</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>10問連続で挑戦</span>
                </div>
              </div>

              <Button onClick={startGame} className="w-full mt-8" size="lg">
                スタート！
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">タイムアタック</h1>
          <div className="w-10" />
        </div>

        {/* Score and Combo */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-gray-600">スコア</p>
            <p className="text-2xl font-bold text-orange-600">
              {score.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">コンボ</p>
            <p className="text-2xl font-bold text-red-600">{combo}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">問題</p>
            <p className="text-2xl font-bold text-blue-600">
              {currentQuestionIndex + 1}/10
            </p>
          </div>
        </div>

        {/* Timer */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">残り時間</span>
              <span
                className={`text-2xl font-bold ${
                  timeLeft <= 5 ? "text-red-600" : "text-blue-600"
                }`}
              >
                {timeLeft}
              </span>
            </div>
            <Progress
              value={(timeLeft / currentQuestion.timeLimit) * 100}
              className={`h-2 ${timeLeft <= 5 ? "bg-red-200" : "bg-blue-200"}`}
            />
          </CardContent>
        </Card>

        {/* Question */}
        {currentQuestion && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {currentQuestion.type === "grammar" ? "文法問題" : "単語問題"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-lg">{currentQuestion.question}</p>
              </div>

              {showResult && (
                <div
                  className={`p-4 rounded-lg text-center ${
                    isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-bold text-lg">
                    {isCorrect ? "正解！" : "不正解"}
                  </p>
                  {isCorrect && (
                    <p className="text-sm mt-1">
                      +
                      {100 +
                        Math.min(combo * 10, 100) +
                        Math.max(timeLeft * 2, 0)}{" "}
                      ポイント
                    </p>
                  )}
                </div>
              )}

              {!showResult && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswer === option ? "default" : "outline"
                      }
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => {
                        setSelectedAnswer(option);
                        handleAnswer(option);
                      }}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
