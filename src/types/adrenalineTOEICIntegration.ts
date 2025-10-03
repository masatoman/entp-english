// アドレナリンシステムとTOEIC模擬テストの統合型定義
import { TOEICQuestion } from "./mockTest";

export interface AdrenalineTOEICIntegration {
  userId: string;
  adrenalineLevel: number; // 0-100
  comboMultiplier: number;
  criticalHitChance: number;
  feverTimeDuration: number;
  toeicSpecificEffects: TOEICSpecificEffects;
  adrenalineEvents: AdrenalineTOEICEvent[];
  lastUpdated: Date;
}

export interface TOEICSpecificEffects {
  partSwitch: boolean; // パート切り替え効果
  timeExtension: number; // 時間延長（秒）
  hintReveal: boolean; // ヒント表示
  accuracyBoost: number; // 精度向上倍率
  xpMultiplier: number; // XP倍率
  questionSkip: boolean; // 問題スキップ権
  doubleReward: boolean; // 報酬2倍
}

export interface AdrenalineTOEICEvent {
  id: string;
  eventType:
    | "combo_start"
    | "combo_break"
    | "critical_hit"
    | "fever_time"
    | "part_switch"
    | "time_extension";
  timestamp: Date;
  partNumber: number;
  questionId: string;
  effects: TOEICSpecificEffects;
  duration?: number; // 効果継続時間（秒）
  description: string;
}

export interface TOEICAdrenalineBoost extends TOEICQuestion {
  adrenalineBoost?: {
    comboLevel: number;
    criticalChance: number;
    feverActive: boolean;
    specialEffects: TOEICSpecificEffects;
    isActive: boolean;
  };
}

export interface AdrenalineTrigger {
  triggerType:
    | "consecutive_correct"
    | "perfect_part"
    | "time_pressure"
    | "difficulty_spike"
    | "synergy_boost";
  threshold: number;
  effects: TOEICSpecificEffects;
  duration: number;
  cooldown: number; // クールダウン時間（秒）
  description: string;
}

export interface AdrenalineProgression {
  level: number;
  name: string;
  description: string;
  effects: TOEICSpecificEffects;
  requirements: {
    comboCount: number;
    criticalHits: number;
    feverTimeActivations: number;
    perfectRuns: number;
  };
  unlocks: string[];
  rewards: {
    xp: number;
    title: string;
    badge: string;
    permanentEffect: TOEICSpecificEffects;
  };
}

export interface AdrenalineStats {
  totalCombos: number;
  maxCombo: number;
  totalCriticalHits: number;
  totalFeverTime: number;
  adrenalineLevel: number;
  experiencePoints: number;
  perfectRuns: number;
  averageComboLength: number;
  criticalHitRate: number;
  feverTimeEfficiency: number;
}

export interface AdrenalineNotification {
  id: string;
  type: "combo" | "critical" | "fever" | "level_up" | "special_effect";
  title: string;
  message: string;
  effects: TOEICSpecificEffects;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
}
