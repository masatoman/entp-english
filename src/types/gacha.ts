// TOEIC特化のガチャカード型定義
export interface WordCard {
  id: number;
  word: string;
  japanese: string;
  meaning: string;
  partOfSpeech: string;
  phonetic: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";

  examples: {
    sentence: string;
    translation: string;
    situation: string;
  }[];

  combinations: {
    type: "idiom" | "phrasal_verb" | "collocation" | "slang" | "formal";
    expression: string;
    meaning: string;
    example: string;
    translation: string;
  }[];

  commonUsages: {
    pattern: string;
    explanation: string;
    example: string;
  }[];

  toeicSpecific: {
    parts: (
      | "Part1"
      | "Part2"
      | "Part3"
      | "Part4"
      | "Part5"
      | "Part6"
      | "Part7"
    )[];
    frequency: "very_high" | "high" | "medium" | "low";
    scoreBand: "400-500" | "500-600" | "600-700" | "700-800" | "800+";
    synonyms: string[];
    businessContext: string;
  };
}

export interface GachaPack {
  id: string;
  name: string;
  description: string;
  theme: "part1_2" | "part3_4" | "part5_6" | "part7" | "mixed";
  targetScore: "400-500" | "500-600" | "600-700" | "700-800" | "800+";
  cards: WordCard[];
  rarity: "normal" | "premium" | "legendary";
  cost: number;
}

export interface UserGachaData {
  ownedCards: WordCard[];
  totalPacks: number;
  dailyPacksUsed: number; // 互換性のため残す
  lastPackDate: string; // 互換性のため残す
  availablePacks?: number; // 利用可能なパック数（最大2）
  lastPackOpenTime?: number; // 最後にパックを開封した時間
  newlyAcquiredCards?: string[]; // 新規取得したカードのIDリスト（最新の開封結果）
  collection: {
    totalCards: number;
    uniqueCards: number;
    rarityStats: Record<string, number>;
  };
}
