import { QuestionData } from "../components/Question";
import {
  calculateXPReward,
  CATEGORY_TO_SKILL_FIELD,
  determineQuestionRank,
} from "../data/enhancedQuestions";
import { Category, QuestionRank, QuestionWithRank, SkillField } from "../types";

// 既存の問題データを新システム形式に変換
export function convertQuestionToEnhanced(
  question: QuestionData,
  category: Category,
  difficulty: "easy" | "normal" | "hard",
  level: number
): QuestionWithRank {
  const rank = determineQuestionRank(level);
  const skillField = CATEGORY_TO_SKILL_FIELD[category];
  const xpReward = calculateXPReward(rank);

  return {
    id: question.id,
    question: question.japanese,
    options: question.choices || [],
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    category,
    difficulty,
    rank,
    skillField,
    xpReward,
  };
}

// 既存の問題データセットを新システム形式に一括変換
export function convertQuestionsToEnhanced(
  questions: QuestionData[],
  category: Category,
  difficulty: "easy" | "normal" | "hard",
  level: number
): QuestionWithRank[] {
  return questions.map((question) =>
    convertQuestionToEnhanced(question, category, difficulty, level)
  );
}

// レベルに応じた問題フィルタリング
export function filterQuestionsByLevel(
  questions: QuestionWithRank[],
  _level: number,
  skillField?: SkillField
): QuestionWithRank[] {
  return questions.filter((question) => {
    // スキルフィールドのフィルタリング
    if (skillField && question.skillField !== skillField) {
      return false;
    }

    // レベルに応じたランクのフィルタリング
    // const _levelRank = determineQuestionRank(level);
    const rankOrder = ["normal", "rare", "epic", "legendary"];
    const questionRankIndex = rankOrder.indexOf(question.rank);

    // レベル以下のランクの問題のみを選択
    return questionRankIndex >= questionRankIndex;
  });
}

// 問題の重み付け選択
export function selectWeightedQuestion(
  questions: QuestionWithRank[],
  skillFieldAllocation: Record<SkillField, number>
): QuestionWithRank | null {
  if (questions.length === 0) return null;

  // 各問題の選択確率を計算
  const weights = questions.map((question) => {
    const skillWeight = skillFieldAllocation[question.skillField] / 30; // 30pt中での割合
    const rankWeight = getRankWeight(question.rank);
    return skillWeight * rankWeight;
  });

  // 重み付きランダム選択
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (totalWeight === 0) {
    // 重みが0の場合は均等選択
    return questions[Math.floor(Math.random() * questions.length)];
  }

  const random = Math.random() * totalWeight;
  let cumulative = 0;

  for (let i = 0; i < questions.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return questions[i];
    }
  }

  return questions[0]; // フォールバック
}

// ランクの重み
function getRankWeight(rank: QuestionRank): number {
  const weights = {
    normal: 1,
    rare: 2,
    epic: 3,
    legendary: 5,
  };
  return weights[rank];
}

// 問題の難易度をレベルに応じて調整
export function adjustDifficultyForLevel(
  question: QuestionWithRank,
  level: number
): QuestionWithRank {
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

// 学習セッション用の問題セット生成
export function generateQuestionSet(
  allQuestions: Record<
    Category,
    Record<"easy" | "normal" | "hard", QuestionData[]>
  >,
  level: number,
  skillFieldAllocation: Record<SkillField, number>,
  questionCount: number = 10
): QuestionWithRank[] {
  const selectedQuestions: QuestionWithRank[] = [];
  const categories: Category[] = Object.keys(allQuestions) as Category[];

  // 各カテゴリーから問題を選択
  for (const category of categories) {
    const skillField = CATEGORY_TO_SKILL_FIELD[category];
    const skillWeight = skillFieldAllocation[skillField];

    // スキルフィールドの重みに応じて問題数を決定
    const questionsForCategory = Math.ceil((skillWeight / 30) * questionCount);

    // 各難易度から問題を選択
    const difficulties: ("easy" | "normal" | "hard")[] = [
      "easy",
      "normal",
      "hard",
    ];

    for (const difficulty of difficulties) {
      const questions = allQuestions[category][difficulty] || [];
      const enhancedQuestions = convertQuestionsToEnhanced(
        questions,
        category,
        difficulty,
        level
      );
      const filteredQuestions = filterQuestionsByLevel(
        enhancedQuestions,
        level,
        skillField
      );

      if (filteredQuestions.length > 0) {
        const questionsToAdd = Math.min(
          Math.ceil(questionsForCategory / difficulties.length),
          filteredQuestions.length
        );

        for (let i = 0; i < questionsToAdd; i++) {
          const selectedQuestion = selectWeightedQuestion(
            filteredQuestions,
            skillFieldAllocation
          );
          if (selectedQuestion) {
            selectedQuestions.push(
              adjustDifficultyForLevel(selectedQuestion, level)
            );
          }
        }
      }
    }
  }

  // 問題数を調整
  if (selectedQuestions.length > questionCount) {
    return selectedQuestions.slice(0, questionCount);
  }

  return selectedQuestions;
}

// 問題の品質スコア計算
export function calculateQuestionQuality(question: QuestionWithRank): number {
  const rankScores = { normal: 1, rare: 2, epic: 3, legendary: 4 };
  const difficultyScores = { easy: 1, normal: 2, hard: 3 };

  return rankScores[question.rank] * difficultyScores[question.difficulty];
}

// 学習価値の計算
export function calculateLearningValue(question: QuestionWithRank): number {
  const quality = calculateQuestionQuality(question);
  return question.xpReward * quality;
}
