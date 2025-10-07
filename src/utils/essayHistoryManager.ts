import { EssayPrompt, EssaySubmission } from "../types/essay";

export interface EssayHistoryEntry {
  id: string;
  prompt: EssayPrompt;
  submission: EssaySubmission;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  tags: string[];
  isFavorite: boolean;
  shareCount: number;
}

export interface EssayStats {
  totalEssays: number;
  totalWords: number;
  averageWordCount: number;
  favoriteCount: number;
  shareCount: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
  recentActivity: EssayHistoryEntry[];
}

/**
 * 英作文履歴管理システム
 * ENTPの成果可視化と共有欲求に対応
 */
export class EssayHistoryManager {
  private static readonly HISTORY_KEY = "entp-essay-history";
  private static readonly MAX_HISTORY = 100; // 最大保存数

  /**
   * 英作文を履歴に保存
   */
  static saveEssay(
    prompt: EssayPrompt,
    submission: EssaySubmission,
    tags: string[] = []
  ): string {
    const history = this.getHistory();
    const essayId = this.generateEssayId();
    const wordCount = this.countWords(submission.text);

    const entry: EssayHistoryEntry = {
      id: essayId,
      prompt,
      submission,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount,
      tags,
      isFavorite: false,
      shareCount: 0,
    };

    history.unshift(entry); // 新しいものを先頭に追加

    // 最大保存数を超えた場合は古いものを削除
    if (history.length > this.MAX_HISTORY) {
      history.splice(this.MAX_HISTORY);
    }

    this.saveHistory(history);
    console.log(`📝 英作文「${prompt.title}」を履歴に保存 (ID: ${essayId})`);

    return essayId;
  }

  /**
   * 履歴を取得
   */
  static getHistory(): EssayHistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("英作文履歴の読み込みエラー:", error);
      return [];
    }
  }

  /**
   * 特定の英作文を取得
   */
  static getEssayById(id: string): EssayHistoryEntry | null {
    const history = this.getHistory();
    return history.find((entry) => entry.id === id) || null;
  }

  /**
   * 英作文を更新
   */
  static updateEssay(id: string, updates: Partial<EssayHistoryEntry>): boolean {
    const history = this.getHistory();
    const index = history.findIndex((entry) => entry.id === id);

    if (index === -1) return false;

    history[index] = {
      ...history[index],
      ...updates,
      updatedAt: Date.now(),
    };

    this.saveHistory(history);
    console.log(`📝 英作文「${id}」を更新`);
    return true;
  }

  /**
   * お気に入りトグル
   */
  static toggleFavorite(id: string): boolean {
    const history = this.getHistory();
    const entry = history.find((e) => e.id === id);

    if (!entry) return false;

    entry.isFavorite = !entry.isFavorite;
    entry.updatedAt = Date.now();

    this.saveHistory(history);
    console.log(`⭐ 英作文「${id}」のお気に入り状態: ${entry.isFavorite}`);
    return entry.isFavorite;
  }

  /**
   * シェア回数を増加
   */
  static incrementShareCount(id: string): void {
    const history = this.getHistory();
    const entry = history.find((e) => e.id === id);

    if (entry) {
      entry.shareCount++;
      entry.updatedAt = Date.now();
      this.saveHistory(history);
      console.log(`📤 英作文「${id}」のシェア回数: ${entry.shareCount}`);
    }
  }

  /**
   * 履歴を削除
   */
  static deleteEssay(id: string): boolean {
    const history = this.getHistory();
    const filteredHistory = history.filter((entry) => entry.id !== id);

    if (filteredHistory.length === history.length) return false;

    this.saveHistory(filteredHistory);
    console.log(`🗑️ 英作文「${id}」を削除`);
    return true;
  }

  /**
   * カテゴリ別履歴取得
   */
  static getHistoryByCategory(category: string): EssayHistoryEntry[] {
    return this.getHistory().filter(
      (entry) => entry.prompt.category === category
    );
  }

  /**
   * 難易度別履歴取得
   */
  static getHistoryByDifficulty(difficulty: string): EssayHistoryEntry[] {
    return this.getHistory().filter(
      (entry) => entry.prompt.difficulty === difficulty
    );
  }

  /**
   * お気に入り履歴取得
   */
  static getFavoriteHistory(): EssayHistoryEntry[] {
    return this.getHistory().filter((entry) => entry.isFavorite);
  }

  /**
   * 最近の履歴取得
   */
  static getRecentHistory(limit: number = 10): EssayHistoryEntry[] {
    return this.getHistory().slice(0, limit);
  }

  /**
   * 統計情報取得
   */
  static getStats(): EssayStats {
    const history = this.getHistory();

    const stats: EssayStats = {
      totalEssays: history.length,
      totalWords: history.reduce((sum, entry) => sum + entry.wordCount, 0),
      averageWordCount:
        history.length > 0
          ? Math.round(
              history.reduce((sum, entry) => sum + entry.wordCount, 0) /
                history.length
            )
          : 0,
      favoriteCount: history.filter((entry) => entry.isFavorite).length,
      shareCount: history.reduce((sum, entry) => sum + entry.shareCount, 0),
      byCategory: {},
      byDifficulty: {},
      recentActivity: history.slice(0, 5),
    };

    // カテゴリ別統計
    history.forEach((entry) => {
      const category = entry.prompt.category;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // 難易度別統計
    history.forEach((entry) => {
      const difficulty = entry.prompt.difficulty;
      stats.byDifficulty[difficulty] =
        (stats.byDifficulty[difficulty] || 0) + 1;
    });

    return stats;
  }

  /**
   * 履歴をリセット
   */
  static resetHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
    console.log("🔄 英作文履歴をリセット");
  }

  /**
   * 履歴を保存
   */
  private static saveHistory(history: EssayHistoryEntry[]): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("英作文履歴の保存エラー:", error);
    }
  }

  /**
   * ユニークな英作文IDを生成
   */
  private static generateEssayId(): string {
    return `essay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 単語数をカウント
   */
  private static countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * 検索機能
   */
  static searchHistory(query: string): EssayHistoryEntry[] {
    const history = this.getHistory();
    const lowerQuery = query.toLowerCase();

    return history.filter(
      (entry) =>
        entry.prompt.title.toLowerCase().includes(lowerQuery) ||
        entry.submission.text.toLowerCase().includes(lowerQuery) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * タグ管理
   */
  static addTag(id: string, tag: string): boolean {
    const history = this.getHistory();
    const entry = history.find((e) => e.id === id);

    if (!entry || entry.tags.includes(tag)) return false;

    entry.tags.push(tag);
    entry.updatedAt = Date.now();
    this.saveHistory(history);
    console.log(`🏷️ 英作文「${id}」にタグ「${tag}」を追加`);
    return true;
  }

  /**
   * タグ削除
   */
  static removeTag(id: string, tag: string): boolean {
    const history = this.getHistory();
    const entry = history.find((e) => e.id === id);

    if (!entry) return false;

    entry.tags = entry.tags.filter((t) => t !== tag);
    entry.updatedAt = Date.now();
    this.saveHistory(history);
    console.log(`🏷️ 英作文「${id}」からタグ「${tag}」を削除`);
    return true;
  }

  /**
   * 全タグ取得
   */
  static getAllTags(): string[] {
    const history = this.getHistory();
    const allTags = history.flatMap((entry) => entry.tags);
    return [...new Set(allTags)].sort();
  }
}
