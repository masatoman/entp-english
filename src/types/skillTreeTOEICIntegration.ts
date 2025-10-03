// スキルツリーとTOEIC模擬テストの統合型定義
import { TOEICQuestion } from "./mockTest";

export interface SkillTreeTOEICIntegration {
  userId: string;
  unlockedSkills: string[];
  skillBasedQuestions: SkillBasedQuestion[];
  skillBonuses: SkillBonus[];
  lastUpdated: Date;
  statistics: {
    totalSkillsUnlocked: number;
    totalBonusesActive: number;
    averageSkillLevel: number;
    mostEffectiveSkill: string;
  };
}

export interface SkillBasedQuestion extends TOEICQuestion {
  requiredSkills: string[];
  skillBonuses: {
    skillId: string;
    bonusType:
      | "xp_multiplier"
      | "accuracy_boost"
      | "time_extension"
      | "hint_unlock";
    bonusValue: number;
    isActive: boolean;
  }[];
  difficultyAdjustment: number; // -1 to +2 (skill level based)
}

export interface SkillBonus {
  skillId: string;
  skillName: string;
  skillLevel: number;
  toeicParts: number[];
  bonusEffects: {
    partNumber: number;
    effectType:
      | "xp_multiplier"
      | "accuracy_boost"
      | "time_extension"
      | "hint_unlock";
    effectValue: number;
    condition: string;
  }[];
  prerequisites: string[];
  unlocksAdvancedQuestions: boolean;
}

export interface SkillTreeProgressForTOEIC {
  unlockedSkills: string[];
  skillProgress: {
    skillId: string;
    masteryLevel: number;
    completedProblems: number;
    averageScore: number;
    lastStudied: Date;
  }[];
  availableBonuses: SkillBonus[];
  nextRecommendedSkills: string[];
  skillTreeLevel: number;
}

export interface TOEICQuestionWithSkillBoost extends TOEICQuestion {
  skillBoost?: {
    skillId: string;
    boostType: string;
    boostValue: number;
    isActive: boolean;
    skillLevel: number;
  };
}
