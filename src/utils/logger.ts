/**
 * 開発環境専用ログ管理システム
 * 本番環境では自動的にログを無効化
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  component?: string;
  data?: any;
  userId?: string;
  overallScore?: number;
  enhancementsApplied?: number;
  supportedLanguages?: number;
  issueCount?: number;
  debtCount?: number;
  milestonesCount?: number;
  topOpportunity?: string;
  error?: any;
  category?: string;
  targetText?: string;
  difficulty?: string;
  questionsCount?: number;
  listeningScore?: number;
  lastStudyDate?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private enabledLevels: Set<LogLevel> = new Set(['info', 'warn', 'error']);

  constructor() {
    // 開発環境では全レベルを有効化
    if (this.isDevelopment) {
      this.enabledLevels.add('debug');
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.isDevelopment && this.enabledLevels.has(level);
  }

  private formatMessage(message: string, options: LogOptions = {}): string {
    const timestamp = new Date().toISOString();
    const component = options.component ? `[${options.component}]` : '';
    return `${timestamp} ${component} ${message}`;
  }

  debug(message: string, options: LogOptions = {}): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage(`🐛 ${message}`, options));
      if (options.data) {
        console.log('Data:', options.data);
      }
    }
  }

  info(message: string, options: LogOptions = {}): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage(`ℹ️ ${message}`, options));
      if (options.data) {
        console.log('Data:', options.data);
      }
    }
  }

  warn(message: string, options: LogOptions = {}): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(`⚠️ ${message}`, options));
      if (options.data) {
        console.warn('Data:', options.data);
      }
    }
  }

  error(message: string, error?: Error, options: LogOptions = {}): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(`❌ ${message}`, options));
      if (error) {
        console.error('Error:', error);
      }
      if (options.data) {
        console.error('Data:', options.data);
      }
    }
  }

  // 学習関連の専用ログメソッド
  learningProgress(message: string, data?: any): void {
    this.info(`📚 ${message}`, { component: 'Learning', data });
  }

  gameProgress(message: string, data?: any): void {
    this.info(`🎮 ${message}`, { component: 'Game', data });
  }

  userAction(message: string, data?: any): void {
    this.info(`👤 ${message}`, { component: 'User', data });
  }

  performance(message: string, data?: any): void {
    this.debug(`⚡ ${message}`, { component: 'Performance', data });
  }

  // 本番環境でも重要なエラーは記録
  criticalError(message: string, error?: Error, data?: any): void {
    const formattedMessage = this.formatMessage(`🚨 CRITICAL: ${message}`, { data });
    console.error(formattedMessage);
    if (error) {
      console.error('Error:', error);
    }
    if (data) {
      console.error('Data:', data);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const logger = new Logger();

// 便利な関数エクスポート
export const logDebug = (message: string, options?: LogOptions) => logger.debug(message, options);
export const logInfo = (message: string, options?: LogOptions) => logger.info(message, options);
export const logWarn = (message: string, options?: LogOptions) => logger.warn(message, options);
export const logError = (message: string, error?: Error, options?: LogOptions) => logger.error(message, error, options);

// 学習関連専用ログ
export const logLearning = (message: string, data?: any) => logger.learningProgress(message, data);
export const logGame = (message: string, data?: any) => logger.gameProgress(message, data);
export const logUser = (message: string, data?: any) => logger.userAction(message, data);
export const logPerformance = (message: string, data?: any) => logger.performance(message, data);

// 重要なエラー
export const logCritical = (message: string, error?: Error, data?: any) => logger.criticalError(message, error, data);
