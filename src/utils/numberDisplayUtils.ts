/**
 * 数値表示の制限とフォーマット管理
 * 実際のユーザー使用を想定した現実的な上限を設定
 */

// 最大値制限の定義
export const NUMBER_LIMITS = {
  COINS: 999999, // コイン: 99万9999まで（約100万）
  XP: 9999999, // XP: 999万9999まで（約1000万）
  LEVEL: 999, // レベル: 999まで
  HEARTS: 99, // ハート: 99まで
  STARS: 99, // スター: 99まで
  PROGRESS: 100, // 進捗: 100%まで
} as const;

/**
 * 数値を指定された上限で制限する
 */
export const limitNumber = (value: number, limit: number): number => {
  return Math.min(Math.max(value, 0), limit);
};

/**
 * コインの値を制限する
 */
export const limitCoins = (coins: number): number => {
  return limitNumber(coins, NUMBER_LIMITS.COINS);
};

/**
 * XPの値を制限する
 */
export const limitXP = (xp: number): number => {
  return limitNumber(xp, NUMBER_LIMITS.XP);
};

/**
 * レベルの値を制限する
 */
export const limitLevel = (level: number): number => {
  return limitNumber(level, NUMBER_LIMITS.LEVEL);
};

/**
 * ハートの値を制限する
 */
export const limitHearts = (hearts: number): number => {
  return limitNumber(hearts, NUMBER_LIMITS.HEARTS);
};

/**
 * スターの値を制限する
 */
export const limitStars = (stars: number): number => {
  return limitNumber(stars, NUMBER_LIMITS.STARS);
};

/**
 * 進捗の値を制限する
 */
export const limitProgress = (progress: number): number => {
  return limitNumber(progress, NUMBER_LIMITS.PROGRESS);
};

/**
 * 数値を短縮表示用にフォーマットする
 * 例: 1000 → "1K", 1000000 → "1M"
 */
export const formatNumberShort = (value: number): string => {
  if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`;
  } else if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  } else {
    return value.toString();
  }
};

/**
 * 数値を完全表示用にフォーマットする
 * 例: 1234567 → "1,234,567"
 */
export const formatNumberFull = (value: number): string => {
  return value.toLocaleString();
};

/**
 * 数値が上限に達しているかチェック
 */
export const isAtLimit = (value: number, limit: number): boolean => {
  return value >= limit;
};

/**
 * 数値が上限に達している場合の警告メッセージを生成
 */
export const getLimitWarningMessage = (type: string, limit: number): string => {
  return `${type}が上限（${formatNumberFull(limit)}）に達しました！`;
};

/**
 * 数値表示の設定
 */
export const DISPLAY_CONFIG = {
  // 短縮表示を使用する閾値
  SHORT_DISPLAY_THRESHOLD: 1000,

  // ツールチップで完全表示を表示するか
  SHOW_FULL_IN_TOOLTIP: true,

  // 上限到達時の警告表示
  SHOW_LIMIT_WARNING: true,
} as const;

/**
 * 数値表示のための統一フォーマット関数
 */
export const formatDisplayNumber = (
  value: number,
  type: "coins" | "xp" | "level" | "hearts" | "stars" | "progress"
): {
  display: string;
  full: string;
  isLimited: boolean;
  isAtMax: boolean;
} => {
  let limitedValue: number;
  let maxLimit: number;

  switch (type) {
    case "coins":
      limitedValue = limitCoins(value);
      maxLimit = NUMBER_LIMITS.COINS;
      break;
    case "xp":
      limitedValue = limitXP(value);
      maxLimit = NUMBER_LIMITS.XP;
      break;
    case "level":
      limitedValue = limitLevel(value);
      maxLimit = NUMBER_LIMITS.LEVEL;
      break;
    case "hearts":
      limitedValue = limitHearts(value);
      maxLimit = NUMBER_LIMITS.HEARTS;
      break;
    case "stars":
      limitedValue = limitStars(value);
      maxLimit = NUMBER_LIMITS.STARS;
      break;
    case "progress":
      limitedValue = limitProgress(value);
      maxLimit = NUMBER_LIMITS.PROGRESS;
      break;
    default:
      limitedValue = value;
      maxLimit = value;
  }

  const isLimited = limitedValue !== value;
  const isAtMax = limitedValue >= maxLimit;

  // 表示用の短縮フォーマット
  const display =
    limitedValue >= DISPLAY_CONFIG.SHORT_DISPLAY_THRESHOLD
      ? formatNumberShort(limitedValue)
      : limitedValue.toString();

  // 完全表示
  const full = formatNumberFull(limitedValue);

  return {
    display,
    full,
    isLimited,
    isAtMax,
  };
};
