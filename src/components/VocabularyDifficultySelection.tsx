import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { GachaSystem } from "../utils/gachaSystem";
import { KnownWordsManager } from "../utils/knownWordsManager";
import { VocabularyManager } from "../utils/vocabularyManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

// ルーター対応版 - propsは不要
interface LearningModeStats {
  total: number;
  known: number;
  remaining: number;
}

export default function VocabularyDifficultySelection() {
  const navigate = useNavigate();
  useScrollToTop();

  const [gachaStats, setGachaStats] = useState<LearningModeStats>({ total: 0, known: 0, remaining: 0 });
  const [basicStats, setBasicStats] = useState<LearningModeStats>({ total: 0, known: 0, remaining: 0 });

  // 2つの学習モードの統計を計算
  useEffect(() => {
    const calculateStats = () => {
      // ガチャカード専用統計
      const gachaCards = VocabularyManager.getGachaVocabularyWords();
      const unknownGachaCards = KnownWordsManager.filterUnknownWords(gachaCards);
      
      setGachaStats({
        total: gachaCards.length,
        known: gachaCards.length - unknownGachaCards.length,
        remaining: unknownGachaCards.length,
      });

      // 基本単語専用統計
      const basicWords = VocabularyManager.getStandardVocabularyWords();
      const unknownBasicWords = KnownWordsManager.filterUnknownWords(basicWords);
      
      setBasicStats({
        total: basicWords.length,
        known: basicWords.length - unknownBasicWords.length,
        remaining: unknownBasicWords.length,
      });

      console.log("語彙学習モード統計:", {
        gacha: { total: gachaCards.length, remaining: unknownGachaCards.length },
        basic: { total: basicWords.length, remaining: unknownBasicWords.length }
      });
    };

    calculateStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">語彙学習モード選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                単語学習
              </Badge>
            </div>
          </div>
          <div className="w-24" />
        </div>

        <p className="text-center text-muted-foreground mb-8">
          学習モードを選択してください
        </p>

        <div className="space-y-4">
          {/* ガチャカード専用学習 */}
          <SelectionCard
            id="gacha-cards"
            title="ガチャカード学習"
            description="ガチャで獲得したカードのみで学習"
            detail="あなたが引いたレアカードを使って効率的に学習"
            icon="🎁"
            difficulty="ガチャ限定"
            color="bg-purple-50 border-purple-200 text-purple-800"
            keyPoints={[
              `獲得カード: ${gachaStats.total}枚`,
              `未学習: ${gachaStats.remaining}枚`,
              `学習済み: ${gachaStats.known}枚`,
              "レアリティ別の高品質語彙",
            ]}
            onClick={() => navigate("/learning/vocabulary/gacha-mode")}
          />

          {/* 基本単語学習 */}
          <SelectionCard
            id="basic-words"
            title="基本単語学習"
            description="標準語彙データのみで学習"
            detail="体系的に整理された基本語彙を段階的に学習"
            icon="📚"
            difficulty="ベーシック"
            color="bg-green-50 border-green-200 text-green-800"
            keyPoints={[
              `基本語彙: ${basicStats.total}枚`,
              `未学習: ${basicStats.remaining}枚`,
              `学習済み: ${basicStats.known}枚`,
              "初級→中級→上級の体系的学習",
            ]}
            onClick={() => navigate("/learning/vocabulary/basic-mode")}
          />
        </div>

        {/* 説明セクション */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">🎯 2つの学習モード</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="text-purple-600">🎁</span>
                <div>
                  <strong>ガチャカード学習</strong>: ガチャで獲得したカードのみを使用。レアリティが高いほど高度な語彙。楽しく学習継続。
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600">📚</span>
                <div>
                  <strong>基本単語学習</strong>: 体系的に整理された標準語彙。初級から上級まで段階的に学習。確実な基礎固め。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
