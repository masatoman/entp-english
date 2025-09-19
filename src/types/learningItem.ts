/**
 * 統合学習項目システム
 * 単語・文法・フレーズと問題を統合管理
 */

// 学習項目の基本型
export interface LearningItem {
  id: string;
  type: "vocabulary" | "grammar" | "phrase" | "sentence";

  // 基本情報
  content: string; // 単語、文法項目、フレーズ等
  meaning: string;
  category: string; // toeic, daily, business等
  level: "beginner" | "intermediate" | "advanced";
  partOfSpeech?: string; // 品詞（vocabulary用）

  // 学習コンテンツ
  examples: LearningExample[];
  explanations: LearningExplanation[];

  // 関連問題（この項目から自動生成される問題）
  questions: LearningQuestion[];

  // 関連性（他の学習項目との関係）
  relations: ItemRelation[];

  // メタデータ
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary"; // ガチャから来た場合
  source: "standard" | "gacha" | "generated" | "user_created";
  tags: string[]; // 検索・分類用タグ

  // 統計情報
  difficulty: number; // 0-100の難易度スコア
  importance: number; // 0-100の重要度スコア
  frequency: number; // 使用頻度スコア

  // 作成・更新情報
  createdAt: string; // ISO string for better serialization
  updatedAt: string;
}

// 学習例文
export interface LearningExample {
  id: string;
  sentence: string;
  translation: string;
  situation: string; // 使用場面
  audioUrl?: string; // 音声ファイルURL
  difficulty: "easy" | "medium" | "hard";
}

// 学習説明
export interface LearningExplanation {
  id: string;
  type: "grammar" | "usage" | "pronunciation" | "etymology" | "culture";
  title: string;
  content: string;
  examples?: string[];
}

// 学習問題
export interface LearningQuestion {
  id: string;
  type:
    | "multiple_choice"
    | "fill_blank"
    | "translation"
    | "listening"
    | "usage"
    | "matching";
  difficulty: "easy" | "medium" | "hard";

  // 問題内容
  prompt: string;
  options?: string[]; // 選択肢（multiple_choice用）
  correctAnswer: string | string[];
  explanation: string;
  hints?: string[];

  // 学習項目との関連
  learningItemId: string;
  focusAspect: "meaning" | "usage" | "grammar" | "pronunciation" | "context";

  // 問題メタデータ
  estimatedTime: number; // 予想回答時間（秒）
  tags: string[];
}

// 項目間の関係
export interface ItemRelation {
  targetItemId: string;
  relationType:
    | "synonym"
    | "antonym"
    | "related"
    | "prerequisite"
    | "advanced"
    | "collocation";
  strength: number; // 0-100の関連度
  description?: string;
}

// 型安全性のための定数定義
export const LEARNING_ITEM_TYPES = [
  "vocabulary",
  "grammar",
  "phrase",
  "sentence",
] as const;
export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export const QUESTION_TYPES = [
  "multiple_choice",
  "fill_blank",
  "translation",
  "listening",
  "usage",
  "matching",
] as const;
export const SOURCE_TYPES = [
  "standard",
  "gacha",
  "generated",
  "user_created",
] as const;
export const RARITY_LEVELS = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const;

// 型ガード関数
export const isValidLearningItemType = (
  type: string
): type is LearningItem["type"] => {
  return LEARNING_ITEM_TYPES.includes(type as any);
};

export const isValidDifficultyLevel = (
  level: string
): level is LearningItem["level"] => {
  return DIFFICULTY_LEVELS.includes(level as any);
};

export const isValidQuestionType = (
  type: string
): type is LearningQuestion["type"] => {
  return QUESTION_TYPES.includes(type as any);
};

// バリデーション関数
export const validateLearningItem = (item: Partial<LearningItem>): string[] => {
  const errors: string[] = [];

  if (!item.id || typeof item.id !== "string") {
    errors.push("ID is required and must be a string");
  }

  if (!item.type || !isValidLearningItemType(item.type)) {
    errors.push("Valid type is required");
  }

  if (!item.content || typeof item.content !== "string") {
    errors.push("Content is required and must be a string");
  }

  if (!item.meaning || typeof item.meaning !== "string") {
    errors.push("Meaning is required and must be a string");
  }

  if (!item.level || !isValidDifficultyLevel(item.level)) {
    errors.push("Valid level is required");
  }

  if (
    typeof item.difficulty !== "number" ||
    item.difficulty < 0 ||
    item.difficulty > 100
  ) {
    errors.push("Difficulty must be a number between 0 and 100");
  }

  if (
    typeof item.importance !== "number" ||
    item.importance < 0 ||
    item.importance > 100
  ) {
    errors.push("Importance must be a number between 0 and 100");
  }

  if (
    typeof item.frequency !== "number" ||
    item.frequency < 0 ||
    item.frequency > 100
  ) {
    errors.push("Frequency must be a number between 0 and 100");
  }

  return errors;
};

// 学習進捗（統合版）
export interface LearningProgress {
  itemId: string;
  userId: string;

  // 全体的な習熟度
  masteryLevel: number; // 0-100
  confidence: number; // 0-100の自信度
  lastStudied: string; // ISO string
  studyCount: number;
  totalStudyTime: number; // 秒

  // 各側面の習熟度
  aspects: {
    meaning: number; // 意味理解度
    usage: number; // 使用法理解度
    grammar: number; // 文法理解度
    pronunciation: number; // 発音理解度
    context: number; // 文脈理解度
  };

  // 問題別成績
  questionResults: QuestionResult[];

  // 学習履歴
  studyHistory: StudySession[];

  // 復習スケジュール
  nextReviewDate: string; // ISO string
  reviewInterval: number; // 日数
  reviewCount: number;
}

// 問題結果
export interface QuestionResult {
  questionId: string;
  attempts: number;
  correctCount: number;
  lastAttempt: string; // ISO string
  averageTime: number; // 平均回答時間
  confidence: number; // 回答時の自信度
}

// 学習セッション
export interface StudySession {
  sessionId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  studyMode: "card" | "question" | "review" | "test";
  itemsStudied: string[];
  performance: {
    accuracy: number;
    speed: number;
    engagement: number;
  };
}

// 学習統計
export interface LearningStats {
  totalItems: number;
  masteredItems: number;
  inProgressItems: number;
  newItems: number;

  categoryBreakdown: Record<string, number>;
  levelBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;

  averageMastery: number;
  studyStreak: number;
  totalStudyTime: number;

  weakAreas: string[];
  strongAreas: string[];

  lastUpdated: string; // ISO string
}
