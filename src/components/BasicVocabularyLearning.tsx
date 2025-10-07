import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

export default function BasicVocabularyLearning() {
  const navigate = useNavigate();
  useScrollToTop();

  const difficulties = [
    {
      level: "beginner" as const,
      title: "初級",
      description: "基本的な日常会話でよく使われる単語",
      detail: "reliable, confident, important など基本語彙",
      color: "bg-green-50 border-green-200 text-green-800",
      difficulty: "初級",
      icon: "⭐",
      examples: ["reliable", "confident", "important", "beautiful"],
    },
    {
      level: "intermediate" as const,
      title: "中級",
      description: "ビジネスや日常でよく使われる単語",
      detail: "accomplish, opportunity, effective など実用語彙",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      difficulty: "中級",
      icon: "⚡",
      examples: ["accomplish", "opportunity", "effective", "professional"],
    },
    {
      level: "advanced" as const,
      title: "上級",
      description: "ビジネス、学術、専門的な単語",
      detail: "sophisticated, comprehensive など高度語彙",
      color: "bg-purple-50 border-purple-200 text-purple-800",
      difficulty: "上級",
      icon: "👑",
      examples: ["sophisticated", "comprehensive", "methodology"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/learning/vocabulary/difficulty")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">基本単語学習</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm bg-green-100">
                📚 ベーシック
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* 説明 */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-green-700">
            📚 基本単語専用学習
          </h3>
          <p className="text-sm text-gray-700">
            体系的に整理された標準語彙を段階的に学習します。
            確実な基礎固めから高度な語彙まで段階的に習得できます。
          </p>
          <div className="mt-3 text-xs text-green-600">
            💡 初級から順番に学習することで、確実な語彙力を身につけられます
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-8">
          難易度を選択してください
        </p>

        <div className="space-y-4">
          {difficulties.map((difficulty) => (
            <SelectionCard
              key={difficulty.level}
              id={difficulty.level}
              title={difficulty.title}
              description={difficulty.description}
              detail={difficulty.detail}
              icon={difficulty.icon}
              difficulty={difficulty.difficulty}
              color={difficulty.color}
              keyPoints={[
                `例: ${difficulty.examples.join(", ")}`,
                "体系的な段階学習",
                "確実な基礎固め",
                "ガチャカード除外",
              ]}
              onClick={() =>
                navigate(
                  `/learning/vocabulary/study/${difficulty.level}/basic-only`
                )
              }
            />
          ))}
        </div>

        {/* 学習ポイント */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">📖 基本単語学習の特徴</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>
                <strong>体系的学習</strong>: 初級→中級→上級の論理的順序
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>
                <strong>確実な基礎</strong>: 英語学習の土台となる重要語彙
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>
                <strong>純粋学習</strong>: ガチャ要素に惑わされない集中学習
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
