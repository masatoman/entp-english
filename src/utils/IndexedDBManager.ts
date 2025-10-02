/**
 * IndexedDBマネージャー
 * 大容量データと音声ファイルの管理基盤
 */

// データベース設定
const DB_NAME = "ENTPEnglishDB";
const DB_VERSION = 1;

// ストア定義
export const STORES = {
  VOCABULARY: "vocabulary",
  GRAMMAR: "grammar",
  LISTENING: "listening",
  LISTENING_PROGRESS: "listeningProgress",
  AUDIO_FILES: "audioFiles",
  USER_PROGRESS: "userProgress",
  ACHIEVEMENTS: "achievements",
  LISTENING_ACHIEVEMENTS: "listeningAchievements",
  GAME_DATA: "gameData",
  CACHE: "cache",
} as const;

// データ型定義
export interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: "beginner" | "intermediate" | "advanced";
  category?: "toeic" | "daily";
  audioUrl?: string;
  lastStudied?: Date;
  mastery?: number; // 0-100
}

export interface AudioFile {
  id: string;
  url: string;
  blob: Blob;
  size: number;
  mimeType: string;
  duration?: number;
  lastAccessed: Date;
}

export interface UserProgress {
  userId: string;
  vocabularyMastery: Map<number, number>; // wordId -> mastery level
  grammarProgress: Map<string, number>; // category -> progress
  listeningProgress: Map<string, number>; // part -> progress
  lastUpdated: Date;
}

export interface GameData {
  userId: string;
  currentArea: string;
  defeatedCreatures: string[];
  unlockedAreas: string[];
  playerStats: {
    level: number;
    hp: number;
    mp: number;
    xp: number;
    attack: number;
    defense: number;
  };
  inventory: Map<string, number>; // itemId -> quantity
  lastUpdated: Date;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: Date;
  expiresAt?: Date;
}

// IndexedDBマネージャークラス
export class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  /**
   * データベースの初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("IndexedDB initialization failed:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log("✅ IndexedDB initialized successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  /**
   * ストアの作成
   */
  private createStores(db: IDBDatabase): void {
    // 語彙データストア
    if (!db.objectStoreNames.contains(STORES.VOCABULARY)) {
      const vocabularyStore = db.createObjectStore(STORES.VOCABULARY, {
        keyPath: "id",
      });
      vocabularyStore.createIndex("level", "level", { unique: false });
      vocabularyStore.createIndex("category", "category", { unique: false });
      vocabularyStore.createIndex("lastStudied", "lastStudied", {
        unique: false,
      });
    }

    // 文法データストア
    if (!db.objectStoreNames.contains(STORES.GRAMMAR)) {
      const grammarStore = db.createObjectStore(STORES.GRAMMAR, {
        keyPath: "id",
      });
      grammarStore.createIndex("category", "category", { unique: false });
      grammarStore.createIndex("difficulty", "difficulty", { unique: false });
    }

    // リスニングデータストア
    if (!db.objectStoreNames.contains(STORES.LISTENING)) {
      const listeningStore = db.createObjectStore(STORES.LISTENING, {
        keyPath: "id",
      });
      listeningStore.createIndex("part", "part", { unique: false });
      listeningStore.createIndex("difficulty", "difficulty", { unique: false });
    }

    // 音声ファイルストア
    if (!db.objectStoreNames.contains(STORES.AUDIO_FILES)) {
      const audioStore = db.createObjectStore(STORES.AUDIO_FILES, {
        keyPath: "id",
      });
      audioStore.createIndex("url", "url", { unique: true });
      audioStore.createIndex("lastAccessed", "lastAccessed", { unique: false });
    }

    // リスニング進捗ストア
    if (!db.objectStoreNames.contains(STORES.LISTENING_PROGRESS)) {
      const listeningProgressStore = db.createObjectStore(
        STORES.LISTENING_PROGRESS,
        {
          keyPath: "id",
        }
      );
      listeningProgressStore.createIndex("userId", "userId", { unique: false });
      listeningProgressStore.createIndex("sessionId", "sessionId", {
        unique: true,
      });
      listeningProgressStore.createIndex("part", "part", { unique: false });
      listeningProgressStore.createIndex("difficulty", "difficulty", {
        unique: false,
      });
      listeningProgressStore.createIndex("completedAt", "completedAt", {
        unique: false,
      });
    }

    // リスニングアチーブメントストア
    if (!db.objectStoreNames.contains(STORES.LISTENING_ACHIEVEMENTS)) {
      const listeningAchievementStore = db.createObjectStore(
        STORES.LISTENING_ACHIEVEMENTS,
        {
          keyPath: "id",
        }
      );
      listeningAchievementStore.createIndex("userId", "userId", {
        unique: false,
      });
      listeningAchievementStore.createIndex("achievementId", "achievementId", {
        unique: false,
      });
      listeningAchievementStore.createIndex("isCompleted", "isCompleted", {
        unique: false,
      });
      listeningAchievementStore.createIndex("completedAt", "completedAt", {
        unique: false,
      });
    }

    // ユーザー進捗ストア
    if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
      db.createObjectStore(STORES.USER_PROGRESS, {
        keyPath: "userId",
      });
    }

    // 実績データストア
    if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
      const achievementStore = db.createObjectStore(STORES.ACHIEVEMENTS, {
        keyPath: "id",
      });
      achievementStore.createIndex("category", "category", { unique: false });
      achievementStore.createIndex("rarity", "rarity", { unique: false });
    }

    // ゲームデータストア
    if (!db.objectStoreNames.contains(STORES.GAME_DATA)) {
      db.createObjectStore(STORES.GAME_DATA, {
        keyPath: "userId",
      });
    }

    // キャッシュストア
    if (!db.objectStoreNames.contains(STORES.CACHE)) {
      const cacheStore = db.createObjectStore(STORES.CACHE, {
        keyPath: "key",
      });
      cacheStore.createIndex("timestamp", "timestamp", { unique: false });
      cacheStore.createIndex("expiresAt", "expiresAt", { unique: false });
    }
  }

  /**
   * データの追加・更新
   */
  async put<T>(storeName: string, data: T): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * データの取得
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * データの削除
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 全データの取得
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * インデックスによる検索
   */
  async getByIndex<T>(
    storeName: string,
    indexName: string,
    value: any
  ): Promise<T[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 範囲検索
   */
  async getByRange<T>(
    storeName: string,
    indexName: string,
    range: IDBKeyRange
  ): Promise<T[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * カウント取得
   */
  async count(storeName: string): Promise<number> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * バッチ操作
   */
  async batchPut<T>(storeName: string, dataArray: T[]): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      let completed = 0;
      const total = dataArray.length;

      if (total === 0) {
        resolve();
        return;
      }

      dataArray.forEach((data) => {
        const request = store.put(data);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  /**
   * データベースのクリア
   */
  async clear(storeName: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 音声ファイルの保存
   */
  async saveAudioFile(id: string, url: string, blob: Blob): Promise<void> {
    const audioFile: AudioFile = {
      id,
      url,
      blob,
      size: blob.size,
      mimeType: blob.type,
      lastAccessed: new Date(),
    };

    await this.put(STORES.AUDIO_FILES, audioFile);
  }

  /**
   * 音声ファイルの取得
   */
  async getAudioFile(id: string): Promise<AudioFile | undefined> {
    const audioFile = await this.get<AudioFile>(STORES.AUDIO_FILES, id);

    if (audioFile) {
      // 最終アクセス時間を更新
      audioFile.lastAccessed = new Date();
      await this.put(STORES.AUDIO_FILES, audioFile);
    }

    return audioFile;
  }

  /**
   * キャッシュの保存
   */
  async setCache(key: string, data: any, ttlMinutes?: number): Promise<void> {
    const expiresAt = ttlMinutes
      ? new Date(Date.now() + ttlMinutes * 60 * 1000)
      : undefined;

    const cacheEntry: CacheEntry = {
      key,
      data,
      timestamp: new Date(),
      expiresAt,
    };

    await this.put(STORES.CACHE, cacheEntry);
  }

  /**
   * キャッシュの取得
   */
  async getCache<T>(key: string): Promise<T | undefined> {
    const cacheEntry = await this.get<CacheEntry>(STORES.CACHE, key);

    if (!cacheEntry) {
      return undefined;
    }

    // 有効期限チェック
    if (cacheEntry.expiresAt && new Date() > cacheEntry.expiresAt) {
      await this.delete(STORES.CACHE, key);
      return undefined;
    }

    return cacheEntry.data as T;
  }

  /**
   * 期限切れキャッシュのクリーンアップ
   */
  async cleanupExpiredCache(): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.CACHE], "readwrite");
      const store = transaction.objectStore(STORES.CACHE);
      const index = store.index("expiresAt");
      const range = IDBKeyRange.upperBound(new Date());
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * ストレージ使用量の取得
   */
  async getStorageUsage(): Promise<{
    quota: number;
    usage: number;
    available: number;
  }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
      };
    }

    return {
      quota: 0,
      usage: 0,
      available: 0,
    };
  }

  /**
   * 初期化確認
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * データベースのクローズ
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

// シングルトンインスタンス
export const dbManager = new IndexedDBManager();

// 初期化の実行
dbManager.initialize().catch(console.error);
