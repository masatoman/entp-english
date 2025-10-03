// TOEIC模擬テストの型定義

export interface TOEICQuestion {
  id: string;
  part: number; // TOEIC Part 1-7
  section: string; // セクション名
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number; // 選択肢のインデックス (0-based)
  explanation: string;
  audioUrl?: string; // Part 1, 2, 3, 4用
  imageUrl?: string; // Part 1用
  readingPassage?: string; // Part 7用
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeLimit?: number; // 秒単位
}

export interface TOEICTestSession {
  id: string;
  testType: "listening" | "reading" | "full"; // テストタイプ
  startTime: Date;
  endTime?: Date;
  answers: Record<string, number>; // questionId -> selectedAnswer
  score?: {
    listening: number;
    reading: number;
    total: number;
    percentile: number;
  };
  timeSpent: number; // 秒単位
  completed: boolean;
}

export interface TOEICTestResult {
  sessionId: string;
  testType: "listening" | "reading" | "full";
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  score: {
    listening: number;
    reading: number;
    total: number;
    percentile: number;
  };
  timeSpent: number;
  completedAt: Date;
  detailedResults: {
    part: number;
    correct: number;
    total: number;
    percentage: number;
  }[];
  recommendations: string[];
}

export interface TOEICTestConfig {
  testType: "listening" | "reading" | "full";
  timeLimit: number; // 分単位
  questionCount: {
    listening: number;
    reading: number;
  };
  parts: number[]; // 含めるパート
  difficulty: "easy" | "medium" | "hard" | "mixed";
}

export interface TOEICProgress {
  userId: string;
  totalTestsTaken: number;
  averageScore: number;
  bestScore: number;
  recentScores: number[];
  partStrengths: Record<number, number>; // part -> average percentage
  partWeaknesses: Record<number, number>; // part -> average percentage
  timeSpent: number;
  lastTestDate?: Date;
  improvementTrend: "up" | "down" | "stable";
}
