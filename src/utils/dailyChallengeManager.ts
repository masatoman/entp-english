import { DailyChallenge, DailyChallengeProgress } from "../types";
import { dailyQuestManager } from "./dailyQuestManager";
import { DataManager } from "./dataManager";

const DAILY_CHALLENGE_KEY = "entp-daily-challenge";

/**
 * 今日のスペシャルチャレンジ管理システム
 * ENTPの新奇性追求と変化への欲求に対応
 */
export class DailyChallengeManager {
  /**
   * 今日のチャレンジを取得（存在しない場合は生成）
   */
  static getTodayChallenge(): DailyChallenge {
    const today = this.getTodayString();
    const progress = this.getProgress();

    // 今日のチャレンジが既に存在する場合
    if (progress.currentChallenge && progress.currentChallenge.date === today) {
      return progress.currentChallenge;
    }

    // 新しいチャレンジを生成
    const newChallenge = this.generateDailyChallenge(today);
    this.saveProgress({
      ...progress,
      currentChallenge: newChallenge,
    });

    return newChallenge;
  }

  /**
   * 日替わりチャレンジを生成
   */
  private static generateDailyChallenge(date: string): DailyChallenge {
    const challenges = this.getChallengeTemplates();

    // 日付をシードとしてランダム選択（同じ日は同じチャレンジ）
    const seed = this.dateToSeed(date);
    const selectedTemplate = challenges[seed % challenges.length];

    return {
      ...selectedTemplate,
      id: `challenge-${date}`,
      date,
      isCompleted: false,
    };
  }

  /**
   * チャレンジテンプレート一覧
   */
  private static getChallengeTemplates(): Omit<
    DailyChallenge,
    "id" | "date" | "isCompleted"
  >[] {
    return [
      {
        name: "スピードマスター",
        description: "制限時間半分で語彙学習をクリア！",
        type: "vocabulary",
        rules: [
          {
            type: "time-limit",
            value: 30,
            description: "1単語あたり30秒以内で回答",
          },
          {
            type: "accuracy-target",
            value: 80,
            description: "正解率80%以上を維持",
          },
        ],
        bonusXP: 50,
        bonusMultiplier: 1.5,
        icon: "⚡",
        color: "bg-yellow-500",
      },
      {
        name: "完璧主義者",
        description: "文法クイズで100%の正解率を目指そう！",
        type: "grammar",
        rules: [
          {
            type: "accuracy-target",
            value: 100,
            description: "正解率100%でクリア",
          },
          {
            type: "word-count",
            value: 5,
            description: "最低5問解答",
          },
        ],
        bonusXP: 75,
        bonusMultiplier: 2.0,
        icon: "🎯",
        color: "bg-red-500",
      },
      {
        name: "創造力テスト",
        description: "学んだ単語で短いストーリーを作ろう！",
        type: "creative",
        rules: [
          {
            type: "word-count",
            value: 5,
            description: "今日学んだ単語を5個以上使用",
          },
          {
            type: "special-mode",
            value: "creative-writing",
            description: "英語で50文字以上のストーリー",
          },
        ],
        bonusXP: 200,
        bonusMultiplier: 5.0,
        icon: "✨",
        color: "bg-purple-500",
      },
      {
        name: "効率の鬼",
        description: "最短時間で最大XPを獲得せよ！",
        type: "efficiency",
        rules: [
          {
            type: "time-limit",
            value: 300,
            description: "5分以内に学習完了",
          },
          {
            type: "accuracy-target",
            value: 90,
            description: "正解率90%以上",
          },
        ],
        bonusXP: 60,
        bonusMultiplier: 1.8,
        icon: "🚀",
        color: "bg-blue-500",
      },
      {
        name: "逆転の発想",
        description: "間違いから学ぶ！あえて難しい問題に挑戦",
        type: "grammar",
        rules: [
          {
            type: "special-mode",
            value: "hard-mode",
            description: "上級レベルの問題のみ",
          },
          {
            type: "accuracy-target",
            value: 70,
            description: "正解率70%以上で合格",
          },
        ],
        bonusXP: 80,
        bonusMultiplier: 2.2,
        icon: "🔄",
        color: "bg-green-500",
      },
      {
        name: "タイムアタッカー",
        description: "タイムアタックで連続正解記録を作ろう！",
        type: "time-attack",
        rules: [
          {
            type: "word-count",
            value: 5,
            description: "連続5問正解",
          },
          {
            type: "time-limit",
            value: 120,
            description: "2分以内で達成",
          },
        ],
        bonusXP: 70,
        bonusMultiplier: 1.7,
        icon: "⏱️",
        color: "bg-orange-500",
      },
      {
        name: "語彙コレクター",
        description: "新しい単語を20個覚えよう！",
        type: "vocabulary",
        rules: [
          {
            type: "word-count",
            value: 20,
            description: "新しい単語を20個学習",
          },
          {
            type: "accuracy-target",
            value: 85,
            description: "平均正解率85%以上",
          },
        ],
        bonusXP: 90,
        bonusMultiplier: 2.0,
        icon: "📚",
        color: "bg-indigo-500",
      },
    ];
  }

  /**
   * チャレンジの進捗状況を取得
   */
  static getProgress(): DailyChallengeProgress {
    try {
      const data = localStorage.getItem(DAILY_CHALLENGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("デイリーチャレンジ進捗読み込みエラー:", error);
    }

    return {
      currentChallenge: null,
      completedChallenges: [],
      streakCount: 0,
      totalCompleted: 0,
      lastCompletedDate: "",
    };
  }

  /**
   * チャレンジが完了可能かチェック
   */
  static canCompleteChallenge(
    challenge: DailyChallenge,
    sessionData: {
      accuracy: number;
      timeSpent: number; // 秒
      questionsAnswered: number;
      difficulty: string;
      mode?: string;
    }
  ): boolean {
    return challenge.rules.every((rule) => {
      switch (rule.type) {
        case "accuracy-target":
          return sessionData.accuracy * 100 >= (rule.value as number);

        case "time-limit":
          return sessionData.timeSpent <= (rule.value as number);

        case "word-count":
          return sessionData.questionsAnswered >= (rule.value as number);

        case "special-mode":
          if (rule.value === "hard-mode") {
            return sessionData.difficulty === "advanced";
          }
          if (rule.value === "creative-writing") {
            return sessionData.mode === "creative";
          }
          return true;

        default:
          return true;
      }
    });
  }

  /**
   * チャレンジの説明文を生成
   */
  static getChallengeDescription(challenge: DailyChallenge): string {
    const ruleDescriptions = challenge.rules.map((rule) => rule.description);
    return `${challenge.description}\n\n条件:\n${ruleDescriptions
      .map((desc, i) => `${i + 1}. ${desc}`)
      .join("\n")}`;
  }

  /**
   * 日付を文字列に変換
   */
  private static getTodayString(): string {
    return new Date().toISOString().split("T")[0];
  }

  /**
   * 昨日の日付を文字列に変換
   */
  private static getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  /**
   * 日付文字列をシード値に変換
   */
  private static dateToSeed(dateString: string): number {
    return dateString
      .split("-")
      .map(Number)
      .reduce((sum, num) => sum + num, 0);
  }

  /**
   * チャレンジを完了
   */
  static completeChallenge(sessionData: {
    xpEarned: number;
    timeSpent: number;
    wordsUsed?: number;
    storyLength?: number;
    accuracy?: number;
    questionsAnswered?: number;
  }): void {
    const progress = this.getProgress();
    const today = this.getTodayString();

    if (progress.currentChallenge && progress.currentChallenge.date === today) {
      // チャレンジを完了状態に
      progress.currentChallenge.isCompleted = true;
      progress.completedChallenges.push({
        ...progress.currentChallenge,
        completedAt: new Date().toISOString(),
        sessionData,
      });

      // 統計更新
      progress.totalCompleted += 1;
      progress.lastCompletedDate = today;

      // 連続日数計算
      if (progress.lastCompletedDate === this.getYesterdayString()) {
        progress.streakCount += 1;
      } else {
        progress.streakCount = 1;
      }

      // コイン報酬を付与
      const coinReward = this.calculateCoinReward(progress.currentChallenge);
      dailyQuestManager.addCoins(coinReward, "challenges");

      console.log("🎯 デイリーチャレンジ完了:", {
        challenge: progress.currentChallenge.name,
        coinReward,
        streak: progress.streakCount,
      });

      this.saveProgress(progress);
    }
  }

  /**
   * チャレンジ完了時のコイン報酬を計算
   */
  private static calculateCoinReward(challenge: DailyChallenge): number {
    // 基本報酬 + ボーナスXPに基づく追加報酬
    const baseReward = 50;
    const bonusReward = Math.floor(challenge.bonusXP / 10);
    return baseReward + bonusReward;
  }

  /**
   * 進捗を保存
   */
  private static saveProgress(progress: DailyChallengeProgress): void {
    try {
      localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("デイリーチャレンジ進捗保存エラー:", error);
    }
  }

  /**
   * チャレンジ統計を取得
   */
  static getStats(): {
    currentStreak: number;
    totalCompleted: number;
    completionRate: number;
    favoriteType: string;
  } {
    const progress = this.getProgress();
    const today = this.getTodayString();

    // ユーザー統計を取得
    const userStats = DataManager.getUserStats();

    // 完了率計算（過去30日間）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentChallenges = progress.completedChallenges.filter(
      (challenge) => {
        // challengeがオブジェクトの場合はdateプロパティを、文字列の場合はsplitを使用
        let challengeDate: string;
        if (typeof challenge === "string") {
          challengeDate = challenge.split("-")[1] || challenge;
        } else {
          challengeDate = challenge.date || "";
        }
        return challengeDate >= thirtyDaysAgo.toISOString().split("T")[0];
      }
    );

    const completionRate = recentChallenges.length / 30;

    return {
      currentStreak: progress.streakCount,
      totalCompleted: progress.totalCompleted,
      completionRate: Math.min(completionRate, 1),
      favoriteType: this.calculateFavoriteType(userStats),
    };
  }

  /**
   * ユーザーの好みのタイプを計算
   */
  private static calculateFavoriteType(
    userStats: any
  ): "vocabulary" | "grammar" | "combined" {
    if (!userStats) return "vocabulary";

    const vocabStudied = userStats.vocabularyStudied || 0;
    const grammarCompleted = userStats.grammarQuizzesCompleted || 0;
    const combinedCompleted = userStats.combinedTestsCompleted || 0;

    if (
      combinedCompleted > vocabStudied &&
      combinedCompleted > grammarCompleted
    ) {
      return "combined";
    } else if (grammarCompleted > vocabStudied) {
      return "grammar";
    } else {
      return "vocabulary";
    }
  }
}
