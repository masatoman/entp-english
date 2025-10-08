/**
 * 統合データ管理フック
 * IndexedDB、音声管理、データ同期を統合
 */

import { useCallback, useEffect, useState } from "react";
import { audioManager } from "../utils/AudioManager";
import { dataSyncManager, SyncStatus } from "../utils/DataSyncManager";
import {
  dbManager,
  GameData,
  STORES,
  UserProgress,
  VocabularyItem,
} from "../utils/IndexedDBManager";
// import {
//   dataMigrationService,
//   MigrationStatus,
// } from "../utils/DataMigrationService";

// データ管理の状態
export interface DataManagerState {
  isInitialized: boolean;
  isOnline: boolean;
  syncStatus: SyncStatus;
  // migrationStatus: MigrationStatus;
  vocabularyCount: number;
  grammarCount: number;
  listeningCount: number;
  userProgress: UserProgress | null;
  gameData: GameData | null;
}

// フィードバックデータ型
export interface FeedbackData {
  id: string;
  timestamp: Date;
  overallRating: number;
  category: string;
  specificRating: {
    design: number;
    usability: number;
    performance: number;
    content: number;
    gamification: number;
  };
  feedback: string;
  suggestions: string;
  bugs: string;
  deviceInfo: {
    userAgent: string;
    screenSize: string;
    platform: string;
  };
  userType: string;
  experience: string[];
}

// データ管理フック
export function useDataManager() {
  const [state, setState] = useState<DataManagerState>({
    isInitialized: false,
    isOnline: navigator.onLine,
    syncStatus: dataSyncManager.getStatus(),
    // migrationStatus: dataMigrationService.getStatus(),
    vocabularyCount: 0,
    grammarCount: 0,
    listeningCount: 0,
    userProgress: null,
    gameData: null,
  });

  // 初期化
  useEffect(() => {
    initializeDataManager();
  }, []);

  // 同期ステータスの監視
  useEffect(() => {
    const handleSyncStatusChange = () => {
      setState((prev) => ({
        ...prev,
        syncStatus: dataSyncManager.getStatus(),
      }));
    };

    dataSyncManager.on("syncStart", handleSyncStatusChange);
    dataSyncManager.on("syncEnd", handleSyncStatusChange);
    dataSyncManager.on("syncComplete", handleSyncStatusChange);
    dataSyncManager.on("syncError", handleSyncStatusChange);

    return () => {
      dataSyncManager.off("syncStart", handleSyncStatusChange);
      dataSyncManager.off("syncEnd", handleSyncStatusChange);
      dataSyncManager.off("syncComplete", handleSyncStatusChange);
      dataSyncManager.off("syncError", handleSyncStatusChange);
    };
  }, []);

  // 移行ステータスの監視（一時的に無効化）
  // useEffect(() => {
  //   const handleMigrationStatusChange = () => {
  //     setState((prev) => ({
  //       ...prev,
  //       migrationStatus: dataMigrationService.getStatus(),
  //     }));
  //   };

  //   dataMigrationService.on("migrationStart", handleMigrationStatusChange);
  //   dataMigrationService.on("migrationEnd", handleMigrationStatusChange);
  //   dataMigrationService.on("migrationComplete", handleMigrationStatusChange);
  //   dataMigrationService.on("migrationError", handleMigrationStatusChange);

  //   return () => {
  //     dataMigrationService.off("migrationStart", handleMigrationStatusChange);
  //     dataMigrationService.off("migrationEnd", handleMigrationStatusChange);
  //     dataMigrationService.off(
  //       "migrationComplete",
  //       handleMigrationStatusChange
  //     );
  //     dataMigrationService.off("migrationError", handleMigrationStatusChange);
  //   };
  // }, []);

  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // データマネージャーの初期化
  const initializeDataManager = useCallback(async () => {
    try {
      console.log("🔄 データマネージャーを初期化中...");

      // IndexedDBの初期化
      await dbManager.initialize();

      // 移行が必要かチェック（一時的に無効化）
      // const needsMigration = await dataMigrationService.isMigrationNeeded();

      // if (needsMigration) {
      //   console.log("🔄 データ移行を実行中...");
      //   await dataMigrationService.migrateData();
      // }

      // データカウントの取得
      const [vocabularyCount, grammarCount, listeningCount] = await Promise.all(
        [
          dbManager.count(STORES.VOCABULARY),
          dbManager.count(STORES.GRAMMAR),
          dbManager.count(STORES.LISTENING),
        ]
      );

      // ユーザー進捗の取得
      const userId = getCurrentUserId();
      const userProgress = userId
        ? (await dbManager.get<UserProgress>(STORES.USER_PROGRESS, userId)) ||
          null
        : null;

      // ゲームデータの取得
      const gameData = userId
        ? (await dbManager.get<GameData>(STORES.GAME_DATA, userId)) || null
        : null;

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        vocabularyCount,
        grammarCount,
        listeningCount,
        userProgress,
        gameData,
      }));

      console.log("✅ データマネージャーの初期化完了");
    } catch (error) {
      console.error("データマネージャー初期化エラー:", error);
      throw error;
    }
  }, []);

  // 語彙データの取得
  const getVocabularyData = useCallback(
    async (options?: {
      level?: "beginner" | "intermediate" | "advanced";
      category?: "toeic" | "daily";
      limit?: number;
    }) => {
      try {
        let vocabularyData: VocabularyItem[] = [];

        if (options?.level) {
          vocabularyData = await dbManager.getByIndex<VocabularyItem>(
            STORES.VOCABULARY,
            "level",
            options.level
          );
        } else if (options?.category) {
          vocabularyData = await dbManager.getByIndex<VocabularyItem>(
            STORES.VOCABULARY,
            "category",
            options.category
          );
        } else {
          vocabularyData = await dbManager.getAll<VocabularyItem>(
            STORES.VOCABULARY
          );
        }

        if (options?.limit) {
          vocabularyData = vocabularyData.slice(0, options.limit);
        }

        return vocabularyData;
      } catch (error) {
        console.error("語彙データ取得エラー:", error);
        throw error;
      }
    },
    []
  );

  // 語彙マスターレベルの更新
  const updateVocabularyMastery = useCallback(
    async (wordId: number, mastery: number) => {
      try {
        const userId = getCurrentUserId();
        if (!userId) return;

        const userProgress = await dbManager.get<UserProgress>(
          STORES.USER_PROGRESS,
          userId
        );

        if (userProgress) {
          userProgress.vocabularyMastery.set(wordId, mastery);
          userProgress.lastUpdated = new Date();

          await dbManager.put(STORES.USER_PROGRESS, userProgress);

          setState((prev) => ({
            ...prev,
            userProgress,
          }));
        }
      } catch (error) {
        console.error("語彙マスターレベル更新エラー:", error);
        throw error;
      }
    },
    []
  );

  // ゲームデータの更新
  const updateGameData = useCallback(async (updates: Partial<GameData>) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const gameData = await dbManager.get<GameData>(STORES.GAME_DATA, userId);

      if (gameData) {
        const updatedGameData: GameData = {
          ...gameData,
          ...updates,
          lastUpdated: new Date(),
        };

        await dbManager.put(STORES.GAME_DATA, updatedGameData);

        setState((prev) => ({
          ...prev,
          gameData: updatedGameData,
        }));
      }
    } catch (error) {
      console.error("ゲームデータ更新エラー:", error);
      throw error;
    }
  }, []);

  // 音声ファイルの読み込み
  const loadAudio = useCallback(async (audioInfo: string) => {
    try {
      await audioManager.loadAudio(audioInfo);
    } catch (error) {
      console.error("音声ファイル読み込みエラー:", error);
      throw error;
    }
  }, []);

  // 音声の再生
  const playAudio = useCallback(async (audioUrl?: string) => {
    try {
      if (audioUrl) {
        await audioManager.load(audioUrl);
      }
      await audioManager.play();
    } catch (error) {
      console.error("音声再生エラー:", error);
      throw error;
    }
  }, []);

  // 音声の一時停止
  const pauseAudio = useCallback(() => {
    audioManager.pause();
  }, []);

  // 音声の停止
  const stopAudio = useCallback(() => {
    audioManager.stop();
  }, []);

  // 手動同期
  const forceSync = useCallback(async () => {
    try {
      await dataSyncManager.forceSync();
    } catch (error) {
      console.error("手動同期エラー:", error);
      throw error;
    }
  }, []);

  // データの再読み込み
  const refreshData = useCallback(async () => {
    try {
      const [vocabularyCount, grammarCount, listeningCount] = await Promise.all(
        [
          dbManager.count(STORES.VOCABULARY),
          dbManager.count(STORES.GRAMMAR),
          dbManager.count(STORES.LISTENING),
        ]
      );

      const userId = getCurrentUserId();
      const userProgress = userId
        ? (await dbManager.get<UserProgress>(STORES.USER_PROGRESS, userId)) ||
          null
        : null;

      const gameData = userId
        ? (await dbManager.get<GameData>(STORES.GAME_DATA, userId)) || null
        : null;

      setState((prev) => ({
        ...prev,
        vocabularyCount,
        grammarCount,
        listeningCount,
        userProgress,
        gameData,
      }));
    } catch (error) {
      console.error("データ再読み込みエラー:", error);
      throw error;
    }
  }, []);

  // キャッシュのクリーンアップ
  const cleanupCache = useCallback(async () => {
    try {
      await dbManager.cleanupExpiredCache();
      await audioManager.cleanupAudioCache();
      console.log("✅ キャッシュクリーンアップ完了");
    } catch (error) {
      console.error("キャッシュクリーンアップエラー:", error);
      throw error;
    }
  }, []);

  // ストレージ使用量の取得
  const getStorageUsage = useCallback(async () => {
    try {
      return await dbManager.getStorageUsage();
    } catch (error) {
      console.error("ストレージ使用量取得エラー:", error);
      throw error;
    }
  }, []);

  // 現在のユーザーIDを取得
  const getCurrentUserId = (): string => {
    // 実際の実装では、認証システムから取得
    return "user-123";
  };

  // ユーザーフィードバックの保存
  const saveUserFeedback = useCallback(async (feedbackData: FeedbackData) => {
    try {
      console.log("📝 ユーザーフィードバック保存開始:", feedbackData.id);

      // IndexedDBにフィードバックを保存
      await dbManager.put(STORES.FEEDBACK, feedbackData);

      console.log("✅ ユーザーフィードバック保存完了:", feedbackData.id);

      // オンラインの場合はサーバーにも送信（将来実装）
      if (navigator.onLine) {
        console.log("🌐 フィードバックサーバー送信準備中...");
        // TODO: サーバーAPIへの送信実装
      }

      return feedbackData.id;
    } catch (error) {
      console.error("❌ ユーザーフィードバック保存エラー:", error);
      throw error;
    }
  }, []);

  // ユーザーフィードバックの取得
  const getUserFeedback = useCallback(async (userId?: string) => {
    try {
      console.log("📖 ユーザーフィードバック取得開始:", userId);

      // const _targetUserId = userId || getCurrentUserId();
      const feedback = await dbManager.getAll(STORES.FEEDBACK);

      console.log("✅ ユーザーフィードバック取得完了:", feedback.length, "件");
      return feedback as FeedbackData[];
    } catch (error) {
      console.error("❌ ユーザーフィードバック取得エラー:", error);
      throw error;
    }
  }, []);

  return {
    // 状態
    ...state,

    // データ操作
    getVocabularyData,
    updateVocabularyMastery,
    updateGameData,

    // 音声操作
    loadAudio,
    playAudio,
    pauseAudio,
    stopAudio,

    // 同期・管理
    forceSync,
    refreshData,
    cleanupCache,
    getStorageUsage,

    // フィードバック管理
    saveUserFeedback,
    getUserFeedback,

    // 初期化
    initializeDataManager,
  };
}

// 型エクスポート
export type UseDataManagerReturn = ReturnType<typeof useDataManager>;
