import {
  AchievementNotification,
  AchievementStats,
  AllModeMasterAchievement,
  CategoryExpertAchievement,
  CombinationMasterAchievement,
  CrossFunctionalAchievements,
  IntegratedAchievements,
  LearningStreakAchievement,
  PartMasterAchievement,
  PerfectRunAchievement,
  ProgressionBasedAchievements,
  ScoreMilestone,
  SkillTreeCompletionAchievement,
  SynergyBasedAchievements,
  SynergyMasterAchievement,
  TOEICSpecificAchievements,
  TimeRecordAchievement,
} from "../types/integratedAchievements";
import { SkillTreeTOEICIntegrationManager } from "./skillTreeTOEICIntegration";
import { SynergyExplosionSystem } from "./synergyExplosionSystem";

/**
 * 統合実績システム
 * 全機能の進捗を統合した実績管理
 */
export class IntegratedAchievementsManager {
  private static readonly ACHIEVEMENTS_KEY = "entp-integrated-achievements";
  private static readonly NOTIFICATIONS_KEY = "entp-achievement-notifications";

  /**
   * 統合実績データを取得
   */
  static getIntegratedAchievements(
    userId: string = "default"
  ): IntegratedAchievements {
    const toeicSpecific = this.getTOEICSpecificAchievements(userId);
    const crossFunctional = this.getCrossFunctionalAchievements(userId);
    const synergyBased = this.getSynergyBasedAchievements(userId);
    const progressionBased = this.getProgressionBasedAchievements(userId);

    return {
      userId,
      toeicSpecific,
      crossFunctional,
      synergyBased,
      progressionBased,
      lastUpdated: new Date(),
    };
  }

  /**
   * TOEIC固有実績を取得
   */
  private static getTOEICSpecificAchievements(
    userId: string
  ): TOEICSpecificAchievements {
    return {
      partMaster: this.getPartMasterAchievements(userId),
      scoreMilestones: this.getScoreMilestones(userId),
      perfectRuns: this.getPerfectRunAchievements(userId),
      timeRecords: this.getTimeRecordAchievements(userId),
      categoryExpert: this.getCategoryExpertAchievements(userId),
    };
  }

  /**
   * パートマスター実績を取得
   */
  private static getPartMasterAchievements(
    userId: string
  ): PartMasterAchievement[] {
    const achievements: PartMasterAchievement[] = [];

    for (let part = 1; part <= 7; part++) {
      const partName = this.getPartName(part);
      const isCompleted = this.checkPartMasterCompletion(userId, part);

      achievements.push({
        partNumber: part,
        partName,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        requirements: {
          accuracy: 80,
          questionsCompleted: 50,
          timeLimit: part <= 4 ? 45 : 75,
        },
        rewards: {
          xp: part * 100,
          title: `${partName}マスター`,
          badge: `part-${part}-master`,
          unlocks: [`part-${part}-advanced`, `part-${part}-expert`],
        },
      });
    }

    return achievements;
  }

  /**
   * スコアマイルストーン実績を取得
   */
  private static getScoreMilestones(userId: string): ScoreMilestone[] {
    const milestones = [400, 500, 600, 700, 800, 900, 950];

    return milestones.map((targetScore) => {
      const isAchieved = this.checkScoreMilestone(userId, targetScore);
      const bestScore = this.getBestScore(userId);

      return {
        targetScore,
        isAchieved,
        achievedAt: isAchieved ? new Date() : undefined,
        attempts: this.getAttemptCount(userId, targetScore),
        bestScore,
        rewards: {
          xp: targetScore * 2,
          title: `${targetScore}点達成者`,
          badge: `score-${targetScore}`,
          specialUnlock:
            targetScore >= 800
              ? "legendary-mode"
              : `score-${targetScore}-bonus`,
        },
      };
    });
  }

  /**
   * 完璧なテスト実績を取得
   */
  private static getPerfectRunAchievements(
    userId: string
  ): PerfectRunAchievement[] {
    const testTypes: ("listening" | "reading" | "full")[] = [
      "listening",
      "reading",
      "full",
    ];

    return testTypes.map((testType) => {
      const isCompleted = this.checkPerfectRun(userId, testType);
      const streakCount = this.getPerfectRunStreak(userId, testType);
      const maxStreak = this.getMaxPerfectRunStreak(userId, testType);

      return {
        testType,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        streakCount,
        maxStreak,
        rewards: {
          xp: 500,
          title: `${testType}完璧達成者`,
          badge: `perfect-${testType}`,
          multiplier: 1.5,
        },
      };
    });
  }

  /**
   * 時間記録実績を取得
   */
  private static getTimeRecordAchievements(
    userId: string
  ): TimeRecordAchievement[] {
    // モック実装
    return [
      {
        recordType: "fastest",
        testType: "listening",
        recordValue: 45,
        achievedAt: new Date(),
        isCurrentRecord: true,
        rewards: {
          xp: 300,
          title: "スピードマスター",
          badge: "speed-master",
        },
      },
      {
        recordType: "most_accurate",
        testType: "reading",
        recordValue: 95,
        achievedAt: new Date(),
        isCurrentRecord: true,
        rewards: {
          xp: 400,
          title: "精度マスター",
          badge: "accuracy-master",
        },
      },
    ];
  }

  /**
   * カテゴリーエキスパート実績を取得
   */
  private static getCategoryExpertAchievements(
    userId: string
  ): CategoryExpertAchievement[] {
    const categories = ["時制", "関係詞", "語彙", "リスニング", "読解"];

    return categories.map((category) => {
      const expertiseLevel = this.getCategoryExpertiseLevel(userId, category);
      const accuracy = this.getCategoryAccuracy(userId, category);
      const questionsCompleted = this.getCategoryQuestionsCompleted(
        userId,
        category
      );
      const isCompleted = expertiseLevel === "master";

      return {
        category,
        expertiseLevel,
        accuracy,
        questionsCompleted,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        rewards: {
          xp: 600,
          title: `${category}エキスパート`,
          badge: `${category.toLowerCase()}-expert`,
          specialAbility: `${category}問題で2倍XP`,
        },
      };
    });
  }

  /**
   * クロス機能実績を取得
   */
  private static getCrossFunctionalAchievements(
    userId: string
  ): CrossFunctionalAchievements {
    return {
      synergyMaster: this.getSynergyMasterAchievement(userId),
      skillTreeCompletion: this.getSkillTreeCompletionAchievement(userId),
      allModeMaster: this.getAllModeMasterAchievement(userId),
      learningStreak: this.getLearningStreakAchievement(userId),
      adaptiveLearner: this.getAdaptiveLearnerAchievement(userId),
    };
  }

  /**
   * シナジーマスター実績を取得
   */
  private static getSynergyMasterAchievement(
    userId: string
  ): SynergyMasterAchievement {
    const synergyData = SynergyExplosionSystem.getSynergyExplosionData(userId);
    const isCompleted = synergyData.combinedMultiplier >= 2.0;

    return {
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
      synergyLevel: Math.floor(synergyData.combinedMultiplier * 10),
      maxSynergyReached: synergyData.combinedMultiplier,
      combinationCount: synergyData.specialUnlocks.length,
      rewards: {
        xp: 1000,
        title: "シナジーマスター",
        badge: "synergy-master",
        specialMultiplier: 2.0,
      },
    };
  }

  /**
   * スキルツリー完了実績を取得
   */
  private static getSkillTreeCompletionAchievement(
    userId: string
  ): SkillTreeCompletionAchievement {
    const skillTreeData =
      SkillTreeTOEICIntegrationManager.getSkillTreeProgressForTOEIC(userId);
    const completionRate = skillTreeData.unlockedSkills.length / 50; // 仮の総数
    const isCompleted = completionRate >= 0.9;

    return {
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
      completionRate,
      totalSkills: 50,
      unlockedSkills: skillTreeData.unlockedSkills.length,
      rewards: {
        xp: 800,
        title: "スキルツリーマスター",
        badge: "skill-tree-master",
        specialUnlock: "ultimate-skill-combo",
      },
    };
  }

  /**
   * 全モードマスター実績を取得
   */
  private static getAllModeMasterAchievement(
    userId: string
  ): AllModeMasterAchievement {
    const synergyData = SynergyExplosionSystem.getSynergyExplosionData(userId);
    const modeProgress = {
      grammarQuiz:
        synergyData.grammarQuizProgress.completedCategories /
        synergyData.grammarQuizProgress.totalCategories,
      vocabulary:
        synergyData.vocabularyProgress.masteredWords /
        synergyData.vocabularyProgress.totalWords,
      preStudy:
        synergyData.preStudyProgress.completedTopics /
        synergyData.preStudyProgress.totalTopics,
      skillTree:
        synergyData.skillTreeProgress.unlockedSkills /
        synergyData.skillTreeProgress.totalSkills,
      toeic: 0.8, // 仮の値
    };

    const isCompleted = Object.values(modeProgress).every(
      (rate) => rate >= 0.9
    );

    return {
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined,
      modeProgress,
      rewards: {
        xp: 1500,
        title: "全モードマスター",
        badge: "all-mode-master",
        ultimateUnlock: "legendary-english-master",
      },
    };
  }

  /**
   * 学習ストリーク実績を取得
   */
  private static getLearningStreakAchievement(
    userId: string
  ): LearningStreakAchievement {
    // モック実装
    return {
      currentStreak: 7,
      maxStreak: 15,
      streakType: "daily",
      lastActivity: new Date(),
      isActive: true,
      rewards: {
        xp: 200,
        title: "継続学習者",
        badge: "streak-master",
        streakMultiplier: 1.2,
      },
    };
  }

  /**
   * 適応学習者実績を取得
   */
  private static getAdaptiveLearnerAchievement(userId: string): any {
    // モック実装
    return {
      isCompleted: true,
      completedAt: new Date(),
      adaptationCount: 25,
      improvementRate: 0.15,
      personalizedQuestions: 150,
      rewards: {
        xp: 600,
        title: "適応学習者",
        badge: "adaptive-learner",
        aiBoost: 1.3,
      },
    };
  }

  /**
   * シナジーベース実績を取得
   */
  private static getSynergyBasedAchievements(
    userId: string
  ): SynergyBasedAchievements {
    return {
      combinationMaster: this.getCombinationMasterAchievements(userId),
      crossPollination: [], // TODO: 実装
      systemIntegration: [], // TODO: 実装
    };
  }

  /**
   * 組み合わせマスター実績を取得
   */
  private static getCombinationMasterAchievements(
    userId: string
  ): CombinationMasterAchievement[] {
    const combinations = [
      { type: "grammar-vocabulary", requiredSynergy: 1.3 },
      { type: "prestudy-skilltree", requiredSynergy: 1.4 },
      { type: "all-systems", requiredSynergy: 2.0 },
    ];

    return combinations.map((combo) => {
      const synergyData =
        SynergyExplosionSystem.getSynergyExplosionData(userId);
      const isCompleted =
        synergyData.combinedMultiplier >= combo.requiredSynergy;

      return {
        combinationType: combo.type,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
        synergyValue: synergyData.combinedMultiplier,
        combinationCount: synergyData.specialUnlocks.length,
        rewards: {
          xp: 400,
          title: `${combo.type}マスター`,
          badge: `${combo.type}-master`,
          combinationBonus: 1.5,
        },
      };
    });
  }

  /**
   * 進捗ベース実績を取得
   */
  private static getProgressionBasedAchievements(
    userId: string
  ): ProgressionBasedAchievements {
    return {
      levelMaster: [], // TODO: 実装
      milestoneReacher: [], // TODO: 実装
      continuousImprover: [], // TODO: 実装
    };
  }

  /**
   * 実績統計を取得
   */
  static getAchievementStats(userId: string): AchievementStats {
    const achievements = this.getIntegratedAchievements(userId);

    const totalAchievements = this.countTotalAchievements(achievements);
    const completedAchievements = this.countCompletedAchievements(achievements);
    const completionRate = completedAchievements / totalAchievements;
    const totalXPEarned = this.calculateTotalXPEarned(achievements);
    const recentAchievements = this.getRecentAchievements(userId);
    const nextAchievements = this.getNextAchievements(achievements);
    const categoryBreakdown = this.getCategoryBreakdown(achievements);

    return {
      totalAchievements,
      completedAchievements,
      completionRate,
      totalXPEarned,
      recentAchievements,
      nextAchievements,
      categoryBreakdown,
    };
  }

  /**
   * 実績通知を生成
   */
  static generateAchievementNotification(
    userId: string,
    achievementId: string,
    achievementType: "toeic" | "cross_functional" | "synergy" | "progression",
    title: string,
    description: string,
    rewards: any
  ): AchievementNotification {
    const notification: AchievementNotification = {
      id: `notification-${Date.now()}`,
      achievementId,
      achievementType,
      title,
      description,
      rewards,
      isRead: false,
      achievedAt: new Date(),
    };

    this.saveAchievementNotification(userId, notification);
    return notification;
  }

  // ヘルパーメソッド群
  private static getPartName(part: number): string {
    const partNames = {
      1: "写真描写",
      2: "応答問題",
      3: "会話問題",
      4: "説明文問題",
      5: "短文穴埋め",
      6: "長文穴埋め",
      7: "読解問題",
    };
    return partNames[part as keyof typeof partNames] || `Part ${part}`;
  }

  private static checkPartMasterCompletion(
    userId: string,
    part: number
  ): boolean {
    // 実際の実装では、学習データベースから確認
    return Math.random() > 0.7; // モック実装
  }

  private static checkScoreMilestone(
    _userId: string,
    _targetScore: number
  ): boolean {
    // 実際の実装では、最高スコアから確認
    return Math.random() > 0.8; // モック実装
  }

  private static getBestScore(_userId: string): number {
    // 実際の実装では、最高スコアを取得
    return 750; // モック実装
  }

  private static getAttemptCount(
    _userId: string,
    _targetScore: number
  ): number {
    // 実際の実装では、試行回数を取得
    return Math.floor(Math.random() * 10) + 1; // モック実装
  }

  private static checkPerfectRun(_userId: string, _testType: string): boolean {
    // 実際の実装では、完璧なテスト実行を確認
    return Math.random() > 0.9; // モック実装
  }

  private static getPerfectRunStreak(
    _userId: string,
    _testType: string
  ): number {
    // 実際の実装では、連続完璧実行数を取得
    return Math.floor(Math.random() * 5); // モック実装
  }

  private static getMaxPerfectRunStreak(
    _userId: string,
    _testType: string
  ): number {
    // 実際の実装では、最大連続完璧実行数を取得
    return Math.floor(Math.random() * 10) + 1; // モック実装
  }

  private static getCategoryExpertiseLevel(
    _userId: string,
    _category: string
  ): "novice" | "intermediate" | "advanced" | "expert" | "master" {
    // 実際の実装では、カテゴリー別習熟度を計算
    const levels: (
      | "novice"
      | "intermediate"
      | "advanced"
      | "expert"
      | "master"
    )[] = ["novice", "intermediate", "advanced", "expert", "master"];
    return levels[Math.floor(Math.random() * levels.length)]; // モック実装
  }

  private static getCategoryAccuracy(
    _userId: string,
    _category: string
  ): number {
    // 実際の実装では、カテゴリー別正解率を取得
    return Math.floor(Math.random() * 40) + 60; // モック実装
  }

  private static getCategoryQuestionsCompleted(
    userId: string,
    category: string
  ): number {
    // 実際の実装では、カテゴリー別完了問題数を取得
    return Math.floor(Math.random() * 100) + 50; // モック実装
  }

  private static countTotalAchievements(
    achievements: IntegratedAchievements
  ): number {
    // 実際の実装では、全実績数をカウント
    return 50; // モック実装
  }

  private static countCompletedAchievements(
    achievements: IntegratedAchievements
  ): number {
    // 実際の実装では、完了実績数をカウント
    return 25; // モック実装
  }

  private static calculateTotalXPEarned(
    achievements: IntegratedAchievements
  ): number {
    // 実際の実装では、獲得XPを計算
    return 5000; // モック実装
  }

  private static getRecentAchievements(
    userId: string
  ): AchievementNotification[] {
    // 実際の実装では、最近の実績通知を取得
    return []; // モック実装
  }

  private static getNextAchievements(
    achievements: IntegratedAchievements
  ): string[] {
    // 実際の実装では、次の実績候補を取得
    return ["Part 3マスター", "600点達成", "シナジーマスター"]; // モック実装
  }

  private static getCategoryBreakdown(
    achievements: IntegratedAchievements
  ): any[] {
    // 実際の実装では、カテゴリー別実績数を取得
    return [
      { category: "TOEIC", completed: 10, total: 20 },
      { category: "クロス機能", completed: 8, total: 15 },
      { category: "シナジー", completed: 5, total: 10 },
      { category: "進捗", completed: 2, total: 5 },
    ]; // モック実装
  }

  private static saveAchievementNotification(
    userId: string,
    notification: AchievementNotification
  ): void {
    try {
      const notifications = this.getAchievementNotifications(userId);
      notifications.unshift(notification);

      // 最新50件のみ保持
      if (notifications.length > 50) {
        notifications.splice(50);
      }

      localStorage.setItem(
        `${this.NOTIFICATIONS_KEY}-${userId}`,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("実績通知の保存エラー:", error);
    }
  }

  private static getAchievementNotifications(
    userId: string
  ): AchievementNotification[] {
    try {
      const stored = localStorage.getItem(
        `${this.NOTIFICATIONS_KEY}-${userId}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("実績通知の読み込みエラー:", error);
      return [];
    }
  }

  /**
   * 実績データを保存
   */
  static saveAchievements(
    userId: string,
    achievements: IntegratedAchievements
  ): void {
    localStorage.setItem(
      `${this.ACHIEVEMENTS_KEY}-${userId}`,
      JSON.stringify(achievements)
    );
  }

  /**
   * 実績データを読み込み
   */
  static loadAchievements(
    userId: string = "default"
  ): IntegratedAchievements | null {
    try {
      const stored = localStorage.getItem(`${this.ACHIEVEMENTS_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("実績データの読み込みエラー:", error);
      return null;
    }
  }
}
