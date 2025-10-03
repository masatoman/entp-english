// シナジー効果爆発システムの型定義

export interface SynergyExplosionData {
  userId: string;
  grammarQuizProgress: GrammarProgress;
  vocabularyProgress: VocabularyProgress;
  preStudyProgress: PreStudyProgress;
  skillTreeProgress: SkillTreeProgress;
  combinedMultiplier: number; // 総合倍率
  specialUnlocks: SpecialUnlock[];
  explosionLevel: ExplosionLevel;
  lastUpdated: Date;
}

export interface GrammarProgress {
  totalCategories: number;
  completedCategories: number;
  averageAccuracy: number;
  totalProblems: number;
  completedProblems: number;
  lastStudied: Date;
  categoryProgress: {
    category: string;
    completionRate: number;
    accuracy: number;
    lastStudied: Date;
  }[];
}

export interface VocabularyProgress {
  totalWords: number;
  masteredWords: number;
  totalSessions: number;
  averageScore: number;
  lastStudied: Date;
  categoryProgress: {
    category: string;
    wordsLearned: number;
    masteryRate: number;
    lastStudied: Date;
  }[];
}

export interface PreStudyProgress {
  totalTopics: number;
  completedTopics: number;
  averageRating: number;
  totalTimeSpent: number;
  lastStudied: Date;
  topicProgress: {
    topicId: string;
    completionDate: Date;
    comprehensionRating: number;
    timeSpent: number;
  }[];
}

export interface SkillTreeProgress {
  totalSkills: number;
  unlockedSkills: number;
  averageMastery: number;
  totalXP: number;
  lastStudied: Date;
  skillProgress: {
    skillId: string;
    masteryLevel: number;
    completedProblems: number;
    averageScore: number;
  }[];
}

export interface SpecialUnlock {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  effect: {
    type:
      | "xp_multiplier"
      | "accuracy_boost"
      | "time_extension"
      | "special_questions"
      | "bonus_rewards";
    value: number;
    description: string;
  };
  isActive: boolean;
  unlockedAt: Date;
}

export interface ExplosionLevel {
  level: number; // 1-5
  name: string;
  description: string;
  multiplier: number;
  specialEffects: string[];
  nextLevelRequirement: string;
}

export interface SynergyCalculation {
  baseMultiplier: number;
  grammarBonus: number;
  vocabularyBonus: number;
  preStudyBonus: number;
  skillTreeBonus: number;
  combinationBonus: number;
  totalMultiplier: number;
  breakdown: {
    source: string;
    contribution: number;
    description: string;
  }[];
}
