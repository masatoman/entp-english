import { vocabularyWords } from "../data/vocabulary";
import { toeicWordCards } from "../data/toeicGachaCards";
import { LearningItem } from "../types/learningItem";
import { GachaSystem } from "./gachaSystem";
import { LearningItemManager } from "./learningItemManager";

/**
 * データ移行サービス
 * 既存の語彙・ガチャデータを統合学習項目システムに移行
 */
export class DataMigrationService {
  private static readonly MIGRATION_VERSION_KEY = "entp-migration-version";
  private static readonly CURRENT_VERSION = "1.0.0";

  /**
   * 移行が必要かチェック
   */
  static needsMigration(): boolean {
    try {
      const currentVersion = localStorage.getItem(this.MIGRATION_VERSION_KEY);
      return currentVersion !== this.CURRENT_VERSION;
    } catch (error) {
      console.error("Error checking migration status:", error);
      return true;
    }
  }

  /**
   * 完全なデータ移行を実行
   */
  static async performFullMigration(): Promise<{
    success: boolean;
    itemsCreated: number;
    errors: string[];
  }> {
    console.log("🔄 統合学習項目システムへのデータ移行を開始...");
    
    const result = {
      success: false,
      itemsCreated: 0,
      errors: [] as string[],
    };

    try {
      const learningItems: LearningItem[] = [];

      // 1. 標準語彙データを変換
      console.log("📚 標準語彙データを変換中...");
      for (const vocabWord of vocabularyWords) {
        try {
          const learningItem = LearningItemManager.convertVocabularyWordToLearningItem(vocabWord);
          learningItems.push(learningItem);
        } catch (error) {
          result.errors.push(`標準語彙 ${vocabWord.word} の変換エラー: ${error}`);
        }
      }

      // 2. ガチャカードデータを変換
      console.log("🎁 ガチャカードデータを変換中...");
      const userGachaData = GachaSystem.getUserGachaData();
      for (const gachaCard of userGachaData.ownedCards) {
        try {
          const learningItem = LearningItemManager.convertGachaCardToLearningItem(gachaCard);
          learningItems.push(learningItem);
        } catch (error) {
          result.errors.push(`ガチャカード ${gachaCard.word} の変換エラー: ${error}`);
        }
      }

      // 3. 重複チェック
      const uniqueItems = this.removeDuplicateItems(learningItems);
      console.log(`🔍 重複チェック完了: ${learningItems.length} → ${uniqueItems.length} 項目`);

      // 4. 関連性を自動生成
      console.log("🔗 項目間の関連性を生成中...");
      const itemsWithRelations = this.generateRelations(uniqueItems);

      // 5. 保存
      console.log("💾 統合学習項目を保存中...");
      LearningItemManager.saveLearningItems(itemsWithRelations);

      // 6. 移行完了をマーク
      localStorage.setItem(this.MIGRATION_VERSION_KEY, this.CURRENT_VERSION);

      result.success = true;
      result.itemsCreated = itemsWithRelations.length;

      console.log(`✅ データ移行完了: ${result.itemsCreated} 項目を作成`);

    } catch (error) {
      result.errors.push(`移行プロセスエラー: ${error}`);
      console.error("❌ データ移行エラー:", error);
    }

    return result;
  }

  /**
   * 重複する学習項目を除去
   */
  private static removeDuplicateItems(items: LearningItem[]): LearningItem[] {
    const uniqueItems = new Map<string, LearningItem>();
    
    for (const item of items) {
      const key = `${item.content}-${item.type}-${item.category}`;
      
      if (!uniqueItems.has(key)) {
        uniqueItems.set(key, item);
      } else {
        // 既存項目と比較して、より詳細な方を保持
        const existing = uniqueItems.get(key)!;
        if (this.compareItemDetail(item, existing) > 0) {
          uniqueItems.set(key, item);
        }
      }
    }

    return Array.from(uniqueItems.values());
  }

  /**
   * 項目の詳細度を比較（高い方が良い）
   */
  private static compareItemDetail(item1: LearningItem, item2: LearningItem): number {
    let score1 = 0;
    let score2 = 0;

    // 例文数
    score1 += item1.examples.length * 10;
    score2 += item2.examples.length * 10;

    // 説明数
    score1 += item1.explanations.length * 15;
    score2 += item2.explanations.length * 15;

    // 問題数
    score1 += item1.questions.length * 20;
    score2 += item2.questions.length * 20;

    // ガチャカードはより詳細とみなす
    if (item1.source === "gacha") score1 += 50;
    if (item2.source === "gacha") score2 += 50;

    return score1 - score2;
  }

  /**
   * 項目間の関連性を自動生成
   */
  private static generateRelations(items: LearningItem[]): LearningItem[] {
    console.log("🔗 関連性生成中...");
    
    const itemsWithRelations = items.map(item => ({ ...item }));

    for (let i = 0; i < itemsWithRelations.length; i++) {
      const currentItem = itemsWithRelations[i];
      
      for (let j = i + 1; j < itemsWithRelations.length; j++) {
        const targetItem = itemsWithRelations[j];
        
        // 関連性を計算
        const relations = this.calculateRelations(currentItem, targetItem);
        
        // 関連性が十分強い場合に追加
        relations.forEach(relation => {
          if (relation.strength >= 30) { // 閾値: 30%以上
            currentItem.relations.push(relation);
            
            // 逆方向の関連も追加
            targetItem.relations.push({
              targetItemId: currentItem.id,
              relationType: relation.relationType,
              strength: relation.strength,
              description: relation.description,
            });
          }
        });
      }
    }

    return itemsWithRelations;
  }

  /**
   * 2つの項目間の関連性を計算
   */
  private static calculateRelations(item1: LearningItem, item2: LearningItem) {
    const relations = [];

    // 同じカテゴリの場合
    if (item1.category === item2.category && item1.category === "toeic") {
      relations.push({
        targetItemId: item2.id,
        relationType: "related" as const,
        strength: 40,
        description: "同じTOEICカテゴリ",
      });
    }

    // 同じレベルの場合
    if (item1.level === item2.level) {
      relations.push({
        targetItemId: item2.id,
        relationType: "related" as const,
        strength: 25,
        description: `同じ${item1.level}レベル`,
      });
    }

    // 品詞が同じ場合
    if (item1.partOfSpeech && item2.partOfSpeech && 
        item1.partOfSpeech === item2.partOfSpeech) {
      relations.push({
        targetItemId: item2.id,
        relationType: "related" as const,
        strength: 20,
        description: `同じ${item1.partOfSpeech}`,
      });
    }

    // 単語の類似性をチェック（簡易版）
    if (this.areWordsSimilar(item1.content, item2.content)) {
      relations.push({
        targetItemId: item2.id,
        relationType: "related" as const,
        strength: 60,
        description: "類似した単語",
      });
    }

    return relations;
  }

  /**
   * 単語の類似性をチェック（簡易版）
   */
  private static areWordsSimilar(word1: string, word2: string): boolean {
    // 同じルートを持つ単語を検出（簡易版）
    const root1 = word1.toLowerCase().replace(/ing$|ed$|er$|est$|ly$|tion$|ness$/g, '');
    const root2 = word2.toLowerCase().replace(/ing$|ed$|er$|est$|ly$|tion$|ness$/g, '');
    
    return root1 === root2 && root1.length > 3;
  }

  /**
   * 移行統計を取得
   */
  static getMigrationStats(): {
    totalItems: number;
    bySource: Record<string, number>;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
    avgQuestionsPerItem: number;
  } {
    const items = LearningItemManager.getAllLearningItems();
    
    const stats = {
      totalItems: items.length,
      bySource: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
      avgQuestionsPerItem: 0,
    };

    let totalQuestions = 0;

    items.forEach(item => {
      // ソース別統計
      stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;
      
      // カテゴリ別統計
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      
      // レベル別統計
      stats.byLevel[item.level] = (stats.byLevel[item.level] || 0) + 1;
      
      // 問題数
      totalQuestions += item.questions.length;
    });

    stats.avgQuestionsPerItem = items.length > 0 ? totalQuestions / items.length : 0;

    return stats;
  }

  /**
   * 移行状態をリセット（開発・テスト用）
   */
  static resetMigration(): void {
    localStorage.removeItem(this.MIGRATION_VERSION_KEY);
    localStorage.removeItem(LearningItemManager["STORAGE_KEY"]);
    console.log("🔄 移行状態をリセットしました");
  }
}
