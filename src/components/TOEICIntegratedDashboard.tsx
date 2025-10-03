import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Heart,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { AdrenalineTOEICIntegrationManager } from "../utils/adrenalineTOEICIntegration";
import { GachaTOEICIntegrationManager } from "../utils/gachaTOEICIntegration";
import { HeartTOEICIntegrationManager } from "../utils/heartTOEICIntegration";
import { IntegratedAchievementsManager } from "../utils/integratedAchievements";
import { IntelligentQuestionSystem } from "../utils/intelligentQuestionSystem";
import { PreStudyTOEICIntegrationManager } from "../utils/preStudyTOEICIntegration";
import { SkillTreeTOEICIntegrationManager } from "../utils/skillTreeTOEICIntegration";
import { SynergyExplosionSystem } from "../utils/synergyExplosionSystem";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const TOEICIntegratedDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userId = "default";

      const [
        preStudyData,
        skillTreeData,
        synergyData,
        intelligentData,
        achievementsData,
        adrenalineData,
        gachaData,
        heartData,
      ] = await Promise.all([
        PreStudyTOEICIntegrationManager.getPreStudyProgressForTOEIC(userId),
        SkillTreeTOEICIntegrationManager.getSkillTreeProgressForTOEIC(userId),
        SynergyExplosionSystem.getSynergyExplosionData(userId),
        IntelligentQuestionSystem.getIntelligentQuestionSelection(userId),
        IntegratedAchievementsManager.getIntegratedAchievements(userId),
        AdrenalineTOEICIntegrationManager.getAdrenalineTOEICIntegration(userId),
        GachaTOEICIntegrationManager.getGachaTOEICIntegration(userId),
        HeartTOEICIntegrationManager.getHeartTOEICIntegration(userId),
      ]);

      setDashboardData({
        preStudy: preStudyData,
        skillTree: skillTreeData,
        synergy: synergyData,
        intelligent: intelligentData,
        achievements: achievementsData,
        adrenaline: adrenalineData,
        gacha: gachaData,
        heart: heartData,
      });

      setLoading(false);
    } catch (error) {
      console.error("ダッシュボードデータの読み込みエラー:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>ダッシュボードを読み込み中...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>ダッシュボードデータの読み込みに失敗しました。</p>
        <Button onClick={loadDashboardData} className="mt-4">
          再試行
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">TOEIC統合ダッシュボード</h1>
        <p className="text-gray-600">
          全システムの進捗とシナジー効果を一覧表示
        </p>
      </div>

      {/* 総合統計カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              総合シナジー倍率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardData.synergy.combinedMultiplier.toFixed(1)}x
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.synergy.explosionLevel.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              完了実績
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.achievements.crossFunctional.allModeMaster
                .isCompleted
                ? "5/5"
                : "4/5"}
            </div>
            <p className="text-xs text-muted-foreground">全モードマスター</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              アドレナリンレベル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              Lv.{Math.floor(dashboardData.adrenaline.adrenalineLevel)}
            </div>
            <p className="text-xs text-muted-foreground">
              コンボ倍率: {dashboardData.adrenaline.comboMultiplier.toFixed(1)}x
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              所持カード
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData.gacha.ownedCards.length}
            </div>
            <p className="text-xs text-muted-foreground">
              アクティブシナジー: {dashboardData.gacha.cardSynergies.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">総合概要</TabsTrigger>
          <TabsTrigger value="systems">システム別</TabsTrigger>
          <TabsTrigger value="synergy">シナジー効果</TabsTrigger>
          <TabsTrigger value="recommendations">推奨事項</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 学習進捗サマリー */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  学習進捗サマリー
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">事前学習</span>
                    <Badge variant="secondary">
                      {dashboardData.preStudy.completedTopics.length}件完了
                    </Badge>
                  </div>
                  <Progress
                    value={
                      (dashboardData.preStudy.completedTopics.length / 20) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">スキルツリー</span>
                    <Badge variant="secondary">
                      {dashboardData.skillTree.unlockedSkills.length}スキル解放
                    </Badge>
                  </div>
                  <Progress
                    value={dashboardData.skillTree.skillTreeLevel * 20}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      ガチャコレクション
                    </span>
                    <Badge variant="secondary">
                      {dashboardData.gacha.ownedCards.length}カード所持
                    </Badge>
                  </div>
                  <Progress
                    value={(dashboardData.gacha.ownedCards.length / 100) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* アクティブ効果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  アクティブ効果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.preStudy.availableBoosts.synergyMultiplier >
                  1.0 && (
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">
                      事前学習ブースト
                    </span>
                    <Badge variant="default" className="bg-green-500">
                      {dashboardData.preStudy.availableBoosts.synergyMultiplier.toFixed(
                        1
                      )}
                      x
                    </Badge>
                  </div>
                )}

                {dashboardData.adrenaline.adrenalineLevel > 0 && (
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm font-medium">
                      アドレナリン効果
                    </span>
                    <Badge variant="default" className="bg-orange-500">
                      Lv.{Math.floor(dashboardData.adrenaline.adrenalineLevel)}
                    </Badge>
                  </div>
                )}

                {dashboardData.gacha.cardSynergies.length > 0 && (
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm font-medium">カードシナジー</span>
                    <Badge variant="default" className="bg-purple-500">
                      {dashboardData.gacha.cardSynergies.length}個
                    </Badge>
                  </div>
                )}

                {dashboardData.heart.specialModes.some(
                  (mode: any) => mode.isActive
                ) && (
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">特別モード</span>
                    <Badge variant="default" className="bg-red-500">
                      アクティブ
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* 事前学習システム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  事前学習システム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  {dashboardData.preStudy.completedTopics.length}/20
                </div>
                <div className="text-xs text-muted-foreground">
                  完了トピック数
                </div>
                <div className="text-sm">
                  シナジー倍率:{" "}
                  <span className="font-bold text-green-600">
                    {dashboardData.preStudy.availableBoosts.synergyMultiplier.toFixed(
                      1
                    )}
                    x
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* スキルツリーシステム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  スキルツリーシステム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  Lv.{dashboardData.skillTree.skillTreeLevel}
                </div>
                <div className="text-xs text-muted-foreground">
                  スキルツリーレベル
                </div>
                <div className="text-sm">
                  解放スキル:{" "}
                  <span className="font-bold">
                    {dashboardData.skillTree.unlockedSkills.length}個
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* アドレナリンシステム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  アドレナリンシステム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  Lv.{Math.floor(dashboardData.adrenaline.adrenalineLevel)}
                </div>
                <div className="text-xs text-muted-foreground">
                  アドレナリンレベル
                </div>
                <div className="text-sm">
                  コンボ倍率:{" "}
                  <span className="font-bold text-orange-600">
                    {dashboardData.adrenaline.comboMultiplier.toFixed(1)}x
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ガチャシステム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  ガチャシステム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  {dashboardData.gacha.ownedCards.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  所持カード数
                </div>
                <div className="text-sm">
                  アクティブシナジー:{" "}
                  <span className="font-bold text-purple-600">
                    {dashboardData.gacha.cardSynergies.length}個
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ハートシステム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  ハートシステム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  {
                    dashboardData.heart.specialModes.filter(
                      (mode: any) => mode.isActive
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  アクティブモード
                </div>
                <div className="text-sm">
                  ハート倍率:{" "}
                  <span className="font-bold text-red-600">
                    {dashboardData.heart.heartMultiplier.toFixed(1)}x
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 実績システム */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  実績システム
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-bold">
                  {dashboardData.achievements.crossFunctional.allModeMaster
                    .isCompleted
                    ? "完璧"
                    : "進行中"}
                </div>
                <div className="text-xs text-muted-foreground">
                  全モードマスター
                </div>
                <div className="text-sm">
                  シナジーマスター:{" "}
                  <span className="font-bold text-yellow-600">
                    {dashboardData.achievements.crossFunctional.synergyMaster
                      .isCompleted
                      ? "達成"
                      : "未達成"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="synergy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                シナジー効果詳細
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">爆発レベル</h4>
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                    <div className="text-xl font-bold text-orange-800">
                      {dashboardData.synergy.explosionLevel.name}
                    </div>
                    <div className="text-sm text-orange-600">
                      倍率: {dashboardData.synergy.explosionLevel.multiplier}x
                    </div>
                    <div className="text-xs text-orange-500 mt-1">
                      {dashboardData.synergy.explosionLevel.description}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">特別解放</h4>
                  <div className="space-y-2">
                    {dashboardData.synergy.specialUnlocks.map(
                      (unlock: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            {unlock.name}
                          </span>
                          <Badge variant="default" className="bg-blue-500">
                            アクティブ
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">シナジー内訳</h4>
                <div className="space-y-2">
                  {dashboardData.synergy.combinedMultiplier > 1.0 && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">総合シナジー倍率</span>
                      <span className="font-bold text-green-600">
                        {dashboardData.synergy.combinedMultiplier.toFixed(1)}x
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">事前学習効果</span>
                    <span className="font-bold">
                      {dashboardData.preStudy.availableBoosts.synergyMultiplier.toFixed(
                        1
                      )}
                      x
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">スキルツリー効果</span>
                    <span className="font-bold">
                      {dashboardData.skillTree.skillTreeLevel > 0
                        ? "1.2x"
                        : "1.0x"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* 次のステップ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  次のステップ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.preStudy.nextRecommendedTopics.map(
                  (topic: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded"
                    >
                      <span className="text-sm font-medium">{topic}</span>
                      <Badge variant="outline">推奨</Badge>
                    </div>
                  )
                )}
                {dashboardData.skillTree.nextRecommendedSkills.map(
                  (skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 rounded"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      <Badge variant="outline">推奨</Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* 最適化提案 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  最適化提案
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="text-sm font-medium text-yellow-800">
                    シナジー効果を最大化
                  </div>
                  <div className="text-xs text-yellow-600">
                    複数システムの組み合わせで倍率向上
                  </div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="text-sm font-medium text-green-800">
                    弱点補強を優先
                  </div>
                  <div className="text-xs text-green-600">
                    インテリジェント推薦で効率的学習
                  </div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="text-sm font-medium text-purple-800">
                    カードシナジー活用
                  </div>
                  <div className="text-xs text-purple-600">
                    ガチャカードの組み合わせで効果向上
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TOEICIntegratedDashboard;
