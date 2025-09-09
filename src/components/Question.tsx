import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Category } from "../types";

export interface QuestionData {
  id: number;
  japanese: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  choices?: string[];
}

interface QuestionProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  difficulty: 'easy' | 'normal' | 'hard';
  category: Category;
  onAnswer: (answer: string) => void;
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

const difficultyLabels = {
  easy: '簡単',
  normal: '普通',
  hard: '難しい'
};

export function Question({ 
  question, 
  questionNumber, 
  totalQuestions, 
  difficulty, 
  category,
  onAnswer 
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const handleSubmit = () => {
    const answer = difficulty === 'easy' ? selectedAnswer : userInput;
    if (answer.trim()) {
      onAnswer(answer);
      setSelectedAnswer("");
      setUserInput("");
    }
  };

  const canSubmit = difficulty === 'easy' ? selectedAnswer : userInput.trim();

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">問題 {questionNumber} / {totalQuestions}</span>
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[difficulty]}
              </Badge>
            </div>
          </div>
          <Progress value={(questionNumber / totalQuestions) * 100} />
        </div>

        {/* Spacer to center content */}
        <div className="flex-1" />

        {/* Question */}
        <Card className="flex-shrink-0">
          <CardHeader>
            <CardTitle>次の日本語を英語にしてください</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-center">{question.japanese}</p>
            </div>

            {/* Hint for normal difficulty */}
            {difficulty === 'normal' && question.hint && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">ヒント：</span>{question.hint}
                </p>
              </div>
            )}

            {/* Input area */}
            <div className="space-y-3">
              {difficulty === 'easy' && question.choices ? (
                // Multiple choice for easy
                <div className="space-y-2">
                  {question.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === choice ? "default" : "outline"}
                      className="w-full justify-start h-auto p-3 text-left whitespace-pre-wrap"
                      onClick={() => setSelectedAnswer(choice)}
                    >
                      {String.fromCharCode(65 + index)}. {choice}
                    </Button>
                  ))}
                </div>
              ) : (
                // Text input for normal and hard
                <Textarea
                  placeholder="英文を入力してください..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Spacer to center content */}
        <div className="flex-1" />

        {/* Submit button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!canSubmit}
          className="w-full flex-shrink-0"
          size="lg"
        >
          {questionNumber === totalQuestions ? '結果を見る' : '次の問題'}
        </Button>
      </div>
    </div>
  );
}