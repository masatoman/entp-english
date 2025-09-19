import { EssayPrompt } from "../types/essay";
import { GachaCard } from "../types/gacha";

/**
 * 語彙統合機能 - 獲得語彙カードと英作文課題の連携
 */
export class VocabularyIntegration {
  /**
   * 獲得語彙カードを分析して統計を取得
   */
  static analyzeUserVocabulary(ownedCards: GachaCard[]) {
    const words = ownedCards.map((card) => card.word.toLowerCase());
    const categories = [...new Set(ownedCards.map((card) => card.category))];
    const difficulties = [...new Set(ownedCards.map((card) => card.rarity))];

    return {
      totalWords: words.length,
      uniqueWords: [...new Set(words)].length,
      categories: categories,
      difficulties: difficulties,
      words: words,
      businessWords: ownedCards.filter(
        (card) =>
          card.category === "business" || card.tags?.includes("business")
      ).length,
      academicWords: ownedCards.filter(
        (card) =>
          card.category === "academic" || card.tags?.includes("academic")
      ).length,
    };
  }

  /**
   * 獲得語彙を活用できる課題を特定
   */
  static getVocabularyCompatiblePrompts(
    prompts: EssayPrompt[],
    userWords: string[]
  ): Array<{
    prompt: EssayPrompt;
    matchingWords: string[];
    matchCount: number;
  }> {
    const userWordsLower = userWords.map((word) => word.toLowerCase());

    return prompts
      .map((prompt) => {
        const promptWords =
          prompt.keyWords?.map((word) => word.toLowerCase()) || [];
        const matchingWords = promptWords.filter((word) =>
          userWordsLower.includes(word)
        );

        return {
          prompt,
          matchingWords,
          matchCount: matchingWords.length,
        };
      })
      .filter((result) => result.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  /**
   * カテゴリー別の語彙活用可能性を分析
   */
  static analyzeCategoryCompatibility(
    prompts: EssayPrompt[],
    ownedCards: GachaCard[]
  ) {
    const categories = [
      "business",
      "daily",
      "academic",
      "travel",
      "technology",
    ];

    return categories.map((category) => {
      const categoryPrompts = prompts.filter((p) => p.category === category);
      const categoryCards = ownedCards.filter(
        (card) => card.category === category || card.tags?.includes(category)
      );

      const compatiblePrompts = this.getVocabularyCompatiblePrompts(
        categoryPrompts,
        categoryCards.map((card) => card.word)
      );

      return {
        category,
        totalPrompts: categoryPrompts.length,
        compatiblePrompts: compatiblePrompts.length,
        availableWords: categoryCards.length,
        compatibility:
          categoryPrompts.length > 0
            ? (compatiblePrompts.length / categoryPrompts.length) * 100
            : 0,
      };
    });
  }

  /**
   * 未使用語彙を特定（英作文履歴から）
   */
  static getUnusedVocabulary(
    ownedCards: GachaCard[],
    essayHistory: Array<{ text: string }>
  ): GachaCard[] {
    const allEssayText = essayHistory
      .map((entry) => entry.text.toLowerCase())
      .join(" ");

    return ownedCards.filter(
      (card) => !allEssayText.includes(card.word.toLowerCase())
    );
  }

  /**
   * 語彙活用度スコアを計算
   */
  static calculateVocabularyUtilizationScore(
    ownedCards: GachaCard[],
    essayHistory: Array<{ text: string }>
  ): {
    totalWords: number;
    usedWords: number;
    unusedWords: number;
    utilizationRate: number;
    recentlyUsed: string[];
    neverUsed: string[];
  } {
    const totalWords = ownedCards.length;
    const allEssayText = essayHistory
      .map((entry) => entry.text.toLowerCase())
      .join(" ");

    const usedCards = ownedCards.filter((card) =>
      allEssayText.includes(card.word.toLowerCase())
    );

    const unusedCards = ownedCards.filter(
      (card) => !allEssayText.includes(card.word.toLowerCase())
    );

    // 最近の5つのエッセイで使用された語彙
    const recentEssayText = essayHistory
      .slice(-5)
      .map((entry) => entry.text.toLowerCase())
      .join(" ");

    const recentlyUsed = ownedCards
      .filter((card) => recentEssayText.includes(card.word.toLowerCase()))
      .map((card) => card.word);

    return {
      totalWords,
      usedWords: usedCards.length,
      unusedWords: unusedCards.length,
      utilizationRate:
        totalWords > 0 ? (usedCards.length / totalWords) * 100 : 0,
      recentlyUsed,
      neverUsed: unusedCards.map((card) => card.word),
    };
  }

  /**
   * 語彙チャレンジ課題を生成
   */
  static generateVocabularyChallenges(
    unusedCards: GachaCard[],
    basePrompts: EssayPrompt[]
  ): Array<{
    type: "vocabulary-challenge";
    targetWords: string[];
    basePrompt: EssayPrompt;
    challengeText: string;
  }> {
    if (unusedCards.length === 0) return [];

    // ランダムに3-5個の未使用語彙を選択
    const shuffled = unusedCards.sort(() => Math.random() - 0.5);
    const targetWords = shuffled
      .slice(0, Math.min(5, shuffled.length))
      .map((card) => card.word);

    // 適切な基本課題を選択
    const suitablePrompts = basePrompts.filter(
      (prompt) =>
        prompt.difficulty === "intermediate" || prompt.difficulty === "beginner"
    );

    if (suitablePrompts.length === 0) return [];

    const basePrompt =
      suitablePrompts[Math.floor(Math.random() * suitablePrompts.length)];

    return [
      {
        type: "vocabulary-challenge" as const,
        targetWords,
        basePrompt,
        challengeText: `以下の獲得済み語彙を1つ以上使用して「${
          basePrompt.title
        }」に挑戦してください：${targetWords.join(", ")}`,
      },
    ];
  }
}
