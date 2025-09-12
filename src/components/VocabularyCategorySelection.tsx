import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, BookOpen, Briefcase, MessageCircle, Trophy, Globe } from "lucide-react";

interface VocabularyCategorySelectionProps {
  onBack: () => void;
  onSelectCategory: (category: 'all' | 'toeic' | 'business' | 'daily' | 'academic') => void;
}

export function VocabularyCategorySelection({ onBack, onSelectCategory }: VocabularyCategorySelectionProps) {
  const categories = [
    {
      id: 'all' as const,
      title: 'すべて',
      description: '全レベルの単語をランダムに学習',
      detail: '初級から上級まで幅広いレベルの単語',
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      difficulty: '全レベル',
      wordCount: '130個の単語',
      examples: ['reliable', 'accomplish', 'sophisticated']
    },
    {
      id: 'toeic' as const,
      title: 'TOEIC頻出',
      description: 'TOEIC試験でよく出る単語',
      detail: 'TOEIC試験で頻繁に出題されるビジネス単語',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      difficulty: '中級',
      wordCount: '20個の単語',
      examples: ['revenue', 'budget', 'deadline', 'contract']
    },
    {
      id: 'business' as const,
      title: 'ビジネス英語',
      description: 'ビジネスシーンで使われる単語',
      detail: '会議、交渉、プレゼンで使用される専門用語',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      difficulty: '中級',
      wordCount: '15個の単語',
      examples: ['negotiate', 'collaborate', 'coordinate', 'supervise']
    },
    {
      id: 'daily' as const,
      title: '日常会話',
      description: '日常会話でよく使われる単語',
      detail: '友達との会話や日常的な表現で使用される単語',
      color: 'bg-green-50 border-green-200 text-green-800',
      difficulty: '初級',
      wordCount: '15個の単語',
      examples: ['awesome', 'amazing', 'fantastic', 'wonderful']
    },
    {
      id: 'academic' as const,
      title: '学術・専門',
      description: '学術論文や専門分野で使われる単語',
      detail: '研究論文や専門書で使用される高度な単語',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      difficulty: '上級',
      wordCount: '30個の単語',
      examples: ['methodology', 'infrastructure', 'paradigm', 'hypothesis']
    }
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl">カテゴリ選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                単語学習
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground">
          カテゴリを選択してください
        </p>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer hover:bg-accent transition-colors active:scale-[0.98] ${category.color}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {category.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {category.detail}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">例:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {category.wordCount}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
