/**
 * データ同期マネージャー
 * サーバーとIndexedDB間のデータ同期
 */

import {
  dbManager,
  GameData,
  STORES,
  UserProgress,
  VocabularyItem,
} from "./IndexedDBManager";

// 同期設定
interface SyncConfig {
  vocabulary: boolean;
  grammar: boolean;
  listening: boolean;
  achievements: boolean;
  userProgress: boolean;
  gameData: boolean;
}

// 同期ステータス
export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  errors: string[];
}

// 同期マネージャークラス
export class DataSyncManager {
  private config: SyncConfig = {
    vocabulary: true,
    grammar: true,
    listening: true,
    achievements: true,
    userProgress: true,
    gameData: true,
  };

  private status: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    errors: [],
  };

  private listeners: Map<string, Function[]> = new Map();
  // private syncQueue: string[] = []; // 将来の拡張用

  constructor() {
    this.setupEventListeners();
    this.startPeriodicSync();
  }

  /**
   * イベントリスナーの設定
   */
  private setupEventListeners(): void {
    // オンライン状態の監視
    window.addEventListener("online", () => {
      this.status.isOnline = true;
      this.emit("online");
      this.syncAll();
    });

    window.addEventListener("offline", () => {
      this.status.isOnline = false;
      this.emit("offline");
    });

    // ページの可視性変更
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.status.isOnline) {
        this.syncAll();
      }
    });
  }

  /**
   * 定期同期の開始
   */
  private startPeriodicSync(): void {
    // 5分ごとに同期
    setInterval(() => {
      if (this.status.isOnline && !this.status.isSyncing) {
        this.syncAll();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * 全データの同期
   */
  async syncAll(): Promise<void> {
    if (this.status.isSyncing || !this.status.isOnline) {
      return;
    }

    this.status.isSyncing = true;
    this.emit("syncStart");

    try {
      const syncPromises: Promise<void>[] = [];

      if (this.config.vocabulary) {
        syncPromises.push(this.syncVocabulary());
      }

      if (this.config.grammar) {
        syncPromises.push(this.syncGrammar());
      }

      if (this.config.listening) {
        syncPromises.push(this.syncListening());
      }

      if (this.config.achievements) {
        syncPromises.push(this.syncAchievements());
      }

      if (this.config.userProgress) {
        syncPromises.push(this.syncUserProgress());
      }

      if (this.config.gameData) {
        syncPromises.push(this.syncGameData());
      }

      await Promise.all(syncPromises);

      this.status.lastSync = new Date();
      this.status.errors = [];
      this.emit("syncComplete", { lastSync: this.status.lastSync });
    } catch (error) {
      console.error("Sync failed:", error);
      this.status.errors.push(
        error instanceof Error ? error.message : "Unknown error"
      );
      this.emit("syncError", { error });
    } finally {
      this.status.isSyncing = false;
      this.emit("syncEnd");
    }
  }

  /**
   * 語彙データの同期
   */
  private async syncVocabulary(): Promise<void> {
    try {
      // ローカルの変更をチェック
      const localVocabulary = await dbManager.getAll<VocabularyItem>(
        STORES.VOCABULARY
      );

      // サーバーから最新データを取得
      const serverVocabulary = await this.fetchFromServer("/api/vocabulary");

      // マージ処理
      const mergedData = this.mergeVocabularyData(
        localVocabulary,
        serverVocabulary
      );

      // ローカルに保存
      await dbManager.batchPut(STORES.VOCABULARY, mergedData);

      console.log(`✅ Vocabulary synced: ${mergedData.length} items`);
    } catch (error) {
      console.error("Vocabulary sync failed:", error);
      throw error;
    }
  }

  /**
   * 文法データの同期
   */
  private async syncGrammar(): Promise<void> {
    try {
      const serverGrammar = await this.fetchFromServer("/api/grammar");
      await dbManager.batchPut(STORES.GRAMMAR, serverGrammar);

      console.log(`✅ Grammar synced: ${serverGrammar.length} items`);
    } catch (error) {
      console.error("Grammar sync failed:", error);
      throw error;
    }
  }

  /**
   * リスニングデータの同期
   */
  private async syncListening(): Promise<void> {
    try {
      const serverListening = await this.fetchFromServer("/api/listening");
      await dbManager.batchPut(STORES.LISTENING, serverListening);

      console.log(`✅ Listening synced: ${serverListening.length} items`);
    } catch (error) {
      console.error("Listening sync failed:", error);
      throw error;
    }
  }

  /**
   * 実績データの同期
   */
  private async syncAchievements(): Promise<void> {
    try {
      const serverAchievements = await this.fetchFromServer(
        "/api/achievements"
      );
      await dbManager.batchPut(STORES.ACHIEVEMENTS, serverAchievements);

      console.log(`✅ Achievements synced: ${serverAchievements.length} items`);
    } catch (error) {
      console.error("Achievements sync failed:", error);
      throw error;
    }
  }

  /**
   * ユーザー進捗の同期
   */
  private async syncUserProgress(): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return;

      // ローカルの進捗を取得
      const localProgress = await dbManager.get<UserProgress>(
        STORES.USER_PROGRESS,
        userId
      );

      // サーバーに送信
      await this.sendToServer("/api/user-progress", localProgress);

      // サーバーから最新データを取得
      const serverProgress = await this.fetchFromServer(
        `/api/user-progress/${userId}`
      );

      if (serverProgress) {
        await dbManager.put(STORES.USER_PROGRESS, serverProgress);
      }

      console.log("✅ User progress synced");
    } catch (error) {
      console.error("User progress sync failed:", error);
      throw error;
    }
  }

  /**
   * ゲームデータの同期
   */
  private async syncGameData(): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return;

      const localGameData = await dbManager.get<GameData>(
        STORES.GAME_DATA,
        userId
      );

      // サーバーに送信
      await this.sendToServer("/api/game-data", localGameData);

      // サーバーから最新データを取得
      const serverGameData = await this.fetchFromServer(
        `/api/game-data/${userId}`
      );

      if (serverGameData) {
        await dbManager.put(STORES.GAME_DATA, serverGameData);
      }

      console.log("✅ Game data synced");
    } catch (error) {
      console.error("Game data sync failed:", error);
      throw error;
    }
  }

  /**
   * 語彙データのマージ処理
   */
  private mergeVocabularyData(
    local: VocabularyItem[],
    server: VocabularyItem[]
  ): VocabularyItem[] {
    const merged = new Map<number, VocabularyItem>();

    // サーバーデータをベースに
    server.forEach((item) => {
      merged.set(item.id, item);
    });

    // ローカルの変更を適用
    local.forEach((localItem) => {
      const serverItem = merged.get(localItem.id);

      if (serverItem) {
        // ローカルの学習進捗を優先
        merged.set(localItem.id, {
          ...serverItem,
          lastStudied: localItem.lastStudied,
          mastery: localItem.mastery,
        });
      } else {
        // 新規アイテム
        merged.set(localItem.id, localItem);
      }
    });

    return Array.from(merged.values());
  }

  /**
   * サーバーからのデータ取得
   */
  private async fetchFromServer(endpoint: string): Promise<any> {
    // モック実装（実際のAPIエンドポイントに置き換え）
    console.log(`📡 Fetching from server: ${endpoint}`);

    // 実際の実装では、fetch APIを使用
    // const response = await fetch(endpoint);
    // if (!response.ok) {
    //   throw new Error(`Server error: ${response.statusText}`);
    // }
    // return await response.json();

    // モックデータを返す
    return this.getMockData(endpoint);
  }

  /**
   * サーバーへのデータ送信
   */
  private async sendToServer(endpoint: string, data: any): Promise<void> {
    // モック実装（実際のAPIエンドポイントに置き換え）
    console.log(`📤 Sending to server: ${endpoint}`, data);

    // 実際の実装では、fetch APIを使用
    // const response = await fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Server error: ${response.statusText}`);
    // }
  }

  /**
   * モックデータの取得
   */
  private getMockData(endpoint: string): any {
    switch (endpoint) {
      case "/api/vocabulary":
        return [
          {
            id: 1,
            word: "example",
            meaning: "例",
            partOfSpeech: "名詞",
            example: "This is an example.",
            exampleTranslation: "これは例です。",
            level: "beginner",
            category: "daily",
          },
        ];

      case "/api/grammar":
        return [];

      case "/api/listening":
        return [];

      case "/api/achievements":
        return [];

      default:
        return null;
    }
  }

  /**
   * 現在のユーザーIDを取得
   */
  private getCurrentUserId(): string | null {
    // 実際の実装では、認証システムから取得
    return "user-123";
  }

  /**
   * 同期設定の更新
   */
  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit("configUpdated", this.config);
  }

  /**
   * 同期状態の取得
   */
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * 手動同期の実行
   */
  async forceSync(): Promise<void> {
    console.log("🔄 Force sync requested");
    await this.syncAll();
  }

  /**
   * オフライン時のデータ取得
   */
  async getOfflineData<T>(
    storeName: string,
    key?: IDBValidKey
  ): Promise<T | T[] | undefined> {
    if (key !== undefined) {
      return await dbManager.get<T>(storeName, key);
    } else {
      return await dbManager.getAll<T>(storeName);
    }
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
export const dataSyncManager = new DataSyncManager();
