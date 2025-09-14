import React, { useState, useEffect } from 'react';
import { HeartSystem } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';

interface HeartSystemDisplayProps {
  onHeartChange?: (hearts: HeartSystem) => void;
  showRecoveryTime?: boolean;
  compact?: boolean;
}

export const HeartSystemDisplay: React.FC<HeartSystemDisplayProps> = ({
  onHeartChange,
  showRecoveryTime = true,
  compact = false,
}) => {
  const [heartSystem, setHeartSystem] = useState<HeartSystem>(() => {
    const manager = getLevelManager();
    return manager.getHeartSystem();
  });
  const [timeUntilRecovery, setTimeUntilRecovery] = useState<number>(0);

  useEffect(() => {
    const manager = getLevelManager();
    const updatedHearts = manager.processHeartRecovery();
    setHeartSystem(updatedHearts);
    onHeartChange?.(updatedHearts);
  }, []); // 初回のみ実行

  useEffect(() => {
    // 回復時間の計算
    const updateRecoveryTime = () => {
      const now = Date.now();
      const timeDiff = heartSystem.nextRecovery - now;
      setTimeUntilRecovery(Math.max(0, timeDiff));
    };

    updateRecoveryTime();
    const interval = setInterval(updateRecoveryTime, 1000);

    return () => clearInterval(interval);
  }, [heartSystem.nextRecovery]); // heartSystem.nextRecoveryのみを依存配列に

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const canConsumeHeart = heartSystem.current > 0;

  const handleConsumeHeart = () => {
    const manager = getLevelManager();
    const success = manager.consumeHeart();
    
    if (success) {
      const updatedHearts = manager.getHeartSystem();
      setHeartSystem(updatedHearts);
      onHeartChange?.(updatedHearts);
      saveLevelManager();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          {Array.from({ length: heartSystem.max }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < heartSystem.current
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              ♥
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {heartSystem.current}/{heartSystem.max}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">体力システム</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">体力</span>
          <div className="flex space-x-1">
            {Array.from({ length: heartSystem.max }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                  i < heartSystem.current
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                ♥
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {heartSystem.current}/{heartSystem.max}
          </span>
        </div>
      </div>

      {showRecoveryTime && heartSystem.current < heartSystem.max && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>次の回復まで</span>
            <span className="font-mono">{formatTime(timeUntilRecovery)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${((60 * 60 * 1000 - timeUntilRecovery) / (60 * 60 * 1000)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <p>1問題につき1体力消費</p>
          <p>1時間で1体力回復</p>
        </div>
        
        <button
          onClick={handleConsumeHeart}
          disabled={!canConsumeHeart}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            canConsumeHeart
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canConsumeHeart ? '体力を消費' : '体力不足'}
        </button>
      </div>

      {heartSystem.current === 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div className="text-sm text-yellow-800">
              体力が不足しています。回復を待つか、時間をスキップしてください。
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ハートシステムの管理フック
export const useHeartSystem = () => {
  const [heartSystem, setHeartSystem] = useState<HeartSystem>(() => {
    const manager = getLevelManager();
    return manager.getHeartSystem();
  });

  const consumeHeart = (): boolean => {
    const manager = getLevelManager();
    const success = manager.consumeHeart();
    
    if (success) {
      const updatedHearts = manager.getHeartSystem();
      setHeartSystem(updatedHearts);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  const processRecovery = (): HeartSystem => {
    const manager = getLevelManager();
    const updatedHearts = manager.processHeartRecovery();
    setHeartSystem(updatedHearts);
    saveLevelManager();
    return updatedHearts;
  };

  const refreshHearts = () => {
    const manager = getLevelManager();
    const updatedHearts = manager.processHeartRecovery();
    setHeartSystem(updatedHearts);
  };

  return {
    heartSystem,
    consumeHeart,
    processRecovery,
    refreshHearts,
  };
};
