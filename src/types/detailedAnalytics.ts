// 詳細学習分析システムの型定義

export interface DetailedLearningAnalytics {
  userId: string;
  generatedAt: Date;

  // 基本統計
  basicStats: BasicLearningStats;

  // スキル別分析
  skillAnalysis: SkillAnalysis;

  // 時間軸分析
  temporalAnalysis: TemporalAnalysis;

  // パフォーマンス分析
  performanceAnalysis: PerformanceAnalysis;

  // 学習パターン分析
  patternAnalysis: LearningPatternAnalysis;

  // 改善提案
  improvementSuggestions: ImprovementSuggestion[];

  // 予測分析
  predictiveAnalysis: PredictiveAnalysis;
}

export interface BasicLearningStats {
  totalSessions: number;
  totalStudyTime: number; // 分
  totalXP: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  totalProblemsAnswered: number;
  correctAnswers: number;
}

export interface SkillAnalysis {
  listening: SkillDetail;
  reading: SkillDetail;
  writing: SkillDetail;
  grammar: SkillDetail;
  vocabulary: SkillDetail;
  speaking: SkillDetail;
}

export interface SkillDetail {
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
  currentXP: number;
  totalProblems: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerProblem: number; // 秒
  improvementTrend: "improving" | "stable" | "declining";
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: number; // 0-100 (推奨集中度)
}

export interface TemporalAnalysis {
  dailyPatterns: DailyPattern[];
  weeklyTrends: WeeklyTrend[];
  monthlyProgress: MonthlyProgress[];
  peakPerformanceHours: number[];
  optimalStudyDuration: number; // 分
  studyFrequency: "daily" | "frequent" | "occasional" | "sporadic";
}

export interface DailyPattern {
  dayOfWeek: string;
  averageStudyTime: number;
  averageAccuracy: number;
  sessionCount: number;
  xpGained: number;
}

export interface WeeklyTrend {
  week: string; // YYYY-MM-DD format
  totalStudyTime: number;
  averageAccuracy: number;
  xpGained: number;
  sessionsCompleted: number;
  streakLength: number;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM
  totalStudyTime: number;
  xpGained: number;
  levelGained: number;
  skillsImproved: string[];
  achievementsUnlocked: string[];
}

export interface PerformanceAnalysis {
  accuracyDistribution: AccuracyDistribution;
  timeAnalysis: TimeAnalysis;
  difficultyProgression: DifficultyProgression;
  categoryPerformance: CategoryPerformance[];
  learningVelocity: LearningVelocity;
}

export interface AccuracyDistribution {
  excellent: number; // 90-100%
  good: number; // 80-89%
  fair: number; // 70-79%
  poor: number; // <70%
}

export interface TimeAnalysis {
  averageResponseTime: number; // 秒
  fastestResponseTime: number;
  slowestResponseTime: number;
  timeConsistency: "consistent" | "variable" | "inconsistent";
  timeOptimization: "optimal" | "could_be_faster" | "too_rushed";
}

export interface DifficultyProgression {
  beginnerMastery: number; // 0-100
  intermediateMastery: number; // 0-100
  advancedMastery: number; // 0-100
  recommendedNextLevel: "beginner" | "intermediate" | "advanced";
  challengeReadiness: number; // 0-100
}

export interface CategoryPerformance {
  category: string;
  problemsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  improvementTrend: "improving" | "stable" | "declining";
  masteryLevel: "mastered" | "proficient" | "learning" | "needs_work";
}

export interface LearningVelocity {
  xpPerDay: number;
  xpPerWeek: number;
  xpPerMonth: number;
  velocityTrend: "accelerating" | "steady" | "decelerating";
  projectedLevelUp: string; // 日付
  projectedXP: number; // 30日後の予測XP
}

export interface LearningPatternAnalysis {
  learningStyle: LearningStyle;
  motivationFactors: MotivationFactor[];
  engagementPatterns: EngagementPattern[];
  retentionAnalysis: RetentionAnalysis;
  personalizedRecommendations: PersonalizedRecommendation[];
}

export interface LearningStyle {
  primary: "visual" | "auditory" | "kinesthetic" | "reading";
  secondary: "visual" | "auditory" | "kinesthetic" | "reading";
  studyPreferences: string[];
  optimalSessionLength: number; // 分
  preferredDifficulty: "easy" | "moderate" | "challenging";
}

export interface MotivationFactor {
  factor: string;
  impact: number; // 0-100
  description: string;
  suggestions: string[];
}

export interface EngagementPattern {
  pattern: string;
  frequency: number;
  effectiveness: number; // 0-100
  recommendations: string[];
}

export interface RetentionAnalysis {
  shortTermRetention: number; // 0-100
  longTermRetention: number; // 0-100
  forgettingCurve: number; // 0-100
  reviewEffectiveness: number; // 0-100
  optimalReviewInterval: number; // 日
}

export interface PersonalizedRecommendation {
  type:
    | "study_method"
    | "content_focus"
    | "schedule_optimization"
    | "motivation_boost";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  expectedBenefit: string;
  implementationSteps: string[];
  estimatedImpact: number; // 0-100
}

export interface ImprovementSuggestion {
  area: string;
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  improvementPotential: number; // 0-100
  suggestions: string[];
  resources: string[];
  timeline: string;
  expectedOutcome: string;
}

export interface PredictiveAnalysis {
  skillProjections: SkillProjection[];
  levelUpPrediction: LevelUpPrediction;
  achievementForecast: AchievementForecast[];
  riskFactors: RiskFactor[];
  opportunityAreas: OpportunityArea[];
}

export interface SkillProjection {
  skill: string;
  currentLevel: number;
  projectedLevel30Days: number;
  projectedLevel90Days: number;
  confidence: number; // 0-100
  keyFactors: string[];
}

export interface LevelUpPrediction {
  currentLevel: number;
  nextLevel: number;
  estimatedDays: number;
  requiredXP: number;
  currentXP: number;
  confidence: number;
  recommendations: string[];
}

export interface AchievementForecast {
  achievementId: string;
  achievementName: string;
  probability: number; // 0-100
  estimatedCompletion: string; // 日付
  requirements: string[];
  progress: number; // 0-100
}

export interface RiskFactor {
  risk: string;
  probability: number; // 0-100
  impact: "low" | "medium" | "high";
  mitigation: string[];
  warningSigns: string[];
}

export interface OpportunityArea {
  area: string;
  potential: number; // 0-100
  effort: "low" | "medium" | "high";
  timeframe: string;
  benefits: string[];
  actionItems: string[];
}

// 分析設定
export interface AnalyticsConfig {
  analysisDepth: "basic" | "detailed" | "comprehensive";
  timeRange: "week" | "month" | "quarter" | "year" | "all";
  includePredictions: boolean;
  includeRecommendations: boolean;
  focusAreas: string[];
}

// 分析結果のエクスポート
export interface AnalyticsExport {
  analytics: DetailedLearningAnalytics;
  exportDate: Date;
  format: "json" | "csv" | "pdf";
  summary: string;
}
