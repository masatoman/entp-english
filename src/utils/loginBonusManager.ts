import { dailyQuestManager } from "./dailyQuestManager";

export interface LoginBonusData {
  lastLoginDate: string | null;
  consecutiveDays: number;
  totalLogins: number;
  totalCoinsEarned: number;
  bonusHistory: {
    date: string;
    coins: number;
    consecutiveDays: number;
  }[];
}

const DAILY_LOGIN_BONUS_COINS = 2; // 毎日2コイン

class LoginBonusManager {
  private static instance: LoginBonusManager;
  private bonusData: LoginBonusData;

  private constructor() {
    this.bonusData = this.loadBonusData();
    this.checkAndApplyLoginBonus();
  }

  public static getInstance(): LoginBonusManager {
    if (!LoginBonusManager.instance) {
      LoginBonusManager.instance = new LoginBonusManager();
    }
    return LoginBonusManager.instance;
  }

  private loadBonusData(): LoginBonusData {
    const saved = localStorage.getItem("login-bonus-data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("ログインボーナスデータの読み込みエラー:", error);
      }
    }

    return {
      lastLoginDate: null,
      consecutiveDays: 0,
      totalLogins: 0,
      totalCoinsEarned: 0,
      bonusHistory: [],
    };
  }

  private saveBonusData(): void {
    localStorage.setItem("login-bonus-data", JSON.stringify(this.bonusData));
  }

  private getTodayString(): string {
    return new Date().toISOString().split("T")[0];
  }

  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  private checkAndApplyLoginBonus(): void {
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();

    // 今日すでにログインボーナスを受け取っている場合は何もしない
    if (this.bonusData.lastLoginDate === today) {
      console.log("🎁 本日のログインボーナスは受け取り済みです");
      return;
    }

    // 連続ログイン日数を更新
    if (this.bonusData.lastLoginDate === yesterday) {
      // 連続ログイン継続
      this.bonusData.consecutiveDays += 1;
      console.log(`🔥 連続ログイン ${this.bonusData.consecutiveDays} 日目！`);
    } else if (this.bonusData.lastLoginDate !== null) {
      // 連続ログイン途切れ
      console.log("💔 連続ログインが途切れました。リセットします。");
      this.bonusData.consecutiveDays = 1;
    } else {
      // 初回ログイン
      this.bonusData.consecutiveDays = 1;
      console.log("🎉 初回ログイン！");
    }

    // ログインボーナスを付与
    dailyQuestManager.addCoins(DAILY_LOGIN_BONUS_COINS, "dailyBonus");

    // データを更新
    this.bonusData.lastLoginDate = today;
    this.bonusData.totalLogins += 1;
    this.bonusData.totalCoinsEarned += DAILY_LOGIN_BONUS_COINS;
    this.bonusData.bonusHistory.push({
      date: today,
      coins: DAILY_LOGIN_BONUS_COINS,
      consecutiveDays: this.bonusData.consecutiveDays,
    });

    // 履歴は最新30日分のみ保持
    if (this.bonusData.bonusHistory.length > 30) {
      this.bonusData.bonusHistory = this.bonusData.bonusHistory.slice(-30);
    }

    this.saveBonusData();

    console.log(
      `🎁 ログインボーナス: ${DAILY_LOGIN_BONUS_COINS}コイン獲得！`,
      {
        連続ログイン: this.bonusData.consecutiveDays,
        累計ログイン: this.bonusData.totalLogins,
        累計獲得コイン: this.bonusData.totalCoinsEarned,
      }
    );
  }

  /**
   * 今日のログインボーナス受け取り状況を確認
   */
  public hasReceivedTodayBonus(): boolean {
    return this.bonusData.lastLoginDate === this.getTodayString();
  }

  /**
   * ログインボーナスデータを取得
   */
  public getBonusData(): LoginBonusData {
    return { ...this.bonusData };
  }

  /**
   * 今日のログインボーナス情報を取得
   */
  public getTodayBonusInfo(): {
    received: boolean;
    coins: number;
    consecutiveDays: number;
  } {
    const received = this.hasReceivedTodayBonus();
    return {
      received,
      coins: DAILY_LOGIN_BONUS_COINS,
      consecutiveDays: this.bonusData.consecutiveDays,
    };
  }
}

// シングルトンインスタンスをエクスポート
export const loginBonusManager = LoginBonusManager.getInstance();

