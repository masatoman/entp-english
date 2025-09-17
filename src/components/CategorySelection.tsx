import { ArrowLeft } from "lucide-react";
import { Category } from "../types";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

interface CategorySelectionProps {
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
}

const categories = [
  {
    id: "basic-grammar" as Category,
    title: "基本文型",
    description: "be動詞・一般動詞",
    detail: "I am / You are / He has など基本的な文の構造",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    difficulty: "初級",
  },
  {
    id: "tenses" as Category,
    title: "時制",
    description: "現在・過去・未来・完了",
    detail: "現在形、過去形、未来形、現在完了形など",
    color: "bg-green-50 border-green-200 text-green-800",
    difficulty: "初〜中級",
  },
  {
    id: "modals" as Category,
    title: "助動詞",
    description: "can / will / should など",
    detail: "可能性、意志、義務を表す助動詞",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    difficulty: "初〜中級",
  },
  {
    id: "passive" as Category,
    title: "受動態",
    description: "be + 過去分詞",
    detail: "「～される」という受身の表現",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    difficulty: "中級",
  },
  {
    id: "relative" as Category,
    title: "関係詞",
    description: "who / which / that など",
    detail: "関係代名詞・関係副詞を使った修飾",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    difficulty: "中級",
  },
  {
    id: "subjunctive" as Category,
    title: "仮定法",
    description: "if文・仮定の表現",
    detail: "「もし～だったら」という仮定の文",
    color: "bg-red-50 border-red-200 text-red-800",
    difficulty: "中〜上級",
  },
  {
    id: "comparison" as Category,
    title: "比較",
    description: "比較級・最上級",
    detail: "より～、最も～という比較の表現",
    color: "bg-teal-50 border-teal-200 text-teal-800",
    difficulty: "中級",
  },
  {
    id: "participle" as Category,
    title: "分詞・動名詞",
    description: "-ing / -ed の使い方",
    detail: "現在分詞、過去分詞、動名詞の用法",
    color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    difficulty: "中〜上級",
  },
  {
    id: "infinitive" as Category,
    title: "不定詞",
    description: "to + 動詞の原形",
    detail: "名詞的・形容詞的・副詞的用法",
    color: "bg-pink-50 border-pink-200 text-pink-800",
    difficulty: "中級",
  },
];

export function CategorySelection({
  onSelectCategory,
  onBack,
}: CategorySelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">カテゴリー選択</h1>
            <p className="text-gray-600 mt-2">
              学習したい文法カテゴリーを選択してください
            </p>
          </div>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <SelectionCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              detail={category.detail}
              difficulty={category.difficulty}
              color={category.color}
              onClick={(id) => {
                console.log("Category clicked:", id);
                onSelectCategory(id as Category);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
