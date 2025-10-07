import {
  BarChart3,
  Brain,
  Clock,
  Flame,
  Heart,
  MessageSquare,
  Settings,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../data/achievements";
// import { getPreStudyContentsForLevel } from "../data/preStudyContents";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { useLevelSystem } from "../hooks/useLevelSystem";
import {
  // PreStudyContent,
  // PreStudyProgress,
  // PreStudySession,
  StarData,
} from "../types/starSystem";
// import { adrenalineManager } from "../utils/adrenalineManager";
// import { dailyQuestManager } from "../utils/dailyQuestManager";
import { DataManager } from "../utils/dataManager";
import { getLevelManager } from "../utils/levelManager";
import { calculateRecoveredStars, canUseStars } from "../utils/starUtils";
// EnhancedGrammarQuizはRouter経由で使用するため、直接importを削除
// import { GrammarQuizCategorySelection } from "./GrammarQuizCategorySelection";
// import { GrammarQuizDifficultySelection } from "./GrammarQuizDifficultySelection";
// GrowthDashboardはRouter経由で使用するため、直接importを削除
import { DailyChallengeCard } from "./DailyChallengeCard";
// import DailyQuestPanel from "./DailyQuestPanel";
import GameHeader from "./GameHeader";
// import { LearningFeedbackForm } from "./LearningFeedbackForm";
import { LoginBonusNotification } from "./LoginBonusNotification";
// import { StatusAllocationComponent } from "./StatusAllocation";
// PreStudyContentViewerはRouter経由で使用するため、直接importを削除
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";

// NewHomeProps は不要（React Router使用）

export default function Home() {
  const navigate = useNavigate();
  const { refreshLevel } = useLevelSystem();
  const { heartSystem } = useHeartSystem();

  // レベルマネージャーの初期化
  const levelManager = getLevelManager();

  // アドレナリンシステムの初期化
  // const [dailyMultiplier] = useState(1.0);
  // const [consecutiveDays] = useState(0);

  // デイリークエストシステム
  // const [showDailyQuests, setShowDailyQuests] = useState(false);
  // const [questStats, setQuestStats] = useState({
  //   completed: 0,
  //   total: 0,
  //   percentage: 0,
  //   streak: 0,
  // });
  // const [coinSystem] = useState(
  //   dailyQuestManager.getCoinSystem()
  // );

  // デイリーチャレンジシステム
  // const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  // const [challengeStats, setChallengeStats] = useState({
  //   completed: 0,
  //   total: 0,
  //   percentage: 0,
  //   streak: 0,
  // });

  // ハートシステムの状態を強制的に更新
  // const forceRefreshHearts = () => {
  //   refreshHearts();
  // };
  const [userStats, setUserStats] = useState<UserStats>(
    DataManager.getUserStats()
  );
  const [showDetailedView, setShowDetailedView] = useState(false);
  // const [showStatusAllocation, setShowStatusAllocation] = useState(false);
  // const [showGrammarQuizCategory, setShowGrammarQuizCategory] = useState(false);
  // const [showGrammarQuizDifficulty, setShowGrammarQuizDifficulty] =
  //   useState(false);
  // const [showGrammarQuiz, setShowGrammarQuiz] = useState(false);
  // const [selectedGrammarCategory, setSelectedGrammarCategory] =
  //   useState<string>("");
  // const [selectedGrammarDifficulty, setSelectedGrammarDifficulty] = useState<
  //   "beginner" | "intermediate" | "advanced"
  // >("beginner");
  // const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  // const [showGrowthDashboard, setShowGrowthDashboard] = useState(false);

  // ⭐️スターシステムの状態（LevelManagerから取得）
  const [starSystem, setStarSystem] = useState<StarData>(() => {
    return levelManager.getStarSystem();
  });

  // const [preStudyProgress, setPreStudyProgress] = useState<PreStudyProgress>(
  //   () => {
  //     const stats = DataManager.getUserStats();
  //     return (
  //       stats.preStudyProgress || {
  //         totalContentsStudied: 0,
  //         contentsByCategory: {},
  //         averageComprehension: 0,
  //         totalTimeSpent: 0,
  //         completedContents: [],
  //       }
  //     );
  //   }
  // );

  // const [preStudySessions, setPreStudySessions] = useState<PreStudySession[]>(
  //   () => {
  //     const stats = DataManager.getUserStats();
  //     return stats.preStudySessions || [];
  //   }
  // );

  // 事前学習の状態
  // const [showPreStudyContent] = useState(false);
  // const [currentPreStudyContent, setCurrentPreStudyContent] =
  //   useState<PreStudyContent | null>(null);

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

      // if (stats.preStudyProgress) {
      //   setPreStudyProgress(stats.preStudyProgress);
      // }

      // if (stats.preStudySessions) {
      //   setPreStudySessions(stats.preStudySessions);
      // }

      // デイリーボーナスシステムの更新
      // const multiplier = adrenalineManager.updateDailyBonus();
      // const system = adrenalineManager.getSystem();
      // setDailyMultiplier(multiplier);
      // setConsecutiveDays(system.dailyBonus.consecutiveDays);

      // デイリークエストシステムの更新
      // const questStatsData = dailyQuestManager.getCompletionStats();
      // setQuestStats(questStatsData);
      // setCoinSystem(dailyQuestManager.getCoinSystem());

      // デイリーチャレンジシステムの更新
      // const challengeStatsData = {
      //   completed: 0, // TODO: DailyChallengeManagerから取得
      //   total: 1,
      //   percentage: 0,
      //   streak: 0,
      // };
      // setChallengeStats(challengeStatsData);

      // console.log("🎯 デイリーボーナス更新:", {
      //   multiplier,
      //   consecutiveDays: system.dailyBonus.consecutiveDays,
      // });

      // console.log("🎯 デイリークエスト更新:", questStatsData);
      // console.log("🏆 デイリーチャレンジ更新:", challengeStatsData);
    };

    refreshData();

    // ハートとスターの回復を定期的に処理
    const interval = setInterval(() => {
      // processRecovery();

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

  // const handleStartLearning = (type: string) => {
  //   // 体力を必要とする学習の場合、事前チェック
  //   const requiresHeart = ["grammar", "vocabulary", "combined", "timeattack"];

  //   if (requiresHeart.includes(type)) {
  //     if (heartSystem.currentHearts <= 0) {
  //       alert("体力が不足しています。回復を待ってから再試行してください。");
  //       return;
  //     }
  //   }

  //   // 学習を開始
  //   switch (type) {
  //     case "grammar":
  //       navigate("/learning/grammar/category");
  //       break;
  //     case "vocabulary":
  //       navigate("/learning/vocabulary/difficulty");
  //       break;
  //     case "listening":
  //       navigate("/listening");
  //       break;
  //     case "writing":
  //       navigate("/learning/grammar/category"); // 英作文も文法カテゴリから
  //       break;
  //     case "combined":
  //       navigate("/learning/combined-test");
  //       break;
  //     case "timeattack":
  //       navigate("/learning/time-attack");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const handleGrammarCategorySelect = (category: string) => {
  //   setSelectedGrammarCategory(category);
  //   setShowGrammarQuizCategory(false);
  //   setShowGrammarQuizDifficulty(true);
  // };

  // const handleGrammarDifficultySelect = (
  //   difficulty: "beginner" | "intermediate" | "advanced"
  // ) => {
  //   setSelectedGrammarDifficulty(difficulty);
  //   setShowGrammarQuizDifficulty(false);
  //   setShowGrammarQuiz(true);
  // };

  // const handleGrammarQuizBack = () => {
  //   setShowGrammarQuiz(false);
  //   setShowGrammarQuizDifficulty(false);
  //   setShowGrammarQuizCategory(false);
  // };

  // const handleGrammarDifficultyBack = () => {
  //   setShowGrammarQuizDifficulty(false);
  //   setShowGrammarQuizCategory(true);
  // };

  // const handleGrammarCategoryBack = () => {
  //   setShowGrammarQuizCategory(false);
  // };

  const canStartLearning = heartSystem.current > 0;

  // ⭐️スターシステムのハンドラー
  const handlePreStudyMenuOpen = () => {
    // スタミナチェック
    if (starSystem.current <= 0) {
      alert("スタミナが不足しています。回復を待ってから再試行してください。");
      return;
    }
    navigate("/learning/pre-study/menu");
  };

  // const handlePreStudyContentSelect = (contentId: string) => {
  //   if (!canUseStars(starSystem)) {
  //     alert("スターが不足しています。回復をお待ちください。");
  //     return;
  //   }

  //   const content = getPreStudyContentsForLevel(userLevel.level).find(
  //     (c) => c.id === contentId
  //   );
  //   if (content) {
  //     // スターを消費
  //     const newStarSystem = consumeStar(starSystem);
  //     setStarSystem(newStarSystem);

  //     // データを保存
  //     const updatedStats = {
  //       ...userStats,
  //       stars: newStarSystem,
  //     };
  //     DataManager.saveUserStats(updatedStats);

  //     // コンテンツを表示
  //     // setCurrentPreStudyContent(content);
  //     // setShowPreStudyContent(true);
  //   }
  // }

  // const handlePreStudyContentComplete = (
  //   contentId: string,
  //   comprehensionRating: number
  // ) => {
  //   const session: PreStudySession = {
  //     contentId,
  //     startTime: Date.now() - 180000, // 3分前と仮定
  //     endTime: Date.now(),
  //     completed: true,
  //     comprehensionRating,
  //   };

  //   const newProgress: PreStudyProgress = {
  //     ...preStudyProgress,
  //     totalContentsStudied: preStudyProgress.totalContentsStudied + 1,
  //     completedContents: [...preStudyProgress.completedContents, contentId],
  //     averageComprehension:
  //       (preStudyProgress.averageComprehension *
  //         preStudyProgress.totalContentsStudied +
  //         comprehensionRating) /
  //       (preStudyProgress.totalContentsStudied + 1),
  //     totalTimeSpent: preStudyProgress.totalTimeSpent + 3, // 3分と仮定
  //     lastStudiedContentId: contentId,
  //   };

  //   const newSessions = [...preStudySessions, session];

  //   setPreStudyProgress(newProgress);
  //   setPreStudySessions(newSessions);

  //   // データを保存
  //   const updatedStats = {
  //     ...userStats,
  //     preStudyProgress: newProgress,
  //     preStudySessions: newSessions,
  //   };
  //   DataManager.saveUserStats(updatedStats);

  //   // 画面を閉じる
  //   setShowPreStudyContent(false);
  //   setCurrentPreStudyContent(null);
  //   setShowPreStudyMenu(false);
  // };

  // const handlePreStudyContentBack = () => {
  //   setShowPreStudyContent(false);
  //   setCurrentPreStudyContent(null);
  // };

  // const handleNavigateToPractice = (category: string) => {
  //   // 事前学習完了後、カテゴリに基づいて適切な問題演習に遷移
  //   switch (category) {
  //     case "grammar":
  //       setShowGrammarQuizCategory(true);
  //       break;
  //     case "vocabulary":
  //       navigate("/vocabulary");
  //       break;
  //     case "listening":
  //       navigate("/listening");
  //       break;
  //     case "reading":
  //       // リーディング問題演習（現在は語彙学習にリダイレクト）
  //       navigate("/vocabulary");
  //       break;
  //     case "writing":
  //       // ライティング問題演習（現在は語彙学習にリダイレクト）
  //       navigate("/vocabulary");
  //       break;
  //     default:
  //       // デフォルトは文法クイズ
  //       setShowGrammarQuizCategory(true);
  //       break;
  //   }
  // };

  // const handleShowGrowthDashboard = () => {
  //   navigate("/progress/dashboard");
  // };

  // const handleHideGrowthDashboard = () => {
  //   setShowGrowthDashboard(false);
  // };

  // ハートシステムとスターシステムの状態を定期的に更新
  useEffect(() => {
    const interval = setInterval(() => {
      // forceRefreshHearts();
      // スターシステムも更新（変更があった場合のみ）
      const updatedStarSystem = levelManager.getStarSystem();
      setStarSystem((prevStars) => {
        // 変更がない場合は更新しない（再レンダリング防止）
        if (
          prevStars.current === updatedStarSystem.current &&
          prevStars.max === updatedStarSystem.max
        ) {
          return prevStars;
        }
        return updatedStarSystem;
      });
    }, 5000); // 1秒 → 5秒に変更（負荷軽減）

    return () => clearInterval(interval);
  }, []); // 依存関係を空にして、マウント時に一度だけ実行

  // 成長ダッシュボードが表示されている場合は、それらを優先表示
  // if (showGrowthDashboard) {
  //   return (
  //     <div>
  //       <h1>成長ダッシュボード</h1>
  //       <p>ユーザー統計: {JSON.stringify(userStats)}</p>
  //       <button onClick={handleHideGrowthDashboard}>戻る</button>
  //     </div>
  //   );
  // }

  // 事前学習のコンテンツ表示はRouter経由で処理
  // showPreStudyContentロジックは削除

  // 文法クイズのコンポーネントが表示されている場合は、それらを優先表示
  // if (showGrammarQuizCategory) {
  //   return (
  //     <GrammarQuizCategorySelection
  //       onSelectCategory={handleGrammarCategorySelect}
  //       onBack={handleGrammarCategoryBack}
  //     />
  //   );
  // }

  // if (showGrammarQuizDifficulty) {
  //   return (
  //     <GrammarQuizDifficultySelection
  //       categoryName={selectedGrammarCategory}
  //       onSelectDifficulty={handleGrammarDifficultySelect}
  //       onBack={handleGrammarDifficultyBack}
  //     />
  //   );
  // }

  // if (showGrammarQuiz) {
  //   return (
  //     <div>
  //       <h1>文法クイズ</h1>
  //       <p>カテゴリ: {selectedGrammarCategory}</p>
  //       <p>難易度: {selectedGrammarDifficulty}</p>
  //       <button onClick={() => setShowGrammarQuiz(false)}>戻る</button>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* ログインボーナス通知 */}
      <LoginBonusNotification />

      {/* ゲームヘッダー */}
      <GameHeader
        onQuestClick={() => {}}
        questCompletedCount={0}
        onChallengeClick={() => {}}
        challengeCompletedCount={0}
      />

      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* 簡素化されたタイトル */}
        <div className="text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ENTP英語学習アプリ
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            あなたの英語学習をサポートします
          </p>
        </div>

        {/* 簡素化されたコントロール */}
        <div className="flex items-center justify-center gap-3 py-2">
          {/* PWAInstallButton一時的に非表示（無限レンダリング対策） */}
          {/* <PWAInstallButton variant="compact" showInstructions={false} /> */}
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
            className="flex items-center gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100"
          >
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline text-purple-700">学習分析</span>
            <span className="sm:hidden text-purple-700">分析</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">ステータス設定</span>
            <span className="sm:hidden">ステータス</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings/app")}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">アプリ設定</span>
            <span className="sm:hidden">設定</span>
          </Button>
        </div>

        {/* レベル情報はGameHeaderに統合済み */}

        {/* デイリーチャレンジカード */}
        <div className="mb-6">
          <DailyChallengeCard />
        </div>

        {/* ステータス配分 */}
        {/* {showStatusAllocation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusAllocationComponent />
        </div>
      )} */}

        {/* 学習モード選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TOEIC単語ガチャ */}
          <SelectionCard
            id="gacha"
            title="TOEIC単語ガチャ"
            description="新しい単語をゲット！レアカードを集めよう"
            icon="🎁"
            difficulty="ガチャ"
            detail="XP消費"
            onClick={() => navigate("/games/gacha")}
          />

          {/* ⭐️事前学習 */}
          <SelectionCard
            id="pre-study"
            title="事前学習"
            description="理論を理解してから実践へ"
            icon="⭐️"
            difficulty="理論"
            detail="必要スター: 1 ⭐️"
            onClick={() => canUseStars(starSystem) && handlePreStudyMenuOpen()}
          />

          {/* スキルツリー */}
          <SelectionCard
            id="skill-tree"
            title="スキルツリー"
            description="英語学習の全体マップと進捗確認"
            icon="🌳"
            difficulty="進捗"
            detail="体力不要"
            onClick={() => navigate("/learning/skill-tree")}
          />

          {/* シナジー効果 */}
          <SelectionCard
            id="synergy-effect"
            title="シナジー効果"
            description="学習の相乗効果を最大化して効率アップ"
            icon="🧠"
            difficulty="相乗効果"
            detail="学習効果+30-260%"
            onClick={() => navigate("/learning/synergy")}
          />

          {/* 文法クイズ */}
          <SelectionCard
            id="grammar-quiz"
            title="文法クイズ"
            description="9つのカテゴリーから文法問題に挑戦"
            icon="✏️"
            difficulty="文法"
            detail="必要体力: 1 ♥"
            onClick={() =>
              canStartLearning && navigate("/learning/grammar/category")
            }
          />

          {/* 語彙学習 */}
          <SelectionCard
            id="vocabulary"
            title="語彙学習"
            description="レベル別・カテゴリー別の単語学習"
            icon="📚"
            difficulty="語彙"
            detail="必要体力: 1 ♥"
            onClick={() =>
              canStartLearning && navigate("/learning/vocabulary/difficulty")
            }
          />

          {/* リスニング学習 */}
          <SelectionCard
            id="listening"
            title="リスニング学習"
            description="TOEIC形式のリスニング問題で耳を鍛える"
            icon="🎧"
            difficulty="リスニング"
            detail="必要体力: 1 ♥"
            onClick={() => canStartLearning && navigate("/listening")}
          />

          {/* TOEIC模擬テスト */}
          <SelectionCard
            id="toeic-mock-test"
            title="TOEIC模擬テスト"
            description="本格的なTOEIC形式の模擬テストに挑戦"
            icon="📊"
            difficulty="模擬テスト"
            detail="本格テスト"
            onClick={() => navigate("/toeic/mock-test")}
          />
          <SelectionCard
            id="toeic-dashboard"
            title="TOEIC統合ダッシュボード"
            description="全システムの進捗とシナジー効果を確認"
            icon="📈"
            difficulty="統合分析"
            detail="全機能統合"
            onClick={() => navigate("/toeic/dashboard")}
          />
          <SelectionCard
            id="learning-path-challenges"
            title="学習パスチャレンジ"
            description="最適な学習パスに基づく段階的チャレンジ"
            icon="🎯"
            difficulty="チャレンジ"
            detail="段階的学習"
            onClick={() => navigate("/learning-path-challenges")}
          />

          {/* 統合学習（新機能） */}
          <SelectionCard
            id="integrated"
            title="統合学習"
            description="単語と問題を組み合わせた効率的学習"
            icon="🧠"
            difficulty="統合"
            detail="必要体力: 1 ♥ • ガチャカード活用"
            onClick={() =>
              canStartLearning &&
              navigate("/learning/integrated/intermediate/toeic/mixed")
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
            onClick={() =>
              canStartLearning && navigate("/learning/combined-test")
            }
          />

          {/* タイムアタック */}
          <SelectionCard
            id="time-attack"
            title="タイムアタック"
            description="制限時間内で問題を解くスピード重視モード"
            icon="⏰"
            difficulty="スピード"
            detail="必要体力: 1 ♥"
            onClick={() =>
              canStartLearning && navigate("/learning/time-attack")
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
            onClick={() => {}}
          />

          {/* 実績 */}
          <SelectionCard
            id="achievements"
            title="実績"
            description="学習の進捗とアチーブメントを確認"
            icon="🏆"
            difficulty="進捗"
            detail="体力不要"
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
            onClick={() => navigate("/progress/dashboard")}
          />
        </div>

        {/* フィードバックボタン */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => {}}
            className="flex items-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>学習フィードバック</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/feedback")}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>アプリフィードバック</span>
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

        {/* 詳細学習分析リンク */}
        {userStats && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => navigate("/analytics/detailed")}
              variant="outline"
              className="bg-purple-50 border-purple-200 hover:bg-purple-100"
            >
              <Brain className="w-4 h-4 mr-2" />
              詳細学習分析を見る
            </Button>
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
        {/* {showFeedbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <LearningFeedbackForm onClose={() => setShowFeedbackForm(false)} />
          </div>
        </div>
      )} */}

        {/* デイリークエストパネル */}
        {/* {showDailyQuests && (
        <DailyQuestPanel onClose={() => setShowDailyQuests(false)} />
      )} */}

        {/* デイリーチャレンジパネル */}
        {/* {showDailyChallenges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <DailyChallengeCard />
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => {}}
                className="bg-white"
              >
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
}
