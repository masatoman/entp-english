import { ArrowLeft, BookOpen, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const categoryLabels: Record<string, string> = {
  "parts-of-speech": "品詞の理解",
  "word-order": "語順の基本",
  pronouns: "代名詞",
  articles: "冠詞",
  plurals: "複数形",
  "questions-negations": "疑問文・否定文",
  prepositions: "前置詞",
  conjunctions: "接続詞",
};

const difficultyLabels: Record<string, string> = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

// 品詞問題のセット定義
const partsOfSpeechSets = [
  {
    id: "basic",
    name: "基本編",
    description: "基本的な品詞識別",
    icon: "📝",
    idRange: "1001-1005",
    focus: "名詞・動詞・形容詞・副詞の基本",
  },
  {
    id: "nouns",
    name: "名詞編",
    description: "名詞に特化した問題",
    icon: "🏠",
    idRange: "1006-1010",
    focus: "人・物・場所の名詞識別",
  },
  {
    id: "verbs",
    name: "動詞編",
    description: "動詞に特化した問題",
    icon: "🏃",
    idRange: "1021-1025",
    focus: "動作・状態を表す動詞",
  },
  {
    id: "adjectives",
    name: "形容詞編",
    description: "形容詞に特化した問題",
    icon: "🌟",
    idRange: "1031-1035",
    focus: "性質・状態を表す形容詞",
  },
  {
    id: "adverbs",
    name: "副詞編",
    description: "副詞に特化した問題",
    icon: "⚡",
    idRange: "1041-1045",
    focus: "動詞・形容詞を修飾する副詞",
  },
  {
    id: "mixed",
    name: "応用編",
    description: "混合・応用問題",
    icon: "🎯",
    idRange: "1051-1055",
    focus: "複数の品詞を組み合わせた問題",
  },
];

// 他のカテゴリーのセット定義（将来拡張用）
const getQuestionSets = (category: string) => {
  if (category === "parts-of-speech") {
    return partsOfSpeechSets;
  }

  // デフォルト：基本・応用・総合の3セット
  return [
    {
      id: "basic",
      name: "基本編",
      description: "基本的な問題",
      icon: "📝",
      idRange: "基本5問",
      focus: "基礎的な理解",
    },
    {
      id: "advanced",
      name: "応用編",
      description: "応用問題",
      icon: "🎯",
      idRange: "応用5問",
      focus: "実践的な活用",
    },
    {
      id: "comprehensive",
      name: "総合編",
      description: "総合問題",
      icon: "👑",
      idRange: "総合5問",
      focus: "全体的な理解確認",
    },
  ];
};

export default function FoundationQuestionSetSelection() {
  const navigate = useNavigate();
  const { category, difficulty } = useParams<{
    category: string;
    difficulty: string;
  }>();

  const questionSets = getQuestionSets(category || "");

  const handleBack = () => {
    navigate(`/learning/foundation/difficulty/${category}`);
  };

  const handleSetSelection = (setId: string) => {
    navigate(`/learning/foundation/quiz/${category}/${difficulty}/${setId}`);
  };

  return (
    <div className="min-h-screenp-4" style={{ background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)` }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">問題セット選択</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline">{categoryLabels[category || ""]}</Badge>
              <Badge variant="outline">
                {difficultyLabels[difficulty || ""]}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-8">
          学習したい問題セットを選択してください（各セット5問）
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionSets.map((set) => (
            <Card
              key={set.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-300"
              onClick={() => handleSetSelection(set.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{set.icon}</div>
                  <Badge variant="secondary">5問</Badge>
                </div>
                <CardTitle className="text-lg">{set.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{set.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {set.idRange}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Target className="w-3 h-3 mr-1" />
                    {set.focus}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 学習のヒント */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              問題セットについて
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• 各問題セットは5問の連続問題です</p>
              <p>• セットを完了すると統計が記録されます</p>
              <p>• 苦手なセットは何度でも挑戦できます</p>
              <p>• 段階的に学習することで効率的に習得できます</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
