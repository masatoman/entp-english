import { ArrowLeft, CheckCircle, Clock, Lightbulb, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DailyChallengeManager } from "../utils/dailyChallengeManager";
import { DataManager } from "../utils/dataManager";
import { dailyQuestManager } from "../utils/dailyQuestManager";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";

interface CreativeWritingChallengeProps {}

export default function CreativeWritingChallenge({}: CreativeWritingChallengeProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isChallenge = searchParams.get("challenge") === "true";

  const [story, setStory] = useState("");
  const [wordsUsed, setWordsUsed] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [todayWords, setTodayWords] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    // 今日学習した単語を取得
    const today = new Date().toISOString().split("T")[0];
    const stats = DataManager.getUserStats();
    const todayStudied = stats.vocabulary?.studiedToday || [];

    // 今日学習した単語がない場合は、サンプル単語を提供
    const sampleWords = [
      "budget",
      "revenue",
      "strategy",
      "performance",
      "efficiency",
      "negotiate",
      "implement",
      "analyze",
      "develop",
      "manage",
    ];
    const wordsToUse = todayStudied.length > 0 ? todayStudied : sampleWords;

    setTodayWords(wordsToUse.slice(0, 10)); // 最大10個まで表示

    // チャレンジの場合、チャレンジ情報を取得
    if (isChallenge) {
      const todayChallenge = DailyChallengeManager.getTodayChallenge();
      if (todayChallenge.type === "creative") {
        setChallenge(todayChallenge);
      }
    }
  }, [isChallenge]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 使用された単語を検出
    const storyLower = story.toLowerCase();
    const used = todayWords.filter((word) =>
      storyLower.includes(word.toLowerCase())
    );
    setWordsUsed(used);
  }, [story, todayWords]);

  const handleSubmit = () => {
    const wordCount = story.trim().length;
    const wordsUsedCount = wordsUsed.length;

    // 基本条件チェック
    const meetsWordCount = wordCount >= 50;
    const meetsVocabRequirement = wordsUsedCount >= 5;
    const isValid = meetsWordCount && meetsVocabRequirement;

    if (!isValid) {
      alert(
        "条件を満たしていません。50文字以上で、今日学んだ単語を5個以上使用してください。"
      );
      return;
    }

    // 報酬計算
    let baseXP = 50;
    let multiplier = 1;

    if (isChallenge && challenge) {
      baseXP = challenge.bonusXP;
      multiplier = challenge.bonusMultiplier;
    }

    const finalXP = Math.round(baseXP * multiplier);

    // XPを付与
    const levelManager = getLevelManager();
    levelManager.addXP(finalXP);
    saveLevelManager();

    // チャレンジ完了を記録
    if (isChallenge) {
      DailyChallengeManager.completeChallenge({
        xpEarned: finalXP,
        timeSpent: timeElapsed,
        wordsUsed: wordsUsedCount,
        storyLength: wordCount,
      });
    }

    // 統計更新
    const currentStats = DataManager.getUserStats();
    const updatedStats = {
      ...currentStats,
      totalXP: currentStats.totalXP + finalXP,
      creativeChallengesCompleted:
        (currentStats.creativeChallengesCompleted || 0) + 1,
    };
    DataManager.saveUserStats(updatedStats);

    // デイリークエスト進捗更新
    dailyQuestManager.recordEssayCompletion();

    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-600">
                🎉 創造力テスト完了！
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {wordsUsed.length}
                  </div>
                  <div className="text-sm text-gray-600">使用単語数</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {story.length}
                  </div>
                  <div className="text-sm text-gray-600">文字数</div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">獲得XP</span>
                </div>
                <div className="text-3xl font-bold">
                  {isChallenge && challenge
                    ? `${challenge.bonusXP} × ${
                        challenge.bonusMultiplier
                      } = ${Math.round(
                        challenge.bonusXP * challenge.bonusMultiplier
                      )}`
                    : "50"}{" "}
                  XP
                </div>
                {isChallenge && (
                  <div className="text-sm opacity-90 mt-1">
                    🎯 デイリーチャレンジボーナス！
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">あなたのストーリー:</h4>
                <div className="p-3 bg-gray-50 rounded text-left text-sm">
                  {story}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">使用した今日の学習単語:</h4>
                <div className="flex flex-wrap gap-2">
                  {wordsUsed.map((word, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <Button onClick={() => navigate("/")} className="w-full">
                ホームに戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              創造力テスト
            </h1>
            {isChallenge && (
              <div className="flex items-center gap-1 text-purple-600 text-sm">
                <Star className="w-4 h-4" />
                デイリーチャレンジ
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {formatTime(timeElapsed)}
          </div>
        </div>

        {/* メインコンテンツ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ 学んだ単語でストーリーを作ろう！
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 条件表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">📝 クリア条件</h3>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        wordsUsed.length >= 5 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    今日学んだ単語を5個以上使用
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        story.length >= 50 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    英語で50文字以上のストーリー
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎁 ボーナス報酬</h3>
                <div className="text-sm">
                  <div className="font-bold text-yellow-600">
                    {isChallenge && challenge
                      ? `+${challenge.bonusXP} XP × ${challenge.bonusMultiplier}倍`
                      : "+50 XP"}
                  </div>
                  {isChallenge && (
                    <div className="text-yellow-600">
                      デイリーチャレンジボーナス
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 進捗表示 */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>使用単語数: {wordsUsed.length}/5個</span>
                <span>文字数: {story.length}/50文字</span>
              </div>
              <Progress
                value={Math.min(
                  (wordsUsed.length / 5) * 50 + (story.length / 50) * 50,
                  100
                )}
              />
            </div>

            {/* 今日の学習単語 */}
            {todayWords.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">📚 今日学習した単語</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {todayWords.map((word, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors ${
                        wordsUsed.includes(word)
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-50"
                      }`}
                      onClick={() => {
                        if (!story.toLowerCase().includes(word.toLowerCase())) {
                          setStory((prev) => prev + (prev ? " " : "") + word);
                        }
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ストーリー入力 */}
            <div>
              <h3 className="font-semibold mb-2">✍️ あなたのストーリー</h3>
              <Textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="英語で創造的なストーリーを書いてください。上の単語をクリックして使うこともできます。"
                rows={6}
                className="resize-none"
              />
            </div>

            {/* 使用単語表示 */}
            {wordsUsed.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">✅ 使用中の学習単語</h4>
                <div className="flex flex-wrap gap-2">
                  {wordsUsed.map((word, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 提出ボタン */}
            <Button
              onClick={handleSubmit}
              disabled={story.length < 50 || wordsUsed.length < 5}
              className="w-full"
              size="lg"
            >
              {story.length < 50 || wordsUsed.length < 5
                ? "条件を満たしてください"
                : "ストーリーを提出する"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
