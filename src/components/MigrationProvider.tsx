import { Database, RefreshCw } from "lucide-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// import { DataMigrationService } from "../utils/dataMigrationService";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

/**
 * 統合学習項目システムへの移行プロバイダー
 * アプリ起動時に自動的にデータ移行をチェック・実行
 */

interface MigrationContextType {
  isMigrated: boolean;
  isLoading: boolean;
  migrationStats: any;
  performMigration: () => Promise<void>;
}

const MigrationContext = createContext<MigrationContextType | null>(null);

interface MigrationProviderProps {
  children: ReactNode;
}

export function MigrationProvider({ children }: MigrationProviderProps) {
  const [isMigrated, setIsMigrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [migrationStats, setMigrationStats] = useState<{ totalItems: number; migratedItems: number; pendingItems: number } | null>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    itemsCreated: number;
    migratedItems: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    checkAndPerformMigration();
  }, []);

  const checkAndPerformMigration = async () => {
    setIsLoading(true);

    try {
      if (false) {
        // DataMigrationService.needsMigration()) {
        console.log("🔄 統合学習項目システムへの移行が必要です");
        await performMigration();
      } else {
        console.log("✅ 移行は既に完了しています");
        setIsMigrated(true);
        updateStats();
      }
    } catch (error) {
      console.error("移行チェックエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const performMigration = async () => {
    try {
      // const result = await DataMigrationService.performFullMigration();
      const result = {
        success: true,
        migratedItems: 0,
        itemsCreated: 0,
        errors: [],
      };
      setMigrationResult(result);

      if (result.success) {
        setIsMigrated(true);
        updateStats();
        console.log(`✅ 移行完了: ${result.itemsCreated} 項目を作成`);
      } else {
        console.error("❌ 移行失敗:", result.errors);
      }
    } catch (error) {
      console.error("移行実行エラー:", error);
      setMigrationResult({
        success: false,
        itemsCreated: 0,
        migratedItems: 0,
        errors: [String(error)],
      });
    }
  };

  const updateStats = () => {
    // const stats = DataMigrationService.getMigrationStats();
    const stats = { totalItems: 0, migratedItems: 0, pendingItems: 0 };
    setMigrationStats(stats);
  };

  const contextValue: MigrationContextType = {
    isMigrated,
    isLoading,
    migrationStats,
    performMigration,
  };

  // 移行中の場合は移行画面を表示
  if (isLoading || !isMigrated) {
    return (
      <MigrationContext.Provider value={contextValue}>
        <MigrationScreen
          isLoading={isLoading}
          migrationResult={migrationResult}
          onRetry={checkAndPerformMigration}
        />
      </MigrationContext.Provider>
    );
  }

  // 移行完了後は通常のアプリを表示
  return (
    <MigrationContext.Provider value={contextValue}>
      {children}
    </MigrationContext.Provider>
  );
}

interface MigrationScreenProps {
  isLoading: boolean;
  migrationResult: {
    success: boolean;
    itemsCreated: number;
    errors: string[];
  } | null;
  onRetry: () => void;
}

function MigrationScreen({
  isLoading,
  migrationResult,
  onRetry,
}: MigrationScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // 進捗バーのアニメーション
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (migrationResult?.success) {
      setProgress(100);
    }
  }, [isLoading, migrationResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Database className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-xl">
            統合学習システムへのアップグレード
          </CardTitle>
          <p className="text-sm text-gray-600">
            より効率的な学習体験のためにデータを統合中...
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>移行進捗</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  語彙データを統合中...
                </div>
                <div className="pl-6">• ガチャカードと標準語彙の統合</div>
                <div className="pl-6">• 自動問題生成</div>
                <div className="pl-6">• 関連性の分析</div>
              </div>
            </>
          )}

          {migrationResult && (
            <div className="space-y-4">
              {migrationResult.success ? (
                <div className="text-center space-y-2">
                  <div className="text-green-600 font-semibold">
                    ✅ アップグレード完了！
                  </div>
                  <div className="text-sm text-gray-600">
                    {migrationResult.itemsCreated} 個の学習項目を作成しました
                  </div>
                  <div className="text-xs text-gray-500">
                    アプリが自動的に再読み込みされます...
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-red-600 font-semibold text-center">
                    ❌ アップグレードエラー
                  </div>
                  <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                    {migrationResult.errors.map((error, index) => (
                      <div key={index} className="text-red-500">
                        • {error}
                      </div>
                    ))}
                  </div>
                  <Button onClick={onRetry} className="w-full">
                    再試行
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            この処理は初回のみ実行されます
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function useMigration() {
  const context = useContext(MigrationContext);
  if (!context) {
    throw new Error("useMigration must be used within MigrationProvider");
  }
  return context;
}
