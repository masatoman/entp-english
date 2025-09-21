export interface DailyQuestReward {
  type: "xp" | "coins";
  amount: number;
  description: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetType: "grammar" | "vocabulary" | "combined" | "time-attack" | "essay" | "skill-tree" | "gacha" | "pre-study" | "synergy" | "achievements";
  targetAmount: number;
  currentProgress: number;
  rewards: DailyQuestReward[];
  isCompleted: boolean;
  completedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "learning" | "exploration" | "challenge" | "collection";
}

export interface DailyQuestProgress {
  questId: string;
  progress: number;
  isCompleted: boolean;
  completedAt?: string;
  rewardsClaimed: boolean;
}

export interface DailyQuestSystem {
  currentDate: string;
  availableQuests: DailyQuest[];
  completedQuests: string[];
  totalQuestsCompleted: number;
  totalRewardsEarned: {
    xp: number;
    coins: number;
  };
  streak: {
    current: number;
    longest: number;
    lastCompletionDate: string | null;
  };
}

export interface CoinSystem {
  current: number;
  totalEarned: number;
  totalSpent: number;
  lastEarned: string | null;
  sources: {
    quests: number;
    achievements: number;
    dailyBonus: number;
    special: number;
  };
}
