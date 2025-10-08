/**
 * 適応的難易度調整システム
 * ユーザーのリアルタイム成績に基づいて動的に難易度を調整
 */

import { handleLearningError } from "./errorHandler";
import { logLearning } from "./logger";

export interface DifficultyAdjustment {
  currentDifficulty: number; // 0-100
  recommendedDifficulty: number; // 0-100
  adjustment: number; // -50 to +50
  reason: string;
  confidence: number; // 0-100
}

export interface PerformanceMetrics {
  accuracy: number; // 正答率
  speed: number; // 回答速度（秒）
  consistency: number; // 一貫性スコア
  engagement: number; // エンゲージメントスコア
  recentTrend: "improving" | "stable" | "declining";
}

export interface AdaptiveSession {
  sessionId: string;
  userId: string;
  startTime: string;
  questions: AdaptiveQuestion[];
  currentDifficulty: number;
  targetAccuracy: number; // 目標正答率（通常70-80%）
  adjustmentHistory: DifficultyAdjustment[];
}

export interface AdaptiveQuestion {
  questionId: string;
  difficulty: number;
  timeToAnswer: number;
  isCorrect: boolean;
  confidence: number; // ユーザーの回答時の自信度
  timestamp: string;
}

export class AdaptiveDifficultySystem {
  private static readonly SESSION_KEY = "entp-adaptive-sessions";
  private static readonly TARGET_ACCURACY = 75; // 目標正答率
  private static readonly ADJUSTMENT_THRESHOLD = 3; // 調整を行う問題数の閾値
  private static readonly MAX_ADJUSTMENT = 15; // 一度の最大調整値

  /**
   * 新しい適応セッションを開始
   */
  static startAdaptiveSession(
    userId: string,
    initialDifficulty: number = 50,
    targetAccuracy: number = this.TARGET_ACCURACY
  ): AdaptiveSession {
    const session: AdaptiveSession = {
      sessionId: `adaptive_${Date.now()}_${userId}`,
      userId,
      startTime: new Date().toISOString(),
      questions: [],
      currentDifficulty: initialDifficulty,
      targetAccuracy,
      adjustmentHistory: [],
    };

    logLearning(`適応セッション開始: ${userId}`, {
      sessionId: session.sessionId,
      initialDifficulty,
      targetAccuracy,
    });

    return session;
  }

  /**
   * 問題回答を記録し、必要に応じて難易度を調整
   */
  static recordAnswer(
    session: AdaptiveSession,
    questionId: string,
    difficulty: number,
    isCorrect: boolean,
    timeToAnswer: number,
    confidence: number = 50
  ): DifficultyAdjustment | null {
    try {
      // 問題記録
      const question: AdaptiveQuestion = {
        questionId,
        difficulty,
        timeToAnswer,
        isCorrect,
        confidence,
        timestamp: new Date().toISOString(),
      };

      session.questions.push(question);

      // 調整が必要かチェック
      if (session.questions.length >= this.ADJUSTMENT_THRESHOLD) {
        const adjustment = this.calculateDifficultyAdjustment(session);

        if (Math.abs(adjustment.adjustment) > 2) {
          // 最小調整値
          session.currentDifficulty = adjustment.recommendedDifficulty;
          session.adjustmentHistory.push(adjustment);

          logLearning(`難易度調整実行: ${session.userId}`, {
            sessionId: session.sessionId,
            oldDifficulty: adjustment.currentDifficulty,
            newDifficulty: adjustment.recommendedDifficulty,
            reason: adjustment.reason,
          });

          this.saveSession(session);
          return adjustment;
        }
      }

      this.saveSession(session);
      return null;
    } catch (error) {
      handleLearningError("record adaptive answer", error as Error, {
        userId: session.userId,
        sessionId: session.sessionId,
      });
      return null;
    }
  }

  /**
   * 現在のパフォーマンス指標を計算
   */
  static calculatePerformanceMetrics(
    session: AdaptiveSession
  ): PerformanceMetrics {
    const recentQuestions = session.questions.slice(-10); // 最新10問

    if (recentQuestions.length === 0) {
      return {
        accuracy: 0,
        speed: 0,
        consistency: 0,
        engagement: 0,
        recentTrend: "stable",
      };
    }

    // 正答率計算
    const correctAnswers = recentQuestions.filter((q) => q.isCorrect).length;
    const accuracy = (correctAnswers / recentQuestions.length) * 100;

    // 平均回答速度（適切な速度を100として正規化）
    const avgTime =
      recentQuestions.reduce((sum, q) => sum + q.timeToAnswer, 0) /
      recentQuestions.length;
    const speed = Math.max(0, 100 - (avgTime - 10) * 2); // 10秒を基準とした速度スコア

    // 一貫性（正答率の安定性）
    const accuracyVariance = this.calculateVariance(
      recentQuestions.map((q) => (q.isCorrect ? 100 : 0))
    );
    const consistency = Math.max(0, 100 - accuracyVariance);

    // エンゲージメント（自信度の平均）
    const avgConfidence =
      recentQuestions.reduce((sum, q) => sum + q.confidence, 0) /
      recentQuestions.length;
    const engagement = avgConfidence;

    // 最近の傾向分析
    const recentTrend = this.analyzeTrend(session.questions);

    return {
      accuracy,
      speed,
      consistency,
      engagement,
      recentTrend,
    };
  }

  /**
   * 最適な次の問題難易度を推奨
   */
  static recommendNextQuestionDifficulty(session: AdaptiveSession): number {
    const metrics = this.calculatePerformanceMetrics(session);
    let recommendedDifficulty = session.currentDifficulty;

    // パフォーマンスに基づく調整
    if (metrics.accuracy > session.targetAccuracy + 10) {
      // 正答率が高すぎる場合は難易度を上げる
      recommendedDifficulty += 5;
    } else if (metrics.accuracy < session.targetAccuracy - 10) {
      // 正答率が低すぎる場合は難易度を下げる
      recommendedDifficulty -= 5;
    }

    // 速度による微調整
    if (metrics.speed > 80 && metrics.accuracy > session.targetAccuracy) {
      recommendedDifficulty += 2; // 早くて正確なら少し上げる
    } else if (metrics.speed < 40) {
      recommendedDifficulty -= 2; // 遅い場合は少し下げる
    }

    // エンゲージメントによる調整
    if (metrics.engagement < 30) {
      recommendedDifficulty -= 3; // 自信がない場合は下げる
    }

    // 範囲制限
    return Math.max(10, Math.min(90, recommendedDifficulty));
  }

  /**
   * セッション全体の学習効果を評価
   */
  static evaluateSessionEffectiveness(session: AdaptiveSession): {
    overallScore: number;
    learningGain: number;
    optimalChallengeRate: number;
    recommendations: string[];
  } {
    if (session.questions.length < 5) {
      return {
        overallScore: 0,
        learningGain: 0,
        optimalChallengeRate: 0,
        recommendations: ["より多くの問題に取り組んでデータを収集してください"],
      };
    }

    const metrics = this.calculatePerformanceMetrics(session);

    // 全体スコア（複数指標の重み付き平均）
    const overallScore =
      metrics.accuracy * 0.4 +
      metrics.consistency * 0.3 +
      metrics.engagement * 0.2 +
      metrics.speed * 0.1;

    // 学習効果（初期と最新の比較）
    const earlyQuestions = session.questions.slice(0, 5);
    const lateQuestions = session.questions.slice(-5);

    const earlyAccuracy =
      (earlyQuestions.filter((q) => q.isCorrect).length /
        earlyQuestions.length) *
      100;
    const lateAccuracy =
      (lateQuestions.filter((q) => q.isCorrect).length / lateQuestions.length) *
      100;
    const learningGain = lateAccuracy - earlyAccuracy;

    // 最適チャレンジ率（目標正答率との差）
    const accuracyDiff = Math.abs(metrics.accuracy - session.targetAccuracy);
    const optimalChallengeRate = Math.max(0, 100 - accuracyDiff * 2);

    // 推奨事項生成
    const recommendations = this.generateRecommendations(session, metrics);

    return {
      overallScore,
      learningGain,
      optimalChallengeRate,
      recommendations,
    };
  }

  /**
   * 長期的な適応パターンを分析
   */
  static analyzeLongTermAdaptation(userId: string): {
    preferredDifficultyRange: [number, number];
    learningVelocity: number;
    adaptabilityScore: number;
    recommendations: string[];
  } {
    try {
      const sessions = this.getUserSessions(userId);

      if (sessions.length < 3) {
        return {
          preferredDifficultyRange: [40, 60],
          learningVelocity: 0,
          adaptabilityScore: 50,
          recommendations: [
            "より多くのセッションを完了してパターン分析を行ってください",
          ],
        };
      }

      // 好みの難易度範囲を分析
      // const _allDifficulties = sessions.flatMap((s) =>
      //   s.questions.map((q) => q.difficulty)
      // );
      const successfulDifficulties = sessions.flatMap((s) =>
        s.questions.filter((q) => q.isCorrect).map((q) => q.difficulty)
      );

      const minPreferred = Math.min(...successfulDifficulties);
      const maxPreferred = Math.max(...successfulDifficulties);
      const preferredDifficultyRange: [number, number] = [
        Math.max(10, minPreferred - 5),
        Math.min(90, maxPreferred + 5),
      ];

      // 学習速度（時間あたりの難易度向上）
      const firstSession = sessions[0];
      const lastSession = sessions[sessions.length - 1];
      const timeDiff =
        (new Date(lastSession.startTime).getTime() -
          new Date(firstSession.startTime).getTime()) /
        (1000 * 60 * 60); // 時間
      const difficultyImprovement =
        lastSession.currentDifficulty - firstSession.currentDifficulty;
      const learningVelocity =
        timeDiff > 0 ? difficultyImprovement / timeDiff : 0;

      // 適応性スコア（調整の適切性）
      const totalAdjustments = sessions.reduce(
        (sum, s) => sum + s.adjustmentHistory.length,
        0
      );
      const successfulAdjustments = sessions.reduce(
        (sum, s) =>
          sum + s.adjustmentHistory.filter((adj) => adj.confidence > 70).length,
        0
      );
      const adaptabilityScore =
        totalAdjustments > 0
          ? (successfulAdjustments / totalAdjustments) * 100
          : 50;

      const recommendations = [
        `最適な難易度範囲: ${preferredDifficultyRange[0]}-${preferredDifficultyRange[1]}`,
        learningVelocity > 0
          ? "順調に難易度が向上しています"
          : "難易度向上のペースを上げることを検討してください",
        adaptabilityScore > 70
          ? "適応的学習が効果的に機能しています"
          : "学習パターンの見直しを推奨します",
      ];

      return {
        preferredDifficultyRange,
        learningVelocity,
        adaptabilityScore,
        recommendations,
      };
    } catch (error) {
      handleLearningError("analyze long term adaptation", error as Error, {
        userId,
      });
      return {
        preferredDifficultyRange: [40, 60],
        learningVelocity: 0,
        adaptabilityScore: 50,
        recommendations: ["分析エラーが発生しました"],
      };
    }
  }

  /**
   * 難易度調整を計算
   */
  private static calculateDifficultyAdjustment(
    session: AdaptiveSession
  ): DifficultyAdjustment {
    const recentQuestions = session.questions.slice(-this.ADJUSTMENT_THRESHOLD);
    const metrics = this.calculatePerformanceMetrics(session);

    let adjustment = 0;
    const reasons = [];

    // 正答率による調整
    const accuracyDiff = metrics.accuracy - session.targetAccuracy;
    if (Math.abs(accuracyDiff) > 5) {
      const accuracyAdjustment = accuracyDiff * 0.3; // 正答率差の30%を調整
      adjustment += accuracyAdjustment;
      reasons.push(
        `正答率${metrics.accuracy.toFixed(1)}%（目標${
          session.targetAccuracy
        }%）`
      );
    }

    // 速度による調整
    if (metrics.speed > 80 && metrics.accuracy > session.targetAccuracy) {
      adjustment += 3;
      reasons.push("高速かつ正確");
    } else if (metrics.speed < 40) {
      adjustment -= 2;
      reasons.push("回答速度が遅い");
    }

    // 一貫性による調整
    if (metrics.consistency < 50) {
      adjustment -= 2;
      reasons.push("回答の一貫性が低い");
    }

    // エンゲージメントによる調整
    if (metrics.engagement < 30) {
      adjustment -= 3;
      reasons.push("自信度が低い");
    }

    // 調整値の制限
    adjustment = Math.max(
      -this.MAX_ADJUSTMENT,
      Math.min(this.MAX_ADJUSTMENT, adjustment)
    );

    const recommendedDifficulty = Math.max(
      10,
      Math.min(90, session.currentDifficulty + adjustment)
    );

    return {
      currentDifficulty: session.currentDifficulty,
      recommendedDifficulty,
      adjustment,
      reason: reasons.join("、"),
      confidence: this.calculateAdjustmentConfidence(
        recentQuestions.length,
        metrics
      ),
    };
  }

  /**
   * 傾向を分析
   */
  private static analyzeTrend(
    questions: AdaptiveQuestion[]
  ): "improving" | "stable" | "declining" {
    if (questions.length < 6) return "stable";

    const recent = questions.slice(-6);
    const firstHalf = recent.slice(0, 3);
    const secondHalf = recent.slice(3);

    const firstAccuracy =
      firstHalf.filter((q) => q.isCorrect).length / firstHalf.length;
    const secondAccuracy =
      secondHalf.filter((q) => q.isCorrect).length / secondHalf.length;

    const diff = secondAccuracy - firstAccuracy;

    if (diff > 0.1) return "improving";
    if (diff < -0.1) return "declining";
    return "stable";
  }

  /**
   * 分散を計算
   */
  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * 調整の信頼度を計算
   */
  private static calculateAdjustmentConfidence(
    sampleSize: number,
    metrics: PerformanceMetrics
  ): number {
    let confidence = 50;

    // サンプルサイズによる調整
    confidence += Math.min(sampleSize * 5, 25);

    // 一貫性による調整
    confidence += metrics.consistency * 0.2;

    // エンゲージメントによる調整
    confidence += metrics.engagement * 0.1;

    return Math.min(100, confidence);
  }

  /**
   * 推奨事項を生成
   */
  private static generateRecommendations(
    _session: AdaptiveSession,
    metrics: PerformanceMetrics
  ): string[] {
    const recommendations = [];

    if (metrics.accuracy < 60) {
      recommendations.push("基礎的な問題により多く取り組むことをお勧めします");
    } else if (metrics.accuracy > 85) {
      recommendations.push("より挑戦的な問題に取り組んでみましょう");
    }

    if (metrics.speed < 40) {
      recommendations.push("時間を意識した練習を行うと良いでしょう");
    }

    if (metrics.consistency < 50) {
      recommendations.push("復習を通じて知識の定着を図りましょう");
    }

    if (metrics.engagement < 40) {
      recommendations.push(
        "自信を持って回答できるレベルから始めることをお勧めします"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("現在のペースを維持して学習を続けてください");
    }

    return recommendations;
  }

  /**
   * セッションを保存
   */
  private static saveSession(session: AdaptiveSession): void {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      const sessions: AdaptiveSession[] = stored ? JSON.parse(stored) : [];

      const existingIndex = sessions.findIndex(
        (s) => s.sessionId === session.sessionId
      );
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      // 最新50セッションのみ保持
      if (sessions.length > 50) {
        sessions.splice(0, sessions.length - 50);
      }

      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessions));
    } catch (error) {
      handleLearningError("save adaptive session", error as Error, {
        sessionId: session.sessionId,
      });
    }
  }

  /**
   * ユーザーのセッションを取得
   */
  private static getUserSessions(userId: string): AdaptiveSession[] {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (stored) {
        const allSessions: AdaptiveSession[] = JSON.parse(stored);
        return allSessions.filter((s) => s.userId === userId);
      }
    } catch (error) {
      handleLearningError("get user sessions", error as Error, { userId });
    }
    return [];
  }
}
