import { getQuestionsByPart } from "../data/toeicMockTestQuestions";
import {
  TOEICProgress,
  TOEICQuestion,
  TOEICTestConfig,
  TOEICTestResult,
  TOEICTestSession,
} from "../types/mockTest";

class TOEICMockTestManager {
  private static instance: TOEICMockTestManager;
  private currentSession: TOEICTestSession | null = null;

  private constructor() {}

  static getInstance(): TOEICMockTestManager {
    if (!TOEICMockTestManager.instance) {
      TOEICMockTestManager.instance = new TOEICMockTestManager();
    }
    return TOEICMockTestManager.instance;
  }

  /**
   * 新しいテストセッションを開始
   */
  startTest(config: TOEICTestConfig): TOEICTestSession {
    const sessionId = `toeic_${Date.now()}`;
    const questions = this.generateTestQuestions(config);

    this.currentSession = {
      id: sessionId,
      testType: config.testType,
      startTime: new Date(),
      answers: {},
      timeSpent: 0,
      completed: false,
    };

    // セッションをローカルストレージに保存
    this.saveSession(this.currentSession);

    return this.currentSession;
  }

  /**
   * テスト問題を生成
   */
  private generateTestQuestions(config: TOEICTestConfig): TOEICQuestion[] {
    const questions: TOEICQuestion[] = [];

    if (config.testType === "listening" || config.testType === "full") {
      // リスニング問題 (Part 1-4)
      const listeningParts = config.parts.filter((p) => p <= 4);
      listeningParts.forEach((part) => {
        const partQuestions = getQuestionsByPart(part);
        if (partQuestions.length > 0) {
          questions.push(...partQuestions);
        }
      });
    }

    if (config.testType === "reading" || config.testType === "full") {
      // リーディング問題 (Part 5-7)
      const readingParts = config.parts.filter((p) => p >= 5);
      readingParts.forEach((part) => {
        const partQuestions = getQuestionsByPart(part);
        if (partQuestions.length > 0) {
          questions.push(...partQuestions);
        }
      });
    }

    return questions;
  }

  /**
   * 回答を記録
   */
  recordAnswer(questionId: string, answer: number): void {
    if (!this.currentSession) {
      throw new Error("No active test session");
    }

    this.currentSession.answers[questionId] = answer;
    this.saveSession(this.currentSession);
  }

  /**
   * テストを完了
   */
  completeTest(): TOEICTestResult {
    if (!this.currentSession) {
      throw new Error("No active test session");
    }

    const endTime = new Date();
    this.currentSession.endTime = endTime;
    this.currentSession.completed = true;
    this.currentSession.timeSpent = Math.floor(
      (endTime.getTime() - this.currentSession.startTime.getTime()) / 1000
    );

    // スコア計算
    const result = this.calculateScore(this.currentSession);

    // 結果を保存
    this.saveTestResult(result);

    // 進捗を更新
    this.updateProgress(result);

    // セッションをクリア
    this.currentSession = null;

    return result;
  }

  /**
   * スコアを計算
   */
  private calculateScore(session: TOEICTestSession): TOEICTestResult {
    const questions = this.generateTestQuestions({
      testType: session.testType,
      timeLimit: 0,
      questionCount: { listening: 0, reading: 0 },
      parts: [1, 2, 3, 4, 5, 6, 7],
      difficulty: "mixed",
    });

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;
    const detailedResults: {
      part: number;
      correct: number;
      total: number;
      percentage: number;
    }[] = [];

    // パート別統計
    const partStats: Record<number, { correct: number; total: number }> = {};

    questions.forEach((question) => {
      const userAnswer = session.answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      if (userAnswer === undefined || userAnswer === null) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }

      // パート別統計を更新
      if (!partStats[question.part]) {
        partStats[question.part] = { correct: 0, total: 0 };
      }
      partStats[question.part].total++;
      if (isCorrect) {
        partStats[question.part].correct++;
      }
    });

    // パート別詳細結果を計算
    Object.entries(partStats).forEach(([part, stats]) => {
      detailedResults.push({
        part: parseInt(part),
        correct: stats.correct,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      });
    });

    // TOEICスコア計算（簡易版）
    const totalQuestions = questions.length;
    const correctPercentage = (correctAnswers / totalQuestions) * 100;

    // リスニング・リーディングスコア計算
    const listeningQuestions = questions.filter((q) => q.part <= 4);
    const readingQuestions = questions.filter((q) => q.part >= 5);

    const listeningCorrect = listeningQuestions.filter(
      (q) => session.answers[q.id] === q.correctAnswer
    ).length;

    const readingCorrect = readingQuestions.filter(
      (q) => session.answers[q.id] === q.correctAnswer
    ).length;

    const listeningScore =
      listeningQuestions.length > 0
        ? Math.round((listeningCorrect / listeningQuestions.length) * 495)
        : 0;

    const readingScore =
      readingQuestions.length > 0
        ? Math.round((readingCorrect / readingQuestions.length) * 495)
        : 0;

    const totalScore = listeningScore + readingScore;
    const percentile = this.calculatePercentile(totalScore);

    return {
      sessionId: session.id,
      testType: session.testType,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      score: {
        listening: listeningScore,
        reading: readingScore,
        total: totalScore,
        percentile,
      },
      timeSpent: session.timeSpent,
      completedAt: endTime,
      detailedResults,
      recommendations: this.generateRecommendations(detailedResults),
    };
  }

  /**
   * パーセンタイル計算（簡易版）
   */
  private calculatePercentile(score: number): number {
    // 実際のTOEICのパーセンタイル分布に基づく簡易計算
    if (score >= 990) return 99;
    if (score >= 900) return 95;
    if (score >= 800) return 85;
    if (score >= 700) return 70;
    if (score >= 600) return 50;
    if (score >= 500) return 30;
    if (score >= 400) return 15;
    return 5;
  }

  /**
   * 改善提案を生成
   */
  private generateRecommendations(
    detailedResults: {
      part: number;
      correct: number;
      total: number;
      percentage: number;
    }[]
  ): string[] {
    const recommendations: string[] = [];

    detailedResults.forEach((result) => {
      if (result.percentage < 60) {
        switch (result.part) {
          case 1:
            recommendations.push(
              "Part 1: 写真描写問題の練習を増やし、日常的な動作や場所の表現を覚えましょう。"
            );
            break;
          case 2:
            recommendations.push(
              "Part 2: 疑問詞（what, when, where, why, how）を聞き分ける練習をしましょう。"
            );
            break;
          case 3:
            recommendations.push(
              "Part 3: 会話の流れを把握し、話者の関係性や状況を理解する練習をしましょう。"
            );
            break;
          case 4:
            recommendations.push(
              "Part 4: 長い説明文を聞きながら要点を把握する練習をしましょう。"
            );
            break;
          case 5:
            recommendations.push(
              "Part 5: 文法問題の基礎を固め、語彙力を向上させましょう。"
            );
            break;
          case 6:
            recommendations.push(
              "Part 6: 文脈に応じた適切な語句選択の練習をしましょう。"
            );
            break;
          case 7:
            recommendations.push(
              "Part 7: 長文読解のスピードと精度を向上させましょう。"
            );
            break;
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push(
        "全体的に良好な成績です。より高得点を目指して継続的に学習を続けましょう。"
      );
    }

    return recommendations;
  }

  /**
   * 現在のセッションを取得
   */
  getCurrentSession(): TOEICTestSession | null {
    return this.currentSession;
  }

  /**
   * セッションを保存
   */
  private saveSession(session: TOEICTestSession): void {
    localStorage.setItem("toeic_current_session", JSON.stringify(session));
  }

  /**
   * セッションを読み込み
   */
  loadSession(): TOEICTestSession | null {
    try {
      const sessionData = localStorage.getItem("toeic_current_session");
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // 日付オブジェクトを復元
        session.startTime = new Date(session.startTime);
        if (session.endTime) {
          session.endTime = new Date(session.endTime);
        }
        this.currentSession = session;
        return session;
      }
    } catch (error) {
      console.error("Failed to load TOEIC session:", error);
    }
    return null;
  }

  /**
   * テスト結果を保存
   */
  private saveTestResult(result: TOEICTestResult): void {
    try {
      const results = this.getTestResults();
      results.unshift(result);
      // 最新の10件のみ保持
      const limitedResults = results.slice(0, 10);
      localStorage.setItem(
        "toeic_test_results",
        JSON.stringify(limitedResults)
      );
    } catch (error) {
      console.error("Failed to save TOEIC test result:", error);
    }
  }

  /**
   * テスト結果を取得
   */
  getTestResults(): TOEICTestResult[] {
    try {
      const resultsData = localStorage.getItem("toeic_test_results");
      if (resultsData) {
        const results = JSON.parse(resultsData);
        // 日付オブジェクトを復元
        return results.map((result: any) => ({
          ...result,
          completedAt: new Date(result.completedAt),
        }));
      }
    } catch (error) {
      console.error("Failed to load TOEIC test results:", error);
    }
    return [];
  }

  /**
   * 進捗を更新
   */
  private updateProgress(result: TOEICTestResult): void {
    try {
      const progress = this.getProgress();

      progress.totalTestsTaken++;
      progress.recentScores.push(result.score.total);
      // 最新の10件のみ保持
      if (progress.recentScores.length > 10) {
        progress.recentScores = progress.recentScores.slice(-10);
      }

      progress.averageScore =
        progress.recentScores.reduce((a, b) => a + b, 0) /
        progress.recentScores.length;

      if (result.score.total > progress.bestScore) {
        progress.bestScore = result.score.total;
      }

      progress.timeSpent += result.timeSpent;
      progress.lastTestDate = result.completedAt;

      // 改善傾向を計算
      if (progress.recentScores.length >= 2) {
        const recent = progress.recentScores.slice(-3);
        const older = progress.recentScores.slice(-6, -3);
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
          const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

          if (recentAvg > olderAvg + 20) {
            progress.improvementTrend = "up";
          } else if (recentAvg < olderAvg - 20) {
            progress.improvementTrend = "down";
          } else {
            progress.improvementTrend = "stable";
          }
        }
      }

      // パート別強み・弱みを更新
      result.detailedResults.forEach((detail) => {
        if (detail.percentage >= 80) {
          progress.partStrengths[detail.part] =
            (progress.partStrengths[detail.part] || 0) + 1;
        } else if (detail.percentage < 60) {
          progress.partWeaknesses[detail.part] =
            (progress.partWeaknesses[detail.part] || 0) + 1;
        }
      });

      localStorage.setItem("toeic_progress", JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to update TOEIC progress:", error);
    }
  }

  /**
   * 進捗を取得
   */
  getProgress(): TOEICProgress {
    try {
      const progressData = localStorage.getItem("toeic_progress");
      if (progressData) {
        const progress = JSON.parse(progressData);
        if (progress.lastTestDate) {
          progress.lastTestDate = new Date(progress.lastTestDate);
        }
        return progress;
      }
    } catch (error) {
      console.error("Failed to load TOEIC progress:", error);
    }

    // デフォルトの進捗を返す
    return {
      userId: "default-user",
      totalTestsTaken: 0,
      averageScore: 0,
      bestScore: 0,
      recentScores: [],
      partStrengths: {},
      partWeaknesses: {},
      timeSpent: 0,
      improvementTrend: "stable",
    };
  }

  /**
   * セッションをクリア
   */
  clearSession(): void {
    this.currentSession = null;
    localStorage.removeItem("toeic_current_session");
  }
}

export const toeicMockTestManager = TOEICMockTestManager.getInstance();
