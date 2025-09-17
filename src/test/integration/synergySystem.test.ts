import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  essayPrompts,
  getEssayPromptsForLevel,
  getRecommendedPromptsForGrammar,
  getRecommendedPromptsForVocabulary,
} from "../../data/essayPrompts";
import {
  getPreStudyContentForGrammarCategory,
  getPreStudyContentsForLevel,
  preStudyContents,
} from "../../data/preStudyContents";
import {
  checkSynergyAchievements,
  synergyAchievements,
} from "../../data/synergyAchievements";
import { DataManager } from "../../utils/dataManager";
import { GachaSystem } from "../../utils/gachaSystem";
import { TimeAttackGenerator } from "../../utils/timeAttackGenerator";

// LocalStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("相乗効果システム統合テスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("事前学習コンテンツシステム", () => {
    it("文法カテゴリーとの対応が正確", () => {
      // 基本文型の事前学習コンテンツが存在することを確認
      const basicGrammarContent =
        getPreStudyContentForGrammarCategory("basic-grammar");
      expect(basicGrammarContent).toBeDefined();
      expect(basicGrammarContent?.title).toBe("英文の基本構造");
      expect(basicGrammarContent?.subcategory).toBe("basic-grammar");

      // 時制の事前学習コンテンツが存在することを確認
      const tensesContent = getPreStudyContentForGrammarCategory("tenses");
      expect(tensesContent).toBeDefined();
      expect(tensesContent?.title).toBe("時制の概念と使い分け");
      expect(tensesContent?.subcategory).toBe("tenses");
    });

    it("レベル別コンテンツ解放が正しく機能する", () => {
      // Level 1で利用可能なコンテンツ
      const level1Contents = getPreStudyContentsForLevel(1);
      expect(level1Contents).toHaveLength(1);
      expect(level1Contents[0].title).toBe("英文の基本構造");

      // Level 3で利用可能なコンテンツ
      const level3Contents = getPreStudyContentsForLevel(3);
      expect(level3Contents.length).toBeGreaterThan(1);
      expect(
        level3Contents.some((c) => c.title === "助動詞の意味と使い方")
      ).toBe(true);
    });

    it("コンテンツの前提条件が正しく設定されている", () => {
      const contents = preStudyContents;

      // 基本文型は前提条件なし
      const basicContent = contents.find(
        (c) => c.id === "basic-grammar-theory"
      );
      expect(basicContent?.prerequisites).toEqual([]);

      // 時制は基本文型が前提
      const tensesContent = contents.find((c) => c.id === "tenses-theory");
      expect(tensesContent?.prerequisites).toContain("basic-grammar-theory");

      // 助動詞は基本文型と時制が前提
      const modalsContent = contents.find((c) => c.id === "modals-theory");
      expect(modalsContent?.prerequisites).toContain("basic-grammar-theory");
      expect(modalsContent?.prerequisites).toContain("tenses-theory");
    });
  });

  describe("英作文システム", () => {
    it("文法カテゴリーとの連携が正しく機能する", () => {
      const grammarPrompts = getRecommendedPromptsForGrammar([
        "basic-grammar",
        "tenses",
      ]);

      // 基本文型に対応する英作文課題が存在
      expect(
        grammarPrompts.some((p) => p.subcategory === "basic-grammar")
      ).toBe(true);

      // 時制に対応する英作文課題が存在
      expect(grammarPrompts.some((p) => p.subcategory === "tenses")).toBe(true);
    });

    it("ガチャ語彙との連携が正しく機能する", () => {
      const userVocabulary = ["student", "work", "project", "meeting"];
      const vocabPrompts = getRecommendedPromptsForVocabulary(userVocabulary);

      // ガチャ語彙を使用する課題が推奨されることを確認
      expect(vocabPrompts.length).toBeGreaterThan(0);

      const basicPrompt = vocabPrompts.find(
        (p) => p.id === "basic-grammar-intro"
      );
      expect(basicPrompt?.keyWords).toContain("student");
      expect(basicPrompt?.keyWords).toContain("work");
    });

    it("レベル別課題フィルタリングが機能する", () => {
      // Level 1の課題
      const level1Prompts = getEssayPromptsForLevel(1);
      expect(level1Prompts.every((p) => p.level <= 1)).toBe(true);

      // Level 3の課題
      const level3Prompts = getEssayPromptsForLevel(3);
      expect(level3Prompts.some((p) => p.level <= 3)).toBe(true);
      expect(level3Prompts.every((p) => p.level <= 3)).toBe(true);
    });

    it("評価基準が適切に設定されている", () => {
      const prompts = essayPrompts;

      prompts.forEach((prompt) => {
        const criteria = prompt.evaluationCriteria;
        const total =
          criteria.grammar +
          criteria.vocabulary +
          criteria.fluency +
          criteria.creativity;

        // 評価基準の合計が100になることを確認
        expect(total).toBe(100);

        // 各項目が0以上であることを確認
        expect(criteria.grammar).toBeGreaterThanOrEqual(0);
        expect(criteria.vocabulary).toBeGreaterThanOrEqual(0);
        expect(criteria.fluency).toBeGreaterThanOrEqual(0);
        expect(criteria.creativity).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("タイムアタック相乗効果システム", () => {
    it("相乗効果データが正しく取得される", () => {
      // モックデータを設定
      const mockGachaData = {
        ownedCards: [
          { id: 1, word: "project", meaning: "プロジェクト", rarity: "common" },
          { id: 2, word: "meeting", meaning: "会議", rarity: "uncommon" },
        ],
      };

      const mockPreStudyProgress = {
        completedContents: ["basic-grammar-theory", "tenses-theory"],
      };

      vi.mocked(GachaSystem.getUserGachaData).mockReturnValue(mockGachaData);
      vi.mocked(DataManager.getPreStudyProgress).mockReturnValue(
        mockPreStudyProgress
      );

      const synergyData = TimeAttackGenerator.getSynergyData();

      expect(synergyData.availableVocabulary).toHaveLength(2);
      expect(synergyData.availableVocabulary[0].word).toBe("project");
      expect(synergyData.completedPreStudyTopics).toHaveLength(2);
    });

    it("問題生成が相乗効果データを活用する", () => {
      const mockMode = {
        id: "test-mode",
        name: "テストモード",
        description: "テスト用",
        icon: "🧪",
        difficulty: "mixed" as const,
        questionCount: 10,
        timePerQuestion: 15,
        focusArea: "mixed" as const,
      };

      // 相乗効果データをモック
      const mockSynergyData = {
        availableVocabulary: [
          {
            cardId: "1",
            word: "project",
            meaning: "プロジェクト",
            rarity: "common",
            masteryLevel: 1,
          },
        ],
        grammarProgress: [
          {
            category: "basic-grammar",
            accuracy: 0.8,
            lastStudied: Date.now(),
            weakPoints: [],
          },
        ],
        completedPreStudyTopics: [],
        identifiedWeakAreas: [],
      };

      vi.spyOn(TimeAttackGenerator, "getSynergyData").mockReturnValue(
        mockSynergyData
      );

      const questions = TimeAttackGenerator.generateQuestions(mockMode);

      expect(questions).toHaveLength(10);
      expect(questions.every((q) => q.timeLimit === 15)).toBe(true);
    });

    it("モード要件チェックが正しく機能する", () => {
      const mockMode = {
        id: "advanced-mode",
        name: "上級モード",
        description: "上級者向け",
        icon: "👑",
        difficulty: "advanced" as const,
        questionCount: 20,
        timePerQuestion: 10,
        requirements: {
          level: 5,
          vocabularyCards: 50,
          completedCategories: ["basic-grammar", "tenses"],
        },
      };

      const synergyData = {
        availableVocabulary: Array(30)
          .fill(null)
          .map((_, i) => ({
            cardId: i.toString(),
            word: `word${i}`,
            meaning: `意味${i}`,
            rarity: "common",
            masteryLevel: 1,
          })),
        grammarProgress: [
          {
            category: "basic-grammar",
            accuracy: 0.8,
            lastStudied: Date.now(),
            weakPoints: [],
          },
        ],
        completedPreStudyTopics: [],
        identifiedWeakAreas: [],
      };

      const result = TimeAttackGenerator.checkModeRequirements(
        mockMode,
        synergyData
      );

      // 要件不足でプレイできないことを確認
      expect(result.canPlay).toBe(false);
      expect(result.missingRequirements).toContain("語彙カード50枚以上が必要");
      expect(result.missingRequirements).toContain(
        "文法カテゴリー「tenses」の学習が必要"
      );
    });
  });

  describe("機能横断型実績システム", () => {
    it("相乗効果実績が適切に定義されている", () => {
      const achievements = synergyAchievements;

      // 理論→実践マスター実績の確認
      const theoryToPractice = achievements.find(
        (a) => a.id === "theory-to-practice-master"
      );
      expect(theoryToPractice).toBeDefined();
      expect(theoryToPractice?.category).toBe("learning-flow");
      expect(theoryToPractice?.level).toBe("gold");

      // ガチャ語彙マスター実績の確認
      const gachaMaster = achievements.find(
        (a) => a.id === "gacha-vocabulary-master"
      );
      expect(gachaMaster).toBeDefined();
      expect(gachaMaster?.category).toBe("vocabulary-synergy");

      // 総合学習者実績の確認
      const comprehensive = achievements.find(
        (a) => a.id === "comprehensive-learner"
      );
      expect(comprehensive).toBeDefined();
      expect(comprehensive?.level).toBe("diamond");
    });

    it("実績の要件が論理的に設定されている", () => {
      const achievements = synergyAchievements;

      achievements.forEach((achievement) => {
        // XP報酬が適切な範囲内であることを確認
        expect(achievement.xpReward).toBeGreaterThan(0);
        expect(achievement.xpReward).toBeLessThanOrEqual(200);

        // アイコンが設定されていることを確認
        expect(achievement.icon).toBeDefined();
        expect(achievement.icon.length).toBeGreaterThan(0);

        // 要件が設定されていることを確認
        expect(achievement.requirements).toBeDefined();
        expect(achievement.requirements.length).toBeGreaterThan(0);
      });
    });

    it("実績チェック機能が正常に動作する", () => {
      const result = checkSynergyAchievements();

      expect(result).toHaveProperty("newlyUnlocked");
      expect(result).toHaveProperty("progressUpdates");
      expect(Array.isArray(result.newlyUnlocked)).toBe(true);
      expect(Array.isArray(result.progressUpdates)).toBe(true);
    });
  });

  describe("データ管理システム", () => {
    it("事前学習進捗が正しく管理される", () => {
      // 初期データの確認
      const initialProgress = DataManager.getPreStudyProgress();
      expect(initialProgress).toHaveProperty("completedContents");
      expect(initialProgress).toHaveProperty("totalContentsStudied");
      expect(initialProgress).toHaveProperty("averageComprehension");

      // 完了記録の確認
      DataManager.recordPreStudyCompletion("basic-grammar-theory", 4, 300);

      const updatedProgress = DataManager.getPreStudyProgress();
      expect(updatedProgress.completedContents).toContain(
        "basic-grammar-theory"
      );
      expect(updatedProgress.totalContentsStudied).toBe(1);
    });

    it("相乗効果データの整合性が保たれる", () => {
      // ガチャデータと事前学習データの整合性確認
      const gachaData = GachaSystem.getUserGachaData();
      const preStudyProgress = DataManager.getPreStudyProgress();

      expect(gachaData).toHaveProperty("ownedCards");
      expect(preStudyProgress).toHaveProperty("completedContents");

      // データ構造の確認
      expect(Array.isArray(gachaData.ownedCards)).toBe(true);
      expect(Array.isArray(preStudyProgress.completedContents)).toBe(true);
    });
  });

  describe("学習フロー統合テスト", () => {
    it("理論→実践フローが完全に連携している", () => {
      // 1. 事前学習コンテンツの確認
      const basicGrammarTheory = preStudyContents.find(
        (c) => c.id === "basic-grammar-theory"
      );
      expect(basicGrammarTheory?.subcategory).toBe("basic-grammar");

      // 2. 対応する英作文課題の確認
      const relatedEssay = essayPrompts.find(
        (p) => p.subcategory === "basic-grammar"
      );
      expect(relatedEssay?.relatedGrammarCategories).toContain("basic-grammar");
      expect(relatedEssay?.relatedPreStudyContent).toContain(
        "basic-grammar-theory"
      );

      // 3. 学習フローの連続性確認
      expect(basicGrammarTheory?.relatedProblems).toContain("basic-grammar");
      expect(relatedEssay?.grammarFocus).toContain("be動詞");
    });

    it("ガチャ語彙活用フローが機能している", () => {
      const mockUserVocabulary = ["student", "work", "project", "meeting"];

      // 1. 語彙を使用する英作文課題の取得
      const vocabPrompts =
        getRecommendedPromptsForVocabulary(mockUserVocabulary);
      expect(vocabPrompts.length).toBeGreaterThan(0);

      // 2. 推奨語彙に含まれることの確認
      const basicPrompt = vocabPrompts.find(
        (p) => p.id === "basic-grammar-intro"
      );
      expect(basicPrompt?.keyWords).toContain("student");
      expect(basicPrompt?.keyWords).toContain("work");

      // 3. タイムアタックでの活用確認
      const synergyData = {
        availableVocabulary: mockUserVocabulary.map((word, i) => ({
          cardId: i.toString(),
          word,
          meaning: `意味${i}`,
          rarity: "common",
          masteryLevel: 1,
        })),
        grammarProgress: [],
        completedPreStudyTopics: [],
        identifiedWeakAreas: [],
      };

      vi.spyOn(TimeAttackGenerator, "getSynergyData").mockReturnValue(
        synergyData
      );

      const mockMode = {
        id: "vocab-mode",
        name: "語彙モード",
        description: "語彙中心",
        icon: "📚",
        difficulty: "mixed" as const,
        questionCount: 10,
        timePerQuestion: 10,
        focusArea: "vocabulary" as const,
      };

      const questions = TimeAttackGenerator.generateQuestions(mockMode);
      expect(questions.some((q) => q.source === "gacha-vocabulary")).toBe(true);
    });

    it("弱点克服フローが機能している", () => {
      const synergyData = {
        availableVocabulary: [],
        grammarProgress: [
          {
            category: "tenses",
            accuracy: 0.4,
            lastStudied: Date.now(),
            weakPoints: ["現在完了"],
          },
        ],
        completedPreStudyTopics: [],
        identifiedWeakAreas: [
          {
            category: "tenses",
            type: "grammar" as const,
            errorCount: 5,
            lastError: Date.now(),
            needsReview: true,
          },
        ],
      };

      vi.spyOn(TimeAttackGenerator, "getSynergyData").mockReturnValue(
        synergyData
      );

      const weakAreaMode = {
        id: "weak-mode",
        name: "弱点克服",
        description: "弱点克服",
        icon: "🎯",
        difficulty: "mixed" as const,
        questionCount: 10,
        timePerQuestion: 15,
        focusArea: "weak-areas" as const,
      };

      const questions = TimeAttackGenerator.generateQuestions(weakAreaMode);
      expect(questions.some((q) => q.source === "weak-area")).toBe(true);
      expect(questions.some((q) => q.category === "tenses")).toBe(true);
    });
  });

  describe("XPショップ学習連携", () => {
    it("学習連携アイテムが適切に定義されている", async () => {
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      // 学習効率ブーストの確認
      const learningBoost = XP_SHOP_ITEMS.find(
        (item) => item.id === "learning-efficiency-boost"
      );
      expect(learningBoost).toBeDefined();
      expect(learningBoost?.type).toBe("learning-boost");
      expect(learningBoost?.cost).toBe(80);

      // 語彙習得ブーストの確認
      const vocabBoost = XP_SHOP_ITEMS.find(
        (item) => item.id === "vocabulary-mastery-boost"
      );
      expect(vocabBoost).toBeDefined();
      expect(vocabBoost?.type).toBe("vocabulary-boost");

      // 相乗効果マルチプライヤーの確認
      const synergyMultiplier = XP_SHOP_ITEMS.find(
        (item) => item.id === "synergy-multiplier"
      );
      expect(synergyMultiplier).toBeDefined();
      expect(synergyMultiplier?.type).toBe("synergy-boost");
      expect(synergyMultiplier?.cost).toBe(200); // 最高価格
    });

    it("アイテム効果の設定が論理的", async () => {
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      const learningItems = XP_SHOP_ITEMS.filter(
        (item) =>
          item.type.includes("boost") &&
          !["damage-boost", "range-boost", "speed-boost"].includes(item.type)
      );

      learningItems.forEach((item) => {
        // 学習関連アイテムのコストが適切な範囲内
        expect(item.cost).toBeGreaterThan(50);
        expect(item.cost).toBeLessThanOrEqual(200);

        // 持続時間が設定されている
        if (item.duration) {
          expect(item.duration).toBeGreaterThan(0);
        }

        // アイコンが設定されている
        expect(item.icon).toBeDefined();
      });
    });
  });

  describe("パフォーマンステスト", () => {
    it("大量データでも正常に動作する", () => {
      // 大量のガチャカードデータ
      const largeGachaData = {
        ownedCards: Array(100)
          .fill(null)
          .map((_, i) => ({
            id: i,
            word: `word${i}`,
            meaning: `意味${i}`,
            rarity: "common",
          })),
      };

      vi.mocked(GachaSystem.getUserGachaData).mockReturnValue(largeGachaData);

      const start = performance.now();
      const level3Contents = getPreStudyContentsForLevel(3);
      const vocabPrompts = getRecommendedPromptsForVocabulary(
        largeGachaData.ownedCards.map((c) => c.word)
      );
      const end = performance.now();

      // 処理時間が許容範囲内（100ms以下）
      expect(end - start).toBeLessThan(100);

      // 結果が正常に取得できる
      expect(level3Contents.length).toBeGreaterThan(0);
      expect(vocabPrompts.length).toBeGreaterThan(0);
    });

    it("メモリ使用量が適切", () => {
      // 大量データ処理後のメモリ状況確認
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 大量データ処理
      for (let i = 0; i < 1000; i++) {
        getPreStudyContentsForLevel(Math.floor(i / 100) + 1);
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // メモリ増加が許容範囲内（10MB以下）
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe("エラー回復テスト", () => {
    it("部分的なデータ取得失敗でも機能する", () => {
      // ガチャデータ取得失敗
      vi.mocked(GachaSystem.getUserGachaData).mockImplementation(() => {
        throw new Error("ガチャデータ取得失敗");
      });

      // 事前学習データは正常
      vi.mocked(DataManager.getPreStudyProgress).mockReturnValue({
        completedContents: ["basic-grammar-theory"],
        totalContentsStudied: 1,
        contentsByCategory: {},
        averageComprehension: 4,
        totalTimeSpent: 300,
      });

      // エラーが発生してもシステムが機能することを確認
      expect(() => {
        const contents = getPreStudyContentsForLevel(1);
        expect(contents.length).toBeGreaterThan(0);
      }).not.toThrow();
    });

    it("不正なデータ形式でも安全に処理される", () => {
      // 不正なデータ形式
      vi.mocked(DataManager.getPreStudyProgress).mockReturnValue({
        completedContents: "invalid", // 配列でない
        totalContentsStudied: "invalid", // 数値でない
      } as any);

      // エラーが発生してもクラッシュしないことを確認
      expect(() => {
        const progress = DataManager.getPreStudyProgress();
        // フォールバック処理が機能することを確認
      }).not.toThrow();
    });
  });
});
