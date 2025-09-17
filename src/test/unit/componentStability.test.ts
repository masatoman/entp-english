import { describe, expect, it } from "vitest";

describe("コンポーネント安定性テスト", () => {
  describe("データ構造の検証", () => {
    it("事前学習データ構造が安定している", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      expect(Array.isArray(preStudyContents)).toBe(true);
      expect(preStudyContents.length).toBeGreaterThan(0);

      // 必須フィールドの存在確認
      preStudyContents.forEach((content, index) => {
        expect(content.id, `Content ${index}: id missing`).toBeDefined();
        expect(content.title, `Content ${index}: title missing`).toBeDefined();
        expect(
          content.category,
          `Content ${index}: category missing`
        ).toBeDefined();
        expect(
          content.level,
          `Content ${index}: level missing`
        ).toBeGreaterThan(0);
        expect(
          content.content,
          `Content ${index}: content missing`
        ).toBeDefined();
        expect(
          Array.isArray(content.keyPoints),
          `Content ${index}: keyPoints not array`
        ).toBe(true);
        expect(
          Array.isArray(content.examples),
          `Content ${index}: examples not array`
        ).toBe(true);
      });
    });

    it("英作文プロンプトデータ構造が安定している", async () => {
      const { essayPrompts } = await import("../../data/essayPrompts");

      expect(Array.isArray(essayPrompts)).toBe(true);
      expect(essayPrompts.length).toBeGreaterThan(0);

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
        expect(
          Array.isArray(prompt.sampleAnswers),
          `Prompt ${index}: sampleAnswers not array`
        ).toBe(true);
      });
    });

    it("実績データ構造が安定している", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );

      expect(Array.isArray(synergyAchievements)).toBe(true);
      expect(synergyAchievements.length).toBeGreaterThan(0);

      synergyAchievements.forEach((achievement, index) => {
        expect(
          achievement.id,
          `Achievement ${index}: id missing`
        ).toBeDefined();
        expect(
          achievement.name,
          `Achievement ${index}: name missing`
        ).toBeDefined();
        expect(
          achievement.xpReward,
          `Achievement ${index}: xpReward missing`
        ).toBeGreaterThan(0);
        expect(
          Array.isArray(achievement.requirements),
          `Achievement ${index}: requirements not array`
        ).toBe(true);
      });
    });

    it("XPショップデータ構造が安定している", async () => {
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      expect(Array.isArray(XP_SHOP_ITEMS)).toBe(true);
      expect(XP_SHOP_ITEMS.length).toBeGreaterThan(0);

      XP_SHOP_ITEMS.forEach((item, index) => {
        expect(item.id, `Item ${index}: id missing`).toBeDefined();
        expect(item.name, `Item ${index}: name missing`).toBeDefined();
        expect(item.cost, `Item ${index}: cost missing`).toBeGreaterThan(0);
        expect(item.icon, `Item ${index}: icon missing`).toBeDefined();
      });
    });
  });

  describe("関数の安定性", () => {
    it("事前学習関数が例外を投げない", async () => {
      const {
        getPreStudyContentsForLevel,
        getPreStudyContentsByCategory,
        getPreStudyContentForGrammarCategory,
      } = await import("../../data/preStudyContents");

      expect(() => getPreStudyContentsForLevel(1)).not.toThrow();
      expect(() => getPreStudyContentsForLevel(0)).not.toThrow(); // 境界値
      expect(() => getPreStudyContentsForLevel(100)).not.toThrow(); // 大きな値

      expect(() => getPreStudyContentsByCategory("grammar")).not.toThrow();
      expect(() => getPreStudyContentsByCategory("nonexistent")).not.toThrow();
      expect(() => getPreStudyContentsByCategory("all")).not.toThrow();

      expect(() =>
        getPreStudyContentForGrammarCategory("basic-grammar")
      ).not.toThrow();
      expect(() =>
        getPreStudyContentForGrammarCategory("nonexistent")
      ).not.toThrow();
    });

    it("英作文関数が例外を投げない", async () => {
      const {
        getEssayPromptsForLevel,
        getEssayPromptsByCategory,
        getRecommendedPromptsForVocabulary,
        getRecommendedPromptsForGrammar,
      } = await import("../../data/essayPrompts");

      expect(() => getEssayPromptsForLevel(1)).not.toThrow();
      expect(() => getEssayPromptsForLevel(0)).not.toThrow();
      expect(() => getEssayPromptsForLevel(100)).not.toThrow();

      expect(() => getEssayPromptsByCategory("grammar")).not.toThrow();
      expect(() => getEssayPromptsByCategory("nonexistent")).not.toThrow();

      expect(() => getRecommendedPromptsForVocabulary([])).not.toThrow();
      expect(() =>
        getRecommendedPromptsForVocabulary(["student", "work"])
      ).not.toThrow();

      expect(() => getRecommendedPromptsForGrammar([])).not.toThrow();
      expect(() =>
        getRecommendedPromptsForGrammar(["basic-grammar"])
      ).not.toThrow();
    });

    it("実績関数が例外を投げない", async () => {
      const { checkSynergyAchievements } = await import(
        "../../data/synergyAchievements"
      );

      expect(() => checkSynergyAchievements()).not.toThrow();
    });
  });

  describe("戻り値の型安全性", () => {
    it("事前学習関数の戻り値が正しい型", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );

      const result = getPreStudyContentsForLevel(1);
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        const content = result[0];
        expect(typeof content.id).toBe("string");
        expect(typeof content.title).toBe("string");
        expect(typeof content.level).toBe("number");
        expect(Array.isArray(content.keyPoints)).toBe(true);
        expect(Array.isArray(content.examples)).toBe(true);
      }
    });

    it("英作文関数の戻り値が正しい型", async () => {
      const { getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      const result = getEssayPromptsForLevel(1);
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        const prompt = result[0];
        expect(typeof prompt.id).toBe("string");
        expect(typeof prompt.title).toBe("string");
        expect(typeof prompt.instruction).toBe("string");
        expect(typeof prompt.evaluationCriteria).toBe("object");
        expect(Array.isArray(prompt.sampleAnswers)).toBe(true);
      }
    });
  });

  describe("境界値テスト", () => {
    it("レベル0やマイナス値でも安全", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );
      const { getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      expect(() => getPreStudyContentsForLevel(0)).not.toThrow();
      expect(() => getPreStudyContentsForLevel(-1)).not.toThrow();
      expect(() => getEssayPromptsForLevel(0)).not.toThrow();
      expect(() => getEssayPromptsForLevel(-1)).not.toThrow();

      // 負の値では空配列が返される
      expect(getPreStudyContentsForLevel(-1)).toEqual([]);
      expect(getEssayPromptsForLevel(-1)).toEqual([]);
    });

    it("空配列や空文字列でも安全", async () => {
      const {
        getRecommendedPromptsForVocabulary,
        getRecommendedPromptsForGrammar,
      } = await import("../../data/essayPrompts");

      expect(() => getRecommendedPromptsForVocabulary([])).not.toThrow();
      expect(() => getRecommendedPromptsForGrammar([])).not.toThrow();

      const emptyVocabResult = getRecommendedPromptsForVocabulary([]);
      const emptyGrammarResult = getRecommendedPromptsForGrammar([]);

      expect(Array.isArray(emptyVocabResult)).toBe(true);
      expect(Array.isArray(emptyGrammarResult)).toBe(true);
    });

    it("非常に大きな値でも安全", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );

      expect(() => getPreStudyContentsForLevel(999999)).not.toThrow();
      expect(() =>
        getPreStudyContentsForLevel(Number.MAX_SAFE_INTEGER)
      ).not.toThrow();
    });
  });

  describe("相乗効果の論理検証", () => {
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
        expect(content?.subcategory).toBe(category);
      });
    });

    it("英作文課題が文法カテゴリーをカバーしている", async () => {
      const { essayPrompts } = await import("../../data/essayPrompts");

      const grammarPrompts = essayPrompts.filter(
        (p) => p.category === "grammar"
      );
      const coveredCategories = new Set(
        grammarPrompts.map((p) => p.subcategory)
      );

      // 主要な文法カテゴリーがカバーされていることを確認
      expect(coveredCategories.has("basic-grammar")).toBe(true);
      expect(coveredCategories.has("tenses")).toBe(true);
      expect(coveredCategories.has("modals")).toBe(true);
    });

    it("学習連携XPアイテムの効果設定が論理的", async () => {
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      const learningItems = XP_SHOP_ITEMS.filter(
        (item) => item.type.includes("boost") && !item.type.includes("damage")
      );

      // 効果の高いアイテムほど高価格
      const synergyMultiplier = learningItems.find(
        (item) => item.type === "synergy-boost"
      );
      const learningBoost = learningItems.find(
        (item) => item.type === "learning-boost"
      );

      if (synergyMultiplier && learningBoost) {
        expect(synergyMultiplier.cost).toBeGreaterThan(learningBoost.cost);
      }
    });
  });

  describe("国際化・アクセシビリティ準備", () => {
    it("テキストが適切な長さ", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      preStudyContents.forEach((content) => {
        // タイトルが適切な長さ（1-50文字）
        expect(content.title.length).toBeGreaterThan(0);
        expect(content.title.length).toBeLessThan(50);

        // 重要ポイントが適切な長さ
        content.keyPoints.forEach((point) => {
          expect(point.length).toBeGreaterThan(0);
          expect(point.length).toBeLessThan(100);
        });
      });
    });

    it("アイコンが適切に設定されている", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      synergyAchievements.forEach((achievement) => {
        expect(achievement.icon.length).toBeGreaterThan(0);
        expect(achievement.icon.length).toBeLessThan(10); // 絵文字は通常1-2文字
      });

      XP_SHOP_ITEMS.forEach((item) => {
        expect(item.icon.length).toBeGreaterThan(0);
        expect(item.icon.length).toBeLessThan(10);
      });
    });
  });

  describe("メモリ効率性", () => {
    it("データ読み込みがメモリ効率的", async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 複数回データを読み込み
      for (let i = 0; i < 10; i++) {
        await import("../../data/preStudyContents");
        await import("../../data/essayPrompts");
        await import("../../data/synergyAchievements");
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // メモリ増加が1MB以下
      expect(memoryIncrease).toBeLessThan(1024 * 1024);
    });

    it("関数実行がCPU効率的", async () => {
      const { getPreStudyContentsForLevel } = await import(
        "../../data/preStudyContents"
      );
      const { getEssayPromptsForLevel } = await import(
        "../../data/essayPrompts"
      );

      const start = performance.now();

      // 大量の関数実行
      for (let level = 1; level <= 50; level++) {
        getPreStudyContentsForLevel(level);
        getEssayPromptsForLevel(level);
      }

      const end = performance.now();
      const duration = end - start;

      // 50レベル分の処理が20ms以下
      expect(duration).toBeLessThan(20);
    });
  });

  describe("型安全性", () => {
    it("TypeScript型定義が正しく機能する", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");
      const { essayPrompts } = await import("../../data/essayPrompts");

      // TypeScriptコンパイルが成功していることで型安全性を確認
      expect(preStudyContents).toBeDefined();
      expect(essayPrompts).toBeDefined();

      // 実行時型チェック
      preStudyContents.forEach((content) => {
        expect(typeof content.level).toBe("number");
        expect(typeof content.duration).toBe("number");
        expect([
          "grammar",
          "vocabulary",
          "listening",
          "reading",
          "writing",
        ]).toContain(content.category);
        expect(["beginner", "intermediate", "advanced"]).toContain(
          content.difficulty
        );
      });
    });
  });

  describe("相乗効果の論理的整合性", () => {
    it("学習フローの依存関係が循環していない", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      // 前提条件の循環参照チェック
      const checkCircularDependency = (
        contentId: string,
        visited: Set<string> = new Set()
      ): boolean => {
        if (visited.has(contentId)) return true; // 循環発見

        const content = preStudyContents.find((c) => c.id === contentId);
        if (!content || !content.prerequisites) return false;

        visited.add(contentId);

        for (const prereq of content.prerequisites) {
          if (checkCircularDependency(prereq, new Set(visited))) {
            return true;
          }
        }

        return false;
      };

      preStudyContents.forEach((content) => {
        expect(
          checkCircularDependency(content.id),
          `Circular dependency found for ${content.id}`
        ).toBe(false);
      });
    });

    it("レベル設定が段階的で論理的", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");
      const { essayPrompts } = await import("../../data/essayPrompts");

      // 前提条件があるコンテンツは、前提条件より高レベル
      preStudyContents.forEach((content) => {
        if (content.prerequisites && content.prerequisites.length > 0) {
          content.prerequisites.forEach((prereqId) => {
            const prereq = preStudyContents.find((c) => c.id === prereqId);
            if (prereq) {
              expect(
                content.level,
                `${content.id} should be higher level than ${prereqId}`
              ).toBeGreaterThanOrEqual(prereq.level);
            }
          });
        }
      });

      // 難易度とレベルの関係が論理的
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

  describe("実用性検証", () => {
    it("学習時間設定が現実的", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");

      preStudyContents.forEach((content) => {
        // 5分〜15分の現実的な学習時間
        expect(content.duration).toBeGreaterThanOrEqual(300); // 5分
        expect(content.duration).toBeLessThanOrEqual(900); // 15分
      });
    });

    it("XP設定が適切なバランス", async () => {
      const { synergyAchievements } = await import(
        "../../data/synergyAchievements"
      );
      const { XP_SHOP_ITEMS } = await import("../../data/xpShop");

      // 実績のXP報酬が適切な範囲
      synergyAchievements.forEach((achievement) => {
        expect(achievement.xpReward).toBeGreaterThan(0);
        expect(achievement.xpReward).toBeLessThanOrEqual(200);
      });

      // ショップアイテムの価格が適切な範囲
      XP_SHOP_ITEMS.forEach((item) => {
        expect(item.cost).toBeGreaterThan(0);
        expect(item.cost).toBeLessThanOrEqual(1000);
      });
    });

    it("コンテンツ量が適切", async () => {
      const { preStudyContents } = await import("../../data/preStudyContents");
      const { essayPrompts } = await import("../../data/essayPrompts");

      // 各レベルに適切な量のコンテンツ
      for (let level = 1; level <= 7; level++) {
        const contents = preStudyContents.filter((c) => c.level === level);
        const prompts = essayPrompts.filter((p) => p.level === level);

        // 低レベルほど多くのコンテンツ（学習の基盤）
        if (level <= 3) {
          expect(contents.length + prompts.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
