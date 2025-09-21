// アドレナリンシステムの型定義

export interface ComboSystem {
  currentCombo: number;
  maxCombo: number;
  comboMultiplier: number;
  lastCorrectTime: number;
  comboTimeout: number; // コンボが途切れるまでの時間（ミリ秒）
}

export interface CriticalHitSystem {
  criticalRate: number; // クリティカル発生率（0.0-1.0）
  criticalMultiplier: number; // クリティカル時の倍率
  lastCriticalTime: number;
  totalCriticals: number;
  criticalStreak: number; // 連続クリティカル数
}

export interface TreasureBox {
  id: string;
  type: "bronze" | "silver" | "gold" | "rainbow";
  rarity: number; // 0.0-1.0
  rewards: TreasureReward[];
  openedAt?: number;
  isOpened: boolean;
}

export interface TreasureReward {
  type: "xp" | "hearts" | "stars" | "gacha_ticket" | "special_item";
  amount: number;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface DailyBonusSystem {
  consecutiveDays: number;
  currentMultiplier: number;
  lastLoginDate: string;
  maxMultiplier: number;
  bonusHistory: DailyBonusRecord[];
}

export interface DailyBonusRecord {
  date: string;
  multiplier: number;
  xpEarned: number;
  streak: number;
}

export interface FeverTimeSystem {
  isActive: boolean;
  startTime: number;
  duration: number; // ミリ秒
  multiplier: number;
  triggerRate: number; // 発動確率
  cooldownTime: number; // クールダウン時間
  lastTrigger: number;
}

export interface PressureGauge {
  current: number;
  max: number;
  burstThreshold: number;
  burstMultiplier: number;
  burstDuration: number;
  lastBurst: number;
  isCharging: boolean;
}

export interface AdrenalineStats {
  totalCombos: number;
  maxComboAchieved: number;
  totalCriticals: number;
  treasureBoxesOpened: number;
  feverTimesTriggered: number;
  pressureBurstsUsed: number;
  totalBonusXP: number;
  averageMultiplier: number;
}

export interface AdrenalineSystem {
  combo: ComboSystem;
  critical: CriticalHitSystem;
  dailyBonus: DailyBonusSystem;
  feverTime: FeverTimeSystem;
  pressureGauge: PressureGauge;
  treasureBoxes: TreasureBox[];
  stats: AdrenalineStats;
  isEnabled: boolean;
}

// アドレナリンイベントの種類
export type AdrenalineEvent =
  | "combo_start"
  | "combo_break"
  | "critical_hit"
  | "fever_time_start"
  | "fever_time_end"
  | "pressure_burst"
  | "treasure_box_earned"
  | "daily_bonus_increased";

export interface AdrenalineEventData {
  type: AdrenalineEvent;
  value: number;
  multiplier: number;
  message: string;
  timestamp: number;
  effects: string[];
}
