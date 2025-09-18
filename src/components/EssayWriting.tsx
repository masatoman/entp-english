import {
  ArrowLeft,
  BookOpen,
  FileText,
  History,
  Lightbulb,
  PenTool,
  Share2,
  Star,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEssayPromptsForLevel,
  getRecommendedPromptsForGrammar,
  getRecommendedPromptsForVocabulary,
} from "../data/essayPrompts";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { EssayPrompt, EssaySubmission } from "../types/essay";
import { DataManager } from "../utils/dataManager";
import { EssayHistoryManager } from "../utils/essayHistoryManager";
import { EssayShareManager } from "../utils/essayShareManager";
import { GachaSystem } from "../utils/gachaSystem";
import { getLevelManager } from "../utils/levelManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";
import { Textarea } from "./ui/textarea";

export default function EssayWriting() {
  const navigate = useNavigate();
  useScrollToTop();

  // 状態管理
  const [selectedPrompt, setSelectedPrompt] = useState<EssayPrompt | null>(
    null
  );
  const [essayText, setEssayText] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedEssayId, setSavedEssayId] = useState<string | null>(null);
  const [selfAssessment] = useState({
    difficulty: 3,
    satisfaction: 3,
    grammarConfidence: 3,
    vocabularyUsage: 3,
  });

  // ユーザーデータ取得
  const levelManager = getLevelManager();
  const userLevelData = levelManager.getLevel();
  const userLevel =
    typeof userLevelData === "object"
      ? userLevelData.level || 1
      : userLevelData || 1;

  // 利用可能なプロンプト
  const availablePrompts = getEssayPromptsForLevel(userLevel);

  // 相乗効果データ取得
  const userGachaData = GachaSystem.getUserGachaData();
  const userVocabulary = userGachaData.ownedCards.map((card) => card.word);
  const preStudyProgress = DataManager.getPreStudyProgress();
  const completedGrammarCategories = ["basic-grammar", "tenses"]; // TODO: 実際の文法クイズ進捗と連携

  // 推奨プロンプト計算
  const vocabularyRecommendations =
    getRecommendedPromptsForVocabulary(userVocabulary);
  const grammarRecommendations = getRecommendedPromptsForGrammar(
    completedGrammarCategories
  );

  const recommendedPrompts = [
    ...vocabularyRecommendations.slice(0, 2),
    ...grammarRecommendations.slice(0, 2),
  ].filter(
    (prompt, index, self) => self.findIndex((p) => p.id === prompt.id) === index
  );

  // プロンプト選択
  const handlePromptSelect = (prompt: EssayPrompt) => {
    setSelectedPrompt(prompt);
    setEssayText("");
    setIsSubmitted(false);
    setShowInstructions(true);
  };

  // 英作文提出
  const handleSubmit = () => {
    if (!selectedPrompt || !essayText.trim()) return;

    const wordCount = essayText.trim().split(/\s+/).length;

    // 簡易評価システム
    const evaluation = {
      grammar: Math.min(85 + Math.random() * 15, 100),
      vocabulary: Math.min(80 + Math.random() * 20, 100),
      fluency: Math.min(75 + Math.random() * 25, 100),
      creativity: Math.min(70 + Math.random() * 30, 100),
    };

    const submission: EssaySubmission = {
      id: `essay_${Date.now()}`,
      promptId: selectedPrompt.id,
      userId: "current_user",
      text: essayText,
      submittedAt: Date.now(),
      selfAssessment,
      evaluation,
      analysis: {
        wordCount,
        grammarIssues: [], // TODO: 簡単な文法チェック
        vocabularyUsed: userVocabulary.filter((word) =>
          essayText.toLowerCase().includes(word.toLowerCase())
        ),
        suggestions: [],
        estimatedLevel: selectedPrompt.difficulty,
      },
    };

    // 履歴に保存
    const essayId = EssayHistoryManager.saveEssay(
      selectedPrompt,
      submission,
      [selectedPrompt.category, selectedPrompt.difficulty] // 基本タグ
    );
    setSavedEssayId(essayId);

    // XP獲得
    const xpGained =
      selectedPrompt.difficulty === "beginner"
        ? 15
        : selectedPrompt.difficulty === "intermediate"
        ? 25
        : 35;
    levelManager.addXP(xpGained);

    setIsSubmitted(true);
    console.log("英作文提出:", submission);
    console.log("履歴保存ID:", essayId);
  };

  // 新しい英作文を開始
  const handleNewEssay = () => {
    setSelectedPrompt(null);
    setEssayText("");
    setIsSubmitted(false);
    setShowInstructions(true);
    setSavedEssayId(null);
  };

  // シェア機能
  const handleShareEssay = async () => {
    if (!savedEssayId) return;

    const entry = EssayHistoryManager.getEssayById(savedEssayId);
    if (!entry) return;

    try {
      const success = await EssayShareManager.shareEssay(entry, {
        platform: "copy",
        includePrompt: true,
        includeStats: true,
      });

      if (success) {
        alert(
          "英作文をクリップボードにコピーしました！SNSに貼り付けてシェアしてください。"
        );
      } else {
        alert("シェアに失敗しました。");
      }
    } catch (error) {
      console.error("シェアエラー:", error);
      alert("シェアに失敗しました。");
    }
  };

  // プロンプト選択画面
  if (!selectedPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <PenTool className="w-8 h-8 text-indigo-600" />
                英作文
              </h1>
              <p className="text-gray-600 mt-1">文法と語彙を実践で活用しよう</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/learning/essay-writing/history")}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              履歴
            </Button>
          </div>

          {/* 相乗効果統計 */}
          <Card className="mb-8 p-6 bg-white shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔗 学習連携状況
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-gray-600">獲得語彙カード</div>
                <div className="font-bold text-purple-600">
                  {userGachaData.ownedCards.length}枚
                </div>
              </div>
              <div>
                <div className="text-gray-600">完了した事前学習</div>
                <div className="font-bold text-blue-600">
                  {preStudyProgress.completedContents.length}件
                </div>
              </div>
              <div>
                <div className="text-gray-600">文法カテゴリー</div>
                <div className="font-bold text-green-600">
                  {completedGrammarCategories.length}分野
                </div>
              </div>
            </div>
          </Card>

          {/* 推奨プロンプト */}
          {recommendedPrompts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                あなたにおすすめの英作文
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedPrompts.map((prompt) => (
                  <SelectionCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.instruction}
                    detail={`${prompt.category} | ${prompt.difficulty}`}
                    icon="✨"
                    difficulty={prompt.difficulty}
                    level={prompt.level}
                    color="bg-yellow-50 border-yellow-200"
                    isRecommended={true}
                    onClick={() => handlePromptSelect(prompt)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 全プロンプト一覧 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              利用可能な英作文課題
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePrompts.map((prompt) => (
                <SelectionCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  description={prompt.instruction}
                  detail={`レベル ${prompt.level} | ${prompt.promptType}`}
                  icon={
                    prompt.category === "grammar"
                      ? "📚"
                      : prompt.category === "vocabulary"
                      ? "🎯"
                      : "🔀"
                  }
                  difficulty={prompt.difficulty}
                  level={prompt.level}
                  color={
                    prompt.difficulty === "beginner"
                      ? "bg-green-50 border-green-200"
                      : prompt.difficulty === "intermediate"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-red-50 border-red-200"
                  }
                  onClick={() => handlePromptSelect(prompt)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 英作文画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleNewEssay}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            課題選択に戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedPrompt.title}
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Badge variant="outline" className="text-xs">
                {selectedPrompt.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedPrompt.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Level {selectedPrompt.level}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">文字数</div>
            <div className="text-xl font-bold text-indigo-600">
              {
                essayText
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word).length
              }
              語
            </div>
          </div>
        </div>

        {/* 指示とヒント */}
        {showInstructions && (
          <Card className="mb-6 bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-500" />
                課題の指示
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  📝 指示内容
                </h4>
                <p className="text-gray-700">{selectedPrompt.instruction}</p>
              </div>

              {selectedPrompt.context && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    🎭 場面設定
                  </h4>
                  <p className="text-gray-700">{selectedPrompt.context}</p>
                </div>
              )}

              {selectedPrompt.keyWords &&
                selectedPrompt.keyWords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      🎯 推奨語彙
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrompt.keyWords.map((word) => (
                        <Badge
                          key={word}
                          variant={
                            userVocabulary.includes(word)
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {word} {userVocabulary.includes(word) && "✓"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {selectedPrompt.grammarFocus &&
                selectedPrompt.grammarFocus.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      📚 重点文法
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrompt.grammarFocus.map((grammar) => (
                        <Badge
                          key={grammar}
                          variant="outline"
                          className="text-xs"
                        >
                          {grammar}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstructions(false)}
                className="mt-4"
              >
                指示を隠す
              </Button>
            </CardContent>
          </Card>
        )}

        {!showInstructions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstructions(true)}
            className="mb-4 flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            指示を表示
          </Button>
        )}

        {/* 英作文入力エリア */}
        {!isSubmitted && (
          <Card className="mb-6 bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-500" />
                英作文を書いてください
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="ここに英作文を入力してください..."
                className="min-h-[300px] text-base leading-relaxed"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  💡 ヒント: 推奨語彙や重点文法を意識して書いてみましょう
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!essayText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  提出する
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 提出後の表示 */}
        {isSubmitted && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Star className="w-5 h-5" />
                英作文完了！
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">あなたの英作文</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {essayText}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">文字数</div>
                  <div className="text-lg font-bold text-blue-600">
                    {
                      essayText
                        .trim()
                        .split(/\s+/)
                        .filter((word) => word).length
                    }
                    語
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">獲得XP</div>
                  <div className="text-lg font-bold text-purple-600">
                    +
                    {selectedPrompt.difficulty === "beginner"
                      ? 15
                      : selectedPrompt.difficulty === "intermediate"
                      ? 25
                      : 35}
                    XP
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleNewEssay} variant="outline">
                  新しい課題に挑戦
                </Button>
                <Button
                  onClick={handleShareEssay}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!savedEssayId}
                >
                  <Share2 className="w-4 h-4" />
                  シェア
                </Button>
                <Button
                  onClick={() => navigate("/learning/essay-writing/history")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  履歴
                </Button>
                <Button
                  onClick={() => navigate("/learning/grammar/category")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  文法クイズで復習
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* サンプル解答（提出後のみ表示） */}
        {isSubmitted && selectedPrompt.sampleAnswers.length > 0 && (
          <Card className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                参考解答例
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPrompt.sampleAnswers.map((sample, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {sample.level}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3 italic">"{sample.text}"</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {sample.explanation}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {sample.grammarPoints.map((point, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
