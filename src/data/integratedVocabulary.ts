import { WordCard } from "../types/gacha";

// 既存の語彙データをインポート
import { additionalToeicCards } from "./additionalToeicCards";

// 新しく追加した語彙データをインポート
import { expandedBasicVocabulary } from "./expandedBasicVocabulary";
import { expandedBasicVocabulary2 } from "./expandedBasicVocabulary2";
import { intermediateBusinessVocabulary } from "./intermediateBusinessVocabulary";

/**
 * 統合された語彙データベース
 * 既存の115語 + 新規追加の85語 = 合計200語（Week 1の目標）
 *
 * 構成:
 * - 既存語彙: ID 1-115 (toeicWordCards + additionalToeicCards)
 * - 基本語彙拡張: ID 116-150 (expandedBasicVocabulary)
 * - 基本語彙拡張2: ID 151-170 (expandedBasicVocabulary2)
 * - 中級ビジネス語彙: ID 171-200 (intermediateBusinessVocabulary)
 */
// 既存のtoeicGachaCards.tsから直接インポートする代わりに、ここで定義
// 循環参照を避けるため
const originalToeicWordCards: WordCard[] = [
  // 既存の語彙データは後で追加
];

export const integratedVocabulary: WordCard[] = [
  // 既存語彙 (ID 1-115)
  ...originalToeicWordCards,
  ...additionalToeicCards,

  // 新規追加語彙 (ID 116-200)
  ...expandedBasicVocabulary,
  ...expandedBasicVocabulary2,
  ...intermediateBusinessVocabulary,
];

/**
 * 語彙データベースの統計情報
 */
export const vocabularyDatabaseStats = {
  // 基本統計
  total: integratedVocabulary.length,
  original: toeicWordCards.length + additionalToeicCards.length,
  newlyAdded:
    expandedBasicVocabulary.length +
    expandedBasicVocabulary2.length +
    intermediateBusinessVocabulary.length,

  // レアリティ分布
  rarity: {
    common: integratedVocabulary.filter((card) => card.rarity === "common")
      .length,
    uncommon: integratedVocabulary.filter((card) => card.rarity === "uncommon")
      .length,
    rare: integratedVocabulary.filter((card) => card.rarity === "rare").length,
    epic: integratedVocabulary.filter((card) => card.rarity === "epic").length,
    legendary: integratedVocabulary.filter(
      (card) => card.rarity === "legendary"
    ).length,
  },

  // TOEICスコア帯分布
  scoreBand: {
    "400-500": integratedVocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === "400-500"
    ).length,
    "500-600": integratedVocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === "500-600"
    ).length,
    "600-700": integratedVocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === "600-700"
    ).length,
    "700-800": integratedVocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === "700-800"
    ).length,
    "800+": integratedVocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === "800+"
    ).length,
  },

  // TOEICパート別分布
  parts: {
    Part1: integratedVocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes("Part1")
    ).length,
    Part2: integratedVocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes("Part2")
    ).length,
    Part3: integratedVocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes("Part3")
    ).length,
    Part4: integratedVocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes("Part4")
    ).length,
    Part7: integratedVocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes("Part7")
    ).length,
  },

  // 頻度分布
  frequency: {
    very_high: integratedVocabulary.filter(
      (card) => card.toeicSpecific?.frequency === "very_high"
    ).length,
    high: integratedVocabulary.filter(
      (card) => card.toeicSpecific?.frequency === "high"
    ).length,
    medium: integratedVocabulary.filter(
      (card) => card.toeicSpecific?.frequency === "medium"
    ).length,
    low: integratedVocabulary.filter(
      (card) => card.toeicSpecific?.frequency === "low"
    ).length,
  },
};

/**
 * 語彙データベースの検索・フィルタリング関数
 */
export class VocabularyDatabase {
  private vocabulary: WordCard[];

  constructor(vocabulary: WordCard[] = integratedVocabulary) {
    this.vocabulary = vocabulary;
  }

  /**
   * IDで語彙を検索
   */
  findById(id: number): WordCard | undefined {
    return this.vocabulary.find((card) => card.id === id);
  }

  /**
   * 単語で検索
   */
  findByWord(word: string): WordCard | undefined {
    return this.vocabulary.find(
      (card) => card.word.toLowerCase() === word.toLowerCase()
    );
  }

  /**
   * レアリティでフィルタリング
   */
  filterByRarity(rarity: string): WordCard[] {
    return this.vocabulary.filter((card) => card.rarity === rarity);
  }

  /**
   * TOEICスコア帯でフィルタリング
   */
  filterByScoreBand(scoreBand: string): WordCard[] {
    return this.vocabulary.filter(
      (card) => card.toeicSpecific?.scoreBand === scoreBand
    );
  }

  /**
   * TOEICパートでフィルタリング
   */
  filterByPart(part: string): WordCard[] {
    return this.vocabulary.filter((card) =>
      card.toeicSpecific?.parts?.includes(part)
    );
  }

  /**
   * 頻度でフィルタリング
   */
  filterByFrequency(frequency: string): WordCard[] {
    return this.vocabulary.filter(
      (card) => card.toeicSpecific?.frequency === frequency
    );
  }

  /**
   * ビジネスコンテキストでフィルタリング
   */
  filterByBusinessContext(context: string): WordCard[] {
    return this.vocabulary.filter((card) =>
      card.toeicSpecific?.businessContext?.includes(context)
    );
  }

  /**
   * ランダムな語彙を取得
   */
  getRandom(count: number = 1): WordCard[] {
    const shuffled = [...this.vocabulary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 特定の条件でランダムな語彙を取得
   */
  getRandomWithFilter(
    filter: (card: WordCard) => boolean,
    count: number = 1
  ): WordCard[] {
    const filtered = this.vocabulary.filter(filter);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    return vocabularyDatabaseStats;
  }

  /**
   * 全語彙を取得
   */
  getAll(): WordCard[] {
    return [...this.vocabulary];
  }
}

/**
 * デフォルトの語彙データベースインスタンス
 */
export const vocabularyDB = new VocabularyDatabase();

/**
 * ガチャシステム用の語彙データ（既存システムとの互換性）
 * 注意: 循環参照を避けるため、このファイルでは定義しない
 */
// export const toeicWordCards = integratedVocabulary;
