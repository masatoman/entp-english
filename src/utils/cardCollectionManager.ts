import { WordCard } from "../types/gacha";

/**
 * カードコレクション管理システム
 * 重複カードの管理と所持枚数の計算
 */

export interface CardWithCount {
  card: WordCard;
  count: number;
  isNew?: boolean;
}

export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  rarityBreakdown: Record<string, number>;
  completionRate: number;
}

export class CardCollectionManager {
  /**
   * 重複カードを統合して所持枚数付きのカード配列を生成
   */
  static consolidateCards(ownedCards: WordCard[]): CardWithCount[] {
    const cardCountMap = new Map<number, number>();
    const uniqueCards = new Map<number, WordCard>();

    // カードIDごとの所持枚数をカウント
    ownedCards.forEach((card) => {
      cardCountMap.set(card.id, (cardCountMap.get(card.id) || 0) + 1);
      if (!uniqueCards.has(card.id)) {
        uniqueCards.set(card.id, card);
      }
    });

    // CardWithCount形式に変換
    const result: CardWithCount[] = [];
    uniqueCards.forEach((card, cardId) => {
      result.push({
        card,
        count: cardCountMap.get(cardId) || 0,
      });
    });

    return result;
  }

  /**
   * コレクション統計を計算
   */
  static getCollectionStats(
    ownedCards: WordCard[],
    allAvailableCards: WordCard[]
  ): CollectionStats {
    const uniqueOwnedIds = new Set(ownedCards.map((card) => card.id));
    const uniqueAvailableIds = new Set(
      allAvailableCards.map((card) => card.id)
    );

    // レアリティ別の統計
    const rarityBreakdown: Record<string, number> = {};
    ownedCards.forEach((card) => {
      rarityBreakdown[card.rarity] = (rarityBreakdown[card.rarity] || 0) + 1;
    });

    return {
      totalCards: ownedCards.length,
      uniqueCards: uniqueOwnedIds.size,
      rarityBreakdown,
      completionRate: (uniqueOwnedIds.size / uniqueAvailableIds.size) * 100,
    };
  }

  /**
   * カードをレアリティ順にソート
   */
  static sortByRarity(cardsWithCount: CardWithCount[]): CardWithCount[] {
    const rarityOrder = {
      legendary: 5,
      epic: 4,
      rare: 3,
      uncommon: 2,
      common: 1,
    };

    return cardsWithCount.sort((a, b) => {
      const rarityDiff =
        (rarityOrder[b.card.rarity as keyof typeof rarityOrder] || 0) -
        (rarityOrder[a.card.rarity as keyof typeof rarityOrder] || 0);

      if (rarityDiff !== 0) return rarityDiff;

      // レアリティが同じ場合は名前順
      return a.card.word.localeCompare(b.card.word);
    });
  }

  /**
   * 新しく獲得したカードをマーク
   */
  static markNewCards(
    cardsWithCount: CardWithCount[],
    newlyObtainedCardIds: number[]
  ): CardWithCount[] {
    return cardsWithCount.map((cardWithCount) => ({
      ...cardWithCount,
      isNew: newlyObtainedCardIds.includes(cardWithCount.card.id),
    }));
  }

  /**
   * レアリティ別フィルタリング
   */
  static filterByRarity(
    cardsWithCount: CardWithCount[],
    rarity: string
  ): CardWithCount[] {
    if (rarity === "all") return cardsWithCount;
    return cardsWithCount.filter(
      (cardWithCount) => cardWithCount.card.rarity === rarity
    );
  }

  /**
   * 検索フィルタリング
   */
  static filterBySearch(
    cardsWithCount: CardWithCount[],
    searchTerm: string
  ): CardWithCount[] {
    if (!searchTerm) return cardsWithCount;

    const term = searchTerm.toLowerCase();
    return cardsWithCount.filter(
      (cardWithCount) =>
        cardWithCount.card.word.toLowerCase().includes(term) ||
        cardWithCount.card.meaning.toLowerCase().includes(term)
    );
  }
}
