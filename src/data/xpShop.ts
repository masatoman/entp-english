import { XPShopItem } from "../types/simple-game";

export const XP_SHOP_ITEMS: XPShopItem[] = [
  // 学習連携アイテム
  {
    id: "learning-efficiency-boost",
    type: "learning-boost",
    name: "学習効率ブースト",
    description: "全ての学習でXP獲得量+50% (60分)",
    cost: 80,
    icon: "📈",
    duration: 60,
  },
  {
    id: "vocabulary-mastery-boost",
    type: "vocabulary-boost",
    name: "語彙習得ブースト",
    description: "ガチャ語彙の記憶定着率+30% (24時間)",
    cost: 120,
    icon: "🧠",
    duration: 1440,
  },
  {
    id: "grammar-comprehension-boost",
    type: "grammar-boost",
    name: "文法理解ブースト",
    description: "文法クイズと英作文の正答率+20% (2時間)",
    cost: 100,
    icon: "📚",
    duration: 120,
  },
  {
    id: "synergy-multiplier",
    type: "synergy-boost",
    name: "相乗効果マルチプライヤー",
    description: "連携学習時のXP獲得量2倍 (30分)",
    cost: 200,
    icon: "🔗",
    duration: 30,
  },
  {
    id: "weak-area-focus",
    type: "focus-boost",
    name: "弱点克服フォーカス",
    description: "弱点分野の問題で追加XP+25 (1時間)",
    cost: 90,
    icon: "🎯",
    duration: 60,
  },

  // 従来のゲーム用アイテム
  {
    id: "damage-boost",
    type: "damage-boost",
    name: "攻撃力ブースト",
    description: "全タワーの攻撃力+5 (30秒)",
    cost: 50,
    icon: "⚔️",
    duration: 30,
  },
  {
    id: "range-boost",
    type: "range-boost",
    name: "射程ブースト",
    description: "全タワーの射程+20px (30秒)",
    cost: 40,
    icon: "🎯",
    duration: 30,
  },
  {
    id: "speed-boost",
    type: "speed-boost",
    name: "攻撃速度ブースト",
    description: "全タワーの攻撃速度+50% (30秒)",
    cost: 60,
    icon: "⚡",
    duration: 30,
  },
  {
    id: "gold-multiplier",
    type: "gold-multiplier",
    name: "ゴールド倍増",
    description: "ゴールド獲得+100% (60秒)",
    cost: 80,
    icon: "💰",
    duration: 60,
  },
  {
    id: "xp-multiplier",
    type: "xp-multiplier",
    name: "XP倍増",
    description: "XP獲得+100% (60秒)",
    cost: 100,
    icon: "⭐",
    duration: 60,
  },
  {
    id: "health-regen",
    type: "health-regen",
    name: "体力回復",
    description: "体力+20",
    cost: 30,
    icon: "❤️",
  },
  {
    id: "wave-skip",
    type: "wave-skip",
    name: "ウェーブスキップ",
    description: "現在のウェーブをスキップ",
    cost: 150,
    icon: "⏭️",
  },
];

// アイテムを購入可能かチェック
export const canAffordItem = (item: XPShopItem, currentXP: number): boolean => {
  return currentXP >= item.cost;
};

// アイテムの効果を適用
export const applyShopItemEffect = (item: XPShopItem, gameState: any) => {
  const currentTime = Date.now();

  switch (item.type) {
    case "damage-boost":
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          damageBoost: gameState.activeBoosts.damageBoost + 5,
        },
      };

    case "range-boost":
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          rangeBoost: gameState.activeBoosts.rangeBoost + 20,
        },
      };

    case "speed-boost":
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          speedBoost: gameState.activeBoosts.speedBoost + 0.5,
        },
      };

    case "gold-multiplier":
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          goldMultiplier: gameState.activeBoosts.goldMultiplier * 2,
        },
      };

    case "xp-multiplier":
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          xpMultiplier: gameState.activeBoosts.xpMultiplier * 2,
        },
      };

    case "health-regen":
      return {
        ...gameState,
        health: Math.min(gameState.maxHealth, gameState.health + 20),
      };

    case "wave-skip":
      return {
        ...gameState,
        currentWave: gameState.currentWave + 1,
        waveStartTime: currentTime,
        enemiesSpawnedInWave: 0,
      };

    default:
      return gameState;
  }
};
