// タワーディフェンス用のデータ管理
// XPとレベルシステムの永続化

export interface TowerDefenseProfile {
  totalXP: number;
  currentLevel: number;
  towerUpgrades: {
    damage: number;
    range: number;
    attackSpeed: number;
  };
  highScore: number;
  gamesPlayed: number;
  enemiesDefeated: number;
}

const STORAGE_KEY = 'tower-defense-profile';

// 初期プロフィール
export const createInitialProfile = (): TowerDefenseProfile => ({
  totalXP: 0,
  currentLevel: 1,
  towerUpgrades: {
    damage: 1,
    range: 1,
    attackSpeed: 1
  },
  highScore: 0,
  gamesPlayed: 0,
  enemiesDefeated: 0
});

// プロフィールを読み込み
export const loadProfile = (): TowerDefenseProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const profile = JSON.parse(saved);
      // データ構造の検証
      if (typeof profile.totalXP === 'number' && typeof profile.currentLevel === 'number') {
        return {
          ...createInitialProfile(),
          ...profile
        };
      }
    }
  } catch (error) {
    console.error('Error loading tower defense profile:', error);
  }
  return createInitialProfile();
};

// プロフィールを保存
export const saveProfile = (profile: TowerDefenseProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving tower defense profile:', error);
  }
};

// プロフィールをリセット（ゲームオーバー時）
export const resetProfile = (): TowerDefenseProfile => {
  const initialProfile = createInitialProfile();
  saveProfile(initialProfile);
  return initialProfile;
};

// XPを追加
export const addXP = (amount: number): TowerDefenseProfile => {
  const profile = loadProfile();
  const oldXP = profile.totalXP;
  profile.totalXP += amount;
  
  console.log(`XP追加: ${oldXP} → ${profile.totalXP} (+${amount})`);
  
  // レベルアップ計算（設計書に基づく）
  const newLevel = calculateLevel(profile.totalXP);
  if (newLevel > profile.currentLevel) {
    profile.currentLevel = newLevel;
    console.log(`🎉 レベルアップ！ Level ${newLevel}に到達！`);
  }
  
  saveProfile(profile);
  return profile;
};

// レベル計算（設計書のLevel 1-100システム）
export const calculateLevel = (totalXP: number): number => {
  // Level 1-20: 50XP/レベル
  if (totalXP < 1000) return Math.floor(totalXP / 50) + 1;
  
  // Level 21-40: 100XP/レベル
  if (totalXP < 3000) return 20 + Math.floor((totalXP - 1000) / 100) + 1;
  
  // Level 41-60: 200XP/レベル
  if (totalXP < 7000) return 40 + Math.floor((totalXP - 3000) / 200) + 1;
  
  // Level 61-80: 300XP/レベル
  if (totalXP < 13000) return 60 + Math.floor((totalXP - 7000) / 300) + 1;
  
  // Level 81-100: 500XP/レベル
  if (totalXP < 23000) return 80 + Math.floor((totalXP - 13000) / 500) + 1;
  
  // Level 100でキャップ
  return 100;
};

// 次のレベルまでの必要XP
export const getXPToNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= 100) return 0;
  
  // 次のレベルに必要な総XPを計算
  let targetXP = 0;
  
  if (currentLevel < 20) {
    targetXP = (currentLevel) * 50;
  } else if (currentLevel < 40) {
    targetXP = 1000 + (currentLevel - 20) * 100;
  } else if (currentLevel < 60) {
    targetXP = 3000 + (currentLevel - 40) * 200;
  } else if (currentLevel < 80) {
    targetXP = 7000 + (currentLevel - 60) * 300;
  } else {
    targetXP = 13000 + (currentLevel - 80) * 500;
  }
  
  return targetXP - currentXP;
};

// タワーアップグレード
export const upgradeTower = (upgradeType: 'damage' | 'range' | 'attackSpeed'): {
  success: boolean;
  newProfile?: TowerDefenseProfile;
  cost?: number;
} => {
  const profile = loadProfile();
  const currentUpgradeLevel = profile.towerUpgrades[upgradeType];
  
  // アップグレードコスト計算
  const baseCost = {
    damage: 20,
    range: 30,
    attackSpeed: 25
  };
  
  const cost = baseCost[upgradeType] * Math.pow(1.5, currentUpgradeLevel - 1);
  
  // XPが足りるかチェック
  if (profile.totalXP < cost) {
    return { success: false, cost: Math.floor(cost) };
  }
  
  // アップグレード実行
  profile.totalXP -= Math.floor(cost);
  profile.towerUpgrades[upgradeType] += 1;
  
  saveProfile(profile);
  return { success: true, newProfile: profile, cost: Math.floor(cost) };
};

// ゲーム終了時の統計更新
export const updateGameStats = (finalScore: number, enemiesDefeated: number): TowerDefenseProfile => {
  const profile = loadProfile();
  
  profile.gamesPlayed += 1;
  profile.enemiesDefeated += enemiesDefeated;
  if (finalScore > profile.highScore) {
    profile.highScore = finalScore;
  }
  
  saveProfile(profile);
  return profile;
};

// レベル名を取得（設計書の章システム）
export const getLevelName = (level: number): string => {
  if (level <= 20) return `基礎編 Lv${level}`;
  if (level <= 40) return `中級編 Lv${level}`;
  if (level <= 60) return `上級編 Lv${level}`;
  if (level <= 80) return `マスター編 Lv${level}`;
  return `ネイティブ編 Lv${level}`;
};
