import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFoundationQuestions } from "../data/foundationQuestions";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { getLevelManager } from "../utils/levelManager";
import { questionStatsManager } from "../utils/questionStatsManager";
import { skillTreeManager } from "../utils/skillTreeManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import SkillUnlockNotification, { useSkillUnlockNotification } from "./SkillUnlockNotification";

const categoryLabels: Record<string, string> = {
  "parts-of-speech": "品詞の理解",
  "word-order": "語順の基本",
  "pronouns": "代名詞",
  "articles": "冠詞",
  "plurals": "複数形",
  "questions-negations": "疑問文・否定文",
  "prepositions": "前置詞",
  "conjunctions": "接続詞",
};

const difficultyLabels = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

export default function FoundationQuiz() {
  const navigate = useNavigate();
  const { 
    category, 
    difficulty 
  } = useParams<{
    category: string;
    difficulty: string;
  }>();

  useScrollToTop();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // スキル解放通知
  const {
    unlockedSkills,
    showNotification,
    checkForNewUnlocks,
    handleCloseNotification
  } = useSkillUnlockNotification();

  // 問題データを取得
  useEffect(() => {
    if (category && difficulty) {
      try {
        const foundationQuestions = getFoundationQuestions(
          category as any,
          difficulty as "easy" | "normal" | "hard"
        );
        
        if (foundationQuestions.length > 0) {
          setQuestions(foundationQuestions);
          setStartTime(new Date());
          console.log(`📚 基礎問題取得: ${category} ${difficulty} - ${foundationQuestions.length}問`);
        } else {
          console.warn(`⚠️ 問題が見つかりません: ${category} ${difficulty}`);
          navigate("/learning/foundation/category");
        }
      } catch (error) {
        console.error("基礎問題データの取得に失敗:", error);
        navigate("/learning/foundation/category");
      }
    }
  }, [category, difficulty, navigate]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || !startTime) return;

    const isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

    if (isCorrect) {
      setScore(score + 1);
    }

    // 統計を記録
    questionStatsManager.updateQuestionStats(
      currentQuestion.id,
      isCorrect,
      timeSpent
    );

    setShowFeedback(true);

    // 2秒後に次の問題へ
    setTimeout(() => {
      if (isLastQuestion) {
        handleQuizComplete();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
        setSelectedAnswer("");
        setUserInput("");
        setStartTime(new Date());
      }
    }, 2000);
  };

  const handleQuizComplete = () => {
    const masteryLevel = Math.round((score / questions.length) * 100);
    const timeSpent = Math.round((new Date().getTime() - (startTime?.getTime() || 0)) / 60000); // 分

    // スキルツリーの進捗を更新
    if (category) {
      skillTreeManager.updateNodeProgress(
        category,
        score,
        questions.length,
        timeSpent
      );
      
      console.log(`🎯 基礎スキル更新: ${category} - 習熟度${masteryLevel}%`);
      
      // 習熟度80%以上で解放通知
      if (masteryLevel >= 80) {
        console.log(`🔓 ${category}で習熟度80%達成！新しいスキルが解放される可能性があります。`);
      }
    }

    // XP報酬を計算
    const levelManager = getLevelManager();
    const xpReward = Math.round(score * 15 + questions.length * 3);
    levelManager.addXP(xpReward);

    setIsComplete(true);
    
    // 新しく解放されたスキルをチェック
    setTimeout(() => {
      checkForNewUnlocks();
    }, 1000);
  };

  const handleBack = () => {
    navigate(`/learning/foundation/difficulty/${category}`);
  };

  const handleSubmit = () => {
    const answer = difficulty === "easy" ? selectedAnswer : userInput;
    if (answer.trim()) {
      handleAnswer(answer);
    }
  };

  const canSubmit = difficulty === "easy" ? selectedAnswer : userInput.trim();

  if (!category || !difficulty || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">問題データを読み込み中...</div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const masteryLevel = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">🎉 学習完了！</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <p className="text-xl mb-2">
                  正解数: {score} / {questions.length}
                </p>
                <p className="text-lg text-gray-600">
                  習熟度: {masteryLevel}%
                </p>
                <Badge className="mt-2">
                  +{Math.round(score * 15 + questions.length * 3)} XP獲得！
                </Badge>
              </div>

              {/* スキルツリー進捗更新の通知 */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📈 スキルツリー更新
                </h3>
                <p className="text-sm text-blue-700">
                  {categoryLabels[category]}の習熟度が{masteryLevel}%に更新されました！
                </p>
                {masteryLevel >= 80 && (
                  <p className="text-sm text-green-700 font-semibold mt-1">
                    🔓 習熟度80%達成！新しいスキルが解放される可能性があります。
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/learning/skill-tree")}
                  className="w-full"
                >
                  スキルツリーで進捗を確認
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/learning/foundation/category")}
                  className="w-full"
                >
                  他の基礎分野を学習
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  ホームに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">基礎英語クイズ</h1>
            <div className="flex justify-center mt-2 space-x-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* 進捗表示 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              問題 {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div className="text-sm font-medium">スコア: {score}</div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>

        {/* 問題表示 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {currentQuestion?.japanese}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showFeedback ? (
              <div className="space-y-4">
                {difficulty === "easy" ? (
                  // 4択問題
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion?.choices?.map((choice: string, index: number) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === choice ? "default" : "outline"}
                        onClick={() => setSelectedAnswer(choice)}
                        className="p-4 text-left justify-start h-auto"
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                ) : (
                  // 記述問題
                  <div className="space-y-4">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="英文を入力してください..."
                      className="min-h-[100px]"
                    />
                    {difficulty === "normal" && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-700">
                          💡 ヒント: {currentQuestion?.explanation?.split('：')[0] || '文法ルールを思い出してください'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    size="lg"
                    className="px-8"
                  >
                    回答する
                  </Button>
                </div>
              </div>
            ) : (
              // フィードバック表示
              <div className="text-center space-y-4">
                <div className={`text-2xl font-bold ${
                  selectedAnswer === currentQuestion.correctAnswer || 
                  userInput.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer || 
                   userInput.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                    ? "正解！" 
                    : "不正解"}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold mb-2">正解:</p>
                  <p className="text-lg">{currentQuestion.correctAnswer}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold mb-2">解説:</p>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </div>

                <Button
                  onClick={() => {
                    if (isLastQuestion) {
                      handleQuizComplete();
                    } else {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setShowFeedback(false);
                      setSelectedAnswer("");
                      setUserInput("");
                      setStartTime(new Date());
                    }
                  }}
                  size="lg"
                  className="mt-4"
                >
                  {isLastQuestion ? "結果を見る" : "次の問題へ"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* スキル解放通知 */}
      {showNotification && unlockedSkills.length > 0 && (
        <SkillUnlockNotification
          unlockedSkills={unlockedSkills}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}
