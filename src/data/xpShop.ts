import { XPShopItem } from '../types/simple-game';

export const XP_SHOP_ITEMS: XPShopItem[] = [
  {
    id: 'damage-boost',
    type: 'damage-boost',
    name: '攻撃力ブースト',
    description: '全タワーの攻撃力+5 (30秒)',
    cost: 50,
    icon: '⚔️',
    duration: 30
  },
  {
    id: 'range-boost',
    type: 'range-boost',
    name: '射程ブースト',
    description: '全タワーの射程+20px (30秒)',
    cost: 40,
    icon: '🎯',
    duration: 30
  },
  {
    id: 'speed-boost',
    type: 'speed-boost',
    name: '攻撃速度ブースト',
    description: '全タワーの攻撃速度+50% (30秒)',
    cost: 60,
    icon: '⚡',
    duration: 30
  },
  {
    id: 'gold-multiplier',
    type: 'gold-multiplier',
    name: 'ゴールド倍増',
    description: 'ゴールド獲得+100% (60秒)',
    cost: 80,
    icon: '💰',
    duration: 60
  },
  {
    id: 'xp-multiplier',
    type: 'xp-multiplier',
    name: 'XP倍増',
    description: 'XP獲得+100% (60秒)',
    cost: 100,
    icon: '⭐',
    duration: 60
  },
  {
    id: 'health-regen',
    type: 'health-regen',
    name: '体力回復',
    description: '体力+20',
    cost: 30,
    icon: '❤️'
  },
  {
    id: 'wave-skip',
    type: 'wave-skip',
    name: 'ウェーブスキップ',
    description: '現在のウェーブをスキップ',
    cost: 150,
    icon: '⏭️'
  }
];

// アイテムを購入可能かチェック
export const canAffordItem = (item: XPShopItem, currentXP: number): boolean => {
  return currentXP >= item.cost;
};

// アイテムの効果を適用
export const applyShopItemEffect = (item: XPShopItem, gameState: any) => {
  const currentTime = Date.now();
  
  switch (item.type) {
    case 'damage-boost':
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          damageBoost: gameState.activeBoosts.damageBoost + 5
        }
      };
    
    case 'range-boost':
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          rangeBoost: gameState.activeBoosts.rangeBoost + 20
        }
      };
    
    case 'speed-boost':
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          speedBoost: gameState.activeBoosts.speedBoost + 0.5
        }
      };
    
    case 'gold-multiplier':
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          goldMultiplier: gameState.activeBoosts.goldMultiplier * 2
        }
      };
    
    case 'xp-multiplier':
      return {
        ...gameState,
        activeBoosts: {
          ...gameState.activeBoosts,
          xpMultiplier: gameState.activeBoosts.xpMultiplier * 2
        }
      };
    
    case 'health-regen':
      return {
        ...gameState,
        health: Math.min(gameState.maxHealth, gameState.health + 20)
      };
    
    case 'wave-skip':
      return {
        ...gameState,
        currentWave: gameState.currentWave + 1,
        waveStartTime: currentTime,
        enemiesSpawnedInWave: 0
      };
    
    default:
      return gameState;
  }
};
