import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

interface VocabularyDifficultySelectionProps {
  onBack: () => void;
  onSelectDifficulty: (
    difficulty: "beginner" | "intermediate" | "advanced"
  ) => void;
}

export function VocabularyDifficultySelection({
  onBack,
  onSelectDifficulty,
}: VocabularyDifficultySelectionProps) {
  const navigate = useNavigate();
  useScrollToTop();
  const difficulties = [
    {
      level: "beginner" as const,
      title: "初級",
      description: "基本的な日常会話でよく使われる単語",
      detail: "I am / You are / He has など基本的な単語",
      color: "bg-green-50 border-green-200 text-green-800",
      difficulty: "初級",
      wordCount: "約20個の単語",
      examples: ["reliable", "confident", "important", "beautiful"],
    },
    {
      level: "intermediate" as const,
      title: "中級",
      description: "ビジネスや日常でよく使われる単語",
      detail: "ビジネスシーンや日常会話で頻繁に使用される単語",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      difficulty: "中級",
      wordCount: "約50個の単語",
      examples: ["accomplish", "opportunity", "effective", "professional"],
    },
    {
      level: "advanced" as const,
      title: "上級",
      description: "ビジネス、学術、専門的な単語",
      detail: "学術論文や専門分野で使用される高度な単語",
      color: "bg-purple-50 border-purple-200 text-purple-800",
      difficulty: "上級",
      wordCount: "約30個の単語",
      examples: [
        "sophisticated",
        "comprehensive",
        "methodology",
        "infrastructure",
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-3xl">難易度選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                単語学習
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          難易度を選択してください
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((difficulty) => (
            <SelectionCard
              key={difficulty.level}
              id={difficulty.level}
              title={difficulty.title}
              description={difficulty.description}
              detail={difficulty.detail}
              difficulty={difficulty.difficulty}
              color={difficulty.color}
              keyPoints={[
                `例: ${difficulty.examples.join(", ")}`,
                difficulty.wordCount,
              ]}
              onClick={(id) => {
                const difficulty = id as
                  | "beginner"
                  | "intermediate"
                  | "advanced";
                navigate(
                  `/learning/vocabulary/category?difficulty=${difficulty}`
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
