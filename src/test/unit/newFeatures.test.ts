import { describe, expect, it, beforeEach, vi } from "vitest";
import { KnownWordsManager } from "../../utils/knownWordsManager";
import { DailyChallengeManager } from "../../utils/dailyChallengeManager";
import { LearningAnalyzer } from "../../utils/learningAnalyzer";

/**
 * 新実装機能のテスト
 * パーソナルインサイト・デイリーチャレンジ・既知単語除外機能
 */
describe("New Features Tests", () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear();
  });

  describe("既知単語管理システム", () => {
    it("既知単語データの初期化が正常", () => {
      const data = KnownWordsManager.getKnownWordsData();
      
      expect(data).toBeDefined();
      expect(data.knownWords).toEqual([]);
      expect(data.totalKnownCount).toBe(0);
      expect(data.categoryStats).toEqual({});
      expect(data.levelStats).toEqual({});
    });

    it("単語の既知マークが正常に動作", () => {
      const testWord = {
        id: 1,
        english: "test",
        japanese: "テスト",
        meaning: "テスト",
        partOfSpeech: "noun",
        example: "This is a test.",
        exampleTranslation: "これはテストです。",
        level: "beginner" as const,
        category: "daily",
      };

      KnownWordsManager.markWordAsKnown(testWord);
      
      const data = KnownWordsManager.getKnownWordsData();
      expect(data.totalKnownCount).toBe(1);
      expect(data.knownWords[0].word).toBe("test");
      expect(data.categoryStats.daily).toBe(1);
      expect(data.levelStats.beginner).toBe(1);
    });

    it("既知単語のフィルタリングが正常", () => {
      const words = [
        { id: 1, english: "known", japanese: "既知", meaning: "既知", category: "daily", level: "beginner" as const, partOfSpeech: "adj", example: "", exampleTranslation: "" },
        { id: 2, english: "unknown", japanese: "未知", meaning: "未知", category: "daily", level: "beginner" as const, partOfSpeech: "adj", example: "", exampleTranslation: "" },
      ];

      // 1つ目を既知としてマーク
      KnownWordsManager.markWordAsKnown(words[0]);
      
      const filtered = KnownWordsManager.filterUnknownWords(words);
      expect(filtered.length).toBe(1);
      expect(filtered[0].word).toBe("unknown");
    });
  });

  describe("デイリーチャレンジシステム", () => {
    it("今日のチャレンジが生成される", () => {
      const challenge = DailyChallengeManager.getTodayChallenge();
      
      expect(challenge).toBeDefined();
      expect(challenge.name).toBeTruthy();
      expect(challenge.description).toBeTruthy();
      expect(challenge.bonusXP).toBeGreaterThan(0);
      expect(challenge.bonusMultiplier).toBeGreaterThan(1);
      expect(challenge.isCompleted).toBe(false);
    });

    it("チャレンジ統計が正常に取得される", () => {
      const stats = DailyChallengeManager.getStats();
      
      expect(stats).toBeDefined();
      expect(stats.currentStreak).toBeGreaterThanOrEqual(0);
      expect(stats.totalCompleted).toBeGreaterThanOrEqual(0);
      expect(stats.completionRate).toBeGreaterThanOrEqual(0);
      expect(stats.favoriteType).toBeTruthy();
    });
  });

  describe("学習分析システム", () => {
    it("学習インサイトが生成される", () => {
      const insight = LearningAnalyzer.generateLearningInsight();
      
      expect(insight).toBeDefined();
      expect(insight.learnerType).toBeTruthy();
      expect(insight.primaryStrengths).toBeInstanceOf(Array);
      expect(insight.improvementAreas).toBeInstanceOf(Array);
      expect(insight.personalizedRecommendations).toBeInstanceOf(Array);
      expect(insight.uniquePattern).toBeTruthy();
      expect(insight.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(insight.confidenceScore).toBeLessThanOrEqual(1);
    });

    it("学習パターン分析が正常", () => {
      const pattern = LearningAnalyzer.analyzeLearningPattern();
      
      expect(pattern).toBeDefined();
      expect(pattern.preferredDifficulty).toBeTruthy();
      expect(pattern.preferredCategory).toBeTruthy();
      expect(pattern.averageSessionTime).toBeGreaterThan(0);
      expect(pattern.accuracyRate).toBeGreaterThanOrEqual(0);
      expect(pattern.accuracyRate).toBeLessThanOrEqual(1);
      expect(pattern.learningVelocity).toBeGreaterThanOrEqual(0);
    });

    it("学習セッション記録が正常", () => {
      const sessionData = {
        duration: 10,
        accuracy: 0.8,
        category: "vocabulary",
        difficulty: "beginner",
        xpGained: 50,
      };

      // エラーが発生しないことを確認
      expect(() => {
        LearningAnalyzer.recordSession(sessionData);
      }).not.toThrow();
    });
  });
});
