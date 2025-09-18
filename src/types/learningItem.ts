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
  createdAt: Date;
  updatedAt: Date;
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

// 学習進捗（統合版）
export interface LearningProgress {
  itemId: string;
  userId: string;

  // 全体的な習熟度
  masteryLevel: number; // 0-100
  confidence: number; // 0-100の自信度
  lastStudied: Date;
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
  nextReviewDate: Date;
  reviewInterval: number; // 日数
  reviewCount: number;
}

// 問題結果
export interface QuestionResult {
  questionId: string;
  attempts: number;
  correctCount: number;
  lastAttempt: Date;
  averageTime: number; // 平均回答時間
  confidence: number; // 回答時の自信度
}

// 学習セッション
export interface StudySession {
  sessionId: string;
  startTime: Date;
  endTime: Date;
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

  lastUpdated: Date;
}
