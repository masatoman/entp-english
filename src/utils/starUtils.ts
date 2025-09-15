import { StarData, STAR_RECOVERY_TIME, MAX_STARS_BASE, STARS_INCREASE_EVERY_LEVELS } from '../types/starSystem';

// スター回復の計算
export const calculateRecoveredStars = (
  stars: StarData,
  currentTime: number = Date.now()
): number => {
  if (stars.current >= stars.max) return stars.current;
  
  const timeSinceLastRecovery = currentTime - stars.lastRecoveryTime;
  const recoveredCount = Math.floor(timeSinceLastRecovery / STAR_RECOVERY_TIME);
  
  return Math.min(stars.current + recoveredCount, stars.max);
};

// 次のスター回復までの時間を取得
export const getNextStarRecoveryTime = (stars: StarData): number => {
  if (stars.current >= stars.max) return 0;
  
  const timeSinceLastRecovery = Date.now() - stars.lastRecoveryTime;
  const timeUntilNextRecovery = STAR_RECOVERY_TIME - (timeSinceLastRecovery % STAR_RECOVERY_TIME);
  
  return timeUntilNextRecovery;
};

// スターを使用できるかチェック
export const canUseStars = (stars: StarData, required: number = 1): boolean => {
  const currentStars = calculateRecoveredStars(stars);
  return currentStars >= required;
};

// レベルに基づく最大スター数を計算
export const calculateMaxStars = (level: number): number => {
  return MAX_STARS_BASE + Math.floor((level - 1) / STARS_INCREASE_EVERY_LEVELS);
};

// スターシステムの初期化
export const initializeStarSystem = (level: number): StarData => {
  const maxStars = calculateMaxStars(level);
  return {
    current: maxStars,
    max: maxStars,
    lastRecoveryTime: Date.now()
  };
};

// スターを消費
export const consumeStar = (stars: StarData): StarData => {
  if (stars.current <= 0) return stars;
  
  return {
    ...stars,
    current: stars.current - 1,
    lastRecoveryTime: Date.now()
  };
};

// スターを回復
export const recoverStars = (stars: StarData): StarData => {
  const recoveredStars = calculateRecoveredStars(stars);
  if (recoveredStars > stars.current) {
    return {
      ...stars,
      current: recoveredStars,
      lastRecoveryTime: Date.now()
    };
  }
  return stars;
};

// 時間をフォーマット（分:秒）
export const formatTimeUntilRecovery = (milliseconds: number): string => {
  if (milliseconds <= 0) return '満タン';
  
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  } else {
    return `${minutes}分`;
  }
};
