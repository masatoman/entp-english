/**
 * 個人化学習システム
 * ユーザーの学習履歴と成績に基づいて最適な学習コンテンツを提供
 */

import { LearningItem, LearningProgress } from "../types/learningItem";
import { handleLearningError } from "./errorHandler";
import { logLearning } from "./logger";

export interface PersonalizationProfile {
  userId: string;

  // 学習傾向
  preferredDifficulty: "easy" | "normal" | "hard";
  preferredCategories: string[];
  strongAreas: string[];
  weakAreas: string[];

  // 学習パターン
  optimalStudyTime: number; // 最適な学習時間（分）
  bestPerformanceHours: number[]; // パフォーマンスが良い時間帯
  learningSpeed: "slow" | "normal" | "fast";

  // 成績統計
  averageAccuracy: number;
  improvementRate: number; // 改善率
  consistencyScore: number; // 一貫性スコア

  // 最後の更新
  lastUpdated: string;
}

export interface RecommendationResult {
  items: LearningItem[];
  reason: string;
  confidence: number; // 0-100の推奨信頼度
  estimatedDifficulty: number;
  expectedAccuracy: number;
}

export class PersonalizedLearningSystem {
  private static readonly PROFILE_KEY = "entp-personalization-profile";

  /**
   * ユーザーの個人化プロファイルを取得
   */
  static getPersonalizationProfile(
    userId: string
  ): PersonalizationProfile | null {
    try {
      const stored = localStorage.getItem(this.PROFILE_KEY);
      if (stored) {
        const profiles: Record<string, PersonalizationProfile> =
          JSON.parse(stored);
        return profiles[userId] || null;
      }
    } catch (error) {
      handleLearningError("get personalization profile", error as Error, {
        userId,
      });
    }
    return null;
  }

  /**
   * 個人化プロファイルを更新
   */
  static updatePersonalizationProfile(
    userId: string,
    recentSessions: any[]
  ): PersonalizationProfile {
    try {
      const profile = this.analyzeUserBehavior(
        userId,
        userStats,
        recentSessions
      );

      // 既存プロファイルと統合
      const existingProfile = this.getPersonalizationProfile(userId);
      const updatedProfile = existingProfile
        ? this.mergeProfiles(existingProfile, profile)
        : profile;

      // 保存
      this.savePersonalizationProfile(userId, updatedProfile);

      logLearning(`個人化プロファイルを更新: ${userId}`, {
        strongAreas: updatedProfile.strongAreas,
        weakAreas: updatedProfile.weakAreas,
        preferredDifficulty: updatedProfile.preferredDifficulty,
      });

      return updatedProfile;
    } catch (error) {
      handleLearningError("update personalization profile", error as Error, {
        userId,
      });
      return this.getDefaultProfile(userId);
    }
  }

  /**
   * 個人化された学習コンテンツを推奨
   */
  static recommendContent(
    userId: string,
    availableItems: LearningItem[],
    count: number = 10
  ): RecommendationResult {
    try {
      const profile = this.getPersonalizationProfile(userId);

      if (!profile || availableItems.length === 0) {
        return this.getFallbackRecommendation(availableItems, count);
      }

      // フィルタリングと優先度付け
      const scoredItems = availableItems.map((item) => ({
        item,
        score: this.calculateItemScore(item, profile),
        reason: this.getRecommendationReason(item, profile),
      }));

      // スコア順にソート
      scoredItems.sort((a, b) => b.score - a.score);

      // 多様性を考慮した選択
      const selectedItems = this.selectDiverseItems(scoredItems, count);

      const recommendation: RecommendationResult = {
        items: selectedItems.map((s) => s.item),
        reason: this.generateOverallReason(selectedItems, profile),
        confidence: this.calculateConfidence(profile, selectedItems.length),
        estimatedDifficulty: this.estimateOverallDifficulty(selectedItems),
        expectedAccuracy: this.predictAccuracy(profile, selectedItems),
      };

      logLearning(`個人化推奨を生成: ${userId}`, {
        itemCount: recommendation.items.length,
        confidence: recommendation.confidence,
        reason: recommendation.reason,
      });

      return recommendation;
    } catch (error) {
      handleLearningError("recommend content", error as Error, { userId });
      return this.getFallbackRecommendation(availableItems, count);
    }
  }

  /**
   * 弱点強化コンテンツを推奨
   */
  static recommendWeaknessImprovement(
    userId: string,
    availableItems: LearningItem[]
  ): RecommendationResult {
    try {
      const profile = this.getPersonalizationProfile(userId);

      if (!profile || profile.weakAreas.length === 0) {
        return this.getFallbackRecommendation(availableItems, 5);
      }

      // 弱点エリアのアイテムを優先
      const weaknessItems = availableItems.filter((item) =>
        profile.weakAreas.some(
          (weak) =>
            item.category.includes(weak) ||
            item.tags.some((tag) => tag.includes(weak))
        )
      );

      // 適切な難易度のアイテムを選択（少し易しめ）
      const adjustedDifficulty = this.getAdjustedDifficultyForWeakness(
        profile.preferredDifficulty
      );
      const suitableItems = weaknessItems.filter((item) =>
        this.isDifficultyAppropriate(item, adjustedDifficulty)
      );

      const selectedItems = suitableItems.slice(0, 5);

      return {
        items: selectedItems,
        reason: `弱点エリア「${profile.weakAreas.join(
          "、"
        )}」の強化に焦点を当てた問題を選択しました。`,
        confidence: 85,
        estimatedDifficulty: this.getDifficultyScore(adjustedDifficulty),
        expectedAccuracy: profile.averageAccuracy * 0.8, // 弱点なので少し下がる
      };
    } catch (error) {
      handleLearningError("recommend weakness improvement", error as Error, {
        userId,
      });
      return this.getFallbackRecommendation(availableItems, 5);
    }
  }

  /**
   * 復習コンテンツを推奨
   */
  static recommendReview(
    userId: string,
    progressData: LearningProgress[]
  ): RecommendationResult {
    try {
      const profile = this.getPersonalizationProfile(userId);

      // 復習が必要なアイテムを特定
      const reviewItems = progressData
        .filter((progress) => this.needsReview(progress))
        .sort(
          (a, b) =>
            new Date(a.nextReviewDate).getTime() -
            new Date(b.nextReviewDate).getTime()
        );

      const selectedItems = reviewItems.slice(0, 8).map((progress) => ({
        // LearningItemに変換（実際の実装では適切に変換）
        id: progress.itemId,
        type: "vocabulary" as const,
        content: progress.itemId, // 実際はitemIdから取得
        meaning: "",
        category: "review",
        level: "intermediate" as const,
        examples: [],
        explanations: [],
        questions: [],
        relations: [],
        source: "standard" as const,
        tags: ["review"],
        difficulty: 50,
        importance: 70,
        frequency: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return {
        items: selectedItems,
        reason: "復習タイミングに達したアイテムを優先的に選択しました。",
        confidence: 95,
        estimatedDifficulty: 60,
        expectedAccuracy: (profile?.averageAccuracy || 70) * 1.1, // 復習なので精度向上
      };
    } catch (error) {
      handleLearningError("recommend review", error as Error, { userId });
      return this.getFallbackRecommendation([], 0);
    }
  }

  /**
   * ユーザー行動を分析してプロファイルを作成
   */
  private static analyzeUserBehavior(
    userId: string,
    recentSessions: any[]
  ): PersonalizationProfile {
    const now = new Date().toISOString();

    // 難易度選好の分析
    const preferredDifficulty =
      this.analyzeDifficultyPreference(recentSessions);

    // カテゴリー選好の分析
    const preferredCategories = this.analyzeCategoryPreference(recentSessions);

    // 強み・弱みの分析
    const { strongAreas, weakAreas } =
      this.analyzePerformanceAreas(recentSessions);

    // 学習パターンの分析
    const optimalStudyTime = this.analyzeOptimalStudyTime(recentSessions);
    const bestPerformanceHours =
      this.analyzeBestPerformanceHours(recentSessions);
    const learningSpeed = this.analyzeLearningSpeed(recentSessions);

    // 成績統計の計算
    const averageAccuracy = this.calculateAverageAccuracy(recentSessions);
    const improvementRate = this.calculateImprovementRate(recentSessions);
    const consistencyScore = this.calculateConsistencyScore(recentSessions);

    return {
      userId,
      preferredDifficulty,
      preferredCategories,
      strongAreas,
      weakAreas,
      optimalStudyTime,
      bestPerformanceHours,
      learningSpeed,
      averageAccuracy,
      improvementRate,
      consistencyScore,
      lastUpdated: now,
    };
  }

  /**
   * アイテムのスコアを計算
   */
  private static calculateItemScore(
    item: LearningItem,
    profile: PersonalizationProfile
  ): number {
    let score = 50; // ベーススコア

    // 難易度適合性
    const difficultyScore = this.getDifficultyMatchScore(
      item,
      profile.preferredDifficulty
    );
    score += difficultyScore * 0.3;

    // カテゴリー選好
    const categoryScore = profile.preferredCategories.includes(item.category)
      ? 20
      : 0;
    score += categoryScore * 0.2;

    // 弱点強化
    const weaknessScore = profile.weakAreas.some(
      (weak) =>
        item.category.includes(weak) ||
        item.tags.some((tag) => tag.includes(weak))
    )
      ? 15
      : 0;
    score += weaknessScore * 0.3;

    // 重要度・頻度
    score += item.importance * 0.1 + item.frequency * 0.1;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 多様性を考慮したアイテム選択
   */
  private static selectDiverseItems(
    scoredItems: Array<{ item: LearningItem; score: number; reason: string }>,
    count: number
  ): Array<{ item: LearningItem; score: number; reason: string }> {
    const selected: Array<{
      item: LearningItem;
      score: number;
      reason: string;
    }> = [];
    const usedCategories = new Set<string>();
    const usedTypes = new Set<string>();

    // 高スコアから順に、多様性を保ちながら選択
    for (const scoredItem of scoredItems) {
      if (selected.length >= count) break;

      const { item } = scoredItem;

      // 多様性チェック
      const categoryOverused =
        usedCategories.has(item.category) && usedCategories.size < 3;
      const typeOverused = usedTypes.has(item.type) && usedTypes.size < 2;

      if (!categoryOverused && !typeOverused) {
        selected.push(scoredItem);
        usedCategories.add(item.category);
        usedTypes.add(item.type);
      }
    }

    // 足りない場合は残りから追加
    if (selected.length < count) {
      for (const scoredItem of scoredItems) {
        if (selected.length >= count) break;
        if (!selected.includes(scoredItem)) {
          selected.push(scoredItem);
        }
      }
    }

    return selected;
  }

  /**
   * 復習が必要かどうかを判定
   */
  private static needsReview(progress: LearningProgress): boolean {
    const now = new Date();
    const nextReview = new Date(progress.nextReviewDate);
    return nextReview <= now && progress.masteryLevel < 90;
  }

  /**
   * デフォルトプロファイルを取得
   */
  private static getDefaultProfile(userId: string): PersonalizationProfile {
    return {
      userId,
      preferredDifficulty: "normal",
      preferredCategories: ["grammar", "vocabulary"],
      strongAreas: [],
      weakAreas: [],
      optimalStudyTime: 15,
      bestPerformanceHours: [9, 14, 19],
      learningSpeed: "normal",
      averageAccuracy: 70,
      improvementRate: 5,
      consistencyScore: 50,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * フォールバック推奨を取得
   */
  private static getFallbackRecommendation(
    availableItems: LearningItem[],
    count: number
  ): RecommendationResult {
    const items = availableItems.slice(0, count);
    return {
      items,
      reason:
        "まだ学習データが不足しているため、標準的なコンテンツを提供しています。",
      confidence: 30,
      estimatedDifficulty: 50,
      expectedAccuracy: 70,
    };
  }

  // ヘルパーメソッド（実装は簡略化）
  private static analyzeDifficultyPreference(): "easy" | "normal" | "hard" {
    // セッションから難易度選好を分析
    return "normal";
  }

  private static analyzeCategoryPreference(_sessions: any[]): string[] {
    // カテゴリー選好を分析
    return ["grammar", "vocabulary"];
  }

  private static analyzePerformanceAreas(_sessions: any[]): {
    strongAreas: string[];
    weakAreas: string[];
  } {
    // パフォーマンス分析
    return { strongAreas: ["grammar"], weakAreas: ["vocabulary"] };
  }

  private static analyzeOptimalStudyTime(_sessions: any[]): number {
    return 15; // 分
  }

  private static analyzeBestPerformanceHours(_sessions: any[]): number[] {
    return [9, 14, 19];
  }

  private static analyzeLearningSpeed(): "slow" | "normal" | "fast" {
    return "normal";
  }

  private static calculateAverageAccuracy(_sessions: any[]): number {
    return 75;
  }

  private static calculateImprovementRate(_sessions: any[]): number {
    return 5;
  }

  private static calculateConsistencyScore(_sessions: any[]): number {
    return 70;
  }

  private static mergeProfiles(
    existing: PersonalizationProfile,
    updated: PersonalizationProfile
  ): PersonalizationProfile {
    // 重み付き平均で統合
    return {
      ...updated,
      averageAccuracy:
        existing.averageAccuracy * 0.7 + updated.averageAccuracy * 0.3,
      improvementRate:
        existing.improvementRate * 0.7 + updated.improvementRate * 0.3,
      consistencyScore:
        existing.consistencyScore * 0.7 + updated.consistencyScore * 0.3,
    };
  }

  private static savePersonalizationProfile(
    userId: string,
    profile: PersonalizationProfile
  ): void {
    try {
      const stored = localStorage.getItem(this.PROFILE_KEY);
      const profiles: Record<string, PersonalizationProfile> = stored
        ? JSON.parse(stored)
        : {};
      profiles[userId] = profile;
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profiles));
    } catch (error) {
      handleLearningError("save personalization profile", error as Error, {
        userId,
      });
    }
  }

  private static getDifficultyMatchScore(
    item: LearningItem,
    preferred: "easy" | "normal" | "hard"
  ): number {
    const itemDifficulty = item.difficulty;
    const preferredRange = {
      easy: [0, 40],
      normal: [30, 70],
      hard: [60, 100],
    }[preferred];

    if (
      itemDifficulty >= preferredRange[0] &&
      itemDifficulty <= preferredRange[1]
    ) {
      return 20;
    }
    return Math.max(
      0,
      20 -
        Math.abs(itemDifficulty - (preferredRange[0] + preferredRange[1]) / 2) /
          2
    );
  }

  private static getRecommendationReason(
    item: LearningItem,
    profile: PersonalizationProfile
  ): string {
    const reasons = [];

    if (profile.preferredCategories.includes(item.category)) {
      reasons.push("好みのカテゴリー");
    }

    if (profile.weakAreas.some((weak) => item.category.includes(weak))) {
      reasons.push("弱点強化");
    }

    if (item.importance > 70) {
      reasons.push("重要度が高い");
    }

    return reasons.length > 0 ? reasons.join("、") : "総合的な学習バランス";
  }

  private static generateOverallReason(
    selectedItems: Array<{ item: LearningItem; score: number; reason: string }>,
    profile: PersonalizationProfile
  ): string {
    const reasons = selectedItems.map((s) => s.reason);
    const uniqueReasons = [...new Set(reasons)];
    return `あなたの学習傾向（${
      profile.preferredDifficulty
    }レベル好み）に基づき、${uniqueReasons.join("、")}を重視して選択しました。`;
  }

  private static calculateConfidence(
    profile: PersonalizationProfile,
    itemCount: number
  ): number {
    let confidence = 50;

    // プロファイルの完成度
    if (profile.strongAreas.length > 0) confidence += 15;
    if (profile.weakAreas.length > 0) confidence += 15;
    if (profile.averageAccuracy > 60) confidence += 10;
    if (profile.consistencyScore > 60) confidence += 10;

    // アイテム数
    confidence += Math.min(itemCount * 2, 10);

    return Math.min(100, confidence);
  }

  private static estimateOverallDifficulty(
    selectedItems: Array<{ item: LearningItem; score: number; reason: string }>
  ): number {
    if (selectedItems.length === 0) return 50;
    const totalDifficulty = selectedItems.reduce(
      (sum, s) => sum + s.item.difficulty,
      0
    );
    return totalDifficulty / selectedItems.length;
  }

  private static predictAccuracy(
    profile: PersonalizationProfile,
    selectedItems: Array<{ item: LearningItem; score: number; reason: string }>
  ): number {
    let baseAccuracy = profile.averageAccuracy;

    // 難易度調整
    const avgDifficulty = this.estimateOverallDifficulty(selectedItems);
    const difficultyAdjustment = (50 - avgDifficulty) * 0.3;

    return Math.max(20, Math.min(95, baseAccuracy + difficultyAdjustment));
  }

  private static getAdjustedDifficultyForWeakness(
    preferred: "easy" | "normal" | "hard"
  ): "easy" | "normal" | "hard" {
    // 弱点強化では少し易しめにする
    return preferred === "hard"
      ? "normal"
      : preferred === "normal"
      ? "easy"
      : "easy";
  }

  private static isDifficultyAppropriate(
    item: LearningItem,
    targetDifficulty: "easy" | "normal" | "hard"
  ): boolean {
    const ranges = {
      easy: [0, 40],
      normal: [30, 70],
      hard: [60, 100],
    };
    const [min, max] = ranges[targetDifficulty];
    return item.difficulty >= min && item.difficulty <= max;
  }

  private static getDifficultyScore(
    difficulty: "easy" | "normal" | "hard"
  ): number {
    return { easy: 30, normal: 60, hard: 85 }[difficulty];
  }
}
