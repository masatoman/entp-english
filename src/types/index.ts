export type Category =
  | "parts-of-speech"
  | "word-order"
  | "pronouns"
  | "articles"
  | "plurals"
  | "questions-negations"
  | "basic-grammar"
  | "prepositions"
  | "conjunctions"
  | "tenses"
  | "modals"
  | "passive"
  | "relative"
  | "subjunctive"
  | "comparison"
  | "participle"
  | "infinitive"
  | "vocabulary-mastery"
  | "pronunciation";

// 新仕様の型定義
export type Chapter = 1 | 2 | 3 | 4 | 5;

export type QuestionRank = "normal" | "rare" | "epic" | "legendary";

export type SkillField =
  | "listening"
  | "reading"
  | "writing"
  | "grammar"
  | "idioms"
  | "vocabulary";

export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

// リスニング学習進捗関連の型定義
export interface ListeningProgress {
  id: string;
  userId: string;
  sessionId: string;
  part: "part1" | "part2" | "part3" | "part4";
  difficulty: "beginner" | "intermediate" | "advanced";
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 正解率 (0-100)
  timeSpent: number; // 学習時間（秒）
  completedAt: Date;
  questions: ListeningQuestionResult[];
}

export interface ListeningQuestionResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // 回答時間（秒）
  audioPlayed: boolean; // 音声を再生したか
  transcriptViewed: boolean; // トランスクリプトを見たか
}

export interface ListeningStatistics {
  totalSessions: number;
  totalQuestions: number;
  totalCorrectAnswers: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number; // 総学習時間（秒）
  partStats: {
    part1: ListeningPartStats;
    part2: ListeningPartStats;
    part3: ListeningPartStats;
    part4: ListeningPartStats;
  };
  difficultyStats: {
    beginner: ListeningDifficultyStats;
    intermediate: ListeningDifficultyStats;
    advanced: ListeningDifficultyStats;
  };
  lastSessionDate?: Date;
  currentStreak: number; // 連続学習日数
  longestStreak: number; // 最長連続学習日数
}

export interface ListeningPartStats {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
}

export interface ListeningDifficultyStats {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
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
  difficulty: "easy" | "normal" | "hard";
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

// 既知単語管理システム
export interface KnownWord {
  id: string;
  word: string;
  meaning: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  markedAsKnownAt: Date;
  reviewCount: number; // 復習回数
  lastReviewAt?: Date;
}

export interface KnownWordsData {
  knownWords: KnownWord[];
  totalKnownCount: number;
  categoryStats: Record<string, number>;
  levelStats: Record<string, number>;
}

// パーソナル学習インサイトシステム
export interface LearningPattern {
  preferredDifficulty: "beginner" | "intermediate" | "advanced";
  preferredCategory: string;
  averageSessionTime: number; // 分
  peakPerformanceHour: number; // 0-23時
  streakLength: number;
  accuracyRate: number; // 0-1
  learningVelocity: number; // XP/日
}

export interface LearningInsight {
  learnerType: "効率重視型" | "探求型" | "競争型" | "創造型" | "バランス型";
  primaryStrengths: string[];
  improvementAreas: string[];
  personalizedRecommendations: string[];
  uniquePattern: string;
  confidenceScore: number; // 0-1
  lastAnalyzed: Date;
}

export interface LearningAnalytics {
  totalStudySessions: number;
  totalStudyTime: number; // 分
  averageAccuracy: number;
  strongestCategories: string[];
  improvementTrend: "上昇中" | "安定" | "要改善";
  weeklyProgress: number[];
  monthlyXpGain: number;
}

// 今日のスペシャルチャレンジシステム
export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  description: string;
  type: "vocabulary" | "grammar" | "time-attack" | "creative" | "efficiency";
  rules: ChallengeRule[];
  bonusXP: number;
  bonusMultiplier: number; // XP倍率
  isCompleted: boolean;
  completedAt?: Date;
  icon: string;
  color: string;
}

export interface ChallengeRule {
  type: "time-limit" | "accuracy-target" | "word-count" | "special-mode";
  value: number | string;
  description: string;
}

export interface DailyChallengeProgress {
  currentChallenge: DailyChallenge | null;
  completedChallenges: string[]; // challenge IDs
  streakCount: number;
  totalCompleted: number;
  lastCompletedDate: string;
}

// TOEIC模擬テスト関連の型定義
export * from "./mockTest";
