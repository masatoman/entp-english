import { ArrowLeft, Clock, Star, Trophy, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Category } from "../types";
import { GRAMMAR_SKILL_TREE } from "../utils/skillTreeManager";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
  const { category: urlCategory, pattern: urlPattern } = useParams<{
    category: Category;
    pattern?: string;
  }>();
  const actualCategory = urlCategory || "basic-grammar";
  const pattern = urlPattern;
  useScrollToTop();

  // スキルツリーからノード情報を取得
  const skillNode = GRAMMAR_SKILL_TREE.find(
    (node) => node.category === actualCategory
  );
  return (
    <div className="min-h-screenp-4" style={{ background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)` }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => {
              if (pattern) {
                navigate(`/learning/grammar/pattern/${actualCategory}`);
              } else {
                navigate("/learning/grammar/category");
              }
            }}
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

        {/* スキル詳細情報 */}
        {skillNode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">{skillNode.icon}</span>
                {skillNode.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{skillNode.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Level {skillNode.level}</Badge>
                <Badge variant="outline">{skillNode.difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {skillNode.estimatedTime}分
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">報酬</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                    {skillNode.rewards.xp} XP
                  </div>
                  {skillNode.rewards.badges.map((badge) => (
                    <div key={badge} className="flex items-center text-sm">
                      <Trophy className="w-4 h-4 mr-2 text-purple-600" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              {skillNode.unlocks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">解放されるスキル</h4>
                  <div className="space-y-1">
                    {skillNode.unlocks.map((unlockId) => {
                      const unlockNode = GRAMMAR_SKILL_TREE.find(
                        (n) => n.id === unlockId
                      );
                      return (
                        <div
                          key={unlockId}
                          className="flex items-center text-sm"
                        >
                          <Star className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-blue-800">
                            {unlockNode?.name || unlockId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
              if (pattern) {
                navigate(
                  `/learning/grammar/sets/${actualCategory}/${pattern}/easy`
                );
              } else {
                navigate(`/learning/grammar/question/${actualCategory}/easy`);
              }
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
              if (pattern) {
                navigate(
                  `/learning/grammar/sets/${actualCategory}/${pattern}/normal`
                );
              } else {
                navigate(`/learning/grammar/question/${actualCategory}/normal`);
              }
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
              if (pattern) {
                navigate(
                  `/learning/grammar/sets/${actualCategory}/${pattern}/hard`
                );
              } else {
                navigate(`/learning/grammar/question/${actualCategory}/hard`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
