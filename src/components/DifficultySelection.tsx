import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl">難易度選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[category]}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground">
          難易度を選択してください
        </p>
        
        <div className="space-y-4">
          <Card 
            className="cursor-pointer hover:bg-accent transition-colors active:scale-[0.98]"
            onClick={() => {
              console.log('Easy difficulty clicked');
              onSelectDifficulty('easy');
            }}
          >
            <CardHeader>
              <CardTitle className="text-green-600">簡単</CardTitle>
              <CardDescription>4択問題形式</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                与えられた日本語に対して、4つの選択肢から適切な英文を選びます。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent transition-colors active:scale-[0.98]"
            onClick={() => {
              console.log('Normal difficulty clicked');
              onSelectDifficulty('normal');
            }}
          >
            <CardHeader>
              <CardTitle className="text-yellow-600">普通</CardTitle>
              <CardDescription>ヒント付き入力</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                キーワードのヒントを参考に英文を入力します。
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent transition-colors active:scale-[0.98]"
            onClick={() => {
              console.log('Hard difficulty clicked');
              onSelectDifficulty('hard');
            }}
          >
            <CardHeader>
              <CardTitle className="text-red-600">難しい</CardTitle>
              <CardDescription>ヒントなし入力</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ヒントなしで日本語を英語に翻訳します。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}