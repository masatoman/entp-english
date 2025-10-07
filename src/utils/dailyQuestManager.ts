import { CoinSystem, DailyQuest, DailyQuestSystem } from "../types/dailyQuest";

class DailyQuestManager {
  private static instance: DailyQuestManager;
  private questSystem: DailyQuestSystem;
  private coinSystem: CoinSystem;

  private constructor() {
    this.questSystem = this.loadQuestSystem();
    this.coinSystem = this.loadCoinSystem();
    this.checkDailyReset();
  }

  public static getInstance(): DailyQuestManager {
    if (!DailyQuestManager.instance) {
      DailyQuestManager.instance = new DailyQuestManager();
    }
    return DailyQuestManager.instance;
  }

  private loadQuestSystem(): DailyQuestSystem {
    const saved = localStorage.getItem("daily-quest-system");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("デイリークエストシステムの読み込みエラー:", error);
      }
    }

    return {
      currentDate: new Date().toISOString().split("T")[0],
      availableQuests: [],
      completedQuests: [],
      totalQuestsCompleted: 0,
      totalRewardsEarned: { xp: 0, coins: 0 },
      streak: { current: 0, longest: 0, lastCompletionDate: null },
    };
  }

  private loadCoinSystem(): CoinSystem {
    const saved = localStorage.getItem("coin-system");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("コインシステムの読み込みエラー:", error);
      }
    }

    return {
      current: 100, // 初期コイン
      totalEarned: 100,
      totalSpent: 0,
      lastEarned: null,
      sources: {
        quests: 100,
        achievements: 0,
        dailyBonus: 0,
        special: 0,
        challenges: 0,
      },
    };
  }

  private saveQuestSystem(): void {
    localStorage.setItem(
      "daily-quest-system",
      JSON.stringify(this.questSystem)
    );
  }

  private saveCoinSystem(): void {
    localStorage.setItem("coin-system", JSON.stringify(this.coinSystem));
  }

  private checkDailyReset(): void {
    const today = new Date().toISOString().split("T")[0];

    // 日付が変わったか、クエストが空の場合は生成
    if (
      this.questSystem.currentDate !== today ||
      this.questSystem.availableQuests.length === 0
    ) {
      console.log(
        "🔄 デイリークエストリセット:",
        this.questSystem.currentDate,
        "→",
        today,
        "クエスト数:",
        this.questSystem.availableQuests.length
      );
      this.questSystem.currentDate = today;
      this.questSystem.availableQuests = this.generateDailyQuests();
      this.questSystem.completedQuests = [];
      this.saveQuestSystem();

      console.log(
        "✅ デイリークエスト生成完了:",
        this.questSystem.availableQuests.length,
        "個"
      );
    }
  }

  private generateDailyQuests(): DailyQuest[] {
    const questTemplates = [
      // 学習系クエスト
      {
        id: "grammar-basic",
        title: "文法の基礎固め",
        description: "文法クイズを3回完了する",
        icon: "✏️",
        targetType: "grammar" as const,
        targetAmount: 3,
        rewards: [
          { type: "xp" as const, amount: 150, description: "ボーナスXP" },
          { type: "coins" as const, amount: 50, description: "ガチャコイン" },
        ],
        rarity: "common" as const,
        category: "learning" as const,
      },
      {
        id: "vocabulary-master",
        title: "語彙力強化",
        description: "語彙学習で10個の単語を学習する",
        icon: "📚",
        targetType: "vocabulary" as const,
        targetAmount: 10,
        rewards: [
          { type: "xp" as const, amount: 200, description: "ボーナスXP" },
          { type: "coins" as const, amount: 75, description: "ガチャコイン" },
        ],
        rarity: "common" as const,
        category: "learning" as const,
      },
      {
        id: "skill-tree-explorer",
        title: "スキルツリー探索",
        description: "スキルツリーページを訪問する",
        icon: "🌳",
        targetType: "skill-tree" as const,
        targetAmount: 1,
        rewards: [
          { type: "xp" as const, amount: 50, description: "探索ボーナス" },
          { type: "coins" as const, amount: 25, description: "ガチャコイン" },
        ],
        rarity: "common" as const,
        category: "exploration" as const,
      },
      {
        id: "gacha-challenge",
        title: "運試しガチャ",
        description: "ガチャを2回引く",
        icon: "🎁",
        targetType: "gacha" as const,
        targetAmount: 2,
        rewards: [
          { type: "xp" as const, amount: 100, description: "運試しボーナス" },
          { type: "coins" as const, amount: 100, description: "ガチャコイン" },
        ],
        rarity: "rare" as const,
        category: "collection" as const,
      },
      {
        id: "pre-study-theory",
        title: "理論学習",
        description: "事前学習を1つ完了する",
        icon: "⭐️",
        targetType: "pre-study" as const,
        targetAmount: 1,
        rewards: [
          {
            type: "xp" as const,
            amount: 120,
            description: "理論マスターボーナス",
          },
          { type: "coins" as const, amount: 60, description: "ガチャコイン" },
        ],
        rarity: "rare" as const,
        category: "learning" as const,
      },
      {
        id: "synergy-optimizer",
        title: "シナジー効果活用",
        description: "シナジーダッシュボードを確認する",
        icon: "🧠",
        targetType: "synergy" as const,
        targetAmount: 1,
        rewards: [
          { type: "xp" as const, amount: 80, description: "効率化ボーナス" },
          { type: "coins" as const, amount: 40, description: "ガチャコイン" },
        ],
        rarity: "common" as const,
        category: "exploration" as const,
      },
      {
        id: "time-attack-speed",
        title: "スピードマスター",
        description: "タイムアタックで高スコアを狙う",
        icon: "⏰",
        targetType: "time-attack" as const,
        targetAmount: 1,
        rewards: [
          { type: "xp" as const, amount: 180, description: "スピードボーナス" },
          { type: "coins" as const, amount: 80, description: "ガチャコイン" },
        ],
        rarity: "rare" as const,
        category: "challenge" as const,
      },
      {
        id: "essay-creative",
        title: "創造力発揮",
        description: "英作文チャレンジを完了する",
        icon: "✍️",
        targetType: "essay" as const,
        targetAmount: 1,
        rewards: [
          { type: "xp" as const, amount: 250, description: "創造力ボーナス" },
          { type: "coins" as const, amount: 120, description: "ガチャコイン" },
        ],
        rarity: "epic" as const,
        category: "challenge" as const,
      },
      {
        id: "combined-test-master",
        title: "総合力テスト",
        description: "総合テストで80%以上の正解率を達成",
        icon: "🎯",
        targetType: "combined" as const,
        targetAmount: 1,
        rewards: [
          {
            type: "xp" as const,
            amount: 300,
            description: "総合マスターボーナス",
          },
          { type: "coins" as const, amount: 150, description: "ガチャコイン" },
        ],
        rarity: "epic" as const,
        category: "challenge" as const,
      },
      {
        id: "achievement-hunter",
        title: "実績ハンター",
        description: "実績ページで進捗を確認する",
        icon: "🏆",
        targetType: "achievements" as const,
        targetAmount: 1,
        rewards: [
          { type: "xp" as const, amount: 60, description: "探索ボーナス" },
          { type: "coins" as const, amount: 30, description: "ガチャコイン" },
        ],
        rarity: "common" as const,
        category: "exploration" as const,
      },
    ];

    // 毎日3-5個のクエストをランダム選択
    const shuffled = [...questTemplates].sort(() => Math.random() - 0.5);
    const dailyCount = 3 + Math.floor(Math.random() * 3); // 3-5個
    const selectedQuests = shuffled.slice(0, dailyCount);
    const today = new Date().toISOString().split("T")[0];

    return selectedQuests.map((template, index) => ({
      ...template,
      id: `daily_${today}_${template.id}`,
      currentProgress: 0,
      isCompleted: false,
    }));
  }

  public getTodayQuests(): DailyQuest[] {
    this.checkDailyReset();
    return this.questSystem.availableQuests;
  }

  public async updateQuestProgress(
    targetType: DailyQuest["targetType"],
    amount: number = 1
  ): Promise<void> {
    let anyUpdated = false;

    for (const quest of this.questSystem.availableQuests) {
      if (quest.targetType === targetType && !quest.isCompleted) {
        quest.currentProgress = Math.min(
          quest.currentProgress + amount,
          quest.targetAmount
        );

        if (quest.currentProgress >= quest.targetAmount && !quest.isCompleted) {
          quest.isCompleted = true;
          quest.completedAt = new Date().toISOString();
          this.questSystem.completedQuests.push(quest.id);
          this.questSystem.totalQuestsCompleted++;

          // 報酬を付与
          for (const reward of quest.rewards) {
            if (reward.type === "xp") {
              const { getLevelManager } = await import("./levelManager");
              const levelManager = getLevelManager();
              levelManager.addXP(reward.amount);
              this.questSystem.totalRewardsEarned.xp += reward.amount;
            } else if (reward.type === "coins") {
              this.addCoins(reward.amount, "quests");
              this.questSystem.totalRewardsEarned.coins += reward.amount;
            }
          }

          // ストリーク更新
          this.updateStreak();

          console.log("🎯 デイリークエスト完了:", {
            quest: quest.title,
            rewards: quest.rewards,
            totalCompleted: this.questSystem.totalQuestsCompleted,
          });

          anyUpdated = true;
        }
      }
    }

    if (anyUpdated) {
      this.saveQuestSystem();
    }
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (this.questSystem.streak.lastCompletionDate === yesterday) {
      this.questSystem.streak.current++;
    } else if (this.questSystem.streak.lastCompletionDate !== today) {
      this.questSystem.streak.current = 1;
    }

    this.questSystem.streak.longest = Math.max(
      this.questSystem.streak.longest,
      this.questSystem.streak.current
    );
    this.questSystem.streak.lastCompletionDate = today;
  }

  public getQuestSystem(): DailyQuestSystem {
    this.checkDailyReset();
    return this.questSystem;
  }

  // コインシステム
  public getCoinSystem(): CoinSystem {
    return this.coinSystem;
  }

  public addCoins(amount: number, source: keyof CoinSystem["sources"]): void {
    const oldTotal = this.coinSystem.current;
    this.coinSystem.current += amount;
    this.coinSystem.totalEarned += amount;
    this.coinSystem.sources[source] += amount;
    this.coinSystem.lastEarned = new Date().toISOString();
    this.saveCoinSystem();

    console.log("🪙 コイン獲得:", {
      amount,
      source,
      oldTotal,
      newTotal: this.coinSystem.current,
      sources: this.coinSystem.sources,
    });
  }

  public spendCoins(amount: number): boolean {
    if (this.coinSystem.current >= amount) {
      this.coinSystem.current -= amount;
      this.coinSystem.totalSpent += amount;
      this.saveCoinSystem();

      console.log("🪙 コイン消費:", {
        amount,
        remaining: this.coinSystem.current,
      });

      return true;
    }
    return false;
  }

  public canAffordCoins(amount: number): boolean {
    return this.coinSystem.current >= amount;
  }

  // 特定アクションでクエスト進捗を更新
  public async recordGrammarQuizCompletion(): Promise<void> {
    await this.updateQuestProgress("grammar", 1);
  }

  public async recordVocabularyLearning(wordsLearned: number): Promise<void> {
    await this.updateQuestProgress("vocabulary", wordsLearned);
  }

  public async recordCombinedTestCompletion(): Promise<void> {
    await this.updateQuestProgress("combined", 1);
  }

  public async recordTimeAttackCompletion(): Promise<void> {
    await this.updateQuestProgress("time-attack", 1);
  }

  public async recordEssayCompletion(): Promise<void> {
    await this.updateQuestProgress("essay", 1);
  }

  public async recordSkillTreeVisit(): Promise<void> {
    await this.updateQuestProgress("skill-tree", 1);
  }

  public async recordGachaUsage(): Promise<void> {
    await this.updateQuestProgress("gacha", 1);
  }

  public async recordPreStudyCompletion(): Promise<void> {
    await this.updateQuestProgress("pre-study", 1);
  }

  public async recordSynergyVisit(): Promise<void> {
    await this.updateQuestProgress("synergy", 1);
  }

  public async recordAchievementsVisit(): Promise<void> {
    await this.updateQuestProgress("achievements", 1);
  }

  // クエスト完了状況の統計
  public getCompletionStats(): {
    completed: number;
    total: number;
    percentage: number;
    streak: number;
  } {
    const completed = this.questSystem.completedQuests.length;
    const total = this.questSystem.availableQuests.length;

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      streak: this.questSystem.streak.current,
    };
  }

  // 報酬受け取り
  public claimQuestRewards(questId: string): boolean {
    const quest = this.questSystem.availableQuests.find(
      (q) => q.id === questId
    );
    if (quest && quest.isCompleted) {
      // 報酬は完了時に自動付与されるため、ここでは表示用のフラグ管理のみ
      return true;
    }
    return false;
  }
}

export const dailyQuestManager = DailyQuestManager.getInstance();
