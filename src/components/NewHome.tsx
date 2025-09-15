import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  Flame,
  Gamepad2,
  Heart,
  PenTool,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserStats } from "../data/achievements";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import { DataManager } from "../utils/dataManager";
import { EnhancedGrammarQuiz } from "./EnhancedGrammarQuiz";
import { GrammarQuizCategorySelection } from "./GrammarQuizCategorySelection";
import { GrammarQuizDifficultySelection } from "./GrammarQuizDifficultySelection";
import { HeartSystemDisplay } from "./HeartSystem";
import { LearningFeedbackForm } from "./LearningFeedbackForm";
import { LevelDisplay } from "./LevelDisplay";
import { StatusAllocationComponent } from "./StatusAllocation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface NewHomeProps {
  onNavigateToGrammar: () => void;
  onNavigateToVocabulary: () => void;
  onNavigateToGrammarQuiz: () => void;
  onNavigateToEssay: () => void;
  onNavigateToCombinedTest: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToAppSettings: () => void;
  onNavigateToTimeAttack: () => void;
  onNavigateToSimpleTowerDefense: () => void;
}

export function NewHome({
  onNavigateToVocabulary,
  onNavigateToEssay,
  onNavigateToCombinedTest,
  onNavigateToAchievements,
  onNavigateToTimeAttack,
  onNavigateToSimpleTowerDefense,
}: NewHomeProps) {
  const { userLevel, refreshLevel } = useLevelSystem();
  const { heartSystem, processRecovery, refreshHearts } = useHeartSystem();

  // ハートシステムの状態を強制的に更新
  const forceRefreshHearts = () => {
    refreshHearts();
  };
  const [userStats, setUserStats] = useState<UserStats>(
    DataManager.getUserStats()
  );
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showStatusAllocation, setShowStatusAllocation] = useState(false);
  const [showGrammarQuizCategory, setShowGrammarQuizCategory] = useState(false);
  const [showGrammarQuizDifficulty, setShowGrammarQuizDifficulty] =
    useState(false);
  const [showGrammarQuiz, setShowGrammarQuiz] = useState(false);
  const [selectedGrammarCategory, setSelectedGrammarCategory] =
    useState<string>("");
  const [selectedGrammarDifficulty, setSelectedGrammarDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      const stats = DataManager.getUserStats();
      setUserStats(stats);
      refreshLevel();
    };

    refreshData();

    // ハートの回復を定期的に処理
    const interval = setInterval(() => {
      processRecovery();
    }, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, []); // 初回のみ実行

  const handleStartLearning = (type: string) => {
    // 学習を開始（ハート消費は各学習コンポーネントで行う）
    switch (type) {
      case "grammar":
        setShowGrammarQuizCategory(true);
        break;
      case "vocabulary":
        onNavigateToVocabulary();
        break;
      case "writing":
        onNavigateToEssay();
        break;
      case "combined":
        onNavigateToCombinedTest();
        break;
      case "timeattack":
        onNavigateToTimeAttack();
        break;
      default:
        break;
    }
  };

  const handleGrammarCategorySelect = (category: string) => {
    setSelectedGrammarCategory(category);
    setShowGrammarQuizCategory(false);
    setShowGrammarQuizDifficulty(true);
  };

  const handleGrammarDifficultySelect = (
    difficulty: "beginner" | "intermediate" | "advanced"
  ) => {
    setSelectedGrammarDifficulty(difficulty);
    setShowGrammarQuizDifficulty(false);
    setShowGrammarQuiz(true);
  };

  const handleGrammarQuizBack = () => {
    setShowGrammarQuiz(false);
    setShowGrammarQuizDifficulty(false);
    setShowGrammarQuizCategory(false);
  };

  const handleGrammarDifficultyBack = () => {
    setShowGrammarQuizDifficulty(false);
    setShowGrammarQuizCategory(true);
  };

  const handleGrammarCategoryBack = () => {
    setShowGrammarQuizCategory(false);
  };

  const canStartLearning = heartSystem.current > 0;

  // ハートシステムの状態を定期的に更新
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefreshHearts();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // 依存関係を空にして、マウント時に一度だけ実行

  // 文法クイズのコンポーネントが表示されている場合は、それらを優先表示
  if (showGrammarQuizCategory) {
    return (
      <GrammarQuizCategorySelection
        onSelectCategory={handleGrammarCategorySelect}
        onBack={handleGrammarCategoryBack}
      />
    );
  }

  if (showGrammarQuizDifficulty) {
    return (
      <GrammarQuizDifficultySelection
        categoryName={selectedGrammarCategory}
        onSelectDifficulty={handleGrammarDifficultySelect}
        onBack={handleGrammarDifficultyBack}
      />
    );
  }

  if (showGrammarQuiz) {
    return (
      <EnhancedGrammarQuiz
        category={selectedGrammarCategory}
        difficulty={selectedGrammarDifficulty}
        onBack={handleGrammarQuizBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              ENTP英語学習アプリ
            </h1>
            <p className="text-gray-600 mt-1">
              あなたの英語学習をサポートします
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedView(!showDetailedView)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showDetailedView ? "統計を隠す" : "統計を表示"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusAllocation(!showStatusAllocation)}
            >
              <Settings className="w-4 h-4 mr-2" />
              ステータス設定
            </Button>
          </div>
        </div>

        {/* メイン情報カード */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* レベル情報 */}
          <div className="lg:col-span-2">
            <LevelDisplay
              showDetailed={showDetailedView}
              showChapterProgress={showDetailedView}
            />
          </div>

          {/* ハートシステム */}
          <div>
            <HeartSystemDisplay
              showRecoveryTime={true}
              onHeartChange={forceRefreshHearts}
            />
          </div>
        </div>

        {/* ステータス配分 */}
        {showStatusAllocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusAllocationComponent />
            <RankProgress
              currentLevel={userLevel.level}
              showProbabilities={true}
            />
          </div>
        )}

        {/* 学習モード選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 文法クイズ */}
          <Card
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !canStartLearning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => canStartLearning && handleStartLearning("grammar")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <PenTool className="w-5 h-5 mr-2 text-blue-600" />
                  文法クイズ
                </CardTitle>
                <Badge variant="secondary">文法</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                9つのカテゴリーから文法問題に挑戦
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">必要体力: 1 ♥</div>
                <div className="flex items-center text-sm font-medium">
                  {canStartLearning ? "クリックして開始" : "体力不足"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 語彙学習 */}
          <Card
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !canStartLearning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              canStartLearning && handleStartLearning("vocabulary")
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  語彙学習
                </CardTitle>
                <Badge variant="secondary">語彙</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                レベル別・カテゴリー別の単語学習
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">必要体力: 1 ♥</div>
                <div className="flex items-center text-sm font-medium">
                  {canStartLearning ? "クリックして開始" : "体力不足"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 総合テスト */}
          <Card
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !canStartLearning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => canStartLearning && handleStartLearning("combined")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  総合テスト
                </CardTitle>
                <Badge variant="secondary">総合</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                全分野から出題される総合テスト
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">必要体力: 1 ♥</div>
                <div className="flex items-center text-sm font-medium">
                  {canStartLearning ? "クリックして開始" : "体力不足"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* タイムアタック */}
          <Card
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !canStartLearning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              canStartLearning && handleStartLearning("timeattack")
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  タイムアタック
                </CardTitle>
                <Badge variant="secondary">スピード</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                制限時間内で問題を解くスピード重視モード
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">必要体力: 1 ♥</div>
                <div className="flex items-center text-sm font-medium">
                  {canStartLearning ? "クリックして開始" : "体力不足"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 英作文 */}
          <Card
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              !canStartLearning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => canStartLearning && handleStartLearning("writing")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
                  英作文
                </CardTitle>
                <Badge variant="secondary">ライティング</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                文法カテゴリー別の4択英作文問題
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">必要体力: 1 ♥</div>
                <div className="flex items-center text-sm font-medium">
                  {canStartLearning ? "クリックして開始" : "体力不足"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* タワーディフェンス */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2 text-red-600" />
                  タワーディフェンス
                </CardTitle>
                <Badge variant="secondary">ゲーム</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                英語学習要素を含むタワーディフェンスゲーム
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">体力不要</div>
                <Button
                  onClick={onNavigateToSimpleTowerDefense}
                  className="flex items-center"
                >
                  開始
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 実績 */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                  実績
                </CardTitle>
                <Badge variant="secondary">進捗</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                学習の進捗とアチーブメントを確認
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">体力不要</div>
                <Button
                  onClick={onNavigateToAchievements}
                  className="flex items-center"
                >
                  確認
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィードバックボタン */}
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowFeedbackForm(true)}
            className="flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>学習フィードバック</span>
          </Button>
        </div>

        {/* 統計情報 */}
        {showDetailedView && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">今日のXP</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {userStats.todayXP || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">総学習時間</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor((userStats.totalStudyTime || 0) / 60)}分
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">正解率</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {userStats.totalQuestionsAnswered > 0
                        ? (
                            (userStats.correctAnswers /
                              userStats.totalQuestionsAnswered) *
                            100
                          ).toFixed(1)
                        : "0.0"}
                      %
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">連続学習日数</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {userStats.currentStreak || 0}日
                    </p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 体力不足時の警告 */}
        {!canStartLearning && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">
                    体力が不足しています
                  </h3>
                  <p className="text-sm text-yellow-700">
                    体力が回復するまで待つか、他の機能を利用してください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* フィードバックフォームモーダル */}
        {showFeedbackForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <LearningFeedbackForm
                onClose={() => setShowFeedbackForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
