import React, { useState } from 'react';
import { PreStudyContent } from '../../types/starSystem';

interface PreStudyContentViewerProps {
  content: PreStudyContent;
  onComplete: (contentId: string, comprehensionRating: number) => void;
  onBack: () => void;
}

export const PreStudyContentViewer: React.FC<PreStudyContentViewerProps> = ({
  content,
  onComplete,
  onBack
}) => {
  const [comprehensionRating, setComprehensionRating] = useState<number>(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleFinalComplete = () => {
    if (comprehensionRating > 0) {
      onComplete(content.id, comprehensionRating);
    }
  };

  const renderStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">学習完了！</h2>
          <h3 className="text-lg text-gray-700">{content.title}</h3>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>⏱️ 推定時間: {Math.ceil(content.duration / 60)}分</span>
            <span className="capitalize">{content.category} • Level {content.level}</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-center">🧠 理解度を評価してください</h4>
          <div className="flex flex-col items-center gap-4">
            {renderStars(comprehensionRating, setComprehensionRating)}
            <div className="text-sm text-gray-600 text-center">
              {comprehensionRating === 5 && "完全に理解できました！"}
              {comprehensionRating === 4 && "ほぼ理解できました"}
              {comprehensionRating === 3 && "何となく理解できました"}
              {comprehensionRating === 2 && "少し理解できました"}
              {comprehensionRating === 1 && "あまり理解できませんでした"}
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h5 className="font-semibold text-green-800 mb-2">💪 関連問題で実践してみませんか？</h5>
          <p className="text-sm text-green-700">
            今学んだ内容を問題演習で定着させましょう。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleFinalComplete}
            disabled={comprehensionRating === 0}
            className={`
              flex-1 py-3 px-4 rounded-lg font-semibold transition-colors
              ${comprehensionRating > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            ♥ 問題演習へ
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            他の学習
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐️</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
            <div className="text-sm text-gray-600">
              Level {content.level} • {content.category} • {Math.ceil(content.duration / 60)}分
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          戻る
        </button>
      </div>

      <div className="prose prose-blue max-w-none mb-6">
        <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, '<br>') }} />
      </div>

      {content.examples && content.examples.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-yellow-800 mb-3">💡 例文</h4>
          <div className="space-y-3">
            {content.examples.map((example, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-900">{example.english}</div>
                <div className="text-gray-600 text-sm mt-1">{example.japanese}</div>
                {example.explanation && (
                  <div className="text-xs text-gray-500 mt-2">💭 {example.explanation}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          ✓ 学習完了
        </button>
      </div>
    </div>
  );
};
