import React, { useState, useEffect } from 'react';
import { UserLevel, Chapter } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';
import { CHAPTER_INFO } from '../data/levelConfig';
import { useLevelSystem } from '../hooks/useLevelSystem';

interface LevelDisplayProps {
  showDetailed?: boolean;
  showChapterProgress?: boolean;
  compact?: boolean;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({
  showDetailed = true,
  showChapterProgress = true,
  compact = false,
}) => {
  const [userLevel, setUserLevel] = useState<UserLevel>(() => {
    const manager = getLevelManager();
    return manager.getLevel();
  });

  const [chapterProgress, setChapterProgress] = useState(() => {
    const manager = getLevelManager();
    return manager.getChapterProgress();
  });

  useEffect(() => {
    const manager = getLevelManager();
    const level = manager.getLevel();
    const progress = manager.getChapterProgress();
    setUserLevel(level);
    setChapterProgress(progress);
  }, []);

  const getChapterColor = (chapter: Chapter) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500',
      3: 'bg-purple-500',
      4: 'bg-orange-500',
      5: 'bg-red-500',
    };
    return colors[chapter];
  };

  const getChapterGradient = (chapter: Chapter) => {
    const gradients = {
      1: 'from-green-400 to-green-600',
      2: 'from-blue-400 to-blue-600',
      3: 'from-purple-400 to-purple-600',
      4: 'from-orange-400 to-orange-600',
      5: 'from-red-400 to-red-600',
    };
    return gradients[chapter];
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full ${getChapterColor(userLevel.chapter)} text-foreground flex items-center justify-center text-sm font-bold`}>
            {userLevel.chapter}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">
              Level {userLevel.level}
            </div>
            <div className="text-xs text-gray-500">
              {CHAPTER_INFO[userLevel.chapter].name}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Level {userLevel.level}
              </span>
              <span className="text-sm text-gray-600">
                ({userLevel.xp - (userLevel.level - 1) * 50}/50 XP)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${getChapterGradient(userLevel.chapter)}`}
                style={{ width: `${((userLevel.xp - (userLevel.level - 1) * 50) / 50) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              次レベルまで: {50 - (userLevel.xp - (userLevel.level - 1) * 50)}XP
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">レベル情報</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-full ${getChapterColor(userLevel.chapter)} text-foreground flex items-center justify-center text-lg font-bold`}>
            {userLevel.chapter}
          </div>
          <div>
            <div className="text-sm text-gray-500">章</div>
            <div className="text-xs text-gray-400">{CHAPTER_INFO[userLevel.chapter].name}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 現在のレベル */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-medium text-gray-700">
              Level {userLevel.level}
            </span>
            <span className="text-sm text-gray-500">
              {userLevel.xp} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${getChapterGradient(userLevel.chapter)} transition-all duration-500`}
              style={{ width: `${userLevel.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>進捗: {userLevel.progress.toFixed(1)}%</span>
            <span>次のレベルまで: {userLevel.xpToNext} XP</span>
          </div>
        </div>

        {/* 章の進捗 */}
        {showChapterProgress && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {CHAPTER_INFO[userLevel.chapter].name}の進捗
              </span>
              <span className="text-sm text-gray-500">
                {chapterProgress.progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${getChapterGradient(userLevel.chapter)} transition-all duration-500`}
                style={{ width: `${chapterProgress.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {CHAPTER_INFO[userLevel.chapter].description}
            </div>
          </div>
        )}

        {/* 詳細情報 */}
        {showDetailed && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">章</div>
                <div className="font-medium">{CHAPTER_INFO[userLevel.chapter].name}</div>
              </div>
              <div>
                <div className="text-gray-500">レベル範囲</div>
                <div className="font-medium">{CHAPTER_INFO[userLevel.chapter].levelRange}</div>
              </div>
              <div>
                <div className="text-gray-500">必要XP/レベル</div>
                <div className="font-medium">{CHAPTER_INFO[userLevel.chapter].xpPerLevel} XP</div>
              </div>
              <div>
                <div className="text-gray-500">最大ハート数</div>
                <div className="font-medium">{CHAPTER_INFO[userLevel.chapter].maxHearts}個</div>
              </div>
            </div>
            
            {/* テスト用ボタン */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const manager = getLevelManager();
                    const result = manager.addXP(100);
                    setUserLevel(manager.getLevel());
                    saveLevelManager();
                    if (result.leveledUp) {
                      alert(`レベルアップ！ Level ${result.newLevel?.level} に上がりました！`);
                    }
                  }}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-blue-500 text-foreground hover:bg-blue-600 transition-colors"
                  title="テスト用: 100XP追加"
                >
                  +100XP
                </button>
                <button
                  onClick={() => {
                    const manager = getLevelManager();
                    const result = manager.addXP(500);
                    setUserLevel(manager.getLevel());
                    saveLevelManager();
                    if (result.leveledUp) {
                      alert(`レベルアップ！ Level ${result.newLevel?.level} に上がりました！`);
                    }
                  }}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-purple-500 text-foreground hover:bg-purple-600 transition-colors"
                  title="テスト用: 500XP追加"
                >
                  +500XP
                </button>
                <button
                  onClick={() => {
                    const manager = getLevelManager();
                    manager.addXP(1000);
                    setUserLevel(manager.getLevel());
                    saveLevelManager();
                    alert('1000XP追加しました！');
                  }}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-orange-500 text-foreground hover:bg-orange-600 transition-colors"
                  title="テスト用: 1000XP追加"
                >
                  +1000XP
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">※ テスト用ボタンです</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LevelProgressProps {
  showAllChapters?: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  showAllChapters = false,
}) => {
  const [userLevel, setUserLevel] = useState<UserLevel>(() => {
    const manager = getLevelManager();
    return manager.getLevel();
  });

  const chapters: Chapter[] = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        全章の進捗
      </h3>
      
      <div className="space-y-4">
        {chapters.map((chapter) => {
          const chapterInfo = CHAPTER_INFO[chapter];
          const isCurrentChapter = chapter === userLevel.chapter;
          const isCompleted = chapter < userLevel.chapter;
          const isLocked = chapter > userLevel.chapter;
          
          // 章の進捗計算
          let chapterProgress = 0;
          if (isCompleted) {
            chapterProgress = 100;
          } else if (isCurrentChapter) {
            chapterProgress = userLevel.progress;
          }
          
          return (
            <div
              key={chapter}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentChapter
                  ? 'border-blue-300 bg-blue-50'
                  : isCompleted
                  ? 'border-green-300 bg-green-50'
                  : isLocked
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-foreground ${
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrentChapter
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : chapter}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {chapterInfo.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {chapterInfo.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {chapterProgress.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {chapterInfo.levelRange}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-green-500'
                      : isCurrentChapter
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: `${chapterProgress}%` }}
                />
              </div>
              
              {isLocked && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <span className="mr-1">🔒</span>
                  Level {chapter * 20 - 19}で解放
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// フックは別ファイルに移動しました
