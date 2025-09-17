import { Achievement } from "../types";

/**
 * 相乗効果を重視した機能横断型実績
 */
export const synergyAchievements: Achievement[] = [
  // 学習フロー完走実績
  {
    id: "theory-to-practice-master",
    name: "理論→実践マスター",
    description: "事前学習→文法クイズ→英作文の完璧な学習フローを完走",
    category: "learning-flow",
    level: "gold",
    xpReward: 100,
    condition: {
      type: "custom",
      value: "complete-learning-flow",
    },
    unlockedAt: null,
    icon: "🎓",
    requirements: [
      "事前学習で理論を学ぶ",
      "対応する文法クイズで練習",
      "関連する英作文課題を完了",
    ],
  },

  {
    id: "gacha-vocabulary-master",
    name: "ガチャ語彙マスター",
    description: "ガチャ→語彙学習→英作文での語彙活用を達成",
    category: "vocabulary-synergy",
    level: "gold",
    xpReward: 80,
    condition: {
      type: "custom",
      value: "gacha-vocab-synergy",
    },
    unlockedAt: null,
    icon: "🎯",
    requirements: [
      "ガチャで語彙カードを獲得",
      "語彙学習で定着",
      "英作文で実際に使用",
    ],
  },

  {
    id: "speed-learning-champion",
    name: "スピード学習チャンピオン",
    description: "タイムアタックで獲得語彙を活用して高得点達成",
    category: "speed-learning",
    level: "platinum",
    xpReward: 150,
    condition: {
      type: "custom",
      value: "time-attack-vocab-high-score",
    },
    unlockedAt: null,
    icon: "⚡",
    requirements: [
      "ガチャ語彙20枚以上獲得",
      "タイムアタックで80%以上の正答率",
      "ガチャ語彙を5個以上使用",
    ],
  },

  {
    id: "comprehensive-learner",
    name: "総合学習者",
    description: "全ての学習機能を活用した包括的学習を達成",
    category: "comprehensive",
    level: "diamond",
    xpReward: 200,
    condition: {
      type: "custom",
      value: "use-all-features",
    },
    unlockedAt: null,
    icon: "💎",
    requirements: [
      "事前学習を3件以上完了",
      "文法クイズを3カテゴリー以上完了",
      "語彙学習を継続使用",
      "英作文を5件以上完了",
      "タイムアタックで高得点達成",
      "総合テストで80%以上",
    ],
  },

  {
    id: "synergy-explorer",
    name: "相乗効果エクスプローラー",
    description: "学習機能間の連携を最大限活用",
    category: "synergy",
    level: "platinum",
    xpReward: 120,
    condition: {
      type: "custom",
      value: "maximize-synergy",
    },
    unlockedAt: null,
    icon: "🔗",
    requirements: [
      "同じ文法カテゴリーで事前学習→クイズ→英作文を完了",
      "ガチャ語彙を語彙学習と英作文で活用",
      "弱点分野をタイムアタックで克服",
    ],
  },

  {
    id: "consistency-king",
    name: "継続の王様",
    description: "7日連続で複数の学習機能を使用",
    category: "consistency",
    level: "gold",
    xpReward: 90,
    condition: {
      type: "custom",
      value: "multi-feature-streak",
    },
    unlockedAt: null,
    icon: "👑",
    requirements: [
      "7日連続でログイン",
      "毎日2つ以上の学習機能を使用",
      "事前学習・クイズ・英作文のいずれかを毎日実行",
    ],
  },

  {
    id: "vocabulary-collector",
    name: "語彙コレクター",
    description: "ガチャで多様な語彙を収集し、実際の学習で活用",
    category: "collection",
    level: "silver",
    xpReward: 60,
    condition: {
      type: "custom",
      value: "vocabulary-collection-usage",
    },
    unlockedAt: null,
    icon: "📚",
    requirements: [
      "ガチャで50枚以上のカードを獲得",
      "レアリティ別に各5枚以上収集",
      "獲得語彙の70%以上を語彙学習で練習",
    ],
  },

  {
    id: "grammar-perfectionist",
    name: "文法完璧主義者",
    description: "文法の理論学習から実践まで完璧にマスター",
    category: "grammar-mastery",
    level: "platinum",
    xpReward: 130,
    condition: {
      type: "custom",
      value: "grammar-perfect-flow",
    },
    unlockedAt: null,
    icon: "📖",
    requirements: [
      "5つ以上の文法カテゴリーで事前学習完了",
      "対応する文法クイズで90%以上の正答率",
      "各カテゴリーの英作文課題を完了",
    ],
  },

  {
    id: "adaptive-learner",
    name: "適応学習者",
    description: "弱点を特定し、適切な学習方法で改善",
    category: "adaptation",
    level: "gold",
    xpReward: 85,
    condition: {
      type: "custom",
      value: "adaptive-improvement",
    },
    unlockedAt: null,
    icon: "🧠",
    requirements: [
      "弱点分野を特定",
      "該当する事前学習を完了",
      "弱点分野の問題で改善を確認",
    ],
  },

  {
    id: "efficiency-optimizer",
    name: "効率最適化者",
    description: "学習効率を最大化する機能使用パターンを確立",
    category: "efficiency",
    level: "diamond",
    xpReward: 180,
    condition: {
      type: "custom",
      value: "optimize-learning-efficiency",
    },
    unlockedAt: null,
    icon: "⚙️",
    requirements: [
      "事前学習→クイズ→英作文のフローを5回以上実行",
      "ガチャ語彙の活用率80%以上",
      "学習時間あたりのXP効率を最大化",
    ],
  },
];

/**
 * 相乗効果実績の進捗チェック
 */
export function checkSynergyAchievements(): {
  newlyUnlocked: Achievement[];
  progressUpdates: { achievementId: string; progress: number }[];
} {
  const newlyUnlocked: Achievement[] = [];
  const progressUpdates: { achievementId: string; progress: number }[] = [];

  // TODO: 実際のデータと連携して実績チェック
  // 例：理論→実践マスターの進捗確認
  // 例：ガチャ語彙マスターの進捗確認
  // 例：総合学習者の進捗確認

  return {
    newlyUnlocked,
    progressUpdates,
  };
}

/**
 * 実績解除条件の詳細説明
 */
export function getAchievementRequirementDetails(achievementId: string): {
  currentProgress: any;
  nextSteps: string[];
  estimatedCompletion: string;
} {
  // TODO: 実装
  return {
    currentProgress: {},
    nextSteps: [],
    estimatedCompletion: "未実装",
  };
}
