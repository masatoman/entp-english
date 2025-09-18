import {
  BarChart3,
  Brain,
  Clock,
  Flame,
  Heart,
  Settings,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../data/achievements";
import { getPreStudyContentsForLevel } from "../data/preStudyContents";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import {
  PreStudyContent,
  PreStudyProgress,
  PreStudySession,
  StarData,
} from "../types/starSystem";
import { DataManager } from "../utils/dataManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import {
  calculateRecoveredStars,
  canUseStars,
  consumeStar,
  initializeStarSystem,
} from "../utils/starUtils";
// EnhancedGrammarQuizはRouter経由で使用するため、直接importを削除
import { GrammarQuizCategorySelection } from "./GrammarQuizCategorySelection";
import { GrammarQuizDifficultySelection } from "./GrammarQuizDifficultySelection";
// GrowthDashboardはRouter経由で使用するため、直接importを削除
import { DailyChallengeCard } from "./DailyChallengeCard";
import { LearningFeedbackForm } from "./LearningFeedbackForm";
import { LevelDisplay } from "./LevelDisplay";
import { StatusAllocationComponent } from "./StatusAllocation";
// PreStudyContentViewerはRouter経由で使用するため、直接importを削除
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";

// NewHomeProps は不要（React Router使用）

export function NewHome() {
  const navigate = useNavigate();
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
  const [showGrowthDashboard, setShowGrowthDashboard] = useState(false);

  // ⭐️スターシステムの状態
  const [starSystem, setStarSystem] = useState<StarData>(() => {
    const stats = DataManager.getUserStats();
    if (stats.stars) {
      return {
        current: calculateRecoveredStars(stats.stars),
        max: stats.stars.max,
        lastRecoveryTime: stats.stars.lastRecoveryTime,
      };
    }
    return initializeStarSystem(userLevel.level);
  });

  const [preStudyProgress, setPreStudyProgress] = useState<PreStudyProgress>(
    () => {
      const stats = DataManager.getUserStats();
      return (
        stats.preStudyProgress || {
          totalContentsStudied: 0,
          contentsByCategory: {},
          averageComprehension: 0,
          totalTimeSpent: 0,
          completedContents: [],
        }
      );
    }
  );

  const [preStudySessions, setPreStudySessions] = useState<PreStudySession[]>(
    () => {
      const stats = DataManager.getUserStats();
      return stats.preStudySessions || [];
    }
  );

  // 事前学習の状態
  const [showPreStudyContent, setShowPreStudyContent] = useState(false);
  const [currentPreStudyContent, setCurrentPreStudyContent] =
    useState<PreStudyContent | null>(null);

  useEffect(() => {
    const refreshData = () => {
      const stats = DataManager.getUserStats();
      setUserStats(stats);
      refreshLevel();

      // スターシステムの更新
      if (stats.stars) {
        setStarSystem({
          current: calculateRecoveredStars(stats.stars),
          max: stats.stars.max,
          lastRecoveryTime: stats.stars.lastRecoveryTime,
        });
      }

      if (stats.preStudyProgress) {
        setPreStudyProgress(stats.preStudyProgress);
      }

      if (stats.preStudySessions) {
        setPreStudySessions(stats.preStudySessions);
      }
    };

    refreshData();

    // ハートとスターの回復を定期的に処理
    const interval = setInterval(() => {
      processRecovery();

      // スターの回復処理
      const currentStats = DataManager.getUserStats();
      if (currentStats.stars) {
        const recoveredStars = calculateRecoveredStars(currentStats.stars);
        if (recoveredStars > currentStats.stars.current) {
          const updatedStats = {
            ...currentStats,
            stars: {
              ...currentStats.stars,
              current: recoveredStars,
              lastRecoveryTime: Date.now(),
            },
          };
          DataManager.saveUserStats(updatedStats);
          setStarSystem(updatedStats.stars);
        }
      }
    }, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, []); // 初回のみ実行

  const handleStartLearning = (type: string) => {
    // 学習を開始（ハート消費は各学習コンポーネントで行う）
    switch (type) {
      case "grammar":
        navigate("/learning/grammar/category");
        break;
      case "vocabulary":
        navigate("/learning/vocabulary/difficulty");
        break;
      case "writing":
        navigate("/learning/grammar/category"); // 英作文も文法カテゴリから
        break;
      case "combined":
        navigate("/learning/combined-test");
        break;
      case "timeattack":
        navigate("/learning/time-attack");
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

  // ⭐️スターシステムのハンドラー
  const handlePreStudyMenuOpen = () => {
    navigate("/learning/pre-study/menu");
  };

  const handlePreStudyContentSelect = (contentId: string) => {
    if (!canUseStars(starSystem)) {
      alert("スターが不足しています。回復をお待ちください。");
      return;
    }

    const content = getPreStudyContentsForLevel(userLevel.level).find(
      (c) => c.id === contentId
    );
    if (content) {
      // スターを消費
      const newStarSystem = consumeStar(starSystem);
      setStarSystem(newStarSystem);

      // データを保存
      const updatedStats = {
        ...userStats,
        stars: newStarSystem,
      };
      DataManager.saveUserStats(updatedStats);

      // コンテンツを表示
      setCurrentPreStudyContent(content);
      setShowPreStudyContent(true);
    }
  };

  const handlePreStudyContentComplete = (
    contentId: string,
    comprehensionRating: number
  ) => {
    const session: PreStudySession = {
      contentId,
      startTime: Date.now() - 180000, // 3分前と仮定
      endTime: Date.now(),
      completed: true,
      comprehensionRating,
    };

    const newProgress: PreStudyProgress = {
      ...preStudyProgress,
      totalContentsStudied: preStudyProgress.totalContentsStudied + 1,
      completedContents: [...preStudyProgress.completedContents, contentId],
      averageComprehension:
        (preStudyProgress.averageComprehension *
          preStudyProgress.totalContentsStudied +
          comprehensionRating) /
        (preStudyProgress.totalContentsStudied + 1),
      totalTimeSpent: preStudyProgress.totalTimeSpent + 3, // 3分と仮定
      lastStudiedContentId: contentId,
    };

    const newSessions = [...preStudySessions, session];

    setPreStudyProgress(newProgress);
    setPreStudySessions(newSessions);

    // データを保存
    const updatedStats = {
      ...userStats,
      preStudyProgress: newProgress,
      preStudySessions: newSessions,
    };
    DataManager.saveUserStats(updatedStats);

    // 画面を閉じる
    setShowPreStudyContent(false);
    setCurrentPreStudyContent(null);
    setShowPreStudyMenu(false);
  };

  const handlePreStudyContentBack = () => {
    setShowPreStudyContent(false);
    setCurrentPreStudyContent(null);
  };

  const handleNavigateToPractice = (category: string) => {
    // 事前学習完了後、カテゴリに基づいて適切な問題演習に遷移
    switch (category) {
      case "grammar":
        setShowGrammarQuizCategory(true);
        break;
      case "vocabulary":
        onNavigateToVocabulary();
        break;
      case "listening":
        // リスニング問題演習（現在は語彙学習にリダイレクト）
        onNavigateToVocabulary();
        break;
      case "reading":
        // リーディング問題演習（現在は語彙学習にリダイレクト）
        onNavigateToVocabulary();
        break;
      case "writing":
        // ライティング問題演習（現在は語彙学習にリダイレクト）
        onNavigateToVocabulary();
        break;
      default:
        // デフォルトは文法クイズ
        setShowGrammarQuizCategory(true);
        break;
    }
  };

  const handleShowGrowthDashboard = () => {
    navigate("/progress/dashboard");
  };

  const handleHideGrowthDashboard = () => {
    setShowGrowthDashboard(false);
  };

  // ハートシステムの状態を定期的に更新
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefreshHearts();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // 依存関係を空にして、マウント時に一度だけ実行

  // 成長ダッシュボードが表示されている場合は、それらを優先表示
  if (showGrowthDashboard) {
    return (
      <GrowthDashboard
        userStats={userStats}
        onBack={handleHideGrowthDashboard}
      />
    );
  }

  // 事前学習のコンテンツ表示はRouter経由で処理
  // showPreStudyContentロジックは削除

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
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                ENTP英語学習アプリ
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                あなたの英語学習をサポートします
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedView(!showDetailedView)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {showDetailedView ? "統計を隠す" : "統計を表示"}
                </span>
                <span className="sm:hidden">統計</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/progress/insights")}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
              >
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline text-purple-700">
                  学習分析
                </span>
                <span className="sm:hidden text-purple-700">分析</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusAllocation(!showStatusAllocation)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">ステータス設定</span>
                <span className="sm:hidden">設定</span>
              </Button>
            </div>
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

          {/* 体力システム（ハート + スタミナ） */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                体力システム
              </h3>

              {/* ハート表示 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">体力</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: heartSystem.max }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < heartSystem.current
                            ? "text-red-500"
                            : "text-gray-300"
                        }`}
                      >
                        {i < heartSystem.current ? "♥" : "♡"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ({heartSystem.current}/{heartSystem.max})
                  </span>
                </div>
              </div>

              {/* スタミナ（星）表示 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">スタミナ</span>
                  <div className="flex space-x-1">
                    {Array.from({ length: starSystem.max }, (_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < starSystem.current
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        {i < starSystem.current ? "⭐️" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ({starSystem.current}/{starSystem.max})
                  </span>
                </div>
              </div>

              {/* 体力とスタミナの操作ボタン */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <p className="text-xs text-gray-500">1問題につき1体力消費</p>
                  <p className="text-xs text-gray-500">5分で1体力回復</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const manager = getLevelManager();
                      const newHeartSystem = manager.consumeHeart();
                      forceRefreshHearts();
                      saveLevelManager();
                    }}
                    className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    disabled={heartSystem.current === 0}
                  >
                    体力を消費
                  </button>
                  <button
                    onClick={() => {
                      const manager = getLevelManager();
                      const heartSystem = manager.getHeartSystem();
                      heartSystem.current = heartSystem.max;
                      forceRefreshHearts();
                      saveLevelManager();
                    }}
                    className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded"
                  >
                    ♥回復
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* デイリーチャレンジカード */}
        <div className="mb-6">
          <DailyChallengeCard />
        </div>

        {/* ステータス配分 */}
        {showStatusAllocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusAllocationComponent />
          </div>
        )}

        {/* 学習モード選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ⭐️事前学習 */}
          <SelectionCard
            id="pre-study"
            title="事前学習"
            description="理論を理解してから実践へ"
            icon="⭐️"
            difficulty="理論"
            detail="必要スター: 1 ⭐️"
            color="bg-purple-50 border-purple-200 text-purple-800"
            isLocked={!canUseStars(starSystem)}
            onClick={() => canUseStars(starSystem) && handlePreStudyMenuOpen()}
          />
          {/* 文法クイズ */}
          <SelectionCard
            id="grammar-quiz"
            title="文法クイズ"
            description="9つのカテゴリーから文法問題に挑戦"
            icon="✏️"
            difficulty="文法"
            detail="必要体力: 1 ♥"
            color="bg-blue-50 border-blue-200 text-blue-800"
            isLocked={!canStartLearning}
            onClick={() => canStartLearning && handleStartLearning("grammar")}
          />

          {/* 語彙学習 */}
          <SelectionCard
            id="vocabulary"
            title="語彙学習"
            description="レベル別・カテゴリー別の単語学習"
            icon="📚"
            difficulty="語彙"
            detail="必要体力: 1 ♥"
            color="bg-green-50 border-green-200 text-green-800"
            isLocked={!canStartLearning}
            onClick={() =>
              canStartLearning && handleStartLearning("vocabulary")
            }
          />

          {/* 総合テスト */}
          <SelectionCard
            id="combined-test"
            title="総合テスト"
            description="全分野から出題される総合テスト"
            icon="🎯"
            difficulty="総合"
            detail="必要体力: 1 ♥"
            color="bg-purple-50 border-purple-200 text-purple-800"
            isLocked={!canStartLearning}
            onClick={() => canStartLearning && handleStartLearning("combined")}
          />

          {/* タイムアタック */}
          <SelectionCard
            id="time-attack"
            title="タイムアタック"
            description="制限時間内で問題を解くスピード重視モード"
            icon="⏰"
            difficulty="スピード"
            detail="必要体力: 1 ♥"
            color="bg-orange-50 border-orange-200 text-orange-800"
            isLocked={!canStartLearning}
            onClick={() =>
              canStartLearning && handleStartLearning("timeattack")
            }
          />

          {/* 英作文 */}
          <SelectionCard
            id="essay"
            title="英作文"
            description="文法・語彙を実践で活用する英作文課題"
            icon="✍️"
            difficulty="ライティング"
            detail="必要体力: 1 ♥"
            color="bg-indigo-50 border-indigo-200 text-indigo-800"
            isLocked={!canStartLearning}
            onClick={() => {
              if (canStartLearning) {
                const levelManager = getLevelManager();
                if (levelManager.consumeHeart()) {
                  navigate("/learning/essay-writing");
                } else {
                  alert("体力が不足しています。");
                }
              }
            }}
          />

          {/* タワーディフェンス - 一時非活性 */}
          <SelectionCard
            id="tower-defense"
            title="タワーディフェンス"
            description="🚧 機能改善中です（近日公開予定）"
            icon="🎮"
            difficulty="準備中"
            detail="機能改善中"
            color="bg-gray-50 border-gray-200 text-gray-500"
            isLocked={true}
            onClick={() => {}}
          />

          {/* TOEIC単語ガチャ */}
          <SelectionCard
            id="gacha"
            title="TOEIC単語ガチャ"
            description="新しい単語をゲット！レアカードを集めよう"
            icon="🎁"
            difficulty="ガチャ"
            detail="XP消費"
            color="bg-purple-50 border-purple-200 text-purple-800"
            onClick={() => navigate("/games/gacha")}
          />

          {/* 実績 */}
          <SelectionCard
            id="achievements"
            title="実績"
            description="学習の進捗とアチーブメントを確認"
            icon="🏆"
            difficulty="進捗"
            detail="体力不要"
            color="bg-yellow-50 border-yellow-200 text-yellow-800"
            onClick={() => navigate("/progress/achievements")}
          />

          {/* 成長ダッシュボード */}
          <SelectionCard
            id="growth-dashboard"
            title="成長ダッシュボード"
            description="あなたの学習成長を可視化"
            icon="📈"
            difficulty="分析"
            detail="体力不要"
            color="bg-green-50 border-green-200 text-green-800"
            onClick={() => handleShowGrowthDashboard()}
          />
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
