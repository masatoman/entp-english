import { ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  GrammarQuizQuestion,
  getGrammarQuizQuestions,
} from "../data/grammarQuiz";
import { baseColors } from "../styles/colors";
import { DataManager } from "../utils/dataManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { SoundManager } from "../utils/soundManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Spinner } from "./ui/Spinner";

interface GrammarQuizProps {
  onBack: () => void;
  difficulty?: "beginner" | "intermediate" | "advanced";
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
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

function DropZone({ blankId, droppedWord, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "word",
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
        ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${droppedWord ? "bg-blue-100 border-blue-400 border-solid" : ""}
        transition-all duration-200
      `}
    >
      {droppedWord || "_____"}
    </span>
  );
}

function DraggableWord({ word }: DraggableWordProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "word",
    item: { word },
    canDrag: true,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        px-4 py-2 rounded-lg border cursor-move transition-all duration-200
        bg-white border-blue-200 hover:bg-blue-50 hover:border-blue-400 shadow-sm
        ${isDragging ? "opacity-50" : ""}
        select-none
      `}
    >
      {word}
    </div>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GrammarQuiz({
  onBack,
  difficulty = "intermediate",
}: GrammarQuizProps) {
  const [questions, setQuestions] = useState<GrammarQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [droppedWords, setDroppedWords] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    // ハートを消費して学習を開始
    const levelManager = getLevelManager();
    if (!levelManager.consumeHeart()) {
      alert("体力が不足しています。回復を待ってから再試行してください。");
      onBack();
      return;
    }
    saveLevelManager();

    const allQuestions = getGrammarQuizQuestions(difficulty);
    const shuffled = shuffleArray(allQuestions);

    // 設定された問題数に制限
    const appSettings = DataManager.getAppSettings();
    const selectedQuestions = shuffled.slice(
      0,
      appSettings.grammarQuizQuestionCount
    );

    setQuestions(selectedQuestions);
  }, [difficulty]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setShuffledOptions(shuffleArray(currentQuestion.options));
      setDroppedWords({});
    }
  }, [questions, currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

  const handleDrop = (blankId: string, word: string) => {
    setDroppedWords((prev) => ({
      ...prev,
      [blankId]: word,
    }));
    // 単語をはめた時の効果音
    SoundManager.sounds.drop();
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const allBlanksCompleted = currentQuestion.blanks.every(
      (blank) => droppedWords[blank.id] && droppedWords[blank.id].trim() !== ""
    );

    if (!allBlanksCompleted) {
      return;
    }

    const correct = currentQuestion.blanks.every(
      (blank) => droppedWords[blank.id] === blank.correctAnswer
    );

    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
      SoundManager.sounds.correct();
    } else {
      SoundManager.sounds.incorrect();
    }
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // クイズ完了
      SoundManager.sounds.complete();
      alert(`クイズ完了！スコア: ${score}/${questions.length}`);
      onBack();
    }
  };

  const handleRestart = () => {
    const allQuestions = getGrammarQuizQuestions(difficulty);
    const selectedQuestions = shuffleArray(allQuestions).slice(0, 10);
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setDroppedWords({});
    setShowResult(false);
  };

  const renderSentenceWithBlanks = () => {
    if (!currentQuestion) return null;

    // 文を単語に分割し、___を特別に処理
    const words = currentQuestion.sentence.split(" ");
    let blankIndex = 0;

    return (
      <div className="text-center text-lg leading-relaxed">
        {words.map((word, index) => {
          if (word === "___") {
            const blank = currentQuestion.blanks[blankIndex];
            blankIndex++;
            return (
              <DropZone
                key={`blank-${blank.id}`}
                blankId={blank.id}
                droppedWord={droppedWords[blank.id] || null}
                onDrop={handleDrop}
              />
            );
          }
          return (
            <span key={index} className="mx-1">
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  const allBlanksCompleted = currentQuestion?.blanks.every(
    (blank) => droppedWords[blank.id] && droppedWords[blank.id].trim() !== ""
  );

  // 同じ単語を複数回使えるように、使用済み判定を削除
  // const usedWords: string[] = [];

  if (!currentQuestion) {
    return (
      <div
        className="min-h-screenflex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <Spinner size="lg" text="問題を読み込み中..." />
      </div>
    );
  }

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pt-8">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">文法クイズ</h1>
            <Button variant="ghost" onClick={handleRestart} className="p-2">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">進捗</span>
              <span className="text-sm">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Score */}
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              スコア: {score} / {questions.length}
            </Badge>
          </div>

          {/* Question Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <Badge variant="secondary" className="mx-auto w-fit text-xs mb-2">
                {currentQuestion.level === "beginner"
                  ? "初級"
                  : currentQuestion.level === "intermediate"
                  ? "中級"
                  : "上級"}
              </Badge>
              <p className="text-sm text-muted-foreground mb-4">
                空欄に適切な単語をドラッグして文を完成させてください
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sentence with blanks */}
              <div className="p-4 bg-gray-50 rounded-lg min-h-[80px] flex items-center justify-center">
                {renderSentenceWithBlanks()}
              </div>

              {/* Word options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-center">
                  単語を選んでください
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {shuffledOptions.map((word, index) => (
                    <DraggableWord key={`${word}-${index}`} word={word} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check Answer Button */}
          <Button
            onClick={handleCheckAnswer}
            disabled={!allBlanksCompleted}
            className="w-full h-12"
          >
            答え合わせ
          </Button>

          {/* Result Dialog */}
          <Dialog open={showResult} onOpenChange={setShowResult}>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle
                  className={`text-center ${
                    isCorrect ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "正解！" : "不正解"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>
                <Button onClick={handleNext} className="w-full">
                  {currentQuestionIndex + 1 < questions.length
                    ? "次の問題"
                    : "完了"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bottom padding */}
          <div className="h-8" />
        </div>
      </div>
    </DndProvider>
  );
}
