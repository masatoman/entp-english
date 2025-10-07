import { ArrowLeft, RefreshCw, Star, Volume2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useVocabularySession } from "../hooks/useVocabularySession";
import { baseColors } from "../styles/colors";
import { adrenalineManager } from "../utils/adrenalineManager";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { SoundManager } from "../utils/soundManager";
import { SpeechSynthesisManager } from "../utils/speechSynthesis";
import { calculateVocabularyXP } from "../utils/xpCalculator";
import AdrenalineEffects from "./AdrenalineEffects";
import TreasureBoxResultModal from "./TreasureBoxResultModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface VocabularyCardProps {
  difficulty?: "beginner" | "intermediate" | "advanced";
  category?: "all" | "toeic" | "daily" | "gacha-only" | "basic-only";
  isGachaMode?: boolean;
}

export default function VocabularyCard({
  difficulty: propDifficulty,
  category: propCategory,
  isGachaMode = false,
}: VocabularyCardProps = {}) {
  const navigate = useNavigate();
  const { difficulty: urlDifficulty, category: urlCategory } = useParams();

  // propsが渡された場合はpropsを優先、そうでなければURLパラメータを使用
  const actualDifficulty =
    propDifficulty ||
    (urlDifficulty as "beginner" | "intermediate" | "advanced") ||
    "intermediate";
  const actualCategory =
    propCategory ||
    (urlCategory as "all" | "toeic" | "daily" | "gacha-only" | "basic-only") ||
    "all";

  // ページトップにスクロール
  useScrollToTop();

  // カスタムフックでビジネスロジックを管理
  const {
    words,
    currentWord,
    session,
    showMeaning,
    isCompleted,
    progress,
    handleAnswer: sessionHandleAnswer,
    handleRestart,
    toggleMeaning,
  } = useVocabularySession(actualDifficulty, actualCategory, isGachaMode);

  // UI固有の状態
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTreasureBoxModal, setShowTreasureBoxModal] = useState(false);

  // 音声再生ハンドラー（UI専用）
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

  // 回答ハンドラー（音声フィードバック付き）
  const handleAnswerWithSound = (known: boolean) => {
    sessionHandleAnswer(known);
    if (known) {
      SoundManager.sounds.correct();
    } else {
      SoundManager.sounds.incorrect();
    }
  };

  if (!currentWord) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
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
        <div className="max-w-md mx-auto p-4 space-y-6 bg-white rounded-lg shadow-sm">
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
                データベースエラー
              </h2>
              <p className="text-red-700 mb-6">
                申し訳ございません。現在、語彙データの読み込みに問題が発生しています。
                しばらく時間をおいてから再度お試しください。
              </p>

              {/* アクションボタン */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  ページを再読み込み
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/home")}
                  className="w-full"
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

  if (isCompleted) {
    const accuracy =
      session.totalWords > 0
        ? Math.round((session.knownWords / session.totalWords) * 100)
        : 0;
    const xpEarned = calculateVocabularyXP(
      session.studiedWords.size,
      "intermediate"
    );

    // 宝箱の獲得数を取得
    const system = adrenalineManager.getSystem();
    const unopenedBoxes = system.treasureBoxes.filter((box) => !box.isOpened);
    const treasureBoxCount = unopenedBoxes.length;

    return (
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow-sm">
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

          {/* 結果サマリー */}
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

              {/* 宝箱獲得サマリー */}
              {treasureBoxCount > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-3xl">🎁</span>
                    <h3 className="text-xl font-bold text-yellow-800">
                      宝箱を獲得しました！
                    </h3>
                  </div>
                  <p className="text-lg text-yellow-700 mb-4">
                    未開封の宝箱:{" "}
                    <span className="font-bold">{treasureBoxCount}個</span>
                  </p>
                  <Button
                    onClick={() => setShowTreasureBoxModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                    size="lg"
                  >
                    🎁 宝箱をまとめて開封する 🎁
                  </Button>
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

          {/* 詳細な学習結果 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                📚 学習結果詳細
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Array.from(session.studiedWords).map((word, index) => {
                const wordData = words.find((w) => w.content === word);
                const isKnown = session.knownWords.has(word);

                return (
                  <div key={word} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-lg font-medium">
                        単語 {index + 1}
                      </span>
                      <Badge variant={isKnown ? "default" : "secondary"}>
                        {isKnown ? "理解済み" : "学習中"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-medium text-blue-800">
                          単語：
                        </span>
                        <p className="text-blue-700 mt-1 text-lg font-semibold">
                          {word}
                        </p>
                      </div>

                      {wordData && (
                        <>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="font-medium text-green-800">
                              意味：
                            </span>
                            <p className="text-green-700 mt-1">
                              {wordData.meaning}
                            </p>
                          </div>

                          {wordData.examples.length > 0 && (
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <span className="font-medium text-purple-800">
                                例文：
                              </span>
                              <p className="text-purple-700 mt-1 italic">
                                "{wordData.examples[0].sentence}"
                              </p>
                              <p className="text-purple-600 mt-1 text-sm">
                                {wordData.examples[0].translation}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {index < session.studiedWords.size - 1 && (
                      <div className="border-t border-gray-200 pt-4" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
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
      {/* アドレナリンエフェクト */}
      <AdrenalineEffects
        onEventTriggered={(event) => {
          console.log("🎆 語彙学習アドレナリンイベント:", event.message);
        }}
      />

      {/* 宝箱結果モーダル */}
      <TreasureBoxResultModal
        isOpen={showTreasureBoxModal}
        onClose={() => setShowTreasureBoxModal(false)}
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow-sm">
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
            onClick={() => handleAnswerWithSound(false)}
            className="h-14 text-base border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            まだ
          </Button>
          <Button
            size="lg"
            onClick={() => {
              // 既知単語としてマーク
              KnownWordsManager.markWordAsKnown(currentWord);
              handleAnswerWithSound(true);

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
