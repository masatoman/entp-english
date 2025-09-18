import { VocabularyWord, vocabularyWords } from "../data/vocabulary";
import { WordCard } from "../types/gacha";
import { DataManager } from "./dataManager";
import { GachaSystem } from "./gachaSystem";

/**
 * 統合語彙管理システム
 * 通常の語彙データとガチャカードを統合して管理
 */
export class VocabularyManager {
  /**
   * ガチャカードをVocabularyWord形式に変換
   */
  static convertGachaCardToVocabularyWord(card: WordCard): VocabularyWord {
    return {
      id: card.id + 10000, // ガチャカード用のID範囲（10000以上）
      word: card.word,
      meaning: card.meaning,
      partOfSpeech: card.partOfSpeech,
      example: card.examples[0]?.sentence || `Example with ${card.word}`,
      exampleTranslation: card.examples[0]?.translation || `${card.word}の例文`,
      level: this.mapRarityToLevel(card.rarity),
      category: "toeic", // ガチャカードは全てTOEICカテゴリ
    };
  }

  /**
   * レアリティをレベルにマッピング
   */
  private static mapRarityToLevel(
    rarity: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (rarity) {
      case "common":
        return "beginner";
      case "uncommon":
        return "intermediate";
      case "rare":
      case "epic":
      case "legendary":
        return "advanced";
      default:
        return "intermediate";
    }
  }

  /**
   * ガチャで獲得済みのカードを取得
   */
  static getOwnedGachaCards(): WordCard[] {
    try {
      const gachaData = GachaSystem.getUserGachaData();
      return gachaData.ownedCards || [];
    } catch (error) {
      console.error("Error getting owned gacha cards:", error);
      return [];
    }
  }

  /**
   * ガチャカードをVocabularyWord形式で取得
   */
  static getGachaVocabularyWords(): VocabularyWord[] {
    const ownedCards = this.getOwnedGachaCards();
    return ownedCards.map((card) => this.convertGachaCardToVocabularyWord(card));
  }

  /**
   * 通常の語彙データを取得（従来のvocabulary.tsから）
   */
  static getStandardVocabularyWords(): VocabularyWord[] {
    try {
      return vocabularyWords;
    } catch (error) {
      console.error("Error getting standard vocabulary words:", error);
      return [];
    }
  }

  /**
   * 統合された語彙データを取得（通常 + ガチャ）
   */
  static getAllVocabularyWords(): VocabularyWord[] {
    const standardWords = this.getStandardVocabularyWords();
    const gachaWords = this.getGachaVocabularyWords();
    
    console.log("VocabularyManager.getAllVocabularyWords:", {
      standardWords: standardWords.length,
      gachaWords: gachaWords.length,
      gachaWordsPreview: gachaWords.slice(0, 3),
    });

    return [...standardWords, ...gachaWords];
  }

  /**
   * レベルとカテゴリでフィルタリングした語彙を取得
   */
  static getFilteredVocabularyWords(
    level?: "beginner" | "intermediate" | "advanced",
    category?: "all" | "toeic" | "daily"
  ): VocabularyWord[] {
    let allWords = this.getAllVocabularyWords();

    // レベルでフィルタリング
    if (level) {
      allWords = allWords.filter((word) => word.level === level);
    }

    // カテゴリでフィルタリング
    if (category && category !== "all") {
      allWords = allWords.filter((word) => word.category === category);
    }

    console.log("VocabularyManager.getFilteredVocabularyWords:", {
      level,
      category,
      totalWords: allWords.length,
      wordsPreview: allWords.slice(0, 5),
    });

    return allWords;
  }

  /**
   * TOEICカテゴリの語彙を取得（ガチャカード含む）
   */
  static getToeicVocabularyWords(
    level?: "beginner" | "intermediate" | "advanced"
  ): VocabularyWord[] {
    return this.getFilteredVocabularyWords(level, "toeic");
  }

  /**
   * ガチャカードの統計情報を取得
   */
  static getGachaVocabularyStats(): {
    totalCards: number;
    byLevel: Record<string, number>;
    byRarity: Record<string, number>;
  } {
    const gachaWords = this.getGachaVocabularyWords();
    const ownedCards = this.getOwnedGachaCards();

    const byLevel = gachaWords.reduce((acc, word) => {
      acc[word.level] = (acc[word.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRarity = ownedCards.reduce((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards: gachaWords.length,
      byLevel,
      byRarity,
    };
  }

  /**
   * 語彙学習で使用可能なカード数を取得
   */
  static getAvailableVocabularyCount(
    level?: "beginner" | "intermediate" | "advanced",
    category?: "all" | "toeic" | "daily"
  ): {
    total: number;
    fromGacha: number;
    fromStandard: number;
  } {
    const allWords = this.getFilteredVocabularyWords(level, category);
    const gachaWords = allWords.filter((word) => word.id >= 10000);
    const standardWords = allWords.filter((word) => word.id < 10000);

    return {
      total: allWords.length,
      fromGacha: gachaWords.length,
      fromStandard: standardWords.length,
    };
  }
}
