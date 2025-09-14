import { UserAnswer, QuestionRank, SkillField, UserLevel, HeartSystem, StatusAllocation, Chapter } from '../types';

// 新仕様のXP計算設定
export const NEW_XP_CONFIG = {
  // レベル別必要XP
  LEVEL_XP_REQUIREMENTS: {
    1: 50,    // Level 1-20: 50XP毎
    21: 100,  // Level 21-40: 100XP毎
    41: 200,  // Level 41-60: 200XP毎
    61: 300,  // Level 61-80: 300XP毎
    81: 500,  // Level 81-100: 500XP毎
  },
  
  // ランク別基本XP
  RANK_XP: {
    normal: { min: 3, max: 8, bonusMin: 15, bonusMax: 25 },
    rare: { min: 10, max: 18, bonusMin: 40, bonusMax: 60 },
    epic: { min: 25, max: 40, bonusMin: 80, bonusMax: 120 },
    legendary: { min: 50, max: 100, bonusMin: 150, bonusMax: 300 },
  },
  
  // ボーナス条件
  BONUS_CONDITIONS: {
    PERFECT_SCORE: 1.5,      // 100%正解時
    HIGH_ACCURACY: 1.3,      // 80%以上正解時
    STREAK_BONUS: 1.2,       // 連続正解時
    FIRST_ATTEMPT: 1.1,      // 初回正解時
  },
};

// レベルから章を計算
export function getChapterFromLevel(level: number): Chapter {
  if (level <= 20) return 1;
  if (level <= 40) return 2;
  if (level <= 60) return 3;
  if (level <= 80) return 4;
  return 5;
}

// レベルに必要なXPを計算
export function getRequiredXPForLevel(level: number): number {
  const chapter = getChapterFromLevel(level);
  const xpPerLevel = NEW_XP_CONFIG.LEVEL_XP_REQUIREMENTS[chapter * 20 - 19] || 50;
  return xpPerLevel;
}

// レベル計算（新仕様）
export function calculateNewLevel(totalXP: number): UserLevel {
  let level = 1;
  let accumulatedXP = 0;
  
  while (level <= 100) {
    const requiredXP = getRequiredXPForLevel(level);
    if (accumulatedXP + requiredXP > totalXP) {
      break;
    }
    accumulatedXP += requiredXP;
    level++;
  }
  
  const chapter = getChapterFromLevel(level);
  const xpToNext = getRequiredXPForLevel(level) - (totalXP - accumulatedXP);
  const progress = ((totalXP - accumulatedXP) / getRequiredXPForLevel(level)) * 100;
  
  return {
    level,
    chapter,
    xp: totalXP,
    xpToNext,
    progress,
  };
}

// ハートシステムの計算
export function calculateHeartSystem(level: number): HeartSystem {
  const maxHearts = Math.min(3 + Math.floor((level - 1) / 10), 12);
  const now = Date.now();
  
  return {
    current: maxHearts, // 初期値は最大値
    max: maxHearts,
    lastRecovery: now,
    nextRecovery: now + 5 * 60 * 1000, // 5分後
  };
}

// 問題ランクの決定
export function determineQuestionRank(level: number): QuestionRank {
  const chapter = getChapterFromLevel(level);
  const probabilities = getRankProbabilities(chapter);
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rank, prob] of Object.entries(probabilities)) {
    cumulative += prob;
    if (random <= cumulative) {
      return rank as QuestionRank;
    }
  }
  
  return 'normal';
}

// 章別ランク確率
export function getRankProbabilities(chapter: Chapter) {
  const probabilities = {
    1: { normal: 0.8, rare: 0.18, epic: 0.02, legendary: 0.0 },
    2: { normal: 0.6, rare: 0.30, epic: 0.09, legendary: 0.01 },
    3: { normal: 0.4, rare: 0.35, epic: 0.20, legendary: 0.05 },
    4: { normal: 0.25, rare: 0.35, epic: 0.30, legendary: 0.10 },
    5: { normal: 0.15, rare: 0.30, epic: 0.35, legendary: 0.20 },
  };
  
  return probabilities[chapter];
}

// ランク別XP計算
export function calculateRankXP(rank: QuestionRank, hasBonus: boolean = false): number {
  const config = NEW_XP_CONFIG.RANK_XP[rank];
  const baseXP = hasBonus ? config.bonusMin : config.min;
  const maxXP = hasBonus ? config.bonusMax : config.max;
  
  return Math.floor(Math.random() * (maxXP - baseXP + 1)) + baseXP;
}

// ステータス配分の検証
export function validateStatusAllocation(allocation: StatusAllocation): boolean {
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  return total === 30 && Object.values(allocation).every(value => value >= 0 && value <= 30);
}

// デフォルトステータス配分テンプレート
export const STATUS_TEMPLATES = {
  balanced: { listening: 5, reading: 5, writing: 5, grammar: 5, idioms: 5, vocabulary: 5 },
  vocabulary: { listening: 3, reading: 3, writing: 3, grammar: 3, idioms: 3, vocabulary: 15 },
  practical: { listening: 10, reading: 10, writing: 2.5, grammar: 2.5, idioms: 2.5, vocabulary: 2.5 },
  grammar: { listening: 1, reading: 1, writing: 1, grammar: 15, idioms: 10, vocabulary: 2 },
};

// スキルフィールドの選択（ステータス配分に基づく）
export function selectSkillField(allocation: StatusAllocation): SkillField {
  const fields: SkillField[] = ['listening', 'reading', 'writing', 'grammar', 'idioms', 'vocabulary'];
  const weights = fields.map(field => allocation[field]);
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let cumulative = 0;
  for (let i = 0; i < fields.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return fields[i];
    }
  }
  
  return 'vocabulary'; // フォールバック
}

// 新仕様のXP計算（問題ランクとボーナス考慮）
export function calculateNewXP(
  userAnswers: UserAnswer[],
  questionRank: QuestionRank,
  hasBonus: boolean = false
): number {
  const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
  const accuracy = correctCount / userAnswers.length;
  
  // 基本XP
  let baseXP = calculateRankXP(questionRank, hasBonus);
  
  // 正解率ボーナス
  if (accuracy === 1.0) {
    baseXP *= NEW_XP_CONFIG.BONUS_CONDITIONS.PERFECT_SCORE;
  } else if (accuracy >= 0.8) {
    baseXP *= NEW_XP_CONFIG.BONUS_CONDITIONS.HIGH_ACCURACY;
  }
  
  // 連続正解ボーナス
  let streakCount = 0;
  let maxStreak = 0;
  
  for (const answer of userAnswers) {
    if (answer.isCorrect) {
      streakCount++;
      maxStreak = Math.max(maxStreak, streakCount);
    } else {
      streakCount = 0;
    }
  }
  
  if (maxStreak >= 3) {
    baseXP *= NEW_XP_CONFIG.BONUS_CONDITIONS.STREAK_BONUS;
  }
  
  return Math.round(baseXP);
}

// ハートの回復処理
export function processHeartRecovery(heartSystem: HeartSystem): HeartSystem {
  const now = Date.now();
  const timeSinceLastRecovery = now - heartSystem.lastRecovery;
  const minutesElapsed = timeSinceLastRecovery / (5 * 60 * 1000);
  
  if (heartSystem.current >= heartSystem.max) {
    // 既に満タンなら次回回復時間を更新
    return {
      ...heartSystem,
      lastRecovery: now,
      nextRecovery: now + (5 * 60 * 1000),
    };
  }
  
  if (minutesElapsed >= 1) {
    const heartsToAdd = Math.floor(minutesElapsed);
    const newCurrent = Math.min(heartSystem.current + heartsToAdd, heartSystem.max);
    const remainingTime = (minutesElapsed - Math.floor(minutesElapsed)) * (5 * 60 * 1000);
    const nextRecovery = now + (5 * 60 * 1000) - remainingTime;
    
    return {
      ...heartSystem,
      current: newCurrent,
      lastRecovery: now - remainingTime,
      nextRecovery,
    };
  }
  
  return heartSystem;
}

// ハートの消費
export function consumeHeart(heartSystem: HeartSystem): HeartSystem | null {
  if (heartSystem.current <= 0) {
    return null; // ハートが足りない
  }
  
  return {
    ...heartSystem,
    current: heartSystem.current - 1,
  };
}
