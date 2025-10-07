/**
 * 統合データ管理プロバイダー
 * IndexedDB、音声管理、データ同期を統合したプロバイダー
 */

import React, { createContext, ReactNode, useContext } from "react";
import { useDataManager, UseDataManagerReturn } from "../hooks/useDataManager";

// コンテキストの作成
const DataManagerContext = createContext<UseDataManagerReturn | null>(null);

// プロパティの型定義
interface DataManagerProviderProps {
  children: ReactNode;
}

// プロバイダーコンポーネント
export function DataManagerProvider({ children }: DataManagerProviderProps) {
  const dataManager = useDataManager();

  return (
    <DataManagerContext.Provider value={dataManager}>
      {children}
    </DataManagerContext.Provider>
  );
}

// カスタムフック
export function useDataManagerContext(): UseDataManagerReturn {
  const context = useContext(DataManagerContext);

  if (!context) {
    throw new Error(
      "useDataManagerContext must be used within a DataManagerProvider"
    );
  }

  return context;
}

// データ管理状態の表示コンポーネント
export function DataManagerStatus() {
  const {
    isInitialized,
    isOnline,
    syncStatus,
    // migrationStatus,
    vocabularyCount,
    grammarCount,
    listeningCount,
  } = useDataManagerContext();

  if (!isInitialized) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">データを初期化中...</span>
        </div>
      </div>
    );
  }

  if (false) {
    // migrationStatus.isRunning) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg max-w-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            <span className="text-yellow-800 font-medium">データ移行中...</span>
          </div>
          <div className="text-sm text-yellow-700">
            {/* {migrationStatus.currentStep} */}
            データ移行中...
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `50%` }}
            ></div>
          </div>
          <div className="text-xs text-yellow-600">
            {/* {migrationStatus.completedSteps} / {migrationStatus.totalSteps} 完了 */}
            移行準備中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg max-w-xs">
      <div className="space-y-2">
        {/* オンライン状態 */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {isOnline ? "オンライン" : "オフライン"}
          </span>
        </div>

        {/* データカウント */}
        <div className="text-xs text-gray-600 space-y-1">
          <div>語彙: {vocabularyCount} 項目</div>
          <div>文法: {grammarCount} 項目</div>
          <div>リスニング: {listeningCount} 項目</div>
        </div>

        {/* 同期状態 */}
        {syncStatus.isSyncing && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-xs text-blue-600">同期中...</span>
          </div>
        )}

        {syncStatus.lastSync && (
          <div className="text-xs text-gray-500">
            最終同期: {syncStatus.lastSync.toLocaleTimeString()}
          </div>
        )}

        {/* エラー表示 */}
        {syncStatus.errors.length > 0 && (
          <div className="text-xs text-red-600">
            同期エラー: {syncStatus.errors.length} 件
          </div>
        )}
      </div>
    </div>
  );
}

// データ管理パネルコンポーネント
export function DataManagerPanel() {
  const {
    isInitialized,
    isOnline,
    syncStatus,
    vocabularyCount,
    grammarCount,
    listeningCount,
    // userProgress,
    // gameData,
    forceSync,
    refreshData,
    cleanupCache,
    getStorageUsage,
  } = useDataManagerContext();

  const [storageUsage, setStorageUsage] = React.useState<{
    quota: number;
    usage: number;
    available: number;
  } | null>(null);

  React.useEffect(() => {
    getStorageUsage().then(setStorageUsage).catch(console.error);
  }, [getStorageUsage]);

  if (!isInitialized) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを初期化中...</p>
        </div>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">データ管理パネル</h3>

      <div className="space-y-4">
        {/* 接続状態 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">接続状態:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              {isOnline ? "オンライン" : "オフライン"}
            </span>
          </div>
        </div>

        {/* データカウント */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {vocabularyCount}
            </div>
            <div className="text-xs text-blue-600">語彙</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-2xl font-bold text-green-600">
              {grammarCount}
            </div>
            <div className="text-xs text-green-600">文法</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {listeningCount}
            </div>
            <div className="text-xs text-purple-600">リスニング</div>
          </div>
        </div>

        {/* ストレージ使用量 */}
        {storageUsage && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm font-medium mb-2">ストレージ使用量</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>使用済み:</span>
                <span>{formatBytes(storageUsage.usage)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>利用可能:</span>
                <span>{formatBytes(storageUsage.available)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (storageUsage.usage / storageUsage.quota) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 同期状態 */}
        <div className="bg-yellow-50 p-3 rounded">
          <div className="text-sm font-medium mb-2">同期状態</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  syncStatus.isSyncing
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="text-xs">
                {syncStatus.isSyncing ? "同期中..." : "同期完了"}
              </span>
            </div>
            {syncStatus.lastSync && (
              <div className="text-xs text-gray-600">
                最終同期: {syncStatus.lastSync.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex space-x-2">
          <button
            onClick={forceSync}
            disabled={!isOnline || syncStatus.isSyncing}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            同期実行
          </button>
          <button
            onClick={refreshData}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            データ更新
          </button>
          <button
            onClick={cleanupCache}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            キャッシュ削除
          </button>
        </div>
      </div>
    </div>
  );
}
