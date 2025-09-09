import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, RefreshCw, Star, Volume2 } from "lucide-react";
import { VocabularyWord, getVocabularyWords } from "../data/vocabulary";
import { DataManager } from "../utils/dataManager";
import { calculateVocabularyXP } from "../utils/xpCalculator";
import { speakEnglishWord, isSpeechSynthesisSupported } from "../utils/speechSynthesis";

interface VocabularyCardProps {
  onBack: () => void;
}

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

export function VocabularyCard({ onBack }: VocabularyCardProps) {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [session, setSession] = useState<StudySession>({
    totalWords: 0,
    currentIndex: 0,
    knownWords: 0,
    unknownWords: 0,
    studiedWords: new Set()
  });
  const [showMeaning, setShowMeaning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // 今日の学習用の単語をランダムに選択（デフォルト20個）
    const allWords = getVocabularyWords();
    const wordCount = 20; // 設定可能にする場合は、propsや設定から取得
    const shuffledWords = shuffleArray(allWords).slice(0, wordCount);
    setWords(shuffledWords);
    setSession({
      totalWords: shuffledWords.length,
      currentIndex: 0,
      knownWords: 0,
      unknownWords: 0,
      studiedWords: new Set()
    });
  }, []);

  // 語彙学習セッション完了時の処理
  useEffect(() => {
    // 全ての単語を学習し終わった場合（1周完了）
    if (session.currentIndex > 0 && session.currentIndex === session.totalWords && !isCompleted) {
      // セッション完了時の処理
      const xpEarned = calculateVocabularyXP(session.studiedWords.size, 'intermediate');
      
      // 学習セッションを記録
      DataManager.recordLearningSession({
        date: new Date().toISOString().split('T')[0],
        type: 'vocabulary',
        score: Math.round((session.knownWords / session.studiedWords.size) * 100),
        totalQuestions: session.studiedWords.size,
        correctAnswers: session.knownWords,
        xpEarned: xpEarned,
        duration: 0, // 語彙学習の時間は記録していないので0
      });
      
      // 実績をチェック・更新
      DataManager.checkAndUpdateAchievements();
      
      // 完了状態を設定
      setIsCompleted(true);
    }
  }, [session, isCompleted]);

  const currentWord = words[currentWordIndex];
  const progress = session.totalWords > 0 ? ((session.currentIndex) / session.totalWords) * 100 : 0;

  const handleAnswer = (known: boolean) => {
    if (!currentWord) return;

    const newStudiedWords = new Set(session.studiedWords);
    newStudiedWords.add(currentWord.id);

    const newSession = {
      ...session,
      currentIndex: session.currentIndex + 1,
      knownWords: known ? session.knownWords + 1 : session.knownWords,
      unknownWords: !known ? session.unknownWords + 1 : session.unknownWords,
      studiedWords: newStudiedWords
    };

    setSession(newSession);
    setShowMeaning(false);

    // 語彙学習の記録
    DataManager.recordVocabularyStudy(currentWord.id);

    // 次の単語に移動（最後の単語の場合は最初に戻る）
    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  const handleRestart = () => {
    const allWords = getVocabularyWords();
    const wordCount = 20; // 設定可能にする場合は、propsや設定から取得
    const shuffledWords = shuffleArray(allWords).slice(0, wordCount);
    setWords(shuffledWords);
    setCurrentWordIndex(0);
    setSession({
      totalWords: shuffledWords.length,
      currentIndex: 0,
      knownWords: 0,
      unknownWords: 0,
      studiedWords: new Set()
    });
    setShowMeaning(false);
    setIsCompleted(false);
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  const handleSpeak = async () => {
    if (!currentWord || !isSpeechSynthesisSupported()) return;
    
    try {
      setIsSpeaking(true);
      await speakEnglishWord(currentWord.word);
    } catch (error) {
      console.error('音声再生エラー:', error);
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
  if (isCompleted) {
    const accuracy = session.totalWords > 0 ? Math.round((session.knownWords / session.totalWords) * 100) : 0;
    const xpEarned = calculateVocabularyXP(session.studiedWords.size, 'intermediate');
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pt-8">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">学習完了！</h1>
            <div className="w-10" />
          </div>

          {/* 完了メッセージ */}
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">お疲れ様でした！</h2>
              <p className="text-green-700 mb-6">今日の単語学習が完了しました</p>
              
              {/* 統計表示 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-800">{session.totalWords}</div>
                  <div className="text-sm text-green-600">学習単語数</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-800">{accuracy}%</div>
                  <div className="text-sm text-green-600">理解度</div>
                </div>
              </div>

              {/* XP獲得表示 */}
              {xpEarned > 0 && (
                <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">+{xpEarned} XP 獲得！</span>
                </div>
              )}

              {/* アクションボタン */}
              <div className="space-y-3">
                <Button onClick={handleRestart} className="w-full" size="lg">
                  もう一度学習する
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full" size="lg">
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
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">単語学習</h1>
          <Button variant="ghost" onClick={handleRestart} className="p-2">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">今日の進捗</span>
            <span className="text-sm">{session.currentIndex} / {session.totalWords}</span>
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
            <div className="text-lg text-orange-600">{session.unknownWords}</div>
            <div className="text-xs text-muted-foreground">まだ</div>
          </div>
        </div>

        {/* Vocabulary Card */}
        <Card className="mx-4 shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant="outline" 
                className="text-xs"
              >
                {currentWord.partOfSpeech}
              </Badge>
              {isSpeechSynthesisSupported() && (
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
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                </Button>
              )}
            </div>
            <div 
              className="text-4xl mb-2 font-normal cursor-pointer hover:text-blue-600 transition-colors"
              onClick={toggleMeaning}
            >
              {currentWord.word}
            </div>
            {showMeaning && (
              <div className="text-xl text-muted-foreground">
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
                  タップして意味を表示
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
            onClick={() => handleAnswer(false)}
            className="h-14 text-base border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            まだ
          </Button>
          <Button
            size="lg"
            onClick={() => handleAnswer(true)}
            className="h-14 text-base bg-emerald-600 hover:bg-emerald-700"
          >
            知ってる
          </Button>
        </div>

        {/* Hint */}
        <div className="text-center text-sm text-muted-foreground px-4">
          親指で押しやすい位置に配置されています
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}