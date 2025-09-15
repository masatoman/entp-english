import React, { useState, useMemo } from 'react';
import { PreStudyContent } from '../../types/starSystem';
import { PreStudyContentCard } from './PreStudyContentCard';

interface PreStudyMenuProps {
  availableContents: PreStudyContent[];
  completedContents: string[];
  userLevel: number;
  onSelectContent: (contentId: string) => void;
  onBack: () => void;
}

export const PreStudyMenu: React.FC<PreStudyMenuProps> = ({
  availableContents,
  completedContents,
  userLevel,
  onSelectContent,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = Array.from(new Set(availableContents.map(c => c.category)));
  const levels = Array.from(new Set(availableContents.map(c => c.level))).sort((a, b) => a - b);

  const filteredContents = useMemo(() => {
    return availableContents.filter(content => {
      const categoryMatch = selectedCategory === 'all' || content.category === selectedCategory;
      const levelMatch = selectedLevel === 'all' || content.level.toString() === selectedLevel;
      const levelAccess = content.level <= userLevel;
      
      return categoryMatch && levelMatch && levelAccess;
    });
  }, [availableContents, selectedCategory, selectedLevel, userLevel]);

  const recommendedContent = useMemo(() => {
    return filteredContents.find(content => 
      !completedContents.includes(content.id) && 
      content.level <= userLevel
    );
  }, [filteredContents, completedContents, userLevel]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">事前学習</h1>
            <p className="text-gray-600">理論を理解してから実践へ</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          戻る
        </button>
      </div>

      {/* フィルター */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">すべてのカテゴリ</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">すべてのレベル</option>
          {levels.map(level => (
            <option key={level} value={level.toString()}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {/* 推奨コンテンツ */}
      {recommendedContent && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 推奨コンテンツ</h2>
          <PreStudyContentCard
            content={recommendedContent}
            isCompleted={completedContents.includes(recommendedContent.id)}
            onSelect={onSelectContent}
          />
        </div>
      )}

      {/* コンテンツリスト */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📖 利用可能なコンテンツ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredContents.map(content => (
            <PreStudyContentCard
              key={content.id}
              content={content}
              isLocked={content.level > userLevel}
              isCompleted={completedContents.includes(content.id)}
              onSelect={onSelectContent}
            />
          ))}
        </div>
      </div>

      {filteredContents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            該当するコンテンツがありません
          </h3>
          <p className="text-gray-600">
            フィルターを変更するか、レベルアップして新しいコンテンツを解放しましょう。
          </p>
        </div>
      )}
    </div>
  );
};
