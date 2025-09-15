import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { grammarCategories } from '../data/grammarQuizCategorized';

interface GrammarQuizCategorySelectionProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

export function GrammarQuizCategorySelection({ onSelectCategory, onBack }: GrammarQuizCategorySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold text-gray-800">文法カテゴリー選択</h1>
          <div className="w-24"></div>
        </div>

        {/* 説明 */}
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            学習したい文法カテゴリーを選択してください
          </p>
        </div>

        {/* カテゴリー一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grammarCategories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  クリックして開始
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
