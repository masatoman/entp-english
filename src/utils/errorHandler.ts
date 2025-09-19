/**
 * 統一されたエラーハンドリングシステム
 */

import { logError, logCritical } from './logger';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: any;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly timestamp: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorHandler {
  /**
   * エラーを処理し、適切にログ出力
   */
  static handle(error: Error | AppError, context: ErrorContext = {}): void {
    const isAppError = error instanceof AppError;
    
    if (isAppError) {
      const appError = error as AppError;
      const fullContext = { ...appError.context, ...context };
      
      switch (appError.severity) {
        case 'critical':
          logCritical(appError.message, appError, fullContext);
          this.notifyUser('システムエラーが発生しました。ページを再読み込みしてください。');
          break;
        case 'high':
          logError(appError.message, appError, { context: fullContext });
          this.notifyUser('エラーが発生しました。もう一度お試しください。');
          break;
        case 'medium':
          logError(appError.message, appError, { context: fullContext });
          break;
        case 'low':
          // 低優先度エラーは詳細ログのみ
          break;
      }
    } else {
      // 通常のエラー
      logError('Unexpected error occurred', error, { context });
    }
  }

  /**
   * データ関連エラーの処理
   */
  static handleDataError(operation: string, error: Error, context: ErrorContext = {}): void {
    const appError = new AppError(
      `Data operation failed: ${operation}`,
      'DATA_ERROR',
      'medium',
      { ...context, operation }
    );
    this.handle(appError);
  }

  /**
   * ネットワークエラーの処理
   */
  static handleNetworkError(error: Error, context: ErrorContext = {}): void {
    const appError = new AppError(
      'Network request failed',
      'NETWORK_ERROR',
      'medium',
      { ...context, originalError: error.message }
    );
    this.handle(appError);
  }

  /**
   * 学習関連エラーの処理
   */
  static handleLearningError(operation: string, error: Error, context: ErrorContext = {}): void {
    const appError = new AppError(
      `Learning operation failed: ${operation}`,
      'LEARNING_ERROR',
      'high',
      { ...context, operation }
    );
    this.handle(appError);
  }

  /**
   * 非同期操作のラッパー
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error as Error, context);
      return null;
    }
  }

  /**
   * ユーザーへの通知
   */
  private static notifyUser(message: string): void {
    // 本番環境では適切な通知システムを使用
    if (import.meta.env.DEV) {
      console.warn('User notification:', message);
    }
    
    // 将来的にはtoast通知やモーダルで表示
    // toast.error(message);
  }

  /**
   * エラー統計の取得
   */
  static getErrorStats(): {
    totalErrors: number;
    criticalErrors: number;
    recentErrors: AppError[];
  } {
    // 実装は将来的に追加
    return {
      totalErrors: 0,
      criticalErrors: 0,
      recentErrors: [],
    };
  }
}

/**
 * 便利な関数エクスポート
 */
export const handleError = (error: Error | AppError, context?: ErrorContext) => 
  ErrorHandler.handle(error, context);

export const handleDataError = (operation: string, error: Error, context?: ErrorContext) => 
  ErrorHandler.handleDataError(operation, error, context);

export const handleNetworkError = (error: Error, context?: ErrorContext) => 
  ErrorHandler.handleNetworkError(error, context);

export const handleLearningError = (operation: string, error: Error, context?: ErrorContext) => 
  ErrorHandler.handleLearningError(operation, error, context);

export const withErrorHandling = <T>(operation: () => Promise<T>, context?: ErrorContext) => 
  ErrorHandler.withErrorHandling(operation, context);
