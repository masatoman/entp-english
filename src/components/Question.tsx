import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGrammarQuizQuestions } from "../data/grammarQuizCategorized";
import { getQuestions } from "../data/questions";
import { sentencePatternQuestions } from "../data/sentencePatternQuestions";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { baseColors } from "../styles/colors";
import { Category } from "../types";
import { AdrenalineEventData } from "../types/adrenalineSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { DailyChallengeManager } from "../utils/dailyChallengeManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { questionStatsManager } from "../utils/questionStatsManager";
import { skillTreeManager } from "../utils/skillTreeManager";
import AdrenalineEffects, {
  calculateAdrenalineXP,
  triggerAdrenalineEvent,
} from "./AdrenalineEffects";
import TreasureBoxResultModal from "./TreasureBoxResultModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";

export interface QuestionData {
  id: number;
  japanese: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  choices?: string[];
}

const categoryLabels: Record<Category, string> = {
  "basic-grammar": "基本文型",
  tenses: "時制",
  modals: "助動詞",
  passive: "受動態",
  relative: "関係詞",
  subjunctive: "仮定法",
  comparison: "比較",
  participle: "分詞・動名詞",
  infinitive: "不定詞",
};

const difficultyLabels = {
  easy: "簡単",
  normal: "普通",
  hard: "難しい",
};

export default function Question() {
  const navigate = useNavigate();
  const {
    category: urlCategory,
    difficulty: urlDifficulty,
    questionId: urlQuestionId,
    setId: urlSetId,
    pattern: urlPattern,
  } = useParams<{
    category: string;
    difficulty: string;
    questionId?: string;
    setId?: string;
    pattern?: string;
  }>();

  useScrollToTop();

  // URL パラメータの型変換とバリデーション
  const category = urlCategory as Category;
  const difficulty = urlDifficulty as "easy" | "normal" | "hard";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  // アドレナリンシステム
  const [adrenalineEvents, setAdrenalineEvents] = useState<
    AdrenalineEventData[]
  >([]);
  const [showTreasureBoxModal, setShowTreasureBoxModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Array<{ questionId: number; answer: string; isCorrect: boolean }>
  >([]);

  // スキルツリー進捗更新関数
  const updateSkillTreeProgress = () => {
    if (!category || !difficulty) return;

    const masteryLevel = Math.round((score / questions.length) * 100);
    const timeSpent = Math.round(
      (new Date().getTime() - (startTime?.getTime() || 0)) / 60000
    ); // 分

    // カテゴリーに応じたスキルノードIDを決定
    let skillNodeId = "";

    if (category === "basic-grammar" && urlPattern) {
      // 基本文型の場合
      skillNodeId = `${urlPattern}-basic`;
    } else {
      // その他のカテゴリー
      const categoryMapping: Record<string, string> = {
        tenses: "tenses-present", // 時制は現在時制ノードに統合
        modals: "modals-basic",
        passive: "passive-basic",
        relative: "relative-basic",
        subjunctive: "subjunctive-basic",
        comparison: "comparison-basic",
        participle: "participle-basic",
        infinitive: "infinitive-basic",
      };
      skillNodeId = categoryMapping[category] || category;
    }

    // スキルツリーの進捗を更新
    if (skillNodeId) {
      skillTreeManager.updateNodeProgress(
        skillNodeId,
        score,
        questions.length,
        timeSpent
      );

      console.log(
        `🎯 スキルツリー更新: ${skillNodeId} - 習熟度${masteryLevel}%`
      );
    }
  };

  // 問題データを取得
  useEffect(() => {
    if (category && difficulty) {
      // ハートを消費して学習を開始
      const levelManager = getLevelManager();
      if (!levelManager.consumeHeart()) {
        alert("体力が不足しています。回復を待ってから再試行してください。");
        navigate("/");
        return;
      }
      saveLevelManager();

      try {
        let standardQuestions;

        // 基本文型の場合は文型別問題を取得
        if (category === "basic-grammar" && urlPattern && urlSetId) {
          const patternKey =
            urlPattern as keyof typeof sentencePatternQuestions;
          const difficultyKey = urlSetId as "easy" | "normal" | "hard";

          if (
            sentencePatternQuestions[patternKey] &&
            sentencePatternQuestions[patternKey][difficultyKey]
          ) {
            standardQuestions =
              sentencePatternQuestions[patternKey][difficultyKey];
            console.log(
              `📝 文型別問題取得: ${patternKey.toUpperCase()} ${difficultyKey} - ${
                standardQuestions.length
              }問`
            );
          } else {
            // フォールバック: 標準問題を取得
            standardQuestions = getQuestions(category, difficulty);
            console.log(
              `⚠️ フォールバック: 標準問題 ${standardQuestions.length}問`
            );
          }
        } else {
          // 標準問題を取得
          standardQuestions = getQuestions(category, difficulty);
        }

        // 事前学習由来の問題も取得（時制カテゴリの場合）
        let allQuestions = standardQuestions;
        if (category === "tenses") {
          const levelMapping = {
            easy: "beginner" as const,
            normal: "intermediate" as const,
            hard: "advanced" as const,
          };

          const grammarQuestions = getGrammarQuizQuestions(
            levelMapping[difficulty],
            "tenses"
          );

          // 事前学習由来の問題を標準問題形式に変換
          const preStudyQuestions = grammarQuestions
            .filter((q) => q.source === "prestudy")
            .map((q) => ({
              id: q.id,
              japanese: q.sentence,
              correctAnswer: q.blanks[0]?.correctAnswer || "",
              explanation: q.explanation,
              choices: q.options,
            }));

          // 事前学習問題を先頭に配置して確実に出題されるようにする
          allQuestions = [...preStudyQuestions, ...standardQuestions];

          console.log(
            `📚 時制問題統合: 標準${standardQuestions.length}問 + 事前学習${preStudyQuestions.length}問`
          );
        }

        // 特定の問題IDが指定されている場合、その問題のみを表示
        if (urlQuestionId) {
          const specificQuestion = allQuestions.find(
            (q) => q.id === parseInt(urlQuestionId)
          );
          if (specificQuestion) {
            setQuestions([specificQuestion]);
            setCurrentQuestionIndex(0);
          } else {
            console.error("Question not found:", urlQuestionId);
            setQuestions([]);
          }
        } else if (urlSetId) {
          // 問題集が指定されている場合、問題集に応じた問題数を制限
          const questionCount = urlSetId === "comprehensive" ? 10 : 5;
          setQuestions(allQuestions.slice(0, questionCount));
        } else {
          setQuestions(allQuestions);
        }

        // 問題開始時間を記録
        setStartTime(new Date());
      } catch (error) {
        console.error("問題データの取得に失敗:", error);
        navigate("/learning/grammar/category");
      }
    }
  }, [category, difficulty, urlQuestionId, urlSetId, urlPattern, navigate]);

  if (!category || !difficulty || questions.length === 0) {
    return (
      <div
        className="min-h-screen p-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              問題を読み込んでいます...
            </h2>
            <Button onClick={() => navigate("/learning/grammar/category")}>
              カテゴリー選択に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setCurrentAnswer(answer);
    setShowExplanation(true);

    if (correct) {
      setScore(score + 1);
    }

    // スタミナ消費（問題に回答するたびに1消費）
    const levelManager = getLevelManager();
    if (levelManager.consumeStar()) {
      console.log("⭐ スタミナを1消費しました");
    } else {
      console.log("⭐ スタミナが不足しています");
    }

    // 回答履歴を記録
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        answer: answer,
        isCorrect: correct,
      },
    ]);

    // アドレナリンシステム処理
    const isCritical = Math.random() < 0.05; // 5%でクリティカル
    const events = triggerAdrenalineEvent(correct, isCritical);
    setAdrenalineEvents(events);

    // アドレナリン効果を適用したXP計算
    const baseXP = correct ? 10 : 0;
    const { finalXP, multiplier, breakdown } = calculateAdrenalineXP(
      baseXP,
      isCritical
    );
    setEarnedXP(finalXP);

    console.log("🚀 アドレナリン効果:", {
      baseXP,
      finalXP,
      multiplier,
      breakdown,
      events: events.map((e) => e.message),
    });

    // 統計を記録
    const timeSpent = startTime
      ? Math.round((new Date().getTime() - startTime.getTime()) / 1000)
      : undefined;
    questionStatsManager.updateQuestionStats(
      currentQuestion.id,
      correct,
      timeSpent
    );

    // 宝箱獲得判定（正解時のみ、20%の確率）
    if (correct && Math.random() < 0.2) {
      const box = adrenalineManager.earnTreasureBox(difficulty);
      console.log("🎁 宝箱獲得:", box);

      // 宝箱獲得イベントを発火
      window.dispatchEvent(
        new CustomEvent("treasureBoxEarned", { detail: box })
      );
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedAnswer("");
    setUserInput("");
    setCurrentAnswer("");

    // 単一問題の場合は問題一覧に戻る
    if (urlQuestionId) {
      navigate(`/learning/grammar/list/${category}/${difficulty}`);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(new Date()); // 次の問題の開始時間をリセット
    } else {
      setIsComplete(true);

      // XP獲得（アドレナリン効果適用）
      const levelManager = getLevelManager();
      const baseXP = Math.round(score * 10 + totalQuestions * 2);
      const { finalXP } = calculateAdrenalineXP(baseXP);
      levelManager.addXP(finalXP);

      console.log("🎯 最終XP獲得:", {
        baseXP,
        finalXP,
        adrenalineBonus: finalXP - baseXP,
      });

      // デイリークエスト進捗更新
      dailyQuestManager.recordGrammarQuizCompletion();

      // デイリーチャレンジ完了判定
      const challenge = DailyChallengeManager.getTodayChallenge();
      const sessionData = {
        xpEarned: finalXP,
        timeSpent: startTime
          ? Math.round((new Date().getTime() - startTime.getTime()) / 1000)
          : 0,
        questionsAnswered: totalQuestions,
        accuracy: score / totalQuestions,
        difficulty: difficulty,
      };

      console.log("🎯 デイリーチャレンジ判定:", {
        challenge: challenge.name,
        sessionData,
        rules: challenge.rules,
        canComplete: DailyChallengeManager.canCompleteChallenge(
          challenge,
          sessionData
        ),
      });

      if (DailyChallengeManager.canCompleteChallenge(challenge, sessionData)) {
        DailyChallengeManager.completeChallenge(sessionData);
        console.log("🎯 デイリーチャレンジ完了:", challenge.name);
      }

      // スキルツリーの進捗を更新
      updateSkillTreeProgress();
    }
  };

  const handleBack = () => {
    if (urlQuestionId) {
      // 特定問題から戻る場合は問題一覧へ
      navigate(`/learning/grammar/list/${category}/${difficulty}`);
    } else if (urlSetId && urlPattern) {
      // 問題集から戻る場合は問題集選択へ
      navigate(
        `/learning/grammar/sets/${category}/${urlPattern}/${difficulty}`
      );
    } else if (urlPattern) {
      // 文型が指定されている場合は難易度選択へ
      navigate(`/learning/grammar/difficulty/${category}/${urlPattern}`);
    } else {
      // 通常の場合は難易度選択へ
      navigate(`/learning/grammar/difficulty/${category}`);
    }
  };

  const handleSubmit = () => {
    const answer = difficulty === "easy" ? selectedAnswer : userInput;
    if (answer.trim()) {
      handleAnswer(answer);
    }
  };

  const canSubmit = difficulty === "easy" ? selectedAnswer : userInput.trim();

  if (isComplete) {
    // 宝箱の獲得数を取得
    const system = adrenalineManager.getSystem();
    const unopenedBoxes = system.treasureBoxes.filter((box) => !box.isOpened);
    const treasureBoxCount = unopenedBoxes.length;

    // デバッグログ
    console.log("🎁 サマリーページ - 宝箱データ:", {
      system,
      unopenedBoxes,
      treasureBoxCount,
    });

    return (
      <div
        className="min-h-screen p-4"
        style={{
          background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 結果サマリー */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">問題完了！</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <p className="text-xl mb-2">
                  正解数: {score} / {totalQuestions}
                </p>
                <p className="text-lg text-gray-600">
                  正解率: {Math.round((score / totalQuestions) * 100)}%
                </p>
                <Badge className="mt-2">
                  +{Math.round(score * 10 + totalQuestions * 2)} XP獲得！
                </Badge>
              </div>

              {/* 宝箱獲得サマリー */}
              {treasureBoxCount > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-3xl">🎁</span>
                    <h3 className="text-xl font-bold text-yellow-800">
                      宝箱を獲得しました！
                    </h3>
                  </div>
                  <p className="text-lg text-yellow-700 mb-4">
                    未開封の宝箱:{" "}
                    <span className="font-bold">{treasureBoxCount}個</span>
                  </p>
                  <Button
                    onClick={() => setShowTreasureBoxModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                    size="lg"
                  >
                    🎁 宝箱をまとめて開封する 🎁
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/learning/grammar/category")}
                  className="w-full"
                >
                  カテゴリー選択に戻る
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

          {/* 詳細な解答と解説 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                📚 解答と解説
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers?.find(
                  (a) => a.questionId === question.id
                );
                const isCorrect = userAnswer?.isCorrect || false;

                return (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-lg font-medium">
                        問題 {index + 1}
                      </span>
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? "正解" : "不正解"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <p className="text-lg font-medium text-gray-800">
                        {question.japanese}
                      </p>

                      {userAnswer && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">
                            あなたの回答：
                          </span>
                          <p className="text-gray-800 mt-1">
                            {userAnswer.answer}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="font-medium text-green-800">
                          正解：
                        </span>
                        <p className="text-green-700 mt-1">
                          {question.correctAnswer}
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-medium text-blue-800">
                          解説：
                        </span>
                        <p className="text-blue-700 mt-1">
                          {question.explanation}
                        </p>
                      </div>
                    </div>

                    {index < questions.length - 1 && (
                      <div className="border-t border-gray-200 pt-4" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${baseColors.ghostWhite} 0%, ${baseColors.periwinkle} 100%)`,
      }}
    >
      {/* アドレナリンエフェクト */}
      <AdrenalineEffects
        onEventTriggered={(event) => {
          console.log("🎆 アドレナリンイベント発動:", event.message);
        }}
      />

      {/* 宝箱結果モーダル */}
      <TreasureBoxResultModal
        isOpen={showTreasureBoxModal}
        onClose={() => setShowTreasureBoxModal(false)}
      />

      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm">
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
            <h1 className="text-2xl font-bold text-gray-800">文法クイズ</h1>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[difficulty]}
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              問題 {questionNumber} / {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-700">
              スコア: {score}
            </span>
          </div>
          <Progress
            value={(questionNumber / totalQuestions) * 100}
            className="h-2"
          />
        </div>

        {/* Question */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {currentQuestion.japanese}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {difficulty === "easy" ? (
              <div className="space-y-3">
                {currentQuestion.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === choice ? "default" : "outline"}
                    className="w-full text-left justify-start p-4 h-auto"
                    onClick={() => setSelectedAnswer(choice)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            ) : (
              <div>
                <Textarea
                  placeholder="英語で回答してください..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] mb-4"
                />
                <div className="text-sm text-gray-600 mb-4">
                  ヒント:{" "}
                  {currentQuestion.hint || "文法に注意して回答してください"}
                </div>
              </div>
            )}

            {/* 解説表示 */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  {isCorrect ? (
                    <div className="flex items-center text-green-600">
                      <span className="text-2xl mr-2">✓</span>
                      <span className="text-lg font-semibold">正解！</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <span className="text-2xl mr-2">✗</span>
                      <span className="text-lg font-semibold">不正解</span>
                    </div>
                  )}
                </div>

                {!isCorrect && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="text-sm font-medium text-green-800 mb-1">
                      正解:
                    </div>
                    <div className="text-green-700">
                      {currentQuestion.correctAnswer}
                    </div>
                  </div>
                )}

                <div className="mb-4 p-3 bg-white border rounded">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    解説:
                  </div>
                  <div className="text-blue-700 text-sm">
                    {currentQuestion.explanation}
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full">
                  {currentQuestionIndex < questions.length - 1
                    ? "次の問題"
                    : "完了"}
                </Button>
              </div>
            )}

            {!showExplanation && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full"
                >
                  回答する
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
