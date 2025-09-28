/**
 * エラーハンドリングユーティリティ
 */

export const handleError = (error: unknown, context?: string): void => {
  console.error(`Error in ${context || "unknown context"}:`, error);
};

export const handleDataError = (error: unknown, context?: string): void => {
  console.error(`Data error in ${context || "unknown context"}:`, error);
};

export const handleLearningError = (error: unknown, context?: string): void => {
  console.error(`Learning error in ${context || "unknown context"}:`, error);
};

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    handleError(error, context);
  }
}
