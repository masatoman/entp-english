/**
 * リスニング学習関連のアチーブメントデータ
 */

export interface ListeningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "completion" | "score" | "streak" | "volume";
  condition: {
    type:
      | "session_complete"
      | "perfect_score"
      | "consecutive_days"
      | "questions_answered"
      | "part_complete";
    value: number;
    part?: "part1" | "part2" | "part3" | "part4" | "all";
    difficulty?: "beginner" | "intermediate" | "advanced" | "all";
  };
  reward: {
    xp: number;
    coins?: number;
    items?: { id: string; quantity: number }[];
  };
  rarity: "common" | "rare" | "epic" | "legendary";
  isHidden: boolean; // 条件を満たすまで非表示
}

// 完走アチーブメント
export const completionAchievements: ListeningAchievement[] = [
  {
    id: "listening_first_session",
    title: "リスニングデビュー",
    description: "初回リスニング学習を完了しました",
    icon: "🎧",
    category: "completion",
    condition: {
      type: "session_complete",
      value: 1,
    },
    reward: {
      xp: 50,
      coins: 10,
    },
    rarity: "common",
    isHidden: false,
  },
  {
    id: "part1_master",
    title: "Part 1 マスター",
    description: "Part 1を10回完了しました",
    icon: "📷",
    category: "completion",
    condition: {
      type: "part_complete",
      value: 10,
      part: "part1",
    },
    reward: {
      xp: 200,
      coins: 50,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "part2_master",
    title: "Part 2 マスター",
    description: "Part 2を10回完了しました",
    icon: "💬",
    category: "completion",
    condition: {
      type: "part_complete",
      value: 10,
      part: "part2",
    },
    reward: {
      xp: 200,
      coins: 50,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "part3_master",
    title: "Part 3 マスター",
    description: "Part 3を10回完了しました",
    icon: "👥",
    category: "completion",
    condition: {
      type: "part_complete",
      value: 10,
      part: "part3",
    },
    reward: {
      xp: 200,
      coins: 50,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "part4_master",
    title: "Part 4 マスター",
    description: "Part 4を10回完了しました",
    icon: "📻",
    category: "completion",
    condition: {
      type: "part_complete",
      value: 10,
      part: "part4",
    },
    reward: {
      xp: 200,
      coins: 50,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "listening_grand_master",
    title: "リスニンググランドマスター",
    description: "全Partを10回ずつ完了しました",
    icon: "👑",
    category: "completion",
    condition: {
      type: "part_complete",
      value: 40, // 全Part × 10回
      part: "all",
    },
    reward: {
      xp: 1000,
      coins: 200,
    },
    rarity: "legendary",
    isHidden: false,
  },
];

// スコアアチーブメント
export const scoreAchievements: ListeningAchievement[] = [
  {
    id: "first_perfect",
    title: "完璧デビュー",
    description: "初回100%正解を達成しました",
    icon: "💯",
    category: "score",
    condition: {
      type: "perfect_score",
      value: 1,
    },
    reward: {
      xp: 100,
      coins: 20,
    },
    rarity: "common",
    isHidden: false,
  },
  {
    id: "perfect_streak_3",
    title: "完璧の3連続",
    description: "100%正解を3回連続で達成しました",
    icon: "🔥",
    category: "score",
    condition: {
      type: "perfect_score",
      value: 3,
    },
    reward: {
      xp: 300,
      coins: 75,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "perfect_streak_10",
    title: "完璧の10連続",
    description: "100%正解を10回連続で達成しました",
    icon: "⭐",
    category: "score",
    condition: {
      type: "perfect_score",
      value: 10,
    },
    reward: {
      xp: 1000,
      coins: 200,
    },
    rarity: "epic",
    isHidden: false,
  },
  {
    id: "listening_perfectionist",
    title: "リスニング完璧主義者",
    description: "100%正解を50回達成しました",
    icon: "💎",
    category: "score",
    condition: {
      type: "perfect_score",
      value: 50,
    },
    reward: {
      xp: 2500,
      coins: 500,
    },
    rarity: "legendary",
    isHidden: false,
  },
];

// 継続アチーブメント
export const streakAchievements: ListeningAchievement[] = [
  {
    id: "listening_streak_3",
    title: "リスニング継続者",
    description: "3日連続でリスニング学習を行いました",
    icon: "📅",
    category: "streak",
    condition: {
      type: "consecutive_days",
      value: 3,
    },
    reward: {
      xp: 150,
      coins: 30,
    },
    rarity: "common",
    isHidden: false,
  },
  {
    id: "listening_streak_7",
    title: "リスニング習慣化",
    description: "7日連続でリスニング学習を行いました",
    icon: "🗓️",
    category: "streak",
    condition: {
      type: "consecutive_days",
      value: 7,
    },
    reward: {
      xp: 400,
      coins: 100,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "listening_streak_30",
    title: "リスニング達人",
    description: "30日連続でリスニング学習を行いました",
    icon: "🏆",
    category: "streak",
    condition: {
      type: "consecutive_days",
      value: 30,
    },
    reward: {
      xp: 2000,
      coins: 500,
    },
    rarity: "epic",
    isHidden: false,
  },
  {
    id: "listening_legend",
    title: "リスニング伝説",
    description: "100日連続でリスニング学習を行いました",
    icon: "🌟",
    category: "streak",
    condition: {
      type: "consecutive_days",
      value: 100,
    },
    reward: {
      xp: 10000,
      coins: 2000,
    },
    rarity: "legendary",
    isHidden: false,
  },
];

// 学習量アチーブメント
export const volumeAchievements: ListeningAchievement[] = [
  {
    id: "listening_beginner",
    title: "リスニング初心者",
    description: "リスニング問題を10問回答しました",
    icon: "🌱",
    category: "volume",
    condition: {
      type: "questions_answered",
      value: 10,
    },
    reward: {
      xp: 100,
      coins: 25,
    },
    rarity: "common",
    isHidden: false,
  },
  {
    id: "listening_learner",
    title: "リスニング学習者",
    description: "リスニング問題を50問回答しました",
    icon: "📚",
    category: "volume",
    condition: {
      type: "questions_answered",
      value: 50,
    },
    reward: {
      xp: 300,
      coins: 75,
    },
    rarity: "rare",
    isHidden: false,
  },
  {
    id: "listening_student",
    title: "リスニング学生",
    description: "リスニング問題を100問回答しました",
    icon: "🎓",
    category: "volume",
    condition: {
      type: "questions_answered",
      value: 100,
    },
    reward: {
      xp: 600,
      coins: 150,
    },
    rarity: "epic",
    isHidden: false,
  },
  {
    id: "listening_scholar",
    title: "リスニング学者",
    description: "リスニング問題を500問回答しました",
    icon: "🎖️",
    category: "volume",
    condition: {
      type: "questions_answered",
      value: 500,
    },
    reward: {
      xp: 3000,
      coins: 750,
    },
    rarity: "legendary",
    isHidden: false,
  },
];

// 全アチーブメントを統合
export const allListeningAchievements: ListeningAchievement[] = [
  ...completionAchievements,
  ...scoreAchievements,
  ...streakAchievements,
  ...volumeAchievements,
];

// カテゴリー別アチーブメント取得
export function getListeningAchievementsByCategory(
  category: string
): ListeningAchievement[] {
  return allListeningAchievements.filter(
    (achievement) => achievement.category === category
  );
}

// ID別アチーブメント取得
export function getListeningAchievementById(
  id: string
): ListeningAchievement | undefined {
  return allListeningAchievements.find((achievement) => achievement.id === id);
}
