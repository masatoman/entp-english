import { LevelConfig, Chapter } from '../types';

// 100レベル設定データ
export const LEVEL_CONFIGS: LevelConfig[] = [];

// レベル1-100の設定を生成
for (let level = 1; level <= 100; level++) {
  let chapter: Chapter;
  let requiredXP: number;
  let maxHearts: number;
  let rankProbabilities: {
    normal: number;
    rare: number;
    epic: number;
    legendary: number;
  };

  // 章の決定
  if (level <= 20) {
    chapter = 1;
    requiredXP = 50;
    maxHearts = 3;
    rankProbabilities = { normal: 0.8, rare: 0.18, epic: 0.02, legendary: 0.0 };
  } else if (level <= 40) {
    chapter = 2;
    requiredXP = 100;
    maxHearts = 3 + Math.floor((level - 1) / 10);
    rankProbabilities = { normal: 0.6, rare: 0.30, epic: 0.09, legendary: 0.01 };
  } else if (level <= 60) {
    chapter = 3;
    requiredXP = 200;
    maxHearts = 3 + Math.floor((level - 1) / 10);
    rankProbabilities = { normal: 0.4, rare: 0.35, epic: 0.20, legendary: 0.05 };
  } else if (level <= 80) {
    chapter = 4;
    requiredXP = 300;
    maxHearts = 3 + Math.floor((level - 1) / 10);
    rankProbabilities = { normal: 0.25, rare: 0.35, epic: 0.30, legendary: 0.10 };
  } else {
    chapter = 5;
    requiredXP = 500;
    maxHearts = 3 + Math.floor((level - 1) / 10);
    rankProbabilities = { normal: 0.15, rare: 0.30, epic: 0.35, legendary: 0.20 };
  }

  LEVEL_CONFIGS.push({
    level,
    chapter,
    requiredXP,
    maxHearts: Math.min(maxHearts, 12), // 最大12個
    rankProbabilities,
  });
}

// 章別の情報
export const CHAPTER_INFO = {
  1: {
    name: '基礎編',
    description: '英検5-4級レベル（300-1,000語）',
    levelRange: 'Level 1-20',
    xpPerLevel: 50,
    maxHearts: 4,
  },
  2: {
    name: '中級編',
    description: '英検3-2級レベル（1,000-3,000語）',
    levelRange: 'Level 21-40',
    xpPerLevel: 100,
    maxHearts: 5,
  },
  3: {
    name: '上級編',
    description: '英検2-1級レベル（3,000-6,000語）',
    levelRange: 'Level 41-60',
    xpPerLevel: 200,
    maxHearts: 6,
  },
  4: {
    name: 'マスター編',
    description: 'TOEIC800+レベル（6,000-12,000語）',
    levelRange: 'Level 61-80',
    xpPerLevel: 300,
    maxHearts: 8,
  },
  5: {
    name: 'ネイティブ編',
    description: 'ネイティブレベル（12,000-20,000語）',
    levelRange: 'Level 81-100',
    xpPerLevel: 500,
    maxHearts: 12,
  },
};

// レベル別の総必要XPを計算
export function getTotalXPForLevel(level: number): number {
  let totalXP = 0;
  
  for (let i = 1; i < level; i++) {
    const config = LEVEL_CONFIGS.find(c => c.level === i);
    if (config) {
      totalXP += config.requiredXP;
    }
  }
  
  return totalXP;
}

// レベルから章の進捗を計算
export function getChapterProgress(level: number): number {
  const config = LEVEL_CONFIGS.find(c => c.level === level);
  if (!config) return 0;
  
  const chapterStartLevel = (config.chapter - 1) * 20 + 1;
  const chapterEndLevel = config.chapter * 20;
  const currentChapterLevel = level - chapterStartLevel + 1;
  
  return (currentChapterLevel / 20) * 100;
}

// ランク別の色とアイコン
export const RANK_STYLES = {
  normal: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: '⚪',
    name: 'ノーマル',
  },
  rare: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '🟡',
    name: 'レア',
  },
  epic: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '🟣',
    name: 'エピック',
  },
  legendary: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '🟠',
    name: 'レジェンド',
  },
};

// スキルフィールドの情報
export const SKILL_FIELD_INFO = {
  listening: {
    name: 'リスニング',
    icon: '🎧',
    description: '聞き取り能力',
  },
  reading: {
    name: 'リーディング',
    icon: '📖',
    description: '読解能力',
  },
  writing: {
    name: 'ライティング',
    icon: '✍️',
    description: '文章作成能力',
  },
  grammar: {
    name: '文法',
    icon: '📝',
    description: '文法知識',
  },
  idioms: {
    name: '語法・熟語',
    icon: '💬',
    description: '語法と熟語の知識',
  },
  vocabulary: {
    name: '語彙・単語',
    icon: '📚',
    description: '単語力',
  },
};
