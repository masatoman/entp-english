import { gachaPacks, toeicWordCards } from "../data/toeicGachaCards";
import { GachaPack, UserGachaData, WordCard } from "../types/gacha";
import { DataManager } from "./dataManager";

const GACHA_RATES = {
  common: 0.5,
  uncommon: 0.3,
  rare: 0.15,
  epic: 0.04,
  legendary: 0.01,
};

export class GachaSystem {
  /**
   * ランダムにカードを1枚引く
   */
  static drawRandomCard(): WordCard {
    const rand = Math.random();
    let rarity: WordCard["rarity"];

    if (rand < GACHA_RATES.legendary) rarity = "legendary";
    else if (rand < GACHA_RATES.legendary + GACHA_RATES.epic) rarity = "epic";
    else if (rand < GACHA_RATES.legendary + GACHA_RATES.epic + GACHA_RATES.rare)
      rarity = "rare";
    else if (rand < 0.8) rarity = "uncommon";
    else rarity = "common";

    const availableCards = toeicWordCards.filter(
      (card) => card.rarity === rarity
    );
    if (availableCards.length === 0) {
      // 該当するレアリティのカードがない場合はcommonを返す
      const commonCards = toeicWordCards.filter(
        (card) => card.rarity === "common"
      );
      return commonCards[Math.floor(Math.random() * commonCards.length)];
    }

    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }

  /**
   * パックを開封して8枚の重複なしカードを取得
   */
  static openPack(packId: string): WordCard[] {
    const pack = gachaPacks.find((p) => p.id === packId);
    if (!pack) {
      throw new Error(`Pack with id ${packId} not found`);
    }

    const cards: WordCard[] = [];
    const usedCardIds = new Set<number>();

    // パックのテーマに応じてカードを調整
    for (let i = 0; i < 8; i++) {
      let card: WordCard;
      let attempts = 0;
      const maxAttempts = 100; // 無限ループ防止

      do {
        card = this.drawRandomCard();
        attempts++;

        // パックのテーマに応じてカードを調整
        if (pack.theme !== "mixed") {
          const themeCards = toeicWordCards.filter((c) =>
            c.toeicSpecific.parts.some((part) =>
              pack.theme === "part1_2"
                ? ["Part1", "Part2"].includes(part)
                : pack.theme === "part3_4"
                ? ["Part3", "Part4"].includes(part)
                : pack.theme === "part5_6"
                ? ["Part5", "Part6"].includes(part)
                : pack.theme === "part7"
                ? part === "Part7"
                : true
            )
          );

          if (themeCards.length > 0) {
            card = themeCards[Math.floor(Math.random() * themeCards.length)];
          }
        }

        // 無限ループ防止：最大試行回数に達した場合は重複を許可
        if (attempts >= maxAttempts) {
          break;
        }
      } while (usedCardIds.has(card.id));

      cards.push(card);
      usedCardIds.add(card.id);
    }

    return cards;
  }

  /**
   * ユーザーのガチャデータを取得
   */
  static getUserGachaData(): UserGachaData {
    const stored = localStorage.getItem("userGachaData");
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      ownedCards: [],
      totalPacks: 0,
      dailyPacksUsed: 0,
      lastPackDate: "",
      collection: {
        totalCards: 0,
        uniqueCards: 0,
        rarityStats: {},
      },
    };
  }

  /**
   * ユーザーのガチャデータを保存
   */
  static saveUserGachaData(data: UserGachaData): void {
    localStorage.setItem("userGachaData", JSON.stringify(data));
  }

  /**
   * 新しいカードをコレクションに追加（重複カードも含む）
   */
  static addCardsToCollection(cards: WordCard[]): void {
    const userData = this.getUserGachaData();
    const today = new Date().toDateString();

    // 日付が変わったらデイリー使用回数をリセット
    if (userData.lastPackDate !== today) {
      userData.dailyPacksUsed = 0;
      userData.lastPackDate = today;
    }

    // カードを追加（重複カードも含む）
    cards.forEach((card) => {
      userData.ownedCards.push(card);
    });

    // 統計を更新
    userData.collection.totalCards = userData.ownedCards.length;

    // ユニークカード数を計算
    const uniqueCardIds = new Set(userData.ownedCards.map((card) => card.id));
    userData.collection.uniqueCards = uniqueCardIds.size;

    // レアリティ統計を更新
    userData.collection.rarityStats = {};
    userData.ownedCards.forEach((card) => {
      userData.collection.rarityStats[card.rarity] =
        (userData.collection.rarityStats[card.rarity] || 0) + 1;
    });

    this.saveUserGachaData(userData);
  }

  /**
   * パックを開封してコレクションに追加
   */
  static openPackAndSave(packId: string): WordCard[] {
    const cards = this.openPack(packId);
    this.addCardsToCollection(cards);

    const userData = this.getUserGachaData();
    userData.totalPacks++;
    userData.dailyPacksUsed++;
    this.saveUserGachaData(userData);

    return cards;
  }

  /**
   * 利用可能なパック一覧を取得
   */
  static getAvailablePacks(): GachaPack[] {
    return gachaPacks;
  }

  /**
   * 特定のパック情報を取得
   */
  static getPackById(packId: string): GachaPack | undefined {
    return gachaPacks.find((pack) => pack.id === packId);
  }

  /**
   * ユーザーがパックを開封できるかチェック
   */
  static canOpenPack(
    packId: string,
    userXP: number
  ): { canOpen: boolean; reason?: string } {
    const pack = this.getPackById(packId);
    if (!pack) {
      return { canOpen: false, reason: "パックが見つかりません" };
    }

    if (userXP < pack.cost) {
      return {
        canOpen: false,
        reason: `XPが不足しています (必要: ${pack.cost}, 現在: ${userXP})`,
      };
    }

    const userData = this.getUserGachaData();
    const today = new Date().toDateString();

    // デイリー制限チェック（1日5パックまで）
    if (userData.lastPackDate === today && userData.dailyPacksUsed >= 5) {
      return {
        canOpen: false,
        reason: "本日のパック開封回数上限に達しています",
      };
    }

    return { canOpen: true };
  }

  /**
   * 語彙学習システムにガチャカードを追加
   */
  static addToVocabularySystem(cards: WordCard[]): void {
    // DataManagerと連携して語彙学習システムに追加
    try {
      DataManager.addGachaWordsToVocabulary(cards);
      console.log("Added gacha cards to vocabulary system:", cards);
    } catch (error) {
      console.error("Error adding gacha cards to vocabulary system:", error);
    }
  }
}
