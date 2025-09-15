// ⭐️スターシステムの型定義

export interface StarData {
  current: number;
  max: number;
  lastRecoveryTime: number;
}

export interface PreStudyContent {
  id: string;
  title: string;
  category: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'writing';
  subcategory: string;
  level: number;
  contentType: 'theory' | 'explanation' | 'background' | 'strategy';
  duration: number; // 推定学習時間（秒）
  content: string; // メインコンテンツ（Markdown形式）
  keyPoints: string[]; // 重要ポイント
  examples: Example[];
  relatedProblems?: string[]; // 関連する問題ID
  prerequisites?: string[]; // 前提知識となる他のコンテンツID
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Example {
  english: string;
  japanese: string;
  explanation?: string;
}

export interface PreStudySession {
  contentId: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
  comprehensionRating?: number; // 1-5での理解度自己評価
}

export interface PreStudyProgress {
  totalContentsStudied: number;
  contentsByCategory: Record<string, number>;
  averageComprehension: number;
  totalTimeSpent: number; // 分
  lastStudiedContentId?: string;
  completedContents: string[];
}

// 定数
export const STAR_RECOVERY_TIME = 2 * 60 * 60 * 1000; // 2時間（ミリ秒）
export const MAX_STARS_BASE = 3;
export const STARS_INCREASE_EVERY_LEVELS = 10;
