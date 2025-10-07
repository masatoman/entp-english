/**
 * 弱点分析システム
 * ユーザーの学習データを詳細分析し、具体的な弱点と改善策を提供
 */

import { LearningProgress } from "../types/learningItem";
import { handleLearningError } from "./errorHandler";
import { logLearning } from "./logger";

export interface WeaknessArea {
  category: string;
  subcategory?: string;
  severity: "mild" | "moderate" | "severe";
  confidence: number; // 0-100の分析信頼度
  accuracy: number; // この分野での正答率
  frequency: number; // 間違いの頻度
  recentTrend: "improving" | "stable" | "worsening";
  specificIssues: string[];
  recommendations: string[];
}

export interface StrengthArea {
  category: string;
  subcategory?: string;
  proficiency: number; // 0-100の習熟度
  consistency: number; // 一貫性スコア
  recentPerformance: number;
  masteryLevel: "basic" | "intermediate" | "advanced" | "expert";
}

export interface LearningPattern {
  preferredTimeOfDay: number[]; // 最適な学習時間帯
  optimalSessionLength: number; // 最適なセッション長（分）
  learningSpeed: "slow" | "normal" | "fast";
  retentionRate: number; // 記憶保持率
  difficultyProgression: "gradual" | "normal" | "aggressive";
  motivationalFactors: string[];
}

export interface ComprehensiveAnalysis {
  userId: string;
  analysisDate: string;
  overallScore: number;
  weaknessAreas: WeaknessArea[];
  strengthAreas: StrengthArea[];
  learningPattern: LearningPattern;
  prioritizedActions: PrioritizedAction[];
  longTermGoals: string[];
  estimatedImprovementTime: Record<string, number>; // カテゴリー別改善予想時間（週）
}

export interface PrioritizedAction {
  priority: "high" | "medium" | "low";
  category: string;
  action: string;
  reason: string;
  estimatedEffort: "low" | "medium" | "high";
  expectedImpact: "low" | "medium" | "high";
  timeframe: string;
}

export class WeaknessAnalyzer {
  private static readonly ANALYSIS_KEY = "entp-weakness-analysis";
  private static readonly WEAKNESS_THRESHOLD = 60; // 弱点判定の閾値（正答率%）

  /**
   * 包括的な弱点分析を実行
   */
  static performComprehensiveAnalysis(
    userId: string,
    recentSessions: any[]
  ): ComprehensiveAnalysis {
    try {
      logLearning(`包括的分析開始: ${userId}`, {
        progressItems: learningProgress.length,
        sessions: recentSessions.length,
      });

      const analysisDate = new Date().toISOString();

      // 各分析を実行
      const weaknessAreas = this.analyzeWeaknessAreas(
        userStats,
        learningProgress,
        recentSessions
      );
      const strengthAreas = this.analyzeStrengthAreas(
        userStats,
        learningProgress,
        recentSessions
      );
      const learningPattern = this.analyzeLearningPattern(recentSessions);
      const overallScore = this.calculateOverallScore(
        userStats,
        weaknessAreas,
        strengthAreas
      );

      // 優先アクションを生成
      const prioritizedActions = this.generatePrioritizedActions(
        weaknessAreas,
        strengthAreas,
        learningPattern
      );

      // 長期目標を設定
      const longTermGoals = this.generateLongTermGoals(
        weaknessAreas,
        strengthAreas,
        overallScore
      );

      // 改善予想時間を計算
      const estimatedImprovementTime =
        this.estimateImprovementTime(weaknessAreas);

      const analysis: ComprehensiveAnalysis = {
        userId,
        analysisDate,
        overallScore,
        weaknessAreas,
        strengthAreas,
        learningPattern,
        prioritizedActions,
        longTermGoals,
        estimatedImprovementTime,
      };

      this.saveAnalysis(userId, analysis);

      logLearning(`包括的分析完了: ${userId}`, {
        overallScore,
        weaknessCount: weaknessAreas.length,
        strengthCount: strengthAreas.length,
        highPriorityActions: prioritizedActions.filter(
          (a) => a.priority === "high"
        ).length,
      });

      return analysis;
    } catch (error) {
      handleLearningError("perform comprehensive analysis", error as Error, {
        userId,
      });
      return this.getDefaultAnalysis(userId);
    }
  }

  /**
   * 弱点エリアの詳細分析
   */
  static analyzeWeaknessAreas(recentSessions: any[]): WeaknessArea[] {
    const weaknessAreas: WeaknessArea[] = [];

    try {
      // カテゴリー別の成績分析
      const categoryPerformance =
        this.analyzeCategoryPerformance(recentSessions);

      // 各カテゴリーの弱点を特定
      Object.entries(categoryPerformance).forEach(([category, performance]) => {
        if (
          performance.accuracy < this.WEAKNESS_THRESHOLD &&
          performance.sampleSize >= 5
        ) {
          const weakness = this.createWeaknessArea(
            category,
            performance,
            recentSessions
          );
          if (weakness) {
            weaknessAreas.push(weakness);
          }
        }
      });

      // 文法特有の弱点分析
      const grammarWeaknesses = this.analyzeGrammarWeaknesses(recentSessions);
      weaknessAreas.push(...grammarWeaknesses);

      // 語彙特有の弱点分析
      const vocabularyWeaknesses =
        this.analyzeVocabularyWeaknesses(learningProgress);
      weaknessAreas.push(...vocabularyWeaknesses);

      // 重要度でソート
      weaknessAreas.sort((a, b) => {
        const severityWeight = { severe: 3, moderate: 2, mild: 1 };
        return severityWeight[b.severity] - severityWeight[a.severity];
      });

      return weaknessAreas.slice(0, 8); // 上位8つの弱点
    } catch (error) {
      handleLearningError("analyze weakness areas", error as Error);
      return [];
    }
  }

  /**
   * 強みエリアの分析
   */
  static analyzeStrengthAreas(recentSessions: any[]): StrengthArea[] {
    const strengthAreas: StrengthArea[] = [];

    try {
      const categoryPerformance =
        this.analyzeCategoryPerformance(recentSessions);

      Object.entries(categoryPerformance).forEach(([category, performance]) => {
        if (performance.accuracy >= 80 && performance.sampleSize >= 5) {
          const strength: StrengthArea = {
            category,
            proficiency: performance.accuracy,
            consistency: performance.consistency,
            recentPerformance: performance.recentTrend,
            masteryLevel: this.determineMasteryLevel(
              performance.accuracy,
              performance.consistency
            ),
          };
          strengthAreas.push(strength);
        }
      });

      // 習熟度でソート
      strengthAreas.sort((a, b) => b.proficiency - a.proficiency);

      return strengthAreas.slice(0, 5); // 上位5つの強み
    } catch (error) {
      handleLearningError("analyze strength areas", error as Error);
      return [];
    }
  }

  /**
   * 学習パターンの分析
   */
  static analyzeLearningPattern(recentSessions: any[]): LearningPattern {
    try {
      // 時間帯分析
      const timePerformance = this.analyzeTimeOfDayPerformance(recentSessions);
      const preferredTimeOfDay = Object.entries(timePerformance)
        .filter(([, performance]) => performance.accuracy > 75)
        .map(([hour]) => parseInt(hour))
        .sort(
          (a, b) => timePerformance[b].accuracy - timePerformance[a].accuracy
        )
        .slice(0, 3);

      // セッション長分析
      const optimalSessionLength =
        this.analyzeOptimalSessionLength(recentSessions);

      // 学習速度分析
      const learningSpeed = this.analyzeLearningSpeed(recentSessions);

      // 記憶保持率分析
      const retentionRate = this.analyzeRetentionRate(recentSessions);

      // 難易度進行分析
      const difficultyProgression =
        this.analyzeDifficultyProgression(recentSessions);

      // モチベーション要因分析
      const motivationalFactors =
        this.analyzeMotivationalFactors(recentSessions);

      return {
        preferredTimeOfDay,
        optimalSessionLength,
        learningSpeed,
        retentionRate,
        difficultyProgression,
        motivationalFactors,
      };
    } catch (error) {
      handleLearningError("analyze learning pattern", error as Error);
      return this.getDefaultLearningPattern();
    }
  }

  /**
   * 優先アクションの生成
   */
  static generatePrioritizedActions(
    weaknessAreas: WeaknessArea[],
    strengthAreas: StrengthArea[],
    learningPattern: LearningPattern
  ): PrioritizedAction[] {
    const actions: PrioritizedAction[] = [];

    try {
      // 重大な弱点への対応
      weaknessAreas
        .filter((w) => w.severity === "severe")
        .forEach((weakness) => {
          actions.push({
            priority: "high",
            category: weakness.category,
            action: `${weakness.category}の基礎を重点的に復習する`,
            reason: `正答率${weakness.accuracy}%と大幅に低下しています`,
            estimatedEffort: "high",
            expectedImpact: "high",
            timeframe: "2-3週間",
          });
        });

      // 中程度の弱点への対応
      weaknessAreas
        .filter((w) => w.severity === "moderate")
        .forEach((weakness) => {
          actions.push({
            priority: "medium",
            category: weakness.category,
            action: `${weakness.category}の問題練習を増やす`,
            reason: `改善の余地があります（正答率${weakness.accuracy}%）`,
            estimatedEffort: "medium",
            expectedImpact: "medium",
            timeframe: "3-4週間",
          });
        });

      // 強みの活用
      if (strengthAreas.length > 0) {
        const topStrength = strengthAreas[0];
        actions.push({
          priority: "medium",
          category: topStrength.category,
          action: `${topStrength.category}の上級問題に挑戦する`,
          reason: `この分野は得意なので更なる向上が期待できます`,
          estimatedEffort: "low",
          expectedImpact: "medium",
          timeframe: "1-2週間",
        });
      }

      // 学習パターンに基づく改善
      if (learningPattern.retentionRate < 70) {
        actions.push({
          priority: "high",
          category: "study-method",
          action: "復習間隔を短くして記憶定着を改善する",
          reason: `記憶保持率が${learningPattern.retentionRate}%と低めです`,
          estimatedEffort: "low",
          expectedImpact: "high",
          timeframe: "継続的",
        });
      }

      // 優先度でソート
      return actions.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
    } catch (error) {
      handleLearningError("generate prioritized actions", error as Error);
      return [];
    }
  }

  /**
   * 長期目標の生成
   */
  static generateLongTermGoals(
    weaknessAreas: WeaknessArea[],
    strengthAreas: StrengthArea[],
    overallScore: number
  ): string[] {
    const goals: string[] = [];

    try {
      // 全体スコアに基づく目標
      if (overallScore < 60) {
        goals.push("3ヶ月以内に全体的な成績を70%以上に向上させる");
      } else if (overallScore < 80) {
        goals.push("2ヶ月以内に全体的な成績を85%以上に向上させる");
      } else {
        goals.push("現在の高いレベルを維持しながら、さらなる専門性を追求する");
      }

      // 弱点に基づく目標
      if (weaknessAreas.length > 0) {
        const majorWeakness = weaknessAreas[0];
        goals.push(`${majorWeakness.category}分野で70%以上の正答率を達成する`);
      }

      // 強みに基づく目標
      if (strengthAreas.length > 0) {
        const topStrength = strengthAreas[0];
        if (topStrength.masteryLevel !== "expert") {
          goals.push(
            `${topStrength.category}分野でエキスパートレベルに到達する`
          );
        }
      }

      // 総合的な目標
      goals.push("学習の一貫性を保ち、週3回以上の学習習慣を確立する");
      goals.push("1日平均15分以上の効率的な学習を継続する");

      return goals.slice(0, 5); // 上位5つの目標
    } catch (error) {
      handleLearningError("generate long term goals", error as Error);
      return ["継続的な学習習慣の確立"];
    }
  }

  /**
   * カテゴリー別成績分析
   */
  private static analyzeCategoryPerformance(): Record<string, any> {
    const performance: Record<string, any> = {};

    sessions.forEach((session) => {
      const category = session.category || "unknown";
      if (!performance[category]) {
        performance[category] = {
          correct: 0,
          total: 0,
          accuracy: 0,
          recentScores: [],
          sampleSize: 0,
          consistency: 0,
          recentTrend: 0,
        };
      }

      if (session.isCorrect !== undefined) {
        performance[category].total++;
        if (session.isCorrect) {
          performance[category].correct++;
        }
        performance[category].recentScores.push(session.isCorrect ? 100 : 0);
      }
    });

    // 統計計算
    Object.values(performance).forEach((perf: any) => {
      if (perf.total > 0) {
        perf.accuracy = (perf.correct / perf.total) * 100;
        perf.sampleSize = perf.total;
        perf.consistency = this.calculateConsistency(perf.recentScores);
        perf.recentTrend = this.calculateTrend(perf.recentScores);
      }
    });

    return performance;
  }

  /**
   * 弱点エリアの作成
   */
  private static createWeaknessArea(): WeaknessArea | null {
    try {
      const severity = this.determineSeverity(
        performance.accuracy,
        performance.consistency
      );
      // const specificIssues = this.identifySpecificIssues(category, sessions);
      // const recommendations = this.generateRecommendations(
      //   category,
      //   performance,
      //   specificIssues
      // );

      return {
        category: "unknown",
        severity,
        confidence: Math.min(90, performance.sampleSize * 10),
        accuracy: performance.accuracy,
        frequency: (100 - performance.accuracy) / 100,
        recentTrend:
          performance.recentTrend > 0
            ? "improving"
            : performance.recentTrend < -5
            ? "worsening"
            : "stable",
        specificIssues: [],
        recommendations: [],
      };
    } catch (error) {
      handleLearningError("create weakness area", error as Error, {
        category: "unknown",
      });
      return null;
    }
  }

  /**
   * 文法弱点の分析
   */
  private static analyzeGrammarWeaknesses(sessions: any[]): WeaknessArea[] {
    const grammarWeaknesses: WeaknessArea[] = [];

    // 文法特有の分析ロジック
    const grammarCategories = [
      "basic-grammar",
      "tenses",
      "modals",
      "passive",
      "relative",
      "subjunctive",
      "comparison",
      "participle",
      "infinitive",
    ];

    grammarCategories.forEach((category) => {
      const categoryData = sessions.filter((s) => s.category === category);
      if (categoryData.length >= 3) {
        const accuracy =
          (categoryData.filter((s) => s.isCorrect).length /
            categoryData.length) *
          100;
        if (accuracy < this.WEAKNESS_THRESHOLD) {
          // 具体的な文法弱点を作成
          // 実装は簡略化
        }
      }
    });

    return grammarWeaknesses;
  }

  /**
   * 語彙弱点の分析
   */
  private static analyzeVocabularyWeaknesses(
    learningProgress: LearningProgress[]
  ): WeaknessArea[] {
    const vocabularyWeaknesses: WeaknessArea[] = [];

    // 語彙特有の分析ロジック
    const vocabProgress = learningProgress.filter((p) =>
      p.itemId.includes("vocab")
    );

    if (vocabProgress.length > 0) {
      const avgMastery =
        vocabProgress.reduce((sum, p) => sum + p.masteryLevel, 0) /
        vocabProgress.length;

      if (avgMastery < 60) {
        vocabularyWeaknesses.push({
          category: "vocabulary",
          severity: "moderate",
          confidence: 80,
          accuracy: avgMastery,
          frequency: 0.4,
          recentTrend: "stable",
          specificIssues: ["単語の記憶定着が不十分", "使用場面の理解不足"],
          recommendations: ["間隔反復学習の実施", "文脈での使用練習"],
        });
      }
    }

    return vocabularyWeaknesses;
  }

  // ヘルパーメソッド（実装は簡略化）
  private static calculateOverallScore(
    weaknesses: WeaknessArea[],
    strengths: StrengthArea[]
  ): number {
    // 総合スコアの計算ロジック
    let score = 70; // ベーススコア

    // 弱点による減点
    weaknesses.forEach((w) => {
      const penalty = { severe: 15, moderate: 10, mild: 5 }[w.severity];
      score -= penalty;
    });

    // 強みによる加点
    strengths.forEach((s) => {
      const bonus = Math.min(10, (s.proficiency - 80) * 0.5);
      score += bonus;
    });

    return Math.max(0, Math.min(100, score));
  }

  private static determineSeverity(
    accuracy: number,
    consistency: number
  ): "mild" | "moderate" | "severe" {
    if (accuracy < 40 || consistency < 30) return "severe";
    if (accuracy < 55 || consistency < 50) return "moderate";
    return "mild";
  }

  private static determineMasteryLevel(
    proficiency: number,
    consistency: number
  ): "basic" | "intermediate" | "advanced" | "expert" {
    if (proficiency >= 95 && consistency >= 90) return "expert";
    if (proficiency >= 85 && consistency >= 80) return "advanced";
    if (proficiency >= 70 && consistency >= 60) return "intermediate";
    return "basic";
  }

  private static calculateConsistency(scores: number[]): number {
    if (scores.length < 2) return 50;
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  private static calculateTrend(scores: number[]): number {
    if (scores.length < 3) return 0;
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg =
      firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    return secondAvg - firstAvg;
  }

  private static identifySpecificIssues(): string[] {
    // カテゴリー別の具体的問題特定（簡略化）
    return ["詳細な問題分析が必要"];
  }

  private static generateRecommendations(): string[] {
    // カテゴリー別推奨事項生成（簡略化）
    return ["基礎練習を強化する", "定期的な復習を行う"];
  }

  private static analyzeTimeOfDayPerformance(): Record<number, any> {
    const timePerformance: Record<number, any> = {};

    // sessions.forEach((session) => {
    //   const hour = new Date(session.timestamp || Date.now()).getHours();
    //   if (!timePerformance[hour]) {
    //     timePerformance[hour] = { correct: 0, total: 0, accuracy: 0 };
    //   }
    //   timePerformance[hour].total++;
    //   if (session.isCorrect) {
    //     timePerformance[hour].correct++;
    //   }
    // });

    Object.values(timePerformance).forEach((perf: any) => {
      if (perf.total > 0) {
        perf.accuracy = (perf.correct / perf.total) * 100;
      }
    });

    return timePerformance;
  }

  private static analyzeOptimalSessionLength(sessions: any[]): number {
    // セッション長分析（簡略化）
    return 15; // 分
  }

  private static analyzeLearningSpeed(): "slow" | "normal" | "fast" {
    // 学習速度分析（簡略化）
    return "normal";
  }

  private static analyzeRetentionRate(sessions: any[]): number {
    // 記憶保持率分析（簡略化）
    return 75;
  }

  private static analyzeDifficultyProgression():
    | "gradual"
    | "normal"
    | "aggressive" {
    // 難易度進行分析（簡略化）
    return "normal";
  }

  private static analyzeMotivationalFactors(sessions: any[]): string[] {
    // モチベーション要因分析（簡略化）
    return ["即座のフィードバック", "達成感", "進捗の可視化"];
  }

  private static estimateImprovementTime(
    weaknessAreas: WeaknessArea[]
  ): Record<string, number> {
    const estimations: Record<string, number> = {};

    weaknessAreas.forEach((weakness) => {
      const baseTime = { severe: 8, moderate: 4, mild: 2 }[weakness.severity];
      const confidenceAdjustment = (100 - weakness.confidence) * 0.02;
      estimations[weakness.category] = Math.ceil(
        baseTime + confidenceAdjustment
      );
    });

    return estimations;
  }

  private static getDefaultAnalysis(userId: string): ComprehensiveAnalysis {
    return {
      userId,
      analysisDate: new Date().toISOString(),
      overallScore: 50,
      weaknessAreas: [],
      strengthAreas: [],
      learningPattern: this.getDefaultLearningPattern(),
      prioritizedActions: [],
      longTermGoals: ["継続的な学習習慣の確立"],
      estimatedImprovementTime: {},
    };
  }

  private static getDefaultLearningPattern(): LearningPattern {
    return {
      preferredTimeOfDay: [9, 14, 19],
      optimalSessionLength: 15,
      learningSpeed: "normal",
      retentionRate: 70,
      difficultyProgression: "normal",
      motivationalFactors: ["達成感", "進捗の可視化"],
    };
  }

  private static saveAnalysis(
    userId: string,
    analysis: ComprehensiveAnalysis
  ): void {
    try {
      const key = `${this.ANALYSIS_KEY}-${userId}`;
      localStorage.setItem(key, JSON.stringify(analysis));
    } catch (error) {
      handleLearningError("save analysis", error as Error, { userId });
    }
  }

  /**
   * 保存された分析を取得
   */
  static getStoredAnalysis(userId: string): ComprehensiveAnalysis | null {
    try {
      const key = `${this.ANALYSIS_KEY}-${userId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      handleLearningError("get stored analysis", error as Error, { userId });
      return null;
    }
  }
}
