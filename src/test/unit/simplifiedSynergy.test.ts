import { describe, expect, it } from "vitest";

describe("簡潔な相乗効果システムテスト", () => {
  describe("データ構造の基本検証", () => {
    it("事前学習コンテンツが正しく読み込める", async () => {
      const { preStudyContents, getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );

      expect(preStudyContents.length).toBeGreaterThan(0);

      const level1Contents = getPreStudyContentsForLevel(1);
      expect(level1Contents.length).toBeGreaterThan(0);
      expect(level1Contents[0].level).toBe(1);
    });

    it("英作文プロンプトが正しく読み込める", async () => {
      const { essayPrompts, getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      expect(essayPrompts.length).toBeGreaterThan(0);

      const level1Prompts = getEssayPromptsForLevel(1);
      expect(level1Prompts.length).toBeGreaterThan(0);
    });

    it("実績データが正しく読み込める", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );

      expect(synergyAchievements.length).toBeGreaterThan(0);
      expect(synergyAchievements[0]).toHaveProperty("id");
      expect(synergyAchievements[0]).toHaveProperty("name");
      expect(synergyAchievements[0]).toHaveProperty("xpReward");
    });

    it("XPショップアイテムが正しく読み込める", async () => {
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      expect(XP_SHOP_ITEMS.length).toBeGreaterThan(0);

      const learningItems = XP_SHOP_ITEMS.filter((item) =>
        item.type.includes("boost")
      );
      expect(learningItems.length).toBeGreaterThan(0);
    });
  });

  describe("相乗効果の基本機能", () => {
    it("文法カテゴリーと事前学習の対応が正確", async () => {
      const { getPreStudyContentForGrammarCategory } = await import(
        "../../data/preStudyContents"
      );

      const basicGrammarContent =
        getPreStudyContentForGrammarCategory("basic-grammar");
      expect(basicGrammarContent).toBeDefined();
      expect(basicGrammarContent?.subcategory).toBe("basic-grammar");

      const tensesContent = getPreStudyContentForGrammarCategory("tenses");
      expect(tensesContent).toBeDefined();
      expect(tensesContent?.subcategory).toBe("tenses");
    });

    it("英作文課題が文法カテゴリーと連携している", async () => {
      const { getRecommendedPromptsForGrammar } = await import(
        "../../data/essayPrompts"
      );

      const grammarPrompts = getRecommendedPromptsForGrammar(["basic-grammar"]);
      expect(grammarPrompts.length).toBeGreaterThan(0);

      const hasBasicGrammar = grammarPrompts.some((p) =>
        p.relatedGrammarCategories?.includes("basic-grammar")
      );
      expect(hasBasicGrammar).toBe(true);
    });

    it("語彙推奨システムが機能している", async () => {
      const { getRecommendedPromptsForVocabulary } = await import(
        "../../data/essayPrompts"
      );

      const vocabPrompts = getRecommendedPromptsForVocabulary([
        "student",
        "work",
      ]);
      expect(vocabPrompts.length).toBeGreaterThan(0);
    });

    it("レベル制限システムが機能している", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );
      const { getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      const level1Contents = getPreStudyContentsForLevel(1);
      const level1Prompts = getEssayPromptsForLevel(1);

      expect(level1Contents.every((c) => c.level <= 1)).toBe(true);
      expect(level1Prompts.every((p) => p.level <= 1)).toBe(true);
    });
  });

  describe("データ品質検証", () => {
    it("全ての事前学習コンテンツに必須フィールドが存在", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      preStudyContents.forEach((content, index) => {
        expect(content.id, `Content ${index}: id missing`).toBeDefined();
        expect(content.title, `Content ${index}: title missing`).toBeDefined();
        expect(
          content.level,
          `Content ${index}: level missing`
        ).toBeGreaterThan(0);
        expect(
          content.content,
          `Content ${index}: content missing`
        ).toBeDefined();
      });
    });

    it("全ての英作文プロンプトに必須フィールドが存在", async () => {
      const { essayPrompts } = await import("../../data/essayPrompts");

      essayPrompts.forEach((prompt, index) => {
        expect(prompt.id, `Prompt ${index}: id missing`).toBeDefined();
        expect(prompt.title, `Prompt ${index}: title missing`).toBeDefined();
        expect(
          prompt.instruction,
          `Prompt ${index}: instruction missing`
        ).toBeDefined();
        expect(
          prompt.evaluationCriteria,
          `Prompt ${index}: evaluationCriteria missing`
        ).toBeDefined();
      });
    });

    it("評価基準の合計が100になる", async () => {
      const { essayPrompts } = await import("../../data/essayPrompts");

      essayPrompts.forEach((prompt, index) => {
        const { grammar, vocabulary, fluency, creativity } =
          prompt.evaluationCriteria;
        const total = grammar + vocabulary + fluency + creativity;
        expect(
          total,
          `Prompt ${index}: evaluation criteria total should be 100`
        ).toBe(100);
      });
    });

    it("実績のXP報酬が適切な範囲", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );

      synergyAchievements.forEach((achievement, index) => {
        expect(
          achievement.xpReward,
          `Achievement ${index}: XP reward out of range`
        ).toBeGreaterThan(0);
        expect(
          achievement.xpReward,
          `Achievement ${index}: XP reward too high`
        ).toBeLessThanOrEqual(200);
      });
    });
  });

  describe("関数の安定性", () => {
    it("全ての関数が例外を投げない", async () => {
      const preStudyModule = await import("../../data/preStudyContents");
      const essayModule = await import("../../data/essayPrompts");
      const achievementModule = await import("../../data/synergyAchievements");

      // 境界値でもエラーが発生しないことを確認
      expect(() => preStudyModule.getPreStudyContentsForLevel(0)).not.toThrow();
      expect(() =>
        preStudyModule.getPreStudyContentsForLevel(100)
      ).not.toThrow();
      expect(() =>
        preStudyModule.getPreStudyContentForGrammarCategory("nonexistent")
      ).not.toThrow();

      expect(() => essayModule.getEssayPromptsForLevel(0)).not.toThrow();
      expect(() => essayModule.getEssayPromptsForLevel(100)).not.toThrow();
      expect(() =>
        essayModule.getRecommendedPromptsForVocabulary([])
      ).not.toThrow();
      expect(() =>
        essayModule.getRecommendedPromptsForGrammar([])
      ).not.toThrow();

      expect(() => achievementModule.checkSynergyAchievements()).not.toThrow();
    });

    it("パフォーマンスが許容範囲内", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );
      const { getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      const start = performance.now();

      // 大量の関数呼び出し
      for (let i = 1; i <= 50; i++) {
        getPreStudyContentsForLevel(i);
        getEssayPromptsForLevel(i);
      }

      const end = performance.now();
      const duration = end - start;

      // 50回の呼び出しが50ms以下
      expect(duration).toBeLessThan(50);
    });
  });

  describe("レベル設定の論理性", () => {
    it("前提条件のレベル関係が正しい", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      // writing-strategy (level 8) が participle-theory (level 7) を前提とする場合
      const writingStrategy = preStudyContents.find(
        (c) => c.id === "writing-strategy"
      );
      const participleTheory = preStudyContents.find(
        (c) => c.id === "participle-theory"
      );

      if (
        writingStrategy &&
        participleTheory &&
        writingStrategy.prerequisites?.includes("participle-theory")
      ) {
        expect(writingStrategy.level).toBeGreaterThanOrEqual(
          participleTheory.level
        );
      }
    });

    it("難易度とレベルの関係が論理的", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      const beginnerContents = preStudyContents.filter(
        (c) => c.difficulty === "beginner"
      );
      const advancedContents = preStudyContents.filter(
        (c) => c.difficulty === "advanced"
      );

      if (beginnerContents.length > 0 && advancedContents.length > 0) {
        const avgBeginnerLevel =
          beginnerContents.reduce((sum, c) => sum + c.level, 0) /
          beginnerContents.length;
        const avgAdvancedLevel =
          advancedContents.reduce((sum, c) => sum + c.level, 0) /
          advancedContents.length;

        expect(avgAdvancedLevel).toBeGreaterThan(avgBeginnerLevel);
      }
    });
  });

  describe("相乗効果の整合性", () => {
    it("全ての文法カテゴリーに対応する事前学習が存在", async () => {
      const { getPreStudyContentForGrammarCategory } = await import(
        "../../data/preStudyContents"
      );

      const grammarCategories = [
        "basic-grammar",
        "tenses",
        "modals",
        "passive",
        "relative",
        "subjunctive",
        "comparison",
        "participle",
        "infinitive",
      ];

      grammarCategories.forEach((category) => {
        const content = getPreStudyContentForGrammarCategory(category);
        expect(
          content,
          `Missing pre-study content for ${category}`
        ).toBeDefined();
      });
    });

    it("英作文課題が主要文法をカバーしている", async () => {
      const { essayPrompts } = await import("../../data/essayPrompts");

      const grammarPrompts = essayPrompts.filter(
        (p) => p.category === "grammar"
      );
      const coveredCategories = new Set(
        grammarPrompts.map((p) => p.subcategory)
      );

      expect(coveredCategories.has("basic-grammar")).toBe(true);
      expect(coveredCategories.has("tenses")).toBe(true);
    });

    it("実績が機能横断的に設計されている", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );

      const crossFunctionalAchievements = synergyAchievements.filter(
        (a) => a.category.includes("synergy") || a.category.includes("flow")
      );

      expect(crossFunctionalAchievements.length).toBeGreaterThan(0);
    });
  });
});
