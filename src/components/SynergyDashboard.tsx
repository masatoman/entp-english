import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Brain, Star, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Category } from "../types";
import { 
  synergyManager, 
  ContentMetadata, 
  LearningPath, 
  SynergyProgress 
} from "../utils/contentMetadataManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface SynergyDashboardProps {
  userId?: string;
  currentCategory?: Category;
}

export default function SynergyDashboard({ 
  userId = "default", 
  currentCategory 
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
    const path = synergyManager.getOptimalLearningPath(category, completedContent);
    setOptimalPath(path);
  };

  const handleContentSelect = (contentId: string) => {
    const metadata = synergyProgress.find(p => p.contentId === contentId);
    if (!metadata) return;

    // コンテンツタイプに応じて適切なページに遷移
    if (contentId.includes("theory")) {
      navigate(`/learning/pre-study/content/${contentId}`);
    } else if (contentId.includes("quiz")) {
      const category = contentId.split("-")[0] as Category;
      const difficulty = contentId.includes("easy") ? "easy" : 
                       contentId.includes("normal") ? "normal" : "hard";
      
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

  // 推奨コンテンツ（シナジーボーナスが高い順）
  const recommendedContent = synergyProgress
    .filter(p => p.completionRate === 0 && p.synergyBonus > 1.0)
    .sort((a, b) => b.synergyBonus - a.synergyBonus)
    .slice(0, 6);

  // 完了済みコンテンツの統計
  const completedCount = synergyProgress.filter(p => p.completionRate === 1.0).length;
  const totalCount = synergyProgress.length;
  const averageSynergyBonus = totalCount > 0 
    ? synergyProgress.reduce((sum, p) => sum + p.synergyBonus, 0) / totalCount 
    : 1.0; // デフォルト値として1.0（100%）を設定

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
              事前学習と文法クイズの相乗効果を最大化しよう！
            </p>
          </div>
          <div className="w-32" />
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完了コンテンツ</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
              <Progress value={(completedCount / totalCount) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均シナジー効果</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCount > 0 ? Math.round((averageSynergyBonus - 1) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                学習効果の向上率
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">解放コンテンツ</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {synergyProgress.reduce((sum, p) => sum + p.unlockedContent.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                新たに利用可能
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">推奨コンテンツ</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendedContent.length}</div>
              <p className="text-xs text-muted-foreground">
                シナジー効果あり
              </p>
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
                      <Badge className={getSynergyLevelColor(step.synergyBonus)}>
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
            <CardTitle>シナジー効果の高い推奨コンテンツ</CardTitle>
            <CardDescription>
              現在の学習進捗に基づいて、最も効果的なコンテンツを表示しています
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedContent.map((progress) => (
                <div
                  key={progress.contentId}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleContentSelect(progress.contentId)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      {progress.contentId.replace(/-/g, ' ').toUpperCase()}
                    </h4>
                    <Badge className={getSynergyLevelColor(progress.synergyBonus)}>
                      +{Math.round((progress.synergyBonus - 1) * 100)}%
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    効果スコア: {Math.round(progress.effectivenessScore * 100)}%
                  </p>
                  
                  {progress.recommendedNext.length > 0 && (
                    <div className="text-xs text-blue-600">
                      次の推奨: {progress.recommendedNext.length}件
                    </div>
                  )}
                  
                  {progress.unlockedContent.length > 0 && (
                    <div className="text-xs text-green-600">
                      解放コンテンツ: {progress.unlockedContent.length}件
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* シナジー効果の説明 */}
        <Card>
          <CardHeader>
            <CardTitle>シナジー効果とは？</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">理論学習</h4>
                <p className="text-sm text-gray-600">
                  事前学習で基礎理論を習得
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">実践練習</h4>
                <p className="text-sm text-gray-600">
                  文法クイズで理解を定着
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">相乗効果</h4>
                <p className="text-sm text-gray-600">
                  学習効果が最大200%向上
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
