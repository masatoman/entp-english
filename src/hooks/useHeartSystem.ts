import { useState, useEffect } from 'react';
import { HeartSystem } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';

// ハートシステムの管理フック
export const useHeartSystem = () => {
  const [heartSystem, setHeartSystem] = useState<HeartSystem>(() => {
    const manager = getLevelManager();
    return manager.getHeartSystem();
  });

  const consumeHeart = (): boolean => {
    const manager = getLevelManager();
    if (manager.getHeartSystem().current > 0) {
      manager.consumeHeart();
      saveLevelManager(manager);
      setHeartSystem(manager.getHeartSystem());
      return true;
    }
    return false;
  };

  const addHeart = (amount: number = 1): void => {
    const manager = getLevelManager();
    manager.addHeart(amount);
    saveLevelManager(manager);
    setHeartSystem(manager.getHeartSystem());
  };

  const recoverHeart = (): void => {
    const manager = getLevelManager();
    manager.recoverHeart();
    saveLevelManager(manager);
    setHeartSystem(manager.getHeartSystem());
  };

  const resetHearts = (): void => {
    const manager = getLevelManager();
    manager.resetHearts();
    saveLevelManager(manager);
    setHeartSystem(manager.getHeartSystem());
  };

  const getTimeUntilRecovery = (): number => {
    const manager = getLevelManager();
    const heartSystem = manager.getHeartSystem();
    const now = Date.now();
    const timeSinceLastRecovery = now - heartSystem.lastRecoveryTime;
    const recoveryInterval = 5 * 60 * 1000; // 5分
    return Math.max(0, recoveryInterval - timeSinceLastRecovery);
  };

  const canConsumeHeart = (): boolean => {
    return heartSystem.current > 0;
  };

  const isFull = (): boolean => {
    return heartSystem.current >= heartSystem.max;
  };

  const getRecoveryProgress = (): number => {
    if (heartSystem.current >= heartSystem.max) return 100;
    const timeUntilRecovery = getTimeUntilRecovery();
    const recoveryTime = 5 * 60 * 1000; // 5分
    return Math.max(0, Math.min(100, ((recoveryTime - timeUntilRecovery) / recoveryTime) * 100));
  };

  const processRecovery = (): HeartSystem => {
    const manager = getLevelManager();
    const updatedHearts = manager.processHeartRecovery();
    setHeartSystem(updatedHearts);
    saveLevelManager(manager);
    return updatedHearts;
  };

  const refreshHearts = (): void => {
    const manager = getLevelManager();
    const updatedHearts = manager.processHeartRecovery();
    setHeartSystem(updatedHearts);
    saveLevelManager(manager);
  };

  // 自動回復の監視
  useEffect(() => {
    const interval = setInterval(() => {
      const manager = getLevelManager();
      const currentSystem = manager.getHeartSystem();
      
      if (currentSystem.current < currentSystem.max) {
        const timeUntilRecovery = getTimeUntilRecovery();
        if (timeUntilRecovery <= 0) {
          processRecovery();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [heartSystem.current]);

  return {
    heartSystem,
    consumeHeart,
    addHeart,
    recoverHeart,
    resetHearts,
    getTimeUntilRecovery,
    canConsumeHeart,
    isFull,
    getRecoveryProgress,
    processRecovery,
    refreshHearts,
  };
};
