import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NewHome } from "../components/NewHome";
import { ScrollToTop } from "../components/ScrollToTop";

// 直接importに変更（lazy loadingの問題を回避）
import Achievements from "../components/Achievements";
import AppSettings from "../components/AppSettings";
import CardDetailContent from "../components/CardDetailContent";
import CategorySelection from "../components/CategorySelection";
import CombinedTest from "../components/CombinedTest";
import DifficultySelection from "../components/DifficultySelection";
import EnhancedGrammarQuiz from "../components/EnhancedGrammarQuiz";
import EssayWriting from "../components/EssayWriting";
import GachaResultScreen from "../components/GachaResultScreen";
import GachaSystem from "../components/GachaSystem";
import GrowthDashboard from "../components/GrowthDashboard";
import Question from "../components/Question";
import Results from "../components/Results";
import SimpleTowerDefense from "../components/SimpleTowerDefense";
import PreStudyContentViewer from "../components/starSystem/PreStudyContentViewer";
import PreStudyMenu from "../components/starSystem/PreStudyMenu";
import TimeAttackMode from "../components/TimeAttackMode";
import VocabularyCard from "../components/VocabularyCard";
import VocabularyCategorySelection from "../components/VocabularyCategorySelection";
import VocabularyDifficultySelection from "../components/VocabularyDifficultySelection";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="/games/tower-defense" element={<SimpleTowerDefense />} />
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
      </div>
    </BrowserRouter>
  );
}
