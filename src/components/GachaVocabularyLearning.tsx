import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { getLevelManager } from "../utils/levelManager";
import { VocabularyManager } from "../utils/vocabularyManager";
import { Badge } from "./ui/badge";
import { baseColors } from "../styles/colors";
import { Button } from "./ui/button";
import VocabularyCard from "./VocabularyCard";

export default function GachaVocabularyLearning() {
  const navigate = useNavigate();
  useScrollToTop();

  // 体力チェック
  const levelManager = getLevelManager();
  const heartSystem = levelManager.getHeartSystem();
  if (heartSystem.current <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-6xl">💔</div>
          <h2 className="text-2xl font-bold text-gray-800">体力不足</h2>
          <p className="text-gray-600">
            体力が回復してから再挑戦してください。
          </p>
          <Button onClick={() => navigate("/")} className="mt-4">
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  // ガチャカードのみを取得
  const gachaWords = VocabularyManager.getGachaVocabularyWords();

  // ガチャカードがない場合
  if (gachaWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="text-6xl">🎁</div>
          <h2 className="text-2xl font-bold text-gray-800">ガチャカードなし</h2>
          <p className="text-gray-600">
            まずはガチャでカードを獲得してから学習を始めましょう！
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/games/gacha")} className="w-full">
              ガチャを引く
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/learning/vocabulary/difficulty")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              ガチャカード学習
            </h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm bg-purple-100">
                🎁 ガチャ限定
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        {/* 説明 */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">
            🎁 ガチャカード専用学習
          </h3>
          <p className="text-sm text-gray-700">
            あなたがガチャで獲得したレアカードを使って学習します。
            レアリティが高いほど高度で実用的な語彙が学べます！
          </p>
          <div className="mt-3 text-xs text-purple-600">
            💡 ガチャで新しいカードを獲得すると、自動的に学習対象に追加されます
          </div>
        </div>

        {/* VocabularyCard コンポーネントを使用（ガチャカードのみ） */}
        <VocabularyCard
          difficulty="intermediate" // デフォルト難易度
          category="gacha-only" // 新しい特別カテゴリー
          isGachaMode={true} // ガチャモードフラグ
        />
      </div>
    </div>
  );
}
