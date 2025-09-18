import { LearningAnalytics, LearningInsight, LearningPattern } from "../types";
import { DataManager } from "./dataManager";

const LEARNING_ANALYTICS_KEY = "entp-learning-analytics";

/**
 * パーソナル学習インサイト分析システム
 * ENTPの知的好奇心と自己理解欲求に対応
 */
export class LearningAnalyzer {
  /**
   * 現在の学習パターンを分析
   */
  static analyzeLearningPattern(): LearningPattern {
    const userStats = DataManager.getUserStats();
    const sessions = this.getStudySessions();

    return {
      preferredDifficulty: this.getPreferredDifficulty(userStats),
      preferredCategory: this.getPreferredCategory(userStats),
      averageSessionTime: this.calculateAverageSessionTime(sessions),
      peakPerformanceHour: this.findPeakPerformanceHour(sessions),
      streakLength: userStats.currentStreak || 0,
      accuracyRate: this.calculateOverallAccuracy(userStats),
      learningVelocity: this.calculateLearningVelocity(userStats),
    };
  }

  /**
   * パーソナライズされた学習インサイトを生成
   */
  static generateLearningInsight(): LearningInsight {
    const pattern = this.analyzeLearningPattern();
    const analytics = this.getAnalytics();

    const learnerType = this.determineLearnerType(pattern, analytics);
    const strengths = this.identifyStrengths(pattern, analytics);
    const improvements = this.identifyImprovementAreas(pattern, analytics);
    const recommendations = this.generateRecommendations(pattern, learnerType);
    const uniquePattern = this.generateUniquePattern(pattern);

    return {
      learnerType,
      primaryStrengths: strengths,
      improvementAreas: improvements,
      personalizedRecommendations: recommendations,
      uniquePattern,
      confidenceScore: this.calculateConfidenceScore(analytics),
      lastAnalyzed: new Date(),
    };
  }

  /**
   * 学習者タイプを判定
   */
  private static determineLearnerType(
    pattern: LearningPattern,
    analytics: LearningAnalytics
  ): LearningInsight["learnerType"] {
    // 効率重視型の判定
    if (pattern.learningVelocity > 50 && pattern.accuracyRate > 0.8) {
      return "効率重視型";
    }

    // 探求型の判定
    if (
      analytics.strongestCategories.length > 3 &&
      pattern.averageSessionTime > 15
    ) {
      return "探求型";
    }

    // 競争型の判定
    if (pattern.streakLength > 7 && pattern.learningVelocity > 40) {
      return "競争型";
    }

    // 創造型の判定
    if (analytics.totalStudySessions > 20 && pattern.averageSessionTime > 20) {
      return "創造型";
    }

    return "バランス型";
  }

  /**
   * 学習の強みを特定
   */
  private static identifyStrengths(
    pattern: LearningPattern,
    analytics: LearningAnalytics
  ): string[] {
    const strengths: string[] = [];

    if (pattern.accuracyRate > 0.85) {
      strengths.push("高い正解率を維持");
    }

    if (pattern.learningVelocity > 45) {
      strengths.push("学習スピードが速い");
    }

    if (pattern.streakLength > 5) {
      strengths.push("継続力が強い");
    }

    if (analytics.strongestCategories.length > 2) {
      strengths.push("幅広い分野に対応");
    }

    if (pattern.averageSessionTime > 10) {
      strengths.push("集中力が持続");
    }

    return strengths.length > 0 ? strengths : ["着実に学習を継続"];
  }

  /**
   * 改善エリアを特定
   */
  private static identifyImprovementAreas(
    pattern: LearningPattern,
    analytics: LearningAnalytics
  ): string[] {
    const areas: string[] = [];

    if (pattern.accuracyRate < 0.7) {
      areas.push("正解率の向上");
    }

    if (pattern.learningVelocity < 20) {
      areas.push("学習ペースの向上");
    }

    if (pattern.averageSessionTime < 5) {
      areas.push("学習時間の延長");
    }

    if (analytics.improvementTrend === "要改善") {
      areas.push("学習方法の見直し");
    }

    return areas.length > 0 ? areas : ["現在のペースを維持"];
  }

  /**
   * パーソナライズされた推奨事項を生成
   */
  private static generateRecommendations(
    pattern: LearningPattern,
    learnerType: LearningInsight["learnerType"]
  ): string[] {
    const recommendations: string[] = [];

    switch (learnerType) {
      case "効率重視型":
        recommendations.push("タイムアタックモードで更なる効率化を");
        recommendations.push("難易度を上げて新しい挑戦を");
        break;

      case "探求型":
        recommendations.push("事前学習コンテンツで知識を深める");
        recommendations.push("異なるカテゴリーを組み合わせて学習");
        break;

      case "競争型":
        recommendations.push("毎日のストリーク記録更新を目指す");
        recommendations.push("効率性スコアで自己ベスト更新");
        break;

      case "創造型":
        recommendations.push("英作文で創造性を発揮");
        recommendations.push("学んだ単語で独自のストーリー作成");
        break;

      default:
        recommendations.push("様々な学習モードを試してみる");
        recommendations.push("自分に最適な学習パターンを発見");
    }

    // 時間帯の推奨
    if (pattern.peakPerformanceHour >= 0) {
      const hour = pattern.peakPerformanceHour;
      recommendations.push(`${hour}時頃の学習が最も効果的`);
    }

    return recommendations;
  }

  /**
   * ユニークな学習パターンを説明
   */
  private static generateUniquePattern(pattern: LearningPattern): string {
    const patterns = [
      `${pattern.preferredDifficulty}レベルを好み、平均${pattern.averageSessionTime}分の集中学習`,
      `正解率${Math.round(
        pattern.accuracyRate * 100
      )}%の安定したパフォーマンス`,
      `1日あたり${Math.round(pattern.learningVelocity)}XPの着実な成長`,
      `${pattern.streakLength}日間の継続学習記録`,
    ];

    return patterns.join("、") + "が特徴的です";
  }

  /**
   * 分析の信頼度を計算
   */
  private static calculateConfidenceScore(
    analytics: LearningAnalytics
  ): number {
    // 学習セッション数に基づく信頼度
    const sessionScore = Math.min(analytics.totalStudySessions / 20, 1);

    // 学習時間に基づく信頼度
    const timeScore = Math.min(analytics.totalStudyTime / 300, 1); // 5時間で満点

    return (sessionScore + timeScore) / 2;
  }

  /**
   * 好みの難易度を分析
   */
  private static getPreferredDifficulty(
    userStats: any
  ): LearningPattern["preferredDifficulty"] {
    // 実際の選択履歴から判定（仮実装）
    return "beginner"; // TODO: 実際の選択履歴から分析
  }

  /**
   * 好みのカテゴリを分析
   */
  private static getPreferredCategory(userStats: any): string {
    // 最も多く学習したカテゴリを返す（仮実装）
    return "grammar"; // TODO: 実際の学習履歴から分析
  }

  /**
   * 平均セッション時間を計算
   */
  private static calculateAverageSessionTime(sessions: any[]): number {
    if (sessions.length === 0) return 10; // デフォルト値

    const totalTime = sessions.reduce(
      (sum, session) => sum + (session.duration || 10),
      0
    );
    return Math.round(totalTime / sessions.length);
  }

  /**
   * パフォーマンスピーク時間を特定
   */
  private static findPeakPerformanceHour(sessions: any[]): number {
    // 時間別の正解率を分析（仮実装）
    const currentHour = new Date().getHours();
    return currentHour; // TODO: 実際の時間別パフォーマンス分析
  }

  /**
   * 全体的な正解率を計算
   */
  private static calculateOverallAccuracy(userStats: any): number {
    const correctAnswers = userStats.correctAnswers || 0;
    const totalQuestions = userStats.totalQuestions || 1;
    return Math.min(correctAnswers / totalQuestions, 1);
  }

  /**
   * 学習速度を計算（XP/日）
   */
  private static calculateLearningVelocity(userStats: any): number {
    const totalXP = userStats.totalXP || 0;
    const daysActive = Math.max(userStats.currentStreak || 1, 1);
    return Math.round(totalXP / daysActive);
  }

  /**
   * 学習セッション履歴を取得
   */
  private static getStudySessions(): any[] {
    try {
      const data = localStorage.getItem(LEARNING_ANALYTICS_KEY);
      return data ? JSON.parse(data).sessions || [] : [];
    } catch {
      return [];
    }
  }

  /**
   * 学習分析データを取得
   */
  static getAnalytics(): LearningAnalytics {
    const userStats = DataManager.getUserStats();

    return {
      totalStudySessions: userStats.totalQuestions || 0,
      totalStudyTime: 0, // TODO: 実際の学習時間追跡
      averageAccuracy: this.calculateOverallAccuracy(userStats),
      strongestCategories: ["grammar", "vocabulary"], // TODO: 実際の分析
      improvementTrend: userStats.currentStreak > 3 ? "上昇中" : "安定",
      weeklyProgress: [10, 15, 20, 25, 30, 35, 40], // TODO: 実際の週次進捗
      monthlyXpGain: userStats.totalXP || 0,
    };
  }

  /**
   * 学習セッションを記録
   */
  static recordSession(sessionData: {
    duration: number;
    accuracy: number;
    category: string;
    difficulty: string;
    xpGained: number;
  }): void {
    try {
      const data = this.getStoredData();
      const session = {
        ...sessionData,
        timestamp: new Date().toISOString(),
        hour: new Date().getHours(),
      };

      data.sessions.push(session);

      // 最新100セッションのみ保持
      if (data.sessions.length > 100) {
        data.sessions = data.sessions.slice(-100);
      }

      localStorage.setItem(LEARNING_ANALYTICS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("学習セッション記録エラー:", error);
    }
  }

  /**
   * 保存されたデータを取得
   */
  private static getStoredData(): { sessions: any[] } {
    try {
      const data = localStorage.getItem(LEARNING_ANALYTICS_KEY);
      return data ? JSON.parse(data) : { sessions: [] };
    } catch {
      return { sessions: [] };
    }
  }
}
