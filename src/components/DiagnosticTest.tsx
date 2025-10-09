import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataManager } from "../utils/dataManager";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// 診断テスト用の問題（簡易版）
const diagnosticQuestions = [
  // 文法基礎（5問）
  {
    id: 1,
    type: "grammar",
    question: "私は毎日英語を勉強します",
    answer: "I study English every day.",
    difficulty: 1,
  },
  {
    id: 2,
    type: "grammar",
    question: "彼は昨日公園に行きました",
    answer: "He went to the park yesterday.",
    difficulty: 2,
  },
  {
    id: 3,
    type: "grammar",
    question: "もし明日雨が降ったら、家にいます",
    answer: "If it rains tomorrow, I will stay home.",
    difficulty: 3,
  },
  {
    id: 4,
    type: "grammar",
    question: "私はそこに行ったことがあります",
    answer: "I have been there.",
    difficulty: 2,
  },
  {
    id: 5,
    type: "grammar",
    question: "彼女は英語を話すことができます",
    answer: "She can speak English.",
    difficulty: 1,
  },

  // 語彙（5問）
  {
    id: 6,
    type: "vocabulary",
    question: "accomplish の意味は？",
    choices: ["達成する", "許可する", "適用する", "評価する"],
    answer: "達成する",
    difficulty: 2,
  },
  {
    id: 7,
    type: "vocabulary",
    question: "important の意味は？",
    choices: ["重要な", "不可能な", "改善する", "印象的な"],
    answer: "重要な",
    difficulty: 1,
  },
  {
    id: 8,
    type: "vocabulary",
    question: "available の意味は？",
    choices: ["利用可能な", "避けられない", "平均的な", "認識している"],
    answer: "利用可能な",
    difficulty: 2,
  },
  {
    id: 9,
    type: "vocabulary",
    question: "consider の意味は？",
    choices: ["考慮する", "続ける", "含む", "完了する"],
    answer: "考慮する",
    difficulty: 2,
  },
  {
    id: 10,
    type: "vocabulary",
    question: "beautiful の意味は？",
    choices: ["美しい", "信じる", "始める", "行動"],
    answer: "美しい",
    difficulty: 1,
  },
];

export default function DiagnosticTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const question = diagnosticQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === diagnosticQuestions.length - 1;

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    // 簡易的な正解判定
    const isCorrect =
      userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();

    if (isCorrect) {
      setScore(score + question.difficulty);
    }

    if (isLastQuestion) {
      completeTest();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
    }
  };

  const handleChoiceAnswer = (choice: string) => {
    const isCorrect = choice === question.answer;

    if (isCorrect) {
      setScore(score + question.difficulty);
    }

    if (isLastQuestion) {
      completeTest();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const completeTest = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000 / 60); // 分

    // スコアに基づいてTOEIC予測スコアを計算
    const maxScore = diagnosticQuestions.reduce(
      (sum, q) => sum + q.difficulty,
      0
    );
    const percentage = (score / maxScore) * 100;
    const predictedTOEIC = Math.round(300 + percentage * 2); // 300-500点の範囲

    // ユーザーデータに保存
    const stats = DataManager.getUserStats();
    const updatedStats = {
      ...stats,
      diagnosticCompleted: true,
      predictedTOEIC,
      diagnosticScore: score,
      diagnosticDate: Date.now(),
    };
    DataManager.saveUserStats(updatedStats);

    setIsCompleted(true);
  };

  if (isCompleted) {
    const stats = DataManager.getUserStats();
    const predictedTOEIC = stats.predictedTOEIC || 320;
    const target = 450;
    const improvement = target - predictedTOEIC;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  診断完了！
                </h1>
                <p className="text-gray-600">お疲れ様でした</p>
              </div>

              {/* 結果表示 */}
              <div className="space-y-6">
                {/* 予測TOEICスコア */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">予測TOEICスコア</p>
                  <p className="text-5xl font-bold text-blue-600 mb-2">
                    {predictedTOEIC}点
                  </p>
                  <p className="text-sm text-gray-600">現在地の把握</p>
                </div>

                {/* 3ヶ月目標 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    3ヶ月後の目標
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">現在地</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {predictedTOEIC}点
                      </p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-0" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">目標</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {target}点
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">必要な伸び：</span>
                      <span className="font-bold text-purple-600">
                        +{improvement}点
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">毎日の学習時間：</span>
                      <span className="font-bold text-green-600">9分</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">達成可能性：</span>
                      <span className="font-bold text-blue-600">90%</span>
                    </p>
                  </div>
                </div>

                {/* 学習プラン */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    1日9分の学習プラン
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">☀️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          朝の3分クイズ
                        </p>
                        <p className="text-sm text-gray-600">
                          単語5問で頭をスッキリ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍱</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          昼の1分チャレンジ
                        </p>
                        <p className="text-sm text-gray-600">
                          休憩時間に文法1問
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🌙</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          夜の2分振り返り
                        </p>
                        <p className="text-sm text-gray-600">
                          今日の復習3問で定着
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6"
                    size="lg"
                  >
                    学習を開始する
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    3ヶ月後、あなたは確実に成長しています 🚀
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8">
            {/* 進捗表示 */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>問題 {currentQuestion + 1} / 10</span>
                <span>約10分</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* 問題 */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  {question.type === "grammar" ? "文法問題" : "語彙問題"}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {question.question}
                </p>
              </div>

              {/* 選択肢（語彙問題） */}
              {"choices" in question && question.choices && (
                <div className="space-y-3">
                  {question.choices.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChoiceAnswer(choice)}
                      className="w-full justify-start text-left py-6 bg-white border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-gray-800"
                      variant="outline"
                    >
                      <span className="mr-3 font-bold text-purple-600">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {choice}
                    </Button>
                  ))}
                </div>
              )}

              {/* テキスト入力（文法問題） */}
              {question.type === "grammar" && (
                <>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAnswer()}
                    placeholder="英文を入力してください"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    ※ 大文字・小文字、句読点は気にしなくてOK
                  </p>
                  <Button
                    onClick={handleAnswer}
                    disabled={!userAnswer.trim()}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                    size="lg"
                  >
                    {isLastQuestion ? "診断完了" : "次へ"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ヒント */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800 text-center">
              💡 わからない問題は推測でOK！現在地を知ることが目的です
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

