import { allTOEICQuestions } from "../data/toeicMockTestQuestions";
import { WordCard } from "../types/gacha";
import {
  CardBasedQuestion,
  CardPowerUp,
  CardPowerUpActivation,
  CardRecommendation,
  CardSynergy,
  CardUsageStats,
  GachaCollectionProgress,
  GachaTOEICIntegration,
  TOEICCardChallenge,
  TOEICQuestionWithCardBoost,
} from "../types/gachaTOEICIntegration";
import { TOEICQuestion } from "../types/mockTest";
import { GachaSystem } from "./gachaSystem";

/**
 * ガチャカードとTOEIC模擬テストの統合管理システム
 */
export class GachaTOEICIntegrationManager {
  private static readonly INTEGRATION_KEY = "entp-gacha-toeic-integration";
  private static readonly POWERUPS_KEY = "entp-card-powerups";
  // private static readonly _SYNERGIES_KEY = "entp-card-synergies";
  // private static readonly _CHALLENGES_KEY = "entp-card-challenges";

  /**
   * カードパワーアップ定義
   */
  private static readonly CARD_POWERUPS: Omit<
    CardPowerUp,
    "isActive" | "lastUsed" | "usageCount"
  >[] = [
    {
      cardId: "business-vocab-001",
      cardName: "ビジネス語彙カード",
      rarity: "rare",
      effect: {
        type: "accuracy",
        value: 1.2,
        description: "ビジネス語彙問題で20%精度向上",
      },
      duration: 30,
      cooldown: 120,
      maxUsagePerDay: 5,
    },
    {
      cardId: "grammar-advanced-001",
      cardName: "上級文法カード",
      rarity: "epic",
      effect: {
        type: "time",
        value: 15,
        description: "文法問題で15秒時間延長",
      },
      duration: 45,
      cooldown: 180,
      maxUsagePerDay: 3,
    },
    {
      cardId: "listening-expert-001",
      cardName: "リスニングエキスパートカード",
      rarity: "legendary",
      effect: {
        type: "hint",
        value: 1,
        description: "リスニング問題でヒント表示",
      },
      duration: 60,
      cooldown: 300,
      maxUsagePerDay: 2,
    },
    {
      cardId: "vocabulary-master-001",
      cardName: "語彙マスターカード",
      rarity: "rare",
      effect: {
        type: "bonus",
        value: 1.5,
        description: "語彙問題で50%XP増加",
      },
      duration: 40,
      cooldown: 150,
      maxUsagePerDay: 4,
    },
    {
      cardId: "reading-speed-001",
      cardName: "読解スピードカード",
      rarity: "uncommon",
      effect: {
        type: "time",
        value: 10,
        description: "読解問題で10秒時間延長",
      },
      duration: 25,
      cooldown: 90,
      maxUsagePerDay: 6,
    },
  ];

  /**
   * カードシナジー定義
   */
  private static readonly CARD_SYNERGIES: Omit<
    CardSynergy,
    "isActive" | "unlockedAt" | "usageCount"
  >[] = [
    {
      combinationId: "business-grammar-combo",
      combinationName: "ビジネス×文法シナジー",
      requiredCards: ["business-vocab-001", "grammar-advanced-001"],
      requiredRarities: ["rare", "epic"],
      synergyEffect: {
        type: "combo_multiplier",
        value: 1.3,
        description: "ビジネス語彙と文法問題で30%コンボ倍率向上",
      },
    },
    {
      combinationId: "listening-reading-combo",
      combinationName: "リスニング×読解シナジー",
      requiredCards: ["listening-expert-001", "reading-speed-001"],
      requiredRarities: ["legendary", "uncommon"],
      synergyEffect: {
        type: "accuracy_boost",
        value: 1.25,
        description: "リスニングと読解問題で25%精度向上",
      },
    },
    {
      combinationId: "vocabulary-master-combo",
      combinationName: "語彙マスターシナジー",
      requiredCards: ["vocabulary-master-001", "business-vocab-001"],
      requiredRarities: ["rare", "rare"],
      synergyEffect: {
        type: "special_questions",
        value: 1,
        description: "特別な語彙問題が出現",
      },
    },
    {
      combinationId: "ultimate-english-combo",
      combinationName: "究極英語シナジー",
      requiredCards: [
        "business-vocab-001",
        "grammar-advanced-001",
        "listening-expert-001",
        "vocabulary-master-001",
      ],
      requiredRarities: ["rare", "epic", "legendary", "rare"],
      synergyEffect: {
        type: "combo_multiplier",
        value: 2.0,
        description: "全カテゴリーで100%コンボ倍率向上",
      },
    },
  ];

  /**
   * カードチャレンジ定義
   */
  // @ts-expect-error - 未使用だが将来の機能拡張のために保持
  private static readonly _________CARD_CHALLENGES: Omit<
    TOEICCardChallenge,
    "currentValue" | "isCompleted" | "completedAt"
  >[] = [
    {
      challengeId: "business-vocab-master",
      challengeName: "ビジネス語彙マスター",
      description: "ビジネス語彙カードで10問連続正解",
      requiredCards: ["business-vocab-001"],
      challengeType: "accuracy",
      targetValue: 10,
      rewards: {
        xp: 500,
        coins: 100,
        newCard: "business-vocab-advanced-001",
        title: "ビジネス語彙マスター",
        badge: "business-vocab-master",
      },
      difficulty: "medium",
    },
    {
      challengeId: "grammar-speed-demon",
      challengeName: "文法スピードデーモン",
      description: "上級文法カードで5問を2分以内に正解",
      requiredCards: ["grammar-advanced-001"],
      challengeType: "speed",
      targetValue: 5,
      rewards: {
        xp: 400,
        coins: 80,
        title: "文法スピードデーモン",
        badge: "grammar-speed-demon",
      },
      difficulty: "hard",
    },
    {
      challengeId: "listening-perfectionist",
      challengeName: "リスニング完璧主義者",
      description: "リスニングエキスパートカードで15問完璧正解",
      requiredCards: ["listening-expert-001"],
      challengeType: "accuracy",
      targetValue: 15,
      rewards: {
        xp: 800,
        coins: 150,
        newCard: "listening-legendary-001",
        title: "リスニング完璧主義者",
        badge: "listening-perfectionist",
      },
      difficulty: "legendary",
    },
  ];

  /**
   * ガチャTOEIC統合データを取得
   */
  static getGachaTOEICIntegration(
    userId: string = "default"
  ): GachaTOEICIntegration {
    const ownedCards = this.getOwnedCards(userId);
    const cardBasedQuestions = this.generateCardBasedQuestions(ownedCards);
    const cardPowerUps = this.getActiveCardPowerUps(userId, ownedCards);
    const cardSynergies = this.getActiveCardSynergies(userId, ownedCards);

    return {
      userId,
      ownedCards,
      cardBasedQuestions,
      cardPowerUps,
      cardSynergies,
      lastUpdated: new Date(),
    };
  }

  /**
   * 所持カードを取得
   */
  private static getOwnedCards(_userId: string): WordCard[] {
    const userData = GachaSystem.getUserGachaData();
    return userData.ownedCards.map((card) => {
      // 実際の実装では、カードIDからカード情報を取得
      return {
        id: card.id,
        word: card.word,
        japanese: "サンプル",
        meaning: "サンプル意味",
        partOfSpeech: "noun",
        phonetic: "/sæmpl/",
        example: "Sample example sentence",
        exampleTranslation: "サンプル例文の翻訳",
        pronunciation: "/sæmpl/",
        rarity: card.rarity,
        category: "general",
        toeicFrequency: 1,
        difficulty: "easy",
        examples: ["Sample example sentence"],
        scoreBand: "600-700",
        frequency: "high",
        toeicLevel: "intermediate",
      } as any;
    });
  }

  /**
   * カードベース問題を生成
   */
  private static generateCardBasedQuestions(
    ownedCards: WordCard[]
  ): CardBasedQuestion[] {
    const cardBasedQuestions: CardBasedQuestion[] = [];

    // 所持カードに関連するTOEIC問題を生成
    ownedCards.forEach((card) => {
      const relatedQuestions = allTOEICQuestions.filter(
        (q) =>
          q.category.toLowerCase().includes("general") ||
          q.question.toLowerCase().includes(card.word.toLowerCase())
      );

      relatedQuestions.slice(0, 2).forEach((question) => {
        const cardBased: CardBasedQuestion = {
          ...question,
          requiredCards: [card.id.toString()],
          cardBonuses: [
            {
              cardId: card.id.toString(),
              bonusType: this.getBonusTypeForCard(card),
              bonusValue: this.getBonusValueForRarity(card.rarity),
              isActive: true,
              cardRarity: card.rarity,
            },
          ],
          cardDifficultyAdjustment: this.getDifficultyAdjustmentForRarity(
            card.rarity
          ),
        };

        cardBasedQuestions.push(cardBased);
      });
    });

    return cardBasedQuestions;
  }

  /**
   * アクティブなカードパワーアップを取得
   */
  private static getActiveCardPowerUps(
    _userId: string,
    ownedCards: WordCard[]
  ): CardPowerUp[] {
    const powerUps: CardPowerUp[] = [];

    this.CARD_POWERUPS.forEach((powerUpTemplate) => {
      const ownedCard = ownedCards.find(
        (card) => card.id.toString() === powerUpTemplate.cardId
      );
      if (ownedCard) {
        const powerUp: CardPowerUp = {
          ...powerUpTemplate,
          isActive: false,
          usageCount: 0,
          lastUsed: undefined,
        };
        powerUps.push(powerUp);
      }
    });

    return powerUps;
  }

  /**
   * アクティブなカードシナジーを取得
   */
  private static getActiveCardSynergies(
    _userId: string,
    ownedCards: WordCard[]
  ): CardSynergy[] {
    const synergies: CardSynergy[] = [];

    this.CARD_SYNERGIES.forEach((synergyTemplate) => {
      const hasRequiredCards = synergyTemplate.requiredCards.every((cardId) =>
        ownedCards.some((card) => card.id.toString() === cardId)
      );

      if (hasRequiredCards) {
        const synergy: CardSynergy = {
          ...synergyTemplate,
          isActive: true,
          usageCount: 0,
        };
        synergies.push(synergy);
      }
    });

    return synergies;
  }

  /**
   * TOEIC問題にカードブーストを適用
   */
  static applyCardBoostToQuestion(
    question: TOEICQuestion,
    userId: string = "default"
  ): TOEICQuestionWithCardBoost {
    const integration = this.getGachaTOEICIntegration(userId);
    const questionWithBoost = { ...question } as TOEICQuestionWithCardBoost;

    // 関連するカードを探す
    const relatedCards = integration.ownedCards.filter(
      (card) =>
        question.category.toLowerCase().includes("general") ||
        question.question.toLowerCase().includes(card.word.toLowerCase())
    );

    if (relatedCards.length > 0) {
      const bestCard = relatedCards[0]; // 最初の関連カードを使用
      const synergyActive = integration.cardSynergies.some(
        (synergy) =>
          synergy.requiredCards.includes(bestCard.id.toString()) &&
          synergy.isActive
      );

      questionWithBoost.cardBoost = {
        cardId: bestCard.id.toString(),
        cardName: bestCard.word,
        rarity: bestCard.rarity,
        boostType: this.getBonusTypeForCard(bestCard),
        boostValue: this.getBonusValueForRarity(bestCard.rarity),
        isActive: true,
        synergyActive,
      };
    }

    return questionWithBoost;
  }

  /**
   * カードブーストに基づくXP計算
   */
  static calculateBoostedXP(
    baseXP: number,
    question: TOEICQuestionWithCardBoost,
    isCorrect: boolean
  ): number {
    if (!isCorrect || !question.cardBoost?.isActive) {
      return baseXP;
    }

    const boost = question.cardBoost;
    let xp = baseXP;

    // 基本ブースト値
    xp *= boost.boostValue;

    // シナジー効果
    if (boost.synergyActive) {
      xp *= 1.5;
    }

    // レアリティボーナス
    const rarityMultiplier = this.getRarityMultiplier(boost.rarity);
    xp *= rarityMultiplier;

    return Math.floor(xp);
  }

  /**
   * カードパワーアップをアクティベート
   */
  static activateCardPowerUp(
    userId: string,
    cardId: string
  ): CardPowerUpActivation | null {
    const integration = this.getGachaTOEICIntegration(userId);
    const powerUp = integration.cardPowerUps.find((p) => p.cardId === cardId);

    if (!powerUp || !this.canActivatePowerUp(userId, powerUp)) {
      return null;
    }

    const activation: CardPowerUpActivation = {
      cardId,
      activationTime: new Date(),
      duration: powerUp.duration,
      effects: [
        {
          type: powerUp.effect.type,
          value: powerUp.effect.value,
        },
      ],
      isActive: true,
      remainingTime: powerUp.duration * 60, // 分を秒に変換
    };

    this.savePowerUpActivation(userId, activation);
    this.updatePowerUpUsage(userId, cardId);

    return activation;
  }

  /**
   * カード推薦を生成
   */
  static generateCardRecommendations(
    userId: string,
    _partNumber?: number
  ): CardRecommendation[] {
    const integration = this.getGachaTOEICIntegration(userId);
    const recommendations: CardRecommendation[] = [];

    // 弱点に基づくカード推薦
    const weakCategories = this.getWeakCategories(userId);

    weakCategories.forEach((category) => {
      const relatedCards = integration.ownedCards.filter(
        (_card) => "general" === category
      );

      relatedCards.forEach((card) => {
        recommendations.push({
          cardId: card.id.toString(),
          cardName: card.word,
          rarity: card.rarity,
          recommendationReason: `${category}の弱点改善のため`,
          expectedBenefit: "精度向上が期待できます",
          priority: "high",
          category: "general",
          partNumber: this.getPartNumberForCategory(category),
        });
      });
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * カード使用統計を取得
   */
  static getCardUsageStats(userId: string): CardUsageStats[] {
    const integration = this.getGachaTOEICIntegration(userId);

    return integration.ownedCards.map((card) => ({
      cardId: card.id.toString(),
      cardName: card.word,
      usageCount: Math.floor(Math.random() * 50) + 10, // モックデータ
      successRate: Math.floor(Math.random() * 30) + 70, // モックデータ
      averageBonus: this.getBonusValueForRarity(card.rarity),
      lastUsed: new Date(),
      effectiveness: this.getEffectivenessForRarity(card.rarity),
      favoriteQuestionTypes: ["general"],
    }));
  }

  /**
   * ガチャコレクション進捗を取得
   */
  static getCollectionProgress(userId: string): GachaCollectionProgress {
    const integration = this.getGachaTOEICIntegration(userId);
    const totalCards = 100; // 仮の総カード数
    const ownedCards = integration.ownedCards.length;
    const completionRate = ownedCards / totalCards;

    const rarityBreakdown = [
      "common",
      "uncommon",
      "rare",
      "epic",
      "legendary",
    ].map((rarity) => {
      const total = this.getTotalCardsByRarity(rarity);
      const owned = integration.ownedCards.filter(
        (card) => card.rarity === rarity
      ).length;

      return {
        rarity,
        total,
        owned,
        completionRate: owned / total,
      };
    });

    const missingCards = this.getMissingCards(integration.ownedCards);
    const nextTargetCards = missingCards.slice(0, 5);

    return {
      totalCards,
      ownedCards,
      completionRate,
      rarityBreakdown,
      missingCards,
      nextTargetCards,
    };
  }

  // ヘルパーメソッド群
  private static getBonusTypeForCard(
    _card: WordCard
  ): "accuracy_boost" | "time_extension" | "hint_reveal" | "xp_multiplier" {
    const typeMap: { [key: string]: any } = {
      business: "accuracy_boost",
      grammar: "time_extension",
      listening: "hint_reveal",
      vocabulary: "xp_multiplier",
    };

    return typeMap["general"] || "xp_multiplier";
  }

  private static getBonusValueForRarity(rarity: string): number {
    const valueMap: { [key: string]: number } = {
      common: 1.1,
      uncommon: 1.2,
      rare: 1.3,
      epic: 1.5,
      legendary: 2.0,
    };

    return valueMap[rarity] || 1.1;
  }

  private static getDifficultyAdjustmentForRarity(rarity: string): number {
    const adjustmentMap: { [key: string]: number } = {
      common: -0.1,
      uncommon: 0,
      rare: 0.1,
      epic: 0.2,
      legendary: 0.3,
    };

    return adjustmentMap[rarity] || 0;
  }

  private static getRarityMultiplier(rarity: string): number {
    const multiplierMap: { [key: string]: number } = {
      common: 1.0,
      uncommon: 1.1,
      rare: 1.2,
      epic: 1.5,
      legendary: 2.0,
    };

    return multiplierMap[rarity] || 1.0;
  }

  private static canActivatePowerUp(
    _userId: string,
    powerUp: CardPowerUp
  ): boolean {
    // クールダウンと使用回数制限をチェック
    if (powerUp.lastUsed) {
      const timeSinceLastUsed = Date.now() - powerUp.lastUsed.getTime();
      if (timeSinceLastUsed < powerUp.cooldown * 60 * 1000) {
        return false;
      }
    }

    if (powerUp.usageCount >= powerUp.maxUsagePerDay) {
      return false;
    }

    return true;
  }

  private static savePowerUpActivation(
    userId: string,
    activation: CardPowerUpActivation
  ): void {
    try {
      const stored = localStorage.getItem(`${this.POWERUPS_KEY}-${userId}`);
      const activations = stored ? JSON.parse(stored) : [];

      activations.push(activation);

      localStorage.setItem(
        `${this.POWERUPS_KEY}-${userId}`,
        JSON.stringify(activations)
      );
    } catch (error) {
      console.error("パワーアップアクティベーションの保存エラー:", error);
    }
  }

  private static updatePowerUpUsage(userId: string, cardId: string): void {
    // パワーアップ使用回数を更新
    try {
      const stored = localStorage.getItem(`${this.INTEGRATION_KEY}-${userId}`);
      const data = stored ? JSON.parse(stored) : {};

      if (!data.powerUpUsage) {
        data.powerUpUsage = {};
      }

      if (!data.powerUpUsage[cardId]) {
        data.powerUpUsage[cardId] = { count: 0, lastUsed: null };
      }

      data.powerUpUsage[cardId].count++;
      data.powerUpUsage[cardId].lastUsed = new Date().toISOString();

      localStorage.setItem(
        `${this.INTEGRATION_KEY}-${userId}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("パワーアップ使用更新エラー:", error);
    }
  }

  private static getWeakCategories(_userId: string): string[] {
    // 実際の実装では、学習履歴から弱点カテゴリーを分析
    return ["business", "grammar", "listening"]; // モックデータ
  }

  private static getPartNumberForCategory(category: string): number {
    const partMap: { [key: string]: number } = {
      business: 7,
      grammar: 5,
      listening: 2,
      vocabulary: 5,
    };

    return partMap[category] || 5;
  }

  private static getEffectivenessForRarity(
    rarity: string
  ): "high" | "medium" | "low" {
    if (["epic", "legendary"].includes(rarity)) return "high";
    if (["rare", "uncommon"].includes(rarity)) return "medium";
    return "low";
  }

  private static getTotalCardsByRarity(rarity: string): number {
    const totalMap: { [key: string]: number } = {
      common: 40,
      uncommon: 30,
      rare: 20,
      epic: 8,
      legendary: 2,
    };

    return totalMap[rarity] || 0;
  }

  private static getMissingCards(_ownedCards: WordCard[]): string[] {
    // 実際の実装では、全カードから所持カードを除外
    return ["missing-card-1", "missing-card-2", "missing-card-3"]; // モックデータ
  }

  /**
   * 統合データを保存
   */
  static saveIntegrationData(
    userId: string,
    data: GachaTOEICIntegration
  ): void {
    localStorage.setItem(
      `${this.INTEGRATION_KEY}-${userId}`,
      JSON.stringify(data)
    );
  }

  /**
   * 統合データを読み込み
   */
  static loadIntegrationData(
    userId: string = "default"
  ): GachaTOEICIntegration | null {
    try {
      const stored = localStorage.getItem(`${this.INTEGRATION_KEY}-${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("ガチャTOEIC統合データの読み込みエラー:", error);
      return null;
    }
  }
}
