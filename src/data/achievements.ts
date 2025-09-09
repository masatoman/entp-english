export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'vocabulary' | 'grammar' | 'quiz' | 'score';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirement: number;
  xpReward: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  vocabularyStudied: number;
  grammarQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  averageScore: number;
  lastStudyDate: string;
}


export const achievements: Achievement[] = [
  // Streak achievements
  {
    id: 'streak_3',
    title: '三日坊主克服',
    description: '3日連続で学習',
    icon: '🔥',
    type: 'streak',
    tier: 'bronze',
    requirement: 3,
    xpReward: 50,
    isUnlocked: true,
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: '一週間戦士',
    description: '7日連続で学習',
    icon: '⚡',
    type: 'streak',
    tier: 'silver',
    requirement: 7,
    xpReward: 100,
    isUnlocked: true,
    progress: 7,
    maxProgress: 7
  },
  {
    id: 'streak_14',
    title: '継続の力',
    description: '14日連続で学習',
    icon: '🌟',
    type: 'streak',
    tier: 'gold',
    requirement: 14,
    xpReward: 200,
    isUnlocked: false,
    progress: 7,
    maxProgress: 14
  },
  {
    id: 'streak_30',
    title: 'マスターの道',
    description: '30日連続で学習',
    icon: '👑',
    type: 'streak',
    tier: 'platinum',
    requirement: 30,
    xpReward: 500,
    isUnlocked: false,
    progress: 7,
    maxProgress: 30
  },

  // Vocabulary achievements
  {
    id: 'vocab_50',
    title: '単語コレクター',
    description: '50個の単語を学習',
    icon: '📚',
    type: 'vocabulary',
    tier: 'bronze',
    requirement: 50,
    xpReward: 75,
    isUnlocked: true,
    progress: 125,
    maxProgress: 50
  },
  {
    id: 'vocab_100',
    title: '語彙マスター',
    description: '100個の単語を学習',
    icon: '🎓',
    type: 'vocabulary',
    tier: 'silver',
    requirement: 100,
    xpReward: 150,
    isUnlocked: true,
    progress: 125,
    maxProgress: 100
  },
  {
    id: 'vocab_250',
    title: '単語の達人',
    description: '250個の単語を学習',
    icon: '🏆',
    type: 'vocabulary',
    tier: 'gold',
    requirement: 250,
    xpReward: 300,
    isUnlocked: false,
    progress: 125,
    maxProgress: 250
  },

  // Grammar quiz achievements
  {
    id: 'quiz_10',
    title: 'クイズ初心者',
    description: '10回文法クイズを完了',
    icon: '🧩',
    type: 'quiz',
    tier: 'bronze',
    requirement: 10,
    xpReward: 60,
    isUnlocked: true,
    progress: 23,
    maxProgress: 10
  },
  {
    id: 'quiz_25',
    title: 'クイズ愛好家',
    description: '25回文法クイズを完了',
    icon: '🎯',
    type: 'quiz',
    tier: 'silver',
    requirement: 25,
    xpReward: 120,
    isUnlocked: false,
    progress: 23,
    maxProgress: 25
  },

  // Score achievements
  {
    id: 'perfect_score',
    title: 'パーフェクト',
    description: '満点を獲得',
    icon: '💯',
    type: 'score',
    tier: 'gold',
    requirement: 100,
    xpReward: 250,
    isUnlocked: false,
    progress: 90,
    maxProgress: 100
  },
  {
    id: 'high_accuracy',
    title: '正確性マスター',
    description: '正解率85%以上を達成',
    icon: '🎖️',
    type: 'score',
    tier: 'silver',
    requirement: 85,
    xpReward: 180,
    isUnlocked: false,
    progress: 80,
    maxProgress: 85
  }
];

export function getTierColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze': return 'from-amber-600 to-yellow-600';
    case 'silver': return 'from-gray-400 to-gray-600';
    case 'gold': return 'from-yellow-400 to-yellow-600';
    case 'platinum': return 'from-purple-400 to-purple-600';
    case 'diamond': return 'from-blue-400 to-cyan-400';
    default: return 'from-gray-300 to-gray-500';
  }
}

export function getTierTextColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze': return 'text-amber-700';
    case 'silver': return 'text-gray-700';
    case 'gold': return 'text-yellow-700';
    case 'platinum': return 'text-purple-700';
    case 'diamond': return 'text-cyan-700';
    default: return 'text-gray-700';
  }
}