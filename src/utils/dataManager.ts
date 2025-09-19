import { Achievement, UserStats } from "../data/achievements";
import { VocabularyWord } from "../data/vocabulary";
import { WordCard } from "../types/gacha";
import { logError, logDebug, logInfo, logLearning, logCritical } from './logger';
import { handleDataError } from './errorHandler';

// ローカルストレージのキー
const STORAGE_KEYS = {
  USER_STATS: "entp-english-user-stats",
  ACHIEVEMENTS: "entp-english-achievements",
  LEARNING_HISTORY: "entp-english-learning-history",
  VOCABULARY_PROGRESS: "entp-english-vocabulary-progress",
  APP_SETTINGS: "entp-english-app-settings",
} as const;

// デフォルトのユーザー統計
const DEFAULT_USER_STATS: UserStats = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  vocabularyStudied: 0,
  grammarQuizzesCompleted: 0,
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  averageScore: 0,
  lastStudyDate: new Date().toISOString().split("T")[0],
  // 新システム用の追加プロパティ
  todayXP: 0,
  totalStudyTime: 0,
  accuracy: 0,
  streakDays: 0,
};

// アプリ設定の型定義
export interface AppSettings {
  dailyXPGoal: number;
  grammarQuizQuestionCount: number;
  vocabularyQuestionCount: number;
  essayQuestionCount: number;
}

// デフォルトのアプリ設定
const DEFAULT_APP_SETTINGS: AppSettings = {
  dailyXPGoal: 100,
  grammarQuizQuestionCount: 10,
  vocabularyQuestionCount: 10,
  essayQuestionCount: 10,
};

// 学習履歴の型定義
export interface LearningSession {
  id: string;
  date: string;
  type: "vocabulary" | "grammar-quiz" | "combined-test";
  category?: string;
  difficulty?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  duration: number; // 秒
}

// 語彙学習進捗の型定義
export interface VocabularyProgress {
  wordId: number;
  studiedCount: number;
  lastStudied: string;
  masteryLevel: "new" | "learning" | "mastered";
}

// データ管理クラス
export class DataManager {
  // ユーザー統計の取得
  static getUserStats(): UserStats {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      handleDataError("load user stats", error as Error, { component: 'DataManager' });
    }
    return DEFAULT_USER_STATS;
  }

  // ユーザー統計の保存
  static saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      logError("Failed to save user stats", error);
    }
  }

  // 学習履歴の取得
  static getLearningHistory(): LearningSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEARNING_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logError("Failed to load learning history", error);
    }
    return [];
  }

  // 学習履歴の保存
  static saveLearningHistory(history: LearningSession[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.LEARNING_HISTORY,
        JSON.stringify(history)
      );
    } catch (error) {
      logError("Failed to save learning history", error);
    }
  }

  // 語彙学習進捗の取得
  static getVocabularyProgress(): VocabularyProgress[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOCABULARY_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logError("Failed to load vocabulary progress", error);
    }
    return [];
  }

  // 語彙学習進捗の保存
  static saveVocabularyProgress(progress: VocabularyProgress[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.VOCABULARY_PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      logError("Failed to save vocabulary progress", error);
    }
  }

  // 実績データの取得
  static getAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      logError("Failed to load achievements", error);
    }
    return [];
  }

  // 実績データの保存
  static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ACHIEVEMENTS,
        JSON.stringify(achievements)
      );
    } catch (error) {
      logError("Failed to save achievements", error);
    }
  }

  // 学習セッションの記録
  static recordLearningSession(session: Omit<LearningSession, "id">): void {
    const history = this.getLearningHistory();
    const newSession: LearningSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    history.unshift(newSession); // 最新を先頭に追加
    this.saveLearningHistory(history);

    // ユーザー統計を更新
    this.updateUserStatsFromSession(newSession);
  }

  // 学習セッションからユーザー統計を更新
  static updateUserStatsFromSession(session: LearningSession): void {
    const stats = this.getUserStats();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // 基本統計の更新
    stats.totalXP += session.xpEarned;
    stats.totalQuestionsAnswered += session.totalQuestions;
    stats.correctAnswers += session.correctAnswers;
    stats.averageScore = Math.round(
      (stats.correctAnswers / stats.totalQuestionsAnswered) * 100
    );

    // 学習タイプ別の更新
    if (session.type === "vocabulary") {
      stats.vocabularyStudied += 1;
    } else if (session.type === "grammar-quiz") {
      stats.grammarQuizzesCompleted += 1;
    }

    // ストリークの更新
    logDebug("Streak calculation:", {
      lastStudyDate: stats.lastStudyDate,
      today,
      yesterday,
      currentStreak: stats.currentStreak,
    });

    if (stats.lastStudyDate === today) {
      // 今日既に学習している場合はストリークは変更しない
      logLearning("Already studied today, streak unchanged");
    } else if (stats.lastStudyDate === yesterday) {
      // 昨日も学習していた場合、ストリークを継続
      stats.currentStreak += 1;
      logLearning(`Streak continued: ${stats.currentStreak}`);
    } else {
      // 昨日学習していない場合、ストリークをリセット
      stats.currentStreak = 1;
      logLearning("Streak reset to 1");
    }

    // 最長ストリークの更新
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    stats.lastStudyDate = today;

    this.saveUserStats(stats);

    // 通知を送信
    this.sendNotifications(stats);
  }

  // 通知を送信
  private static async sendNotifications(stats: UserStats): Promise<void> {
    try {
      const { notificationManager } = await import("./notificationManager");

      // 連続学習記録の通知
      if (stats.currentStreak > 1) {
        await notificationManager.showStreakReminder(stats.currentStreak);
      }
    } catch (error) {
      logError("Error sending notifications", error);
    }
  }

  // 語彙学習の記録
  static recordVocabularyStudy(wordId: number): void {
    const progress = this.getVocabularyProgress();
    const existing = progress.find((p) => p.wordId === wordId);
    const today = new Date().toISOString().split("T")[0];

    if (existing) {
      existing.studiedCount += 1;
      existing.lastStudied = today;
      // 学習回数に応じて習熟度を更新
      if (existing.studiedCount >= 5) {
        existing.masteryLevel = "mastered";
      } else if (existing.studiedCount >= 2) {
        existing.masteryLevel = "learning";
      }
    } else {
      progress.push({
        wordId,
        studiedCount: 1,
        lastStudied: today,
        masteryLevel: "new",
      });
    }

    this.saveVocabularyProgress(progress);
  }

  // 実績のチェックと更新
  static checkAndUpdateAchievements(): Achievement[] {
    const stats = this.getUserStats();
    const history = this.getLearningHistory();
    const vocabularyProgress = this.getVocabularyProgress();
    let achievements = this.getAchievements();

    // 実績が存在しない場合は初期化
    if (achievements.length === 0) {
      achievements = this.initializeAchievements();
    }

    // 各実績をチェック
    achievements.forEach((achievement) => {
      let currentProgress = 0;
      let maxProgress = achievement.requirement;

      switch (achievement.type) {
        case "streak":
          if (achievement.id.includes("current")) {
            currentProgress = stats.currentStreak;
          } else if (achievement.id.includes("longest")) {
            currentProgress = stats.longestStreak;
          }
          break;

        case "vocabulary":
          currentProgress = vocabularyProgress.length;
          break;

        case "grammar":
        case "quiz":
          currentProgress = stats.grammarQuizzesCompleted;
          break;

        case "score":
          if (achievement.id === "perfect_score") {
            // 満点の回数をカウント
            currentProgress = history.filter((s) => s.score === 100).length;
          } else if (achievement.id === "high_accuracy") {
            // 高正解率の回数をカウント
            currentProgress = history.filter((s) => s.score >= 85).length;
          }
          break;
      }

      // 進捗を更新
      achievement.progress = Math.min(currentProgress, maxProgress);
      achievement.maxProgress = maxProgress;

      // 実績の解除をチェック
      if (currentProgress >= maxProgress && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        // XPを追加
        stats.totalXP += achievement.xpReward;
      }
    });

    this.saveAchievements(achievements);
    this.saveUserStats(stats);

    return achievements;
  }

  // 実績の初期化
  static initializeAchievements(): Achievement[] {
    return [
      // ストリーク実績
      {
        id: "streak_3",
        title: "三日坊主克服",
        description: "3日連続で学習",
        icon: "🔥",
        type: "streak",
        tier: "bronze",
        requirement: 3,
        xpReward: 50,
        isUnlocked: false,
        progress: 0,
        maxProgress: 3,
      },
      {
        id: "streak_7",
        title: "一週間戦士",
        description: "7日連続で学習",
        icon: "⚡",
        type: "streak",
        tier: "silver",
        requirement: 7,
        xpReward: 100,
        isUnlocked: false,
        progress: 0,
        maxProgress: 7,
      },
      {
        id: "streak_14",
        title: "継続の力",
        description: "14日連続で学習",
        icon: "🌟",
        type: "streak",
        tier: "gold",
        requirement: 14,
        xpReward: 200,
        isUnlocked: false,
        progress: 0,
        maxProgress: 14,
      },
      {
        id: "streak_30",
        title: "マスターの道",
        description: "30日連続で学習",
        icon: "👑",
        type: "streak",
        tier: "platinum",
        requirement: 30,
        xpReward: 500,
        isUnlocked: false,
        progress: 0,
        maxProgress: 30,
      },

      // 語彙実績
      {
        id: "vocab_50",
        title: "単語コレクター",
        description: "50個の単語を学習",
        icon: "📚",
        type: "vocabulary",
        tier: "bronze",
        requirement: 50,
        xpReward: 75,
        isUnlocked: false,
        progress: 0,
        maxProgress: 50,
      },
      {
        id: "vocab_100",
        title: "語彙マスター",
        description: "100個の単語を学習",
        icon: "🎓",
        type: "vocabulary",
        tier: "silver",
        requirement: 100,
        xpReward: 150,
        isUnlocked: false,
        progress: 0,
        maxProgress: 100,
      },
      {
        id: "vocab_250",
        title: "単語の達人",
        description: "250個の単語を学習",
        icon: "🏆",
        type: "vocabulary",
        tier: "gold",
        requirement: 250,
        xpReward: 300,
        isUnlocked: false,
        progress: 0,
        maxProgress: 250,
      },

      // クイズ実績
      {
        id: "quiz_10",
        title: "クイズ初心者",
        description: "10回文法クイズを完了",
        icon: "🧩",
        type: "quiz",
        tier: "bronze",
        requirement: 10,
        xpReward: 60,
        isUnlocked: false,
        progress: 0,
        maxProgress: 10,
      },
      {
        id: "quiz_25",
        title: "クイズ愛好家",
        description: "25回文法クイズを完了",
        icon: "🎯",
        type: "quiz",
        tier: "silver",
        requirement: 25,
        xpReward: 120,
        isUnlocked: false,
        progress: 0,
        maxProgress: 25,
      },

      // スコア実績
      {
        id: "perfect_score",
        title: "パーフェクト",
        description: "満点を獲得",
        icon: "💯",
        type: "score",
        tier: "gold",
        requirement: 1,
        xpReward: 250,
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: "high_accuracy",
        title: "正確性マスター",
        description: "正解率85%以上を達成",
        icon: "🎖️",
        type: "score",
        tier: "silver",
        requirement: 1,
        xpReward: 180,
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
      },
    ];
  }

  // データのリセット（開発用）
  static resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.LEARNING_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.VOCABULARY_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.APP_SETTINGS);
  }

  // データのエクスポート
  static exportData(): string {
    const data = {
      userStats: this.getUserStats(),
      achievements: this.getAchievements(),
      learningHistory: this.getLearningHistory(),
      vocabularyProgress: this.getVocabularyProgress(),
      appSettings: this.getAppSettings(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // データのインポート
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.userStats) this.saveUserStats(data.userStats);
      if (data.achievements) this.saveAchievements(data.achievements);
      if (data.learningHistory) this.saveLearningHistory(data.learningHistory);
      if (data.vocabularyProgress)
        this.saveVocabularyProgress(data.vocabularyProgress);
      if (data.appSettings) this.saveAppSettings(data.appSettings);

      return true;
    } catch (error) {
      logError("Failed to import data", error);
      return false;
    }
  }

  // アプリ設定の取得
  static getAppSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_APP_SETTINGS, ...parsed };
      }
    } catch (error) {
      logError("Error loading app settings", error);
    }
    return DEFAULT_APP_SETTINGS;
  }

  // アプリ設定の保存
  static saveAppSettings(settings: Partial<AppSettings>): void {
    try {
      const currentSettings = this.getAppSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      logError("Error saving app settings", error);
    }
  }

  // ガチャカードを語彙学習システムに追加
  static addGachaWordsToVocabulary(cards: WordCard[]): void {
    try {
      const currentVocab = this.getVocabularyProgress();

      cards.forEach((card) => {
        const vocabularyWord: VocabularyWord = {
          id: card.id + 10000, // ガチャカード用のID範囲
          word: card.word,
          meaning: card.meaning,
          partOfSpeech: card.partOfSpeech,
          example: card.examples[0]?.sentence || "",
          exampleTranslation: card.examples[0]?.translation || "",
          level: this.mapRarityToLevel(card.rarity),
          category: "toeic",
        };

        // 語彙進捗に追加（重複チェック）
        const existingProgress = currentVocab.find(
          (p) => p.wordId === vocabularyWord.id
        );
        if (!existingProgress) {
          currentVocab.push({
            wordId: vocabularyWord.id,
            studiedCount: 0,
            lastStudied: "",
            masteryLevel: "new",
          });
        }
      });

      this.saveVocabularyProgress(currentVocab);
      logInfo("Successfully added gacha cards to vocabulary system");
    } catch (error) {
      logError("Error in addGachaWordsToVocabulary", error);
      throw error; // エラーを再スローして上位でキャッチできるようにする
    }
  }

  // レアリティをレベルにマッピング
  private static mapRarityToLevel(
    rarity: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (rarity) {
      case "common":
      case "uncommon":
        return "beginner";
      case "rare":
      case "epic":
        return "intermediate";
      case "legendary":
        return "advanced";
      default:
        return "beginner";
    }
  }

  // ガチャカードの語彙進捗を取得
  static getGachaVocabularyProgress(): VocabularyProgress[] {
    const allProgress = this.getVocabularyProgress();
    return allProgress.filter((p) => p.wordId >= 10000); // ガチャカード用のID範囲
  }

  // ガチャカードの学習記録
  static recordGachaVocabularyStudy(wordId: number): void {
    const progress = this.getVocabularyProgress();
    const existing = progress.find((p) => p.wordId === wordId);
    const today = new Date().toISOString().split("T")[0];

    if (existing) {
      existing.studiedCount += 1;
      existing.lastStudied = today;
      // 学習回数に応じて習熟度を更新
      if (existing.studiedCount >= 5) {
        existing.masteryLevel = "mastered";
      } else if (existing.studiedCount >= 2) {
        existing.masteryLevel = "learning";
      }
    } else {
      progress.push({
        wordId,
        studiedCount: 1,
        lastStudied: today,
        masteryLevel: "new",
      });
    }

    this.saveVocabularyProgress(progress);
  }

  // 事前学習進捗管理
  static getPreStudyProgress(): any {
    try {
      const stored = localStorage.getItem("preStudyProgress");
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        totalContentsStudied: 0,
        contentsByCategory: {},
        averageComprehension: 0,
        totalTimeSpent: 0,
        completedContents: [],
      };
    } catch (error) {
      logError("Error loading pre-study progress", error);
      return {
        totalContentsStudied: 0,
        contentsByCategory: {},
        averageComprehension: 0,
        totalTimeSpent: 0,
        completedContents: [],
      };
    }
  }

  static savePreStudyProgress(progress: any): void {
    try {
      localStorage.setItem("preStudyProgress", JSON.stringify(progress));
    } catch (error) {
      logError("Error saving pre-study progress", error);
    }
  }

  static recordPreStudyCompletion(
    contentId: string,
    comprehensionRating: number,
    timeSpent: number
  ): void {
    try {
      const progress = this.getPreStudyProgress();

      if (!progress.completedContents.includes(contentId)) {
        progress.completedContents.push(contentId);
        progress.totalContentsStudied++;
      }

      progress.totalTimeSpent += timeSpent;
      progress.averageComprehension =
        (progress.averageComprehension * (progress.totalContentsStudied - 1) +
          comprehensionRating) /
        progress.totalContentsStudied;

      this.savePreStudyProgress(progress);
    } catch (error) {
      logError("Error recording pre-study completion", error);
    }
  }
}
