// タイムアタックモードの型定義

export interface TimeAttackQuestion {
  id: string;
  type: "grammar" | "vocabulary" | "mixed";
  source: "grammar-quiz" | "gacha-vocabulary" | "weak-area" | "recent-study";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  timeLimit: number; // 秒
  difficulty: "easy" | "normal" | "hard";
  category?: string;
  relatedContent?: {
    grammarCategory?: string;
    vocabularyCard?: string;
    preStudyContent?: string;
  };
}

export interface TimeAttackSession {
  id: string;
  startTime: number;
  endTime?: number;
  questions: TimeAttackQuestion[];
  userAnswers: TimeAttackAnswer[];
  finalScore: number;
  maxCombo: number;
  accuracy: number;
  averageResponseTime: number;
  weakAreas: string[];
  strongAreas: string[];
}

export interface TimeAttackAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  responseTime: number; // ミリ秒
  timeLeft: number; // 残り時間
}

export interface TimeAttackProgress {
  totalSessions: number;
  bestScore: number;
  bestCombo: number;
  averageAccuracy: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  categoryPerformance: Record<
    string,
    {
      accuracy: number;
      averageTime: number;
      questionsAnswered: number;
    }
  >;
  weakCategories: string[];
  improvingCategories: string[];
  lastSessionDate?: number;
  currentStreak: number;
}

// タイムアタック用の相乗効果データ
export interface TimeAttackSynergyData {
  // ガチャ語彙連携
  availableVocabulary: {
    cardId: string;
    word: string;
    meaning: string;
    rarity: string;
    masteryLevel: number;
    lastStudied?: number;
  }[];

  // 文法クイズ連携
  grammarProgress: {
    category: string;
    accuracy: number;
    lastStudied: number;
    weakPoints: string[];
  }[];

  // 事前学習連携
  completedPreStudyTopics: {
    contentId: string;
    category: string;
    completedAt: number;
    comprehensionRating: number;
  }[];

  // 弱点分析
  identifiedWeakAreas: {
    category: string;
    type: "grammar" | "vocabulary";
    errorCount: number;
    lastError: number;
    needsReview: boolean;
  }[];
}

// タイムアタックのモード設定
export interface TimeAttackMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
  questionCount: number;
  timePerQuestion: number;
  focusArea?:
    | "grammar"
    | "vocabulary"
    | "weak-areas"
    | "recent-study"
    | "mixed";
  requirements?: {
    level?: number;
    completedCategories?: string[];
    vocabularyCards?: number;
  };
}

export const TIME_ATTACK_MODES: TimeAttackMode[] = [
  {
    id: "quick-review",
    name: "クイック復習",
    description: "最近学習した内容の復習",
    icon: "⚡",
    difficulty: "mixed",
    questionCount: 10,
    timePerQuestion: 12,
    focusArea: "recent-study",
  },
  {
    id: "weak-area-focus",
    name: "弱点克服",
    description: "苦手分野を集中的に練習",
    icon: "🎯",
    difficulty: "mixed",
    questionCount: 15,
    timePerQuestion: 15,
    focusArea: "weak-areas",
    requirements: {
      level: 2,
    },
  },
  {
    id: "vocabulary-speed",
    name: "語彙スピード",
    description: "ガチャで獲得した語彙の高速練習",
    icon: "💨",
    difficulty: "mixed",
    questionCount: 20,
    timePerQuestion: 8,
    focusArea: "vocabulary",
    requirements: {
      vocabularyCards: 10,
    },
  },
  {
    id: "grammar-intensive",
    name: "文法集中",
    description: "文法問題の集中攻略",
    icon: "📚",
    difficulty: "mixed",
    questionCount: 12,
    timePerQuestion: 18,
    focusArea: "grammar",
    requirements: {
      completedCategories: ["basic-grammar"],
    },
  },
  {
    id: "ultimate-challenge",
    name: "究極チャレンジ",
    description: "全分野からの高難度問題",
    icon: "👑",
    difficulty: "advanced",
    questionCount: 25,
    timePerQuestion: 10,
    focusArea: "mixed",
    requirements: {
      level: 5,
      vocabularyCards: 50,
      completedCategories: ["basic-grammar", "tenses", "modals"],
    },
  },
];
