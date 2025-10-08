import { allTOEICQuestions } from "../data/toeicMockTestQuestions";
import {
  AdaptiveDifficultySettings,
  IntelligentQuestionSelection,
  LearningPattern,
  PerformancePrediction,
  PersonalizedQuestion,
  QuestionRecommendation,
  RecommendedPart,
  StrongPoint,
  WeakPoint,
} from "../types/intelligentQuestionSystem";
import { SynergyExplosionSystem } from "./synergyExplosionSystem";

/**
 * インテリジェント問題推薦システム
 * 学習履歴に基づく最適問題選択
 */
export class IntelligentQuestionSystem {
  private static readonly SYSTEM_KEY = "entp-intelligent-question-system";
  // @ts-expect-error - 未使用だが将来の機能拡張のために保持
  private static readonly _________PATTERN_KEY = "entp-learning-pattern";
  private static readonly DIFFICULTY_KEY = "entp-adaptive-difficulty";

  /**
   * 学習履歴に基づく最適問題選択
   */
  static getIntelligentQuestionSelection(
    userId: string = "default"
  ): IntelligentQuestionSelection {
    const weakPoints = this.analyzeWeakPoints(userId);
    const strongPoints = this.analyzeStrongPoints(userId);
    const recommendedParts = this.generateRecommendedParts(
      weakPoints,
      strongPoints
    );
    const adaptiveDifficulty = this.calculateAdaptiveDifficulty(userId);
    const personalizedQuestions = this.generatePersonalizedQuestions(
      weakPoints,
      strongPoints,
      adaptiveDifficulty
    );

    return {
      userId,
      weakPoints,
      strongPoints,
      recommendedParts,
      adaptiveDifficulty,
      personalizedQuestions,
      lastAnalyzed: new Date(),
    };
  }

  /**
   * 弱点分析
   */
  private static analyzeWeakPoints(_userId: string): WeakPoint[] {
    // 実際の実装では、学習履歴データベースから分析
    return [
      {
        category: "時制",
        partNumber: 5,
        errorCount: 8,
        errorRate: 0.4,
        lastError: new Date(),
        commonMistakes: ["現在完了形と過去形の混同", "未来形の使い分け"],
        needsReview: true,
        priority: "high",
      },
      {
        category: "関係詞",
        partNumber: 6,
        errorCount: 5,
        errorRate: 0.3,
        lastError: new Date(),
        commonMistakes: ["whichとthatの使い分け", "関係代名詞の省略"],
        needsReview: true,
        priority: "medium",
      },
      {
        category: "語彙",
        partNumber: 7,
        errorCount: 12,
        errorRate: 0.35,
        lastError: new Date(),
        commonMistakes: ["ビジネス語彙の理解不足", "同義語の混同"],
        needsReview: true,
        priority: "high",
      },
    ];
  }

  /**
   * 強み分析
   */
  private static analyzeStrongPoints(_userId: string): StrongPoint[] {
    // 実際の実装では、学習履歴データベースから分析
    return [
      {
        category: "基本文型",
        partNumber: 5,
        successCount: 25,
        successRate: 0.9,
        lastSuccess: new Date(),
        strengths: ["SVO構造の理解", "文型の識別"],
        canMentor: true,
      },
      {
        category: "リスニング",
        partNumber: 2,
        successCount: 18,
        successRate: 0.85,
        lastSuccess: new Date(),
        strengths: ["応答問題の理解", "音声の聞き取り"],
        canMentor: true,
      },
      {
        category: "品詞",
        partNumber: 5,
        successCount: 22,
        successRate: 0.88,
        lastSuccess: new Date(),
        strengths: ["品詞の識別", "語形変化の理解"],
        canMentor: false,
      },
    ];
  }

  /**
   * 推奨パート生成
   */
  private static generateRecommendedParts(
    weakPoints: WeakPoint[],
    strongPoints: StrongPoint[]
  ): RecommendedPart[] {
    const recommendations: RecommendedPart[] = [];

    // 弱点を重点的に練習
    const weakPartCounts = new Map<number, number>();
    weakPoints.forEach((weak) => {
      const count = weakPartCounts.get(weak.partNumber) || 0;
      weakPartCounts.set(weak.partNumber, count + 1);
    });

    weakPartCounts.forEach((count, partNumber) => {
      const partWeakPoints = weakPoints.filter(
        (w) => w.partNumber === partNumber
      );
      const highPriorityCount = partWeakPoints.filter(
        (w) => w.priority === "high"
      ).length;

      recommendations.push({
        partNumber,
        reason: `${partNumber}パートで${count}個の弱点を発見`,
        priority: highPriorityCount > 0 ? "high" : "medium",
        expectedImprovement: Math.min(count * 10, 50),
        timeEstimate: count * 15,
        questionTypes: partWeakPoints.map((w) => w.category),
      });
    });

    // 強みを活用した学習
    strongPoints.forEach((strong) => {
      if (strong.canMentor) {
        recommendations.push({
          partNumber: strong.partNumber,
          reason: `${strong.category}の強みを活用した応用学習`,
          priority: "low",
          expectedImprovement: 15,
          timeEstimate: 20,
          questionTypes: [`${strong.category}応用問題`],
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 適応的難易度計算
   */
  private static calculateAdaptiveDifficulty(
    userId: string
  ): "easy" | "medium" | "hard" {
    const synergyData = SynergyExplosionSystem.getSynergyExplosionData(userId);
    const difficultySettings = this.getAdaptiveDifficultySettings(userId);

    // シナジー効果と個人設定を考慮
    const multiplier = synergyData.combinedMultiplier;
    const currentLevel = difficultySettings.currentLevel;

    if (multiplier >= 2.0 && currentLevel === "advanced") {
      return "hard";
    } else if (multiplier >= 1.5 && currentLevel !== "beginner") {
      return "medium";
    } else {
      return "easy";
    }
  }

  /**
   * 個人化された問題生成
   */
  private static generatePersonalizedQuestions(
    weakPoints: WeakPoint[],
    strongPoints: StrongPoint[],
    _adaptiveDifficulty: "easy" | "medium" | "hard"
  ): PersonalizedQuestion[] {
    const personalizedQuestions: PersonalizedQuestion[] = [];

    // 弱点をターゲットにした問題
    weakPoints.forEach((weak) => {
      const relatedQuestions = allTOEICQuestions.filter(
        (q) =>
          q.part === weak.partNumber &&
          q.category.toLowerCase().includes(weak.category.toLowerCase())
      );

      relatedQuestions.slice(0, 3).forEach((question) => {
        const personalized: PersonalizedQuestion = {
          ...question,
          personalizationFactors: {
            difficultyAdjustment: weak.priority === "high" ? -0.5 : -0.2,
            categoryBoost: true,
            weaknessTargeting: true,
            strengthReinforcement: false,
            timeOptimization: true,
          },
          expectedPerformance: {
            probability: Math.max(0.3, 0.8 - weak.errorRate),
            timeEstimate: question.timeLimit || 60,
            confidence: 0.6,
          },
          learningValue: weak.priority === "high" ? 9 : 7,
        };

        personalizedQuestions.push(personalized);
      });
    });

    // 強みを活用した問題
    strongPoints.forEach((strong) => {
      if (strong.canMentor) {
        const relatedQuestions = allTOEICQuestions.filter(
          (q) =>
            q.part === strong.partNumber &&
            q.category.toLowerCase().includes(strong.category.toLowerCase())
        );

        relatedQuestions.slice(0, 2).forEach((question) => {
          const personalized: PersonalizedQuestion = {
            ...question,
            personalizationFactors: {
              difficultyAdjustment: 0.3,
              categoryBoost: true,
              weaknessTargeting: false,
              strengthReinforcement: true,
              timeOptimization: false,
            },
            expectedPerformance: {
              probability: Math.min(0.95, strong.successRate + 0.1),
              timeEstimate: (question.timeLimit || 60) * 0.8,
              confidence: 0.9,
            },
            learningValue: 6,
          };

          personalizedQuestions.push(personalized);
        });
      }
    });

    return personalizedQuestions.sort(
      (a, b) => b.learningValue - a.learningValue
    );
  }

  /**
   * 問題推薦生成
   */
  static generateQuestionRecommendations(
    userId: string,
    partNumber?: number,
    limit: number = 10
  ): QuestionRecommendation[] {
    const selection = this.getIntelligentQuestionSelection(userId);
    const recommendations: QuestionRecommendation[] = [];

    let candidateQuestions = selection.personalizedQuestions;

    if (partNumber) {
      candidateQuestions = candidateQuestions.filter(
        (q) => q.part === partNumber
      );
    }

    candidateQuestions.slice(0, limit).forEach((question) => {
      const reason = this.generateRecommendationReason(question, selection);
      const expectedBenefit = this.calculateExpectedBenefit(
        question,
        selection
      );

      recommendations.push({
        questionId: question.id,
        reason,
        expectedBenefit,
        difficulty: question.difficulty,
        timeEstimate: question.timeLimit || 60,
        confidence: question.expectedPerformance.confidence,
        alternatives: this.generateAlternatives(question, selection),
      });
    });

    return recommendations;
  }

  /**
   * 推薦理由生成
   */
  private static generateRecommendationReason(
    question: PersonalizedQuestion,
    _selection: IntelligentQuestionSelection
  ): string {
    if (question.personalizationFactors.weaknessTargeting) {
      return `弱点改善のため`;
    } else if (question.personalizationFactors.strengthReinforcement) {
      return `強みを活用した応用学習`;
    } else {
      return "総合的な英語力向上のため";
    }
  }

  /**
   * 期待効果計算
   */
  private static calculateExpectedBenefit(
    question: PersonalizedQuestion,
    _selection: IntelligentQuestionSelection
  ): string {
    const learningValue = question.learningValue;

    if (learningValue >= 8) {
      return "大幅な弱点改善が期待できます";
    } else if (learningValue >= 6) {
      return "継続的なスキル向上が期待できます";
    } else {
      return "基礎力の定着が期待できます";
    }
  }

  /**
   * 代替問題生成
   */
  private static generateAlternatives(
    question: PersonalizedQuestion,
    _selection: IntelligentQuestionSelection
  ): string[] {
    const alternatives: string[] = [];

    // 同じカテゴリーの他の問題
    const sameCategoryQuestions = allTOEICQuestions.filter(
      (q) =>
        q.part === question.part &&
        q.category === question.category &&
        q.id !== question.id
    );

    alternatives.push(...sameCategoryQuestions.slice(0, 2).map((q) => q.id));

    // 同じパートの他の問題
    const samePartQuestions = allTOEICQuestions.filter(
      (q) =>
        q.part === question.part &&
        q.category !== question.category &&
        q.id !== question.id
    );

    alternatives.push(...samePartQuestions.slice(0, 1).map((q) => q.id));

    return alternatives;
  }

  /**
   * パフォーマンス予測
   */
  static predictPerformance(
    questionId: string,
    userId: string
  ): PerformancePrediction {
    const selection = this.getIntelligentQuestionSelection(userId);
    const question = selection.personalizedQuestions.find(
      (q) => q.id === questionId
    );

    if (!question) {
      return {
        questionId,
        predictedAccuracy: 0.5,
        predictedTime: 60,
        confidence: 0.3,
        factors: [],
      };
    }

    const factors = [
      {
        factor: "学習履歴",
        impact: question.expectedPerformance.probability,
        description: "過去の類似問題での実績",
      },
      {
        factor: "難易度適応",
        impact: question.personalizationFactors.difficultyAdjustment,
        description: "個人に合わせた難易度調整",
      },
      {
        factor: "カテゴリーマッチング",
        impact: question.personalizationFactors.categoryBoost ? 0.1 : 0,
        description: "得意分野との適合度",
      },
    ];

    return {
      questionId,
      predictedAccuracy: question.expectedPerformance.probability,
      predictedTime: question.expectedPerformance.timeEstimate,
      confidence: question.expectedPerformance.confidence,
      factors,
    };
  }

  /**
   * 学習パターン取得
   */
  static getLearningPattern(userId: string = "default"): LearningPattern {
    // 実際の実装では、学習履歴から分析
    return {
      userId,
      preferredTimeSlots: ["morning", "evening"],
      averageSessionLength: 25,
      peakPerformanceHours: [9, 10, 19, 20],
      difficultyProgression: "balanced",
      learningStyle: "mixed",
      attentionSpan: "medium",
      lastAnalyzed: new Date(),
    };
  }

  /**
   * 適応的難易度設定取得
   */
  static getAdaptiveDifficultySettings(
    userId: string = "default"
  ): AdaptiveDifficultySettings {
    try {
      const stored = localStorage.getItem(`${this.DIFFICULTY_KEY}-${userId}`);
      return stored
        ? JSON.parse(stored)
        : {
            userId,
            currentLevel: "intermediate",
            progressionSpeed: "medium",
            challengePreference: "balanced",
            feedbackSensitivity: "medium",
            autoAdjustment: true,
            lastUpdated: new Date(),
          };
    } catch (error) {
      console.error("適応的難易度設定の読み込みエラー:", error);
      return {
        userId,
        currentLevel: "intermediate",
        progressionSpeed: "medium",
        challengePreference: "balanced",
        feedbackSensitivity: "medium",
        autoAdjustment: true,
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * 適応的難易度設定保存
   */
  static saveAdaptiveDifficultySettings(
    userId: string,
    settings: AdaptiveDifficultySettings
  ): void {
    localStorage.setItem(
      `${this.DIFFICULTY_KEY}-${userId}`,
      JSON.stringify(settings)
    );
  }

  /**
   * システムデータ保存
   */
  static saveIntelligentSystemData(
    userId: string,
    data: IntelligentQuestionSelection
  ): void {
    localStorage.setItem(`${this.SYSTEM_KEY}-${userId}`, JSON.stringify(data));
  }

  /**
   * システムデータ読み込み
   */
  static loadIntelligentSystemData(
    userId: string = "default"
  ): IntelligentQuestionSelection | null {
    try {
      const stored = localStorage.getItem(`${this.SYSTEM_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("インテリジェントシステムデータの読み込みエラー:", error);
      return null;
    }
  }
}
