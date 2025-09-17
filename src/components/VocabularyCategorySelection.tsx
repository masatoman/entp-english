import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

interface VocabularyCategorySelectionProps {
  onBack: () => void;
  onSelectCategory: (category: "all" | "toeic" | "daily") => void;
}

export function VocabularyCategorySelection({
  onBack,
  onSelectCategory,
}: VocabularyCategorySelectionProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "intermediate";
  useScrollToTop();
  const categories = [
    {
      id: "all" as const,
      title: "すべて",
      description: "全レベルの単語をランダムに学習",
      detail: "初級から上級まで幅広いレベルの単語",
      color: "bg-gray-50 border-gray-200 text-gray-800",
      difficulty: "全レベル",
      wordCount: "130個の単語",
      examples: ["reliable", "accomplish", "sophisticated"],
    },
    {
      id: "toeic" as const,
      title: "TOEIC頻出",
      description: "TOEIC試験でよく出る単語",
      detail: "TOEIC試験で頻繁に出題されるビジネス単語",
      color: "bg-orange-50 border-orange-200 text-orange-800",
      difficulty: "中級",
      wordCount: "20個の単語",
      examples: ["revenue", "budget", "deadline", "contract"],
    },
    {
      id: "daily" as const,
      title: "日常会話",
      description: "日常会話でよく使われる単語",
      detail: "友達との会話や日常的な表現で使用される単語",
      color: "bg-green-50 border-green-200 text-green-800",
      difficulty: "初級",
      wordCount: "15個の単語",
      examples: ["awesome", "amazing", "fantastic", "wonderful"],
    },
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/learning/vocabulary/difficulty")}
          >
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <SelectionCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              detail={category.detail}
              difficulty={category.difficulty}
              color={category.color}
              keyPoints={[
                `例: ${category.examples.join(", ")}`,
                category.wordCount,
              ]}
              onClick={(id) => {
                const category = id as "all" | "toeic" | "daily";
                navigate(
                  `/learning/vocabulary/study/${difficulty}/${category}`
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
