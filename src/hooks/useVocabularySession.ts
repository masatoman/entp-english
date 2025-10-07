import { useEffect, useState } from "react";
import {
  calculateAdrenalineXP,
  triggerAdrenalineEvent,
} from "../components/AdrenalineEffects";
import { VocabularyWord } from "../data/vocabulary";
import { adrenalineManager } from "../utils/adrenalineManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { LearningAnalyzer } from "../utils/learningAnalyzer";
import { getLevelManager } from "../utils/levelManager";
import { SoundManager } from "../utils/soundManager";
import { VocabularyManager } from "../utils/vocabularyManager";
import { calculateVocabularyXP } from "../utils/xpCalculator";

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

export function useVocabularySession(
  difficulty: "beginner" | "intermediate" | "advanced",
  category: "all" | "toeic" | "daily" | "gacha-only" | "basic-only",
  isGachaMode = false
) {
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

  // 単語データの取得とフィルタリング
  useEffect(() => {
    let allWords: VocabularyWord[] = [];

    // モード別にデータを取得
    if (category === "gacha-only") {
      // ガチャカード専用モード
      allWords = VocabularyManager.getGachaVocabularyWords();

      // ガチャカードのレベルフィルタリング（必要に応じて）
      if (difficulty !== "intermediate") {
        allWords = allWords.filter((word) => word.level === difficulty);
      }

      console.log("useVocabularySession - ガチャカード専用モード:", {
        difficulty,
        totalGachaCards: allWords.length,
      });
    } else if (category === "basic-only") {
      // 基本単語専用モード
      allWords = VocabularyManager.getStandardVocabularyWords();

      // 難易度フィルタリング
      allWords = allWords.filter((word) => word.level === difficulty);

      console.log("useVocabularySession - 基本単語専用モード:", {
        difficulty,
        totalBasicCards: allWords.length,
      });
    } else {
      // 従来の統合モード（後方互換性）
      allWords = VocabularyManager.getFilteredVocabularyWords(
        difficulty,
        category
      );

      console.log("useVocabularySession - 統合モード（後方互換性）:", {
        difficulty,
        category,
        totalWords: allWords.length,
      });
    }

    // 既知単語を除外
    const filteredWords = KnownWordsManager.filterUnknownWords(allWords);

    console.log("useVocabularySession - フィルタリング結果:", {
      difficulty,
      category,
      totalWords: allWords.length,
      filteredWordsCount: filteredWords.length,
      excludedCount: allWords.length - filteredWords.length,
      isGachaMode,
      mode:
        category === "gacha-only"
          ? "ガチャ専用"
          : category === "basic-only"
          ? "基本単語専用"
          : "統合",
    });

    // フィルタされた単語が0個の場合の処理を改善
    if (filteredWords.length === 0) {
      console.warn(
        "useVocabularySession - 学習可能な単語が見つかりません。全ての単語を含めて学習します:",
        {
          difficulty,
          category,
          isGachaMode,
          totalWords: allWords.length,
        }
      );

      // 全ての単語を使用する（既知単語も含む）
      const fallbackWords = allWords;

      if (fallbackWords.length === 0) {
        console.error(
          "useVocabularySession - データベースに単語が存在しません:",
          {
            difficulty,
            category,
            isGachaMode,
          }
        );
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

      // フォールバック単語を使用（既知単語も含む）
      const appSettings = DataManager.getAppSettings();
      const wordCount = appSettings.vocabularyQuestionCount;
      const shuffledWords = shuffleArray(fallbackWords).slice(0, wordCount);
      setWords(shuffledWords);
      setSession({
        totalWords: shuffledWords.length,
        currentIndex: 0,
        knownWords: 0,
        unknownWords: 0,
        studiedWords: new Set(),
      });

      // ユーザーに通知（既知単語を含めて学習することを伝える）
      setTimeout(() => {
        alert(
          "🎉 おめでとうございます！\n\n選択した条件の新しい単語を全て学習済みです。\n復習として、既知の単語も含めて学習を続けます。\n\n引き続き頑張りましょう！"
        );
      }, 500);

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
  }, [difficulty, category, isGachaMode]);

  // セッション完了時の処理
  useEffect(() => {
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
        duration: 0,
      });

      // 実績をチェック・更新
      DataManager.checkAndUpdateAchievements();

      // 学習セッションを記録（パーソナルインサイト用）
      LearningAnalyzer.recordSession({
        duration: 10,
        accuracy:
          session.knownWords / (session.knownWords + session.unknownWords),
        category: "vocabulary",
        difficulty: difficulty,
        xpGained: xpEarned,
      });

      // 完了状態を設定
      setIsCompleted(true);
    }
  }, [session, isCompleted, difficulty]);

  const currentWord = words[currentWordIndex];
  const progress =
    session.totalWords > 0
      ? (session.currentIndex / session.totalWords) * 100
      : 0;

  const handleAnswer = (known: boolean) => {
    if (!currentWord) return;

    // スタミナ消費（単語を学習するたびに1消費）
    const levelManager = getLevelManager();
    if (levelManager.consumeStar()) {
      console.log("⭐ スタミナを1消費しました");
    } else {
      console.log("⭐ スタミナが不足しています");
    }

    // アドレナリンシステム処理
    const isCritical = Math.random() < 0.08; // 語彙学習では8%でクリティカル
    const events = triggerAdrenalineEvent(known, isCritical);

    // アドレナリン効果を適用したXP計算
    const baseXP = known ? 5 : 2; // 知ってる: 5XP, まだ: 2XP
    const { finalXP, multiplier, breakdown } = calculateAdrenalineXP(
      baseXP,
      isCritical
    );

    console.log("🚀 語彙学習アドレナリン効果:", {
      word: currentWord.word,
      known,
      baseXP,
      finalXP,
      multiplier,
      breakdown,
      events: events.map((e) => e.message),
    });

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
        // 完了フラグをセット
        setIsCompleted(true);
        return;
      }
    }

    // 宝箱獲得判定（知ってる場合のみ、15%の確率）
    if (known && Math.random() < 0.15) {
      const box = adrenalineManager.earnTreasureBox("normal");
      console.log("🎁 語彙学習で宝箱獲得:", box);

      // 宝箱獲得イベントを発火
      window.dispatchEvent(
        new CustomEvent("treasureBoxEarned", { detail: box })
      );
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

    // デイリークエスト進捗更新（「知ってる」の場合のみ）
    if (known) {
      dailyQuestManager.recordVocabularyLearning(1);
    }

    // 「まだ」の場合のみ次の単語に移動
    if (!known) {
      // 次の単語に移動（最後の単語の場合は最初に戻る）
      if (currentWordIndex + 1 < words.length) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setCurrentWordIndex(0);
      }
    }
  };

  const handleRestart = () => {
    const appSettings = DataManager.getAppSettings();
    const wordCount = appSettings.vocabularyQuestionCount;

    let allWords: VocabularyWord[] = [];

    if (category === "gacha-only") {
      allWords = VocabularyManager.getGachaVocabularyWords();
      if (difficulty !== "intermediate") {
        allWords = allWords.filter((word) => word.level === difficulty);
      }
    } else if (category === "basic-only") {
      allWords = VocabularyManager.getStandardVocabularyWords();
      allWords = allWords.filter((word) => word.level === difficulty);
    } else {
      allWords = VocabularyManager.getFilteredVocabularyWords(
        difficulty,
        category
      );
    }

    const filteredWords = KnownWordsManager.filterUnknownWords(allWords);
    const shuffledWords = shuffleArray(
      filteredWords.length > 0 ? filteredWords : allWords
    ).slice(0, wordCount);

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

  return {
    // State
    words,
    currentWord,
    currentWordIndex,
    session,
    showMeaning,
    isCompleted,
    progress,

    // Actions
    handleAnswer,
    handleRestart,
    toggleMeaning,
  };
}
