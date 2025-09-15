import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft } from "lucide-react";
import { Category, QuestionRank } from "../types";
import { RANK_STYLES } from "../data/levelConfig";

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
  rank?: QuestionRank;
  xpReward?: number;
  onAnswer: (answer: string) => void;
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
  rank,
  xpReward,
  onAnswer, 
  onBack 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">英作文練習</h1>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[difficulty]}
              </Badge>
              {rank && (
                <Badge 
                  className={`text-xs ${RANK_STYLES[rank].bgColor} ${RANK_STYLES[rank].color}`}
                >
                  {RANK_STYLES[rank].icon} {RANK_STYLES[rank].name}
                </Badge>
              )}
              {xpReward && (
                <Badge variant="secondary" className="text-xs">
                  +{xpReward} XP
                </Badge>
              )}
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">問題 {questionNumber} / {totalQuestions}</span>
          </div>
          <Progress value={(questionNumber / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-xl">次の日本語を英語にしてください</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <p className="text-center text-lg font-medium text-gray-800">{question.japanese}</p>
            </div>

            {/* Hint for normal difficulty */}
            {difficulty === 'normal' && question.hint && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">ヒント：</span>{question.hint}
                </p>
              </div>
            )}

            {/* Input area */}
            <div className="space-y-4">
              {difficulty === 'easy' && question.choices ? (
                // Multiple choice for easy
                <div className="space-y-3">
                  {question.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === choice ? "default" : "outline"}
                      className="w-full justify-start h-auto p-4 text-left whitespace-pre-wrap hover:shadow-md transition-shadow"
                      onClick={() => setSelectedAnswer(choice)}
                    >
                      <span className="font-medium text-blue-600 mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {choice}
                    </Button>
                  ))}
                </div>
              ) : (
                // Text input for normal and hard
                <Textarea
                  placeholder="英文を入力してください..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] resize-none border-2 border-gray-300 focus:border-blue-500"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="px-8 py-3 text-lg font-medium"
            size="lg"
          >
            {questionNumber === totalQuestions ? '結果を見る' : '次の問題'}
          </Button>
        </div>
      </div>
    </div>
  );
}