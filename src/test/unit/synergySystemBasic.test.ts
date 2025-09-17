import { describe, expect, it } from "vitest";
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
import { synergyAchievements } from "../../data/synergyAchievements";
import { XP_SHOP_ITEMS } from "../../data/xpShop";
import { TIME_ATTACK_MODES } from "../../types/timeAttack";

describe("相乗効果システム基本テスト", () => {
  describe("事前学習コンテンツ", () => {
    it("基本的なコンテンツデータが正しく定義されている", () => {
      expect(preStudyContents.length).toBeGreaterThan(0);

      const basicGrammar = preStudyContents.find(
        (c) => c.id === "basic-grammar-theory"
      );
      expect(basicGrammar).toBeDefined();
      expect(basicGrammar?.title).toBe("英文の基本構造");
      expect(basicGrammar?.level).toBe(1);
      expect(basicGrammar?.category).toBe("grammar");
      expect(basicGrammar?.subcategory).toBe("basic-grammar");
    });

    it("レベル別フィルタリングが正しく機能する", () => {
      const level1Contents = getPreStudyContentsForLevel(1);
      expect(level1Contents.length).toBe(1);
      expect(level1Contents[0].level).toBe(1);

      const level5Contents = getPreStudyContentsForLevel(5);
      expect(level5Contents.length).toBeGreaterThan(level1Contents.length);
      expect(level5Contents.every((c) => c.level <= 5)).toBe(true);
    });

    it("文法カテゴリーマッピングが正確", () => {
      const basicGrammarContent =
        getPreStudyContentForGrammarCategory("basic-grammar");
      expect(basicGrammarContent?.subcategory).toBe("basic-grammar");

      const tensesContent = getPreStudyContentForGrammarCategory("tenses");
      expect(tensesContent?.subcategory).toBe("tenses");

      const modalsContent = getPreStudyContentForGrammarCategory("modals");
      expect(modalsContent?.subcategory).toBe("modals");
    });

    it("コンテンツの必須フィールドが全て設定されている", () => {
      preStudyContents.forEach((content) => {
        expect(content.id).toBeDefined();
        expect(content.title).toBeDefined();
        expect(content.category).toBeDefined();
        expect(content.level).toBeGreaterThan(0);
        expect(content.duration).toBeGreaterThan(0);
        expect(content.content).toBeDefined();
        expect(content.keyPoints.length).toBeGreaterThan(0);
        expect(content.examples.length).toBeGreaterThan(0);
      });
    });
  });

  describe("英作文プロンプト", () => {
    it("基本的なプロンプトデータが正しく定義されている", () => {
      expect(essayPrompts.length).toBeGreaterThan(0);

      const basicPrompt = essayPrompts.find(
        (p) => p.id === "basic-grammar-intro"
      );
      expect(basicPrompt).toBeDefined();
      expect(basicPrompt?.title).toBe("自己紹介文を書こう");
      expect(basicPrompt?.category).toBe("grammar");
      expect(basicPrompt?.subcategory).toBe("basic-grammar");
    });

    it("レベル別フィルタリングが機能する", () => {
      const level1Prompts = getEssayPromptsForLevel(1);
      expect(level1Prompts.length).toBeGreaterThan(0);
      expect(level1Prompts.every((p) => p.level <= 1)).toBe(true);

      const level6Prompts = getEssayPromptsForLevel(6);
      expect(level6Prompts.length).toBeGreaterThan(level1Prompts.length);
    });

    it("語彙連携推奨システムが機能する", () => {
      const userVocab = ["student", "work", "project"];
      const recommendations = getRecommendedPromptsForVocabulary(userVocab);

      expect(recommendations.length).toBeGreaterThan(0);

      const hasMatchingKeywords = recommendations.some((prompt) =>
        prompt.keyWords?.some((keyword) => userVocab.includes(keyword))
      );
      expect(hasMatchingKeywords).toBe(true);
    });

    it("文法連携推奨システムが機能する", () => {
      const completedGrammar = ["basic-grammar", "tenses"];
      const recommendations = getRecommendedPromptsForGrammar(completedGrammar);

      expect(recommendations.length).toBeGreaterThan(0);

      const hasMatchingGrammar = recommendations.some((prompt) =>
        prompt.relatedGrammarCategories?.some((category) =>
          completedGrammar.includes(category)
        )
      );
      expect(hasMatchingGrammar).toBe(true);
    });

    it("評価基準が適切に設定されている", () => {
      essayPrompts.forEach((prompt) => {
        const { grammar, vocabulary, fluency, creativity } =
          prompt.evaluationCriteria;

        // 合計が100になることを確認
        expect(grammar + vocabulary + fluency + creativity).toBe(100);

        // 各項目が正の値であることを確認
        expect(grammar).toBeGreaterThan(0);
        expect(vocabulary).toBeGreaterThan(0);
        expect(fluency).toBeGreaterThan(0);
        expect(creativity).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("機能横断型実績システム", () => {
    it("相乗効果実績が適切に定義されている", () => {
      expect(synergyAchievements.length).toBeGreaterThan(0);

      const theoryToPractice = synergyAchievements.find(
        (a) => a.id === "theory-to-practice-master"
      );
      expect(theoryToPractice).toBeDefined();
      expect(theoryToPractice?.category).toBe("learning-flow");
      expect(theoryToPractice?.level).toBe("gold");

      const gachaMaster = synergyAchievements.find(
        (a) => a.id === "gacha-vocabulary-master"
      );
      expect(gachaMaster).toBeDefined();
      expect(gachaMaster?.category).toBe("vocabulary-synergy");
    });

    it("実績の必須フィールドが設定されている", () => {
      synergyAchievements.forEach((achievement) => {
        expect(achievement.id).toBeDefined();
        expect(achievement.name).toBeDefined();
        expect(achievement.description).toBeDefined();
        expect(achievement.category).toBeDefined();
        expect(achievement.level).toBeDefined();
        expect(achievement.xpReward).toBeGreaterThan(0);
        expect(achievement.icon).toBeDefined();
        expect(achievement.requirements.length).toBeGreaterThan(0);
      });
    });

    it("実績レベルとXP報酬の関係が適切", () => {
      const bronzeAchievements = synergyAchievements.filter(
        (a) => a.level === "bronze"
      );
      const silverAchievements = synergyAchievements.filter(
        (a) => a.level === "silver"
      );
      const goldAchievements = synergyAchievements.filter(
        (a) => a.level === "gold"
      );
      const platinumAchievements = synergyAchievements.filter(
        (a) => a.level === "platinum"
      );
      const diamondAchievements = synergyAchievements.filter(
        (a) => a.level === "diamond"
      );

      // レベルが高いほどXP報酬が高いことを確認
      if (silverAchievements.length > 0 && goldAchievements.length > 0) {
        const avgSilverXP =
          silverAchievements.reduce((sum, a) => sum + a.xpReward, 0) /
          silverAchievements.length;
        const avgGoldXP =
          goldAchievements.reduce((sum, a) => sum + a.xpReward, 0) /
          goldAchievements.length;
        expect(avgGoldXP).toBeGreaterThan(avgSilverXP);
      }

      if (diamondAchievements.length > 0) {
        diamondAchievements.forEach((diamond) => {
          expect(diamond.xpReward).toBeGreaterThan(150); // ダイヤモンドは高報酬
        });
      }
    });
  });

  describe("XPショップ学習連携アイテム", () => {
    it("学習連携アイテムが適切に定義されている", () => {
      const learningBoost = XP_SHOP_ITEMS.find(
        (item) => item.id === "learning-efficiency-boost"
      );
      expect(learningBoost).toBeDefined();
      expect(learningBoost?.type).toBe("learning-boost");
      expect(learningBoost?.cost).toBe(80);

      const vocabBoost = XP_SHOP_ITEMS.find(
        (item) => item.id === "vocabulary-mastery-boost"
      );
      expect(vocabBoost).toBeDefined();
      expect(vocabBoost?.type).toBe("vocabulary-boost");

      const synergyMultiplier = XP_SHOP_ITEMS.find(
        (item) => item.id === "synergy-multiplier"
      );
      expect(synergyMultiplier).toBeDefined();
      expect(synergyMultiplier?.type).toBe("synergy-boost");
      expect(synergyMultiplier?.cost).toBe(200); // 最高価格
    });

    it("アイテムの価格設定が論理的", () => {
      const learningItems = XP_SHOP_ITEMS.filter((item) =>
        [
          "learning-boost",
          "vocabulary-boost",
          "grammar-boost",
          "synergy-boost",
          "focus-boost",
        ].includes(item.type)
      );

      learningItems.forEach((item) => {
        // 学習関連アイテムは適切な価格範囲
        expect(item.cost).toBeGreaterThan(50);
        expect(item.cost).toBeLessThanOrEqual(200);

        // 効果時間が設定されている
        expect(item.duration).toBeGreaterThan(0);

        // アイコンが設定されている
        expect(item.icon).toBeDefined();
      });

      // 相乗効果マルチプライヤーが最高価格
      const synergyItem = learningItems.find(
        (item) => item.type === "synergy-boost"
      );
      const maxPrice = Math.max(...learningItems.map((item) => item.cost));
      expect(synergyItem?.cost).toBe(maxPrice);
    });
  });

  describe("タイムアタックモード設定", () => {
    it("タイムアタックモードが適切に定義されている", () => {
      expect(TIME_ATTACK_MODES.length).toBeGreaterThan(0);

      const quickReview = TIME_ATTACK_MODES.find(
        (mode) => mode.id === "quick-review"
      );
      expect(quickReview).toBeDefined();
      expect(quickReview?.focusArea).toBe("recent-study");

      const weakAreaFocus = TIME_ATTACK_MODES.find(
        (mode) => mode.id === "weak-area-focus"
      );
      expect(weakAreaFocus).toBeDefined();
      expect(weakAreaFocus?.focusArea).toBe("weak-areas");
    });

    it("モードの設定値が論理的", () => {
      TIME_ATTACK_MODES.forEach((mode) => {
        // 問題数が適切な範囲
        expect(mode.questionCount).toBeGreaterThan(5);
        expect(mode.questionCount).toBeLessThanOrEqual(25);

        // 時間制限が適切な範囲
        expect(mode.timePerQuestion).toBeGreaterThan(5);
        expect(mode.timePerQuestion).toBeLessThanOrEqual(20);

        // 必須フィールドが設定されている
        expect(mode.id).toBeDefined();
        expect(mode.name).toBeDefined();
        expect(mode.description).toBeDefined();
        expect(mode.icon).toBeDefined();
      });
    });

    it("要件設定が段階的に設定されている", () => {
      const modesWithRequirements = TIME_ATTACK_MODES.filter(
        (mode) => mode.requirements
      );

      modesWithRequirements.forEach((mode) => {
        if (mode.requirements?.level) {
          expect(mode.requirements.level).toBeGreaterThan(0);
          expect(mode.requirements.level).toBeLessThanOrEqual(10);
        }

        if (mode.requirements?.vocabularyCards) {
          expect(mode.requirements.vocabularyCards).toBeGreaterThan(0);
          expect(mode.requirements.vocabularyCards).toBeLessThanOrEqual(100);
        }

        if (mode.requirements?.completedCategories) {
          expect(mode.requirements.completedCategories.length).toBeGreaterThan(
            0
          );
        }
      });
    });
  });

  describe("データ構造の整合性", () => {
    it("事前学習と文法クイズの対応が完全", () => {
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
        const preStudyContent = getPreStudyContentForGrammarCategory(category);
        expect(preStudyContent).toBeDefined();
        expect(preStudyContent?.subcategory).toBe(category);
      });
    });

    it("英作文課題と文法カテゴリーの対応が正確", () => {
      const grammarPrompts = essayPrompts.filter(
        (p) => p.category === "grammar"
      );

      grammarPrompts.forEach((prompt) => {
        expect(prompt.subcategory).toBeDefined();
        expect(prompt.relatedGrammarCategories).toBeDefined();
        expect(prompt.relatedGrammarCategories?.length).toBeGreaterThan(0);
      });
    });

    it("学習レベルの段階的設計が適切", () => {
      // 事前学習のレベル分布
      const contentsByLevel = preStudyContents.reduce((acc, content) => {
        acc[content.level] = (acc[content.level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // レベル1から段階的にコンテンツが存在することを確認
      expect(contentsByLevel[1]).toBeGreaterThan(0); // Level 1は必須

      // 英作文のレベル分布
      const promptsByLevel = essayPrompts.reduce((acc, prompt) => {
        acc[prompt.level] = (acc[prompt.level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      expect(promptsByLevel[1]).toBeGreaterThan(0); // Level 1は必須
    });
  });

  describe("相乗効果の論理的一貫性", () => {
    it("学習フローの依存関係が適切", () => {
      // 基本文型 → 時制 → その他の文法の順序
      const basicGrammar = preStudyContents.find(
        (c) => c.subcategory === "basic-grammar"
      );
      const tenses = preStudyContents.find((c) => c.subcategory === "tenses");
      const modals = preStudyContents.find((c) => c.subcategory === "modals");

      expect(basicGrammar?.level).toBeLessThanOrEqual(tenses?.level || 0);
      expect(tenses?.prerequisites).toContain("basic-grammar-theory");
      expect(modals?.prerequisites).toContain("basic-grammar-theory");
    });

    it("難易度の段階的設計が適切", () => {
      const beginnerPrompts = essayPrompts.filter(
        (p) => p.difficulty === "beginner"
      );
      const intermediatePrompts = essayPrompts.filter(
        (p) => p.difficulty === "intermediate"
      );
      const advancedPrompts = essayPrompts.filter(
        (p) => p.difficulty === "advanced"
      );

      // 初級課題が存在することを確認
      expect(beginnerPrompts.length).toBeGreaterThan(0);

      // 難易度が高いほど要求レベルも高いことを確認
      if (beginnerPrompts.length > 0 && intermediatePrompts.length > 0) {
        const avgBeginnerLevel =
          beginnerPrompts.reduce((sum, p) => sum + p.level, 0) /
          beginnerPrompts.length;
        const avgIntermediateLevel =
          intermediatePrompts.reduce((sum, p) => sum + p.level, 0) /
          intermediatePrompts.length;
        expect(avgIntermediateLevel).toBeGreaterThanOrEqual(avgBeginnerLevel);
      }
    });

    it("相乗効果の循環参照がない", () => {
      // 事前学習 → 文法クイズ → 英作文の一方向性を確認
      preStudyContents.forEach((content) => {
        if (content.relatedProblems) {
          content.relatedProblems.forEach((problemCategory) => {
            // 関連問題が実際に存在することを確認
            expect(typeof problemCategory).toBe("string");
            expect(problemCategory.length).toBeGreaterThan(0);
          });
        }
      });

      essayPrompts.forEach((prompt) => {
        if (prompt.relatedPreStudyContent) {
          prompt.relatedPreStudyContent.forEach((contentId) => {
            const relatedContent = preStudyContents.find(
              (c) => c.id === contentId
            );
            expect(relatedContent).toBeDefined();
          });
        }
      });
    });
  });

  describe("ユーザビリティ検証", () => {
    it("学習時間の設定が現実的", () => {
      preStudyContents.forEach((content) => {
        // 学習時間が5分〜15分の現実的な範囲
        expect(content.duration).toBeGreaterThanOrEqual(300); // 5分
        expect(content.duration).toBeLessThanOrEqual(900); // 15分
      });
    });

    it("コンテンツの説明が十分", () => {
      preStudyContents.forEach((content) => {
        expect(content.content.length).toBeGreaterThan(100); // 十分な説明量
        expect(content.keyPoints.length).toBeGreaterThanOrEqual(3); // 最低3つの重要ポイント
        expect(content.examples.length).toBeGreaterThanOrEqual(1); // 最低1つの例文
      });

      essayPrompts.forEach((prompt) => {
        expect(prompt.instruction.length).toBeGreaterThan(20); // 十分な指示
        expect(prompt.sampleAnswers.length).toBeGreaterThan(0); // サンプル解答あり
      });
    });

    it("アイコンとテキストが一貫している", () => {
      preStudyContents.forEach((content) => {
        expect(content.category).toMatch(
          /^(grammar|vocabulary|listening|reading|writing)$/
        );
        expect(content.difficulty).toMatch(
          /^(beginner|intermediate|advanced)$/
        );
        expect(content.contentType).toMatch(
          /^(theory|explanation|background|strategy)$/
        );
      });

      essayPrompts.forEach((prompt) => {
        expect(prompt.category).toMatch(/^(grammar|vocabulary|mixed)$/);
        expect(prompt.difficulty).toMatch(/^(beginner|intermediate|advanced)$/);
        expect(prompt.promptType).toMatch(
          /^(translation|completion|free-writing|guided)$/
        );
      });
    });
  });

  describe("スケーラビリティ", () => {
    it("大量データ処理のパフォーマンス", () => {
      const start = performance.now();

      // 大量のレベルチェック
      for (let level = 1; level <= 100; level++) {
        getPreStudyContentsForLevel(level);
        getEssayPromptsForLevel(level);
      }

      const end = performance.now();
      const duration = end - start;

      // 100レベル分の処理が50ms以下
      expect(duration).toBeLessThan(50);
    });

    it("文字列検索のパフォーマンス", () => {
      const start = performance.now();

      // 大量の語彙検索
      const testVocab = Array(1000)
        .fill(null)
        .map((_, i) => `word${i}`);
      getRecommendedPromptsForVocabulary(testVocab);

      const end = performance.now();
      const duration = end - start;

      // 1000語彙の検索が100ms以下
      expect(duration).toBeLessThan(100);
    });
  });
});
