export type Category = 
  | 'basic-grammar'
  | 'tenses' 
  | 'modals'
  | 'passive'
  | 'relative'
  | 'subjunctive'
  | 'comparison'
  | 'participle'
  | 'infinitive';

// 新仕様の型定義
export type Chapter = 1 | 2 | 3 | 4 | 5;

export type QuestionRank = 'normal' | 'rare' | 'epic' | 'legendary';

export type SkillField = 
  | 'listening'
  | 'reading'
  | 'writing'
  | 'grammar'
  | 'idioms'
  | 'vocabulary';

export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

// 新仕様のインターフェース
export interface UserLevel {
  level: number;
  chapter: Chapter;
  xp: number;
  xpToNext: number;
  progress: number;
}

export interface HeartSystem {
  current: number;
  max: number;
  lastRecovery: number;
  nextRecovery: number;
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  unlockedAchievements: string[];
  totalProblemsAnswered: number;
  correctAnswers: number;
  level: number;
  // ⭐️スターシステム用の追加プロパティ
  stars?: {
    current: number;
    max: number;
    lastRecoveryTime: number;
  };
  preStudyProgress?: {
    totalContentsStudied: number;
    contentsByCategory: Record<string, number>;
    averageComprehension: number;
    totalTimeSpent: number;
    lastStudiedContentId?: string;
    completedContents: string[];
  };
  preStudySessions?: Array<{
    contentId: string;
    startTime: number;
    endTime?: number;
    completed: boolean;
    comprehensionRating?: number;
  }>;
}

export interface StatusAllocation {
  listening: number;
  reading: number;
  writing: number;
  grammar: number;
  idioms: number;
  vocabulary: number;
}

export interface QuestionWithRank {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: Category;
  difficulty: 'easy' | 'normal' | 'hard';
  rank: QuestionRank;
  skillField: SkillField;
  xpReward: number;
}

export interface LevelConfig {
  level: number;
  chapter: Chapter;
  requiredXP: number;
  maxHearts: number;
  rankProbabilities: {
    normal: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

// 実績システム
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  requirements: {
    type: string;
    value: number;
  };
}