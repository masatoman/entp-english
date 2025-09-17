import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NewHome } from "../components/NewHome";
import { ScrollToTop } from "../components/ScrollToTop";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// Lazy load components for better performance
const CategorySelection = lazy(() => import("../components/CategorySelection"));
const DifficultySelection = lazy(
  () => import("../components/DifficultySelection")
);
const Question = lazy(() => import("../components/Question"));
const Results = lazy(() => import("../components/Results"));
const VocabularyCategorySelection = lazy(
  () => import("../components/VocabularyCategorySelection")
);
const VocabularyDifficultySelection = lazy(
  () => import("../components/VocabularyDifficultySelection")
);
const VocabularyCard = lazy(() => import("../components/VocabularyCard"));
const EnhancedGrammarQuiz = lazy(
  () => import("../components/EnhancedGrammarQuiz")
);
const CombinedTest = lazy(() => import("../components/CombinedTest"));
const TimeAttackMode = lazy(() => import("../components/TimeAttackMode"));
const SimpleTowerDefense = lazy(
  () => import("../components/SimpleTowerDefense")
);
const GachaSystem = lazy(() => import("../components/GachaSystem"));
const GachaResultScreen = lazy(() => import("../components/GachaResultScreen"));
const Achievements = lazy(() => import("../components/Achievements"));
const AppSettings = lazy(() => import("../components/AppSettings"));
const PreStudyMenu = lazy(
  () => import("../components/starSystem/PreStudyMenu")
);
const PreStudyContentViewer = lazy(
  () => import("../components/starSystem/PreStudyContentViewer")
);
const GrowthDashboard = lazy(() => import("../components/GrowthDashboard"));
const CardDetailContent = lazy(() => import("../components/CardDetailContent"));
const EssayWriting = lazy(() => import("../components/EssayWriting"));
const EnhancedTimeAttack = lazy(
  () => import("../components/EnhancedTimeAttack")
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* ホーム */}
            <Route path="/" element={<NewHome />} />

            {/* 学習機能 */}
            <Route
              path="/learning/vocabulary/difficulty"
              element={<VocabularyDifficultySelection />}
            />
            <Route
              path="/learning/vocabulary/category"
              element={<VocabularyCategorySelection />}
            />
            <Route
              path="/learning/vocabulary/study/:difficulty/:category"
              element={<VocabularyCard />}
            />

            {/* 文法クイズ */}
            <Route
              path="/learning/grammar/category"
              element={<CategorySelection />}
            />
            <Route
              path="/learning/grammar/difficulty/:category"
              element={<DifficultySelection />}
            />
            <Route
              path="/learning/grammar/quiz/:category/:difficulty"
              element={<EnhancedGrammarQuiz />}
            />
            <Route
              path="/learning/grammar/question/:category/:difficulty"
              element={<Question />}
            />
            <Route
              path="/learning/grammar/results/:category/:difficulty"
              element={<Results />}
            />

            {/* 事前学習 */}
            <Route path="/learning/pre-study/menu" element={<PreStudyMenu />} />
            <Route
              path="/learning/pre-study/content/:contentId"
              element={<PreStudyContentViewer />}
            />

            {/* その他の学習機能 */}
            <Route path="/learning/combined-test" element={<CombinedTest />} />
            <Route path="/learning/time-attack" element={<TimeAttackMode />} />
            <Route path="/learning/essay-writing" element={<EssayWriting />} />

            {/* ゲーム機能 */}
            <Route
              path="/games/tower-defense"
              element={<SimpleTowerDefense />}
            />
            <Route path="/games/gacha" element={<GachaSystem />} />
            <Route path="/games/gacha/result" element={<GachaResultScreen />} />
            <Route
              path="/games/gacha/card/:cardId"
              element={<CardDetailContent />}
            />

            {/* 進捗・統計 */}
            <Route path="/progress/achievements" element={<Achievements />} />
            <Route path="/progress/dashboard" element={<GrowthDashboard />} />

            {/* 設定 */}
            <Route path="/settings/app" element={<AppSettings />} />

            {/* フォールバック */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
