import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BGMPlayer } from "../components/BGMPlayer";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Home from "../components/Home";
import { ProbabilityFeatureTester } from "../components/ProbabilityFeatureTester";
import { ScrollToTop } from "../components/ScrollToTop";

// 直接importに変更（lazy loadingの問題を回避）
import Achievements from "../components/Achievements";
import { AppSettings } from "../components/AppSettings";
import BasicVocabularyLearning from "../components/BasicVocabularyLearning";
import CardDetailContent from "../components/CardDetailContent";
import CategorySelection from "../components/CategorySelection";
import CombinedTest from "../components/CombinedTest";
import CreativeWritingChallenge from "../components/CreativeWritingChallenge";
import { DataManagerProvider } from "../components/DataManagerProvider";
import DetailedAnalyticsDashboard from "../components/DetailedAnalyticsDashboard";
import DifficultySelection from "../components/DifficultySelection";
import EnhancedGrammarQuiz from "../components/EnhancedGrammarQuiz";
import EssayHistory from "../components/EssayHistory";
import EssayWriting from "../components/EssayWriting";
import FeedbackAnalytics from "../components/FeedbackAnalytics";
import FoundationCategorySelection from "../components/FoundationCategorySelection";
import FoundationDifficultySelection from "../components/FoundationDifficultySelection";
import FoundationQuestionSetSelection from "../components/FoundationQuestionSetSelection";
import FoundationQuiz from "../components/FoundationQuiz";
import GachaResultScreen from "../components/GachaResultScreen";
import GachaSystem from "../components/GachaSystem";
import GachaVocabularyLearning from "../components/GachaVocabularyLearning";
import GrowthDashboard from "../components/GrowthDashboard";
// import IntegratedLearning from "../components/IntegratedLearning";
import LearningPathChallengeDashboard from "../components/LearningPathChallengeDashboard"; // Added
import ListeningLearning from "../components/ListeningLearning";
import ListeningSelection from "../components/ListeningSelection";
import { MigrationProvider } from "../components/MigrationProvider";
import MockPrototypeDemo from "../components/MockPrototypeDemo";
import PersonalInsights from "../components/PersonalInsights";
import Question from "../components/Question";
import QuestionListView from "../components/QuestionListView";
import QuestionSetSelection from "../components/QuestionSetSelection";
import Results from "../components/Results";
import SentencePatternSelection from "../components/SentencePatternSelection";
import SimpleTowerDefense from "../components/SimpleTowerDefense";
import SkillTree from "../components/SkillTree";
import PreStudyContentViewer from "../components/starSystem/PreStudyContentViewer";
import PreStudyMenu from "../components/starSystem/PreStudyMenu";
import SynergyDashboard from "../components/SynergyDashboard";
import TimeAttackMode from "../components/TimeAttackMode";
import TOEICIntegratedDashboard from "../components/TOEICIntegratedDashboard";
import TOEICMockTestContainer from "../components/TOEICMockTestContainer";
import UserFeedback from "../components/UserFeedback";
import VocabularyCard from "../components/VocabularyCard";
import VocabularyCategorySelection from "../components/VocabularyCategorySelection";
import VocabularyDifficultySelection from "../components/VocabularyDifficultySelection";
import XPShopPage from "../components/XPShopPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <MigrationProvider>
          <DataManagerProvider>
            <BGMPlayer />
            <div className="min-h-screen bg-background">
              <Routes>
                {/* ホーム */}
                <Route path="/" element={<Home />} />

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

                {/* 新しい分離された語彙学習モード */}
                <Route
                  path="/learning/vocabulary/gacha-mode"
                  element={<GachaVocabularyLearning />}
                />
                <Route
                  path="/learning/vocabulary/basic-mode"
                  element={<BasicVocabularyLearning />}
                />

                {/* 統合学習システム */}
                {/* <Route
                  path="/learning/integrated/:level/:category/:mode"
                  element={<IntegratedLearning />}
                /> */}

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

                {/* シナジーダッシュボード */}
                <Route
                  path="/learning/synergy"
                  element={<SynergyDashboard />}
                />
                <Route
                  path="/learning/synergy/:category"
                  element={<SynergyDashboard />}
                />

                {/* スキルツリー */}
                <Route path="/learning/skill-tree" element={<SkillTree />} />

                {/* 基礎英語学習 */}
                <Route
                  path="/learning/foundation/category"
                  element={<FoundationCategorySelection />}
                />
                <Route
                  path="/learning/foundation/difficulty/:category"
                  element={<FoundationDifficultySelection />}
                />
                <Route
                  path="/learning/foundation/sets/:category/:difficulty"
                  element={<FoundationQuestionSetSelection />}
                />
                <Route
                  path="/learning/foundation/quiz/:category/:difficulty/:setId"
                  element={<FoundationQuiz />}
                />
                <Route
                  path="/learning/foundation/quiz/:category/:difficulty"
                  element={<FoundationQuiz />}
                />

                {/* 事前学習 */}
                <Route
                  path="/learning/pre-study/menu"
                  element={<PreStudyMenu />}
                />
                <Route
                  path="/learning/pre-study/content/:contentId"
                  element={<PreStudyContentViewer />}
                />

                {/* リスニング学習 */}
                <Route path="/listening" element={<ListeningSelection />} />
                <Route
                  path="/listening/learn/:difficulty/:part?"
                  element={<ListeningLearning />}
                />

                {/* その他の学習機能 */}
                <Route
                  path="/learning/combined-test"
                  element={<CombinedTest />}
                />
                <Route
                  path="/learning/time-attack"
                  element={<TimeAttackMode />}
                />
                <Route
                  path="/learning/essay-writing"
                  element={<EssayWriting />}
                />
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
                <Route
                  path="/games/gacha/result"
                  element={<GachaResultScreen />}
                />
                <Route
                  path="/games/gacha/card/:cardId"
                  element={<CardDetailContent />}
                />

                {/* ショップ機能 */}
                <Route path="/shop/xp" element={<XPShopPage />} />

                {/* 進捗・統計 */}
                <Route
                  path="/progress/achievements"
                  element={<Achievements />}
                />
                <Route
                  path="/progress/dashboard"
                  element={<GrowthDashboard />}
                />
                <Route
                  path="/progress/insights"
                  element={<PersonalInsights />}
                />

                {/* 設定 */}
                <Route path="/settings/app" element={<AppSettings />} />

                {/* TOEIC模擬テスト */}
                <Route
                  path="/toeic/mock-test"
                  element={<TOEICMockTestContainer />}
                />
                <Route
                  path="/toeic/dashboard"
                  element={<TOEICIntegratedDashboard />}
                />
                {/* 学習パスチャレンジ */}
                <Route
                  path="/learning-path-challenges"
                  element={<LearningPathChallengeDashboard />}
                />

                {/* 詳細学習分析 */}
                <Route
                  path="/analytics/detailed"
                  element={<DetailedAnalyticsDashboard />}
                />

                {/* フィードバック機能 */}
                <Route path="/feedback" element={<UserFeedback />} />
                <Route
                  path="/feedback/analytics"
                  element={<FeedbackAnalytics />}
                />

                {/* フォールバック */}
                {/* モックプロトタイプ */}
                <Route path="/mock" element={<MockPrototypeDemo />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </DataManagerProvider>
        </MigrationProvider>
        <ProbabilityFeatureTester />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
