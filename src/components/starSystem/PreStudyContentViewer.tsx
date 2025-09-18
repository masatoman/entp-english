import {
  ArrowLeft,
  BookOpen,
  Clock,
  Lightbulb,
  Star,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { preStudyContents } from "../../data/preStudyContents";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Router対応のため、PropsInterfaceは不要

function PreStudyContentViewer() {
  // Router対応 - useParamsでcontentIdを取得
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [comprehensionRating, setComprehensionRating] = useState<number>(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // contentIdからcontentを取得
  const content = preStudyContents.find((c) => c.id === contentId);

  // コンテンツが見つからない場合はホームに戻る
  if (!content) {
    navigate("/");
    return null;
  }

  const handleComplete = () => {
    setShowCompletion(true);
  };

  const handleFinalComplete = () => {
    if (comprehensionRating > 0) {
      // 学習進捗保存処理をここに追加
      navigate("/learning/pre-study/menu");
    }
  };

  const handleNavigateToPractice = () => {
    // 理解度評価が0の場合は3（普通）として扱う
    const finalRating = comprehensionRating > 0 ? comprehensionRating : 3;
    // 学習進捗保存処理をここに追加
    // カテゴリに基づいて適切な問題演習に遷移
    if (content.category) {
      navigate(`/learning/grammar/category`);
    }
  };

  const handleBack = () => {
    navigate("/learning/pre-study/menu");
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

              {/* 実践推奨 */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <h5 className="font-semibold text-green-800">
                      関連問題で実践してみませんか？
                    </h5>
                  </div>
                  <p className="text-sm text-green-700">
                    今学んだ内容を問題演習で定着させましょう。
                  </p>
                </CardContent>
              </Card>

              {/* アクションボタン */}
              <div className="flex gap-3">
                <Button
                  onClick={handleNavigateToPractice}
                  className="flex-1"
                  size="lg"
                >
                  ♥ 問題演習へ
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content.content.replace(/\n/g, "<br>"),
                    }}
                  />
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
