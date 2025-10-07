import {
  HeartConsumption,
  HeartTOEICIntegration,
  HeartUsageStats,
  SpecialTOEICMode,
  TOEICModeEffect,
  TOEICQuestionWithHeartBoost,
} from "../types/heartTOEICIntegration";
import { TOEICQuestion } from "../types/mockTest";

/**
 * ハートシステムとTOEIC模擬テストの統合管理システム
 */
export class HeartTOEICIntegrationManager {
  private static readonly INTEGRATION_KEY = "entp-heart-toeic-integration";
  private static readonly CONSUMPTIONS_KEY = "entp-heart-consumptions";
  private static readonly CHALLENGES_KEY = "entp-heart-challenges";

  /**
   * 特別TOEICモード定義
   */
  private static readonly SPECIAL_MODES: Omit<
    SpecialTOEICMode,
    "isActive" | "activatedAt" | "usageCount"
  >[] = [
    {
      modeId: "unlimited-time-mode",
      modeName: "時間無制限モード",
      description: "制限時間なしでTOEIC模擬テストを受験",
      heartCost: 3,
      effects: {
        unlimitedTime: true,
        unlimitedHints: false,
        perfectMode: false,
        accuracyBoost: 1.0,
        xpMultiplier: 1.2,
        timeExtension: 0,
        questionSkip: false,
        doubleReward: false,
        specialQuestions: false,
      },
      duration: 60,
      maxUsagePerDay: 2,
      cooldown: 120,
    },
    {
      modeId: "unlimited-hints-mode",
      modeName: "ヒント無制限モード",
      description: "全ての問題でヒントを使用可能",
      heartCost: 2,
      effects: {
        unlimitedTime: false,
        unlimitedHints: true,
        perfectMode: false,
        accuracyBoost: 1.1,
        xpMultiplier: 1.1,
        timeExtension: 0,
        questionSkip: false,
        doubleReward: false,
        specialQuestions: false,
      },
      duration: 45,
      maxUsagePerDay: 3,
      cooldown: 90,
    },
    {
      modeId: "perfect-mode",
      modeName: "完璧モード",
      description: "間違いなしで完璧なスコアを目指す",
      heartCost: 4,
      effects: {
        unlimitedTime: false,
        unlimitedHints: true,
        perfectMode: true,
        accuracyBoost: 1.3,
        xpMultiplier: 1.5,
        timeExtension: 15,
        questionSkip: false,
        doubleReward: true,
        specialQuestions: false,
      },
      duration: 30,
      maxUsagePerDay: 1,
      cooldown: 180,
    },
    {
      modeId: "speed-demon-mode",
      modeName: "スピードデーモンモード",
      description: "高速で問題を解いてスピードを競う",
      heartCost: 2,
      effects: {
        unlimitedTime: false,
        unlimitedHints: false,
        perfectMode: false,
        accuracyBoost: 1.0,
        xpMultiplier: 1.8,
        timeExtension: -10,
        questionSkip: true,
        doubleReward: false,
        specialQuestions: true,
      },
      duration: 20,
      maxUsagePerDay: 4,
      cooldown: 60,
    },
    {
      modeId: "master-mode",
      modeName: "マスターモード",
      description: "全ての特別効果が適用される究極モード",
      heartCost: 5,
      effects: {
        unlimitedTime: true,
        unlimitedHints: true,
        perfectMode: true,
        accuracyBoost: 1.5,
        xpMultiplier: 2.0,
        timeExtension: 30,
        questionSkip: true,
        doubleReward: true,
        specialQuestions: true,
      },
      duration: 90,
      maxUsagePerDay: 1,
      cooldown: 360,
    },
  ];

  /**
   * ハートTOEIC統合データを取得
   */
  static getHeartTOEICIntegration(
    userId: string = "default"
  ): HeartTOEICIntegration {
    const heartCost = this.calculateHeartCost(userId);
    const specialModes = this.getAvailableSpecialModes(userId);
    const heartRecoveryBonus = this.getHeartRecoveryBonus(userId);
    const heartMultiplier = this.getHeartMultiplier(userId);

    return {
      userId,
      heartCost,
      specialModes,
      heartRecoveryBonus,
      heartMultiplier,
      lastUpdated: new Date(),
    };
  }

  /**
   * 特別モードをアクティベート
   */
  static activateSpecialMode(
    userId: string,
    modeId: string
  ): SpecialTOEICMode | null {
    const integration = this.getHeartTOEICIntegration(userId);
    const mode = integration.specialModes.find((m) => m.modeId === modeId);

    if (!mode || !this.canActivateMode(userId, mode)) {
      return null;
    }

    const activatedMode: SpecialTOEICMode = {
      ...mode,
      isActive: true,
      activatedAt: new Date(),
      usageCount: mode.usageCount + 1,
    };

    this.consumeHearts(userId, mode.heartCost);
    this.saveModeActivation(userId, activatedMode);
    this.startModeTimer(userId, modeId, mode.duration);

    return activatedMode;
  }

  /**
   * TOEIC問題にハートブーストを適用
   */
  static applyHeartBoostToQuestion(
    question: TOEICQuestion,
    userId: string = "default"
  ): TOEICQuestionWithHeartBoost {
    const activeModes = this.getActiveModes(userId);
    const questionWithBoost = { ...question } as TOEICQuestionWithHeartBoost;

    if (activeModes.length > 0) {
      const bestMode = activeModes[0]; // 最も効果的なモードを使用
      const remainingTime = this.getModeRemainingTime(userId, bestMode.modeId);

      questionWithBoost.heartBoost = {
        modeId: bestMode.modeId,
        modeName: bestMode.modeName,
        effects: bestMode.effects,
        isActive: remainingTime > 0,
        remainingTime,
      };
    }

    return questionWithBoost;
  }

  /**
   * ハートブーストに基づくXP計算
   */
  static calculateBoostedXP(
    baseXP: number,
    question: TOEICQuestionWithHeartBoost,
    isCorrect: boolean
  ): number {
    if (!isCorrect || !question.heartBoost?.isActive) {
      return baseXP;
    }

    const boost = question.heartBoost;
    let xp = baseXP;

    // 基本XP倍率
    xp *= boost.effects.xpMultiplier;

    // 完璧モード
    if (boost.effects.perfectMode) {
      xp *= 1.5;
    }

    // 報酬2倍
    if (boost.effects.doubleReward) {
      xp *= 2.0;
    }

    // 特別問題
    if (boost.effects.specialQuestions) {
      xp *= 1.3;
    }

    return Math.floor(xp);
  }

  /**
   * ハート消費を記録
   */
  static recordHeartConsumption(
    userId: string,
    modeId: string,
    heartCost: number,
    effects: TOEICModeEffect
  ): void {
    const consumption: HeartConsumption = {
      modeId,
      heartCost,
      consumedAt: new Date(),
      duration: this.getModeDuration(modeId),
      effects,
      isActive: true,
    };

    this.saveHeartConsumption(userId, consumption);
  }

  /**
   * ハート回復ボーナスを取得
   */
  private static getHeartRecoveryBonus(userId: string): number {
    // 学習ストリークや実績に基づいてボーナスを計算
    const streak = this.getLearningStreak(userId);
    const achievements = this.getAchievementCount(userId);

    let bonus = 0;
    if (streak >= 7) bonus += 0.2; // 7日連続で20%回復速度向上
    if (streak >= 30) bonus += 0.3; // 30日連続で30%回復速度向上
    if (achievements >= 10) bonus += 0.1; // 10実績で10%回復速度向上

    return Math.min(bonus, 1.0); // 最大100%まで
  }

  /**
   * ハート倍率を取得
   */
  private static getHeartMultiplier(userId: string): number {
    const integration = this.getHeartTOEICIntegration(userId);
    const streak = this.getLearningStreak(userId);
    const achievements = this.getAchievementCount(userId);

    let multiplier = 1.0;
    if (streak >= 3) multiplier += 0.1; // 3日連続で10%向上
    if (streak >= 7) multiplier += 0.2; // 7日連続で20%向上
    if (achievements >= 5) multiplier += 0.15; // 5実績で15%向上

    return Math.min(multiplier, 2.0); // 最大200%まで
  }

  /**
   * 利用可能な特別モードを取得
   */
  private static getAvailableSpecialModes(userId: string): SpecialTOEICMode[] {
    const modes: SpecialTOEICMode[] = [];

    this.SPECIAL_MODES.forEach((modeTemplate) => {
      const mode: SpecialTOEICMode = {
        ...modeTemplate,
        isActive: false,
        usageCount: this.getModeUsageCount(userId, modeTemplate.modeId),
      };
      modes.push(mode);
    });

    return modes;
  }

  /**
   * モードをアクティベート可能かチェック
   */
  private static canActivateMode(
    userId: string,
    mode: SpecialTOEICMode
  ): boolean {
    // ハート数チェック
    const currentHearts = this.getCurrentHearts(userId);
    if (currentHearts < mode.heartCost) {
      return false;
    }

    // 使用回数チェック
    if (mode.usageCount >= mode.maxUsagePerDay) {
      return false;
    }

    // クールダウンチェック
    if (this.isModeOnCooldown(userId, mode.modeId)) {
      return false;
    }

    // 既にアクティブかチェック
    if (mode.isActive) {
      return false;
    }

    return true;
  }

  /**
   * ハートを消費
   */
  private static consumeHearts(userId: string, amount: number): void {
    // 実際の実装では、ハートシステムマネージャーを使用
    console.log(`Consuming ${amount} hearts for user ${userId}`);
  }

  /**
   * アクティブなモードを取得
   */
  private static getActiveModes(userId: string): SpecialTOEICMode[] {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-active-modes-${userId}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("アクティブモードの読み込みエラー:", error);
      return [];
    }
  }

  /**
   * モードの残り時間を取得
   */
  private static getModeRemainingTime(userId: string, modeId: string): number {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-mode-timer-${userId}`
      );
      const timers = stored ? JSON.parse(stored) : {};

      const timer = timers[modeId];
      if (!timer) return 0;

      const remainingTime = timer.expiresAt - Date.now();
      return Math.max(0, Math.floor(remainingTime / 1000));
    } catch (error) {
      console.error("モードタイマーの読み込みエラー:", error);
      return 0;
    }
  }

  /**
   * モードタイマーを開始
   */
  private static startModeTimer(
    userId: string,
    modeId: string,
    duration: number
  ): void {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-mode-timer-${userId}`
      );
      const timers = stored ? JSON.parse(stored) : {};

      timers[modeId] = {
        startsAt: Date.now(),
        expiresAt: Date.now() + duration * 60 * 1000,
      };

      localStorage.setItem(
        `${this.INTEGRATION_KEY}-mode-timer-${userId}`,
        JSON.stringify(timers)
      );
    } catch (error) {
      console.error("モードタイマーの保存エラー:", error);
    }
  }

  /**
   * モードアクティベーションを保存
   */
  private static saveModeActivation(
    userId: string,
    mode: SpecialTOEICMode
  ): void {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-activations-${userId}`
      );
      const activations = stored ? JSON.parse(stored) : [];

      activations.unshift({
        modeId: mode.modeId,
        activatedAt: mode.activatedAt,
        duration: mode.duration,
        effects: mode.effects,
      });

      // 最新50件のみ保持
      if (activations.length > 50) {
        activations.splice(50);
      }

      localStorage.setItem(
        `${this.INTEGRATION_KEY}-activations-${userId}`,
        JSON.stringify(activations)
      );
    } catch (error) {
      console.error("モードアクティベーションの保存エラー:", error);
    }
  }

  /**
   * ハート消費を保存
   */
  private static saveHeartConsumption(
    userId: string,
    consumption: HeartConsumption
  ): void {
    try {
      const stored = localStorage.getItem(`${this.CONSUMPTIONS_KEY}-${userId}`);
      const consumptions = stored ? JSON.parse(stored) : [];

      consumptions.unshift(consumption);

      // 最新100件のみ保持
      if (consumptions.length > 100) {
        consumptions.splice(100);
      }

      localStorage.setItem(
        `${this.CONSUMPTIONS_KEY}-${userId}`,
        JSON.stringify(consumptions)
      );
    } catch (error) {
      console.error("ハート消費の保存エラー:", error);
    }
  }

  /**
   * ハート使用統計を取得
   */
  static getHeartUsageStats(userId: string): HeartUsageStats {
    const consumptions = this.getHeartConsumptions(userId);
    const totalHeartsConsumed = consumptions.reduce(
      (sum, c) => sum + c.heartCost,
      0
    );
    const totalTimeInModes = consumptions.reduce(
      (sum, c) => sum + c.duration,
      0
    );

    const modeUsageBreakdown = this.SPECIAL_MODES.map((mode) => {
      const modeConsumptions = consumptions.filter(
        (c) => c.modeId === mode.modeId
      );
      const usageCount = modeConsumptions.length;
      const totalTime = modeConsumptions.reduce(
        (sum, c) => sum + c.duration,
        0
      );
      const averageEffectiveness = usageCount > 0 ? totalTime / usageCount : 0;

      return {
        modeId: mode.modeId,
        usageCount,
        totalTime,
        averageEffectiveness,
      };
    });

    const heartEfficiency = this.calculateHeartEfficiency(consumptions);
    const favoriteMode = modeUsageBreakdown.reduce((prev, current) =>
      prev.usageCount > current.usageCount ? prev : current
    ).modeId;

    return {
      totalHeartsConsumed,
      totalTimeInModes,
      modeUsageBreakdown,
      heartEfficiency,
      favoriteMode,
      lastUsed:
        consumptions.length > 0 ? consumptions[0].consumedAt : new Date(),
    };
  }

  // ヘルパーメソッド群
  private static calculateHeartCost(userId: string): number {
    // ユーザーのレベルや実績に基づいてハートコストを計算
    return 1; // 基本コスト
  }

  private static getCurrentHearts(userId: string): number {
    // 実際の実装では、ハートシステムから取得
    return 5; // モックデータ
  }

  private static getModeUsageCount(userId: string, modeId: string): number {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-usage-${userId}`
      );
      const usage = stored ? JSON.parse(stored) : {};
      return usage[modeId] || 0;
    } catch (error) {
      return 0;
    }
  }

  private static isModeOnCooldown(userId: string, modeId: string): boolean {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-cooldowns-${userId}`
      );
      const cooldowns = stored ? JSON.parse(stored) : {};

      const lastUsed = cooldowns[modeId];
      if (!lastUsed) return false;

      const mode = this.SPECIAL_MODES.find((m) => m.modeId === modeId);
      if (!mode) return false;

      const timeSinceLastUsed = Date.now() - lastUsed;
      return timeSinceLastUsed < mode.cooldown * 60 * 1000;
    } catch (error) {
      return false;
    }
  }

  private static getModeDuration(modeId: string): number {
    const mode = this.SPECIAL_MODES.find((m) => m.modeId === modeId);
    return mode ? mode.duration : 30;
  }

  private static getLearningStreak(userId: string): number {
    // 実際の実装では、学習ストリークを取得
    return 7; // モックデータ
  }

  private static getAchievementCount(userId: string): number {
    // 実際の実装では、実績数を取得
    return 15; // モックデータ
  }

  private static getHeartConsumptions(userId: string): HeartConsumption[] {
    try {
      const stored = localStorage.getItem(`${this.CONSUMPTIONS_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private static calculateHeartEfficiency(
    consumptions: HeartConsumption[]
  ): number {
    if (consumptions.length === 0) return 0;

    const totalHearts = consumptions.reduce((sum, c) => sum + c.heartCost, 0);
    const totalTime = consumptions.reduce((sum, c) => sum + c.duration, 0);

    return totalTime / totalHearts; // 1ハートあたりの時間効率
  }

  /**
   * 統合データを保存
   */
  static saveIntegrationData(
    userId: string,
    data: HeartTOEICIntegration
  ): void {
    localStorage.setItem(
      `${this.INTEGRATION_KEY}-${userId}`,
      JSON.stringify(data)
    );
  }

  /**
   * 統合データを読み込み
   */
  static loadIntegrationData(
    userId: string = "default"
  ): HeartTOEICIntegration | null {
    try {
      const stored = localStorage.getItem(`${this.INTEGRATION_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("ハートTOEIC統合データの読み込みエラー:", error);
      return null;
    }
  }
}
