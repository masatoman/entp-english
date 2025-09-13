// 段階的アンロックシステム

export interface UnlockCondition {
  level: number;
  xpRequired?: number;
  streakRequired?: number;
  achievementsRequired?: string[];
}

export interface UnlockableFeature {
  id: string;
  name: string;
  description: string;
  condition: UnlockCondition;
  icon: string;
  color: string;
}

  // アンロック可能な機能の定義
export const UNLOCKABLE_FEATURES: UnlockableFeature[] = [
  // Level 1-5: 基礎編
  {
    id: 'vocabulary-beginner',
    name: '単語学習（初級）',
    description: '基本的な英単語を学習',
    condition: { level: 1 },
    icon: 'BookOpen',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'grammar-easy',
    name: '文法クイズ（簡単）',
    description: '基本的な文法問題',
    condition: { level: 1 },
    icon: 'PenTool',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'essay-beginner',
    name: '英作文（初級）',
    description: '基本的な英作文練習',
    condition: { level: 3 },
    icon: 'PenTool',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'combined-test',
    name: '総合テスト',
    description: '全スキルの総合テスト',
    condition: { level: 5 },
    icon: 'Target',
    color: 'from-orange-500 to-orange-600'
  },

  // Level 6-10: 中級編
  {
    id: 'vocabulary-intermediate',
    name: '単語学習（中級）',
    description: '中級レベルの英単語',
    condition: { level: 6 },
    icon: 'BookOpen',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'vocabulary-advanced',
    name: '単語学習（上級）',
    description: '上級レベルの英単語',
    condition: { level: 8 },
    icon: 'BookOpen',
    color: 'from-blue-700 to-blue-800'
  },
  {
    id: 'grammar-normal',
    name: '文法クイズ（普通）',
    description: '中級レベルの文法問題',
    condition: { level: 6 },
    icon: 'PenTool',
    color: 'from-emerald-600 to-emerald-700'
  },
  {
    id: 'grammar-hard',
    name: '文法クイズ（難しい）',
    description: '上級レベルの文法問題',
    condition: { level: 8 },
    icon: 'PenTool',
    color: 'from-emerald-700 to-emerald-800'
  },
  {
    id: 'essay-intermediate',
    name: '英作文（中級）',
    description: '中級レベルの英作文',
    condition: { level: 7 },
    icon: 'PenTool',
    color: 'from-purple-600 to-purple-700'
  },
  {
    id: 'essay-advanced',
    name: '英作文（上級）',
    description: '上級レベルの英作文',
    condition: { level: 9 },
    icon: 'PenTool',
    color: 'from-purple-700 to-purple-800'
  },
  {
    id: 'time-attack',
    name: 'タイムアタック',
    description: '制限時間内での連続正解チャレンジ',
    condition: { level: 8 },
    icon: 'Clock',
    color: 'from-red-500 to-red-600'
  },

  // Level 11-15: 上級編
  {
    id: 'random-events',
    name: 'ランダムイベント',
    description: '予期しないボーナス問題',
    condition: { level: 11 },
    icon: 'Zap',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'emergency-mode',
    name: '緊急学習モード',
    description: '制限時間付きの緊急チャレンジ',
    condition: { level: 12 },
    icon: 'AlertTriangle',
    color: 'from-red-600 to-red-700'
  },
  {
    id: 'combo-challenge',
    name: '連続正解チャレンジ',
    description: '連続正解でボーナス獲得',
    condition: { level: 13 },
    icon: 'Flame',
    color: 'from-orange-600 to-orange-700'
  },
  {
    id: 'special-achievements',
    name: '特別実績システム',
    description: 'レアな実績と報酬',
    condition: { level: 14 },
    icon: 'Trophy',
    color: 'from-purple-600 to-purple-700'
  }
];

/**
 * 機能がアンロックされているかチェック
 */
export function isFeatureUnlocked(featureId: string, userLevel: number, userXP: number, userStreak: number, userAchievements: string[]): boolean {
  const feature = UNLOCKABLE_FEATURES.find(f => f.id === featureId);
  if (!feature) return false;

  const { condition } = feature;
  
  // レベルチェック
  if (userLevel < condition.level) return false;
  
  // XPチェック
  if (condition.xpRequired && userXP < condition.xpRequired) return false;
  
  // ストリークチェック
  if (condition.streakRequired && userStreak < condition.streakRequired) return false;
  
  // 実績チェック
  if (condition.achievementsRequired) {
    const hasAllAchievements = condition.achievementsRequired.every(achievementId => 
      userAchievements.includes(achievementId)
    );
    if (!hasAllAchievements) return false;
  }
  
  return true;
}

/**
 * 利用可能な機能の一覧を取得
 */
export function getAvailableFeatures(userLevel: number, userXP: number, userStreak: number, userAchievements: string[]): UnlockableFeature[] {
  return UNLOCKABLE_FEATURES.filter(feature => 
    isFeatureUnlocked(feature.id, userLevel, userXP, userStreak, userAchievements)
  );
}

/**
 * 次のアンロック予定の機能を取得
 */
export function getNextUnlockableFeatures(userLevel: number, userXP: number, userStreak: number, userAchievements: string[]): UnlockableFeature[] {
  return UNLOCKABLE_FEATURES.filter(feature => {
    const { condition } = feature;
    
    // まだアンロックされていない
    if (isFeatureUnlocked(feature.id, userLevel, userXP, userStreak, userAchievements)) return false;
    
    // 次のレベルでアンロック可能
    return userLevel + 1 >= condition.level;
  });
}

/**
 * 機能のアンロック条件を取得
 */
export function getUnlockCondition(featureId: string): UnlockCondition | null {
  const feature = UNLOCKABLE_FEATURES.find(f => f.id === featureId);
  return feature ? feature.condition : null;
}
