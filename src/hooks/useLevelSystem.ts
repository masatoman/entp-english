import { useState } from 'react';
import { UserLevel } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';

// レベル管理フック
export const useLevelSystem = () => {
  const [userLevel, setUserLevel] = useState<UserLevel>(() => {
    const manager = getLevelManager();
    return manager.getLevel();
  });

  const addXP = (xp: number) => {
    const manager = getLevelManager();
    const result = manager.addXP(xp);
    setUserLevel(manager.getLevel());
    saveLevelManager();
    return result;
  };

  const refreshLevel = () => {
    const manager = getLevelManager();
    setUserLevel(manager.getLevel());
  };

  return {
    userLevel,
    addXP,
    refreshLevel,
  };
};
