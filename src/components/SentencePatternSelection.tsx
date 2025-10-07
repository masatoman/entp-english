import { categoryLabels } from "../constants";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category } from "../types";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";


interface SentencePattern {
  id: string;
  name: string;
  description: string;
  example: string;
  icon: string;
  color: string;
}

export default function SentencePatternSelection() {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams<{ category: Category }>();
  const category = urlCategory!;

  useScrollToTop();

  // 基本文型の場合のみ文型選択を表示
  const sentencePatterns: SentencePattern[] = [
    {
      id: "svo",
      name: "SVO",
      description: "主語 + 動詞 + 目的語",
      example: "I study English.",
      icon: "📝",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: "sv",
      name: "SV",
      description: "主語 + 動詞",
      example: "I sleep.",
      icon: "📋",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      id: "svoc",
      name: "SVOC",
      description: "主語 + 動詞 + 目的語 + 補語",
      example: "We call him Tom.",
      icon: "📄",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: "svoo",
      name: "SVOO",
      description: "主語 + 動詞 + 間接目的語 + 直接目的語",
      example: "I gave him a book.",
      icon: "📃",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
    {
      id: "comprehensive",
      name: "総合問題",
      description: "全文型の総合演習",
      example: "混合パターンの実践問題",
      icon: "🎯",
      color: "bg-red-50 border-red-200 text-red-800",
    },
  ];

  const handlePatternSelect = (patternId: string) => {
    navigate(`/learning/grammar/difficulty/${category}/${patternId}`);
  };

  const handleBack = () => {
    navigate("/learning/grammar/category");
  };

  // 基本文型以外の場合は直接難易度選択に進む
  if (category !== "basic-grammar") {
    navigate(`/learning/grammar/difficulty/${category}`);
    return null;
  }

  return (
    <div className="min-h-screenp-4" style={{ background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)` }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">文型選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[category]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        <p className="text-center text-muted-foreground mb-8">
          学習したい文型を選択してください
        </p>

        {/* 文型一覧 */}
        <div className="space-y-4">
          {sentencePatterns.map((pattern) => (
            <SelectionCard
              key={pattern.id}
              id={pattern.id}
              title={pattern.name}
              description={pattern.description}
              detail={pattern.example}
              icon={pattern.icon}
              difficulty=""
              color={pattern.color}
              onClick={() => handlePatternSelect(pattern.id)}
            />
          ))}
        </div>

        {/* 説明 */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            文型について
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• 各文型は英語の基本構造を表します</p>
            <p>• SVO（主語・動詞・目的語）が最も基本的な文型です</p>
            <p>• 総合問題では全ての文型が混合して出題されます</p>
            <p>• まずは基本のSVOから始めることをお勧めします</p>
          </div>
        </div>
      </div>
    </div>
  );
}
