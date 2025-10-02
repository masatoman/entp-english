import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getListeningQuestionsByDifficulty,
  getListeningQuestionsByPart,
  ListeningQuestion,
} from "../data/listeningQuestions";
import { useDataManager } from "../hooks/useDataManager";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { useTTS } from "../hooks/useTTS";
import { ListeningQuestionResult } from "../types";
import {
  AchievementNotification,
  listeningAchievementManager,
} from "../utils/listeningAchievementManager";
import { listeningProgressManager } from "../utils/listeningProgressManager";
import { AchievementNotificationContainer } from "./AchievementNotification";
import { ListeningRecommendations } from "./ListeningRecommendations";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface ListeningLearningProps {
  onComplete?: (score: number, totalQuestions: number) => void;
  difficulty?: "beginner" | "intermediate" | "advanced";
  part?: "part1" | "part2" | "part3" | "part4";
  questionCount?: number;
}

export default function ListeningLearning({
  onComplete,
  difficulty: propDifficulty,
  part: propPart,
  questionCount = 10,
}: ListeningLearningProps) {
  const params = useParams<{ difficulty: string; part?: string }>();
  const difficulty = (propDifficulty || params.difficulty || "beginner") as
    | "beginner"
    | "intermediate"
    | "advanced";
  const part = (propPart || params.part) as
    | "part1"
    | "part2"
    | "part3"
    | "part4"
    | undefined;

  console.log("ListeningLearning rendered with:", {
    difficulty,
    part,
    questionCount,
    params,
  });
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [_sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [achievementNotifications, setAchievementNotifications] = useState<
    AchievementNotification[]
  >([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { addXP } = useLevelSystem();
  const {} = useDataManager();
  const {
    speak,
    stop: stopTTS,
    isSupported: ttsSupported,
    isPlaying: ttsPlaying,
  } = useTTS();

  // 音声再生機能（TTS優先、フォールバックで既存音声）
  const handlePlayAudio = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      // TTSがサポートされている場合はTTSを使用
      if (ttsSupported && currentQuestion.transcript) {
        if (ttsPlaying) {
          stopTTS();
          setIsPlaying(false);
        } else {
          await speak(currentQuestion.transcript, {
            rate: 0.75, // TOEIC標準速度（ネイティブ発音を保つ）
            pitch: 1.0, // 自然なピッチでネイティブらしさを維持
            volume: 0.9, // 適度な音量
          });
          setIsPlaying(true);
          console.log(
            `🎤 TTS音声再生: ${currentQuestion.transcript.substring(0, 50)}...`
          );
        }
      }
      // フォールバック: 既存の音声ファイル
      else if (currentQuestion.audioUrl && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          setIsPlaying(true);
          console.log(`🎵 音声ファイル再生: ${currentQuestion.audioUrl}`);
        }
      } else {
        console.warn(
          "音声再生手段がありません（TTS未サポート、音声ファイルなし）"
        );
      }
    } catch (error) {
      console.error("音声再生エラー:", error);
    }
  };

  // 音声停止機能
  const handleStopAudio = () => {
    // TTS音声を停止
    if (ttsPlaying) {
      stopTTS();
    }

    // 既存音声ファイルを停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    console.log("🎤 音声停止");
  };

  // TTS状態の同期
  useEffect(() => {
    setIsPlaying(ttsPlaying);
  }, [ttsPlaying]);

  // 音声イベントハンドラー（既存音声ファイル用）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentQuestionIndex]);

  // 問題の初期化
  useEffect(() => {
    console.log("Initializing questions with:", {
      difficulty,
      part,
      questionCount,
    });
    let filteredQuestions: ListeningQuestion[] = [];

    if (part) {
      filteredQuestions = getListeningQuestionsByPart(part);
      console.log(
        `Found ${filteredQuestions.length} questions for part ${part}`
      );
    } else {
      filteredQuestions = getListeningQuestionsByDifficulty(difficulty);
      console.log(
        `Found ${filteredQuestions.length} questions for difficulty ${difficulty}`
      );
    }

    // ランダムに選択
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, questionCount);
    console.log(`Selected ${selectedQuestions.length} questions`);
    setQuestions(selectedQuestions);

    // リスニング学習セッションを開始
    const startSession = async () => {
      try {
        const userId = "user_001"; // 実際の実装では認証システムから取得
        const newSessionId = await listeningProgressManager.startSession(
          userId,
          part || "part1",
          difficulty,
          selectedQuestions.length
        );
        setSessionId(newSessionId);
        setSessionStartTime(Date.now());
        setQuestionStartTime(Date.now());
        console.log(`📊 リスニング学習セッション開始: ${newSessionId}`);
      } catch (error) {
        console.error("セッション開始エラー:", error);
      }
    };

    if (selectedQuestions.length > 0) {
      startSession();
    }
  }, [difficulty, part, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];

  // 問題が読み込まれていない場合の表示
  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">問題を読み込み中...</h2>
              <p className="text-muted-foreground">
                リスニング問題を準備しています。しばらくお待ちください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 回答選択
  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowExplanation(true);

    // 正解判定
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(10); // 正解で10XP
    } else {
      addXP(2); // 不正解でも参加で2XP
    }

    // 問題結果を記録
    if (sessionId) {
      try {
        const questionResult: ListeningQuestionResult = {
          questionId: currentQuestion.id,
          userAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect,
          timeSpent: Math.round((Date.now() - questionStartTime) / 1000),
          audioPlayed: isPlaying,
          transcriptViewed: showTranscript,
        };

        await listeningProgressManager.recordQuestionResult(
          sessionId,
          questionResult
        );
        console.log(
          `📝 問題結果記録: ${currentQuestion.id} - ${
            isCorrect ? "正解" : "不正解"
          }`
        );
      } catch (error) {
        console.error("問題結果記録エラー:", error);
      }
    }
  };

  // 次の問題へ
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
      setShowTranscript(false);
      setQuestionStartTime(Date.now()); // 次の問題の開始時間を設定
      handleStopAudio();
    } else {
      // 学習完了
      setIsCompleted(true);
      setSessionCompleted(true);

      // セッション完了を記録
      if (sessionId) {
        try {
          await listeningProgressManager.completeSession(sessionId);
          console.log(`✅ リスニング学習セッション完了: ${sessionId}`);

          // アチーブメントをチェック
          const userId = "user_001"; // 実際の実装では認証システムから取得
          const notifications =
            await listeningAchievementManager.checkAchievementsOnSessionComplete(
              userId,
              sessionId
            );

          if (notifications.length > 0) {
            setAchievementNotifications(notifications);
            console.log(`🏆 アチーブメント達成: ${notifications.length}件`);
          }

          // 推奨語彙を表示
          setShowRecommendations(true);
        } catch (error) {
          console.error("セッション完了記録エラー:", error);
        }
      }

      onComplete?.(score, questions.length);
    }
  };

  // 前の問題へ
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
      setShowTranscript(false);
      setQuestionStartTime(Date.now()); // 前の問題の開始時間を設定
      handleStopAudio();
    }
  };

  // リセット
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setShowTranscript(false);
    setScore(0);
    setIsCompleted(false);
    handleStopAudio();
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Headphones className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              リスニング学習完了！
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {score} / {questions.length}
              </div>
              <div className="text-lg text-muted-foreground mb-4">
                正解率: {percentage}%
              </div>
              <Progress value={percentage} className="w-full mb-4" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-green-700">正解</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {questions.length - score}
                </div>
                <div className="text-sm text-red-700">不正解</div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                もう一度
              </Button>
              <Button onClick={() => window.history.back()}>
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // アチーブメント通知を削除
  const handleRemoveNotification = (notificationId: string) => {
    setAchievementNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                リスニング学習
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {currentQuestion.part.toUpperCase()}
                </Badge>
                <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
                <Badge variant="outline">Level {currentQuestion.level}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                問題 {currentQuestionIndex + 1} / {questions.length}
              </div>
              <Progress
                value={((currentQuestionIndex + 1) / questions.length) * 100}
                className="w-32 mt-1"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 音声コントロール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            音声を聞く
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={isPlaying ? handleStopAudio : handlePlayAudio}
              size="lg"
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isPlaying ? "停止" : "再生"}
            </Button>

            <Button
              onClick={() => setShowTranscript(!showTranscript)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              トランスクリプト
            </Button>
          </div>

          {showTranscript && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">スクリプト:</h4>
              <p className="text-sm leading-relaxed">
                {currentQuestion.transcript}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 問題 */}
      <Card>
        <CardHeader>
          <CardTitle>問題</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.choices.map((choice, index) => {
              const isSelected = selectedAnswer === choice;
              const isCorrect = choice === currentQuestion.correctAnswer;
              const isWrong = isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isAnswered
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-800"
                        : isWrong
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isAnswered
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : isWrong
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-gray-600"
                          : isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{choice}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                    {isAnswered && isWrong && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 解説 */}
      {showExplanation && (
        <Card>
          <CardHeader>
            <CardTitle>解説</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">正解:</h4>
              <p className="p-3 bg-green-50 border border-green-200 rounded-lg">
                {currentQuestion.correctAnswer}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">解説:</h4>
              <p className="text-sm leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>

            {currentQuestion.vocabulary &&
              currentQuestion.vocabulary.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">重要語彙:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.vocabulary.map((word, index) => (
                      <Badge key={index} variant="secondary">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {currentQuestion.grammar && currentQuestion.grammar.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">文法ポイント:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.grammar.map((grammar, index) => (
                    <Badge key={index} variant="outline">
                      {grammar}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ナビゲーション */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              前の問題
            </Button>

            <div className="text-sm text-muted-foreground">
              スコア: {score} / {currentQuestionIndex + 1}
            </div>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2"
            >
              次の問題
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 音声要素 */}
      <audio
        ref={audioRef}
        src={currentQuestion?.audioUrl}
        preload="metadata"
        onError={(e) => {
          console.error("音声ファイルの読み込みエラー:", e);
        }}
      />

      {/* アチーブメント通知 */}
      <AchievementNotificationContainer
        notifications={achievementNotifications}
        onRemoveNotification={handleRemoveNotification}
      />

      {/* 推奨語彙表示 */}
      {showRecommendations && sessionCompleted && (
        <div className="mt-6">
          <ListeningRecommendations
            userId="user_001"
            sessionScore={score}
            sessionPart={part || "part1"}
            onStartVocabularyLearning={() => {
              setShowRecommendations(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
