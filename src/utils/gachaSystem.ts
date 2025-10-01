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

    console.log(
      `GachaSystem.drawRandomCard - Rolled ${rand}, selected rarity: ${rarity}`
    );

    const availableCards = toeicWordCards.filter(
      (card) => card.rarity === rarity
    );
    console.log(
      `GachaSystem.drawRandomCard - Available ${rarity} cards:`,
      availableCards.length
    );

    if (availableCards.length === 0) {
      // 該当するレアリティのカードがない場合はcommonを返す
      console.warn(
        `GachaSystem.drawRandomCard - No ${rarity} cards available, falling back to common`
      );
      const commonCards = toeicWordCards.filter(
        (card) => card.rarity === "common"
      );
      console.log(
        `GachaSystem.drawRandomCard - Common cards available:`,
        commonCards.length
      );
      return commonCards[Math.floor(Math.random() * commonCards.length)];
    }

    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }

  /**
   * パックを開封して8枚の重複なしカードを取得
   */
  static openPack(packId: string): WordCard[] {
    try {
      console.log("GachaSystem.openPack - Opening pack:", packId);
      const pack = gachaPacks.find((p) => p.id === packId);
      if (!pack) {
        throw new Error(`Pack with id ${packId} not found`);
      }
      console.log(
        "GachaSystem.openPack - Pack found:",
        pack.name,
        "theme:",
        pack.theme
      );

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
        console.log(
          `GachaSystem.openPack - Drew card ${i + 1}:`,
          card.word,
          card.rarity
        );
      }

      console.log("GachaSystem.openPack - Final cards:", cards.length);
      return cards;
    } catch (error) {
      console.error("GachaSystem.openPack - Error:", error);
      throw error;
    }
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
      dailyPacksUsed: 0, // 互換性のため残す
      lastPackDate: "", // 互換性のため残す
      availablePacks: 2, // 初期値: 2パック利用可能
      lastPackOpenTime: 0, // 最後に開封した時間
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

    // 時間ベースシステムでは日付リセットは不要
    // 利用可能パック数を現在時刻で更新
    const updatedUserData = this.updateAvailablePacksCount(userData);

    // カードを追加（重複カードも含む）
    cards.forEach((card) => {
      updatedUserData.ownedCards.push(card);
    });

    // 統計を更新
    updatedUserData.collection.totalCards = updatedUserData.ownedCards.length;

    // ユニークカード数を計算
    const uniqueCardIds = new Set(
      updatedUserData.ownedCards.map((card) => card.id)
    );
    updatedUserData.collection.uniqueCards = uniqueCardIds.size;

    // レアリティ統計を更新
    updatedUserData.collection.rarityStats = {};
    updatedUserData.ownedCards.forEach((card) => {
      updatedUserData.collection.rarityStats[card.rarity] =
        (updatedUserData.collection.rarityStats[card.rarity] || 0) + 1;
    });

    this.saveUserGachaData(updatedUserData);
  }

  /**
   * パックを開封してコレクションに追加
   */
  static openPackAndSave(packId: string): WordCard[] {
    try {
      console.log(
        "GachaSystem.openPackAndSave - Starting pack opening:",
        packId
      );
      const cards = this.openPack(packId);
      console.log("GachaSystem.openPackAndSave - Cards drawn:", cards.length);

      this.addCardsToCollection(cards);
      console.log("GachaSystem.openPackAndSave - Cards added to collection");

      const userData = this.getUserGachaData();
      userData.totalPacks++;
      // 時間ベースシステムでは dailyPacksUsed は使用しない
      // 代わりに lastPackOpenTime を更新し、availablePacks を減らす
      userData.lastPackOpenTime = Date.now();
      userData.availablePacks = Math.max(0, (userData.availablePacks || 2) - 1);
      this.saveUserGachaData(userData);
      console.log("GachaSystem.openPackAndSave - User data updated");

      return cards;
    } catch (error) {
      console.error("GachaSystem.openPackAndSave - Error:", error);
      throw error;
    }
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
  ): { canOpen: boolean; reason?: string; nextPackTime?: number } {
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

    // XPとコインがあればいつでも開封可能（パック制限なし）
    return { canOpen: true };
  }

  /**
   * 利用可能なパック数を計算（時間ベース回復システム）
   */
  static getAvailablePacksCount(userData: UserGachaData): number {
    const now = Date.now();
    const lastOpenTime = userData.lastPackOpenTime || 0;
    const currentAvailable = userData.availablePacks || 2; // 初期値は2

    // テスト用: 5分 = 5 * 60 * 1000ms
    // 本番用: 12時間 = 12 * 60 * 60 * 1000ms
    const RECOVERY_TIME = 5 * 60 * 1000; // 5分（テスト用）

    if (currentAvailable >= 2) {
      return 2; // 最大2パック
    }

    // 前回の開封から何回分回復したか計算
    const timeSinceLastOpen = now - lastOpenTime;
    const recoveredPacks = Math.floor(timeSinceLastOpen / RECOVERY_TIME);

    return Math.min(2, currentAvailable + recoveredPacks);
  }

  /**
   * 次のパック回復時間を取得
   */
  static getNextPackRecoveryTime(userData: UserGachaData): number {
    const now = Date.now();
    const lastOpenTime = userData.lastPackOpenTime || now;
    const RECOVERY_TIME = 5 * 60 * 1000; // 5分（テスト用）

    return lastOpenTime + RECOVERY_TIME;
  }

  /**
   * ユーザーデータの利用可能パック数を更新
   */
  static updateAvailablePacksCount(userData: UserGachaData): UserGachaData {
    const availablePacks = this.getAvailablePacksCount(userData);
    return {
      ...userData,
      availablePacks,
    };
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
