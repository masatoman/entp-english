import { useState } from 'react';
import { StatusAllocation, STATUS_TEMPLATES } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';

// ステータス配分の管理フック
export const useStatusAllocation = () => {
  const [allocation, setAllocation] = useState<StatusAllocation>(() => {
    try {
      const manager = getLevelManager();
      return manager.getStatusAllocation();
    } catch (error) {
      console.error('Failed to get status allocation:', error);
      return {
        listening: 5,
        reading: 5,
        writing: 5,
        grammar: 5,
        idioms: 5,
        vocabulary: 5
      };
    }
  });

  const updateAllocation = (newAllocation: StatusAllocation): boolean => {
    const manager = getLevelManager();
    const success = manager.updateStatusAllocation(newAllocation);
    
    if (success) {
      setAllocation(newAllocation);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  const applyTemplate = (templateName: keyof typeof STATUS_TEMPLATES): boolean => {
    const manager = getLevelManager();
    const success = manager.applyStatusTemplate(templateName);
    
    if (success) {
      const newAllocation = manager.getStatusAllocation();
      setAllocation(newAllocation);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  const resetAllocation = (): boolean => {
    const manager = getLevelManager();
    const success = manager.resetStatusAllocation();
    
    if (success) {
      const newAllocation = manager.getStatusAllocation();
      setAllocation(newAllocation);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  const getTotalPoints = (): number => {
    return Object.values(allocation).reduce((sum, value) => sum + value, 0);
  };

  const getRemainingPoints = (): number => {
    return 30 - getTotalPoints();
  };

  const isValid = (): boolean => {
    return getTotalPoints() === 30;
  };

  return {
    allocation,
    updateAllocation,
    applyTemplate,
    resetAllocation,
    getTotalPoints,
    getRemainingPoints,
    isValid,
  };
};
