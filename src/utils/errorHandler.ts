/**
 * エラーハンドリングユーティリティ
 */

export const handleError = (error: unknown, context?: string | object): void => {
  if (typeof context === 'string') {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error(`Error:`, error, context);
  }
};

export const handleDataError = (error: unknown, context?: string | object): void => {
  if (typeof context === 'string') {
    console.error(`Data error in ${context}:`, error);
  } else {
    console.error(`Data error:`, error, context);
  }
};

export const handleLearningError = (error: unknown, context?: string | object, additionalData?: any): void => {
  if (typeof context === 'string') {
    console.error(`Learning error in ${context}:`, error);
  } else {
    console.error(`Learning error:`, error, context, additionalData);
  }
};

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    handleError(error, context);
  }
}
