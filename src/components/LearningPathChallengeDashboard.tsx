import {
  ArrowLeft,
  Award,
  CheckCircle,
  Clock,
  PlayCircle,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  LearningPathChallenge,
  LearningStep,
} from "../types/learningPathChallenge";
import { LearningPathChallengeManager } from "../utils/learningPathChallengeManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const LearningPathChallengeDashboard: React.FC = () => {
  const [challenges, setChallenges] = useState<LearningPathChallenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] =
    useState<LearningPathChallenge | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = () => {
    try {
      const userChallenges =
        LearningPathChallengeManager.getUserChallengeProgress();
      const userStatistics =
        LearningPathChallengeManager.getChallengeStatistics("default");
      setChallenges(userChallenges);
      setStatistics(userStatistics);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load challenges:", error);
      setLoading(false);
    }
  };

  const handleStartChallenge = (challengeId: string) => {
    const success = LearningPathChallengeManager.startChallenge(
      "default",
      challengeId
    );
    if (success) {
      loadChallenges();
      // チャレンジ開始の通知
      console.log(`チャレンジ ${challengeId} を開始しました`);
    } else {
      console.log(`チャレンジ ${challengeId} の開始に失敗しました`);
    }
  };

  // const handleCompleteChallenge = (challengeId: string, score: number) => {
  //   const completion = LearningPathChallengeManager.completeChallenge("default", challengeId, score);
  //   if (completion) {
  //     loadChallenges();
  //     // チャレンジ完了の通知
  //     console.log(`チャレンジ ${challengeId} を完了しました`, completion);
  //   }
  // };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      case "master":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case "progressive":
        return "📈";
      case "synergy":
        return "🔄";
      case "mastery":
        return "🎯";
      case "adaptive":
        return "🧠";
      case "speed":
        return "⚡";
      default:
        return "📚";
    }
  };

  const renderChallengeCard = (challenge: LearningPathChallenge) => (
    <Card key={challenge.challengeId} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {getChallengeTypeIcon(challenge.challengeType)}
            </span>
            <div>
              <CardTitle className="text-lg">
                {challenge.challengeName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {challenge.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            {challenge.isCompleted && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {challenge.isActive && (
              <PlayCircle className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">進捗</span>
              <span className="text-sm text-muted-foreground">
                {challenge.progress.overallProgress.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={challenge.progress.overallProgress}
              className="h-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.learningPath.length} ステップ</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {challenge.learningPath.reduce(
                  (sum, step) => sum + step.estimatedTime,
                  0
                )}
                分
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.rewards.xp} XP</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>{challenge.rewards.coins} コイン</span>
            </div>
          </div>

          <div className="flex space-x-2">
            {!challenge.isCompleted && !challenge.isActive && (
              <Button
                onClick={() => handleStartChallenge(challenge.challengeId)}
                className="flex-1"
                size="sm"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                開始
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setSelectedChallenge(challenge)}
              className="flex-1"
              size="sm"
            >
              詳細
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepProgress = (step: LearningStep) => (
    <div
      key={step.stepId}
      className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
    >
      <div className="flex-shrink-0">
        {step.isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{step.stepName}</h4>
          <Badge variant="outline" className="text-xs">
            {step.stepType}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          <span>目標: {step.targetValue}</span>
          <span>現在: {step.currentValue}</span>
          <span>時間: {step.estimatedTime}分</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>チャレンジを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">学習パスチャレンジ</h1>
      </div>

      {/* 統計情報 */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">完了</p>
                  <p className="text-2xl font-bold">
                    {statistics.completedChallenges}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">進行中</p>
                  <p className="text-2xl font-bold">
                    {statistics.activeChallenges}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">完了率</p>
                  <p className="text-2xl font-bold">
                    {statistics.completionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">獲得XP</p>
                  <p className="text-2xl font-bold">{statistics.totalXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="active">進行中</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
          <TabsTrigger value="available">利用可能</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">{challenges.map(renderChallengeCard)}</div>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="space-y-4">
            {challenges.filter((c) => c.isActive).map(renderChallengeCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">
            {challenges.filter((c) => c.isCompleted).map(renderChallengeCard)}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="space-y-4">
            {challenges
              .filter((c) => !c.isCompleted && !c.isActive)
              .map(renderChallengeCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* チャレンジ詳細モーダル */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {selectedChallenge.challengeName}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedChallenge(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">説明</h3>
                  <p className="text-muted-foreground">
                    {selectedChallenge.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">学習パス</h3>
                  <div className="space-y-2">
                    {selectedChallenge.learningPath.map(renderStepProgress)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">報酬</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>{selectedChallenge.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedChallenge.rewards.coins} コイン</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-red-500" />
                      <span>{selectedChallenge.rewards.hearts} ハート</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="h-4 w-4 text-purple-500" />
                      <span>{selectedChallenge.rewards.title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  {!selectedChallenge.isCompleted &&
                    !selectedChallenge.isActive && (
                      <Button
                        onClick={() => {
                          handleStartChallenge(selectedChallenge.challengeId);
                          setSelectedChallenge(null);
                        }}
                        className="flex-1"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        チャレンジ開始
                      </Button>
                    )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1"
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathChallengeDashboard;
