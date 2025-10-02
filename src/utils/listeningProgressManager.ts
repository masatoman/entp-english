/**
 * リスニング学習進捗管理システム
 * IndexedDBを使用してリスニング学習の履歴と統計を管理
 */

import { dbManager, STORES } from "./IndexedDBManager";
import {
  ListeningProgress,
  ListeningStatistics,
  ListeningQuestionResult,
  ListeningPartStats,
  ListeningDifficultyStats,
} from "../types";

export class ListeningProgressManager {
  private static instance: ListeningProgressManager;

  public static getInstance(): ListeningProgressManager {
    if (!ListeningProgressManager.instance) {
      ListeningProgressManager.instance = new ListeningProgressManager();
    }
    return ListeningProgressManager.instance;
  }

  /**
   * リスニング学習セッションの開始
   */
  async startSession(
    userId: string,
    part: 'part1' | 'part2' | 'part3' | 'part4',
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    totalQuestions: number
  ): Promise<string> {
    const sessionId = `listening_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const progress: Omit<ListeningProgress, 'id' | 'completedAt' | 'questions'> = {
      userId,
      sessionId,
      part,
      difficulty,
      totalQuestions,
      correctAnswers: 0,
      score: 0,
      timeSpent: 0,
    };

    try {
      await dbManager.put(STORES.LISTENING_PROGRESS, {
        ...progress,
        id: sessionId,
        completedAt: new Date(),
        questions: [],
      });
      
      console.log(`📊 リスニング学習セッション開始: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error("リスニング学習セッション開始エラー:", error);
      throw error;
    }
  }

  /**
   * 問題回答の記録
   */
  async recordQuestionResult(
    sessionId: string,
    questionResult: ListeningQuestionResult
  ): Promise<void> {
    try {
      const progress = await dbManager.get<ListeningProgress>(
        STORES.LISTENING_PROGRESS,
        sessionId
      );

      if (!progress) {
        throw new Error(`セッションが見つかりません: ${sessionId}`);
      }

      // 問題結果を追加
      progress.questions.push(questionResult);
      
      // 統計を更新
      progress.correctAnswers = progress.questions.filter(q => q.isCorrect).length;
      progress.score = Math.round((progress.correctAnswers / progress.totalQuestions) * 100);
      progress.timeSpent = progress.questions.reduce((total, q) => total + q.timeSpent, 0);

      await dbManager.put(STORES.LISTENING_PROGRESS, progress);
      
      console.log(`📝 問題結果記録: ${questionResult.questionId} - ${questionResult.isCorrect ? '正解' : '不正解'}`);
    } catch (error) {
      console.error("問題結果記録エラー:", error);
      throw error;
    }
  }

  /**
   * 学習セッションの完了
   */
  async completeSession(sessionId: string): Promise<ListeningProgress> {
    try {
      const progress = await dbManager.get<ListeningProgress>(
        STORES.LISTENING_PROGRESS,
        sessionId
      );

      if (!progress) {
        throw new Error(`セッションが見つかりません: ${sessionId}`);
      }

      // 完了時刻を設定
      progress.completedAt = new Date();

      await dbManager.put(STORES.LISTENING_PROGRESS, progress);
      
      console.log(`✅ リスニング学習セッション完了: ${sessionId} (スコア: ${progress.score}%)`);
      
      return progress;
    } catch (error) {
      console.error("学習セッション完了エラー:", error);
      throw error;
    }
  }

  /**
   * ユーザーのリスニング学習統計を取得
   */
  async getUserStatistics(userId: string): Promise<ListeningStatistics> {
    try {
      const allProgress = await dbManager.getAll<ListeningProgress>(
        STORES.LISTENING_PROGRESS
      );

      const userProgress = allProgress.filter(p => p.userId === userId);

      if (userProgress.length === 0) {
        return this.createEmptyStatistics();
      }

      // 基本統計の計算
      const totalSessions = userProgress.length;
      const totalQuestions = userProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
      const totalCorrectAnswers = userProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
      const averageScore = Math.round(totalCorrectAnswers / totalQuestions * 100);
      const bestScore = Math.max(...userProgress.map(p => p.score));
      const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);

      // Part別統計
      const partStats = {
        part1: this.calculatePartStats(userProgress, 'part1'),
        part2: this.calculatePartStats(userProgress, 'part2'),
        part3: this.calculatePartStats(userProgress, 'part3'),
        part4: this.calculatePartStats(userProgress, 'part4'),
      };

      // 難易度別統計
      const difficultyStats = {
        beginner: this.calculateDifficultyStats(userProgress, 'beginner'),
        intermediate: this.calculateDifficultyStats(userProgress, 'intermediate'),
        advanced: this.calculateDifficultyStats(userProgress, 'advanced'),
      };

      // 連続学習日数の計算
      const { currentStreak, longestStreak } = this.calculateStreaks(userProgress);

      const statistics: ListeningStatistics = {
        totalSessions,
        totalQuestions,
        totalCorrectAnswers,
        averageScore,
        bestScore,
        totalTimeSpent,
        partStats,
        difficultyStats,
        lastSessionDate: userProgress[userProgress.length - 1]?.completedAt,
        currentStreak,
        longestStreak,
      };

      console.log(`📊 リスニング学習統計取得完了: ${userId}`);
      return statistics;
    } catch (error) {
      console.error("リスニング学習統計取得エラー:", error);
      throw error;
    }
  }

  /**
   * 最近の学習履歴を取得
   */
  async getRecentProgress(userId: string, limit: number = 10): Promise<ListeningProgress[]> {
    try {
      const allProgress = await dbManager.getAll<ListeningProgress>(
        STORES.LISTENING_PROGRESS
      );

      const userProgress = allProgress
        .filter(p => p.userId === userId)
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, limit);

      console.log(`📋 最近の学習履歴取得: ${userId} (${userProgress.length}件)`);
      return userProgress;
    } catch (error) {
      console.error("最近の学習履歴取得エラー:", error);
      throw error;
    }
  }

  /**
   * 空の統計オブジェクトを作成
   */
  private createEmptyStatistics(): ListeningStatistics {
    const emptyPartStats: ListeningPartStats = {
      totalSessions: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    };

    const emptyDifficultyStats: ListeningDifficultyStats = {
      totalSessions: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    };

    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrectAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      partStats: {
        part1: { ...emptyPartStats },
        part2: { ...emptyPartStats },
        part3: { ...emptyPartStats },
        part4: { ...emptyPartStats },
      },
      difficultyStats: {
        beginner: { ...emptyDifficultyStats },
        intermediate: { ...emptyDifficultyStats },
        advanced: { ...emptyDifficultyStats },
      },
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  /**
   * Part別統計を計算
   */
  private calculatePartStats(
    progress: ListeningProgress[],
    part: 'part1' | 'part2' | 'part3' | 'part4'
  ): ListeningPartStats {
    const partProgress = progress.filter(p => p.part === part);

    if (partProgress.length === 0) {
      return {
        totalSessions: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
      };
    }

    const totalSessions = partProgress.length;
    const totalQuestions = partProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
    const correctAnswers = partProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const averageScore = Math.round(correctAnswers / totalQuestions * 100);
    const bestScore = Math.max(...partProgress.map(p => p.score));
    const totalTimeSpent = partProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    return {
      totalSessions,
      totalQuestions,
      correctAnswers,
      averageScore,
      bestScore,
      totalTimeSpent,
    };
  }

  /**
   * 難易度別統計を計算
   */
  private calculateDifficultyStats(
    progress: ListeningProgress[],
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): ListeningDifficultyStats {
    const difficultyProgress = progress.filter(p => p.difficulty === difficulty);

    if (difficultyProgress.length === 0) {
      return {
        totalSessions: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
      };
    }

    const totalSessions = difficultyProgress.length;
    const totalQuestions = difficultyProgress.reduce((sum, p) => sum + p.totalQuestions, 0);
    const correctAnswers = difficultyProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const averageScore = Math.round(correctAnswers / totalQuestions * 100);
    const bestScore = Math.max(...difficultyProgress.map(p => p.score));
    const totalTimeSpent = difficultyProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    return {
      totalSessions,
      totalQuestions,
      correctAnswers,
      averageScore,
      bestScore,
      totalTimeSpent,
    };
  }

  /**
   * 連続学習日数を計算
   */
  private calculateStreaks(progress: ListeningProgress[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (progress.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // 日付順にソート
    const sortedProgress = progress.sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    // ユニークな日付を取得
    const uniqueDates = Array.from(
      new Set(
        sortedProgress.map(p => 
          new Date(p.completedAt).toDateString()
        )
      )
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // 今日の日付
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // 最新の学習日が今日または昨日の場合、現在の連続日数を計算
    if (uniqueDates.length > 0) {
      const lastDate = uniqueDates[uniqueDates.length - 1];
      if (lastDate === today || lastDate === yesterday) {
        currentStreak = 1;
        
        // 過去に向かって連続日数を計算
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const currentDate = new Date(uniqueDates[i + 1]);
          const previousDate = new Date(uniqueDates[i]);
          const diffTime = currentDate.getTime() - previousDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // 最長連続日数を計算
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const previousDate = new Date(uniqueDates[i - 1]);
      const diffTime = currentDate.getTime() - previousDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }
}

// シングルトンインスタンス
export const listeningProgressManager = ListeningProgressManager.getInstance();
