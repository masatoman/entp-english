/**
 * インテリジェント学習サービス
 * 個人化学習、適応的難易度、弱点分析を統合した高度な学習支援システム
 */

import { UserStats } from "../data/achievements";
import { LearningItem, LearningProgress } from "../types/learningItem";
import {
  AdaptiveDifficultySystem,
  AdaptiveSession,
} from "./adaptiveDifficulty";
import { handleLearningError } from "./errorHandler";
import { logInfo, logLearning } from "./logger";
import { PerformanceOptimizer } from "./performanceOptimizer";
import {
  PersonalizedLearningSystem,
  RecommendationResult,
} from "./personalizedLearning";
import { ComprehensiveAnalysis, WeaknessAnalyzer } from "./weaknessAnalyzer";

export interface IntelligentRecommendation {
  personalizedContent: RecommendationResult;
  adaptiveDifficulty: number;
  weaknessAnalysis: ComprehensiveAnalysis;
  performanceInsights: {
    optimizationsApplied: string[];
    currentMetrics: Record<string, number>;
  };
  combinedScore: number;
  nextSteps: string[];
}

export interface LearningSession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  personalizedItems: LearningItem[];
  adaptiveSession: AdaptiveSession;
  performanceMetrics: Record<string, number>;
  learningGains: number;
  satisfactionScore: number;
}

export class IntelligentLearningService {
  private static readonly SESSION_KEY = "entp-intelligent-sessions";
  private static activeSessions: Map<string, LearningSession> = new Map();

  /**
   * インテリジェント学習システムを初期化
   */
  static initialize(): void {
    try {
      // パフォーマンス監視を開始
      PerformanceOptimizer.initializePerformanceMonitoring();

      // 遅延画像読み込みを設定
      PerformanceOptimizer.setupLazyImageLoading();

      logInfo("インテリジェント学習システムを初期化");
    } catch (error) {
      handleLearningError(
        "initialize intelligent learning service",
        error as Error
      );
    }
  }

  /**
   * 包括的な学習推奨を生成
   */
  static async generateIntelligentRecommendation(
    userId: string,
    userStats: UserStats,
    availableItems: LearningItem[],
    learningProgress: LearningProgress[],
    recentSessions: any[],
    requestedType?: "vocabulary" | "grammar" | "mixed"
  ): Promise<IntelligentRecommendation> {
    try {
      logLearning(`インテリジェント推奨生成開始: ${userId}`, {
        availableItems: availableItems.length,
        progressItems: learningProgress.length,
        recentSessions: recentSessions.length,
      });

      // 1. 個人化プロファイルを更新
      const personalizedProfile =
        PersonalizedLearningSystem.updatePersonalizationProfile(
          userId,
          userStats,
          recentSessions
        );

      // 2. 個人化コンテンツを推奨
      const personalizedContent = PersonalizedLearningSystem.recommendContent(
        userId,
        availableItems,
        requestedType,
        10
      );

      // 3. 適応的難易度を計算
      const adaptiveDifficulty = this.calculateAdaptiveDifficulty(
        userId,
        recentSessions
      );

      // 4. 包括的な弱点分析を実行
      const weaknessAnalysis = WeaknessAnalyzer.performComprehensiveAnalysis(
        userId,
        userStats,
        learningProgress,
        recentSessions
      );

      // 5. パフォーマンス最適化を実行
      const performanceResult = PerformanceOptimizer.optimizeRendering();
      const currentMetrics = PerformanceOptimizer.getStoredMetrics();

      // 6. 統合スコアを計算
      const combinedScore = this.calculateCombinedScore(
        personalizedContent.confidence,
        adaptiveDifficulty,
        weaknessAnalysis.overallScore,
        personalizedProfile.consistencyScore
      );

      // 7. 次のステップを生成
      const nextSteps = this.generateNextSteps(
        personalizedContent,
        weaknessAnalysis,
        personalizedProfile
      );

      const recommendation: IntelligentRecommendation = {
        personalizedContent,
        adaptiveDifficulty,
        weaknessAnalysis,
        performanceInsights: {
          optimizationsApplied: performanceResult.optimizationsApplied,
          currentMetrics,
        },
        combinedScore,
        nextSteps,
      };

      logLearning(`インテリジェント推奨生成完了: ${userId}`, {
        combinedScore,
        itemCount: personalizedContent.items.length,
        confidence: personalizedContent.confidence,
      });

      return recommendation;
    } catch (error) {
      handleLearningError(
        "generate intelligent recommendation",
        error as Error,
        { userId }
      );
      return this.getFallbackRecommendation(userId, availableItems);
    }
  }

  /**
   * インテリジェント学習セッションを開始
   */
  static startIntelligentSession(
    userId: string,
    recommendation: IntelligentRecommendation
  ): LearningSession {
    try {
      const sessionId = `intelligent_${Date.now()}_${userId}`;

      // 適応セッションを開始
      const adaptiveSession = AdaptiveDifficultySystem.startAdaptiveSession(
        userId,
        recommendation.adaptiveDifficulty,
        75 // 目標正答率
      );

      const session: LearningSession = {
        sessionId,
        userId,
        startTime: new Date().toISOString(),
        personalizedItems: recommendation.personalizedContent.items,
        adaptiveSession,
        performanceMetrics: {},
        learningGains: 0,
        satisfactionScore: 0,
      };

      this.activeSessions.set(sessionId, session);

      logLearning(`インテリジェントセッション開始: ${userId}`, {
        sessionId,
        itemCount: session.personalizedItems.length,
        initialDifficulty: recommendation.adaptiveDifficulty,
      });

      return session;
    } catch (error) {
      handleLearningError("start intelligent session", error as Error, {
        userId,
      });
      throw error;
    }
  }

  /**
   * 学習セッション中の回答を記録
   */
  static recordLearningAnswer(
    sessionId: string,
    questionId: string,
    difficulty: number,
    isCorrect: boolean,
    timeToAnswer: number,
    confidence: number = 50
  ): {
    difficultyAdjusted: boolean;
    newDifficulty?: number;
    feedback: string;
  } {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      // 適応的難易度システムに記録
      const adjustment = AdaptiveDifficultySystem.recordAnswer(
        session.adaptiveSession,
        questionId,
        difficulty,
        isCorrect,
        timeToAnswer,
        confidence
      );

      // パフォーマンスメトリクスを更新
      this.updateSessionMetrics(session, isCorrect, timeToAnswer, confidence);

      const result = {
        difficultyAdjusted: adjustment !== null,
        newDifficulty: adjustment?.recommendedDifficulty,
        feedback: this.generateRealTimeFeedback(session, isCorrect, adjustment),
      };

      logLearning(`学習回答記録: ${session.userId}`, {
        sessionId,
        isCorrect,
        difficultyAdjusted: result.difficultyAdjusted,
        newDifficulty: result.newDifficulty,
      });

      return result;
    } catch (error) {
      handleLearningError("record learning answer", error as Error, {
        sessionId,
      });
      return {
        difficultyAdjusted: false,
        feedback: "エラーが発生しました。継続してください。",
      };
    }
  }

  /**
   * 学習セッションを終了
   */
  static finishIntelligentSession(sessionId: string): {
    sessionSummary: LearningSession;
    achievements: string[];
    recommendations: string[];
    nextSessionPreview: string[];
  } {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }

      session.endTime = new Date().toISOString();

      // セッション評価を実行
      const evaluation = AdaptiveDifficultySystem.evaluateSessionEffectiveness(
        session.adaptiveSession
      );

      // 学習効果を計算
      session.learningGains = evaluation.learningGain;
      session.satisfactionScore = evaluation.overallScore;

      // 成果と推奨事項を生成
      const achievements = this.generateAchievements(session, evaluation);
      const recommendations = evaluation.recommendations;
      const nextSessionPreview = this.generateNextSessionPreview(session);

      // セッションを保存
      this.saveSession(session);
      this.activeSessions.delete(sessionId);

      logLearning(`インテリジェントセッション終了: ${session.userId}`, {
        sessionId,
        duration: this.calculateSessionDuration(session),
        learningGains: session.learningGains,
        satisfactionScore: session.satisfactionScore,
      });

      return {
        sessionSummary: session,
        achievements,
        recommendations,
        nextSessionPreview,
      };
    } catch (error) {
      handleLearningError("finish intelligent session", error as Error, {
        sessionId,
      });
      return {
        sessionSummary: {} as LearningSession,
        achievements: [],
        recommendations: ["次回も継続して学習してください"],
        nextSessionPreview: [],
      };
    }
  }

  /**
   * 学習進捗の長期分析
   */
  static analyzeLongTermProgress(userId: string): {
    progressTrend: "excellent" | "good" | "steady" | "concerning";
    keyInsights: string[];
    milestones: string[];
    futureProjections: string[];
  } {
    try {
      // 長期適応パターンを分析
      const adaptationAnalysis =
        AdaptiveDifficultySystem.analyzeLongTermAdaptation(userId);

      // 保存された弱点分析を取得
      const weaknessAnalysis = WeaknessAnalyzer.getStoredAnalysis(userId);

      // 進捗トレンドを判定
      const progressTrend = this.determineProgressTrend(
        adaptationAnalysis,
        weaknessAnalysis
      );

      // 主要洞察を生成
      const keyInsights = this.generateKeyInsights(
        adaptationAnalysis,
        weaknessAnalysis
      );

      // マイルストーンを特定
      const milestones = this.identifyMilestones(adaptationAnalysis);

      // 将来予測を生成
      const futureProjections = this.generateFutureProjections(
        adaptationAnalysis,
        weaknessAnalysis
      );

      logLearning(`長期進捗分析完了: ${userId}`, {
        progressTrend,
        insightCount: keyInsights.length,
        milestoneCount: milestones.length,
      });

      return {
        progressTrend,
        keyInsights,
        milestones,
        futureProjections,
      };
    } catch (error) {
      handleLearningError("analyze long term progress", error as Error, {
        userId,
      });
      return {
        progressTrend: "steady",
        keyInsights: ["分析に必要なデータが不足しています"],
        milestones: [],
        futureProjections: ["継続的な学習で改善が期待できます"],
      };
    }
  }

  /**
   * システムの健全性チェック
   */
  static performSystemHealthCheck(): {
    status: "healthy" | "warning" | "error";
    issues: string[];
    recommendations: string[];
    performanceMetrics: Record<string, number>;
  } {
    try {
      const issues: string[] = [];
      const recommendations: string[] = [];

      // メモリリークチェック
      const memoryResult = PerformanceOptimizer.detectAndFixMemoryLeaks();
      if (memoryResult.leaksDetected > 0) {
        issues.push(
          `${memoryResult.leaksDetected}個のメモリリークを検出・修正`
        );
      }

      // バンドルサイズチェック
      const bundleAnalysis = PerformanceOptimizer.analyzeBundleSize();
      if (bundleAnalysis.totalSize > 2000000) {
        // 2MB
        issues.push("バンドルサイズが大きすぎます");
        recommendations.push(...bundleAnalysis.recommendations);
      }

      // パフォーマンスメトリクス取得
      const performanceMetrics = PerformanceOptimizer.getStoredMetrics();

      const status =
        issues.length === 0
          ? "healthy"
          : issues.length <= 2
          ? "warning"
          : "error";

      return {
        status,
        issues,
        recommendations,
        performanceMetrics,
      };
    } catch (error) {
      handleLearningError("perform system health check", error as Error);
      return {
        status: "error",
        issues: ["システムヘルスチェックでエラーが発生しました"],
        recommendations: ["システム管理者に連絡してください"],
        performanceMetrics: {},
      };
    }
  }

  // プライベートヘルパーメソッド

  private static calculateAdaptiveDifficulty(
    userId: string,
    recentSessions: any[]
  ): number {
    if (recentSessions.length === 0) return 50;

    const recentAccuracy =
      recentSessions.slice(-5).reduce((sum, session) => {
        return sum + (session.isCorrect ? 100 : 0);
      }, 0) / Math.min(5, recentSessions.length);

    // 正答率に基づく難易度調整
    if (recentAccuracy > 85) return 70;
    if (recentAccuracy > 70) return 60;
    if (recentAccuracy > 55) return 50;
    return 40;
  }

  private static calculateCombinedScore(
    personalizedConfidence: number,
    adaptiveDifficulty: number,
    overallScore: number,
    consistencyScore: number
  ): number {
    return Math.round(
      personalizedConfidence * 0.3 +
        (adaptiveDifficulty / 100) * 100 * 0.2 +
        overallScore * 0.3 +
        consistencyScore * 0.2
    );
  }

  private static generateNextSteps(
    personalizedContent: RecommendationResult,
    weaknessAnalysis: ComprehensiveAnalysis,
    personalizedProfile: any
  ): string[] {
    const steps = [];

    // 個人化コンテンツに基づくステップ
    if (personalizedContent.confidence > 70) {
      steps.push("推奨された学習コンテンツに取り組む");
    } else {
      steps.push("基礎的な内容から段階的に学習する");
    }

    // 弱点分析に基づくステップ
    if (weaknessAnalysis.prioritizedActions.length > 0) {
      const topAction = weaknessAnalysis.prioritizedActions[0];
      steps.push(topAction.action);
    }

    // 学習パターンに基づくステップ
    if (personalizedProfile.optimalStudyTime) {
      steps.push(
        `${personalizedProfile.optimalStudyTime}分間の集中学習を継続する`
      );
    }

    return steps.slice(0, 4);
  }

  private static updateSessionMetrics(
    session: LearningSession,
    isCorrect: boolean,
    timeToAnswer: number,
    confidence: number
  ): void {
    if (!session.performanceMetrics.totalQuestions) {
      session.performanceMetrics = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalTime: 0,
        avgConfidence: 0,
      };
    }

    session.performanceMetrics.totalQuestions++;
    if (isCorrect) session.performanceMetrics.correctAnswers++;
    session.performanceMetrics.totalTime += timeToAnswer;

    // 平均自信度を更新
    const prevAvg = session.performanceMetrics.avgConfidence;
    const count = session.performanceMetrics.totalQuestions;
    session.performanceMetrics.avgConfidence =
      (prevAvg * (count - 1) + confidence) / count;
  }

  private static generateRealTimeFeedback(
    session: LearningSession,
    isCorrect: boolean,
    adjustment: any
  ): string {
    if (adjustment) {
      if (adjustment.adjustment > 0) {
        return "素晴らしい！正答率が高いので、難易度を上げました。";
      } else {
        return "大丈夫です。理解を深めるために難易度を調整しました。";
      }
    }

    return isCorrect ? "よくできました！" : "次回がんばりましょう！";
  }

  private static generateAchievements(
    session: LearningSession,
    evaluation: any
  ): string[] {
    const achievements = [];

    if (evaluation.overallScore > 80) {
      achievements.push("優秀な学習成果を達成しました！");
    }

    if (evaluation.learningGain > 10) {
      achievements.push("学習中に大幅な改善を示しました！");
    }

    if (session.performanceMetrics.avgConfidence > 70) {
      achievements.push("高い自信度を維持して学習できました！");
    }

    return achievements.length > 0
      ? achievements
      : ["学習セッションを完了しました！"];
  }

  private static generateNextSessionPreview(
    session: LearningSession
  ): string[] {
    return [
      "前回の成果を基に最適化されたコンテンツ",
      "弱点エリアの重点強化",
      "より効果的な学習体験",
    ];
  }

  private static calculateSessionDuration(session: LearningSession): number {
    if (!session.endTime) return 0;
    return (
      (new Date(session.endTime).getTime() -
        new Date(session.startTime).getTime()) /
      60000
    ); // 分
  }

  private static determineProgressTrend(
    adaptationAnalysis: any,
    weaknessAnalysis: any
  ): "excellent" | "good" | "steady" | "concerning" {
    const velocity = adaptationAnalysis.learningVelocity;
    const adaptability = adaptationAnalysis.adaptabilityScore;
    const overallScore = weaknessAnalysis?.overallScore || 50;

    if (velocity > 2 && adaptability > 80 && overallScore > 80)
      return "excellent";
    if (velocity > 1 && adaptability > 60 && overallScore > 65) return "good";
    if (velocity > 0 && adaptability > 40 && overallScore > 50) return "steady";
    return "concerning";
  }

  private static generateKeyInsights(
    adaptationAnalysis: any,
    weaknessAnalysis: any
  ): string[] {
    const insights = [];

    if (adaptationAnalysis.learningVelocity > 1) {
      insights.push("学習速度が順調に向上しています");
    }

    if (weaknessAnalysis && weaknessAnalysis.weaknessAreas.length > 0) {
      const mainWeakness = weaknessAnalysis.weaknessAreas[0];
      insights.push(`${mainWeakness.category}分野が主な改善対象です`);
    }

    if (adaptationAnalysis.adaptabilityScore > 70) {
      insights.push("適応的学習が効果的に機能しています");
    }

    return insights;
  }

  private static identifyMilestones(adaptationAnalysis: any): string[] {
    const milestones = [];
    const [minDifficulty, maxDifficulty] =
      adaptationAnalysis.preferredDifficultyRange;

    if (maxDifficulty > 70) {
      milestones.push("高難易度問題への対応力を獲得");
    }

    if (adaptationAnalysis.adaptabilityScore > 80) {
      milestones.push("優秀な学習適応能力を達成");
    }

    return milestones;
  }

  private static generateFutureProjections(
    adaptationAnalysis: any,
    weaknessAnalysis: any
  ): string[] {
    const projections = [];

    if (adaptationAnalysis.learningVelocity > 0) {
      projections.push("継続的な改善が期待できます");
    }

    if (
      weaknessAnalysis &&
      Object.keys(weaknessAnalysis.estimatedImprovementTime).length > 0
    ) {
      const timeEstimates = Object.values(
        weaknessAnalysis.estimatedImprovementTime
      );
      const avgTime =
        timeEstimates.reduce((sum: number, time: any) => sum + time, 0) /
        timeEstimates.length;
      projections.push(
        `約${Math.ceil(avgTime)}週間で主要な弱点改善が期待されます`
      );
    }

    return projections;
  }

  private static getFallbackRecommendation(
    userId: string,
    availableItems: LearningItem[]
  ): IntelligentRecommendation {
    return {
      personalizedContent: {
        items: availableItems.slice(0, 5),
        reason: "データ不足のため標準的なコンテンツを提供",
        confidence: 30,
        estimatedDifficulty: 50,
        expectedAccuracy: 70,
      },
      adaptiveDifficulty: 50,
      weaknessAnalysis: WeaknessAnalyzer.performComprehensiveAnalysis(
        userId,
        {} as UserStats,
        [],
        []
      ),
      performanceInsights: {
        optimizationsApplied: [],
        currentMetrics: {},
      },
      combinedScore: 50,
      nextSteps: ["基礎的な学習から開始してください"],
    };
  }

  private static saveSession(session: LearningSession): void {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      const sessions: LearningSession[] = stored ? JSON.parse(stored) : [];
      sessions.push(session);

      // 最新20セッションのみ保持
      if (sessions.length > 20) {
        sessions.splice(0, sessions.length - 20);
      }

      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
    } catch (error) {
      handleLearningError("save session", error as Error, {
        sessionId: session.sessionId,
      });
    }
  }
}
