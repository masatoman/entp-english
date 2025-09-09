import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Category } from "../types";

interface CategorySelectionProps {
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
}

const categories = [
  {
    id: 'basic-grammar' as Category,
    title: '基本文型',
    description: 'be動詞・一般動詞',
    detail: 'I am / You are / He has など基本的な文の構造',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    difficulty: '初級'
  },
  {
    id: 'tenses' as Category,
    title: '時制',
    description: '現在・過去・未来・完了',
    detail: '現在形、過去形、未来形、現在完了形など',
    color: 'bg-green-50 border-green-200 text-green-800',
    difficulty: '初〜中級'
  },
  {
    id: 'modals' as Category,
    title: '助動詞',
    description: 'can / will / should など',
    detail: '可能性、意志、義務を表す助動詞',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    difficulty: '初〜中級'
  },
  {
    id: 'passive' as Category,
    title: '受動態',
    description: 'be + 過去分詞',
    detail: '「～される」という受身の表現',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    difficulty: '中級'
  },
  {
    id: 'relative' as Category,
    title: '関係詞',
    description: 'who / which / that など',
    detail: '関係代名詞・関係副詞を使った修飾',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    difficulty: '中級'
  },
  {
    id: 'subjunctive' as Category,
    title: '仮定法',
    description: 'if文・仮定の表現',
    detail: '「もし～だったら」という仮定の文',
    color: 'bg-red-50 border-red-200 text-red-800',
    difficulty: '中〜上級'
  },
  {
    id: 'comparison' as Category,
    title: '比較',
    description: '比較級・最上級',
    detail: 'より～、最も～という比較の表現',
    color: 'bg-teal-50 border-teal-200 text-teal-800',
    difficulty: '中級'
  },
  {
    id: 'participle' as Category,
    title: '分詞・動名詞',
    description: '-ing / -ed の使い方',
    detail: '現在分詞、過去分詞、動名詞の用法',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    difficulty: '中〜上級'
  },
  {
    id: 'infinitive' as Category,
    title: '不定詞',
    description: 'to + 動詞の原形',
    detail: '名詞的・形容詞的・副詞的用法',
    color: 'bg-pink-50 border-pink-200 text-pink-800',
    difficulty: '中級'
  }
];

export function CategorySelection({ onSelectCategory, onBack }: CategorySelectionProps) {
  return (
    <div className="min-h-screen p-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">カテゴリ選択</h1>
        <div className="w-10" />
      </div>
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl">英作文アプリ</h1>
          <p className="text-muted-foreground">
            学習したい文法カテゴリーを選択してください
          </p>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer hover:bg-accent transition-colors active:scale-[0.98]"
              onClick={() => {
                console.log('Category clicked:', category.id);
                onSelectCategory(category.id);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {category.difficulty}
                  </Badge>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {category.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}