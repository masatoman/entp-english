import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NewHome } from "../components/NewHome";
import { ScrollToTop } from "../components/ScrollToTop";

// 直接importに変更（lazy loadingの問題を回避）
import Achievements from "../components/Achievements";
import AppSettings from "../components/AppSettings";
import CardDetailContent from "../components/CardDetailContent";
import CategorySelection from "../components/CategorySelection";
import CombinedTest from "../components/CombinedTest";
import CreativeWritingChallenge from "../components/CreativeWritingChallenge";
import DifficultySelection from "../components/DifficultySelection";
import EnhancedGrammarQuiz from "../components/EnhancedGrammarQuiz";
import EssayHistory from "../components/EssayHistory";
import EssayWriting from "../components/EssayWriting";
import GachaResultScreen from "../components/GachaResultScreen";
import GachaSystem from "../components/GachaSystem";
import GrowthDashboard from "../components/GrowthDashboard";
import IntegratedLearning from "../components/IntegratedLearning";
import { MigrationProvider } from "../components/MigrationProvider";
import PersonalInsights from "../components/PersonalInsights";
import Question from "../components/Question";
import QuestionListView from "../components/QuestionListView";
import QuestionSetSelection from "../components/QuestionSetSelection";
import Results from "../components/Results";
import SentencePatternSelection from "../components/SentencePatternSelection";
import SimpleTowerDefense from "../components/SimpleTowerDefense";
import PreStudyContentViewer from "../components/starSystem/PreStudyContentViewer";
import PreStudyMenu from "../components/starSystem/PreStudyMenu";
import TimeAttackMode from "../components/TimeAttackMode";
import VocabularyCard from "../components/VocabularyCard";
import VocabularyCategorySelection from "../components/VocabularyCategorySelection";
import VocabularyDifficultySelection from "../components/VocabularyDifficultySelection";
import XPShopPage from "../components/XPShopPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MigrationProvider>
        <div className="min-h-screen bg-background">
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

            {/* 統合学習システム */}
            <Route
              path="/learning/integrated/:level/:category/:mode"
              element={<IntegratedLearning />}
            />

            {/* 文法クイズ */}
            <Route
              path="/learning/grammar/category"
              element={<CategorySelection />}
            />
            {/* 基本文型の場合：カテゴリー → 文型選択 → 難易度選択 → 問題集選択 */}
            <Route
              path="/learning/grammar/pattern/:category"
              element={<SentencePatternSelection />}
            />
            <Route
              path="/learning/grammar/difficulty/:category/:pattern?"
              element={<DifficultySelection />}
            />
            <Route
              path="/learning/grammar/sets/:category/:pattern/:difficulty"
              element={<QuestionSetSelection />}
            />
            {/* 従来の問題一覧（統計用） */}
            <Route
              path="/learning/grammar/list/:category/:difficulty"
              element={<QuestionListView />}
            />
            <Route
              path="/learning/grammar/quiz/:category/:difficulty"
              element={<EnhancedGrammarQuiz />}
            />
            <Route
              path="/learning/grammar/question-set/:category/:pattern/:difficulty/:setId"
              element={<Question />}
            />
            <Route
              path="/learning/grammar/question/:category/:difficulty/:questionId?"
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
            <Route
              path="/learning/creative-writing"
              element={<CreativeWritingChallenge />}
            />
            <Route
              path="/learning/essay-writing/history"
              element={<EssayHistory />}
            />

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

            {/* ショップ機能 */}
            <Route path="/shop/xp" element={<XPShopPage />} />

            {/* 進捗・統計 */}
            <Route path="/progress/achievements" element={<Achievements />} />
            <Route path="/progress/dashboard" element={<GrowthDashboard />} />
            <Route path="/progress/insights" element={<PersonalInsights />} />

            {/* 設定 */}
            <Route path="/settings/app" element={<AppSettings />} />

            {/* フォールバック */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </MigrationProvider>
    </BrowserRouter>
  );
}
