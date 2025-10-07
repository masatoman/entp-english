// 学習パス連動チャレンジの型定義
import { TOEICQuestion } from "./mockTest";

export interface LearningPathChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  challengeType: "progressive" | "adaptive" | "synergy" | "mastery" | "speed";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert" | "master";
  learningPath: LearningStep[];
  requirements: ChallengeRequirements;
  rewards: ChallengeRewards;
  isActive: boolean;
  isCompleted: boolean;
  startedAt?: Date;
  completedAt?: Date;
  currentStep: number;
  progress: ChallengeProgress;
}

export interface LearningStep {
  stepId: string;
  stepName: string;
  description: string;
  stepType:
    | "prestudy"
    | "skill_tree"
    | "vocabulary"
    | "grammar"
    | "toeic"
    | "synergy"
    | "listening"
    | "reading";
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  estimatedTime: number; // 分
  prerequisites: string[];
  unlocks: string[];
  rewards: StepRewards;
}

export interface ChallengeRequirements {
  minimumLevel: number;
  requiredSystems: string[];
  prerequisiteChallenges: string[];
  timeLimit?: number; // 分
  attemptsAllowed: number;
  difficultyProgression: "linear" | "exponential" | "adaptive";
}

export interface ChallengeRewards {
  xp: number;
  coins: number;
  hearts: number;
  newCards?: string[];
  title: string;
  badge: string;
  unlocks: string[];
  specialEffects?: {
    type: string;
    value: number;
    description: string;
  }[];
}

export interface StepRewards {
  xp: number;
  coins: number;
  progressBonus: number;
  unlocks?: string[];
}

export interface ChallengeProgress {
  overallProgress: number; // 0-100
  stepProgress: {
    [stepId: string]: number;
  };
  timeSpent: number; // 分
  attemptsUsed: number;
  currentStreak: number;
  bestScore: number;
  averageScore: number;
  improvementRate: number;
}

export interface LearningPathRecommendation {
  userId: string;
  recommendedPath: string;
  reason: string;
  expectedBenefit: string;
  estimatedTime: number;
  difficulty: string;
  prerequisites: string[];
  alternatives: string[];
  priority: "high" | "medium" | "low";
}

export interface ChallengeCompletion {
  challengeId: string;
  completedAt: Date;
  finalScore: number;
  timeSpent: number;
  rewardsEarned: ChallengeRewards;
  performanceMetrics: {
    accuracy: number;
    speed: number;
    consistency: number;
    improvement: number;
  };
  feedback: string;
  nextRecommendations: string[];
}

export interface AdaptiveChallenge {
  challengeId: string;
  baseChallenge: LearningPathChallenge;
  adaptations: {
    difficultyAdjustment: number;
    timeExtension: number;
    hintAvailability: boolean;
    questionSelection: "easier" | "standard" | "harder";
    feedbackFrequency: "low" | "medium" | "high";
  };
  adaptationReason: string;
  isAdapted: boolean;
  adaptedAt?: Date;
}

export interface SynergyChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  requiredSynergies: string[];
  synergyEffects: {
    synergyType: string;
    effectValue: number;
    description: string;
  }[];
  isActive: boolean;
  progress: number;
  rewards: ChallengeRewards;
}

export interface MasteryChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  masteryTarget: string;
  masteryLevel: "basic" | "intermediate" | "advanced" | "expert" | "master";
  assessmentCriteria: {
    accuracy: number;
    speed: number;
    consistency: number;
    understanding: number;
  };
  isCompleted: boolean;
  completedAt?: Date;
  masteryScore: number;
  rewards: ChallengeRewards;
}

export interface SpeedChallenge {
  challengeId: string;
  challengeName: string;
  description: string;
  timeLimit: number; // 秒
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
  questions: TOEICQuestion[];
  isActive: boolean;
  startedAt?: Date;
  currentQuestion: number;
  correctAnswers: number;
  timeRemaining: number;
  rewards: ChallengeRewards;
}
