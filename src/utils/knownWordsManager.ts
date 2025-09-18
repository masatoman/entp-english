import { VocabularyWord } from "../data/vocabulary";
import { KnownWord, KnownWordsData } from "../types";

const KNOWN_WORDS_KEY = "entp-known-words";

/**
 * 既知単語管理システム
 * ENTPの効率性重視に対応し、知っている単語を学習から除外
 */
export class KnownWordsManager {
  /**
   * 既知単語データを取得
   */
  static getKnownWordsData(): KnownWordsData {
    try {
      const data = localStorage.getItem(KNOWN_WORDS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          knownWords: parsed.knownWords || [],
          totalKnownCount: parsed.totalKnownCount || 0,
          categoryStats: parsed.categoryStats || {},
          levelStats: parsed.levelStats || {},
        };
      }
    } catch (error) {
      console.error("既知単語データの読み込みエラー:", error);
    }

    return {
      knownWords: [],
      totalKnownCount: 0,
      categoryStats: {},
      levelStats: {},
    };
  }

  /**
   * 単語を既知としてマーク
   */
  static markWordAsKnown(word: VocabularyWord): void {
    const data = this.getKnownWordsData();

    // 既に既知としてマークされているかチェック
    const existingIndex = data.knownWords.findIndex((kw) => kw.id === word.id);

    if (existingIndex === -1) {
      // 新しい既知単語として追加
      const knownWord: KnownWord = {
        id: word.id,
        word: word.word,
        meaning: word.meaning,
        category: word.category,
        level: word.level,
        markedAsKnownAt: new Date(),
        reviewCount: 0,
      };

      data.knownWords.push(knownWord);
      data.totalKnownCount = data.knownWords.length;

      // カテゴリ別統計更新
      data.categoryStats[word.category] =
        (data.categoryStats[word.category] || 0) + 1;
      data.levelStats[word.level] = (data.levelStats[word.level] || 0) + 1;

      this.saveKnownWordsData(data);

      console.log(`✅ 単語「${word.word}」を既知としてマークしました`);
    } else {
      console.log(`⚠️ 単語「${word.word}」は既に既知としてマークされています`);
    }
  }

  /**
   * 単語が既知かどうかチェック
   */
  static isWordKnown(wordId: string): boolean {
    const data = this.getKnownWordsData();
    return data.knownWords.some((kw) => kw.id === wordId);
  }

  /**
   * 既知単語を学習対象から除外
   */
  static filterUnknownWords(words: VocabularyWord[]): VocabularyWord[] {
    const data = this.getKnownWordsData();

    // IDベースと単語内容ベースの両方で除外判定
    const knownWordIds = new Set(data.knownWords.map((kw) => kw.id));
    const knownWordContents = new Set(data.knownWords.map((kw) => kw.word));

    const filteredWords = words.filter((word) => {
      // IDベースでの除外判定
      const isKnownById =
        knownWordIds.has(word.id) ||
        knownWordIds.has(word.id.toString()) ||
        knownWordIds.has(parseInt(word.id.toString()));

      // 単語内容ベースでの除外判定
      const isKnownByContent = knownWordContents.has(word.word);

      // どちらかで既知と判定されたら除外
      const isKnown = isKnownById || isKnownByContent;

      if (isKnown) {
        console.log(`🚫 既知単語「${word.word}」(ID: ${word.id})を除外`);
      }

      return !isKnown;
    });

    console.log(
      `📊 フィルタリング結果: ${words.length}個 → ${filteredWords.length}個（${
        words.length - filteredWords.length
      }個を除外）`
    );

    return filteredWords;
  }

  /**
   * 既知単語の統計情報を取得
   */
  static getKnownWordsStats(): {
    total: number;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
    recentlyMarked: KnownWord[];
  } {
    const data = this.getKnownWordsData();

    // 最近マークされた単語（過去7日間）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentlyMarked = data.knownWords.filter(
      (kw) => new Date(kw.markedAsKnownAt) > sevenDaysAgo
    );

    return {
      total: data.totalKnownCount,
      byCategory: data.categoryStats,
      byLevel: data.levelStats,
      recentlyMarked: recentlyMarked,
    };
  }

  /**
   * 既知単語をリセット（学習リセット機能）
   */
  static resetKnownWords(): void {
    const emptyData: KnownWordsData = {
      knownWords: [],
      totalKnownCount: 0,
      categoryStats: {},
      levelStats: {},
    };

    this.saveKnownWordsData(emptyData);
    console.log("🔄 既知単語データをリセットしました");
  }

  /**
   * 特定の単語を既知から削除（誤操作の修正用）
   */
  static unmarkWordAsKnown(wordId: string): boolean {
    const data = this.getKnownWordsData();
    const wordIndex = data.knownWords.findIndex((kw) => kw.id === wordId);

    if (wordIndex !== -1) {
      const removedWord = data.knownWords[wordIndex];
      data.knownWords.splice(wordIndex, 1);
      data.totalKnownCount = data.knownWords.length;

      // 統計更新
      data.categoryStats[removedWord.category] = Math.max(
        0,
        (data.categoryStats[removedWord.category] || 1) - 1
      );
      data.levelStats[removedWord.level] = Math.max(
        0,
        (data.levelStats[removedWord.level] || 1) - 1
      );

      this.saveKnownWordsData(data);
      console.log(`✅ 単語「${removedWord.word}」を既知から削除しました`);
      return true;
    }

    return false;
  }

  /**
   * データを保存
   */
  private static saveKnownWordsData(data: KnownWordsData): void {
    try {
      localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("既知単語データの保存エラー:", error);
    }
  }
}
