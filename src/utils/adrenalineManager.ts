import {
  AdrenalineEvent,
  AdrenalineEventData,
  AdrenalineStats,
  AdrenalineSystem,
  TreasureBox,
  TreasureReward,
} from "../types/adrenalineSystem";

const STORAGE_KEY = "entp-english-adrenaline-system";

export class AdrenalineManager {
  private static instance: AdrenalineManager;
  private system: AdrenalineSystem;

  constructor() {
    this.system = this.loadSystem();
  }

  static getInstance(): AdrenalineManager {
    if (!AdrenalineManager.instance) {
      AdrenalineManager.instance = new AdrenalineManager();
    }
    return AdrenalineManager.instance;
  }

  private loadSystem(): AdrenalineSystem {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return {
          ...this.getDefaultSystem(),
          ...data,
        };
      }
    } catch (error) {
      console.error("アドレナリンシステム読み込みエラー:", error);
    }
    return this.getDefaultSystem();
  }

  private saveSystem(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.system));
    } catch (error) {
      console.error("アドレナリンシステム保存エラー:", error);
    }
  }

  private getDefaultSystem(): AdrenalineSystem {
    return {
      combo: {
        currentCombo: 0,
        maxCombo: 0,
        comboMultiplier: 1.0,
        lastCorrectTime: 0,
        comboTimeout: 10000, // 10秒
      },
      critical: {
        criticalRate: 0.05, // 5%
        criticalMultiplier: 3.0,
        lastCriticalTime: 0,
        totalCriticals: 0,
        criticalStreak: 0,
      },
      dailyBonus: {
        consecutiveDays: 0,
        currentMultiplier: 1.0,
        lastLoginDate: "",
        maxMultiplier: 2.0,
        bonusHistory: [],
      },
      feverTime: {
        isActive: false,
        startTime: 0,
        duration: 180000, // 3分
        multiplier: 2.0,
        triggerRate: 0.05, // 5%
        cooldownTime: 1800000, // 30分
        lastTrigger: 0,
      },
      pressureGauge: {
        current: 0,
        max: 100,
        burstThreshold: 100,
        burstMultiplier: 3.0,
        burstDuration: 300000, // 5分
        lastBurst: 0,
        isCharging: false,
      },
      treasureBoxes: [],
      stats: {
        totalCombos: 0,
        maxComboAchieved: 0,
        totalCriticals: 0,
        treasureBoxesOpened: 0,
        feverTimesTriggered: 0,
        pressureBurstsUsed: 0,
        totalBonusXP: 0,
        averageMultiplier: 1.0,
      },
      isEnabled: true,
    };
  }

  // コンボシステム
  processCorrectAnswer(forceEvents: boolean = false): AdrenalineEventData[] {
    const events: AdrenalineEventData[] = [];
    const now = Date.now();

    // コンボ処理
    if (
      now - this.system.combo.lastCorrectTime <
      this.system.combo.comboTimeout
    ) {
      this.system.combo.currentCombo++;
    } else {
      this.system.combo.currentCombo = 1;
    }

    this.system.combo.lastCorrectTime = now;
    this.system.combo.maxCombo = Math.max(
      this.system.combo.maxCombo,
      this.system.combo.currentCombo
    );

    // コンボ乗数計算
    const oldMultiplier = this.system.combo.comboMultiplier;
    this.system.combo.comboMultiplier = this.calculateComboMultiplier(
      this.system.combo.currentCombo
    );

    if (
      this.system.combo.currentCombo >= 3 &&
      oldMultiplier !== this.system.combo.comboMultiplier
    ) {
      events.push({
        type: "combo_start",
        value: this.system.combo.currentCombo,
        multiplier: this.system.combo.comboMultiplier,
        message: `🔥 ${this.system.combo.currentCombo}連続コンボ！ XP${this.system.combo.comboMultiplier}倍！`,
        timestamp: now,
        effects: ["combo_multiplier", "visual_fire"],
      });
    }

    // クリティカルヒット判定
    if (forceEvents || Math.random() < this.system.critical.criticalRate) {
      this.system.critical.totalCriticals++;
      this.system.critical.criticalStreak++;
      this.system.critical.lastCriticalTime = now;

      events.push({
        type: "critical_hit",
        value: this.system.critical.criticalMultiplier,
        multiplier: this.system.critical.criticalMultiplier,
        message: `⚡ CRITICAL HIT! XP${this.system.critical.criticalMultiplier}倍獲得！`,
        timestamp: now,
        effects: ["critical_flash", "screen_shake", "golden_effect"],
      });
    } else {
      this.system.critical.criticalStreak = 0;
    }

    // フィーバータイム判定
    if (
      !this.system.feverTime.isActive &&
      now - this.system.feverTime.lastTrigger >
        this.system.feverTime.cooldownTime &&
      (forceEvents || Math.random() < this.system.feverTime.triggerRate)
    ) {
      this.startFeverTime(events);
    }

    // プレッシャーゲージ増加
    this.system.pressureGauge.current = Math.min(
      this.system.pressureGauge.current + 10,
      this.system.pressureGauge.max
    );

    if (
      this.system.pressureGauge.current >=
      this.system.pressureGauge.burstThreshold
    ) {
      this.triggerPressureBurst(events);
    }

    this.saveSystem();
    return events;
  }

  processIncorrectAnswer(): AdrenalineEventData[] {
    const events: AdrenalineEventData[] = [];
    const now = Date.now();

    // コンボリセット
    if (this.system.combo.currentCombo > 0) {
      events.push({
        type: "combo_break",
        value: this.system.combo.currentCombo,
        multiplier: 1.0,
        message: `💔 ${this.system.combo.currentCombo}コンボが途切れました...`,
        timestamp: now,
        effects: ["combo_break_effect", "screen_fade"],
      });
    }

    this.system.combo.currentCombo = 0;
    this.system.combo.comboMultiplier = 1.0;
    this.system.critical.criticalStreak = 0;

    // プレッシャーゲージ減少
    this.system.pressureGauge.current = Math.max(
      this.system.pressureGauge.current - 20,
      0
    );

    this.saveSystem();
    return events;
  }

  private calculateComboMultiplier(combo: number): number {
    if (combo >= 10) return 2.0;
    if (combo >= 7) return 1.8;
    if (combo >= 5) return 1.5;
    if (combo >= 3) return 1.2;
    return 1.0;
  }

  private startFeverTime(events: AdrenalineEventData[]): void {
    const now = Date.now();
    this.system.feverTime.isActive = true;
    this.system.feverTime.startTime = now;
    this.system.feverTime.lastTrigger = now;
    this.system.stats.feverTimesTriggered++;

    events.push({
      type: "fever_time_start",
      value: this.system.feverTime.duration / 1000,
      multiplier: this.system.feverTime.multiplier,
      message: `🎊 FEVER TIME! ${this.system.feverTime.duration / 1000}秒間XP${
        this.system.feverTime.multiplier
      }倍！`,
      timestamp: now,
      effects: ["fever_background", "sparkle_effect", "music_change"],
    });

    // フィーバータイム終了タイマー
    setTimeout(() => {
      this.endFeverTime();
    }, this.system.feverTime.duration);
  }

  private endFeverTime(): void {
    this.system.feverTime.isActive = false;
    this.saveSystem();
  }

  private triggerPressureBurst(events: AdrenalineEventData[]): void {
    const now = Date.now();
    this.system.pressureGauge.current = 0;
    this.system.pressureGauge.lastBurst = now;
    this.system.stats.pressureBurstsUsed++;

    events.push({
      type: "pressure_burst",
      value: this.system.pressureGauge.burstDuration / 1000,
      multiplier: this.system.pressureGauge.burstMultiplier,
      message: `💥 PRESSURE BURST! ${
        this.system.pressureGauge.burstDuration / 60000
      }分間XP${this.system.pressureGauge.burstMultiplier}倍！`,
      timestamp: now,
      effects: ["burst_effect", "screen_pulse", "energy_aura"],
    });
  }

  // 宝箱システム
  earnTreasureBox(
    difficulty: "easy" | "normal" | "hard",
    forceEarn: boolean = false
  ): TreasureBox {
    const box = this.generateTreasureBox(difficulty);
    this.system.treasureBoxes.push(box);
    this.saveSystem();
    return box;
  }

  // テスト用: 宝箱を強制獲得
  forceEarnTreasureBox(
    difficulty: "easy" | "normal" | "hard" = "normal"
  ): TreasureBox {
    console.log("🧪 テスト用: 宝箱を強制獲得");
    return this.earnTreasureBox(difficulty, true);
  }

  // テスト用: 確率的イベントを強制発動
  forceTriggerEvents(): AdrenalineEventData[] {
    console.log("🧪 テスト用: 確率的イベントを強制発動");
    return this.processCorrectAnswer(true);
  }

  private generateTreasureBox(
    difficulty: "easy" | "normal" | "hard"
  ): TreasureBox {
    const rarityRoll = Math.random();
    let type: TreasureBox["type"];
    let rarity: number;

    // 難易度別の宝箱確率
    const difficultyBonus =
      difficulty === "hard" ? 0.2 : difficulty === "normal" ? 0.1 : 0;
    const adjustedRarity = rarityRoll + difficultyBonus;

    if (adjustedRarity >= 0.99) {
      type = "rainbow";
      rarity = 0.001;
    } else if (adjustedRarity >= 0.9) {
      type = "gold";
      rarity = 0.1;
    } else if (adjustedRarity >= 0.7) {
      type = "silver";
      rarity = 0.2;
    } else {
      type = "bronze";
      rarity = 0.7;
    }

    return {
      id: `treasure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      rarity,
      rewards: this.generateTreasureRewards(type),
      isOpened: false,
    };
  }

  private generateTreasureRewards(
    boxType: TreasureBox["type"]
  ): TreasureReward[] {
    const rewards: TreasureReward[] = [];

    switch (boxType) {
      case "bronze":
        rewards.push({
          type: "xp",
          amount: 50 + Math.floor(Math.random() * 50),
          description: "ボーナスXP",
          rarity: "common",
        });
        break;

      case "silver":
        rewards.push({
          type: "xp",
          amount: 100 + Math.floor(Math.random() * 100),
          description: "大量ボーナスXP",
          rarity: "rare",
        });
        if (Math.random() < 0.3) {
          rewards.push({
            type: "hearts",
            amount: 1,
            description: "体力回復",
            rarity: "rare",
          });
        }
        break;

      case "gold":
        rewards.push({
          type: "xp",
          amount: 200 + Math.floor(Math.random() * 200),
          description: "超大量ボーナスXP",
          rarity: "epic",
        });
        rewards.push({
          type: "gacha_ticket",
          amount: 1,
          description: "無料ガチャチケット",
          rarity: "epic",
        });
        if (Math.random() < 0.5) {
          rewards.push({
            type: "stars",
            amount: 1,
            description: "スター回復",
            rarity: "epic",
          });
        }
        break;

      case "rainbow":
        rewards.push({
          type: "xp",
          amount: 500 + Math.floor(Math.random() * 500),
          description: "伝説級ボーナスXP",
          rarity: "legendary",
        });
        rewards.push({
          type: "gacha_ticket",
          amount: 3,
          description: "プレミアムガチャチケット×3",
          rarity: "legendary",
        });
        rewards.push({
          type: "special_item",
          amount: 1,
          description: "永続XP乗数+10%",
          rarity: "legendary",
        });
        break;
    }

    return rewards;
  }

  openTreasureBox(boxId: string): TreasureReward[] {
    const box = this.system.treasureBoxes.find((b) => b.id === boxId);
    if (!box || box.isOpened) {
      return [];
    }

    box.isOpened = true;
    box.openedAt = Date.now();
    this.system.stats.treasureBoxesOpened++;

    this.saveSystem();
    return box.rewards;
  }

  // デイリーボーナスシステム
  updateDailyBonus(): number {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (this.system.dailyBonus.lastLoginDate === today) {
      return this.system.dailyBonus.currentMultiplier;
    }

    if (this.system.dailyBonus.lastLoginDate === yesterday) {
      // 連続ログイン
      this.system.dailyBonus.consecutiveDays++;
    } else {
      // ログイン途切れ
      this.system.dailyBonus.consecutiveDays = 1;
    }

    this.system.dailyBonus.lastLoginDate = today;
    this.system.dailyBonus.currentMultiplier = this.calculateDailyMultiplier(
      this.system.dailyBonus.consecutiveDays
    );

    this.system.dailyBonus.bonusHistory.push({
      date: today,
      multiplier: this.system.dailyBonus.currentMultiplier,
      xpEarned: 0, // 実際の学習で更新
      streak: this.system.dailyBonus.consecutiveDays,
    });

    this.saveSystem();
    return this.system.dailyBonus.currentMultiplier;
  }

  private calculateDailyMultiplier(days: number): number {
    if (days >= 14) return 2.0;
    if (days >= 7) return 1.5;
    if (days >= 3) return 1.2;
    return 1.0;
  }

  // 総合乗数計算
  calculateTotalMultiplier(): number {
    let multiplier = 1.0;

    // コンボ乗数
    multiplier *= this.system.combo.comboMultiplier;

    // デイリーボーナス乗数
    multiplier *= this.system.dailyBonus.currentMultiplier;

    // フィーバータイム乗数
    if (this.system.feverTime.isActive) {
      multiplier *= this.system.feverTime.multiplier;
    }

    // プレッシャーバースト乗数
    const now = Date.now();
    if (
      now - this.system.pressureGauge.lastBurst <
      this.system.pressureGauge.burstDuration
    ) {
      multiplier *= this.system.pressureGauge.burstMultiplier;
    }

    return multiplier;
  }

  // XP計算（アドレナリン効果適用）
  calculateBoostedXP(
    baseXP: number,
    isCritical: boolean = false
  ): {
    finalXP: number;
    multiplier: number;
    breakdown: string[];
  } {
    const breakdown: string[] = [];
    let multiplier = this.calculateTotalMultiplier();

    breakdown.push(`基本XP: ${baseXP}`);

    if (this.system.combo.currentCombo >= 3) {
      breakdown.push(
        `🔥 コンボ×${this.system.combo.comboMultiplier} (${this.system.combo.currentCombo}連続)`
      );
    }

    if (this.system.dailyBonus.currentMultiplier > 1.0) {
      breakdown.push(
        `📅 デイリーボーナス×${this.system.dailyBonus.currentMultiplier} (${this.system.dailyBonus.consecutiveDays}日連続)`
      );
    }

    if (this.system.feverTime.isActive) {
      breakdown.push(`🎊 フィーバータイム×${this.system.feverTime.multiplier}`);
    }

    if (isCritical) {
      multiplier *= this.system.critical.criticalMultiplier;
      breakdown.push(
        `⚡ クリティカル×${this.system.critical.criticalMultiplier}`
      );
    }

    const finalXP = Math.round(baseXP * multiplier);
    this.system.stats.totalBonusXP += finalXP - baseXP;

    return {
      finalXP,
      multiplier,
      breakdown,
    };
  }

  // システム状態取得
  getSystem(): AdrenalineSystem {
    return { ...this.system };
  }

  getComboStatus(): { combo: number; multiplier: number; timeLeft: number } {
    const now = Date.now();
    const timeLeft = Math.max(
      0,
      this.system.combo.comboTimeout - (now - this.system.combo.lastCorrectTime)
    );

    return {
      combo: this.system.combo.currentCombo,
      multiplier: this.system.combo.comboMultiplier,
      timeLeft,
    };
  }

  getFeverTimeStatus(): { isActive: boolean; timeLeft: number } {
    if (!this.system.feverTime.isActive) {
      return { isActive: false, timeLeft: 0 };
    }

    const now = Date.now();
    const timeLeft = Math.max(
      0,
      this.system.feverTime.duration - (now - this.system.feverTime.startTime)
    );

    if (timeLeft === 0) {
      this.endFeverTime();
      return { isActive: false, timeLeft: 0 };
    }

    return { isActive: true, timeLeft };
  }

  getPressureGaugeStatus(): {
    current: number;
    max: number;
    percentage: number;
    canBurst: boolean;
  } {
    return {
      current: this.system.pressureGauge.current,
      max: this.system.pressureGauge.max,
      percentage:
        (this.system.pressureGauge.current / this.system.pressureGauge.max) *
        100,
      canBurst:
        this.system.pressureGauge.current >=
        this.system.pressureGauge.burstThreshold,
    };
  }

  // 統計情報
  getStats(): AdrenalineStats {
    return { ...this.system.stats };
  }

  // システムリセット（テスト用）
  resetSystem(): void {
    this.system = this.getDefaultSystem();
    this.saveSystem();
  }

  // デバッグ用
  triggerTestEvent(eventType: AdrenalineEvent): AdrenalineEventData[] {
    const events: AdrenalineEventData[] = [];
    const now = Date.now();

    switch (eventType) {
      case "critical_hit":
        events.push({
          type: "critical_hit",
          value: 3.0,
          multiplier: 3.0,
          message: "⚡ TEST CRITICAL HIT!",
          timestamp: now,
          effects: ["critical_flash", "golden_effect"],
        });
        break;
      case "fever_time_start":
        this.startFeverTime(events);
        break;
    }

    return events;
  }
}

// グローバルインスタンス
export const adrenalineManager = AdrenalineManager.getInstance();
