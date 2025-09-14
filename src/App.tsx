import { useState, useEffect } from "react";
import { Home } from "./components/Home";
import { VocabularyCard } from "./components/VocabularyCard";
import { VocabularyDifficultySelection } from "./components/VocabularyDifficultySelection";
import { VocabularyCategorySelection } from "./components/VocabularyCategorySelection";
import { GrammarQuiz } from "./components/GrammarQuiz";
import { GrammarQuizDifficultySelection } from "./components/GrammarQuizDifficultySelection";
import { CombinedTest } from "./components/CombinedTest";
import { Achievements } from "./components/Achievements";
import { CategorySelection } from "./components/CategorySelection";
import { DifficultySelection } from "./components/DifficultySelection";
import { Question, QuestionData } from "./components/Question";
import { Results } from "./components/Results";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "./components/PWAUpdatePrompt";
import { AppSettings } from "./components/AppSettings";
import { TimeAttackMode } from "./components/TimeAttackMode";
import { SimpleTowerDefense } from "./components/SimpleTowerDefense";
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
      const shuffledQuestions = shuffleArray(categoryQuestions).slice(0, 10);
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
    const shuffledQuestions = shuffleArray(categoryQuestions).slice(0, 10);
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

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'home' && (
        <Home
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
        <VocabularyDifficultySelection 
          onBack={handleBackToHome}
          onSelectDifficulty={handleSelectVocabularyDifficulty}
        />
      )}
      
      {currentScreen === 'vocabulary-category' && (
        <VocabularyCategorySelection 
          onBack={() => setCurrentScreen('vocabulary-difficulty')}
          onSelectCategory={handleSelectVocabularyCategory}
        />
      )}
      
      {currentScreen === 'vocabulary' && (
        <VocabularyCard 
          onBack={() => setCurrentScreen('vocabulary-category')} 
          difficulty={vocabularyDifficulty}
          category={vocabularyCategory}
        />
      )}
      
      {currentScreen === 'grammar-quiz-difficulty' && (
        <GrammarQuizDifficultySelection 
          onBack={handleBackToHome}
          onSelectDifficulty={handleSelectGrammarQuizDifficulty}
        />
      )}
      
      {currentScreen === 'grammar-quiz' && (
        <GrammarQuiz 
          onBack={() => setCurrentScreen('grammar-quiz-difficulty')} 
          difficulty={grammarQuizDifficulty}
        />
      )}
      
      {currentScreen === 'combined-test' && (
        <CombinedTest onBack={handleBackToHome} />
      )}
      
      {currentScreen === 'achievements' && (
        <Achievements onBack={handleBackToHome} />
      )}
      
      
      {currentScreen === 'app-settings' && (
        <AppSettings onBack={handleBackToHome} />
      )}
      
      {currentScreen === 'time-attack' && (
        <TimeAttackMode onBack={handleBackToHome} />
      )}
      
      {currentScreen === 'simple-tower-defense' && (
        <SimpleTowerDefense onBack={handleBackToHome} />
      )}
      
      
      {currentScreen === 'category' && (
        <CategorySelection 
          onSelectCategory={handleSelectCategory} 
          onBack={handleBackToHome}
        />
      )}
      
      {currentScreen === 'difficulty' && (
        <DifficultySelection
          category={selectedCategory}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleChangeCategory}
        />
      )}
      
      {currentScreen === 'question' && questions.length > 0 && (
        <Question
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          difficulty={difficulty}
          category={selectedCategory}
          onAnswer={handleAnswer}
          onBack={handleChangeDifficulty}
        />
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
      )}
      
      {/* PWA Components */}
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </div>
  );
}