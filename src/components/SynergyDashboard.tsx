import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseColors } from "../styles/colors";
import { Category } from "../types";
import {
  ContentMetadata,
  LearningPath,
  synergyManager,
  SynergyProgress,
} from "../utils/contentMetadataManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";

interface SynergyDashboardProps {
  userId?: string;
  currentCategory?: Category;
}

export default function SynergyDashboard({
  userId = "default",
  currentCategory,
}: SynergyDashboardProps) {
  const navigate = useNavigate();
  const [synergyProgress, setSynergyProgress] = useState<SynergyProgress[]>([]);
  const [optimalPath, setOptimalPath] = useState<LearningPath | null>(null);
  const [relatedContent, setRelatedContent] = useState<ContentMetadata[]>([]);
  const [completedContent, setCompletedContent] = useState<string[]>([]);

  useEffect(() => {
    loadUserProgress();
    if (currentCategory) {
      loadOptimalPath(currentCategory);
    }
    // シナジーダッシュボード訪問をデイリークエストに記録
    dailyQuestManager.recordSynergyVisit();
  }, [userId, currentCategory]);

  const loadUserProgress = () => {
    // LocalStorageから学習進捗を読み込み
    try {
      const saved = localStorage.getItem(`synergy-progress-${userId}`);
      const completed = saved ? JSON.parse(saved) : [];
      setCompletedContent(completed);

      const progress = synergyManager.trackSynergyProgress(userId, completed);
      setSynergyProgress(progress);
    } catch (error) {
      console.error("進捗データの読み込みに失敗:", error);
    }
  };

  const loadOptimalPath = (category: Category) => {
    const path = synergyManager.getOptimalLearningPath(
      category,
      completedContent
    );
    setOptimalPath(path);
  };

  const handleContentSelect = (contentId: string) => {
    const metadata = synergyProgress.find((p) => p.contentId === contentId);
    if (!metadata) return;

    // コンテンツタイプに応じて適切なページに遷移
    if (contentId.includes("theory")) {
      navigate(`/learning/pre-study/content/${contentId}`);
    } else if (contentId.includes("quiz")) {
      const category = contentId.split("-")[0] as Category;
      const difficulty = contentId.includes("easy")
        ? "easy"
        : contentId.includes("normal")
        ? "normal"
        : "hard";

      if (category === "basic-grammar") {
        navigate(`/learning/grammar/pattern/${category}`);
      } else {
        navigate(`/learning/grammar/difficulty/${category}`);
      }
    }
  };

  const markContentCompleted = (contentId: string) => {
    const updated = [...completedContent, contentId];
    setCompletedContent(updated);
    localStorage.setItem(`synergy-progress-${userId}`, JSON.stringify(updated));

    // 進捗を再計算
    const progress = synergyManager.trackSynergyProgress(userId, updated);
    setSynergyProgress(progress);
  };

  const getSynergyLevelColor = (bonus: number): string => {
    if (bonus >= 1.5) return "text-green-600 bg-green-50";
    if (bonus >= 1.2) return "text-blue-600 bg-blue-50";
    if (bonus >= 1.1) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getSynergyLevelText = (bonus: number): string => {
    if (bonus >= 1.5) return "高シナジー";
    if (bonus >= 1.2) return "中シナジー";
    if (bonus >= 1.1) return "低シナジー";
    return "シナジーなし";
  };

  // 推奨コンテンツ（未完了のものを効果順に表示、多様性を確保）
  const recommendedContent = synergyProgress
    .filter((p) => p.completionRate === 0) // 未完了のコンテンツのみ
    .filter((p) => !isNaN(p.effectivenessScore) && !isNaN(p.synergyBonus)) // NaNデータを除外
    .sort((a, b) => {
      // 効果の高い順にソート（synergyBonus優先、effectivenessScore副次）
      const bonusDiff = b.synergyBonus - a.synergyBonus;
      if (Math.abs(bonusDiff) > 0.01) return bonusDiff;
      return b.effectivenessScore - a.effectivenessScore;
    })
    .slice(0, 8); // 表示数を8個に設定

  // 完了済みコンテンツの統計
  const completedCount = synergyProgress.filter(
    (p) => p.completionRate === 1.0
  ).length;
  const totalCount = synergyProgress.length;
  const averageSynergyBonus = (() => {
    if (totalCount === 0 || !synergyProgress || synergyProgress.length === 0) {
      return 1.0; // デフォルト値として1.0（100%）を設定
    }

    const validBonuses = synergyProgress
      .map((p) => p.synergyBonus)
      .filter(
        (bonus) => typeof bonus === "number" && !isNaN(bonus) && bonus > 0
      );

    if (validBonuses.length === 0) {
      return 1.0; // 有効なボーナスがない場合はデフォルト値
    }

    const sum = validBonuses.reduce((acc, bonus) => acc + bonus, 0);
    return sum / validBonuses.length;
  })();

  return (
    <div
      className="min-h-screenp-4"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <Brain className="inline-block w-8 h-8 mr-2 text-blue-600" />
              学習シナジーダッシュボード
            </h1>
            <p className="text-gray-600">
              事前学習と文法クイズを組み合わせて、学習効果を最大260%まで向上させよう！
            </p>
            <div className="mt-2 text-sm text-blue-600">
              💡
              このページは「事前学習」専用です。スキルツリーとは別のシステムです。
            </div>
          </div>
          <div className="w-32" />
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                完了した事前学習
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedCount}/{totalCount}
              </div>
              <Progress
                value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                理論学習の進捗
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                平均シナジー効果
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCount > 0
                  ? Math.round((averageSynergyBonus - 1) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">学習効果の向上率</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                新しい事前学習
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {synergyProgress.reduce(
                  (sum, p) => sum + p.unlockedContent.length,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                学習で解放された理論コンテンツ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                おすすめ事前学習
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recommendedContent.length}
              </div>
              <p className="text-xs text-muted-foreground">効果的な理論学習</p>
            </CardContent>
          </Card>
        </div>

        {/* 最適学習パス */}
        {optimalPath && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
                推奨学習パス: {optimalPath.name}
              </CardTitle>
              <CardDescription>{optimalPath.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  推定時間: {optimalPath.estimatedTotalTime}分
                </Badge>
                <Badge variant="outline">
                  シナジースコア: {Math.round(optimalPath.synergyScore * 100)}%
                </Badge>
                <Badge variant="outline">
                  難易度: {optimalPath.difficulty}
                </Badge>
              </div>

              <div className="space-y-2">
                {optimalPath.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600">
                          {step.estimatedTime}分 • {step.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getSynergyLevelColor(step.synergyBonus)}
                      >
                        {getSynergyLevelText(step.synergyBonus)}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleContentSelect(step.id)}
                        disabled={completedContent.includes(step.id)}
                      >
                        {completedContent.includes(step.id) ? "完了" : "開始"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 推奨コンテンツ */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 今やるべき学習（効果順）</CardTitle>
            <CardDescription>
              今のあなたにとって最も効果的な学習を効果の高い順に表示しています
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedContent.map((progress, index) => {
                const bonusPercent = Math.round(
                  (progress.synergyBonus - 1) * 100
                );
                const effectivenessPercent = isNaN(progress.effectivenessScore)
                  ? 50 // デフォルト値
                  : Math.round(progress.effectivenessScore * 100);

                // 効果レベルの判定（より多様性を確保）
                const getEffectLevel = (bonus: number) => {
                  if (bonus >= 25)
                    return {
                      text: "超効果的",
                      color: "bg-purple-100 text-purple-700 border-purple-300",
                    };
                  if (bonus >= 15)
                    return {
                      text: "とても効果的",
                      color: "bg-blue-100 text-blue-700 border-blue-300",
                    };
                  if (bonus >= 5)
                    return {
                      text: "効果的",
                      color: "bg-green-100 text-green-700 border-green-300",
                    };
                  if (bonus >= 0)
                    return {
                      text: "普通",
                      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
                    };
                  return {
                    text: "要注意",
                    color: "bg-gray-100 text-gray-700 border-gray-300",
                  };
                };

                const effectLevel = getEffectLevel(bonusPercent);

                return (
                  <div
                    key={progress.contentId}
                    className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${effectLevel.color}`}
                    onClick={() => handleContentSelect(progress.contentId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-700">
                          #{index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {effectLevel.text}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">学習効果</div>
                        <div className="font-bold text-sm">
                          {bonusPercent > 0 ? `+${bonusPercent}%` : "通常"}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium text-sm mb-2">
                      {progress.contentId.replace(/-/g, " ").toUpperCase()}
                    </h4>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">おすすめ度:</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => {
                            // より多様な星評価のための改善された計算
                            let starCount;
                            if (effectivenessPercent >= 90) starCount = 5;
                            else if (effectivenessPercent >= 75) starCount = 4;
                            else if (effectivenessPercent >= 60) starCount = 3;
                            else if (effectivenessPercent >= 40) starCount = 2;
                            else starCount = 1;

                            return (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < starCount
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ⭐
                              </span>
                            );
                          })}
                          <span className="text-gray-600 ml-1">
                            ({effectivenessPercent}%)
                          </span>
                        </div>
                      </div>

                      {bonusPercent > 0 && (
                        <div className="bg-white/50 p-2 rounded text-center">
                          <div className="text-gray-700 font-medium">
                            通常より
                            <span className="text-green-600 font-bold">
                              {bonusPercent}%
                            </span>
                            多くXPがもらえる！
                          </div>
                        </div>
                      )}
                    </div>

                    {progress.recommendedNext.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600">
                        💡 次の推奨: {progress.recommendedNext.length}件
                      </div>
                    )}

                    {progress.unlockedContent.length > 0 && (
                      <div className="mt-1 text-xs text-green-600">
                        🔓 解放される学習: {progress.unlockedContent.length}件
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 説明セクション */}
            <div className="mt-6 space-y-4">
              {/* このページの説明 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">
                  🧠 このページについて
                </h4>
                <div className="space-y-2 text-sm text-blue-600">
                  <div>
                    • このページは<strong>「事前学習」の効率的な使い方</strong>
                    を支援します
                  </div>
                  <div>
                    • <strong>スキルツリーとは別のシステム</strong>
                    です（スキルツリーは文法学習全体、こちらは理論学習専用）
                  </div>
                  <div>
                    • 事前学習（理論）→ 文法クイズ（実践）の順番で学習すると
                    <strong>学習効果が大幅アップ</strong>します
                  </div>
                </div>
              </div>

              {/* 4つのブロックの説明 */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">
                  📊 4つのブロックの意味
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-600">
                  <div>
                    <strong>完了した事前学習</strong>
                    ：あなたが読み終えた理論コンテンツの数
                  </div>
                  <div>
                    <strong>平均シナジー効果</strong>
                    ：理論学習により文法クイズでどれくらい効果アップするか
                  </div>
                  <div>
                    <strong>新しい事前学習</strong>
                    ：学習進捗により新たに読めるようになった理論コンテンツ
                  </div>
                  <div>
                    <strong>おすすめ事前学習</strong>
                    ：今のあなたに最も効果的な理論学習の数
                  </div>
                </div>
              </div>

              {/* 表示の見方 */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-700 mb-2">
                  💡 表示の見方
                </h4>
                <div className="space-y-2 text-sm text-yellow-600">
                  <div>
                    • <strong>学習効果 +30%</strong>
                    ：この理論を学んだ後に文法クイズをすると、通常より30%多くXPがもらえます
                  </div>
                  <div>
                    • <strong>おすすめ度 ⭐⭐⭐⭐⭐</strong>
                    ：今のあなたの学習レベルにどれくらい適しているかを5段階で表示
                  </div>
                  <div>
                    • <strong>効果的レベル</strong>：理論学習の効果度（超効果的
                    &gt; とても効果的 &gt; 効果的 &gt; 普通）
                  </div>
                  <div>
                    • <strong>番号順</strong>
                    ：#1が最も効果的、効果順に並んでいます
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* シナジー効果の説明 */}
        <Card>
          <CardHeader>
            <CardTitle>🧠 シナジー効果とは？</CardTitle>
            <CardDescription>
              理論学習と実践練習を組み合わせることで、学習効果が大幅に向上する仕組みです
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 基本的な流れ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">📚 理論学習</h4>
                <p className="text-sm text-gray-600">
                  事前学習で基礎理論を習得
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">🎯 実践練習</h4>
                <p className="text-sm text-gray-600">文法クイズで理解を定着</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">🚀 相乗効果</h4>
                <p className="text-sm text-gray-600">学習効果が最大260%向上</p>
              </div>
            </div>

            {/* 具体例 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-center">
                📖 具体例：時制の学習
              </h4>

              <div className="space-y-4">
                {/* ステップ1 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-black text-xs flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-700">
                      📚 事前学習：「時制の完全マスター」
                    </h5>
                    <p className="text-sm text-gray-600">
                      現在完了形の理論を詳しく学習
                    </p>
                    <div className="text-xs text-blue-600 mt-1">
                      例：「have + 過去分詞」の3つの用法（継続・経験・完了）
                    </div>
                  </div>
                </div>

                {/* 矢印 */}
                <div className="text-center">
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                </div>

                {/* ステップ2 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-black text-xs flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-green-700">
                      🎯 実践練習：「時制クイズ」
                    </h5>
                    <p className="text-sm text-gray-600">
                      学んだ理論を問題で確認
                    </p>
                    <div className="text-xs text-green-600 mt-1">
                      例：「私は3年間英語を勉強しています」→「I have studied
                      English for 3 years.」
                    </div>
                  </div>
                </div>

                {/* 矢印 */}
                <div className="text-center">
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                </div>

                {/* ステップ3 */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-black text-xs flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-purple-700">
                      🚀 シナジー効果発動！
                    </h5>
                    <p className="text-sm text-gray-600">
                      理論×実践で学習効果が大幅アップ
                    </p>
                    <div className="text-xs text-purple-600 mt-1">
                      基本80 XP → シナジーボーナス+30% → 104 XP獲得！
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 効果比較 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">
                  ❌ 単体学習の場合
                </h4>
                <div className="space-y-2 text-sm">
                  <div>• 文法クイズのみ：80 XP</div>
                  <div>• 理解度：70%</div>
                  <div>• 定着率：50%</div>
                  <div className="font-bold text-red-600">合計効果：100%</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">
                  ✅ シナジー学習の場合
                </h4>
                <div className="space-y-2 text-sm">
                  <div>• 事前学習 + 文法クイズ：104 XP</div>
                  <div>• 理解度：95%</div>
                  <div>• 定着率：85%</div>
                  <div className="font-bold text-green-600">
                    合計効果：130%（+30%向上）
                  </div>
                </div>
              </div>
            </div>

            {/* さらなる活用法 */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-700 mb-3">
                💡 さらなる活用法
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">
                    🎁 ガチャ語彙との組み合わせ
                  </h5>
                  <p className="text-gray-600">
                    ガチャで覚えた単語を文法クイズで活用 → +50%効果
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">
                    🏆 XPショップのブースター
                  </h5>
                  <p className="text-gray-600">
                    相乗効果マルチプライヤー購入 → 効果2倍（最大260%）
                  </p>
                </div>
              </div>
            </div>

            {/* 推奨学習パターン */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-700 mb-3">
                🎯 推奨学習パターン
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <span>朝：事前学習で理論習得（⭐️1個消費）</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <span>昼：関連する文法クイズで実践（♥1個消費）</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <span>夕：統合学習でガチャ語彙を活用（♥1個消費）</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-purple-500 text-black text-xs flex items-center justify-center">
                    🚀
                  </span>
                  <span className="font-bold text-purple-600">
                    結果：通常の2.6倍の学習効果！
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
