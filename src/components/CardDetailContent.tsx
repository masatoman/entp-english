import {
  ArrowLeft,
  Award,
  BookOpen,
  Star,
  Target,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toeicWordCards } from "../data/toeicGachaCards";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { WordCard } from "../types/gacha";
import { SpeechSynthesisManager } from "../utils/speechSynthesis";
import { Button } from "./ui/button";
// import { baseColors } from "../styles/colors";
import { Card } from "./ui/card";

export default function CardDetailContent() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);

  // cardIdからカード情報を取得
  const card = toeicWordCards.find((c) => c.id === parseInt(cardId || "0"));

  // 音声再生ハンドラ
  const handlePlayPronunciation = async (
    text: string,
    isExample: boolean = false
  ) => {
    if (isPlaying) {
      SpeechSynthesisManager.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      if (isExample && card?.examples[0]) {
        await SpeechSynthesisManager.speakWordWithExample(
          card.word,
          card.examples[0].sentence
        );
      } else {
        await SpeechSynthesisManager.speak(text);
      }
    } catch (error) {
      console.error("音声再生エラー:", error);
      alert(
        "音声再生に失敗しました。ブラウザが音声合成をサポートしていない可能性があります。"
      );
    } finally {
      setIsPlaying(false);
    }
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              エラー: カードが見つかりません
            </h2>
            <Button onClick={() => navigate("/games/gacha")}>
              ガチャに戻る
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  // カードが変更されるたびにページトップにスクロール
  useScrollToTop([card.id]);
  const getRarityInfo = (rarity: WordCard["rarity"]) => {
    const rarityMap = {
      common: {
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-300",
        icon: Star,
        label: "コモン",
      },
      uncommon: {
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-300",
        icon: Star,
        label: "アンコモン",
      },
      rare: {
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-300",
        icon: Star,
        label: "レア",
      },
      epic: {
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        borderColor: "border-purple-300",
        icon: Star,
        label: "エピック",
      },
      legendary: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        borderColor: "border-yellow-300",
        icon: Star,
        label: "レジェンダリー",
      },
    };
    return rarityMap[rarity];
  };

  const getScoreBandColor = (scoreBand: string) => {
    const colorMap = {
      "400-500": "bg-red-100 text-red-800",
      "500-600": "bg-orange-100 text-orange-800",
      "600-700": "bg-yellow-100 text-yellow-800",
      "700-800": "bg-green-100 text-green-800",
      "800+": "bg-blue-100 text-blue-800",
    };
    return (
      colorMap[scoreBand as keyof typeof colorMap] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const rarityInfo = getRarityInfo(card.rarity);
  const RarityIcon = rarityInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="space-y-4">
          {/* カードヘッダー */}
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${rarityInfo.bgColor}`}>
                <RarityIcon className={`w-6 h-6 ${rarityInfo.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{card.word}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayPronunciation(card.word)}
                    disabled={isPlaying}
                    className="flex items-center gap-1 hover:bg-blue-50"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        isPlaying ? "animate-pulse text-blue-600" : ""
                      }`}
                    />
                    {isPlaying ? "再生中..." : "発音"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${rarityInfo.bgColor} ${rarityInfo.color}`}
                  >
                    {rarityInfo.label}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBandColor(
                      card.toeicSpecific.scoreBand
                    )}`}
                  >
                    {card.toeicSpecific.scoreBand}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 基本情報 */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              基本情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">意味</div>
                <div className="font-medium">{card.meaning}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">品詞</div>
                <div className="font-medium">{card.partOfSpeech}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">発音</div>
                <div className="font-medium flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  {card.phonetic}
                </div>
              </div>
            </div>
          </Card>

          {/* 例文 */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              例文
            </h3>
            <div className="space-y-3">
              {card.examples.slice(0, 2).map((example, index) => (
                <div key={index} className="border-l-2 border-green-200 pl-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium flex-1">{example.sentence}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayPronunciation(example.sentence)}
                      disabled={isPlaying}
                      className="flex items-center gap-1 text-green-600 hover:bg-green-50"
                    >
                      <Volume2
                        className={`w-3 h-3 ${
                          isPlaying ? "animate-pulse" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    {example.translation}
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                    {example.situation}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 組み合わせ表現 */}
          {card.combinations.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                組み合わせ表現
              </h3>
              <div className="space-y-3">
                {card.combinations.slice(0, 2).map((combo, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          combo.type === "idiom"
                            ? "bg-orange-100 text-orange-800"
                            : combo.type === "phrasal_verb"
                            ? "bg-blue-100 text-blue-800"
                            : combo.type === "collocation"
                            ? "bg-green-100 text-green-800"
                            : combo.type === "slang"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {combo.type === "idiom"
                          ? "イディオム"
                          : combo.type === "phrasal_verb"
                          ? "句動詞"
                          : combo.type === "collocation"
                          ? "コロケーション"
                          : combo.type === "slang"
                          ? "スラング"
                          : "フォーマル"}
                      </span>
                    </div>
                    <div className="font-medium mb-1">{combo.expression}</div>
                    <div className="text-gray-600 text-sm mb-1">
                      {combo.meaning}
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      {combo.example} - {combo.translation}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* よく使われるパターン */}
          {card.commonUsages.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                よく使われるパターン
              </h3>
              <div className="space-y-3">
                {card.commonUsages.slice(0, 1).map((usage, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-medium mb-1 text-blue-600">
                      {usage.pattern}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      {usage.explanation}
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      {usage.example}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TOEIC特化情報 */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              TOEIC特化情報
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">対象パート</div>
                <div className="flex flex-wrap gap-1">
                  {card.toeicSpecific.parts.map((part, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">頻出度</div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      card.toeicSpecific.frequency === "very_high"
                        ? "bg-red-100 text-red-800"
                        : card.toeicSpecific.frequency === "high"
                        ? "bg-orange-100 text-orange-800"
                        : card.toeicSpecific.frequency === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {card.toeicSpecific.frequency === "very_high"
                      ? "非常に高い"
                      : card.toeicSpecific.frequency === "high"
                      ? "高い"
                      : card.toeicSpecific.frequency === "medium"
                      ? "中程度"
                      : "低い"}
                  </div>
                </div>
                {card.toeicSpecific.synonyms.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">類義語</div>
                    <div className="flex flex-wrap gap-1">
                      {card.toeicSpecific.synonyms
                        .slice(0, 2)
                        .map((synonym, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {synonym}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">ビジネス文脈</div>
                <div className="text-sm">
                  {card.toeicSpecific.businessContext}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
