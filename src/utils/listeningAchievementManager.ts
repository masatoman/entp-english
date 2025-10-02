/**
 * リスニング学習アチーブメント管理システム
 * アチーブメントの進捗追跡、条件チェック、達成通知を管理
 */

import {
  allListeningAchievements,
  ListeningAchievement,
} from "../data/listeningAchievements";
import { dbManager, STORES } from "./IndexedDBManager";
import { listeningProgressManager } from "./listeningProgressManager";

export interface AchievementProgress {
  achievementId: string;
  userId: string;
  currentValue: number;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastUpdated: Date;
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  reward: {
    xp: number;
    coins?: number;
    items?: { id: string; quantity: number }[];
  };
  rarity: string;
  createdAt: Date;
  isRead: boolean;
}

export class ListeningAchievementManager {
  private static instance: ListeningAchievementManager;

  public static getInstance(): ListeningAchievementManager {
    if (!ListeningAchievementManager.instance) {
      ListeningAchievementManager.instance = new ListeningAchievementManager();
    }
    return ListeningAchievementManager.instance;
  }

  /**
   * リスニング学習セッション完了時にアチーブメントをチェック
   */
  async checkAchievementsOnSessionComplete(
    userId: string,
    sessionId: string
  ): Promise<AchievementNotification[]> {
    try {
      const notifications: AchievementNotification[] = [];

      // セッション情報を取得
      const progress = await dbManager.get(
        STORES.LISTENING_PROGRESS,
        sessionId
      );
      if (!progress) {
        console.warn("セッション情報が見つかりません:", sessionId);
        return notifications;
      }

      // 各アチーブメントの進捗をチェック
      for (const achievement of allListeningAchievements) {
        const notification = await this.checkAchievementProgress(
          userId,
          achievement,
          progress
        );
        if (notification) {
          notifications.push(notification);
        }
      }

      console.log(
        `🏆 アチーブメントチェック完了: ${notifications.length}件の達成`
      );
      return notifications;
    } catch (error) {
      console.error("アチーブメントチェックエラー:", error);
      return [];
    }
  }

  /**
   * 個別アチーブメントの進捗をチェック
   */
  private async checkAchievementProgress(
    userId: string,
    achievement: ListeningAchievement,
    _sessionProgress: any
  ): Promise<AchievementNotification | null> {
    try {
      // 既に達成済みかチェック
      const existingProgress = await this.getAchievementProgress(
        userId,
        achievement.id
      );

      if (existingProgress?.isCompleted) {
        return null; // 既に達成済み
      }

      // アチーブメント条件をチェック
      const newValue = await this.calculateAchievementProgress(
        userId,
        achievement,
        _sessionProgress
      );

      if (newValue >= achievement.condition.value) {
        // アチーブメント達成！
        await this.completeAchievement(userId, achievement.id);
        return this.createAchievementNotification(userId, achievement);
      } else {
        // 進捗を更新
        await this.updateAchievementProgress(
          userId,
          achievement.id,
          newValue,
          achievement.condition.value,
          false
        );
      }

      return null;
    } catch (error) {
      console.error(
        `アチーブメント進捗チェックエラー (${achievement.id}):`,
        error
      );
      return null;
    }
  }

  /**
   * アチーブメント進捗を計算
   */
  private async calculateAchievementProgress(
    userId: string,
    achievement: ListeningAchievement,
    _sessionProgress: any
  ): Promise<number> {
    const { condition } = achievement;

    switch (condition.type) {
      case "session_complete":
        return await this.getCompletedSessionCount(
          userId,
          condition.part,
          condition.difficulty
        );

      case "perfect_score":
        return await this.getPerfectScoreCount(
          userId,
          condition.part,
          condition.difficulty
        );

      case "consecutive_days":
        const stats = await listeningProgressManager.getUserStatistics(userId);
        return stats.currentStreak;

      case "questions_answered":
        return await this.getAnsweredQuestionCount(
          userId,
          condition.part,
          condition.difficulty
        );

      case "part_complete":
        return await this.getCompletedSessionCount(
          userId,
          condition.part,
          condition.difficulty
        );

      default:
        return 0;
    }
  }

  /**
   * 完了セッション数を取得
   */
  private async getCompletedSessionCount(
    userId: string,
    part?: string,
    difficulty?: string
  ): Promise<number> {
    try {
      const allProgress = await dbManager.getAll(STORES.LISTENING_PROGRESS);
      let filtered = allProgress.filter((p: any) => p.userId === userId);

      if (part && part !== "all") {
        filtered = filtered.filter((p: any) => p.part === part);
      }

      if (difficulty && difficulty !== "all") {
        filtered = filtered.filter((p: any) => p.difficulty === difficulty);
      }

      return filtered.length;
    } catch (error) {
      console.error("完了セッション数取得エラー:", error);
      return 0;
    }
  }

  /**
   * 完璧スコア回数を取得
   */
  private async getPerfectScoreCount(
    userId: string,
    part?: string,
    difficulty?: string
  ): Promise<number> {
    try {
      const allProgress = await dbManager.getAll(STORES.LISTENING_PROGRESS);
      let filtered = allProgress.filter(
        (p: any) => p.userId === userId && p.score === 100
      );

      if (part && part !== "all") {
        filtered = filtered.filter((p: any) => p.part === part);
      }

      if (difficulty && difficulty !== "all") {
        filtered = filtered.filter((p: any) => p.difficulty === difficulty);
      }

      return filtered.length;
    } catch (error) {
      console.error("完璧スコア回数取得エラー:", error);
      return 0;
    }
  }

  /**
   * 回答問題数を取得
   */
  private async getAnsweredQuestionCount(
    userId: string,
    part?: string,
    difficulty?: string
  ): Promise<number> {
    try {
      const allProgress = await dbManager.getAll(STORES.LISTENING_PROGRESS);
      let filtered = allProgress.filter((p: any) => p.userId === userId);

      if (part && part !== "all") {
        filtered = filtered.filter((p: any) => p.part === part);
      }

      if (difficulty && difficulty !== "all") {
        filtered = filtered.filter((p: any) => p.difficulty === difficulty);
      }

      return filtered.reduce(
        (total: number, p: any) => total + p.totalQuestions,
        0
      );
    } catch (error) {
      console.error("回答問題数取得エラー:", error);
      return 0;
    }
  }

  /**
   * アチーブメント進捗を取得
   */
  async getAchievementProgress(
    userId: string,
    achievementId: string
  ): Promise<AchievementProgress | null> {
    try {
      const key = `${userId}_${achievementId}`;
      const result = await dbManager.get<AchievementProgress>(
        STORES.LISTENING_ACHIEVEMENTS,
        key
      );
      return result || null;
    } catch (error) {
      console.error("アチーブメント進捗取得エラー:", error);
      return null;
    }
  }

  /**
   * アチーブメント進捗を更新
   */
  private async updateAchievementProgress(
    userId: string,
    achievementId: string,
    currentValue: number,
    targetValue: number,
    isCompleted: boolean
  ): Promise<void> {
    try {
      const key = `${userId}_${achievementId}`;
      const progress: AchievementProgress = {
        achievementId,
        userId,
        currentValue,
        targetValue,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        lastUpdated: new Date(),
      };

      await dbManager.put(STORES.LISTENING_ACHIEVEMENTS, {
        ...progress,
        id: key,
      });
    } catch (error) {
      console.error("アチーブメント進捗更新エラー:", error);
    }
  }

  /**
   * アチーブメント達成
   */
  private async completeAchievement(
    userId: string,
    achievementId: string
  ): Promise<void> {
    try {
      const achievement = allListeningAchievements.find(
        (a) => a.id === achievementId
      );
      if (!achievement) {
        console.warn("アチーブメントが見つかりません:", achievementId);
        return;
      }

      await this.updateAchievementProgress(
        userId,
        achievementId,
        achievement.condition.value,
        achievement.condition.value,
        true
      );

      console.log(`🏆 アチーブメント達成: ${achievement.title} (${userId})`);
    } catch (error) {
      console.error("アチーブメント達成処理エラー:", error);
    }
  }

  /**
   * アチーブメント通知を作成
   */
  private createAchievementNotification(
    userId: string,
    achievement: ListeningAchievement
  ): AchievementNotification {
    return {
      id: `notification_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      achievementId: achievement.id,
      userId,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      reward: achievement.reward,
      rarity: achievement.rarity,
      createdAt: new Date(),
      isRead: false,
    };
  }

  /**
   * ユーザーのアチーブメント進捗一覧を取得
   */
  async getUserAchievementProgress(
    userId: string
  ): Promise<AchievementProgress[]> {
    try {
      const allAchievements = await dbManager.getAll(
        STORES.LISTENING_ACHIEVEMENTS
      );
      return (allAchievements as AchievementProgress[]).filter(
        (a) => a.userId === userId
      );
    } catch (error) {
      console.error("ユーザーアチーブメント進捗取得エラー:", error);
      return [];
    }
  }

  /**
   * 達成済みアチーブメント一覧を取得
   */
  async getCompletedAchievements(
    userId: string
  ): Promise<ListeningAchievement[]> {
    try {
      const progressList = await this.getUserAchievementProgress(userId);
      const completedIds = progressList
        .filter((p) => p.isCompleted)
        .map((p) => p.achievementId);

      return allListeningAchievements.filter((a) =>
        completedIds.includes(a.id)
      );
    } catch (error) {
      console.error("達成済みアチーブメント取得エラー:", error);
      return [];
    }
  }

  /**
   * 未達成アチーブメント一覧を取得
   */
  async getIncompleteAchievements(userId: string): Promise<
    {
      achievement: ListeningAchievement;
      progress: AchievementProgress | null;
    }[]
  > {
    try {
      const progressList = await this.getUserAchievementProgress(userId);
      const completedIds = new Set(
        progressList.filter((p) => p.isCompleted).map((p) => p.achievementId)
      );

      return allListeningAchievements
        .filter((a) => !completedIds.has(a.id))
        .map((achievement) => ({
          achievement,
          progress:
            progressList.find((p) => p.achievementId === achievement.id) ||
            null,
        }));
    } catch (error) {
      console.error("未達成アチーブメント取得エラー:", error);
      return [];
    }
  }
}

// シングルトンインスタンス
export const listeningAchievementManager =
  ListeningAchievementManager.getInstance();
