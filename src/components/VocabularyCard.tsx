import { ArrowLeft, RefreshCw, Star, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VocabularyWord, getVocabularyWords } from "../data/vocabulary";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { DataManager } from "../utils/dataManager";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { LearningAnalyzer } from "../utils/learningAnalyzer";
import { SoundManager } from "../utils/soundManager";
import { SpeechSynthesisManager } from "../utils/speechSynthesis";
import { VocabularyManager } from "../utils/vocabularyManager";
import { calculateVocabularyXP } from "../utils/xpCalculator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";

interface StudySession {
  totalWords: number;
  currentIndex: number;
  knownWords: number;
  unknownWords: number;
  studiedWords: Set<number>;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function VocabularyCard() {
  const navigate = useNavigate();
  const { difficulty: urlDifficulty, category: urlCategory } = useParams();
  const actualDifficulty =
    (urlDifficulty as "beginner" | "intermediate" | "advanced") ||
    "intermediate";
  const actualCategory = (urlCategory as "all" | "toeic" | "daily") || "all";

  // ページトップにスクロール
  useScrollToTop();

  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [session, setSession] = useState<StudySession>({
    totalWords: 0,
    currentIndex: 0,
    knownWords: 0,
    unknownWords: 0,
    studiedWords: new Set(),
  });
  const [showMeaning, setShowMeaning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // 統合語彙管理システムから単語を取得（ガチャカード含む）
    const allWords = VocabularyManager.getFilteredVocabularyWords(
      actualDifficulty,
      actualCategory
    );

    // 既知単語を除外
    const filteredWords = KnownWordsManager.filterUnknownWords(allWords);

    console.log("VocabularyCard - 統合語彙フィルタリング結果:", {
      actualDifficulty,
      actualCategory,
      totalWords: allWords.length,
      filteredWordsCount: filteredWords.length,
      excludedCount: allWords.length - filteredWords.length,
      gachaCards: allWords.filter((w) => w.id >= 10000).length,
      standardCards: allWords.filter((w) => w.id < 10000).length,
      filteredWords: filteredWords.slice(0, 5), // 最初の5個を表示
    });

    if (filteredWords.length === 0) {
      console.error("VocabularyCard - 該当する単語が見つかりません:", {
        actualDifficulty,
        actualCategory,
      });
      // エラー状態を設定
      setWords([]);
      setSession({
        totalWords: 0,
        currentIndex: 0,
        knownWords: 0,
        unknownWords: 0,
        studiedWords: new Set(),
      });
      return;
    }

    // 設定された問題数を使用
    const appSettings = DataManager.getAppSettings();
    const wordCount = appSettings.vocabularyQuestionCount;
    const shuffledWords = shuffleArray(filteredWords).slice(0, wordCount);
    setWords(shuffledWords);
    setSession({
      totalWords: shuffledWords.length,
      currentIndex: 0,
      knownWords: 0,
      unknownWords: 0,
      studiedWords: new Set(),
    });
  }, [actualDifficulty, actualCategory]);

  // 語彙学習セッション完了時の処理
  useEffect(() => {
    // 全ての単語を学習し終わった場合（1周完了）
    if (
      session.currentIndex > 0 &&
      session.currentIndex === session.totalWords &&
      !isCompleted
    ) {
      // セッション完了時の処理
      const xpEarned = calculateVocabularyXP(
        session.studiedWords.size,
        "intermediate"
      );

      // 学習セッションを記録
      DataManager.recordLearningSession({
        date: new Date().toISOString().split("T")[0],
        type: "vocabulary",
        score: Math.round(
          (session.knownWords / session.studiedWords.size) * 100
        ),
        totalQuestions: session.studiedWords.size,
        correctAnswers: session.knownWords,
        xpEarned: xpEarned,
        duration: 0, // 語彙学習の時間は記録していないので0
      });

      // 実績をチェック・更新
      DataManager.checkAndUpdateAchievements();

      // 学習セッションを記録（パーソナルインサイト用）
      LearningAnalyzer.recordSession({
        duration: 10, // 仮の学習時間（分）
        accuracy:
          session.knownWords / (session.knownWords + session.unknownWords),
        category: "vocabulary",
        difficulty: actualDifficulty,
        xpGained: xpEarned,
      });

      // 完了状態を設定
      setIsCompleted(true);
    }
  }, [session, isCompleted]);

  const currentWord = words[currentWordIndex];
  const progress =
    session.totalWords > 0
      ? (session.currentIndex / session.totalWords) * 100
      : 0;

  const handleAnswer = (known: boolean) => {
    if (!currentWord) return;

    // 「知ってる」を選択した場合、既知単語としてマーク
    if (known) {
      KnownWordsManager.markWordAsKnown(currentWord);
      console.log(
        `🎯 「${currentWord.word}」を既知単語に追加しました！今後の学習から除外されます。`
      );

      // 現在のセッションからも該当する単語を除外
      const updatedWords = words.filter((word) => word.id !== currentWord.id);
      setWords(updatedWords);

      // インデックスを調整（除外により配列が短くなるため）
      const newIndex = Math.min(currentWordIndex, updatedWords.length - 1);
      setCurrentWordIndex(Math.max(0, newIndex));

      // 残りの単語がない場合は学習完了
      if (updatedWords.length === 0) {
        console.log("🎊 すべての単語を学習完了！");
        handleSessionComplete();
        return;
      }
    }

    const newStudiedWords = new Set(session.studiedWords);
    newStudiedWords.add(currentWord.id);

    const newSession = {
      ...session,
      currentIndex: session.currentIndex + 1,
      knownWords: known ? session.knownWords + 1 : session.knownWords,
      unknownWords: !known ? session.unknownWords + 1 : session.unknownWords,
      studiedWords: newStudiedWords,
    };

    setSession(newSession);
    setShowMeaning(false);

    // 語彙学習の記録
    DataManager.recordVocabularyStudy(currentWord.id);

    // 「まだ」の場合のみ次の単語に移動
    if (!known) {
      // 次の単語に移動（最後の単語の場合は最初に戻る）
      if (currentWordIndex + 1 < words.length) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setCurrentWordIndex(0);
      }
    }
    // 「知ってる」の場合は、除外処理により既にインデックスが調整済み
  };

  const handleSessionComplete = () => {
    console.log("🎊 語彙学習セッション完了！");
    // 結果画面に遷移するか、ホームに戻る
    navigate("/");
  };

  const handleRestart = () => {
    const filteredWords = getVocabularyWords(actualDifficulty, actualCategory);
    const wordCount = 20; // 設定可能にする場合は、propsや設定から取得
    const shuffledWords = shuffleArray(filteredWords).slice(0, wordCount);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    setSession({
      totalWords: shuffledWords.length,
      currentIndex: 0,
      knownWords: 0,
      unknownWords: 0,
      studiedWords: new Set(),
    });
    setShowMeaning(false);
    setIsCompleted(false);
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
    SoundManager.sounds.click();
  };

  const handleSpeak = async () => {
    if (!currentWord || !SpeechSynthesisManager.isSupported()) return;

    try {
      setIsSpeaking(true);
      await SpeechSynthesisManager.speak(currentWord.word);
    } catch (error) {
      console.error("音声再生エラー:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>単語を読み込み中...</p>
        </div>
      </div>
    );
  }

  // 完了画面の表示
  // 単語が0個の場合のエラー画面
  if (words.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/learning/vocabulary/actualCategory")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">エラー</h1>
            <div className="w-10" />
          </div>

          {/* エラーメッセージ */}
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                単語が見つかりません
              </h2>
              <p className="text-red-700 mb-6">
                選択した条件（
                {actualDifficulty === "beginner"
                  ? "初級"
                  : actualDifficulty === "intermediate"
                  ? "中級"
                  : "上級"}{" "}
                +
                {actualCategory === "all"
                  ? "すべて"
                  : actualCategory === "toeic"
                  ? "TOEIC"
                  : actualCategory === "daily"
                  ? "日常"
                  : "学術"}
                ）に該当する単語がありません。
              </p>

              {/* アクションボタン */}
              <div className="space-y-3">
                <Button
                  onClick={() =>
                    navigate("/learning/vocabulary/actualCategory")
                  }
                  className="w-full"
                  size="lg"
                >
                  カテゴリ選択に戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const accuracy =
      session.totalWords > 0
        ? Math.round((session.knownWords / session.totalWords) * 100)
        : 0;
    const xpEarned = calculateVocabularyXP(
      session.studiedWords.size,
      "intermediate"
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/learning/vocabulary/actualCategory")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">学習完了！</h1>
            <div className="w-10" />
          </div>

          {/* 完了メッセージ */}
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                お疲れ様でした！
              </h2>
              <p className="text-green-700 mb-6">
                今日の単語学習が完了しました
              </p>

              {/* 統計表示 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-800">
                    {session.totalWords}
                  </div>
                  <div className="text-sm text-green-600">学習単語数</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-800">
                    {accuracy}%
                  </div>
                  <div className="text-sm text-green-600">理解度</div>
                </div>
              </div>

              {/* XP獲得表示 */}
              {xpEarned > 0 && (
                <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    +{xpEarned} XP 獲得！
                  </span>
                </div>
              )}

              {/* アクションボタン */}
              <div className="space-y-3">
                <Button onClick={handleRestart} className="w-full" size="lg">
                  もう一度学習する
                </Button>
                <Button
                  onClick={() =>
                    navigate("/learning/vocabulary/actualCategory")
                  }
                  variant="outline"
                  className="w-full"
                  size="lg"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/learning/vocabulary/actualCategory")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl">単語学習</h1>
            <div className="flex justify-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {actualDifficulty === "beginner"
                  ? "初級"
                  : actualDifficulty === "intermediate"
                  ? "中級"
                  : "上級"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {actualCategory === "all"
                  ? "すべて"
                  : actualCategory === "toeic"
                  ? "TOEIC"
                  : actualCategory === "daily"
                  ? "日常"
                  : "学術"}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={handleRestart} className="p-2">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">今日の進捗</span>
            <span className="text-sm">
              {session.currentIndex} / {session.totalWords}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Study Stats */}
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-lg text-emerald-600">{session.knownWords}</div>
            <div className="text-xs text-muted-foreground">知ってる</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-orange-600">
              {session.unknownWords}
            </div>
            <div className="text-xs text-muted-foreground">まだ</div>
          </div>
        </div>

        {/* Vocabulary Card */}
        <Card
          className="mx-4 shadow-lg border-0 bg-white cursor-pointer hover:shadow-xl transition-shadow"
          onClick={toggleMeaning}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {currentWord.partOfSpeech}
              </Badge>
              {SpeechSynthesisManager.isSupported() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak();
                  }}
                  disabled={isSpeaking}
                  className="p-2"
                >
                  <Volume2
                    className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`}
                  />
                </Button>
              )}
            </div>
            <div className="text-4xl mb-4 font-normal hover:text-blue-600 transition-colors">
              {currentWord.word}
            </div>
            {showMeaning && (
              <div className="text-2xl text-blue-600 font-medium mb-4">
                {currentWord.meaning}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-base italic text-muted-foreground mb-2">
                "{currentWord.example}"
              </p>
              {showMeaning && (
                <p className="text-sm text-muted-foreground">
                  {currentWord.exampleTranslation}
                </p>
              )}
            </div>

            {!showMeaning && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  カードをタップして意味を表示
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 px-4 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              handleAnswer(false);
              SoundManager.sounds.incorrect();
            }}
            className="h-14 text-base border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            まだ
          </Button>
          <Button
            size="lg"
            onClick={() => {
              // 既知単語としてマーク
              KnownWordsManager.markWordAsKnown(currentWord);
              handleAnswer(true);
              SoundManager.sounds.correct();

              // ENTPの即効性重視：視覚的フィードバック
              console.log(
                `🎯 「${currentWord.word}」を既知単語に追加しました！今後の学習から除外されます。`
              );
            }}
            className="h-14 text-base bg-emerald-600 hover:bg-emerald-700 relative overflow-hidden"
          >
            <span className="relative z-10">知ってる</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-20"></div>
          </Button>
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}
