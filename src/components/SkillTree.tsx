import { ArrowLeft, Clock, Lock, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GRAMMAR_SKILL_TREE,
  SkillNode,
  skillTreeManager,
  SkillTreeState,
} from "../utils/skillTreeManager";
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
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  useEffect(() => {
    loadSkillTreeState();
  }, []);

  const loadSkillTreeState = () => {
    const state = skillTreeManager.getSkillTreeState();
    setSkillTreeState(state);
  };

  const handleNodeClick = (node: SkillNode) => {
    if (!skillTreeState) return;

    if (skillTreeState.unlockedNodes.includes(node.id)) {
      setSelectedNode(node);
    }
  };

  const handleStartLearning = (node: SkillNode) => {
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

  if (!skillTreeState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  const completionPercentage = skillTreeManager.getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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

        {/* スキルカード表示 */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>学習進捗マップ</CardTitle>
              <CardDescription>
                学習したいスキルを選択してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GRAMMAR_SKILL_TREE.map((node) => {
                  const status = getNodeStatus(node);
                  const progress = skillTreeState.progress[node.id];
                  const isAvailable = skillTreeState.availableNodes.includes(node.id);

                  return (
                    <Card
                      key={node.id}
                      className={`cursor-pointer transition-all duration-200 ${getStatusColor(status)} ${
                        status === "locked" ? "cursor-not-allowed" : "hover:scale-105"
                      }`}
                      onClick={() => handleNodeClick(node)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{node.icon}</span>
                            <CardTitle className="text-lg">{node.name}</CardTitle>
                            {status === "locked" && <span className="text-gray-400">🔒</span>}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              Level {node.level}
                            </Badge>
                            {getStatusIcon(status)}
                          </div>
                        </div>
                        <CardDescription className={status === "locked" ? "text-gray-400" : ""}>
                          {node.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {progress && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>習熟度</span>
                              <span>{progress.masteryLevel}%</span>
                            </div>
                            <Progress value={progress.masteryLevel} />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {node.estimatedTime}分
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-yellow-600" />
                            {node.rewards.xp} XP
                          </div>
                        </div>

                        {isAvailable && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartLearning(node);
                            }}
                            className="w-full"
                            size="sm"
                          >
                            学習を開始
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 推奨次学習とレベル別進捗 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 推奨次学習 */}
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
                      onClick={() => setSelectedNode(node)}
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

          {/* レベル別進捗 */}
          <Card>
            <CardHeader>
              <CardTitle>レベル別進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 10 }, (_, level) => {
                  const nodesAtLevel = GRAMMAR_SKILL_TREE.filter(
                    (node) => node.level === level
                  );
                  const completedAtLevel = nodesAtLevel.filter((node) =>
                    skillTreeState.completedNodes.includes(node.id)
                  ).length;

                  return (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Level {level}</span>
                        <span className="text-xs text-gray-600">
                          {completedAtLevel}/{nodesAtLevel.length}
                        </span>
                      </div>
                      <div className="flex-1 mx-3">
                        <Progress
                          value={
                            nodesAtLevel.length > 0
                              ? (completedAtLevel / nodesAtLevel.length) * 100
                              : 0
                          }
                          className="h-2"
                        />
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
  );
}