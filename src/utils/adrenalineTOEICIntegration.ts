import {
  AdrenalineNotification,
  AdrenalineProgression,
  AdrenalineStats,
  AdrenalineTOEICEvent,
  AdrenalineTOEICIntegration,
  AdrenalineTrigger,
  TOEICAdrenalineBoost,
  TOEICSpecificEffects,
} from "../types/adrenalineTOEICIntegration";
import { TOEICQuestion } from "../types/mockTest";
import { AdrenalineManager } from "./adrenalineManager";

/**
 * アドレナリンシステムとTOEIC模擬テストの統合管理
 */
export class AdrenalineTOEICIntegrationManager {
  private static readonly INTEGRATION_KEY = "entp-adrenaline-toeic-integration";
  private static readonly TRIGGERS_KEY = "entp-adrenaline-triggers";
  private static readonly PROGRESSION_KEY = "entp-adrenaline-progression";

  /**
   * アドレナリントリガー定義
   */
  private static readonly ADRENALINE_TRIGGERS: AdrenalineTrigger[] = [
    {
      triggerType: "consecutive_correct",
      threshold: 3,
      effects: {
        partSwitch: false,
        timeExtension: 5,
        hintReveal: false,
        accuracyBoost: 1.1,
        xpMultiplier: 1.2,
        questionSkip: false,
        doubleReward: false,
      },
      duration: 30,
      cooldown: 60,
      description: "3問連続正解でアドレナリン効果発動",
    },
    {
      triggerType: "consecutive_correct",
      threshold: 5,
      effects: {
        partSwitch: false,
        timeExtension: 10,
        hintReveal: true,
        accuracyBoost: 1.2,
        xpMultiplier: 1.5,
        questionSkip: false,
        doubleReward: false,
      },
      duration: 60,
      cooldown: 120,
      description: "5問連続正解で強化アドレナリン効果発動",
    },
    {
      triggerType: "consecutive_correct",
      threshold: 10,
      effects: {
        partSwitch: true,
        timeExtension: 20,
        hintReveal: true,
        accuracyBoost: 1.5,
        xpMultiplier: 2.0,
        questionSkip: true,
        doubleReward: true,
      },
      duration: 120,
      cooldown: 300,
      description: "10問連続正解で究極アドレナリン効果発動",
    },
    {
      triggerType: "perfect_part",
      threshold: 1,
      effects: {
        partSwitch: false,
        timeExtension: 15,
        hintReveal: false,
        accuracyBoost: 1.3,
        xpMultiplier: 1.8,
        questionSkip: false,
        doubleReward: true,
      },
      duration: 90,
      cooldown: 180,
      description: "パート完璧達成で特別効果発動",
    },
    {
      triggerType: "time_pressure",
      threshold: 30, // 残り30秒以下
      effects: {
        partSwitch: false,
        timeExtension: 20,
        hintReveal: true,
        accuracyBoost: 1.2,
        xpMultiplier: 1.6,
        questionSkip: false,
        doubleReward: false,
      },
      duration: 60,
      cooldown: 120,
      description: "時間圧迫で緊急アドレナリン効果発動",
    },
    {
      triggerType: "difficulty_spike",
      threshold: 3, // 連続3問困難
      effects: {
        partSwitch: false,
        timeExtension: 10,
        hintReveal: true,
        accuracyBoost: 1.15,
        xpMultiplier: 1.4,
        questionSkip: false,
        doubleReward: false,
      },
      duration: 45,
      cooldown: 90,
      description: "困難問題連続でサポート効果発動",
    },
    {
      triggerType: "synergy_boost",
      threshold: 2.0, // シナジー倍率2.0以上
      effects: {
        partSwitch: false,
        timeExtension: 25,
        hintReveal: true,
        accuracyBoost: 1.4,
        xpMultiplier: 2.5,
        questionSkip: true,
        doubleReward: true,
      },
      duration: 150,
      cooldown: 240,
      description: "高シナジー状態で究極ブースト効果発動",
    },
  ];

  /**
   * アドレナリン進行度定義
   */
  private static readonly ADRENALINE_PROGRESSION: AdrenalineProgression[] = [
    {
      level: 1,
      name: "アドレナリン初心者",
      description: "基本的なアドレナリン効果を体験",
      effects: {
        partSwitch: false,
        timeExtension: 5,
        hintReveal: false,
        accuracyBoost: 1.05,
        xpMultiplier: 1.1,
        questionSkip: false,
        doubleReward: false,
      },
      requirements: {
        comboCount: 3,
        criticalHits: 1,
        feverTimeActivations: 1,
        perfectRuns: 0,
      },
      unlocks: ["基本コンボ効果", "アドレナリン表示"],
      rewards: {
        xp: 100,
        title: "アドレナリン初心者",
        badge: "adrenaline-novice",
        permanentEffect: {
          partSwitch: false,
          timeExtension: 2,
          hintReveal: false,
          accuracyBoost: 1.02,
          xpMultiplier: 1.05,
          questionSkip: false,
          doubleReward: false,
        },
      },
    },
    {
      level: 2,
      name: "アドレナリン戦士",
      description: "中級のアドレナリン効果を習得",
      effects: {
        partSwitch: false,
        timeExtension: 10,
        hintReveal: true,
        accuracyBoost: 1.15,
        xpMultiplier: 1.3,
        questionSkip: false,
        doubleReward: false,
      },
      requirements: {
        comboCount: 10,
        criticalHits: 5,
        feverTimeActivations: 3,
        perfectRuns: 1,
      },
      unlocks: ["ヒント解放", "時間延長強化"],
      rewards: {
        xp: 250,
        title: "アドレナリン戦士",
        badge: "adrenaline-warrior",
        permanentEffect: {
          partSwitch: false,
          timeExtension: 5,
          hintReveal: false,
          accuracyBoost: 1.05,
          xpMultiplier: 1.1,
          questionSkip: false,
          doubleReward: false,
        },
      },
    },
    {
      level: 3,
      name: "アドレナリンマスター",
      description: "上級のアドレナリン効果をマスター",
      effects: {
        partSwitch: true,
        timeExtension: 20,
        hintReveal: true,
        accuracyBoost: 1.3,
        xpMultiplier: 1.8,
        questionSkip: true,
        doubleReward: true,
      },
      requirements: {
        comboCount: 25,
        criticalHits: 15,
        feverTimeActivations: 8,
        perfectRuns: 3,
      },
      unlocks: ["パート切り替え", "問題スキップ", "報酬2倍"],
      rewards: {
        xp: 500,
        title: "アドレナリンマスター",
        badge: "adrenaline-master",
        permanentEffect: {
          partSwitch: false,
          timeExtension: 8,
          hintReveal: false,
          accuracyBoost: 1.08,
          xpMultiplier: 1.15,
          questionSkip: false,
          doubleReward: false,
        },
      },
    },
    {
      level: 4,
      name: "アドレナリン伝説",
      description: "伝説級のアドレナリン効果を発揮",
      effects: {
        partSwitch: true,
        timeExtension: 30,
        hintReveal: true,
        accuracyBoost: 1.5,
        xpMultiplier: 2.5,
        questionSkip: true,
        doubleReward: true,
      },
      requirements: {
        comboCount: 50,
        criticalHits: 30,
        feverTimeActivations: 15,
        perfectRuns: 7,
      },
      unlocks: ["究極効果", "伝説モード"],
      rewards: {
        xp: 1000,
        title: "アドレナリン伝説",
        badge: "adrenaline-legend",
        permanentEffect: {
          partSwitch: false,
          timeExtension: 12,
          hintReveal: false,
          accuracyBoost: 1.12,
          xpMultiplier: 1.2,
          questionSkip: false,
          doubleReward: false,
        },
      },
    },
    {
      level: 5,
      name: "アドレナリン神",
      description: "神レベルのアドレナリン効果を体現",
      effects: {
        partSwitch: true,
        timeExtension: 60,
        hintReveal: true,
        accuracyBoost: 2.0,
        xpMultiplier: 3.0,
        questionSkip: true,
        doubleReward: true,
      },
      requirements: {
        comboCount: 100,
        criticalHits: 50,
        feverTimeActivations: 25,
        perfectRuns: 15,
      },
      unlocks: ["神の力", "究極の真実"],
      rewards: {
        xp: 2000,
        title: "アドレナリン神",
        badge: "adrenaline-god",
        permanentEffect: {
          partSwitch: false,
          timeExtension: 20,
          hintReveal: false,
          accuracyBoost: 1.2,
          xpMultiplier: 1.3,
          questionSkip: false,
          doubleReward: false,
        },
      },
    },
  ];

  /**
   * アドレナリン統合データを取得
   */
  static getAdrenalineTOEICIntegration(
    userId: string = "default"
  ): AdrenalineTOEICIntegration {
    const adrenalineManager = AdrenalineManager.getInstance();
    const adrenalineStats = adrenalineManager.getStats();

    const adrenalineLevel = this.calculateAdrenalineLevel(adrenalineStats);
    const comboMultiplier = this.calculateComboMultiplier(
      adrenalineStats.currentCombo
    );
    const criticalHitChance = this.calculateCriticalHitChance(adrenalineLevel);
    const feverTimeDuration = this.calculateFeverTimeDuration(adrenalineLevel);

    const toeicSpecificEffects =
      this.calculateTOEICSpecificEffects(adrenalineLevel);
    const adrenalineEvents = this.getAdrenalineEvents(userId);

    return {
      userId,
      adrenalineLevel,
      comboMultiplier,
      criticalHitChance,
      feverTimeDuration,
      toeicSpecificEffects,
      adrenalineEvents,
      lastUpdated: new Date(),
    };
  }

  /**
   * TOEIC問題にアドレナリンブーストを適用
   */
  static applyAdrenalineBoostToQuestion(
    question: TOEICQuestion,
    userId: string = "default"
  ): TOEICAdrenalineBoost {
    const integration = this.getAdrenalineTOEICIntegration(userId);
    const questionWithBoost = { ...question } as TOEICAdrenalineBoost;

    if (integration.adrenalineLevel > 0) {
      questionWithBoost.adrenalineBoost = {
        comboLevel: integration.comboMultiplier,
        criticalChance: integration.criticalHitChance,
        feverActive: integration.feverTimeDuration > 0,
        specialEffects: integration.toeicSpecificEffects,
        isActive: true,
      };
    }

    return questionWithBoost;
  }

  /**
   * アドレナリンブーストに基づくXP計算
   */
  static calculateBoostedXP(
    baseXP: number,
    question: TOEICAdrenalineBoost,
    isCorrect: boolean,
    isCritical: boolean = false
  ): number {
    if (!isCorrect || !question.adrenalineBoost?.isActive) {
      return baseXP;
    }

    const boost = question.adrenalineBoost;
    let xp = baseXP;

    // 基本XP倍率
    xp *= boost.specialEffects.xpMultiplier;

    // コンボ倍率
    xp *= boost.comboLevel;

    // クリティカルヒット
    if (isCritical) {
      xp *= 2.0;
    }

    // フィーバータイム
    if (boost.feverActive) {
      xp *= 1.5;
    }

    // 報酬2倍
    if (boost.specialEffects.doubleReward) {
      xp *= 2.0;
    }

    return Math.floor(xp);
  }

  /**
   * アドレナリントリガーをチェック
   */
  static checkAdrenalineTriggers(
    userId: string,
    triggerType: string,
    value: number,
    partNumber: number,
    questionId: string
  ): AdrenalineTOEICEvent[] {
    const triggeredEvents: AdrenalineTOEICEvent[] = [];

    for (const trigger of this.ADRENALINE_TRIGGERS) {
      if (trigger.triggerType === triggerType && value >= trigger.threshold) {
        // クールダウンチェック
        if (this.isTriggerOnCooldown(userId, trigger)) {
          continue;
        }

        const event: AdrenalineTOEICEvent = {
          id: `adrenaline-event-${Date.now()}`,
          eventType: this.mapTriggerToEventType(triggerType),
          timestamp: new Date(),
          partNumber,
          questionId,
          effects: trigger.effects,
          duration: trigger.duration,
          description: trigger.description,
        };

        triggeredEvents.push(event);
        this.recordTriggerUsage(userId, trigger);
        this.saveAdrenalineEvent(userId, event);
      }
    }

    return triggeredEvents;
  }

  /**
   * アドレナリンレベルを計算
   */
  private static calculateAdrenalineLevel(stats: AdrenalineStats): number {
    // アドレナリンレベルは経験値と実績に基づいて計算
    let level = 0;

    if (stats.maxCombo >= 100) level = 5;
    else if (stats.maxCombo >= 50) level = 4;
    else if (stats.maxCombo >= 25) level = 3;
    else if (stats.maxCombo >= 10) level = 2;
    else if (stats.maxCombo >= 3) level = 1;

    return level;
  }

  /**
   * コンボ倍率を計算
   */
  private static calculateComboMultiplier(comboCount: number): number {
    if (comboCount >= 10) return 2.0;
    if (comboCount >= 5) return 1.5;
    if (comboCount >= 3) return 1.2;
    return 1.0;
  }

  /**
   * クリティカルヒット確率を計算
   */
  private static calculateCriticalHitChance(adrenalineLevel: number): number {
    return Math.min(0.3, adrenalineLevel * 0.05);
  }

  /**
   * フィーバータイム継続時間を計算
   */
  private static calculateFeverTimeDuration(adrenalineLevel: number): number {
    return adrenalineLevel * 30; // レベル1で30秒、レベル5で150秒
  }

  /**
   * TOEIC固有効果を計算
   */
  private static calculateTOEICSpecificEffects(
    adrenalineLevel: number
  ): TOEICSpecificEffects {
    const progression = this.ADRENALINE_PROGRESSION[adrenalineLevel];

    if (progression) {
      return progression.effects;
    }

    // デフォルト効果
    return {
      partSwitch: false,
      timeExtension: 5,
      hintReveal: false,
      accuracyBoost: 1.05,
      xpMultiplier: 1.1,
      questionSkip: false,
      doubleReward: false,
    };
  }

  /**
   * アドレナリンイベントを取得
   */
  private static getAdrenalineEvents(userId: string): AdrenalineTOEICEvent[] {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-events-${userId}`
      );
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("アドレナリンイベントの読み込みエラー:", error);
      return [];
    }
  }

  /**
   * アドレナリンイベントを保存
   */
  private static saveAdrenalineEvent(
    userId: string,
    event: AdrenalineTOEICEvent
  ): void {
    try {
      const events = this.getAdrenalineEvents(userId);
      events.unshift(event);

      // 最新100件のみ保持
      if (events.length > 100) {
        events.splice(100);
      }

      localStorage.setItem(
        `${this.INTEGRATION_KEY}-events-${userId}`,
        JSON.stringify(events)
      );
    } catch (error) {
      console.error("アドレナリンイベントの保存エラー:", error);
    }
  }

  /**
   * トリガーをクールダウン中かチェック
   */
  private static isTriggerOnCooldown(
    userId: string,
    trigger: AdrenalineTrigger
  ): boolean {
    try {
      const stored = localStorage.getItem(`${this.TRIGGERS_KEY}-${userId}`);
      const cooldowns = stored ? JSON.parse(stored) : {};

      const lastUsed = cooldowns[trigger.triggerType];
      if (!lastUsed) return false;

      const timeSinceLastUsed = Date.now() - lastUsed;
      return timeSinceLastUsed < trigger.cooldown * 1000;
    } catch (error) {
      console.error("クールダウンチェックエラー:", error);
      return false;
    }
  }

  /**
   * トリガー使用を記録
   */
  private static recordTriggerUsage(
    userId: string,
    trigger: AdrenalineTrigger
  ): void {
    try {
      const stored = localStorage.getItem(`${this.TRIGGERS_KEY}-${userId}`);
      const cooldowns = stored ? JSON.parse(stored) : {};

      cooldowns[trigger.triggerType] = Date.now();

      localStorage.setItem(
        `${this.TRIGGERS_KEY}-${userId}`,
        JSON.stringify(cooldowns)
      );
    } catch (error) {
      console.error("トリガー使用記録エラー:", error);
    }
  }

  /**
   * トリガータイプをイベントタイプにマッピング
   */
  private static mapTriggerToEventType(triggerType: string): any {
    const mapping: { [key: string]: any } = {
      consecutive_correct: "combo_start",
      perfect_part: "part_switch",
      time_pressure: "time_extension",
      difficulty_spike: "hint_reveal",
      synergy_boost: "fever_time",
    };

    return mapping[triggerType] || "combo_start";
  }

  /**
   * アドレナリン通知を生成
   */
  static generateAdrenalineNotification(
    userId: string,
    type: "combo" | "critical" | "fever" | "level_up" | "special_effect",
    title: string,
    message: string,
    effects: TOEICSpecificEffects
  ): AdrenalineNotification {
    const notification: AdrenalineNotification = {
      id: `adrenaline-notification-${Date.now()}`,
      type,
      title,
      message,
      effects,
      timestamp: new Date(),
      isRead: false,
      priority: type === "level_up" ? "high" : "medium",
    };

    this.saveAdrenalineNotification(userId, notification);
    return notification;
  }

  /**
   * アドレナリン通知を保存
   */
  private static saveAdrenalineNotification(
    userId: string,
    notification: AdrenalineNotification
  ): void {
    try {
      const stored = localStorage.getItem(
        `${this.INTEGRATION_KEY}-notifications-${userId}`
      );
      const notifications = stored ? JSON.parse(stored) : [];

      notifications.unshift(notification);

      // 最新50件のみ保持
      if (notifications.length > 50) {
        notifications.splice(50);
      }

      localStorage.setItem(
        `${this.INTEGRATION_KEY}-notifications-${userId}`,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("アドレナリン通知の保存エラー:", error);
    }
  }

  /**
   * 統合データを保存
   */
  static saveIntegrationData(
    userId: string,
    data: AdrenalineTOEICIntegration
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
  ): AdrenalineTOEICIntegration | null {
    try {
      const stored = localStorage.getItem(`${this.INTEGRATION_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("アドレナリン統合データの読み込みエラー:", error);
      return null;
    }
  }
}
