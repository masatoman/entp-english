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
    _userStats: any
  ): LearningPattern["preferredDifficulty"] {
    // 実際の選択履歴から判定（仮実装）
    const sessions = this.getStudySessions();
    return this.analyzeDifficultyPreference(sessions) as "beginner" | "intermediate" | "advanced";
  }

  /**
   * 好みのカテゴリを分析
   */
  private static getPreferredCategory(_userStats: any): string {
    // 最も多く学習したカテゴリを返す（仮実装）
    const sessions = this.getStudySessions();
    return this.analyzeContentPreference(sessions);
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
    return this.analyzeBestStudyTime(sessions);
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
    const sessions = this.getStudySessions();

    return {
      totalStudySessions: (userStats as any).totalQuestions || 0,
      totalStudyTime: this.calculateTotalStudyTime(sessions),
      averageAccuracy: this.calculateOverallAccuracy(userStats),
      strongestCategories: this.analyzeStrongestCategories(sessions),
      improvementTrend: userStats.currentStreak > 3 ? "上昇中" : "安定",
      weeklyProgress: this.calculateWeeklyProgress(sessions),
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

  /**
   * 難易度選択傾向を分析
   */
  private static analyzeDifficultyPreference(sessions: any[]): string {
    if (sessions.length === 0) return "beginner";

    const difficultyCounts = sessions.reduce((acc, session) => {
      const difficulty = session.difficulty || "normal";
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsed = Object.entries(difficultyCounts).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];

    return mostUsed ? mostUsed[0] : "beginner";
  }

  /**
   * コンテンツ選択傾向を分析
   */
  private static analyzeContentPreference(sessions: any[]): string {
    if (sessions.length === 0) return "grammar";

    const contentCounts = sessions.reduce((acc, session) => {
      const type = session.type || "grammar";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsed = Object.entries(contentCounts).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0];

    return mostUsed ? mostUsed[0] : "grammar";
  }

  /**
   * 最適な学習時間を分析
   */
  private static analyzeBestStudyTime(sessions: any[]): number {
    if (sessions.length === 0) return new Date().getHours();

    const hourPerformance = sessions.reduce((acc, session) => {
      const hour = session.hour || new Date().getHours();
      const score = session.score || 0;

      if (!acc[hour]) {
        acc[hour] = { totalScore: 0, count: 0 };
      }
      acc[hour].totalScore += score;
      acc[hour].count += 1;
      return acc;
    }, {} as Record<number, { totalScore: number; count: number }>);

    let bestHour = new Date().getHours();
    let bestAverage = 0;

    Object.entries(hourPerformance).forEach(([hour, data]) => {
      const average = (data as any).totalScore / (data as any).count;
      if (average > bestAverage) {
        bestAverage = average;
        bestHour = parseInt(hour);
      }
    });

    return bestHour;
  }

  /**
   * 総学習時間を計算
   */
  private static calculateTotalStudyTime(sessions: any[]): number {
    return sessions.reduce((total, session) => {
      return total + (session.studyTime || 0);
    }, 0);
  }

  /**
   * 最も強いカテゴリを分析
   */
  private static analyzeStrongestCategories(sessions: any[]): string[] {
    if (sessions.length === 0) return ["grammar", "vocabulary"];

    const categoryPerformance = sessions.reduce((acc, session) => {
      const category = session.category || "grammar";
      const score = session.score || 0;

      if (!acc[category]) {
        acc[category] = { totalScore: 0, count: 0 };
      }
      acc[category].totalScore += score;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { totalScore: number; count: number }>);

    const averages = Object.entries(categoryPerformance)
      .map(([category, data]) => ({
        category,
        average: (data as any).totalScore / (data as any).count,
      }))
      .sort((a, b) => b.average - a.average);

    return averages.slice(0, 2).map((item) => item.category);
  }

  /**
   * 週次進捗を計算
   */
  private static calculateWeeklyProgress(sessions: any[]): number[] {
    const weeklyData = new Array(7).fill(0);
    const now = new Date();

    sessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp || now);
      const daysDiff = Math.floor(
        (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff < 7) {
        const dayIndex = 6 - daysDiff; // 今日を6、昨日を5...
        weeklyData[dayIndex] += session.score || 0;
      }
    });

    return weeklyData;
  }
}
