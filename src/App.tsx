import { useState, useEffect, lazy, Suspense } from "react";
import { Home } from "./components/Home";
import { NewHome } from "./components/NewHome";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { QuestionData } from "./components/Question";

// 動的インポートでコンポーネントを遅延読み込み
const VocabularyCard = lazy(() => import("./components/VocabularyCard").then(m => ({ default: m.VocabularyCard })));
const EnhancedVocabularyCard = lazy(() => import("./components/EnhancedVocabularyCard").then(m => ({ default: m.EnhancedVocabularyCard })));
const VocabularyDifficultySelection = lazy(() => import("./components/VocabularyDifficultySelection").then(m => ({ default: m.VocabularyDifficultySelection })));
const VocabularyCategorySelection = lazy(() => import("./components/VocabularyCategorySelection").then(m => ({ default: m.VocabularyCategorySelection })));
const GrammarQuiz = lazy(() => import("./components/GrammarQuiz").then(m => ({ default: m.GrammarQuiz })));
const EnhancedGrammarQuiz = lazy(() => import("./components/EnhancedGrammarQuiz").then(m => ({ default: m.EnhancedGrammarQuiz })));
const GrammarQuizDifficultySelection = lazy(() => import("./components/GrammarQuizDifficultySelection").then(m => ({ default: m.GrammarQuizDifficultySelection })));
const CombinedTest = lazy(() => import("./components/CombinedTest").then(m => ({ default: m.CombinedTest })));
const Achievements = lazy(() => import("./components/Achievements").then(m => ({ default: m.Achievements })));
const CategorySelection = lazy(() => import("./components/CategorySelection").then(m => ({ default: m.CategorySelection })));
const DifficultySelection = lazy(() => import("./components/DifficultySelection").then(m => ({ default: m.DifficultySelection })));
const Question = lazy(() => import("./components/Question").then(m => ({ default: m.Question })));
const Results = lazy(() => import("./components/Results").then(m => ({ default: m.Results })));
const AppSettings = lazy(() => import("./components/AppSettings").then(m => ({ default: m.AppSettings })));
const TimeAttackMode = lazy(() => import("./components/TimeAttackMode").then(m => ({ default: m.TimeAttackMode })));
const SimpleTowerDefense = lazy(() => import("./components/SimpleTowerDefense").then(m => ({ default: m.SimpleTowerDefense })));
import { getQuestions } from "./data/questions";
import { Category, UserAnswer } from "./types";
import { DataManager } from "./utils/dataManager";
import { calculateTotalSessionXP } from "./utils/xpCalculator";
// Utility functions
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function checkAnswer(userAnswer: string, correctAnswer: string, difficulty: 'easy' | 'normal' | 'hard'): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  if (difficulty === 'easy') {
    // For multiple choice, exact match
    return normalize(userAnswer) === normalize(correctAnswer);
  } else {
    // For text input, more flexible matching
    const userNormalized = normalize(userAnswer);
    const correctNormalized = normalize(correctAnswer);
    
    // Check if the key words are present
    const correctWords = correctNormalized.split(/\s+/);
    const userWords = userNormalized.split(/\s+/);
    
    // Simple scoring: if most key words are present, consider it correct
    const matchedWords = correctWords.filter(word => 
      word.length > 2 && userWords.some(userWord => 
        userWord.includes(word) || word.includes(userWord)
      )
    );
    
    return matchedWords.length >= Math.ceil(correctWords.length * 0.7);
  }
}

type Screen = 'home' | 'vocabulary-difficulty' | 'vocabulary-category' | 'vocabulary' | 'grammar-quiz-difficulty' | 'grammar-quiz' | 'combined-test' | 'achievements' | 'notification-settings' | 'app-settings' | 'time-attack' | 'simple-tower-defense' | 'category' | 'difficulty' | 'question' | 'results';
type Difficulty = 'easy' | 'normal' | 'hard';
type VocabularyDifficulty = 'beginner' | 'intermediate' | 'advanced';
type VocabularyCategory = 'all' | 'toeic' | 'business' | 'daily' | 'academic';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('basic-grammar');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [vocabularyDifficulty, setVocabularyDifficulty] = useState<VocabularyDifficulty>('intermediate');
  const [vocabularyCategory, setVocabularyCategory] = useState<VocabularyCategory>('all');
  const [grammarQuizDifficulty, setGrammarQuizDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  const handleNavigateToGrammar = () => {
    setCurrentScreen('category');
  };

  const handleNavigateToVocabulary = () => {
    setCurrentScreen('vocabulary-difficulty');
  };

  const handleSelectVocabularyDifficulty = (selectedDifficulty: VocabularyDifficulty) => {
    setVocabularyDifficulty(selectedDifficulty);
    setCurrentScreen('vocabulary-category');
  };

  const handleSelectVocabularyCategory = (selectedCategory: VocabularyCategory) => {
    setVocabularyCategory(selectedCategory);
    setCurrentScreen('vocabulary');
  };

  const handleNavigateToGrammarQuiz = () => {
    setCurrentScreen('grammar-quiz-difficulty');
  };

  const handleSelectGrammarQuizDifficulty = (selectedDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setGrammarQuizDifficulty(selectedDifficulty);
    setCurrentScreen('grammar-quiz');
  };

  const handleNavigateToEssay = () => {
    setCurrentScreen('category'); // 英作文もカテゴリ選択から開始
  };

  const handleNavigateToCombinedTest = () => {
    setCurrentScreen('combined-test');
  };

  const handleNavigateToAchievements = () => {
    setCurrentScreen('achievements');
  };


  const handleNavigateToAppSettings = () => {
    setCurrentScreen('app-settings');
  };

  const handleNavigateToTimeAttack = () => {
    setCurrentScreen('time-attack');
  };

  const handleNavigateToSimpleTowerDefense = () => {
    setCurrentScreen('simple-tower-defense');
  };


  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleSelectCategory = (category: Category) => {
    console.log('Category selected:', category);
    setSelectedCategory(category);
    setCurrentScreen('difficulty');
  };

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    console.log('=== Debug handleSelectDifficulty ===');
    console.log('Difficulty selected:', selectedDifficulty);
    console.log('Selected category:', selectedCategory);
    
    try {
      setDifficulty(selectedDifficulty);
      
      const categoryQuestions = getQuestions(selectedCategory, selectedDifficulty);
      console.log('Retrieved questions:', categoryQuestions.length);
      console.log('Questions data:', categoryQuestions);
      
      if (categoryQuestions.length === 0) {
        console.error('No questions found for category:', selectedCategory, 'difficulty:', selectedDifficulty);
        return;
      }
      
      console.log('About to shuffle questions...');
      // 設定された問題数を使用
      const appSettings = DataManager.getAppSettings();
      const questionCount = appSettings.essayQuestionCount;
      const shuffledQuestions = shuffleArray(categoryQuestions).slice(0, questionCount);
      console.log('Shuffled questions:', shuffledQuestions.length);
      
      console.log('Setting questions state...');
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSessionStartTime(Date.now()); // セッション開始時間を記録
      console.log('Setting screen to question');
      setCurrentScreen('question');
      console.log('handleSelectDifficulty completed successfully');
    } catch (error) {
      console.error('Error in handleSelectDifficulty:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = checkAnswer(answer, currentQuestion.correctAnswer, difficulty);
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect
    };
    
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // クイズ完了時の処理
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
      const correctAnswers = updatedAnswers.filter(a => a.isCorrect).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      const xpEarned = calculateTotalSessionXP(updatedAnswers, difficulty, selectedCategory, sessionDuration);
      
      // 学習セッションを記録
      DataManager.recordLearningSession({
        date: new Date().toISOString().split('T')[0],
        type: 'grammar-quiz',
        category: selectedCategory,
        difficulty: difficulty,
        score: score,
        totalQuestions: questions.length,
        correctAnswers: correctAnswers,
        xpEarned: xpEarned,
        duration: sessionDuration,
      });
      
      // 実績をチェック・更新
      DataManager.checkAndUpdateAchievements();
      
      setCurrentScreen('results');
    }
  };

  const handleRestart = () => {
    const categoryQuestions = getQuestions(selectedCategory, difficulty);
    // 設定された問題数を使用
    const appSettings = DataManager.getAppSettings();
    const questionCount = appSettings.essayQuestionCount;
    const shuffledQuestions = shuffleArray(categoryQuestions).slice(0, questionCount);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSessionStartTime(Date.now()); // セッション開始時間をリセット
    setCurrentScreen('question');
  };

  const handleChangeDifficulty = () => {
    setCurrentScreen('difficulty');
  };

  const handleChangeCategory = () => {
    setCurrentScreen('category');
  };

  // Debug only when screen changes
  if (currentScreen === 'question') {
    console.log('=== Question Screen State ===');
    console.log('currentScreen:', currentScreen);
    console.log('questions.length:', questions.length);
    console.log('selectedCategory:', selectedCategory);
    console.log('difficulty:', difficulty);
  }

  // ローディングコンポーネント
  const LoadingSpinner = () => (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl mb-2">読み込み中...</h2>
        <p className="text-muted-foreground">コンポーネントを読み込んでいます</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'home' && (
        <NewHome
          onNavigateToGrammar={handleNavigateToGrammar}
          onNavigateToVocabulary={handleNavigateToVocabulary}
          onNavigateToGrammarQuiz={handleNavigateToGrammarQuiz}
          onNavigateToEssay={handleNavigateToEssay}
          onNavigateToCombinedTest={handleNavigateToCombinedTest}
          onNavigateToAchievements={handleNavigateToAchievements}
          onNavigateToAppSettings={handleNavigateToAppSettings}
          onNavigateToTimeAttack={handleNavigateToTimeAttack}
          onNavigateToSimpleTowerDefense={handleNavigateToSimpleTowerDefense}
        />
      )}
      
      {currentScreen === 'vocabulary-difficulty' && (
        <Suspense fallback={<LoadingSpinner />}>
          <VocabularyDifficultySelection 
            onBack={handleBackToHome}
            onSelectDifficulty={handleSelectVocabularyDifficulty}
          />
        </Suspense>
      )}
      
      {currentScreen === 'vocabulary-category' && (
        <Suspense fallback={<LoadingSpinner />}>
          <VocabularyCategorySelection 
            onBack={() => setCurrentScreen('vocabulary-difficulty')}
            onSelectCategory={handleSelectVocabularyCategory}
          />
        </Suspense>
      )}
      
      {currentScreen === 'vocabulary' && (
        <Suspense fallback={<LoadingSpinner />}>
          <EnhancedVocabularyCard 
            onBack={() => setCurrentScreen('vocabulary-category')} 
            difficulty={vocabularyDifficulty}
            category={vocabularyCategory}
          />
        </Suspense>
      )}
      
      {currentScreen === 'grammar-quiz-difficulty' && (
        <Suspense fallback={<LoadingSpinner />}>
          <GrammarQuizDifficultySelection 
            onBack={handleBackToHome}
            onSelectDifficulty={handleSelectGrammarQuizDifficulty}
          />
        </Suspense>
      )}
      
      {currentScreen === 'grammar-quiz' && (
        <Suspense fallback={<LoadingSpinner />}>
          <EnhancedGrammarQuiz 
            onBack={() => setCurrentScreen('grammar-quiz-difficulty')} 
            difficulty={grammarQuizDifficulty}
          />
        </Suspense>
      )}
      
      {currentScreen === 'combined-test' && (
        <Suspense fallback={<LoadingSpinner />}>
          <CombinedTest onBack={handleBackToHome} />
        </Suspense>
      )}
      
      {currentScreen === 'achievements' && (
        <Suspense fallback={<LoadingSpinner />}>
          <Achievements onBack={handleBackToHome} />
        </Suspense>
      )}
      
      
      {currentScreen === 'app-settings' && (
        <Suspense fallback={<LoadingSpinner />}>
          <AppSettings onBack={handleBackToHome} />
        </Suspense>
      )}
      
      {currentScreen === 'time-attack' && (
        <Suspense fallback={<LoadingSpinner />}>
          <TimeAttackMode onBack={handleBackToHome} />
        </Suspense>
      )}
      
      {currentScreen === 'simple-tower-defense' && (
        <Suspense fallback={<LoadingSpinner />}>
          <SimpleTowerDefense onBack={handleBackToHome} />
        </Suspense>
      )}
      
      
      {currentScreen === 'category' && (
        <Suspense fallback={<LoadingSpinner />}>
          <CategorySelection 
            onSelectCategory={handleSelectCategory} 
            onBack={handleBackToHome}
          />
        </Suspense>
      )}
      
      {currentScreen === 'difficulty' && (
        <Suspense fallback={<LoadingSpinner />}>
          <DifficultySelection
            category={selectedCategory}
            onSelectDifficulty={handleSelectDifficulty}
            onBack={handleChangeCategory}
          />
        </Suspense>
      )}
      
      {currentScreen === 'question' && questions.length > 0 && (
        <Suspense fallback={<LoadingSpinner />}>
          <Question
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            difficulty={difficulty}
            category={selectedCategory}
            onAnswer={handleAnswer}
            onBack={handleChangeDifficulty}
          />
        </Suspense>
      )}
      
      {currentScreen === 'question' && questions.length === 0 && (
        <div className="min-h-screen p-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl mb-2">問題の読み込み中...</h2>
            <p className="text-muted-foreground">
              カテゴリー: {selectedCategory}<br/>
              難易度: {difficulty}
            </p>
          </div>
        </div>
      )}
      
      {currentScreen === 'results' && (
        <Suspense fallback={<LoadingSpinner />}>
          <Results
            questions={questions}
            userAnswers={userAnswers}
            difficulty={difficulty}
            category={selectedCategory}
            sessionDuration={Math.round((Date.now() - sessionStartTime) / 1000)}
            onRestart={handleRestart}
            onChangeDifficulty={handleChangeDifficulty}
            onChangeCategory={handleChangeCategory}
            onBack={handleBackToHome}
          />
        </Suspense>
      )}
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </div>
  );
}