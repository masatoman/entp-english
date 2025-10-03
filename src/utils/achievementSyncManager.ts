/**
 * 実績システム統合管理
 * リスニング学習とメイン実績システムの同期を管理
 */

import { DataManager } from "./dataManager";
import { listeningAchievementManager } from "./listeningAchievementManager";
import { listeningProgressManager } from "./listeningProgressManager";

export class AchievementSyncManager {
  private static instance: AchievementSyncManager;

  public static getInstance(): AchievementSyncManager {
    if (!AchievementSyncManager.instance) {
      AchievementSyncManager.instance = new AchievementSyncManager();
    }
    return AchievementSyncManager.instance;
  }

  /**
   * リスニング学習のXPをメインユーザー統計に同期
   */
  async syncListeningXPToMainStats(userId: string): Promise<void> {
    try {
      // リスニングアチーブメントから獲得したXPを計算
      const completedAchievements =
        await listeningAchievementManager.getCompletedAchievements(userId);
      const totalListeningXP = completedAchievements.reduce(
        (total, achievement) => {
          return total + achievement.reward.xp;
        },
        0
      );

      // リスニング学習セッションから直接獲得したXPを計算
      const listeningStats = await listeningProgressManager.getUserStatistics(
        userId
      );
      const sessionXP = Math.floor(listeningStats.totalSessions * 10); // セッションあたり10XP

      const totalXP = totalListeningXP + sessionXP;

      // メインユーザー統計を更新
      const currentStats = DataManager.getUserStats();
      const updatedStats = {
        ...currentStats,
        totalXP: currentStats.totalXP + totalXP,
      };

      DataManager.saveUserStats(updatedStats);

      console.log(
        `🔄 リスニングXP同期完了: +${totalXP} XP (アチーブメント: ${totalListeningXP}, セッション: ${sessionXP})`
      );
    } catch (error) {
      console.error("リスニングXP同期エラー:", error);
    }
  }

  /**
   * リスニング学習履歴をメイン学習履歴に統合
   */
  async syncListeningHistoryToMainHistory(userId: string): Promise<void> {
    try {
      const recentProgress = await listeningProgressManager.getRecentProgress(
        userId,
        50
      );
      const currentHistory = DataManager.getLearningHistory();

      // リスニング学習履歴をメイン履歴形式に変換
      const listeningHistory = recentProgress.map((session) => ({
        id: session.sessionId,
        date: new Date(session.completedAt).toISOString().split("T")[0],
        type: "listening" as const,
        category: session.part,
        difficulty: session.difficulty,
        score: session.score,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        xpEarned: Math.floor(session.score / 10) + 5, // スコアに基づくXP計算
        duration: session.timeSpent,
      }));

      // 重複を避けてメイン履歴に追加
      const existingIds = new Set(currentHistory.map((h) => h.id));
      const newHistory = listeningHistory.filter((h) => !existingIds.has(h.id));

      if (newHistory.length > 0) {
        const updatedHistory = [...newHistory, ...currentHistory];
        DataManager.saveLearningHistory(updatedHistory);

        // ユーザー統計を更新
        newHistory.forEach((session) => {
          DataManager.updateUserStatsFromSession(session);
        });

        console.log(
          `🔄 リスニング履歴同期完了: ${newHistory.length}件のセッションを追加`
        );
      }
    } catch (error) {
      console.error("リスニング履歴同期エラー:", error);
    }
  }

  /**
   * 全データの同期を実行
   */
  async syncAllData(userId: string): Promise<void> {
    try {
      await this.syncListeningXPToMainStats(userId);
      await this.syncListeningHistoryToMainHistory(userId);
      console.log("🔄 全データ同期完了");
    } catch (error) {
      console.error("全データ同期エラー:", error);
    }
  }

  /**
   * リスニング学習の統計情報を取得（メイン統計との統合版）
   */
  async getIntegratedUserStats(userId: string): Promise<{
    mainStats: any;
    listeningStats: any;
    totalXP: number;
    totalQuestions: number;
    combinedAccuracy: number;
  }> {
    try {
      const mainStats = DataManager.getUserStats();
      const listeningStats = await listeningProgressManager.getUserStatistics(
        userId
      );

      // リスニングアチーブメントXPを計算
      const completedAchievements =
        await listeningAchievementManager.getCompletedAchievements(userId);
      const listeningAchievementXP = completedAchievements.reduce(
        (total, achievement) => {
          return total + achievement.reward.xp;
        },
        0
      );

      const totalXP = mainStats.totalXP + listeningAchievementXP;
      const totalQuestions =
        mainStats.totalQuestionsAnswered + listeningStats.totalQuestions;

      // 統合正解率を計算
      const totalCorrectAnswers =
        mainStats.correctAnswers + listeningStats.totalCorrectAnswers;
      const combinedAccuracy =
        totalQuestions > 0
          ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
          : 0;

      return {
        mainStats,
        listeningStats,
        totalXP,
        totalQuestions,
        combinedAccuracy,
      };
    } catch (error) {
      console.error("統合統計取得エラー:", error);
      return {
        mainStats: DataManager.getUserStats(),
        listeningStats: null,
        totalXP: DataManager.getUserStats().totalXP,
        totalQuestions: DataManager.getUserStats().totalQuestionsAnswered,
        combinedAccuracy: DataManager.getUserStats().averageScore,
      };
    }
  }
}

// シングルトンインスタンス
export const achievementSyncManager = AchievementSyncManager.getInstance();
