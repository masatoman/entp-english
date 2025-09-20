import { Category } from "../types";

/**
 * スキルツリー管理システム
 * 文法学習の論理的な進行を視覚化
 */

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  category: Category | "foundation";
  subcategory?: string;
  level: number;
  position: { x: number; y: number };
  icon: string;
  color: string;
  prerequisites: string[];
  unlocks: string[];
  masteryRequirement: number; // 80% = 解放条件
  estimatedTime: number; // 分
  difficulty: "beginner" | "intermediate" | "advanced";
  rewards: {
    xp: number;
    badges: string[];
    unlockedFeatures: string[];
  };
}

export interface SkillTreeProgress {
  nodeId: string;
  isUnlocked: boolean;
  masteryLevel: number; // 0-100%
  completedProblems: number;
  totalProblems: number;
  lastStudied: Date;
  averageScore: number;
  timeSpent: number; // 分
}

export interface SkillTreeState {
  progress: Record<string, SkillTreeProgress>;
  currentLevel: number;
  totalXP: number;
  unlockedNodes: string[];
  completedNodes: string[];
  availableNodes: string[];
}

/**
 * 包括的英語学習スキルツリーの定義
 */
export const GRAMMAR_SKILL_TREE: SkillNode[] = [
  // === Super Foundation Level (Level 0) ===
  {
    id: "parts-of-speech",
    name: "品詞の理解",
    description: "名詞・動詞・形容詞・副詞の基本",
    category: "parts-of-speech",
    level: 0,
    position: { x: 200, y: 50 },
    icon: "📝",
    color: "bg-slate-100 border-slate-300 text-slate-800",
    prerequisites: [],
    unlocks: ["word-order", "pronouns"],
    masteryRequirement: 80,
    estimatedTime: 25,
    difficulty: "beginner",
    rewards: {
      xp: 80,
      badges: ["英語の基本要素マスター"],
      unlockedFeatures: ["語順学習", "代名詞学習"],
    },
  },
  {
    id: "word-order",
    name: "語順の基本",
    description: "英語の基本語順ルール",
    category: "word-order",
    level: 0,
    position: { x: 100, y: 150 },
    icon: "🔤",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    prerequisites: ["parts-of-speech"],
    unlocks: ["articles", "sv-basic"],
    masteryRequirement: 80,
    estimatedTime: 30,
    difficulty: "beginner",
    rewards: {
      xp: 100,
      badges: ["語順マスター"],
      unlockedFeatures: ["冠詞学習", "基本文型"],
    },
  },
  {
    id: "pronouns",
    name: "代名詞",
    description: "人称代名詞・所有代名詞の使い分け",
    category: "pronouns",
    level: 0,
    position: { x: 300, y: 150 },
    icon: "👤",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    prerequisites: ["parts-of-speech"],
    unlocks: ["plurals", "sv-basic"],
    masteryRequirement: 80,
    estimatedTime: 25,
    difficulty: "beginner",
    rewards: {
      xp: 90,
      badges: ["代名詞マスター"],
      unlockedFeatures: ["複数形学習", "基本文型"],
    },
  },
  {
    id: "articles",
    name: "冠詞",
    description: "a / an / the の使い分け",
    category: "articles",
    level: 0,
    position: { x: 50, y: 250 },
    icon: "🅰️",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    prerequisites: ["word-order"],
    unlocks: ["questions-negations"],
    masteryRequirement: 80,
    estimatedTime: 35,
    difficulty: "beginner",
    rewards: {
      xp: 120,
      badges: ["冠詞マスター"],
      unlockedFeatures: ["疑問文・否定文"],
    },
  },
  {
    id: "plurals",
    name: "複数形",
    description: "可算・不可算名詞の理解",
    category: "plurals",
    level: 0,
    position: { x: 350, y: 250 },
    icon: "📊",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    prerequisites: ["pronouns"],
    unlocks: ["questions-negations"],
    masteryRequirement: 80,
    estimatedTime: 30,
    difficulty: "beginner",
    rewards: {
      xp: 110,
      badges: ["複数形マスター"],
      unlockedFeatures: ["疑問文・否定文"],
    },
  },
  {
    id: "questions-negations",
    name: "疑問文・否定文",
    description: "基本的な文の変換",
    category: "questions-negations",
    level: 0,
    position: { x: 200, y: 350 },
    icon: "❓",
    color: "bg-red-100 border-red-300 text-red-800",
    prerequisites: ["articles", "plurals"],
    unlocks: ["sv-basic"],
    masteryRequirement: 80,
    estimatedTime: 40,
    difficulty: "beginner",
    rewards: {
      xp: 150,
      badges: ["文変換マスター"],
      unlockedFeatures: ["基本文型学習"],
    },
  },

  // === Foundation Level (Level 1) ===
  {
    id: "sv-basic",
    name: "SV文型",
    description: "主語 + 動詞の最基本構造",
    category: "basic-grammar",
    subcategory: "sv",
    level: 1,
    position: { x: 200, y: 450 },
    icon: "🌱",
    color: "bg-green-100 border-green-300 text-green-800",
    prerequisites: ["word-order", "pronouns", "questions-negations"],
    unlocks: ["svo-basic", "svc-basic"],
    masteryRequirement: 80,
    estimatedTime: 30,
    difficulty: "beginner",
    rewards: {
      xp: 100,
      badges: ["文法の第一歩"],
      unlockedFeatures: ["SVO文型", "SVC文型"],
    },
  },

  // === Basic Patterns (Level 2) ===
  {
    id: "svo-basic",
    name: "SVO文型",
    description: "主語 + 動詞 + 目的語",
    category: "basic-grammar",
    subcategory: "svo",
    level: 2,
    position: { x: 100, y: 550 },
    icon: "📝",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    prerequisites: ["sv-basic"],
    unlocks: ["tenses-present", "svo-advanced"],
    masteryRequirement: 80,
    estimatedTime: 45,
    difficulty: "beginner",
    rewards: {
      xp: 150,
      badges: ["SVOマスター"],
      unlockedFeatures: ["時制学習", "SVO応用"],
    },
  },
  {
    id: "svc-basic",
    name: "SVC文型",
    description: "主語 + 動詞 + 補語",
    category: "basic-grammar",
    subcategory: "svc",
    level: 2,
    position: { x: 300, y: 550 },
    icon: "🔵",
    color: "bg-indigo-100 border-indigo-300 text-indigo-800",
    prerequisites: ["sv-basic"],
    unlocks: ["tenses-present", "svc-advanced"],
    masteryRequirement: 80,
    estimatedTime: 45,
    difficulty: "beginner",
    rewards: {
      xp: 150,
      badges: ["be動詞マスター"],
      unlockedFeatures: ["時制学習", "SVC応用"],
    },
  },

  // === Basic Elements (Level 2) ===
  {
    id: "prepositions",
    name: "前置詞",
    description: "in / on / at などの使い分け",
    category: "prepositions",
    level: 2,
    position: { x: 50, y: 650 },
    icon: "📍",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    prerequisites: ["sv-basic"],
    unlocks: ["tenses-present"],
    masteryRequirement: 80,
    estimatedTime: 50,
    difficulty: "intermediate",
    rewards: {
      xp: 180,
      badges: ["前置詞マスター"],
      unlockedFeatures: ["時制学習"],
    },
  },
  {
    id: "conjunctions",
    name: "接続詞",
    description: "and / but / because の文接続",
    category: "conjunctions",
    level: 2,
    position: { x: 350, y: 650 },
    icon: "🔗",
    color: "bg-emerald-100 border-emerald-300 text-emerald-800",
    prerequisites: ["sv-basic"],
    unlocks: ["tenses-present"],
    masteryRequirement: 80,
    estimatedTime: 40,
    difficulty: "intermediate",
    rewards: {
      xp: 160,
      badges: ["接続詞マスター"],
      unlockedFeatures: ["時制学習"],
    },
  },

  // === Tense System (Level 3) ===
  {
    id: "tenses-present",
    name: "現在時制",
    description: "現在形・現在進行形・現在完了形",
    category: "tenses",
    level: 3,
    position: { x: 200, y: 750 },
    icon: "⏰",
    color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    prerequisites: ["svo-basic", "svc-basic", "prepositions", "conjunctions"],
    unlocks: ["tenses-past", "modals-basic"],
    masteryRequirement: 80,
    estimatedTime: 60,
    difficulty: "intermediate",
    rewards: {
      xp: 200,
      badges: ["時制の基礎"],
      unlockedFeatures: ["過去時制", "助動詞"],
    },
  },
  {
    id: "tenses-past",
    name: "過去時制",
    description: "過去形・過去進行形・過去完了形",
    category: "tenses",
    level: 3,
    position: { x: 100, y: 850 },
    icon: "⏮️",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    prerequisites: ["tenses-present"],
    unlocks: ["tenses-future", "svoo-basic"],
    masteryRequirement: 80,
    estimatedTime: 60,
    difficulty: "intermediate",
    rewards: {
      xp: 200,
      badges: ["過去の語り手"],
      unlockedFeatures: ["未来時制", "SVOO文型"],
    },
  },
  {
    id: "tenses-future",
    name: "未来時制",
    description: "未来形・未来進行形・未来完了形",
    category: "tenses",
    level: 3,
    position: { x: 300, y: 850 },
    icon: "⏭️",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    prerequisites: ["tenses-past"],
    unlocks: ["svoc-basic", "modals-advanced"],
    masteryRequirement: 80,
    estimatedTime: 60,
    difficulty: "intermediate",
    rewards: {
      xp: 200,
      badges: ["未来予想士"],
      unlockedFeatures: ["SVOC文型", "高度助動詞"],
    },
  },

  // === Modal Verbs (Level 3-4) ===
  {
    id: "modals-basic",
    name: "基本助動詞",
    description: "can / will / should の基本用法",
    category: "modals",
    level: 3,
    position: { x: 400, y: 750 },
    icon: "🔧",
    color: "bg-cyan-100 border-cyan-300 text-cyan-800",
    prerequisites: ["tenses-present"],
    unlocks: ["modals-advanced"],
    masteryRequirement: 80,
    estimatedTime: 45,
    difficulty: "intermediate",
    rewards: {
      xp: 180,
      badges: ["助動詞使い"],
      unlockedFeatures: ["高度助動詞"],
    },
  },

  // === Advanced Patterns (Level 4) ===
  {
    id: "svoo-basic",
    name: "SVOO文型",
    description: "主語 + 動詞 + 間接目的語 + 直接目的語",
    category: "basic-grammar",
    subcategory: "svoo",
    level: 4,
    position: { x: 50, y: 950 },
    icon: "📦",
    color: "bg-orange-100 border-orange-300 text-orange-800",
    prerequisites: ["tenses-past"],
    unlocks: ["passive-basic"],
    masteryRequirement: 85,
    estimatedTime: 50,
    difficulty: "intermediate",
    rewards: {
      xp: 250,
      badges: ["授与動詞マスター"],
      unlockedFeatures: ["受動態"],
    },
  },
  {
    id: "svoc-basic",
    name: "SVOC文型",
    description: "主語 + 動詞 + 目的語 + 補語",
    category: "basic-grammar",
    subcategory: "svoc",
    level: 4,
    position: { x: 350, y: 950 },
    icon: "🎯",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    prerequisites: ["tenses-future"],
    unlocks: ["relative-basic"],
    masteryRequirement: 85,
    estimatedTime: 55,
    difficulty: "intermediate",
    rewards: {
      xp: 250,
      badges: ["使役動詞マスター"],
      unlockedFeatures: ["関係詞"],
    },
  },

  // === Advanced Grammar (Level 5) ===
  {
    id: "passive-basic",
    name: "受動態",
    description: "be + 過去分詞の受身表現",
    category: "passive",
    level: 5,
    position: { x: 50, y: 1050 },
    icon: "🔄",
    color: "bg-red-100 border-red-300 text-red-800",
    prerequisites: ["svoo-basic"],
    unlocks: ["passive-advanced"],
    masteryRequirement: 85,
    estimatedTime: 50,
    difficulty: "advanced",
    rewards: {
      xp: 300,
      badges: ["受動態マスター"],
      unlockedFeatures: ["高度受動態"],
    },
  },
  {
    id: "relative-basic",
    name: "関係詞",
    description: "who / which / that を使った修飾",
    category: "relative",
    level: 5,
    position: { x: 200, y: 1050 },
    icon: "🔗",
    color: "bg-teal-100 border-teal-300 text-teal-800",
    prerequisites: ["svoc-basic"],
    unlocks: ["comparison-basic"],
    masteryRequirement: 85,
    estimatedTime: 55,
    difficulty: "advanced",
    rewards: {
      xp: 300,
      badges: ["関係詞マスター"],
      unlockedFeatures: ["比較表現"],
    },
  },
  {
    id: "modals-advanced",
    name: "高度助動詞",
    description: "must / might / could の応用",
    category: "modals",
    level: 5,
    position: { x: 350, y: 1050 },
    icon: "⚙️",
    color: "bg-cyan-200 border-cyan-400 text-cyan-900",
    prerequisites: ["modals-basic", "tenses-future"],
    unlocks: ["subjunctive-basic"],
    masteryRequirement: 85,
    estimatedTime: 50,
    difficulty: "advanced",
    rewards: {
      xp: 300,
      badges: ["助動詞エキスパート"],
      unlockedFeatures: ["仮定法"],
    },
  },

  // === Expert Level (Level 6) ===
  {
    id: "comparison-basic",
    name: "比較表現",
    description: "比較級・最上級の使い分け",
    category: "comparison",
    level: 6,
    position: { x: 150, y: 1150 },
    icon: "📊",
    color: "bg-pink-100 border-pink-300 text-pink-800",
    prerequisites: ["relative-basic"],
    unlocks: ["participle-basic"],
    masteryRequirement: 90,
    estimatedTime: 45,
    difficulty: "advanced",
    rewards: {
      xp: 350,
      badges: ["比較マスター"],
      unlockedFeatures: ["分詞・動名詞"],
    },
  },
  {
    id: "subjunctive-basic",
    name: "仮定法",
    description: "if文・仮定の表現",
    category: "subjunctive",
    level: 6,
    position: { x: 300, y: 1150 },
    icon: "💭",
    color: "bg-indigo-100 border-indigo-300 text-indigo-800",
    prerequisites: ["modals-advanced"],
    unlocks: ["infinitive-basic"],
    masteryRequirement: 90,
    estimatedTime: 60,
    difficulty: "advanced",
    rewards: {
      xp: 400,
      badges: ["仮定法マスター"],
      unlockedFeatures: ["不定詞"],
    },
  },

  // === Master Level (Level 7) ===
  {
    id: "participle-basic",
    name: "分詞・動名詞",
    description: "-ing / -ed の使い分け",
    category: "participle",
    level: 7,
    position: { x: 150, y: 1200 },
    icon: "🌿",
    color: "bg-emerald-100 border-emerald-300 text-emerald-800",
    prerequisites: ["comparison-basic"],
    unlocks: ["grammar-master"],
    masteryRequirement: 90,
    estimatedTime: 55,
    difficulty: "advanced",
    rewards: {
      xp: 400,
      badges: ["分詞マスター"],
      unlockedFeatures: ["文法マスター称号"],
    },
  },
  {
    id: "infinitive-basic",
    name: "不定詞",
    description: "to + 動詞の原形の3用法",
    category: "infinitive",
    level: 7,
    position: { x: 300, y: 1200 },
    icon: "♾️",
    color: "bg-violet-100 border-violet-300 text-violet-800",
    prerequisites: ["subjunctive-basic"],
    unlocks: ["grammar-master"],
    masteryRequirement: 90,
    estimatedTime: 55,
    difficulty: "advanced",
    rewards: {
      xp: 400,
      badges: ["不定詞マスター"],
      unlockedFeatures: ["文法マスター称号"],
    },
  },

  // === Advanced Skills (Level 8) ===
  {
    id: "vocabulary-mastery",
    name: "語彙力強化",
    description: "2000語レベルの語彙習得",
    category: "vocabulary-mastery",
    level: 8,
    position: { x: 150, y: 1300 },
    icon: "📚",
    color: "bg-blue-200 border-blue-400 text-blue-900",
    prerequisites: ["participle-basic"],
    unlocks: ["english-master"],
    masteryRequirement: 90,
    estimatedTime: 120,
    difficulty: "advanced",
    rewards: {
      xp: 500,
      badges: ["語彙マスター"],
      unlockedFeatures: ["英語マスター"],
    },
  },
  {
    id: "pronunciation",
    name: "発音・音韻",
    description: "正確な発音とイントネーション",
    category: "pronunciation",
    level: 8,
    position: { x: 300, y: 1300 },
    icon: "🗣️",
    color: "bg-pink-200 border-pink-400 text-pink-900",
    prerequisites: ["infinitive-basic"],
    unlocks: ["english-master"],
    masteryRequirement: 90,
    estimatedTime: 80,
    difficulty: "advanced",
    rewards: {
      xp: 450,
      badges: ["発音マスター"],
      unlockedFeatures: ["英語マスター"],
    },
  },

  // === Ultimate Master (Level 9) ===
  {
    id: "english-master",
    name: "英語マスター",
    description: "英語の全領域を完全習得",
    category: "basic-grammar",
    level: 9,
    position: { x: 225, y: 1400 },
    icon: "👑",
    color:
      "bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 text-yellow-900",
    prerequisites: ["vocabulary-mastery", "pronunciation"],
    unlocks: [],
    masteryRequirement: 95,
    estimatedTime: 0,
    difficulty: "advanced",
    rewards: {
      xp: 1500,
      badges: ["英語マスター", "完全習得者", "学習の達人"],
      unlockedFeatures: ["特別チャレンジ", "上級コンテンツ", "指導者モード"],
    },
  },

  // === Advanced Branches ===
  {
    id: "svo-advanced",
    name: "SVO応用",
    description: "複雑なSVO文型の習得",
    category: "basic-grammar",
    subcategory: "svo",
    level: 4,
    position: { x: 50, y: 800 },
    icon: "📚",
    color: "bg-blue-200 border-blue-400 text-blue-900",
    prerequisites: ["svo-basic", "tenses-present"],
    unlocks: ["business-grammar"],
    masteryRequirement: 85,
    estimatedTime: 40,
    difficulty: "intermediate",
    rewards: {
      xp: 220,
      badges: ["SVO応用マスター"],
      unlockedFeatures: ["ビジネス文法"],
    },
  },
  {
    id: "svc-advanced",
    name: "SVC応用",
    description: "連結動詞を使った表現",
    category: "basic-grammar",
    subcategory: "svc",
    level: 4,
    position: { x: 400, y: 800 },
    icon: "🔷",
    color: "bg-indigo-200 border-indigo-400 text-indigo-900",
    prerequisites: ["svc-basic", "tenses-present"],
    unlocks: ["business-grammar"],
    masteryRequirement: 85,
    estimatedTime: 40,
    difficulty: "intermediate",
    rewards: {
      xp: 220,
      badges: ["SVC応用マスター"],
      unlockedFeatures: ["ビジネス文法"],
    },
  },

  // === Special Nodes ===
  {
    id: "business-grammar",
    name: "ビジネス文法",
    description: "ビジネス場面での文法応用",
    category: "basic-grammar",
    level: 5,
    position: { x: 450, y: 1100 },
    icon: "💼",
    color: "bg-gray-100 border-gray-300 text-gray-800",
    prerequisites: ["svo-advanced", "svc-advanced"],
    unlocks: [],
    masteryRequirement: 90,
    estimatedTime: 70,
    difficulty: "advanced",
    rewards: {
      xp: 350,
      badges: ["ビジネス英語エキスパート"],
      unlockedFeatures: ["TOEIC特別問題"],
    },
  },
];

/**
 * スキルツリー管理クラス
 */
export class SkillTreeManager {
  private static instance: SkillTreeManager;
  private readonly STORAGE_KEY = "entp-skill-tree-progress";

  static getInstance(): SkillTreeManager {
    if (!SkillTreeManager.instance) {
      SkillTreeManager.instance = new SkillTreeManager();
    }
    return SkillTreeManager.instance;
  }

  /**
   * 現在のスキルツリー状態を取得
   */
  getSkillTreeState(): SkillTreeState {
    const saved = this.loadProgress();
    const unlockedNodes = this.calculateUnlockedNodes(saved);
    const completedNodes = this.calculateCompletedNodes(saved);
    const availableNodes = this.calculateAvailableNodes(saved, unlockedNodes);

    return {
      progress: saved,
      currentLevel: this.calculateCurrentLevel(completedNodes),
      totalXP: this.calculateTotalXP(saved),
      unlockedNodes,
      completedNodes,
      availableNodes,
    };
  }

  /**
   * ノードの習熟度を更新
   */
  updateNodeProgress(
    nodeId: string,
    correctAnswers: number,
    totalQuestions: number,
    timeSpent: number
  ): void {
    const progress = this.loadProgress();
    const masteryLevel = Math.round((correctAnswers / totalQuestions) * 100);

    progress[nodeId] = {
      nodeId,
      isUnlocked: true,
      masteryLevel,
      completedProblems: totalQuestions,
      totalProblems: this.getTotalProblemsForNode(nodeId),
      lastStudied: new Date(),
      averageScore: masteryLevel,
      timeSpent,
    };

    this.saveProgress(progress);
    this.checkUnlockConditions(nodeId, progress);
  }

  /**
   * ノードが解放可能かチェック
   */
  isNodeUnlockable(nodeId: string): boolean {
    const node = GRAMMAR_SKILL_TREE.find((n) => n.id === nodeId);
    if (!node) return false;

    const progress = this.loadProgress();

    return node.prerequisites.every((prereqId) => {
      const prereqProgress = progress[prereqId];
      return prereqProgress && prereqProgress.masteryLevel >= 80;
    });
  }

  /**
   * 推奨次学習ノードを取得
   */
  getRecommendedNextNodes(): SkillNode[] {
    const state = this.getSkillTreeState();

    return GRAMMAR_SKILL_TREE.filter((node) =>
      state.availableNodes.includes(node.id)
    )
      .sort((a, b) => a.level - b.level)
      .slice(0, 3);
  }

  /**
   * スキルツリーの完成度を計算
   */
  getCompletionPercentage(): number {
    const state = this.getSkillTreeState();
    return Math.round(
      (state.completedNodes.length / GRAMMAR_SKILL_TREE.length) * 100
    );
  }

  // プライベートメソッド
  private loadProgress(): Record<string, SkillTreeProgress> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveProgress(progress: Record<string, SkillTreeProgress>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("スキルツリー進捗の保存に失敗:", error);
    }
  }

  private calculateUnlockedNodes(
    progress: Record<string, SkillTreeProgress>
  ): string[] {
    const unlocked = ["parts-of-speech"]; // 最初のノードは品詞から開始

    GRAMMAR_SKILL_TREE.forEach((node) => {
      if (
        node.prerequisites.every((prereqId) => {
          const prereqProgress = progress[prereqId];
          return (
            prereqProgress &&
            prereqProgress.masteryLevel >= node.masteryRequirement
          );
        })
      ) {
        unlocked.push(node.id);
      }
    });

    return unlocked;
  }

  private calculateCompletedNodes(
    progress: Record<string, SkillTreeProgress>
  ): string[] {
    return Object.values(progress)
      .filter((p) => p.masteryLevel >= 90)
      .map((p) => p.nodeId);
  }

  private calculateAvailableNodes(
    progress: Record<string, SkillTreeProgress>,
    unlockedNodes: string[]
  ): string[] {
    return unlockedNodes.filter((nodeId) => {
      const nodeProgress = progress[nodeId];
      return !nodeProgress || nodeProgress.masteryLevel < 90;
    });
  }

  private calculateCurrentLevel(completedNodes: string[]): number {
    if (completedNodes.length === 0) return 1;

    const maxLevel = Math.max(
      ...completedNodes.map((nodeId) => {
        const node = GRAMMAR_SKILL_TREE.find((n) => n.id === nodeId);
        return node?.level || 1;
      })
    );

    return maxLevel;
  }

  private calculateTotalXP(
    progress: Record<string, SkillTreeProgress>
  ): number {
    return Object.values(progress).reduce((total, nodeProgress) => {
      const node = GRAMMAR_SKILL_TREE.find((n) => n.id === nodeProgress.nodeId);
      if (node && nodeProgress.masteryLevel >= 90) {
        return total + node.rewards.xp;
      }
      return total;
    }, 0);
  }

  private getTotalProblemsForNode(nodeId: string): number {
    // 各ノードの問題数を返す（将来的にはデータベースから取得）
    const problemCounts: Record<string, number> = {
      // Level 0: 基礎の基礎
      "parts-of-speech": 20,
      "word-order": 15,
      pronouns: 15,
      articles: 20,
      plurals: 15,
      "questions-negations": 25,

      // Level 1-2: 基本文型
      "sv-basic": 15,
      "svo-basic": 15,
      "svc-basic": 15,
      prepositions: 30,
      conjunctions: 20,

      // Level 3: 時制・助動詞
      "tenses-present": 20,
      "tenses-past": 20,
      "tenses-future": 20,
      "modals-basic": 15,

      // Level 4: 高度文型
      "svoo-basic": 15,
      "svoc-basic": 15,
      "svo-advanced": 20,
      "svc-advanced": 20,

      // Level 5: 専門文法
      "passive-basic": 20,
      "relative-basic": 20,
      "modals-advanced": 20,
      "business-grammar": 30,

      // Level 6-7: 表現技法
      "comparison-basic": 15,
      "subjunctive-basic": 20,
      "participle-basic": 20,
      "infinitive-basic": 20,

      // Level 8-9: 最終段階
      "vocabulary-mastery": 100,
      pronunciation: 50,
      "english-master": 0,
    };

    return problemCounts[nodeId] || 15;
  }

  private checkUnlockConditions(
    completedNodeId: string,
    progress: Record<string, SkillTreeProgress>
  ): void {
    const completedNode = GRAMMAR_SKILL_TREE.find(
      (n) => n.id === completedNodeId
    );
    if (!completedNode) return;

    // 解放されるノードをチェック
    completedNode.unlocks.forEach((unlockNodeId) => {
      if (this.isNodeUnlockable(unlockNodeId)) {
        console.log(`🔓 新しいスキル解放: ${unlockNodeId}`);
        // 実際のアプリでは通知を表示
        this.showUnlockNotification(unlockNodeId);
      }
    });
  }

  private showUnlockNotification(nodeId: string): void {
    const node = GRAMMAR_SKILL_TREE.find((n) => n.id === nodeId);
    if (!node) return;

    console.log(`🎉 新しいスキル「${node.name}」が解放されました！`);

    // 簡易通知（実際の実装では適切な通知システムを使用）
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("新しいスキル解放！", {
        body: `「${node.name}」が利用可能になりました`,
        icon: "/icon.svg",
      });
    }
  }
}

// シングルトンインスタンスをエクスポート
export const skillTreeManager = SkillTreeManager.getInstance();
