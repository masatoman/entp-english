import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

// 基礎カテゴリーの定義
const foundationCategories = [
  {
    id: "parts-of-speech",
    title: "品詞の理解",
    description: "名詞・動詞・形容詞・副詞",
    detail: "英語の基本要素である4つの主要品詞を学習",
    color: "bg-slate-50 border-slate-200 text-slate-800",
    difficulty: "超基礎",
    estimatedTime: "25分",
    problems: "20問",
  },
  {
    id: "word-order",
    title: "語順の基本", 
    description: "英語の基本語順ルール",
    detail: "日本語とは異なる英語の語順を理解",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    difficulty: "超基礎",
    estimatedTime: "30分",
    problems: "15問",
  },
  {
    id: "pronouns",
    title: "代名詞",
    description: "人称代名詞・所有代名詞",
    detail: "he, she, it, my, his, her などの使い分け",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    difficulty: "超基礎",
    estimatedTime: "25分", 
    problems: "15問",
  },
  {
    id: "articles",
    title: "冠詞",
    description: "a / an / the の使い分け",
    detail: "日本語にない概念である冠詞の正しい使い方",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    difficulty: "基礎",
    estimatedTime: "35分",
    problems: "20問",
  },
  {
    id: "plurals", 
    title: "複数形",
    description: "可算・不可算名詞の理解",
    detail: "単数形・複数形の使い分けと不規則変化",
    color: "bg-teal-50 border-teal-200 text-teal-800",
    difficulty: "基礎",
    estimatedTime: "30分",
    problems: "15問",
  },
  {
    id: "questions-negations",
    title: "疑問文・否定文",
    description: "基本的な文の変換",
    detail: "肯定文から疑問文・否定文への変換ルール",
    color: "bg-red-50 border-red-200 text-red-800",
    difficulty: "基礎",
    estimatedTime: "40分",
    problems: "25問",
  },
  {
    id: "prepositions",
    title: "前置詞",
    description: "in / on / at などの使い分け",
    detail: "日本人が最も苦手とする前置詞の使い方",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    difficulty: "中級",
    estimatedTime: "50分",
    problems: "30問",
  },
  {
    id: "conjunctions",
    title: "接続詞",
    description: "and / but / because の文接続",
    detail: "文と文を論理的に接続する方法",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    difficulty: "中級", 
    estimatedTime: "40分",
    problems: "20問",
  },
];

export default function FoundationCategorySelection() {
  const navigate = useNavigate();
  useScrollToTop();

  const handleCategorySelect = (categoryId: string) => {
    console.log("Foundation category clicked:", categoryId);
    navigate(`/learning/foundation/difficulty/${categoryId}`);
  };

  const handleBack = () => {
    navigate("/learning/skill-tree");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            スキルツリーに戻る
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">基礎英語学習</h1>
            <p className="text-gray-600 mt-2">
              英語学習の土台となる基礎分野を選択してください
            </p>
          </div>
          <div className="w-32" />
        </div>

        {/* 学習の重要性説明 */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            なぜ基礎が重要なのか？
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">🏗️ 学習の土台</h4>
              <p>品詞や語順の理解は、全ての文法学習の基礎となります。</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">🎯 効率的習得</h4>
              <p>基礎をしっかり固めることで、応用文法の理解が格段に早くなります。</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">🚀 自信向上</h4>
              <p>基礎ができると英語学習への自信と継続力が向上します。</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">💡 理解促進</h4>
              <p>「なぜそうなるのか」が分かり、暗記ではなく理解ベースの学習が可能になります。</p>
            </div>
          </div>
        </div>

        {/* カテゴリー一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foundationCategories.map((category) => (
            <SelectionCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              detail={category.detail}
              difficulty={category.difficulty}
              color={category.color}
              onClick={(id) => handleCategorySelect(id)}
              className="h-full"
            >
              {/* 追加情報 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {category.estimatedTime}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {category.problems}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    Level 0
                  </div>
                </div>
              </div>
            </SelectionCard>
          ))}
        </div>

        {/* 学習順序の推奨 */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📈 推奨学習順序
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">🥇 最優先</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• 品詞の理解（全ての基礎）</li>
                <li>• 語順の基本（英語の特徴）</li>
                <li>• 代名詞（基本的な置き換え）</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-2">🥈 次のステップ</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• 冠詞（日本語にない概念）</li>
                <li>• 複数形（数の概念）</li>
                <li>• 疑問文・否定文（文の変換）</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-blue-300">
            <p className="text-sm text-blue-700">
              <strong>💡 ENTPの学習特性に配慮：</strong>
              順序は推奨ですが、興味のある分野から始めても構いません。
              重要なのは、全体の関連性を理解しながら学習することです。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
