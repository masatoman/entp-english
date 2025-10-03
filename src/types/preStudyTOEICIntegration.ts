// 事前学習とTOEIC模擬テストの統合型定義
import { TOEICQuestion } from "./mockTest";

export interface PreStudyTOEICBoost {
  completedTopics: string[];
  synergyMultiplier: number; // 1.0-2.0倍
  unlockedParts: number[]; // 事前学習で解放されるパート
  bonusQuestions: string[]; // 特別問題の解放
  preStudyEffects: {
    topicId: string;
    partNumber: number;
    effectType:
      | "xp_boost"
      | "accuracy_boost"
      | "time_extension"
      | "hint_unlock";
    effectValue: number;
    description: string;
  }[];
}

export interface TOEICPreStudyIntegration {
  userId: string;
  completedPreStudy: string[];
  toeicBoosts: PreStudyTOEICBoost;
  lastUpdated: Date;
  statistics: {
    totalPreStudyCompleted: number;
    totalBoostsActive: number;
    averageSynergyMultiplier: number;
    mostEffectiveTopic: string;
  };
}

export interface PreStudyTopicMapping {
  topicId: string;
  topicTitle: string;
  relatedTOEICParts: number[];
  synergyEffects: {
    partNumber: number;
    effectType:
      | "xp_boost"
      | "accuracy_boost"
      | "time_extension"
      | "hint_unlock";
    effectValue: number;
    condition: string;
  }[];
  prerequisiteTopics?: string[];
  unlocksAdvancedQuestions?: boolean;
}

export interface TOEICQuestionWithPreStudyBoost extends TOEICQuestion {
  preStudyBoost?: {
    topicId: string;
    boostType: string;
    boostValue: number;
    isActive: boolean;
  };
}

export interface PreStudyProgressForTOEIC {
  completedTopics: string[];
  topicProgress: {
    topicId: string;
    completionDate: Date;
    comprehensionRating: number; // 1-5
    timeSpent: number; // 秒
  }[];
  availableBoosts: PreStudyTOEICBoost;
  nextRecommendedTopics: string[];
}
