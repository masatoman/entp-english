import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Zap, Crown } from "lucide-react";
import { Category } from "../types";

interface DifficultySelectionProps {
  category: Category;
  onSelectDifficulty: (difficulty: 'easy' | 'normal' | 'hard') => void;
  onBack: () => void;
}

const categoryLabels: Record<Category, string> = {
  'basic-grammar': '基本文型',
  'tenses': '時制',
  'modals': '助動詞',
  'passive': '受動態',
  'relative': '関係詞',
  'subjunctive': '仮定法',
  'comparison': '比較',
  'participle': '分詞・動名詞',
  'infinitive': '不定詞'
};

export function DifficultySelection({ category, onSelectDifficulty, onBack }: DifficultySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">難易度選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[category]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>
        
        <p className="text-center text-gray-600 mb-6">
          難易度を選択してください
        </p>
        
        <div className="space-y-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] bg-green-50 border-green-200 border-2"
            onClick={() => {
              console.log('Easy difficulty clicked');
              onSelectDifficulty('easy');
            }}
          >
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                簡単
              </CardTitle>
              <CardDescription>4択問題形式</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                与えられた日本語に対して、4つの選択肢から適切な英文を選びます。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] bg-yellow-50 border-yellow-200 border-2"
            onClick={() => {
              console.log('Normal difficulty clicked');
              onSelectDifficulty('normal');
            }}
          >
            <CardHeader>
              <CardTitle className="text-yellow-600 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                普通
              </CardTitle>
              <CardDescription>ヒント付き入力</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                キーワードのヒントを参考に英文を入力します。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow active:scale-[0.98] bg-red-50 border-red-200 border-2"
            onClick={() => {
              console.log('Hard difficulty clicked');
              onSelectDifficulty('hard');
            }}
          >
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                難しい
              </CardTitle>
              <CardDescription>ヒントなし入力</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                ヒントなしで日本語を英語に翻訳します。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}