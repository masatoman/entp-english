import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Star, Zap, Crown } from 'lucide-react';

interface GrammarQuizDifficultySelectionProps {
  categoryName: string;
  onSelectDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  onBack: () => void;
}

export function GrammarQuizDifficultySelection({ 
  categoryName, 
  onSelectDifficulty, 
  onBack 
}: GrammarQuizDifficultySelectionProps) {
  const difficulties = [
    {
      id: 'beginner' as const,
      name: '簡単',
      description: '基本的な文法問題',
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'intermediate' as const,
      name: '普通',
      description: '中級レベルの文法問題',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'advanced' as const,
      name: '難しい',
      description: '上級レベルの文法問題',
      icon: Crown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">難易度選択</h1>
          <div className="w-24"></div>
        </div>

        {/* カテゴリー名 */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {categoryName}
          </h2>
          <p className="text-gray-600">
            学習したい難易度を選択してください
          </p>
        </div>

        {/* 難易度一覧 */}
        <div className="space-y-4">
          {difficulties.map((difficulty) => {
            const IconComponent = difficulty.icon;
            return (
              <Card
                key={difficulty.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${difficulty.bgColor} ${difficulty.borderColor} border-2`}
                onClick={() => onSelectDifficulty(difficulty.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <IconComponent className={`w-5 h-5 mr-2 ${difficulty.color}`} />
                    {difficulty.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {difficulty.description}
                  </p>
                  <div className="flex items-center text-sm text-blue-600">
                    クリックして開始
                    <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}