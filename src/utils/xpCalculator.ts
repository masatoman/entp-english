import { UserAnswer } from '../types';
import { Category } from '../types';

// XP計算の設定
export const XP_CONFIG = {
  // 基本XP
  BASE_CORRECT_ANSWER: 10,
  BASE_WRONG_ANSWER: 0,
  
  // 難易度倍率
  DIFFICULTY_MULTIPLIER: {
    easy: 1.0,
    normal: 1.5,
    hard: 2.0,
  },
  
  // カテゴリー倍率
  CATEGORY_MULTIPLIER: {
    'basic-grammar': 1.0,
    'tenses': 1.2,
    'modals': 1.3,
    'passive': 1.4,
    'relative': 1.5,
    'subjunctive': 1.6,
    'comparison': 1.3,
    'participle': 1.4,
    'infinitive': 1.5,
  },
  
  // ボーナスXP
  PERFECT_SCORE_BONUS: 50,
  HIGH_ACCURACY_BONUS: 25, // 80%以上
  STREAK_BONUS: 10, // 連続正解ボーナス
  FIRST_ATTEMPT_BONUS: 5, // 初回正解ボーナス
};

// 学習セッションの結果からXPを計算
export function calculateXP(
  userAnswers: UserAnswer[],
  difficulty: 'easy' | 'normal' | 'hard',
  category: Category,
  isFirstAttempt: boolean = false
): number {
  let totalXP = 0;
  let correctCount = 0;
  let streakCount = 0;
  let maxStreak = 0;

  // 各回答のXPを計算
  userAnswers.forEach((answer, index) => {
    if (answer.isCorrect) {
      correctCount++;
      streakCount++;
      maxStreak = Math.max(maxStreak, streakCount);
      
      // 基本XP
      let xp = XP_CONFIG.BASE_CORRECT_ANSWER;
      
      // 難易度倍率を適用
      xp *= XP_CONFIG.DIFFICULTY_MULTIPLIER[difficulty];
      
      // カテゴリー倍率を適用
      xp *= XP_CONFIG.CATEGORY_MULTIPLIER[category];
      
      // 初回正解ボーナス
      if (isFirstAttempt) {
        xp += XP_CONFIG.FIRST_ATTEMPT_BONUS;
      }
      
      // 連続正解ボーナス
      if (streakCount >= 3) {
        xp += XP_CONFIG.STREAK_BONUS;
      }
      
      totalXP += Math.round(xp);
    } else {
      streakCount = 0;
    }
  });

  // 正解率ボーナス
  const accuracy = (correctCount / userAnswers.length) * 100;
  if (accuracy === 100) {
    totalXP += XP_CONFIG.PERFECT_SCORE_BONUS;
  } else if (accuracy >= 80) {
    totalXP += XP_CONFIG.HIGH_ACCURACY_BONUS;
  }

  return totalXP;
}

// 語彙学習のXP計算
export function calculateVocabularyXP(
  wordsStudied: number,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  const baseXP = 5; // 1単語あたりの基本XP
  const difficultyMultiplier = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0,
  };
  
  return Math.round(wordsStudied * baseXP * difficultyMultiplier[difficulty]);
}

// 学習時間に基づくボーナスXP
export function calculateTimeBonusXP(durationSeconds: number): number {
  const durationMinutes = durationSeconds / 60;
  
  // 学習時間に応じたボーナス
  if (durationMinutes >= 30) return 20; // 30分以上
  if (durationMinutes >= 15) return 10; // 15分以上
  if (durationMinutes >= 5) return 5;   // 5分以上
  
  return 0;
}

// 総合XP計算（学習セッション全体）
export function calculateTotalSessionXP(
  userAnswers: UserAnswer[],
  difficulty: 'easy' | 'normal' | 'hard',
  category: Category,
  durationSeconds: number,
  isFirstAttempt: boolean = false
): number {
  const baseXP = calculateXP(userAnswers, difficulty, category, isFirstAttempt);
  const timeBonus = calculateTimeBonusXP(durationSeconds);
  
  return baseXP + timeBonus;
}

// レベル計算（XPからレベルを算出）
export function calculateLevel(totalXP: number): number {
  // レベルアップに必要なXP: 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250...
  // 式: level * 100 + (level - 1) * 50
  let level = 1;
  let requiredXP = 0;
  
  while (requiredXP <= totalXP) {
    requiredXP += level * 100 + (level - 1) * 50;
    if (requiredXP <= totalXP) {
      level++;
    }
  }
  
  return level;
}

// 次のレベルまでのXP
export function getXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  let requiredXP = 0;
  
  for (let i = 1; i <= currentLevel; i++) {
    requiredXP += i * 100 + (i - 1) * 50;
  }
  
  return requiredXP - totalXP;
}

// 現在のレベルの進捗率
export function getLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  let currentLevelStartXP = 0;
  let nextLevelXP = 0;
  
  for (let i = 1; i < currentLevel; i++) {
    currentLevelStartXP += i * 100 + (i - 1) * 50;
  }
  
  nextLevelXP = currentLevelStartXP + currentLevel * 100 + (currentLevel - 1) * 50;
  
  const currentLevelXP = totalXP - currentLevelStartXP;
  const levelXPNeeded = nextLevelXP - currentLevelStartXP;
  
  return (currentLevelXP / levelXPNeeded) * 100;
}