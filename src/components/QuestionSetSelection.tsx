import { categoryLabels } from "../constants";
import { ArrowLeft, BookOpen, Star, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category } from "../types";
// import { questionStatsManager } from "../utils/questionStatsManager";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";


const difficultyLabels = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

interface QuestionSetInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

export default function QuestionSetSelection() {
  const navigate = useNavigate();
  const {
    category: urlCategory,
    pattern: urlPattern,
    difficulty: urlDifficulty,
  } = useParams<{
    category: Category;
    pattern: string;
    difficulty: "easy" | "normal" | "hard";
  }>();

  const category = urlCategory!;
  const pattern = urlPattern!;
  const difficulty = urlDifficulty!;

  useScrollToTop();

  // 問題集の定義
  const getQuestionSets = (): QuestionSetInfo[] => {
    if (category === "basic-grammar") {
      // 選択された文型に応じた問題集を定義
      const patternNames: Record<string, string> = {
        svo: "SVO（主語+動詞+目的語）",
        sv: "SV（主語+動詞）",
        svc: "SVC（主語+動詞+補語）",
        svoo: "SVOO（主語+動詞+間接目的語+直接目的語）",
        svoc: "SVOC（主語+動詞+目的語+補語）",
        comprehensive: "全文型総合",
      };

      const patternName = patternNames[pattern] || pattern.toUpperCase();

      return [
        {
          id: "easy",
          name: `${patternName}基礎`,
          description: `${patternName}文型の基本問題`,
          icon: "📝",
          color: "bg-blue-50 border-blue-200 text-blue-800",
          questionCount: 5,
        },
        {
          id: "normal",
          name: `${patternName}応用`,
          description: `${patternName}文型の応用問題`,
          icon: "📋",
          color: "bg-green-50 border-green-200 text-green-800",
          questionCount: 5,
        },
        {
          id: "hard",
          name: `${patternName}上級`,
          description: `${patternName}文型の上級問題`,
          icon: "📄",
          color: "bg-purple-50 border-purple-200 text-purple-800",
          questionCount: 5,
        },
        {
          id: "comprehensive",
          name: "総合問題",
          description: `${patternName}の総合演習`,
          icon: "🎯",
          color: "bg-red-50 border-red-200 text-red-800",
          questionCount: 15,
        },
      ];
    } else {
      // 他のカテゴリーは標準的な問題集
      return [
        {
          id: "set-a",
          name: "問題集A",
          description: "基礎レベルの問題",
          icon: "📝",
          color: "bg-blue-50 border-blue-200 text-blue-800",
          questionCount: 5,
        },
        {
          id: "set-b",
          name: "問題集B",
          description: "応用レベルの問題",
          icon: "📋",
          color: "bg-green-50 border-green-200 text-green-800",
          questionCount: 5,
        },
      ];
    }
  };

  const questionSets = getQuestionSets();

  // 問題集の統計を取得
  const getSetStats = (setId: string) => {
    // const _stats = questionStatsManager.getCategoryStats(category, difficulty);
    // 問題集ごとの統計は将来実装予定
    return {
      completed: 0,
      total: setId === "comprehensive" ? 10 : 5,
      averageSuccess: 0,
    };
  };

  const handleSetSelect = (setId: string) => {
    navigate(
      `/learning/grammar/question-set/${category}/${pattern}/${difficulty}/${setId}`
    );
  };

  const handleBack = () => {
    navigate(`/learning/grammar/difficulty/${category}/${pattern}`);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">問題集選択</h1>
            <div className="flex justify-center mt-2 space-x-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {difficultyLabels[difficulty]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        <p className="text-center text-muted-foreground mb-8">
          学習したい問題集を選択してください
        </p>

        {/* 問題集一覧 */}
        <div className="space-y-4">
          {questionSets.map((set) => {
            const stats = getSetStats(set.id);
            const progressPercentage = Math.round(
              (stats.completed / stats.total) * 100
            );

            return (
              <SelectionCard
                key={set.id}
                id={set.id}
                title={set.name}
                description={set.description}
                detail={`${set.questionCount}問の連続問題`}
                icon={set.icon}
                difficulty=""
                color={set.color}
                onClick={() => handleSetSelect(set.id)}
                className="relative"
              >
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {set.questionCount}問
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        進捗: {progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {stats.completed > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        正答率: {stats.averageSuccess}%
                      </span>
                    </div>
                  )}
                </div>
              </SelectionCard>
            );
          })}
        </div>

        {/* 説明 */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            問題集について
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • 各問題集は
              {category === "basic-grammar" && "5問（総合問題は10問）"}
              の連続問題です
            </p>
            <p>• 問題集を完了すると統計が記録されます</p>
            <p>• 苦手な問題集は何度でも挑戦できます</p>
            <p>• 全問題集をクリアして文法をマスターしましょう</p>
          </div>
        </div>
      </div>
    </div>
  );
}
