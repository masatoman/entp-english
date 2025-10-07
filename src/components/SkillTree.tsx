import { ArrowLeft, Lock, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseColors } from "../styles/colors";
import { dailyQuestManager } from "../utils/dailyQuestManager";
// import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import {
  GRAMMAR_SKILL_TREE,
  SkillNode,
  skillTreeManager,
  SkillTreeState,
} from "../utils/skillTreeManager";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function SkillTree() {
  const navigate = useNavigate();
  const [skillTreeState, setSkillTreeState] = useState<SkillTreeState | null>(
    null
  );

  useEffect(() => {
    loadSkillTreeState();
    // スキルツリー訪問をデイリークエストに記録
    dailyQuestManager.recordSkillTreeVisit();
  }, []);

  const loadSkillTreeState = () => {
    const state = skillTreeManager.getSkillTreeState();
    setSkillTreeState(state);
  };

  const handleNodeClick = (node: SkillNode) => {
    if (!skillTreeState) return;

    if (skillTreeState.unlockedNodes.includes(node.id)) {
      // 直接学習を開始（詳細パネル表示ではなく）
      handleStartLearning(node);
    }
  };

  const handleStartLearning = (node: SkillNode) => {
    // 一時的に体力消費を無効化してテスト
    console.log("スキルツリーから学習開始:", node);

    // ノードに応じて適切な学習ページに遷移
    const foundationCategories = [
      "parts-of-speech",
      "word-order",
      "pronouns",
      "articles",
      "plurals",
      "questions-negations",
      "prepositions",
      "conjunctions",
    ];

    if (foundationCategories.includes(node.category)) {
      // 基礎カテゴリーの場合
      navigate(`/learning/foundation/difficulty/${node.category}`);
    } else if (node.category === "basic-grammar" && node.subcategory) {
      // 基本文型の場合
      navigate(`/learning/grammar/pattern/basic-grammar`);
    } else if (node.category === "vocabulary-mastery") {
      // 語彙力強化の場合
      navigate("/learning/vocabulary/difficulty");
    } else if (node.category === "pronunciation") {
      // 発音・音韻の場合（将来実装）
      alert("発音学習機能は近日実装予定です");
    } else {
      // その他の文法カテゴリー
      navigate(`/learning/grammar/difficulty/${node.category}`);
    }
  };

  const getNodeStatus = (
    node: SkillNode
  ): "locked" | "available" | "in-progress" | "completed" => {
    if (!skillTreeState) return "locked";

    const progress = skillTreeState.progress[node.id];

    if (!skillTreeState.unlockedNodes.includes(node.id)) return "locked";
    if (!progress) return "available";
    if (progress.masteryLevel >= 90) return "completed";
    return "in-progress";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "locked":
        return "bg-gray-100 border-gray-300 text-gray-400";
      case "available":
        return "bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100";
      case "in-progress":
        return "bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100";
      case "completed":
        return "bg-green-50 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock className="w-3 h-3" />;
      case "available":
        return <Star className="w-3 h-3" />;
      case "in-progress":
        return <Zap className="w-3 h-3" />;
      case "completed":
        return <Trophy className="w-3 h-3" />;
      default:
        return <Lock className="w-3 h-3" />;
    }
  };

  const renderConnectionLine = (fromNode: SkillNode, toNodeId: string) => {
    const toNode = GRAMMAR_SKILL_TREE.find((n) => n.id === toNodeId);
    if (!toNode) return null;

    const _dx = toNode.position.x - fromNode.position.x;
    const _dy = toNode.position.y - fromNode.position.y;

    return (
      <line
        key={`${fromNode.id}-${toNodeId}`}
        x1={fromNode.position.x + 60}
        y1={fromNode.position.y + 30}
        x2={toNode.position.x + 60}
        y2={toNode.position.y + 30}
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray={getNodeStatus(toNode) === "locked" ? "5,5" : "none"}
        opacity={getNodeStatus(toNode) === "locked" ? 0.5 : 0.8}
      />
    );
  };

  if (!skillTreeState) {
    return (
      <div
        className="min-h-screen p-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  const completionPercentage = skillTreeManager.getCompletionPercentage();

  return (
    <div
      className="min-h-screenp-4"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              文法スキルツリー
            </h1>
            <p className="text-gray-600 mt-2">あなたの英語学習の進捗を可視化</p>
          </div>
          <div className="w-32" />
        </div>

        {/* 進捗サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完成度</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">現在レベル</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Level {skillTreeState.currentLevel}
              </div>
              <p className="text-xs text-muted-foreground">
                {skillTreeState.completedNodes.length}/
                {GRAMMAR_SKILL_TREE.length} 完了
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">獲得XP</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skillTreeState.totalXP}</div>
              <p className="text-xs text-muted-foreground">累計経験値</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">利用可能</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {skillTreeState.availableNodes.length}
              </div>
              <p className="text-xs text-muted-foreground">学習可能なスキル</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* スキルツリー表示 */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>学習進捗マップ</CardTitle>
                <CardDescription>
                  クリックして詳細を確認、学習を開始できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-auto max-h-[600px] lg:max-h-none">
                  {/* SVG for connections */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ height: "1500px", minWidth: "500px" }}
                  >
                    {GRAMMAR_SKILL_TREE.map((node) =>
                      node.unlocks.map((unlockId) =>
                        renderConnectionLine(node, unlockId)
                      )
                    ).flat()}
                  </svg>

                  {/* Skill Nodes */}
                  <div
                    className="relative"
                    style={{ height: "1500px", minWidth: "500px" }}
                  >
                    {GRAMMAR_SKILL_TREE.map((node) => {
                      const status = getNodeStatus(node);
                      const progress = skillTreeState.progress[node.id];

                      return (
                        <TooltipProvider key={node.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`absolute w-28 h-16 sm:w-32 sm:h-20 rounded-lg border-2 p-1 sm:p-2 cursor-pointer transition-all duration-200 ${getStatusColor(
                                  status
                                )} ${
                                  status === "locked"
                                    ? "cursor-not-allowed"
                                    : "hover:scale-105"
                                }`}
                                style={{
                                  left: node.position.x,
                                  top: node.position.y,
                                }}
                                onClick={() => handleNodeClick(node)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-lg">{node.icon}</span>
                                  {getStatusIcon(status)}
                                </div>
                                <div className="text-xs sm:text-sm font-semibold truncate">
                                  {node.name}
                                </div>
                                {progress && (
                                  <div className="mt-1">
                                    <div className="text-xs text-gray-600">
                                      {progress.masteryLevel}%
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                      <div
                                        className="bg-blue-600 h-1 rounded-full"
                                        style={{
                                          width: `${progress.masteryLevel}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="p-2">
                                <div className="font-semibold">{node.name}</div>
                                <div className="text-sm text-gray-600">
                                  {node.description}
                                </div>
                                <div className="text-xs mt-1">
                                  Level {node.level} • {node.estimatedTime}分
                                </div>
                                {status === "locked" && (
                                  <div className="text-xs text-red-600 mt-1">
                                    前提条件: {node.prerequisites.join(", ")}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 推奨次学習 */}
          <div className="w-full lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle>推奨次学習</CardTitle>
                <CardDescription>効率的な学習順序に基づく推奨</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skillTreeManager.getRecommendedNextNodes().map((node) => {
                    const status = getNodeStatus(node);
                    return (
                      <div
                        key={node.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${getStatusColor(
                          status
                        )}`}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{node.icon}</span>
                            <div>
                              <div className="font-medium text-sm">
                                {node.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                Level {node.level}
                              </div>
                            </div>
                          </div>
                          {getStatusIcon(status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
