import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { WordCard } from "../types/gacha";
import { Button } from "./ui/button";
// import { baseColors } from "../styles/colors";
import { GachaSystem } from "../utils/gachaSystem";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GachaCard } from "./ui/gacha-card";

export default function GachaResultScreen() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  useScrollToTop();

  // ローカルストレージから開封結果を取得
  let drawnCards: WordCard[] = [];
  let packName = "パック";
  let newlyAcquiredCards: string[] = [];

  try {
    const resultData = localStorage.getItem("gachaResult");
    if (resultData) {
      const parsed = JSON.parse(resultData);
      drawnCards = parsed.cards || [];
      packName = parsed.packName || "パック";
      console.log(
        "Gacha result loaded:",
        drawnCards.length,
        "cards from",
        packName
      );

      // 新規取得したカードのIDリストを取得
      const userGachaData = GachaSystem.getUserGachaData();
      newlyAcquiredCards = userGachaData.newlyAcquiredCards || [];
      console.log("Newly acquired cards:", newlyAcquiredCards);

      // 使用後は削除
      localStorage.removeItem("gachaResult");
    }
  } catch (error) {
    console.error("Error parsing gacha result from localStorage:", error);
  }

  if (drawnCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-red-600">
                エラー: 開封結果が見つかりません
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate("/games/gacha")}>
                ガチャに戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/games/gacha")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ガチャに戻る
          </Button>
        </div>

        {/* 開封結果タイトル */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-800 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8" />
              🎉 {packName} 開封結果 🎉
              <Sparkles className="w-8 h-8" />
            </CardTitle>
            <p className="text-lg text-yellow-700 mt-2">
              {drawnCards.length}枚の新しいカードを獲得しました！
            </p>
          </CardHeader>
        </Card>

        {/* カード表示 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">獲得したカード</CardTitle>
            <p className="text-gray-600">
              カードをクリックすると詳細情報が見れます
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {drawnCards.map((card, index) => (
                <GachaCard
                  key={`${card.id}-${index}`}
                  card={card}
                  onClick={() => navigate(`/games/gacha/card/${card.id}`)}
                  size="md"
                  showDetails={true}
                  isNew={true}
                  isAnimated={true}
                  isFavorite={false}
                  onFavoriteToggle={undefined}
                  className="hover:z-10 animate-bounce-in"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/games/gacha")}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              もう一度引く
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate("/learning/vocabulary/study/intermediate/toeic")
              }
              size="lg"
            >
              語彙学習で使用する
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} size="lg">
              ホームに戻る
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            💡 獲得したカードは語彙学習で使用できます
          </p>
        </div>
      </div>
    </div>
  );
}
