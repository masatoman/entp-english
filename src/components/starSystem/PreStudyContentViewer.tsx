import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Lightbulb,
  Star,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { preStudyContents } from "../../data/preStudyContents";
import { getLevelManager, saveLevelManager } from "../../utils/levelManager";
import { PreStudyProgressManager } from "../../utils/preStudyProgressManager";
import { contentTagManager } from "../../utils/contentTagManager";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecommendedContentSelector from "../RecommendedContentSelector";

// Router対応のため、PropsInterfaceは不要

function PreStudyContentViewer() {
  // Router対応 - useParamsでcontentIdを取得
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [comprehensionRating, setComprehensionRating] = useState<number>(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [levelManager] = useState(() => getLevelManager());
  const [toeicAnswers, setToeicAnswers] = useState<Record<number, number>>({});
  const [showToeicResults, setShowToeicResults] = useState(false);

  // contentIdからcontentを取得
  const content = preStudyContents.find((c) => c.id === contentId);

  // コンテンツが見つからない場合はホームに戻る
  if (!content) {
    navigate("/");
    return null;
  }

  // スタミナ消費（コンテンツ表示時に1回のみ）
  useEffect(() => {
    const starSystem = levelManager.getStarSystem();
    if (starSystem.current <= 0) {
      alert("スタミナが不足しています。回復を待ってから再試行してください。");
      navigate("/learning/pre-study/menu");
      return;
    }

    // スタミナを消費
    levelManager.consumeStar();
    saveLevelManager();
  }, [contentId]); // contentIdが変わった時のみ実行

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleFinalComplete = () => {
    if (comprehensionRating > 0) {
      // 事前学習完了をマーク
      if (contentId) {
        PreStudyProgressManager.markContentAsCompleted(contentId);

        // TOEIC解答結果も保存
        if (Object.keys(toeicAnswers).length > 0) {
          PreStudyProgressManager.saveToeicAnswers(contentId, toeicAnswers);
        }
      }

      navigate("/learning/pre-study/menu");
    }
  };

  const handleNavigateToPractice = () => {
    // 理解度評価が0の場合は3（普通）として扱う
    const finalRating = comprehensionRating > 0 ? comprehensionRating : 3;
    
    // 学習進捗保存処理
    if (contentId) {
      PreStudyProgressManager.markContentAsCompleted(contentId);
    }
    
    // タグベースで最適な次のコンテンツを決定
    if (contentId) {
      const optimalNext = contentTagManager.getOptimalNextContent(contentId);
      if (optimalNext) {
        console.log('推奨学習コンテンツ:', optimalNext);
        navigate(optimalNext.url);
        return;
      }
    }
    
    // フォールバック: カテゴリに基づく従来の遷移（正しいルートを使用）
    if (content?.category === 'vocabulary') {
      navigate('/learning/vocabulary/difficulty');
    } else if (content?.category === 'writing') {
      navigate('/learning/essay-writing');
    } else {
      navigate('/learning/grammar/category');
    }
  };

  const handleBack = () => {
    navigate("/learning/pre-study/menu");
  };

  const handleToeicAnswer = (questionIndex: number, answerIndex: number) => {
    setToeicAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleShowToeicResults = () => {
    setShowToeicResults(true);
  };

  const renderStars = (
    rating: number,
    onRatingChange: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                学習完了！
              </CardTitle>
              <h3 className="text-lg text-gray-700">{content.title}</h3>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 学習情報 */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        推定時間: {Math.ceil(content.duration / 60)}分
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{content.category}</Badge>
                      <Badge variant="outline">Level {content.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 理解度評価 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    理解度を評価してください（任意）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    {renderStars(comprehensionRating, setComprehensionRating)}
                    <div className="text-sm text-gray-600 text-center">
                      {comprehensionRating === 0 &&
                        "評価なしでも問題演習に進めます"}
                      {comprehensionRating === 5 && "完全に理解できました！"}
                      {comprehensionRating === 4 && "ほぼ理解できました"}
                      {comprehensionRating === 3 && "何となく理解できました"}
                      {comprehensionRating === 2 && "少し理解できました"}
                      {comprehensionRating === 1 &&
                        "あまり理解できませんでした"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 推奨コンテンツ */}
              {contentId && (
                <RecommendedContentSelector
                  currentContentId={contentId}
                  maxRecommendations={4}
                  showTags={true}
                />
              )}

              {/* アクションボタン */}
              <div className="flex gap-3">
                <Button
                  onClick={handleNavigateToPractice}
                  className="flex-1"
                  size="lg"
                >
                  🎯 最適な学習へ
                </Button>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  他の学習
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          {/* ヘッダー */}
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-600" />
                  <div>
                    <CardTitle className="text-xl">{content.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Level {content.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {content.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {Math.ceil(content.duration / 60)}分
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* メインコンテンツ */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-4">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-base font-semibold text-gray-700 mb-2 mt-3">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 text-gray-700 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 text-gray-700 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="ml-2">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-blue-700">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-300 pl-4 py-2 bg-blue-50 rounded-r mb-3">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {content.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* 例文セクション */}
            {content.examples && content.examples.length > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    例文
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {content.examples.map((example, index) => (
                      <Card key={index} className="bg-white">
                        <CardContent className="p-3">
                          <div className="font-medium text-gray-900">
                            {example.english}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            {example.japanese}
                          </div>
                          {example.explanation && (
                            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {example.explanation}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TOEIC例題セクション */}
            {content.toeicExamples && content.toeicExamples.length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    TOEIC形式練習問題
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    学習した内容をTOEIC形式で実践してみましょう
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {content.toeicExamples.map((example, index) => (
                      <Card key={index} className="bg-white">
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                Part {example.part}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {example.type}
                              </Badge>
                            </div>
                            <div className="font-medium text-gray-900 mb-3">
                              問題 {index + 1}: {example.question}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {example.choices.map((choice, choiceIndex) => (
                              <label
                                key={choiceIndex}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                  toeicAnswers[index] === choiceIndex
                                    ? "bg-blue-100 border-blue-300"
                                    : "hover:bg-gray-50"
                                } border`}
                              >
                                <input
                                  type="radio"
                                  name={`toeic-${index}`}
                                  value={choiceIndex}
                                  checked={toeicAnswers[index] === choiceIndex}
                                  onChange={() =>
                                    handleToeicAnswer(index, choiceIndex)
                                  }
                                  className="text-blue-600"
                                />
                                <span className="font-medium text-sm">
                                  ({String.fromCharCode(65 + choiceIndex)})
                                </span>
                                <span>{choice}</span>
                              </label>
                            ))}
                          </div>

                          {/* 結果表示 */}
                          {showToeicResults && (
                            <div className="mt-4 p-3 rounded-lg bg-gray-50">
                              <div className="flex items-center gap-2 mb-2">
                                {toeicAnswers[index] ===
                                example.correctAnswer ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span
                                  className={`font-medium ${
                                    toeicAnswers[index] ===
                                    example.correctAnswer
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {toeicAnswers[index] === example.correctAnswer
                                    ? "正解!"
                                    : "不正解"}
                                </span>
                              </div>

                              <div className="text-sm text-gray-700 mb-2">
                                <strong>正解:</strong> (
                                {String.fromCharCode(
                                  65 + example.correctAnswer
                                )}
                                ) {example.choices[example.correctAnswer]}
                              </div>

                              <div className="text-sm text-gray-600">
                                <strong>解説:</strong> {example.explanation}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* 結果確認ボタン */}
                    {!showToeicResults &&
                      Object.keys(toeicAnswers).length ===
                        content.toeicExamples.length && (
                        <div className="flex justify-center">
                          <Button
                            onClick={handleShowToeicResults}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            解答を確認する
                          </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 完了ボタン */}
            <div className="flex justify-center">
              <Button onClick={handleComplete} size="lg" className="px-8">
                ✓ 学習完了
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PreStudyContentViewer;
