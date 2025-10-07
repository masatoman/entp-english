/**
 * ソーシャル機能システム
 * ランキング・共有・競争・協力学習機能の基盤
 */

import { handleError } from "./errorHandler";
import { logInfo, logUser } from "./logger";

export interface UserProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  level: number;
  totalXP: number;
  badges: Badge[];
  learningStreak: number;
  joinDate: string;
  lastActive: string;
  privacy: PrivacySettings;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedDate: string;
}

export interface PrivacySettings {
  showProfile: boolean;
  showProgress: boolean;
  showRanking: boolean;
  allowFriendRequests: boolean;
  shareAchievements: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  score: number;
  change: number; // 前回からの変動
  badge?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  averageLevel: number;
  isPublic: boolean;
  tags: string[];
  createdDate: string;
  lastActivity: string;
}

export interface ChallengeEvent {
  id: string;
  title: string;
  description: string;
  type: "individual" | "group" | "global";
  startDate: string;
  endDate: string;
  participants: number;
  rewards: EventReward[];
  rules: string[];
  status: "upcoming" | "active" | "completed";
}

export interface EventReward {
  rank: number;
  xpBonus: number;
  specialBadge?: Badge;
  title?: string;
}

export class SocialFeatures {
  private static readonly PROFILE_KEY = "entp-user-profile";
  private static readonly STUDY_GROUPS_KEY = "entp-study-groups";

  /**
   * ユーザープロファイルの作成・更新
   */
  static createUserProfile(
    userId: string,
    displayName: string,
    privacySettings?: Partial<PrivacySettings>
  ): UserProfile {
    try {
      const defaultPrivacy: PrivacySettings = {
        showProfile: true,
        showProgress: true,
        showRanking: true,
        allowFriendRequests: true,
        shareAchievements: true,
        ...privacySettings,
      };

      const profile: UserProfile = {
        userId,
        displayName,
        level: 1,
        totalXP: 0,
        badges: [],
        learningStreak: 0,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        privacy: defaultPrivacy,
      };

      this.saveUserProfile(profile);

      logUser("ユーザープロファイル作成", { userId, displayName });
      return profile;
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "create-user-profile",
        userId,
      });
      throw error;
    }
  }

  /**
   * ランキングシステム
   */
  static generateLeaderboard(
    type: "daily" | "weekly" | "monthly" | "all-time",
    category?: "vocabulary" | "grammar" | "overall"
  ): LeaderboardEntry[] {
    try {
      // 実際の実装ではサーバーサイドで集計
      // ここではモックデータを生成

      const mockEntries: LeaderboardEntry[] = [
        {
          rank: 1,
          userId: "user-001",
          displayName: "EnglishMaster",
          score: 2500,
          change: 5,
          badge: "👑",
        },
        {
          rank: 2,
          userId: "user-002",
          displayName: "GrammarGuru",
          score: 2350,
          change: 2,
          badge: "🎓",
        },
        {
          rank: 3,
          userId: "user-003",
          displayName: "VocabVirtuoso",
          score: 2200,
          change: -1,
          badge: "📚",
        },
        {
          rank: 4,
          userId: "user-004",
          displayName: "StudyStreak",
          score: 2100,
          change: 3,
          badge: "🔥",
        },
        {
          rank: 5,
          userId: "user-005",
          displayName: "QuizQueen",
          score: 2000,
          change: 0,
          badge: "⚡",
        },
      ];

      logInfo("ランキング生成", { category, entriesCount: mockEntries.length });
      return mockEntries;
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "generate-leaderboard",
        type,
        category,
      });
      return [];
    }
  }

  /**
   * 学習グループ機能
   */
  static createStudyGroup(
    name: string,
    description: string,
    isPublic: boolean = true,
    tags: string[] = []
  ): StudyGroup {
    try {
      const group: StudyGroup = {
        id: `group-${Date.now()}`,
        name,
        description,
        memberCount: 1,
        averageLevel: 1,
        isPublic,
        tags,
        createdDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };

      this.saveStudyGroup(group);

      logUser("学習グループ作成", { groupId: group.id, name, isPublic });
      return group;
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "create-study-group",
        name,
      });
      throw error;
    }
  }

  /**
   * チャレンジイベントシステム
   */
  static generateChallengeEvents(): ChallengeEvent[] {
    try {
      const events: ChallengeEvent[] = [
        {
          id: "weekly-vocab-challenge",
          title: "週間語彙チャレンジ",
          description: "1週間で100個の新しい単語を学習しよう！",
          type: "global",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 1247,
          rewards: [
            {
              rank: 1,
              xpBonus: 1000,
              specialBadge: {
                id: "vocab-champion",
                name: "語彙王",
                description: "週間語彙チャレンジ優勝",
                icon: "👑",
                rarity: "legendary",
                earnedDate: "",
              },
            },
            { rank: 2, xpBonus: 750, title: "語彙マスター" },
            { rank: 3, xpBonus: 500, title: "語彙エキスパート" },
          ],
          rules: [
            "新しく学習した単語のみカウント",
            "既知単語は対象外",
            "毎日の学習が推奨されます",
          ],
          status: "active",
        },
        {
          id: "grammar-accuracy-challenge",
          title: "文法正確性チャレンジ",
          description: "文法クイズで90%以上の正答率を目指そう！",
          type: "individual",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 856,
          rewards: [
            {
              rank: 1,
              xpBonus: 500,
              specialBadge: {
                id: "grammar-perfectionist",
                name: "文法完璧主義者",
                description: "90%以上の正答率達成",
                icon: "🎯",
                rarity: "epic",
                earnedDate: "",
              },
            },
          ],
          rules: [
            "最低20問の回答が必要",
            "全カテゴリーからの出題",
            "制限時間内での回答",
          ],
          status: "active",
        },
      ];

      logInfo("チャレンジイベント生成");
      return events;
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "generate-challenge-events",
      });
      return [];
    }
  }

  /**
   * 学習成果の共有
   */
  static shareAchievement(
    userId: string,
    achievementType: "level-up" | "streak" | "perfect-score" | "badge-earned",
    details: any,
    platforms: Array<"twitter" | "facebook" | "line" | "email"> = ["twitter"]
  ): {
    success: boolean;
    sharedPlatforms: string[];
    shareUrls: Record<string, string>;
  } {
    try {
      const shareContent = this.generateShareContent(achievementType, details);
      const shareUrls: Record<string, string> = {};
      const sharedPlatforms: string[] = [];

      platforms.forEach((platform) => {
        const url = this.generateShareUrl(platform, shareContent);
        if (url) {
          shareUrls[platform] = url;
          sharedPlatforms.push(platform);
        }
      });

      logUser("学習成果共有", {
        userId,
        achievementType,
        platforms: sharedPlatforms,
      });

      return {
        success: sharedPlatforms.length > 0,
        sharedPlatforms,
        shareUrls,
      };
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "share-achievement",
        userId,
        achievementType,
      });
      return {
        success: false,
        sharedPlatforms: [],
        shareUrls: {},
      };
    }
  }

  /**
   * フレンドシステム（基盤）
   */
  static addFriend(
    userId: string,
    friendId: string
  ): {
    success: boolean;
    status: "sent" | "accepted" | "already-friends" | "error";
  } {
    try {
      // 実際の実装ではサーバーサイドで管理
      logUser("フレンド追加", { userId, friendId });

      return {
        success: true,
        status: "sent",
      };
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "add-friend",
        userId,
        friendId,
      });
      return {
        success: false,
        status: "error",
      };
    }
  }

  /**
   * 協力学習セッション
   */
  static startCollaborativeLearning(
    groupId: string,
    sessionType: "vocabulary-battle" | "grammar-relay" | "translation-contest"
  ): {
    sessionId: string;
    participants: string[];
    rules: string[];
    timeLimit: number;
  } {
    try {
      const sessionId = `collab-${Date.now()}-${groupId}`;

      const sessionConfig = {
        sessionId,
        participants: ["user-001", "user-002"], // モックデータ
        rules: this.getCollaborativeRules(sessionType),
        timeLimit: this.getSessionTimeLimit(sessionType),
      };

      logUser("協力学習セッション開始", {
        sessionId,
        groupId,
        sessionType,
        participantCount: sessionConfig.participants.length,
      });

      return sessionConfig;
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "start-collaborative-learning",
        groupId,
        sessionType,
      });
      throw error;
    }
  }

  // ヘルパーメソッド

  private static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(
        `${this.PROFILE_KEY}-${profile.userId}`,
        JSON.stringify(profile)
      );
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "save-user-profile",
        userId: profile.userId,
      });
    }
  }

  private static saveStudyGroup(group: StudyGroup): void {
    try {
      const stored = localStorage.getItem(this.STUDY_GROUPS_KEY);
      const groups: StudyGroup[] = stored ? JSON.parse(stored) : [];
      groups.push(group);
      localStorage.setItem(this.STUDY_GROUPS_KEY, JSON.stringify(groups));
    } catch (error) {
      handleError(error as Error, {
        component: "SocialFeatures",
        action: "save-study-group",
        groupId: group.id,
      });
    }
  }

  private static generateShareContent(type: string, details: any): string {
    const templates = {
      "level-up": `🎉 レベル${details.newLevel}に到達しました！ ENTP英語学習アプリで英語力向上中！`,
      streak: `🔥 ${details.days}日連続学習達成！継続は力なり！`,
      "perfect-score": `💯 完璧なスコアを獲得しました！${details.category}で満点達成！`,
      "badge-earned": `🏆 新しいバッジ「${details.badgeName}」を獲得しました！`,
    };

    return (
      templates[type as keyof typeof templates] ||
      "英語学習で新しい成果を達成しました！"
    );
  }

  private static generateShareUrl(
    platform: string,
    content: string
  ): string | null {
    const encodedContent = encodeURIComponent(content);
    const appUrl = encodeURIComponent("https://entp-english.netlify.app");

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedContent}&url=${appUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encodedContent}`,
      line: `https://social-plugins.line.me/lineit/share?url=${appUrl}&text=${encodedContent}`,
      email: `mailto:?subject=英語学習の成果&body=${encodedContent}%0A%0A${appUrl}`,
    };

    return urls[platform as keyof typeof urls] || null;
  }

  private static getCollaborativeRules(sessionType: string): string[] {
    const rules = {
      "vocabulary-battle": [
        "制限時間内により多くの単語を正解する",
        "同じ単語は1回のみカウント",
        "最高スコア者が勝利",
      ],
      "grammar-relay": [
        "チームメンバーが順番に問題を解く",
        "間違えた場合は次のメンバーに交代",
        "チーム全体のスコアで競争",
      ],
      "translation-contest": [
        "日本語文を英語に翻訳",
        "文法・語彙・自然さで評価",
        "最も優秀な翻訳が勝利",
      ],
    };

    return (
      rules[sessionType as keyof typeof rules] || [
        "基本的なルールに従ってください",
      ]
    );
  }

  private static getSessionTimeLimit(sessionType: string): number {
    const timeLimits = {
      "vocabulary-battle": 10 * 60, // 10分
      "grammar-relay": 15 * 60, // 15分
      "translation-contest": 20 * 60, // 20分
    };

    return timeLimits[sessionType as keyof typeof timeLimits] || 10 * 60;
  }
}
