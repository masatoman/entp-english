import { Category } from "../types";

export interface QuestionStats {
  questionId: number;
  category: Category;
  difficulty: 'easy' | 'normal' | 'hard';
  attempts: number;
  correctAnswers: number;
  lastAttempted?: Date;
  averageTime?: number; // 平均回答時間（秒）
}

export interface QuestionStatsManager {
  getQuestionStats(questionId: number): QuestionStats | null;
  updateQuestionStats(questionId: number, isCorrect: boolean, timeSpent?: number): void;
  getCategoryStats(category: Category, difficulty: 'easy' | 'normal' | 'hard'): QuestionStats[];
  getSuccessRate(questionId: number): number;
  getFormattedStats(questionId: number): string;
  resetQuestionStats(questionId: number): void;
  resetCategoryStats(category: Category, difficulty: 'easy' | 'normal' | 'hard'): void;
}

class QuestionStatsManagerImpl implements QuestionStatsManager {
  private static instance: QuestionStatsManagerImpl;
  private readonly STORAGE_KEY = 'entp-question-stats';

  static getInstance(): QuestionStatsManagerImpl {
    if (!QuestionStatsManagerImpl.instance) {
      QuestionStatsManagerImpl.instance = new QuestionStatsManagerImpl();
    }
    return QuestionStatsManagerImpl.instance;
  }

  private loadStats(): Record<number, QuestionStats> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load question stats:', error);
      return {};
    }
  }

  private saveStats(stats: Record<number, QuestionStats>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save question stats:', error);
    }
  }

  getQuestionStats(questionId: number): QuestionStats | null {
    const stats = this.loadStats();
    return stats[questionId] || null;
  }

  updateQuestionStats(questionId: number, isCorrect: boolean, timeSpent?: number): void {
    const stats = this.loadStats();
    const existing = stats[questionId];

    if (existing) {
      existing.attempts++;
      if (isCorrect) {
        existing.correctAnswers++;
      }
      existing.lastAttempted = new Date();
      
      if (timeSpent && existing.averageTime) {
        // 移動平均で平均時間を更新
        existing.averageTime = (existing.averageTime * (existing.attempts - 1) + timeSpent) / existing.attempts;
      } else if (timeSpent) {
        existing.averageTime = timeSpent;
      }
    } else {
      // 新しい問題の統計を作成
      // カテゴリーと難易度は問題IDから推測（後で改善可能）
      stats[questionId] = {
        questionId,
        category: this.getCategoryFromQuestionId(questionId),
        difficulty: this.getDifficultyFromQuestionId(questionId),
        attempts: 1,
        correctAnswers: isCorrect ? 1 : 0,
        lastAttempted: new Date(),
        averageTime: timeSpent,
      };
    }

    this.saveStats(stats);
  }

  getCategoryStats(category: Category, difficulty: 'easy' | 'normal' | 'hard'): QuestionStats[] {
    const stats = this.loadStats();
    return Object.values(stats).filter(
      stat => stat.category === category && stat.difficulty === difficulty
    );
  }

  getSuccessRate(questionId: number): number {
    const stats = this.getQuestionStats(questionId);
    if (!stats || stats.attempts === 0) return 0;
    return Math.round((stats.correctAnswers / stats.attempts) * 100);
  }

  getFormattedStats(questionId: number): string {
    const stats = this.getQuestionStats(questionId);
    if (!stats || stats.attempts === 0) return "未挑戦";
    return `${stats.correctAnswers}/${stats.attempts}`;
  }

  resetQuestionStats(questionId: number): void {
    const stats = this.loadStats();
    delete stats[questionId];
    this.saveStats(stats);
  }

  resetCategoryStats(category: Category, difficulty: 'easy' | 'normal' | 'hard'): void {
    const stats = this.loadStats();
    Object.keys(stats).forEach(id => {
      const stat = stats[Number(id)];
      if (stat.category === category && stat.difficulty === difficulty) {
        delete stats[Number(id)];
      }
    });
    this.saveStats(stats);
  }

  private getCategoryFromQuestionId(questionId: number): Category {
    // IDの範囲から推測（将来的にはより良い方法に変更可能）
    if (questionId <= 25) return 'basic-grammar';
    if (questionId <= 55) return 'tenses';
    if (questionId <= 85) return 'modals';
    if (questionId <= 115) return 'passive';
    if (questionId <= 145) return 'relative';
    if (questionId <= 175) return 'subjunctive';
    if (questionId <= 205) return 'comparison';
    if (questionId <= 235) return 'participle';
    return 'infinitive';
  }

  private getDifficultyFromQuestionId(questionId: number): 'easy' | 'normal' | 'hard' {
    // 各カテゴリ内でのIDから推測
    const categoryId = questionId % 30; // 30問ずつの想定
    if (categoryId <= 5) return 'easy';
    if (categoryId <= 15) return 'normal';
    return 'hard';
  }
}

export const questionStatsManager = QuestionStatsManagerImpl.getInstance();
