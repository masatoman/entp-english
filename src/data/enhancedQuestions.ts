import { Category, QuestionRank, QuestionWithRank, SkillField } from "../types";

// スキルフィールドとカテゴリーのマッピング
export const CATEGORY_TO_SKILL_FIELD: Record<Category, SkillField> = {
  "parts-of-speech": "grammar",
  "word-order": "grammar",
  pronouns: "grammar",
  articles: "grammar",
  plurals: "grammar",
  "questions-negations": "grammar",
  "basic-grammar": "grammar",
  prepositions: "grammar",
  conjunctions: "grammar",
  tenses: "grammar",
  modals: "grammar",
  passive: "grammar",
  relative: "grammar",
  subjunctive: "grammar",
  comparison: "grammar",
  participle: "grammar",
  infinitive: "grammar",
  "vocabulary-mastery": "vocabulary",
  pronunciation: "listening",
};

// ランク別のXP報酬範囲
export const RANK_XP_RANGES = {
  normal: { min: 3, max: 8 },
  rare: { min: 10, max: 18 },
  epic: { min: 25, max: 40 },
  legendary: { min: 50, max: 100 },
};

// 問題のランクを決定する関数
export function determineQuestionRank(level: number): QuestionRank {
  if (level <= 20) {
    const rand = Math.random();
    if (rand < 0.8) return "normal";
    if (rand < 0.98) return "rare";
    return "epic";
  } else if (level <= 40) {
    const rand = Math.random();
    if (rand < 0.6) return "normal";
    if (rand < 0.9) return "rare";
    if (rand < 0.99) return "epic";
    return "legendary";
  } else if (level <= 60) {
    const rand = Math.random();
    if (rand < 0.4) return "normal";
    if (rand < 0.75) return "rare";
    if (rand < 0.95) return "epic";
    return "legendary";
  } else if (level <= 80) {
    const rand = Math.random();
    if (rand < 0.25) return "normal";
    if (rand < 0.6) return "rare";
    if (rand < 0.9) return "epic";
    return "legendary";
  } else {
    const rand = Math.random();
    if (rand < 0.15) return "normal";
    if (rand < 0.45) return "rare";
    if (rand < 0.8) return "epic";
    return "legendary";
  }
}

// XP報酬を計算する関数
export function calculateXPReward(
  rank: QuestionRank,
  hasBonus: boolean = false
): number {
  const range = RANK_XP_RANGES[rank];
  const baseXP =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  if (hasBonus) {
    // ボーナス時は1.5倍
    return Math.floor(baseXP * 1.5);
  }

  return baseXP;
}

// ボーナス条件のチェック
export function checkBonusConditions(
  isCorrect: boolean,
  isFirstAttempt: boolean,
  streakCount: number,
  accuracy: number
): boolean {
  // 初回正解ボーナス
  if (isCorrect && isFirstAttempt) return true;

  // 連続正解ボーナス（3回以上）
  if (isCorrect && streakCount >= 3) return true;

  // 高正解率ボーナス（80%以上）
  if (accuracy >= 0.8) return true;

  // 満点ボーナス
  if (accuracy === 1.0) return true;

  return false;
}

// 既存の問題データを新しい形式に変換する関数
export function convertToEnhancedQuestion(
  question: any,
  level: number,
  category: Category
): QuestionWithRank {
  const rank = determineQuestionRank(level);
  const skillField = CATEGORY_TO_SKILL_FIELD[category];
  const xpReward = calculateXPReward(rank);

  return {
    id: question.id,
    question: question.japanese || question.question,
    options: question.choices || question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    category,
    difficulty: question.difficulty || "normal",
    rank,
    skillField,
    xpReward,
  };
}

// レベル別の問題フィルタリング
export function getQuestionsForLevel(
  allQuestions: QuestionWithRank[],
  level: number,
  skillField?: SkillField
): QuestionWithRank[] {
  return allQuestions.filter((q) => {
    // レベルに応じたランクのフィルタリング
    const levelRank = determineQuestionRank(level);
    const rankOrder = ["normal", "rare", "epic", "legendary"];
    const levelRankIndex = rankOrder.indexOf(levelRank);
    const questionRankIndex = rankOrder.indexOf(q.rank);

    // レベル以下のランクの問題のみを選択
    if (questionRankIndex > levelRankIndex) return false;

    // スキルフィールドのフィルタリング
    if (skillField && q.skillField !== skillField) return false;

    return true;
  });
}

// 問題の重み付け（ランクに基づく）
export function getQuestionWeight(rank: QuestionRank): number {
  const weights = {
    normal: 1,
    rare: 2,
    epic: 3,
    legendary: 5,
  };
  return weights[rank];
}

// 問題選択の確率計算
export function calculateSelectionProbability(
  question: QuestionWithRank,
  level: number,
  skillFieldAllocation: Record<SkillField, number>
): number {
  // ランクの確率
  const rankProb = getRankProbability(question.rank, level);

  // スキルフィールドの確率
  const skillFieldProb = skillFieldAllocation[question.skillField] / 30; // 30pt中での割合

  // 重み
  const weight = getQuestionWeight(question.rank);

  return rankProb * skillFieldProb * weight;
}

// ランクの出現確率
export function getRankProbability(rank: QuestionRank, level: number): number {
  if (level <= 20) {
    const probs = { normal: 0.8, rare: 0.18, epic: 0.02, legendary: 0.0 };
    return probs[rank];
  } else if (level <= 40) {
    const probs = { normal: 0.6, rare: 0.3, epic: 0.09, legendary: 0.01 };
    return probs[rank];
  } else if (level <= 60) {
    const probs = { normal: 0.4, rare: 0.35, epic: 0.2, legendary: 0.05 };
    return probs[rank];
  } else if (level <= 80) {
    const probs = { normal: 0.25, rare: 0.35, epic: 0.3, legendary: 0.1 };
    return probs[rank];
  } else {
    const probs = { normal: 0.15, rare: 0.3, epic: 0.35, legendary: 0.2 };
    return probs[rank];
  }
}

// 問題の難易度をレベルに基づいて調整
export function adjustDifficultyForLevel(
  question: QuestionWithRank,
  level: number
): QuestionWithRank {
  // レベルに応じて難易度を調整
  let adjustedDifficulty = question.difficulty;

  if (level <= 20) {
    // 基礎編では主にeasyとnormal
    if (question.difficulty === "hard" && Math.random() < 0.7) {
      adjustedDifficulty = "normal";
    }
  } else if (level <= 40) {
    // 中級編ではnormalが中心
    if (question.difficulty === "easy" && Math.random() < 0.5) {
      adjustedDifficulty = "normal";
    }
  } else if (level >= 61) {
    // マスター編以降ではhardが中心
    if (question.difficulty === "normal" && Math.random() < 0.6) {
      adjustedDifficulty = "hard";
    }
  }

  return {
    ...question,
    difficulty: adjustedDifficulty,
  };
}

// 問題の品質スコア（ランクと難易度に基づく）
export function calculateQuestionQuality(question: QuestionWithRank): number {
  const rankScores = { normal: 1, rare: 2, epic: 3, legendary: 4 };
  const difficultyScores = { easy: 1, normal: 2, hard: 3 };

  return rankScores[question.rank] * difficultyScores[question.difficulty];
}

// 問題の学習価値（XP報酬と品質の組み合わせ）
export function calculateLearningValue(question: QuestionWithRank): number {
  const quality = calculateQuestionQuality(question);
  return question.xpReward * quality;
}
