// ハートシステムとTOEIC模擬テストの統合型定義
import { TOEICQuestion } from "./mockTest";

export interface HeartTOEICIntegration {
  userId: string;
  heartCost: number;
  specialModes: SpecialTOEICMode[];
  heartRecoveryBonus: number;
  heartMultiplier: number;
  lastUpdated: Date;
}

export interface SpecialTOEICMode {
  modeId: string;
  modeName: string;
  description: string;
  heartCost: number;
  effects: TOEICModeEffect;
  duration: number; // 分
  isActive: boolean;
  activatedAt?: Date;
  usageCount: number;
  maxUsagePerDay: number;
  cooldown: number; // 分
}

export interface TOEICModeEffect {
  unlimitedTime: boolean;
  unlimitedHints: boolean;
  perfectMode: boolean;
  accuracyBoost: number;
  xpMultiplier: number;
  timeExtension: number; // 秒
  questionSkip: boolean;
  doubleReward: boolean;
  specialQuestions: boolean;
}

export interface TOEICQuestionWithHeartBoost extends TOEICQuestion {
  heartBoost?: {
    modeId: string;
    modeName: string;
    effects: TOEICModeEffect;
    isActive: boolean;
    remainingTime: number;
  };
}

export interface HeartConsumption {
  modeId: string;
  heartCost: number;
  consumedAt: Date;
  duration: number;
  effects: TOEICModeEffect;
  isActive: boolean;
}

export interface HeartRecoveryBonus {
  bonusType: "time_reduction" | "extra_hearts" | "instant_recovery";
  value: number;
  description: string;
  isActive: boolean;
  activatedAt?: Date;
  duration: number;
}

export interface TOEICHeartChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  requiredMode: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewards: {
    xp: number;
    hearts: number;
    heartRecoveryBonus: number;
    title: string;
    badge: string;
  };
  difficulty: "easy" | "medium" | "hard" | "legendary";
}

export interface HeartUsageStats {
  totalHeartsConsumed: number;
  totalTimeInModes: number;
  modeUsageBreakdown: {
    modeId: string;
    usageCount: number;
    totalTime: number;
    averageEffectiveness: number;
  }[];
  heartEfficiency: number;
  favoriteMode: string;
  lastUsed: Date;
}

export interface HeartMultiplier {
  baseMultiplier: number;
  streakMultiplier: number;
  modeMultiplier: number;
  totalMultiplier: number;
  activeBonuses: string[];
  expiresAt?: Date;
}
