/**
 * データ移行サービス
 * 既存データからIndexedDBへの移行処理
 */

import {
  dbManager,
  GameData,
  STORES,
  UserProgress,
  VocabularyItem,
} from "./IndexedDBManager";

// 移行ステータス
export interface MigrationStatus {
  isRunning: boolean;
  currentStep: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  errors: string[];
}

// データ移行サービス
export class DataMigrationService {
  private status: MigrationStatus = {
    isRunning: false,
    currentStep: "",
    progress: 0,
    totalSteps: 0,
    completedSteps: 0,
    errors: [],
  };

  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // 移行が必要かチェック
    this.checkMigrationNeeded();
  }

  /**
   * 移行が必要かチェック
   */
  private async checkMigrationNeeded(): Promise<boolean> {
    try {
      // IndexedDBにデータがあるかチェック
      const vocabularyCount = await dbManager.count(STORES.VOCABULARY);
      const grammarCount = await dbManager.count(STORES.GRAMMAR);
      const listeningCount = await dbManager.count(STORES.LISTENING);

      const needsMigration =
        vocabularyCount === 0 && grammarCount === 0 && listeningCount === 0;

      if (needsMigration) {
        console.log("🔄 データ移行が必要です");
      } else {
        console.log("✅ データ移行は既に完了しています");
      }

      return needsMigration;
    } catch (error) {
      console.error("移行チェックエラー:", error);
      return true;
    }
  }

  /**
   * データ移行の実行
   */
  async migrateData(): Promise<void> {
    if (this.status.isRunning) {
      console.log("⚠️ 移行は既に実行中です");
      return;
    }

    this.status.isRunning = true;
    this.status.errors = [];
    this.status.completedSteps = 0;

    this.emit("migrationStart");

    try {
      // 簡単な移行処理
      console.log("🔄 データ移行を実行中...");

      // 語彙データの移行
      await this.migrateVocabularyData();

      // 文法データの移行
      await this.migrateGrammarData();

      // 実績データの移行
      await this.migrateAchievementsData();

      // ユーザー進捗の初期化
      await this.migrateUserProgressData();

      // ゲームデータの初期化
      await this.migrateGameData();

      this.status.progress = 100;
      this.emit("migrationComplete");
      console.log("🎉 データ移行が完了しました");
    } catch (error) {
      console.error("移行エラー:", error);
      this.status.errors.push(
        error instanceof Error ? error.message : "Unknown error"
      );
      this.emit("migrationError", { error });
      throw error;
    } finally {
      this.status.isRunning = false;
      this.emit("migrationEnd");
    }
  }

  /**
   * 語彙データの移行
   */
  private async migrateVocabularyData(): Promise<void> {
    try {
      // 既存の語彙データを取得
      const { vocabularyWords } = await import("../data/vocabulary");
      const { toeicWordCards } = await import("../data/toeicGachaCards");

      // 統合データの作成
      const vocabularyItems: VocabularyItem[] = [
        ...vocabularyWords,
        ...toeicWordCards.map((card, index) => ({
          id: vocabularyWords.length + index + 1,
          word: card.word,
          meaning: card.meaning,
          partOfSpeech: card.partOfSpeech,
          example: card.examples[0]?.sentence || "",
          exampleTranslation: card.examples[0]?.translation || "",
          level: this.mapRarityToLevel(card.rarity),
          category: "toeic" as const,
          lastStudied: undefined,
          mastery: 0,
        })),
      ];

      // IndexedDBに保存
      await dbManager.batchPut(STORES.VOCABULARY, vocabularyItems);

      console.log(
        `📚 語彙データを移行しました: ${vocabularyItems.length} 項目`
      );
    } catch (error) {
      console.error("語彙データ移行エラー:", error);
      throw error;
    }
  }

  /**
   * 文法データの移行
   */
  private async migrateGrammarData(): Promise<void> {
    try {
      // 既存の文法データを取得
      const questionsModule = await import("../data/questions");
      const questions = questionsModule.getQuestions
        ? questionsModule.getQuestions("parts-of-speech" as any, "easy")
        : [];

      // IndexedDBに保存
      await dbManager.batchPut(STORES.GRAMMAR, questions);

      console.log(`📖 文法データを移行しました: ${questions.length} 項目`);
    } catch (error) {
      console.error("文法データ移行エラー:", error);
      throw error;
    }
  }

  /**
   * 実績データの移行
   */
  private async migrateAchievementsData(): Promise<void> {
    try {
      // 既存の実績データを取得
      const { achievements } = await import("../data/achievements");

      // IndexedDBに保存
      await dbManager.batchPut(STORES.ACHIEVEMENTS, achievements);

      console.log(`🏆 実績データを移行しました: ${achievements.length} 項目`);
    } catch (error) {
      console.error("実績データ移行エラー:", error);
      throw error;
    }
  }

  /**
   * ユーザー進捗データの移行
   */
  private async migrateUserProgressData(): Promise<void> {
    try {
      // 新規ユーザープログレスを作成
      const newProgress: UserProgress = {
        userId: this.getCurrentUserId(),
        vocabularyMastery: new Map(),
        grammarProgress: new Map(),
        listeningProgress: new Map(),
        lastUpdated: new Date(),
      };

      await dbManager.put(STORES.USER_PROGRESS, newProgress);
      console.log("📊 新規ユーザー進捗データを作成しました");
    } catch (error) {
      console.error("ユーザー進捗データ移行エラー:", error);
      throw error;
    }
  }

  /**
   * ゲームデータの移行
   */
  private async migrateGameData(): Promise<void> {
    try {
      // 新規ゲームデータを作成
      const newGameData: GameData = {
        userId: this.getCurrentUserId(),
        currentArea: "green-zone",
        defeatedCreatures: [],
        unlockedAreas: ["green-zone"],
        playerStats: {
          level: 1,
          hp: 100,
          mp: 50,
          xp: 0,
          attack: 20,
          defense: 15,
        },
        inventory: new Map(),
        lastUpdated: new Date(),
      };

      await dbManager.put(STORES.GAME_DATA, newGameData);
      console.log("🎮 新規ゲームデータを作成しました");
    } catch (error) {
      console.error("ゲームデータ移行エラー:", error);
      throw error;
    }
  }

  /**
   * レアリティをレベルにマッピング
   */
  private mapRarityToLevel(
    rarity: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (rarity) {
      case "common":
        return "beginner";
      case "uncommon":
      case "rare":
        return "intermediate";
      case "epic":
      case "legendary":
        return "advanced";
      default:
        return "beginner";
    }
  }

  /**
   * 現在のユーザーIDを取得
   */
  private getCurrentUserId(): string {
    // 実際の実装では、認証システムから取得
    return "user-123";
  }

  /**
   * 移行ステータスの取得
   */
  getStatus(): MigrationStatus {
    return { ...this.status };
  }

  /**
   * 移行が必要かチェック
   */
  async isMigrationNeeded(): Promise<boolean> {
    return await this.checkMigrationNeeded();
  }

  /**
   * イベントリスナーの追加
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * イベントリスナーの削除
   */
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * イベントの発生
   */
  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * リソースのクリーンアップ
   */
  dispose(): void {
    this.listeners.clear();
  }
}

// シングルトンインスタンス
export const dataMigrationService = new DataMigrationService();
