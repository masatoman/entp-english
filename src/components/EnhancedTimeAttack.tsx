import {
  ArrowLeft,
  Clock,
  Flame,
  Target,
  Zap,
  Star,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  TimeAttackQuestion,
  TimeAttackSession,
  TimeAttackAnswer,
  TimeAttackMode,
  TIME_ATTACK_MODES,
} from "../types/timeAttack";
import { TimeAttackGenerator } from "../utils/timeAttackGenerator";
import { DataManager } from "../utils/dataManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { SelectionCard } from "./ui/selection-card";

export default function EnhancedTimeAttack() {
  const navigate = useNavigate();
  useScrollToTop();

  // 状態管理
  const [selectedMode, setSelectedMode] = useState<TimeAttackMode | null>(null);
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
  const [session, setSession] = useState<TimeAttackSession | null>(null);
  const [userAnswers, setUserAnswers] = useState<TimeAttackAnswer[]>([]);
  const [responseStartTime, setResponseStartTime] = useState(0);

  // 相乗効果データ
  const synergyData = TimeAttackGenerator.getSynergyData();

  // モード選択画面
  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="w-8 h-8 text-orange-600" />
                タイムアタック
              </h1>
              <p className="text-gray-600 mt-1">あなたの学習データに基づく最適化された練習</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">体力</div>
              <div className="text-2xl font-bold text-orange-600">♥♥♥</div>
            </div>
          </div>

          {/* 相乗効果統計 */}
          <Card className="mb-8 p-6 bg-white shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              学習データ分析
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-gray-600">獲得語彙</div>
                <div className="font-bold text-purple-600">
                  {synergyData.availableVocabulary.length}枚
                </div>
              </div>
              <div>
                <div className="text-gray-600">学習済み文法</div>
                <div className="font-bold text-blue-600">
                  {synergyData.grammarProgress.length}分野
                </div>
              </div>
              <div>
                <div className="text-gray-600">弱点エリア</div>
                <div className="font-bold text-red-600">
                  {synergyData.identifiedWeakAreas.filter(w => w.needsReview).length}項目
                </div>
              </div>
              <div>
                <div className="text-gray-600">事前学習完了</div>
                <div className="font-bold text-green-600">
                  {synergyData.completedPreStudyTopics.length}件
                </div>
              </div>
            </div>
          </div>

          {/* モード選択 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              モードを選択
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TIME_ATTACK_MODES.map((mode) => {
                const requirements = TimeAttackGenerator.checkModeRequirements(mode, synergyData);
                
                return (
                  <SelectionCard
                    key={mode.id}
                    id={mode.id}
                    title={mode.name}
                    description={mode.description}
                    detail={`${mode.questionCount}問 | ${mode.timePerQuestion}秒/問`}
                    icon={mode.icon}
                    difficulty={mode.difficulty}
                    color={
                      mode.difficulty === "beginner"
                        ? "bg-green-50 border-green-200"
                        : mode.difficulty === "intermediate"
                        ? "bg-blue-50 border-blue-200"
                        : mode.difficulty === "advanced"
                        ? "bg-red-50 border-red-200"
                        : "bg-orange-50 border-orange-200"
                    }
                    isLocked={!requirements.canPlay}
                    onClick={() => {
                      if (requirements.canPlay) {
                        setSelectedMode(mode);
                      } else {
                        alert(`要件不足:\\n${requirements.missingRequirements.join('\\n')}`);
                      }
                    }}
                    keyPoints={requirements.canPlay ? undefined : requirements.missingRequirements}
                  />
                );
              })}
            </div>
          </div>

          {/* 推奨モード */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Star className="w-5 h-5" />
                あなたにおすすめ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {synergyData.identifiedWeakAreas.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-sm">弱点克服モードで苦手分野を強化しましょう</span>
                  </div>
                )}
                {synergyData.availableVocabulary.length >= 20 && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">語彙スピードモードでガチャ語彙を活用しましょう</span>
                  </div>
                )}
                {synergyData.grammarProgress.length >= 2 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">文法集中モードで学習した文法を復習しましょう</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ゲーム開始処理
  const startGame = () => {
    const levelManager = getLevelManager();
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      navigate("/");
      return;
    }

    const generatedQuestions = TimeAttackGenerator.generateQuestions(selectedMode);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsPlaying(true);
    setIsCompleted(false);
    setShowResult(false);
    setUserAnswers([]);
    
    // セッション開始
    const newSession: TimeAttackSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      questions: generatedQuestions,
      userAnswers: [],
      finalScore: 0,
      maxCombo: 0,
      accuracy: 0,
      averageResponseTime: 0,
      weakAreas: [],
      strongAreas: [],
    };
    setSession(newSession);

    // 最初の問題の時間を設定
    if (generatedQuestions.length > 0) {
      setTimeLeft(generatedQuestions[0].timeLimit);
      setResponseStartTime(Date.now());
    }
  };

  // タイマー処理
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0 && !showResult) {
      // 時間切れ
      handleAnswer("", true);
    }
  }, [isPlaying, timeLeft, showResult]);

  // 解答処理
  const handleAnswer = (answer: string, isTimeout: boolean = false) => {
    if (showResult || !isPlaying) return;

    const currentQuestion = questions[currentQuestionIndex];
    const responseTime = Date.now() - responseStartTime;
    const correct = answer === currentQuestion.correctAnswer;

    // 解答記録
    const answerRecord: TimeAttackAnswer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect: correct,
      responseTime,
      timeLeft,
    };

    setUserAnswers(prev => [...prev, answerRecord]);
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    // スコア計算
    if (correct) {
      const timeBonus = Math.max(0, timeLeft * 10);
      const comboBonus = combo * 5;
      const difficultyBonus = currentQuestion.difficulty === "hard" ? 50 : 
                             currentQuestion.difficulty === "normal" ? 30 : 20;
      const totalPoints = difficultyBonus + timeBonus + comboBonus;
      
      setScore(prev => prev + totalPoints);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
    } else {
      setCombo(0);
    }

    // 2秒後に次の問題または結果画面へ
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer("");
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeLeft(questions[nextIndex].timeLimit);
        setResponseStartTime(Date.now());
      } else {
        // ゲーム終了
        completeGame();
      }
    }, 2000);
  };

  // ゲーム完了処理
  const completeGame = () => {
    setIsPlaying(false);
    setIsCompleted(true);

    if (session) {
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      const accuracy = (correctAnswers / userAnswers.length) * 100;
      const averageResponseTime = userAnswers.reduce((sum, a) => sum + a.responseTime, 0) / userAnswers.length;

      const completedSession: TimeAttackSession = {
        ...session,
        endTime: Date.now(),
        userAnswers,
        finalScore: score,
        maxCombo,
        accuracy,
        averageResponseTime,
        weakAreas: [], // TODO: 分析して設定
        strongAreas: [], // TODO: 分析して設定
      };

      // XP獲得
      const baseXP = Math.floor(score / 10);
      const accuracyBonus = accuracy >= 80 ? 20 : accuracy >= 60 ? 10 : 0;
      const comboBonus = maxCombo >= 5 ? 15 : 0;
      const totalXP = baseXP + accuracyBonus + comboBonus;

      const levelManager = getLevelManager();
      levelManager.addXP(totalXP);
      saveLevelManager();

      // TODO: セッションデータを保存
      console.log("Session completed:", completedSession);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // ゲーム画面
  if (isPlaying || isCompleted) {
    if (isCompleted) {
      // 結果画面
      const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
      const accuracy = Math.round((correctAnswers / userAnswers.length) * 100);

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-2 border-orange-200">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-orange-800 flex items-center justify-center gap-3">
                  <Award className="w-8 h-8" />
                  {selectedMode.name} 完了！
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* スコア表示 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-gray-600">スコア</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-gray-600">正答率</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{maxCombo}</div>
                    <div className="text-sm text-gray-600">最大コンボ</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      +{Math.floor(score / 10) + (accuracy >= 80 ? 20 : accuracy >= 60 ? 10 : 0) + (maxCombo >= 5 ? 15 : 0)}
                    </div>
                    <div className="text-sm text-gray-600">獲得XP</div>
                  </div>
                </div>

                {/* 分析結果 */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      学習分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {accuracy >= 80 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">素晴らしい正答率です！この調子で継続しましょう。</span>
                        </div>
                      )}
                      {maxCombo >= 5 && (
                        <div className="flex items-center gap-2 text-purple-600">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm">高いコンボを達成しました！集中力が素晴らしいです。</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        💡 間違えた問題は事前学習や文法クイズで復習することをおすすめします。
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* アクションボタン */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSelectedMode(null);
                      setIsCompleted(false);
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    もう一度挑戦
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/learning/grammar/category")}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    文法クイズで復習
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
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

    // ゲーム中の画面
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* ゲーム情報 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {selectedMode.name}
              </Badge>
              <div className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">スコア</div>
                <div className="text-xl font-bold text-blue-600">{score}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">コンボ</div>
                <div className="text-xl font-bold text-purple-600">{combo}</div>
              </div>
            </div>
          </div>

          {/* タイマー */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">残り時間</span>
                <span className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {timeLeft}秒
                </span>
              </div>
              <Progress 
                value={(timeLeft / currentQuestion.timeLimit) * 100}
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* 問題 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {currentQuestion.question}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentQuestion.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      currentQuestion.difficulty === "hard" ? "border-red-500 text-red-700" :
                      currentQuestion.difficulty === "normal" ? "border-yellow-500 text-yellow-700" :
                      "border-green-500 text-green-700"
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentQuestion.options && (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showResult
                          ? option === currentQuestion.correctAnswer
                            ? "default"
                            : option === selectedAnswer
                            ? "destructive"
                            : "outline"
                          : "outline"
                      }
                      className="text-left justify-start p-4 h-auto"
                      onClick={() => !showResult && handleAnswer(option)}
                      disabled={showResult}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {showResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`flex items-center gap-2 mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✅' : '❌'}
                    <span className="font-medium">
                      {isCorrect ? '正解！' : '不正解'}
                    </span>
                  </div>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                  )}
                  {currentQuestion.relatedContent && (
                    <div className="mt-2 text-xs text-gray-500">
                      関連: {currentQuestion.relatedContent.grammarCategory || currentQuestion.relatedContent.vocabularyCard}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ゲーム開始画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setSelectedMode(null)}
            className="mb-4 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            モード選択に戻る
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedMode.name}
          </h1>
          <p className="text-gray-600">{selectedMode.description}</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <span className="text-4xl">{selectedMode.icon}</span>
              準備完了！
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedMode.questionCount}</div>
                <div className="text-sm text-gray-600">問題数</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedMode.timePerQuestion}</div>
                <div className="text-sm text-gray-600">秒/問</div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={startGame}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-xl px-12 py-6"
              >
                <Zap className="w-6 h-6 mr-2" />
                スタート！
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              💡 このモードでは、あなたの学習履歴に基づいて最適化された問題が出題されます
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
