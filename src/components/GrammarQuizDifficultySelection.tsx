import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, Star, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

interface GrammarQuizDifficultySelectionProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
}

const difficultyOptions = [
  {
    id: 'beginner' as const,
    title: '初級',
    description: '基本的な文法から始めましょう',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: [
      '基本的な文型',
      '簡単な時制',
      '基本的な語彙'
    ]
  },
  {
    id: 'intermediate' as const,
    title: '中級',
    description: 'より複雑な文法に挑戦しましょう',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      '複雑な文型',
      '時制の使い分け',
      '中級レベルの語彙'
    ]
  },
  {
    id: 'advanced' as const,
    title: '上級',
    description: '高度な文法をマスターしましょう',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      '高度な文型',
      '複雑な時制',
      '上級レベルの語彙'
    ]
  }
];

export function GrammarQuizDifficultySelection({ 
  onBack, 
  onSelectDifficulty 
}: GrammarQuizDifficultySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-8 pb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">文法クイズ</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            難易度を選択してください
          </h2>
          <p className="text-gray-600">
            あなたのレベルに合った文法クイズを提供します
          </p>
        </div>

        {/* Difficulty Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {difficultyOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.id}
                className={`
                  cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                  ${option.borderColor} border-2
                `}
                onClick={() => onSelectDifficulty(option.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`
                    w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                    ${option.bgColor}
                  `}>
                    <IconComponent className={`w-8 h-8 ${option.color}`} />
                  </div>
                  <CardTitle className={`text-xl ${option.color}`}>
                    {option.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      学習内容:
                    </h4>
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${option.bgColor} mr-2`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full mt-4 ${option.bgColor} ${option.color} hover:opacity-90`}
                    variant="outline"
                  >
                    このレベルで開始
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">
                文法クイズについて
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                ドラッグ&ドロップ形式で空欄を埋める文法クイズです。
                各問題には詳しい解説が付いているので、間違えても学習効果があります。
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <Badge variant="outline">10問出題</Badge>
                <Badge variant="outline">ドラッグ&ドロップ</Badge>
                <Badge variant="outline">詳細解説</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
