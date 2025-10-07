/**
 * パフォーマンスベンチマークシステム
 * システム全体のパフォーマンスを定量的に測定・評価
 */

import { handleError } from "./errorHandler";
import { logInfo, logPerformance } from "./logger";

export interface BenchmarkResult {
  testName: string;
  duration: number; // ms
  memoryUsage: number; // bytes
  success: boolean;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  standardDeviation: number;
}

export interface SystemBenchmark {
  timestamp: string;
  environment: "development" | "production";
  browserInfo: {
    userAgent: string;
    memory?: any;
    connection?: any;
  };
  results: BenchmarkResult[];
  overallScore: number;
  recommendations: string[];
}

export class PerformanceBenchmark {
  private static results: BenchmarkResult[] = [];
  private static readonly BENCHMARK_KEY = "entp-performance-benchmark";

  /**
   * 包括的なシステムベンチマークを実行
   */
  static async runComprehensiveBenchmark(): Promise<SystemBenchmark> {
    try {
      logInfo("包括的パフォーマンスベンチマーク開始");

      this.results = [];

      // 各システムのベンチマーク実行
      await this.benchmarkDataOperations();
      await this.benchmarkLearningOperations();
      await this.benchmarkUIOperations();
      await this.benchmarkMemoryOperations();

      // 全体スコア計算
      const overallScore = this.calculateOverallScore();

      // 推奨事項生成
      const recommendations = this.generateRecommendations();

      const benchmark: SystemBenchmark = {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.DEV ? "development" : "production",
        browserInfo: this.getBrowserInfo(),
        results: [...this.results],
        overallScore,
        recommendations,
      };

      this.saveBenchmark(benchmark);

      logPerformance("ベンチマーク完了", {
        testsRun: this.results.length,
        overallScore,
        recommendationCount: recommendations.length,
      });

      return benchmark;
    } catch (error) {
      handleError(error as Error, {
        component: "PerformanceBenchmark",
        action: "run-comprehensive-benchmark",
      });
      return this.getEmptyBenchmark();
    }
  }

  /**
   * データ操作のベンチマーク
   */
  private static async benchmarkDataOperations(): Promise<void> {
    // LocalStorage読み書きテスト
    await this.runBenchmark("LocalStorage読み込み", 100, () => {
      localStorage.getItem("test-key");
    });

    await this.runBenchmark("LocalStorage書き込み", 100, () => {
      localStorage.setItem(
        "test-key",
        JSON.stringify({ test: "data", timestamp: Date.now() })
      );
    });

    // JSON解析テスト
    const largeData = Array(1000)
      .fill(null)
      .map((_, i) => ({ id: i, data: `test-${i}` }));
    const jsonString = JSON.stringify(largeData);

    await this.runBenchmark("JSON解析", 50, () => {
      JSON.parse(jsonString);
    });

    await this.runBenchmark("JSON文字列化", 50, () => {
      JSON.stringify(largeData);
    });
  }

  /**
   * 学習操作のベンチマーク
   */
  private static async benchmarkLearningOperations(): Promise<void> {
    const { PersonalizedLearningSystem } = await import(
      "./personalizedLearning"
    );
    const { AdaptiveDifficultySystem } = await import("./adaptiveDifficulty");
    const { WeaknessAnalyzer } = await import("./weaknessAnalyzer");

    // 個人化推奨の生成テスト
    const testItems = Array(100)
      .fill(null)
      .map((_, i) => ({
        id: `item-${i}`,
        type: "vocabulary" as const,
        content: `word-${i}`,
        meaning: `意味-${i}`,
        category: "test",
        level: "intermediate" as const,
        examples: [],
        explanations: [],
        questions: [],
        relations: [],
        source: "standard" as const,
        tags: ["test"],
        difficulty: 50 + (i % 30),
        importance: 60 + (i % 40),
        frequency: 55 + (i % 35),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    await this.runBenchmark("個人化推奨生成", 20, () => {
      PersonalizedLearningSystem.recommendContent(
        "test-user",
        testItems,
        "mixed",
        10
      );
    });

    // 適応的難易度計算テスト
    const testSession = AdaptiveDifficultySystem.startAdaptiveSession(
      "test-user",
      50,
      75
    );
    testSession.questions = Array(10)
      .fill(null)
      .map((_, i) => ({
        questionId: `q-${i}`,
        difficulty: 50,
        timeToAnswer: 10 + Math.random() * 5,
        isCorrect: Math.random() > 0.3,
        confidence: 60 + Math.random() * 30,
        timestamp: new Date().toISOString(),
      }));

    await this.runBenchmark("適応的難易度計算", 50, () => {
      AdaptiveDifficultySystem.calculatePerformanceMetrics(testSession);
    });

    // 弱点分析テスト
    const testSessions = Array(50)
      .fill(null)
      .map((_, i) => ({
        category: ["grammar", "vocabulary"][i % 2],
        isCorrect: Math.random() > 0.4,
        timestamp: Date.now() - i * 60000,
        score: 60 + Math.random() * 30,
      }));

    await this.runBenchmark("弱点分析実行", 10, () => {
      WeaknessAnalyzer.performComprehensiveAnalysis(
        "test-user",
        DataManager.getUserStats(),
        testSessions
      );
    });
  }

  /**
   * UI操作のベンチマーク
   */
  private static async benchmarkUIOperations(): Promise<void> {
    // DOM操作テスト
    await this.runBenchmark("DOM要素作成", 1000, () => {
      const element = document.createElement("div");
      element.className = "test-element";
      element.textContent = "Test content";
    });

    await this.runBenchmark("DOM要素検索", 500, () => {
      document.querySelectorAll(".test-element");
    });

    // CSS操作テスト
    await this.runBenchmark("CSS操作", 200, () => {
      const element = document.createElement("div");
      element.style.backgroundColor = "red";
      element.style.width = "100px";
      element.style.height = "100px";
    });
  }

  /**
   * メモリ操作のベンチマーク
   */
  private static async benchmarkMemoryOperations(): Promise<void> {
    // 大量データ処理テスト
    await this.runBenchmark("大量配列処理", 20, () => {
      const largeArray = Array(10000)
        .fill(null)
        .map((_, i) => ({ id: i, value: Math.random() }));
      largeArray
        .filter((item) => item.value > 0.5)
        .map((item) => ({ ...item, processed: true }));
    });

    // 文字列処理テスト
    await this.runBenchmark("文字列操作", 100, () => {
      const longString = "test ".repeat(1000);
      longString.split(" ").join("-").toUpperCase();
    });

    // オブジェクト操作テスト
    await this.runBenchmark("オブジェクト操作", 100, () => {
      const obj = { a: 1, b: 2, c: 3 };
      const cloned = JSON.parse(JSON.stringify(obj));
      Object.assign(cloned, { d: 4, e: 5 });
    });
  }

  /**
   * 個別ベンチマークの実行
   */
  private static async runBenchmark(
    testName: string,
    iterations: number,
    operation: () => void
  ): Promise<BenchmarkResult> {
    const times: number[] = [];
    let success = true;
    let memoryBefore = 0;
    let memoryAfter = 0;

    try {
      // メモリ使用量測定（可能な場合）
      if ("memory" in performance) {
        memoryBefore = (performance as any).memory.usedJSHeapSize;
      }

      // ベンチマーク実行
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();

        try {
          operation();
        } catch (error) {
          success = false;
          handleError(error as Error, {
            component: "PerformanceBenchmark",
            testName,
            iteration: i,
          });
        }

        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      // メモリ使用量測定（終了後）
      if ("memory" in performance) {
        memoryAfter = (performance as any).memory.usedJSHeapSize;
      }

      // 統計計算
      const duration = times.reduce((sum, time) => sum + time, 0);
      const averageTime = duration / iterations;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const variance =
        times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) /
        iterations;
      const standardDeviation = Math.sqrt(variance);

      const result: BenchmarkResult = {
        testName,
        duration,
        memoryUsage: memoryAfter - memoryBefore,
        success,
        iterations,
        averageTime,
        minTime,
        maxTime,
        standardDeviation,
      };

      this.results.push(result);

      logPerformance(`ベンチマーク完了: ${testName}`, {
        averageTime: averageTime.toFixed(2),
        iterations,
        success,
      });

      return result;
    } catch (error) {
      handleError(error as Error, {
        component: "PerformanceBenchmark",
        testName,
      });

      const failedResult: BenchmarkResult = {
        testName,
        duration: 0,
        memoryUsage: 0,
        success: false,
        iterations: 0,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        standardDeviation: 0,
      };

      this.results.push(failedResult);
      return failedResult;
    }
  }

  /**
   * 全体スコアの計算
   */
  private static calculateOverallScore(): number {
    if (this.results.length === 0) return 0;

    let score = 100;

    // 成功率による評価
    const successRate =
      this.results.filter((r) => r.success).length / this.results.length;
    score *= successRate;

    // パフォーマンスによる評価
    const avgTime =
      this.results.reduce((sum, r) => sum + r.averageTime, 0) /
      this.results.length;
    if (avgTime > 100) score *= 0.8; // 100ms超で減点
    if (avgTime > 500) score *= 0.6; // 500ms超で大幅減点

    // メモリ使用量による評価
    const totalMemory = this.results.reduce(
      (sum, r) => sum + Math.abs(r.memoryUsage),
      0
    );
    if (totalMemory > 10000000) score *= 0.9; // 10MB超で減点

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * 推奨事項の生成
   */
  private static generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // 失敗したテストのチェック
    const failedTests = this.results.filter((r) => !r.success);
    if (failedTests.length > 0) {
      recommendations.push(
        `${failedTests.length}個のテストが失敗しました。コードの見直しが必要です。`
      );
    }

    // 平均時間のチェック
    const slowTests = this.results.filter((r) => r.averageTime > 50);
    if (slowTests.length > 0) {
      recommendations.push(
        `${slowTests.length}個のテストが遅いです。最適化を検討してください。`
      );
    }

    // メモリ使用量のチェック
    const memoryHeavyTests = this.results.filter(
      (r) => Math.abs(r.memoryUsage) > 1000000
    );
    if (memoryHeavyTests.length > 0) {
      recommendations.push(
        `${memoryHeavyTests.length}個のテストでメモリ使用量が多いです。メモリ最適化を検討してください。`
      );
    }

    // 安定性のチェック
    const unstableTests = this.results.filter(
      (r) => r.standardDeviation > r.averageTime * 0.5
    );
    if (unstableTests.length > 0) {
      recommendations.push(
        `${unstableTests.length}個のテストで実行時間が不安定です。一貫性の改善が必要です。`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("全てのパフォーマンステストが良好です！");
    }

    return recommendations;
  }

  /**
   * 特定機能のベンチマーク
   */
  static async benchmarkSpecificFeature(
    featureName: string,
    operation: () => Promise<void> | void,
    iterations: number = 10
  ): Promise<BenchmarkResult> {
    logInfo(`個別ベンチマーク開始: ${featureName}`);

    return this.runBenchmark(featureName, iterations, () => {
      const result = operation();
      if (result instanceof Promise) {
        return result;
      }
    });
  }

  /**
   * リアルタイムパフォーマンス監視
   */
  static startRealTimeMonitoring(intervalMs: number = 5000): () => void {
    let monitoringActive = true;

    const monitor = async () => {
      while (monitoringActive) {
        try {
          const metrics = this.collectRealTimeMetrics();
          this.logRealTimeMetrics(metrics);

          await new Promise((resolve) => setTimeout(resolve, intervalMs));
        } catch (error) {
          handleError(error as Error, {
            component: "PerformanceBenchmark",
            action: "real-time-monitoring",
          });
        }
      }
    };

    monitor();

    return () => {
      monitoringActive = false;
      logInfo("リアルタイム監視を停止");
    };
  }

  /**
   * ベンチマーク結果の比較
   */
  static compareBenchmarks(
    current: SystemBenchmark,
    previous: SystemBenchmark
  ): {
    improvements: string[];
    regressions: string[];
    overallChange: number;
  } {
    const improvements: string[] = [];
    const regressions: string[] = [];

    current.results.forEach((currentResult) => {
      const previousResult = previous.results.find(
        (r) => r.testName === currentResult.testName
      );

      if (previousResult) {
        const improvement =
          ((previousResult.averageTime - currentResult.averageTime) /
            previousResult.averageTime) *
0;

        if (improvement > 10) {
          improvements.push(
            `${currentResult.testName}: ${improvement.toFixed(1)}% 改善`
          );
        } else if (improvement < -10) {
          regressions.push(
            `${currentResult.testName}: ${Math.abs(improvement).toFixed(
              1
            )}% 悪化`
          );
        }
      }
    });

    const overallChange = current.overallScore - previous.overallScore;

    return {
      improvements,
      regressions,
      overallChange,
    };
  }

  /**
   * パフォーマンスレポートの生成
   */
  static generatePerformanceReport(benchmark: SystemBenchmark): string {
    const report = [
      `# パフォーマンスレポート`,
      `**実行日時**: ${new Date(benchmark.timestamp).toLocaleString()}`,
      `**環境**: ${benchmark.environment}`,
      `**全体スコア**: ${benchmark.overallScore}/100`,
      ``,
      `## テスト結果`,
      ``,
    ];

    benchmark.results.forEach((result) => {
      report.push(`### ${result.testName}`);
      report.push(`- **成功**: ${result.success ? "✅" : "❌"}`);
      report.push(`- **平均時間**: ${result.averageTime.toFixed(2)}ms`);
      report.push(`- **最小時間**: ${result.minTime.toFixed(2)}ms`);
      report.push(`- **最大時間**: ${result.maxTime.toFixed(2)}ms`);
      report.push(`- **標準偏差**: ${result.standardDeviation.toFixed(2)}ms`);
      report.push(
        `- **メモリ使用**: ${(result.memoryUsage / 1024).toFixed(2)}KB`
      );
      report.push(``);
    });

    report.push(`## 推奨事項`);
    benchmark.recommendations.forEach((rec) => {
      report.push(`- ${rec}`);
    });

    return report.join("\n");
  }

  /**
   * リアルタイムメトリクス収集
   */
  private static collectRealTimeMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};

    // メモリ情報
    if ("memory" in performance) {
      const memInfo = (performance as any).memory;
      metrics.memoryUsed = memInfo.usedJSHeapSize;
      metrics.memoryTotal = memInfo.totalJSHeapSize;
      metrics.memoryLimit = memInfo.jsHeapSizeLimit;
      metrics.memoryUsagePercent =
        (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
    }

    // ナビゲーション情報
    const navEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      metrics.domContentLoaded =
        nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
      metrics.loadComplete = nav.loadEventEnd - nav.loadEventStart;
    }

    // リソース情報
    const resourceEntries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    if (resourceEntries.length > 0) {
      const totalTransferSize = resourceEntries.reduce(
        (sum, entry) => sum + (entry.transferSize || 0),
        0
      );
      metrics.totalResourceSize = totalTransferSize;
      metrics.resourceCount = resourceEntries.length;
    }

    return metrics;
  }

  /**
   * リアルタイムメトリクスのログ出力
   */
  private static logRealTimeMetrics(metrics: Record<string, number>): void {
    logPerformance("リアルタイムメトリクス", metrics);

    // 警告レベルのチェック
    if (metrics.memoryUsagePercent > 80) {
      logPerformance("⚠️ メモリ使用量が80%を超えています", {
        usage: metrics.memoryUsagePercent,
      });
    }

    if (metrics.domContentLoaded > 1000) {
      logPerformance("⚠️ DOM読み込みが1秒を超えています", {
        time: metrics.domContentLoaded,
      });
    }
  }

  /**
   * ブラウザ情報の取得
   */
  private static getBrowserInfo(): SystemBenchmark["browserInfo"] {
    const info: SystemBenchmark["browserInfo"] = {
      userAgent: navigator.userAgent,
    };

    if ("memory" in performance) {
      info.memory = (performance as any).memory;
    }

    if ("connection" in navigator) {
      info.connection = (navigator as any).connection;
    }

    return info;
  }

  /**
   * ベンチマーク結果の保存
   */
  private static saveBenchmark(benchmark: SystemBenchmark): void {
    try {
      const stored = localStorage.getItem(this.BENCHMARK_KEY);
      const benchmarks: SystemBenchmark[] = stored ? JSON.parse(stored) : [];

      benchmarks.push(benchmark);

      // 最新10件のみ保持
      if (benchmarks.length > 10) {
        benchmarks.splice(0, benchmarks.length - 10);
      }

      localStorage.setItem(this.BENCHMARK_KEY, JSON.stringify(benchmarks));
    } catch (error) {
      handleError(error as Error, {
        component: "PerformanceBenchmark",
        action: "save-benchmark",
      });
    }
  }

  /**
   * 保存されたベンチマークの取得
   */
  static getStoredBenchmarks(): SystemBenchmark[] {
    try {
      const stored = localStorage.getItem(this.BENCHMARK_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      handleError(error as Error, {
        component: "PerformanceBenchmark",
        action: "get-stored-benchmarks",
      });
      return [];
    }
  }

  /**
   * 空のベンチマーク結果
   */
  private static getEmptyBenchmark(): SystemBenchmark {
    return {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.DEV ? "development" : "production",
      browserInfo: this.getBrowserInfo(),
      results: [],
      overallScore: 0,
      recommendations: ["ベンチマーク実行に失敗しました"],
    };
  }
}
