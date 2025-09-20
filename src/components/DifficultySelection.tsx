import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

// ルーター対応版 - propsは不要

const categoryLabels: Record<Category, string> = {
  "basic-grammar": "基本文型",
  tenses: "時制",
  modals: "助動詞",
  passive: "受動態",
  relative: "関係詞",
  subjunctive: "仮定法",
  comparison: "比較",
  participle: "分詞・動名詞",
  infinitive: "不定詞",
};

export default function DifficultySelection() {
  const navigate = useNavigate();
  const { category: urlCategory } = useParams<{ category: Category }>();
  const actualCategory = urlCategory || "basic-grammar";
  useScrollToTop();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/learning/grammar/category")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">難易度選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[actualCategory]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        <p className="text-center text-gray-600 mb-6">
          難易度を選択してください
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectionCard
            id="easy"
            title="簡単"
            description="4択問題形式"
            detail="与えられた日本語に対して、4つの選択肢から適切な英文を選びます。"
            icon="⭐"
            difficulty="初級"
            color="bg-green-50 border-green-200 text-green-800"
            onClick={() => {
              console.log("Easy difficulty clicked");
              navigate(`/learning/grammar/list/${actualCategory}/easy`);
            }}
          />

          <SelectionCard
            id="normal"
            title="普通"
            description="ヒント付き入力"
            detail="キーワードのヒントを参考に英文を入力します。"
            icon="⚡"
            difficulty="中級"
            color="bg-yellow-50 border-yellow-200 text-yellow-800"
            onClick={() => {
              console.log("Normal difficulty clicked");
              navigate(`/learning/grammar/list/${actualCategory}/normal`);
            }}
          />

          <SelectionCard
            id="hard"
            title="難しい"
            description="ヒントなし入力"
            detail="ヒントなしで日本語を英語に翻訳します。"
            icon="👑"
            difficulty="上級"
            color="bg-red-50 border-red-200 text-red-800"
            onClick={() => {
              console.log("Hard difficulty clicked");
              navigate(`/learning/grammar/list/${actualCategory}/hard`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
