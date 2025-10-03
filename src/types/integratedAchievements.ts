// 統合実績システムの型定義

export interface IntegratedAchievements {
  userId: string;
  toeicSpecific: TOEICSpecificAchievements;
  crossFunctional: CrossFunctionalAchievements;
  synergyBased: SynergyBasedAchievements;
  progressionBased: ProgressionBasedAchievements;
  lastUpdated: Date;
}

export interface TOEICSpecificAchievements {
  partMaster: PartMasterAchievement[];
  scoreMilestones: ScoreMilestone[];
  perfectRuns: PerfectRunAchievement[];
  timeRecords: TimeRecordAchievement[];
  categoryExpert: CategoryExpertAchievement[];
}

export interface PartMasterAchievement {
  partNumber: number;
  partName: string;
  isCompleted: boolean;
  completedAt?: Date;
  requirements: {
    accuracy: number;
    questionsCompleted: number;
    timeLimit: number;
  };
  rewards: {
    xp: number;
    title: string;
    badge: string;
    unlocks: string[];
  };
}

export interface ScoreMilestone {
  targetScore: number;
  isAchieved: boolean;
  achievedAt?: Date;
  attempts: number;
  bestScore: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    specialUnlock: string;
  };
}

export interface PerfectRunAchievement {
  testType: "listening" | "reading" | "full";
  partNumber?: number;
  isCompleted: boolean;
  completedAt?: Date;
  streakCount: number;
  maxStreak: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    multiplier: number;
  };
}

export interface TimeRecordAchievement {
  recordType: "fastest" | "most_accurate" | "most_consistent";
  testType: "listening" | "reading" | "full";
  partNumber?: number;
  recordValue: number;
  achievedAt: Date;
  isCurrentRecord: boolean;
  rewards: {
    xp: number;
    title: string;
    badge: string;
  };
}

export interface CategoryExpertAchievement {
  category: string;
  expertiseLevel: "novice" | "intermediate" | "advanced" | "expert" | "master";
  accuracy: number;
  questionsCompleted: number;
  isCompleted: boolean;
  completedAt?: Date;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    specialAbility: string;
  };
}

export interface CrossFunctionalAchievements {
  synergyMaster: SynergyMasterAchievement;
  skillTreeCompletion: SkillTreeCompletionAchievement;
  allModeMaster: AllModeMasterAchievement;
  learningStreak: LearningStreakAchievement;
  adaptiveLearner: AdaptiveLearnerAchievement;
}

export interface SynergyMasterAchievement {
  isCompleted: boolean;
  completedAt?: Date;
  synergyLevel: number;
  maxSynergyReached: number;
  combinationCount: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    specialMultiplier: number;
  };
}

export interface SkillTreeCompletionAchievement {
  isCompleted: boolean;
  completedAt?: Date;
  completionRate: number;
  totalSkills: number;
  unlockedSkills: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    specialUnlock: string;
  };
}

export interface AllModeMasterAchievement {
  isCompleted: boolean;
  completedAt?: Date;
  modeProgress: {
    grammarQuiz: number;
    vocabulary: number;
    preStudy: number;
    skillTree: number;
    toeic: number;
  };
  rewards: {
    xp: number;
    title: string;
    badge: string;
    ultimateUnlock: string;
  };
}

export interface LearningStreakAchievement {
  currentStreak: number;
  maxStreak: number;
  streakType: "daily" | "weekly" | "monthly";
  lastActivity: Date;
  isActive: boolean;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    streakMultiplier: number;
  };
}

export interface AdaptiveLearnerAchievement {
  isCompleted: boolean;
  completedAt?: Date;
  adaptationCount: number;
  improvementRate: number;
  personalizedQuestions: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    aiBoost: number;
  };
}

export interface SynergyBasedAchievements {
  combinationMaster: CombinationMasterAchievement[];
  crossPollination: CrossPollinationAchievement[];
  systemIntegration: SystemIntegrationAchievement[];
}

export interface CombinationMasterAchievement {
  combinationType: string;
  isCompleted: boolean;
  completedAt?: Date;
  synergyValue: number;
  combinationCount: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    combinationBonus: number;
  };
}

export interface CrossPollinationAchievement {
  sourceSystem: string;
  targetSystem: string;
  isCompleted: boolean;
  completedAt?: Date;
  transferCount: number;
  effectiveness: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    transferMultiplier: number;
  };
}

export interface SystemIntegrationAchievement {
  integratedSystems: string[];
  isCompleted: boolean;
  completedAt?: Date;
  integrationLevel: number;
  synergyMultiplier: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    integrationBonus: number;
  };
}

export interface ProgressionBasedAchievements {
  levelMaster: LevelMasterAchievement[];
  milestoneReacher: MilestoneReacherAchievement[];
  continuousImprover: ContinuousImproverAchievement[];
}

export interface LevelMasterAchievement {
  level: number;
  isCompleted: boolean;
  completedAt?: Date;
  requirements: {
    xp: number;
    achievements: number;
    systemsCompleted: number;
  };
  rewards: {
    xp: number;
    title: string;
    badge: string;
    levelUnlock: string;
  };
}

export interface MilestoneReacherAchievement {
  milestoneType: "questions" | "time" | "accuracy" | "streak";
  targetValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  currentValue: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    milestoneBonus: number;
  };
}

export interface ContinuousImproverAchievement {
  improvementType: "accuracy" | "speed" | "consistency" | "knowledge";
  isCompleted: boolean;
  completedAt?: Date;
  improvementRate: number;
  baselineValue: number;
  currentValue: number;
  rewards: {
    xp: number;
    title: string;
    badge: string;
    improvementMultiplier: number;
  };
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  achievementType: "toeic" | "cross_functional" | "synergy" | "progression";
  title: string;
  description: string;
  rewards: {
    xp: number;
    title?: string;
    badge?: string;
    unlock?: string;
  };
  isRead: boolean;
  achievedAt: Date;
}

export interface AchievementStats {
  totalAchievements: number;
  completedAchievements: number;
  completionRate: number;
  totalXPEarned: number;
  recentAchievements: AchievementNotification[];
  nextAchievements: string[];
  categoryBreakdown: {
    category: string;
    completed: number;
    total: number;
  }[];
}
