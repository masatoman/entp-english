/**
 * 入力値検証ユーティリティ
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUserInput = (
  input: string,
  maxLength: number = 1000
): ValidationResult => {
  const sanitized = input.trim();

  if (sanitized.length === 0) {
    return {
      isValid: false,
      error: "入力が必要です",
    };
  }

  if (sanitized.length > maxLength) {
    return {
      isValid: false,
      error: `入力は${maxLength}文字以内でお願いします`,
    };
  }

  // 危険な文字列の検証
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return {
        isValid: false,
        error: "無効な文字列が含まれています",
      };
    }
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "有効なメールアドレスを入力してください",
    };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 8) {
    return {
      isValid: false,
      error: "パスワードは8文字以上で入力してください",
    };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      error: "パスワードは大文字、小文字、数字を含む必要があります",
    };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // HTMLタグの除去
    .replace(/javascript:/gi, "") // JavaScriptの除去
    .replace(/on\w+\s*=/gi, ""); // イベントハンドラーの除去
};

export const validateQuizAnswer = (answer: string): ValidationResult => {
  const sanitized = sanitizeInput(answer);

  if (sanitized.length === 0) {
    return {
      isValid: false,
      error: "回答を入力してください",
    };
  }

  if (sanitized.length > 500) {
    return {
      isValid: false,
      error: "回答は500文字以内で入力してください",
    };
  }

  return { isValid: true };
};

export const validateLearningProgress = (
  progress: number
): ValidationResult => {
  if (progress < 0 || progress > 1) {
    return {
      isValid: false,
      error: "進捗は0から1の間で入力してください",
    };
  }

  return { isValid: true };
};
