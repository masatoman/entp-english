import React from 'react';
import { PreStudyContent } from '../../types/starSystem';

interface PreStudyContentCardProps {
  content: PreStudyContent;
  isLocked?: boolean;
  isCompleted?: boolean;
  onSelect: (contentId: string) => void;
}

export const PreStudyContentCard: React.FC<PreStudyContentCardProps> = ({
  content,
  isLocked = false,
  isCompleted = false,
  onSelect
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'theory': return '💡';
      case 'explanation': return '📚';
      case 'background': return '🔬';
      case 'strategy': return '🎯';
      default: return '📖';
    }
  };

  return (
    <div 
      className={`
        border rounded-lg p-4 cursor-pointer transition-all
        ${isLocked 
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
          : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md'
        }
        ${isCompleted ? 'border-green-300 bg-green-50' : ''}
      `}
      onClick={() => !isLocked && onSelect(content.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {isLocked ? '🔒' : getContentTypeIcon(content.contentType)}
          </span>
          <span className="text-lg">⭐️</span>
          {isCompleted && <span className="text-green-600">✓</span>}
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(content.difficulty)}`}>
            {content.difficulty}
          </span>
          <span className="text-xs text-gray-500">Level {content.level}</span>
        </div>
      </div>
      
      <h3 className={`font-semibold mb-2 ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
        {content.title}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>⏱️ {Math.ceil(content.duration / 60)}分</span>
        <span className="capitalize">{content.category}</span>
      </div>
      
      {content.keyPoints && content.keyPoints.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          <div className="font-medium mb-1">重要ポイント:</div>
          <ul className="list-disc list-inside space-y-1">
            {content.keyPoints.slice(0, 2).map((point, index) => (
              <li key={index} className="truncate">{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
