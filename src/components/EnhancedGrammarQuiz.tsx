import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowLeft, RotateCcw, Heart, Star } from "lucide-react";
import { GrammarQuizQuestion, getGrammarQuizQuestions } from "../data/grammarQuiz";
import { Badge } from "./ui/badge";
import { DataManager } from "../utils/dataManager";
import { SoundManager } from "../utils/soundManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { QuestionRankDisplay } from "./QuestionRankDisplay";
import { QuestionWithRank } from "../types";
import { convertQuestionToEnhanced, selectWeightedQuestion, filterQuestionsByLevel } from "../utils/questionAdapter";
import { calculateNewXP } from "../utils/newXpCalculator";

interface EnhancedGrammarQuizProps {
  onBack: () => void;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface DropZoneProps {
  blankId: string;
  droppedWord: string | null;
  onDrop: (blankId: string, word: string) => void;
}

interface DraggableWordProps {
  word: string;
}

// Detect if device supports touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function DropZone({ blankId, droppedWord, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'word',
    drop: (item: { word: string }) => onDrop(blankId, item.word),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <span
      ref={drop}
      className={`
        inline-block min-w-[80px] h-8 px-3 mx-1 border-2 border-dashed rounded-md
        flex items-center justify-center text-center
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${droppedWord ? 'bg-blue-100 border-blue-400 border-solid' : ''}
        transition-all duration-200
      `}
    >
      {droppedWord || '?'}
    </span>
  );
}

function DraggableWord({ word }: DraggableWordProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'word',
    item: { word },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={drag}
      className={`
        inline-block px-3 py-1 mx-1 mb-2 bg-blue-100 text-blue-800 rounded-md cursor-move
        hover:bg-blue-200 transition-colors duration-200
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      {word}
    </span>
  );
}

export function EnhancedGrammarQuiz({ onBack, difficulty = 'intermediate' }: EnhancedGrammarQuizProps) {
  const [questions, setQuestions] = useState<QuestionWithRank[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [levelManager] = useState(() => getLevelManager());
  const [heartSystem, setHeartSystem] = useState(levelManager.getHeartSystem());
  const [userLevel, setUserLevel] = useState(levelManager.getLevel());
  const [statusAllocation] = useState(levelManager.getStatusAllocation());

  useEffect(() => {
    // ハートを消費
    if (!levelManager.consumeHeart()) {
      alert('体力が不足しています。回復を待ってから再試行してください。');
      onBack();
      return;
    }

    // 問題を生成
    generateQuestions();
    setSessionStartTime(Date.now());
    setHeartSystem(levelManager.getHeartSystem());
    saveLevelManager();
  }, []);

  const generateQuestions = () => {
    const originalQuestions = getGrammarQuizQuestions(difficulty);
    if (!originalQuestions || originalQuestions.length === 0) {
      console.error('No grammar questions found for difficulty:', difficulty);
      return [];
    }
    const enhancedQuestions = originalQuestions.map((q, index) => 
      convertQuestionToEnhanced(q, 'basic-grammar', 'normal', userLevel.level)
    );
    
    // レベルに応じてフィルタリング
    const filteredQuestions = filterQuestionsByLevel(enhancedQuestions, userLevel.level);
    
    // ステータス配分に基づいて問題を選択
    const selectedQuestions: QuestionWithRank[] = [];
    const questionCount = 8;
    
    for (let i = 0; i < questionCount; i++) {
      const availableQuestions = filteredQuestions.filter(q => 
        !selectedQuestions.some(sq => sq.id === q.id)
      );
      
      if (availableQuestions.length > 0) {
        const selectedQuestion = selectWeightedQuestion(availableQuestions, statusAllocation);
        if (selectedQuestion) {
          selectedQuestions.push(selectedQuestion);
        }
      }
    }
    
    setQuestions(selectedQuestions);
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleDrop = (blankId: string, word: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [blankId]: word
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    
    questions.forEach(question => {
      const questionAnswers = userAnswers;
      let isCorrect = true;
      
      // 正解チェック（簡略化）
      if (question.correctAnswer) {
        // 実際の正解チェックロジックをここに実装
        isCorrect = Math.random() > 0.3; // 仮の実装
      }
      
      if (isCorrect) correctCount++;
    });
    
    setScore(correctCount);
    setShowResults(true);
    
    // XP計算とレベルアップ処理
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    const xpGained = calculateNewXP(
      questions.length > 0 ? questions.map((q, index) => ({
        questionId: q.id,
        answer: userAnswers[`blank_${index}`] || '',
        isCorrect: Math.random() > 0.3 // 仮の実装
      })) : [],
      currentQuestion?.rank || 'normal',
      true
    );
    
    const levelUpResult = levelManager.addXP(xpGained);
    setUserLevel(levelManager.getLevel());
    saveLevelManager();
    
    // 音声フィードバック
    if (levelUpResult.leveledUp) {
      SoundManager.playLevelUpSound();
    } else {
      SoundManager.playCompletionSound();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    generateQuestions();
    setSessionStartTime(Date.now());
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">クイズ結果</h1>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">
                    {heartSystem.current}/{heartSystem.max}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">
                  {score} / {questions.length}
                </div>
                <div className="text-lg text-gray-600">
                  正解率: {Math.round((score / questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">
                  獲得XP: {questions.reduce((sum, q) => sum + q.xpReward, 0)}
                </div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleRestart} className="flex items-center">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    もう一度挑戦
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ホームに戻る
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-lg text-gray-600">
                {questions.length === 0 ? '問題が見つかりませんでした' : '問題を読み込み中...'}
              </div>
              <Button onClick={onBack} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button onClick={onBack} variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800">文法クイズ</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {heartSystem.current}/{heartSystem.max}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    Level {userLevel.level}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">進捗</span>
                  <span className="text-sm text-gray-600">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">スコア: {score} / {questions.length}</span>
                  <QuestionRankDisplay
                    rank={currentQuestion.rank}
                    showXP={true}
                    question={currentQuestion}
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 問題 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">
                    {currentQuestion.question}
                  </h2>
                  <p className="text-sm text-gray-600">
                    空欄に適切な単語をドラッグして文を完成させてください
                  </p>
                </div>

                <div className="text-center text-lg">
                  {currentQuestion?.options?.map((option, index) => (
                    <span key={index}>
                      {index > 0 && ' '}
                      <DropZone
                        blankId={`blank_${index}`}
                        droppedWord={userAnswers[`blank_${index}`] || null}
                        onDrop={handleDrop}
                      />
                    </span>
                  )) || []}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">単語を選んでください</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentQuestion?.options?.map((option, index) => (
                      <DraggableWord key={index} word={option} />
                    )) || []}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ナビゲーション */}
          <div className="flex justify-center">
            <Button onClick={handleNext} size="lg">
              {currentQuestionIndex < questions.length - 1 ? '次の問題' : '答え合わせ'}
            </Button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
