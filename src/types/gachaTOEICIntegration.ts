// ガチャカードとTOEIC模擬テストの統合型定義
import { WordCard } from "./gacha";
import { TOEICQuestion } from "./mockTest";

export interface GachaTOEICIntegration {
  userId: string;
  ownedCards: WordCard[];
  cardBasedQuestions: CardBasedQuestion[];
  cardPowerUps: CardPowerUp[];
  cardSynergies: CardSynergy[];
  lastUpdated: Date;
}

export interface CardBasedQuestion extends TOEICQuestion {
  requiredCards: string[];
  cardBonuses: {
    cardId: string;
    bonusType:
      | "accuracy_boost"
      | "time_extension"
      | "hint_reveal"
      | "xp_multiplier";
    bonusValue: number;
    isActive: boolean;
    cardRarity: string;
  }[];
  cardDifficultyAdjustment: number;
}

export interface CardPowerUp {
  cardId: string;
  cardName: string;
  rarity: string;
  effect: {
    type: "accuracy" | "time" | "hint" | "bonus";
    value: number;
    description: string;
  };
  duration: number; // 分
  cooldown: number; // 分
  isActive: boolean;
  lastUsed?: Date;
  usageCount: number;
  maxUsagePerDay: number;
}

export interface CardSynergy {
  combinationId: string;
  combinationName: string;
  requiredCards: string[];
  requiredRarities: string[];
  synergyEffect: {
    type:
      | "combo_multiplier"
      | "accuracy_boost"
      | "time_extension"
      | "special_questions";
    value: number;
    description: string;
  };
  isActive: boolean;
  unlockedAt?: Date;
  usageCount: number;
}

export interface TOEICQuestionWithCardBoost extends TOEICQuestion {
  cardBoost?: {
    cardId: string;
    cardName: string;
    rarity: string;
    boostType: string;
    boostValue: number;
    isActive: boolean;
    synergyActive: boolean;
  };
}

export interface CardRecommendation {
  cardId: string;
  cardName: string;
  rarity: string;
  recommendationReason: string;
  expectedBenefit: string;
  priority: "high" | "medium" | "low";
  category: string;
  partNumber: number;
}

export interface CardUsageStats {
  cardId: string;
  cardName: string;
  usageCount: number;
  successRate: number;
  averageBonus: number;
  lastUsed: Date;
  effectiveness: "high" | "medium" | "low";
  favoriteQuestionTypes: string[];
}

export interface GachaCollectionProgress {
  totalCards: number;
  ownedCards: number;
  completionRate: number;
  rarityBreakdown: {
    rarity: string;
    total: number;
    owned: number;
    completionRate: number;
  }[];
  missingCards: string[];
  nextTargetCards: string[];
}

export interface CardPowerUpActivation {
  cardId: string;
  activationTime: Date;
  duration: number;
  effects: {
    type: string;
    value: number;
  }[];
  isActive: boolean;
  remainingTime: number;
}

export interface TOEICCardChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  requiredCards: string[];
  challengeType: "accuracy" | "speed" | "endurance" | "combo";
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewards: {
    xp: number;
    coins: number;
    newCard?: string;
    title: string;
    badge: string;
  };
  difficulty: "easy" | "medium" | "hard" | "legendary";
}
