// 英作文機能の型定義

export interface EssayPrompt {
  id: string;
  title: string;
  category: "grammar" | "vocabulary" | "mixed";
  subcategory?: string; // 文法カテゴリー（basic-grammar, tenses等）
  difficulty: "beginner" | "intermediate" | "advanced";
  level: number; // ユーザーレベル要件
  promptType: "translation" | "completion" | "free-writing" | "guided";

  // プロンプト内容
  instruction: string; // 指示文
  context?: string; // 背景・状況説明
  keyWords?: string[]; // 使用すべき語彙（ガチャ語彙連携）
  grammarFocus?: string[]; // 重点文法項目

  // 評価基準
  evaluationCriteria: {
    grammar: number; // 文法正確性の重み
    vocabulary: number; // 語彙使用の重み
    fluency: number; // 流暢性の重み
    creativity: number; // 創造性の重み
  };

  // サンプル解答
  sampleAnswers: EssaySampleAnswer[];

  // 関連学習コンテンツ
  relatedGrammarCategories?: string[];
  relatedPreStudyContent?: string[];
  requiredVocabularyCards?: string[];
}

export interface EssaySampleAnswer {
  level: "basic" | "good" | "excellent";
  text: string;
  explanation: string;
  grammarPoints: string[];
  vocabularyHighlights: string[];
}

export interface EssaySubmission {
  id: string;
  promptId: string;
  userId: string;
  text: string;
  submittedAt: number;

  // 自己評価
  selfAssessment?: {
    difficulty: number; // 1-5
    satisfaction: number; // 1-5
    grammarConfidence: number; // 1-5
    vocabularyUsage: number; // 1-5
  };

  // システム分析
  analysis?: {
    wordCount: number;
    grammarIssues: string[];
    vocabularyUsed: string[];
    suggestions: string[];
    estimatedLevel: "beginner" | "intermediate" | "advanced";
  };
}

export interface EssayProgress {
  totalEssaysWritten: number;
  essaysByCategory: Record<string, number>;
  essaysByDifficulty: Record<string, number>;
  averageSelfAssessment: {
    difficulty: number;
    satisfaction: number;
    grammarConfidence: number;
    vocabularyUsage: number;
  };
  completedPrompts: string[];
  favoriteCategories: string[];
  improvementAreas: string[];
  lastEssayDate?: number;
  currentStreak: number;
}

// 英作文と他機能の連携データ
export interface EssaySynergyData {
  // 文法クイズ連携
  grammarQuizResults: {
    category: string;
    accuracy: number;
    lastStudied: number;
  }[];

  // ガチャ語彙連携
  availableVocabulary: {
    cardId: string;
    word: string;
    rarity: string;
    masteryLevel: number;
  }[];

  // 事前学習連携
  completedPreStudyTopics: {
    contentId: string;
    category: string;
    completedAt: number;
    comprehensionRating: number;
  }[];
}
