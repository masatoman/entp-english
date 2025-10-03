// インテリジェント問題推薦システムの型定義
import { TOEICQuestion } from "./mockTest";

export interface IntelligentQuestionSelection {
  userId: string;
  weakPoints: WeakPoint[];
  strongPoints: StrongPoint[];
  recommendedParts: RecommendedPart[];
  adaptiveDifficulty: "easy" | "medium" | "hard";
  personalizedQuestions: PersonalizedQuestion[];
  lastAnalyzed: Date;
}

export interface WeakPoint {
  category: string;
  partNumber: number;
  errorCount: number;
  errorRate: number;
  lastError: Date;
  commonMistakes: string[];
  needsReview: boolean;
  priority: "high" | "medium" | "low";
}

export interface StrongPoint {
  category: string;
  partNumber: number;
  successCount: number;
  successRate: number;
  lastSuccess: Date;
  strengths: string[];
  canMentor: boolean;
}

export interface RecommendedPart {
  partNumber: number;
  reason: string;
  priority: "high" | "medium" | "low";
  expectedImprovement: number;
  timeEstimate: number; // 分
  questionTypes: string[];
}

export interface PersonalizedQuestion extends TOEICQuestion {
  personalizationFactors: {
    difficultyAdjustment: number;
    categoryBoost: boolean;
    weaknessTargeting: boolean;
    strengthReinforcement: boolean;
    timeOptimization: boolean;
  };
  expectedPerformance: {
    probability: number;
    timeEstimate: number;
    confidence: number;
  };
  learningValue: number; // 1-10
}

export interface LearningPattern {
  userId: string;
  preferredTimeSlots: string[];
  averageSessionLength: number;
  peakPerformanceHours: number[];
  difficultyProgression: "conservative" | "balanced" | "aggressive";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  attentionSpan: "short" | "medium" | "long";
  lastAnalyzed: Date;
}

export interface QuestionRecommendation {
  questionId: string;
  reason: string;
  expectedBenefit: string;
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: number;
  confidence: number;
  alternatives: string[];
}

export interface PerformancePrediction {
  questionId: string;
  predictedAccuracy: number;
  predictedTime: number;
  confidence: number;
  factors: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

export interface AdaptiveDifficultySettings {
  userId: string;
  currentLevel: "beginner" | "intermediate" | "advanced";
  progressionSpeed: "slow" | "medium" | "fast";
  challengePreference: "conservative" | "balanced" | "aggressive";
  feedbackSensitivity: "low" | "medium" | "high";
  autoAdjustment: boolean;
  lastUpdated: Date;
}
