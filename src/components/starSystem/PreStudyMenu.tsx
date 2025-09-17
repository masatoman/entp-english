import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPreStudyContentsForLevel } from "../../data/preStudyContents";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { DataManager } from "../../utils/dataManager";
import { getLevelManager } from "../../utils/levelManager";
import { Button } from "../ui/button";
import { PreStudyContentCard } from "./PreStudyContentCard";

// ルーター対応版 - propsは不要
export default function PreStudyMenu() {
  const navigate = useNavigate();
  useScrollToTop();

  // 実際のデータを取得
  const levelManager = getLevelManager();
  const userLevelData = levelManager.getLevel();
  const userLevel =
    typeof userLevelData === "object"
      ? userLevelData.level || 1
      : userLevelData || 1;
  const availableContents = getPreStudyContentsForLevel(userLevel);
  const preStudyProgress = DataManager.getPreStudyProgress();
  const completedContents = preStudyProgress.completedContents;

  // デバッグ情報
  console.log("PreStudyMenu - Debug Info:", {
    userLevel,
    availableContentsCount: availableContents.length,
    completedContents,
    preStudyProgress,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const categories = Array.from(
    new Set(availableContents.map((c) => c.category))
  );
  const levels = Array.from(
    new Set(availableContents.map((c) => c.level))
  ).sort((a, b) => a - b);

  const filteredContents = useMemo(() => {
    return availableContents.filter((content) => {
      const categoryMatch =
        selectedCategory === "all" || content.category === selectedCategory;
      const levelMatch =
        selectedLevel === "all" || content.level.toString() === selectedLevel;
      const levelAccess = content.level <= userLevel;

      return categoryMatch && levelMatch && levelAccess;
    });
  }, [availableContents, selectedCategory, selectedLevel, userLevel]);

  const recommendedContent = useMemo(() => {
    return filteredContents.find(
      (content) =>
        !completedContents.includes(content.id) && content.level <= userLevel
    );
  }, [filteredContents, completedContents, userLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 justify-center">
              <span>📚</span>
              事前学習
            </h1>
            <p className="text-gray-600 mt-2">理論を理解してから実践へ</p>
          </div>
          <div className="w-24" />
        </div>

        {/* フィルター */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="all">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="all">すべてのレベル</option>
            {levels.map((level) => (
              <option key={level} value={level.toString()}>
                Level {level}
              </option>
            ))}
          </select>
        </div>

        {/* 推奨コンテンツ */}
        {recommendedContent && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 推奨コンテンツ
            </h2>
            <PreStudyContentCard
              content={recommendedContent}
              isCompleted={completedContents.includes(recommendedContent.id)}
              onSelect={(contentId: string) =>
                navigate(`/learning/pre-study/content/${contentId}`)
              }
            />
          </div>
        )}

        {/* コンテンツリスト */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📖 利用可能なコンテンツ
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContents.map((content) => (
              <PreStudyContentCard
                key={content.id}
                content={content}
                isLocked={content.level > userLevel}
                isCompleted={completedContents.includes(content.id)}
                onSelect={(contentId: string) =>
                  navigate(`/learning/pre-study/content/${contentId}`)
                }
              />
            ))}
          </div>

          {filteredContents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                該当するコンテンツがありません
              </h3>
              <p className="text-gray-600">
                フィルターを変更するか、レベルアップして新しいコンテンツを解放しましょう。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
