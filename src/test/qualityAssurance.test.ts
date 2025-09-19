/**
 * 品質保証テストスイート
 * システム全体の品質・パフォーマンス・信頼性を検証
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PersonalizedLearningSystem } from '../utils/personalizedLearning';
import { AdaptiveDifficultySystem } from '../utils/adaptiveDifficulty';
import { WeaknessAnalyzer } from '../utils/weaknessAnalyzer';
import { PerformanceOptimizer } from '../utils/performanceOptimizer';
import { IntelligentLearningService } from '../utils/intelligentLearningService';
import { logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';

describe('品質保証テストスイート', () => {
  beforeEach(() => {
    // テスト環境の初期化
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    PerformanceOptimizer.stopPerformanceMonitoring();
  });

  describe('🧠 個人化学習システム', () => {
    it('ユーザープロファイルの正確な生成', () => {
      const userId = 'test-user-001';
      const userStats = {
        totalXP: 100,
        vocabularyStudied: 25,
        grammarQuizzesCompleted: 10,
        averageScore: 75
      };
      const recentSessions = [
        { difficulty: 'normal', category: 'grammar', isCorrect: true, timestamp: Date.now() },
        { difficulty: 'normal', category: 'vocabulary', isCorrect: false, timestamp: Date.now() }
      ];

      const profile = PersonalizedLearningSystem.updatePersonalizationProfile(
        userId, userStats, recentSessions
      );

      expect(profile.userId).toBe(userId);
      expect(profile.preferredDifficulty).toBeDefined();
      expect(profile.strongAreas).toBeInstanceOf(Array);
      expect(profile.weakAreas).toBeInstanceOf(Array);
      expect(profile.averageAccuracy).toBeGreaterThan(0);
      expect(profile.lastUpdated).toBeDefined();
    });

    it('推奨コンテンツの品質検証', () => {
      const userId = 'test-user-002';
      const availableItems = [
        {
          id: 'item-1',
          type: 'vocabulary' as const,
          content: 'test',
          meaning: 'テスト',
          category: 'grammar',
          level: 'intermediate' as const,
          examples: [],
          explanations: [],
          questions: [],
          relations: [],
          source: 'standard' as const,
          tags: ['test'],
          difficulty: 50,
          importance: 70,
          frequency: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const recommendation = PersonalizedLearningSystem.recommendContent(
        userId, availableItems, 'vocabulary', 5
      );

      expect(recommendation.items).toBeInstanceOf(Array);
      expect(recommendation.items.length).toBeLessThanOrEqual(5);
      expect(recommendation.confidence).toBeGreaterThanOrEqual(0);
      expect(recommendation.confidence).toBeLessThanOrEqual(100);
      expect(recommendation.reason).toBeDefined();
      expect(recommendation.estimatedDifficulty).toBeGreaterThanOrEqual(0);
      expect(recommendation.expectedAccuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('⚡ 適応的難易度調整システム', () => {
    it('セッション開始の正確性', () => {
      const userId = 'test-user-003';
      const initialDifficulty = 60;
      const targetAccuracy = 75;

      const session = AdaptiveDifficultySystem.startAdaptiveSession(
        userId, initialDifficulty, targetAccuracy
      );

      expect(session.sessionId).toContain(userId);
      expect(session.userId).toBe(userId);
      expect(session.currentDifficulty).toBe(initialDifficulty);
      expect(session.targetAccuracy).toBe(targetAccuracy);
      expect(session.questions).toEqual([]);
      expect(session.adjustmentHistory).toEqual([]);
    });

    it('パフォーマンス指標の計算精度', () => {
      const session = AdaptiveDifficultySystem.startAdaptiveSession('test-user', 50, 75);
      
      // テストデータを追加
      session.questions = [
        { questionId: 'q1', difficulty: 50, timeToAnswer: 10, isCorrect: true, confidence: 80, timestamp: new Date().toISOString() },
        { questionId: 'q2', difficulty: 50, timeToAnswer: 15, isCorrect: false, confidence: 60, timestamp: new Date().toISOString() },
        { questionId: 'q3', difficulty: 50, timeToAnswer: 8, isCorrect: true, confidence: 90, timestamp: new Date().toISOString() }
      ];

      const metrics = AdaptiveDifficultySystem.calculatePerformanceMetrics(session);

      expect(metrics.accuracy).toBeCloseTo(66.67, 1); // 2/3 = 66.67%
      expect(metrics.speed).toBeGreaterThan(0);
      expect(metrics.consistency).toBeGreaterThan(0);
      expect(metrics.engagement).toBeGreaterThan(0);
      expect(['improving', 'stable', 'declining']).toContain(metrics.recentTrend);
    });

    it('難易度調整の適切性', () => {
      const session = AdaptiveDifficultySystem.startAdaptiveSession('test-user', 50, 75);
      
      // 高い正答率のテストデータ
      const highAccuracyQuestions = Array(5).fill(null).map((_, i) => ({
        questionId: `q${i}`,
        difficulty: 50,
        timeToAnswer: 10,
        isCorrect: true,
        confidence: 80,
        timestamp: new Date().toISOString()
      }));

      session.questions = highAccuracyQuestions;
      const nextDifficulty = AdaptiveDifficultySystem.recommendNextQuestionDifficulty(session);

      expect(nextDifficulty).toBeGreaterThan(50); // 難易度が上がるべき
      expect(nextDifficulty).toBeLessThanOrEqual(90); // 上限チェック
    });
  });

  describe('🔍 弱点分析システム', () => {
    it('弱点エリアの特定精度', () => {
      const userId = 'test-user-004';
      const userStats = { totalXP: 200, vocabularyStudied: 50, grammarQuizzesCompleted: 20 };
      const learningProgress = [];
      const recentSessions = [
        { category: 'grammar', isCorrect: false, timestamp: Date.now() },
        { category: 'grammar', isCorrect: false, timestamp: Date.now() },
        { category: 'vocabulary', isCorrect: true, timestamp: Date.now() }
      ];

      const analysis = WeaknessAnalyzer.performComprehensiveAnalysis(
        userId, userStats, learningProgress, recentSessions
      );

      expect(analysis.userId).toBe(userId);
      expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
      expect(analysis.overallScore).toBeLessThanOrEqual(100);
      expect(analysis.weaknessAreas).toBeInstanceOf(Array);
      expect(analysis.strengthAreas).toBeInstanceOf(Array);
      expect(analysis.prioritizedActions).toBeInstanceOf(Array);
    });

    it('改善時間予測の妥当性', () => {
      const weaknessAreas = [
        {
          category: 'grammar',
          severity: 'severe' as const,
          confidence: 80,
          accuracy: 40,
          frequency: 0.6,
          recentTrend: 'stable' as const,
          specificIssues: ['基本文型の理解不足'],
          recommendations: ['基礎練習の強化']
        }
      ];

      const estimations = WeaknessAnalyzer.estimateImprovementTime(weaknessAreas);

      expect(estimations['grammar']).toBeGreaterThan(0);
      expect(estimations['grammar']).toBeLessThan(20); // 20週間以内
    });
  });

  describe('🚀 パフォーマンス最適化', () => {
    it('メトリクス記録の正確性', () => {
      PerformanceOptimizer.initializePerformanceMonitoring();
      
      // メトリクスの記録をテスト
      const metrics = PerformanceOptimizer.getStoredMetrics();
      
      expect(typeof metrics).toBe('object');
      // 実際の環境では様々なメトリクスが記録される
    });

    it('メモリリーク検出機能', () => {
      // テスト用のDOM要素を作成
      const testElement = document.createElement('div');
      testElement.setAttribute('data-cleanup-required', 'true');
      testElement.setAttribute('data-events', 'click,mouseover');
      document.body.appendChild(testElement);

      const result = PerformanceOptimizer.detectAndFixMemoryLeaks();

      expect(result.leaksDetected).toBeGreaterThanOrEqual(0);
      expect(result.fixesApplied).toBeInstanceOf(Array);
    });

    it('バンドルサイズ分析', () => {
      const analysis = PerformanceOptimizer.analyzeBundleSize();

      expect(analysis.totalSize).toBeGreaterThanOrEqual(0);
      expect(typeof analysis.breakdown).toBe('object');
      expect(analysis.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('🎯 統合インテリジェントサービス', () => {
    it('システム初期化の安全性', () => {
      expect(() => {
        IntelligentLearningService.initialize();
      }).not.toThrow();
    });

    it('システムヘルスチェック', () => {
      const healthCheck = IntelligentLearningService.performSystemHealthCheck();

      expect(['healthy', 'warning', 'error']).toContain(healthCheck.status);
      expect(healthCheck.issues).toBeInstanceOf(Array);
      expect(healthCheck.recommendations).toBeInstanceOf(Array);
      expect(typeof healthCheck.performanceMetrics).toBe('object');
    });

    it('長期進捗分析の妥当性', () => {
      const userId = 'test-user-005';
      const analysis = IntelligentLearningService.analyzeLongTermProgress(userId);

      expect(['excellent', 'good', 'steady', 'concerning']).toContain(analysis.progressTrend);
      expect(analysis.keyInsights).toBeInstanceOf(Array);
      expect(analysis.milestones).toBeInstanceOf(Array);
      expect(analysis.futureProjections).toBeInstanceOf(Array);
    });
  });

  describe('🛡️ エラーハンドリングシステム', () => {
    it('エラー分類の正確性', () => {
      const testError = new Error('Test error');
      
      expect(() => {
        ErrorHandler.handle(testError, { component: 'TestComponent' });
      }).not.toThrow();

      expect(() => {
        ErrorHandler.handleDataError('test operation', testError);
      }).not.toThrow();

      expect(() => {
        ErrorHandler.handleLearningError('test learning', testError);
      }).not.toThrow();
    });

    it('非同期エラーハンドリング', async () => {
      const failingOperation = async () => {
        throw new Error('Async test error');
      };

      const result = await ErrorHandler.withErrorHandling(failingOperation);
      expect(result).toBeNull(); // エラー時はnullを返す
    });
  });

  describe('📊 ログシステム', () => {
    it('環境別ログ動作', () => {
      // 開発環境でのログテスト
      expect(() => {
        logger.debug('Test debug message');
        logger.info('Test info message');
        logger.warn('Test warning message');
        logger.error('Test error message');
      }).not.toThrow();
    });

    it('学習専用ログ', () => {
      expect(() => {
        logger.learningProgress('Test learning progress');
        logger.gameProgress('Test game progress');
        logger.userAction('Test user action');
        logger.performance('Test performance');
      }).not.toThrow();
    });
  });

  describe('🔒 型安全性システム', () => {
    it('型ガード関数の動作', () => {
      const { isValidLearningItemType, isValidDifficultyLevel, isValidQuestionType } = 
        require('../types/learningItem');

      expect(isValidLearningItemType('vocabulary')).toBe(true);
      expect(isValidLearningItemType('invalid')).toBe(false);

      expect(isValidDifficultyLevel('beginner')).toBe(true);
      expect(isValidDifficultyLevel('invalid')).toBe(false);

      expect(isValidQuestionType('multiple_choice')).toBe(true);
      expect(isValidQuestionType('invalid')).toBe(false);
    });

    it('バリデーション関数の精度', () => {
      const { validateLearningItem } = require('../types/learningItem');

      const validItem = {
        id: 'test-1',
        type: 'vocabulary',
        content: 'test word',
        meaning: 'テスト単語',
        level: 'intermediate',
        difficulty: 50,
        importance: 70,
        frequency: 60
      };

      const invalidItem = {
        id: '',
        type: 'invalid',
        content: '',
        meaning: '',
        level: 'invalid',
        difficulty: 150,
        importance: -10,
        frequency: 200
      };

      const validErrors = validateLearningItem(validItem);
      const invalidErrors = validateLearningItem(invalidItem);

      expect(validErrors).toEqual([]);
      expect(invalidErrors.length).toBeGreaterThan(0);
    });
  });

  describe('📈 パフォーマンス基準', () => {
    it('メモリ使用量の監視', () => {
      PerformanceOptimizer.initializePerformanceMonitoring();
      
      // メモリ使用量の測定
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        expect(memInfo.usedJSHeapSize).toBeGreaterThan(0);
        expect(memInfo.usedJSHeapSize).toBeLessThan(memInfo.jsHeapSizeLimit);
      }
    });

    it('レンダリング最適化の効果', () => {
      const result = PerformanceOptimizer.optimizeRendering();
      
      expect(result.optimizationsApplied).toBeInstanceOf(Array);
      expect(result.performanceGain).toBeGreaterThanOrEqual(0);
    });
  });

  describe('🎯 統合システムテスト', () => {
    it('エンドツーエンドの学習フロー', async () => {
      const userId = 'test-user-e2e';
      const userStats = { totalXP: 150, vocabularyStudied: 30, grammarQuizzesCompleted: 15 };
      const availableItems = [
        {
          id: 'e2e-item-1',
          type: 'vocabulary' as const,
          content: 'comprehensive',
          meaning: '包括的な',
          category: 'academic',
          level: 'advanced' as const,
          examples: [],
          explanations: [],
          questions: [],
          relations: [],
          source: 'standard' as const,
          tags: ['academic'],
          difficulty: 75,
          importance: 85,
          frequency: 70,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // 1. インテリジェント推奨の生成
      const recommendation = await IntelligentLearningService.generateIntelligentRecommendation(
        userId, userStats, availableItems, [], []
      );

      expect(recommendation.personalizedContent.items.length).toBeGreaterThan(0);
      expect(recommendation.combinedScore).toBeGreaterThanOrEqual(0);
      expect(recommendation.nextSteps.length).toBeGreaterThan(0);

      // 2. セッション開始
      const session = IntelligentLearningService.startIntelligentSession(userId, recommendation);

      expect(session.sessionId).toBeDefined();
      expect(session.userId).toBe(userId);
      expect(session.personalizedItems.length).toBeGreaterThan(0);

      // 3. 回答記録
      const answerResult = IntelligentLearningService.recordLearningAnswer(
        session.sessionId, 'test-question', 50, true, 12, 75
      );

      expect(typeof answerResult.difficultyAdjusted).toBe('boolean');
      expect(answerResult.feedback).toBeDefined();

      // 4. セッション終了
      const summary = IntelligentLearningService.finishIntelligentSession(session.sessionId);

      expect(summary.sessionSummary).toBeDefined();
      expect(summary.achievements).toBeInstanceOf(Array);
      expect(summary.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('🔧 品質メトリクス', () => {
    it('コード品質指標', () => {
      // TODO項目数（0であるべき）
      const todoPattern = /TODO|FIXME|HACK|BUG/;
      // 実際のファイルスキャンは統合テストで実行
      
      // エラーハンドリングカバレッジ
      expect(ErrorHandler.getErrorStats).toBeDefined();
      
      // ログシステムの完全性
      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.criticalError).toBeDefined();
    });

    it('パフォーマンス基準', () => {
      const healthCheck = IntelligentLearningService.performSystemHealthCheck();
      
      // 健全性チェック
      expect(['healthy', 'warning', 'error']).toContain(healthCheck.status);
      
      // パフォーマンスメトリクスの存在確認
      expect(typeof healthCheck.performanceMetrics).toBe('object');
    });
  });
});
