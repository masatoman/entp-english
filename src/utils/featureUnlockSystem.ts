/**
 * 機能アンロックシステム
 * ENTP学習者の特性を考慮した段階的な機能解放
 */

export interface FeatureCondition {
  level?: number;
  xp?: number;
  streak?: number;
  achievement?: string;
}

export interface Feature {
  id: string;
  name: string;
  icon: string;
  condition: FeatureCondition;
}

/**
 * 機能のアンロック条件を定義
 */
export const FEATURE_DEFINITIONS: Feature[] = [
  // 基本機能（常にアンロック）
  {
    id: 'vocabulary-beginner',
    name: '単語学習（初級）',
    icon: 'BookOpen',
    condition: {}
  },
  {
    id: 'grammar-easy',
    name: '文法クイズ（初級）',
    icon: 'PenTool',
    condition: {}
  },
  
  // レベル2でアンロック
  {
    id: 'essay-beginner',
    name: '英作文（初級）',
    icon: 'PenTool',
    condition: { level: 2 }
  },
  
  // レベル3でアンロック
  {
    id: 'vocabulary-intermediate',
    name: '単語学習（中級）',
    icon: 'BookOpen',
    condition: { level: 3 }
  },
  
  // 実績条件でアンロック
  {
    id: 'advanced-vocabulary',
    name: '単語学習（上級）',
    icon: 'BookOpen',
    condition: { achievement: 'vocabulary-master' }
  },
  
  // 複数条件でアンロック
  {
    id: 'advanced-grammar',
    name: '文法クイズ（上級）',
    icon: 'PenTool',
    condition: { level: 2, xp: 200, streak: 7 }
  },
  {
    id: 'grammar-intermediate',
    name: '文法クイズ（中級）',
    icon: 'PenTool',
    condition: { level: 3 }
  },
  
  // 200XPでアンロック
  {
    id: 'combined-test',
    name: '総合テスト',
    icon: 'Target',
    condition: { xp: 200 }
  },
  
  // 7日連続でアンロック
  {
    id: 'time-attack',
    name: 'タイムアタック',
    icon: 'Clock',
    condition: { streak: 7 }
  },
  
  // レベル5でアンロック
  
  // 500XPでアンロック
  {
    id: 'essay-intermediate',
    name: '英作文（中級）',
    icon: 'PenTool',
    condition: { xp: 500 }
  },
  
  // 14日連続でアンロック
  {
    id: 'daily-challenge',
    name: 'デイリーチャレンジ',
    icon: 'Zap',
    condition: { streak: 14 }
  },
  
  // レベル10でアンロック
  {
    id: 'master-level',
    name: 'マスターレベル',
    icon: 'Trophy',
    condition: { level: 10 }
  },
  
  // 1000XPでアンロック
  {
    id: 'essay-advanced',
    name: '英作文（上級）',
    icon: 'PenTool',
    condition: { xp: 1000 }
  },
  
  // 30日連続でアンロック
  {
    id: 'streak-master',
    name: 'ストリークマスター',
    icon: 'Flame',
    condition: { streak: 30 }
  },
  
  // 実績条件でアンロック
  {
    id: 'vocabulary-master',
    name: '語彙マスター',
    icon: 'BookOpen',
    condition: { achievement: 'vocabulary-master' }
  },
  {
    id: 'grammar-master',
    name: '文法マスター',
    icon: 'PenTool',
    condition: { achievement: 'grammar-master' }
  },
  {
    id: 'writing-master',
    name: 'ライティングマスター',
    icon: 'PenTool',
    condition: { achievement: 'writing-master' }
  }
];

/**
 * 機能がアンロックされているかチェック
 */
export function isFeatureUnlocked(
  featureId: string,
  level: number,
  totalXP: number,
  streak: number,
  unlockedAchievements: string[] | null
): boolean {
  const feature = FEATURE_DEFINITIONS.find(f => f.id === featureId);
  if (!feature) return false;
  
  const { condition } = feature;
  
  // 条件がない場合は常にアンロック
  if (Object.keys(condition).length === 0) return true;
  
  // レベル条件
  if (condition.level && level < condition.level) return false;
  
  // XP条件
  if (condition.xp && totalXP < condition.xp) return false;
  
  // ストリーク条件
  if (condition.streak && streak < condition.streak) return false;
  
  // 実績条件
  if (condition.achievement && (!unlockedAchievements || !unlockedAchievements.includes(condition.achievement))) return false;
  
  return true;
}

/**
 * 利用可能な機能を取得
 */
export function getAvailableFeatures(
  level: number,
  totalXP: number,
  streak: number,
  unlockedAchievements: string[] | null
): Feature[] {
  return FEATURE_DEFINITIONS.filter(feature => 
    isFeatureUnlocked(feature.id, level, totalXP, streak, unlockedAchievements || [])
  );
}

/**
 * 次のアンロック予定の機能を取得
 */
export function getNextUnlockableFeatures(
  level: number,
  totalXP: number,
  streak: number,
  unlockedAchievements: string[] | null
): Feature[] {
  return FEATURE_DEFINITIONS
    .filter(feature => !isFeatureUnlocked(feature.id, level, totalXP, streak, unlockedAchievements || []))
    .sort((a, b) => {
      // 優先順位: レベル > XP > ストリーク > 実績
      const getPriority = (feature: Feature) => {
        const { condition } = feature;
        if (condition.level) return condition.level * 1000; // レベルを優先に
        if (condition.xp) return condition.xp + 10000; // XPはレベルより低い優先順位
        if (condition.streak) return condition.streak * 10 + 20000; // ストリークはさらに低い優先順位
        if (condition.achievement) return 9999;
        return 0;
      };
      
      return getPriority(a) - getPriority(b);
    })
    .slice(0, 5); // 最大5つまで表示
}

/**
 * 機能のアンロック条件を取得
 */
export function getUnlockCondition(featureId: string): FeatureCondition | null {
  const feature = FEATURE_DEFINITIONS.find(f => f.id === featureId);
  return feature ? feature.condition : null;
}

/**
 * 機能の詳細情報を取得
 */
export function getFeatureInfo(featureId: string): Feature | null {
  return FEATURE_DEFINITIONS.find(f => f.id === featureId) || null;
}

/**
 * 全ての機能定義を取得
 */
export function getAllFeatures(): Feature[] {
  return [...FEATURE_DEFINITIONS];
}

/**
 * カテゴリ別の機能を取得
 */
export function getFeaturesByCategory(category: 'vocabulary' | 'grammar' | 'writing' | 'test' | 'game'): Feature[] {
  return FEATURE_DEFINITIONS.filter(feature => {
    switch (category) {
      case 'vocabulary':
        return feature.id.includes('vocabulary');
      case 'grammar':
        return feature.id.includes('grammar');
      case 'writing':
        return feature.id.includes('essay') || feature.id.includes('writing');
      case 'test':
        return feature.id.includes('test') || feature.id.includes('challenge');
      case 'game':
        return feature.id.includes('time-attack') || feature.id.includes('tower-defense');
      default:
        return false;
    }
  });
}

/**
 * 機能の進捗状況を取得
 */
export function getFeatureProgress(
  featureId: string,
  level: number,
  totalXP: number,
  streak: number,
  unlockedAchievements: string[] | null
): {
  isUnlocked: boolean;
  progress: number;
  nextRequirement?: string;
} {
  const feature = FEATURE_DEFINITIONS.find(f => f.id === featureId);
  if (!feature) {
    return { isUnlocked: false, progress: 0 };
  }
  
  const isUnlocked = isFeatureUnlocked(featureId, level, totalXP, streak, unlockedAchievements || []);
  if (isUnlocked) {
    return { isUnlocked: true, progress: 100 };
  }
  
  const { condition } = feature;
  let progress = 0;
  let nextRequirement = '';
  
  if (condition.level) {
    progress = Math.min((level / condition.level) * 100, 100);
    nextRequirement = `Level ${condition.level}でアンロック`;
  } else if (condition.xp) {
    progress = Math.min((totalXP / condition.xp) * 100, 100);
    nextRequirement = `${condition.xp}XPでアンロック`;
  } else if (condition.streak) {
    progress = Math.min((streak / condition.streak) * 100, 100);
    nextRequirement = `${condition.streak}日連続でアンロック`;
  } else if (condition.achievement) {
    progress = (unlockedAchievements && unlockedAchievements.includes(condition.achievement)) ? 100 : 0;
    nextRequirement = `実績「${condition.achievement}」でアンロック`;
  }
  
  return {
    isUnlocked,
    progress: Math.round(progress),
    nextRequirement
  };
}
