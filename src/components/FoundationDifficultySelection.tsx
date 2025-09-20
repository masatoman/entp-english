import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

const categoryLabels: Record<string, string> = {
  "parts-of-speech": "品詞の理解",
  "word-order": "語順の基本",
  "pronouns": "代名詞",
  "articles": "冠詞",
  "plurals": "複数形",
  "questions-negations": "疑問文・否定文",
  "prepositions": "前置詞",
  "conjunctions": "接続詞",
};

const categoryDescriptions: Record<string, string> = {
  "parts-of-speech": "名詞・動詞・形容詞・副詞の基本",
  "word-order": "英語の基本語順ルール",
  "pronouns": "人称代名詞・所有代名詞の使い分け",
  "articles": "a / an / the の使い分け",
  "plurals": "可算・不可算名詞の理解",
  "questions-negations": "基本的な文の変換",
  "prepositions": "in / on / at などの使い分け",
  "conjunctions": "and / but / because の文接続",
};

export default function FoundationDifficultySelection() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const actualCategory = category || "parts-of-speech";
  
  useScrollToTop();

  const handleDifficultySelect = (difficulty: string) => {
    console.log(`Foundation ${difficulty} difficulty clicked`);
    navigate(`/learning/foundation/quiz/${actualCategory}/${difficulty}`);
  };

  const handleBack = () => {
    navigate("/learning/foundation/category");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-800">難易度選択</h1>
            <div className="flex justify-center mt-2">
              <Badge variant="outline" className="text-sm">
                {categoryLabels[actualCategory]}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {categoryDescriptions[actualCategory]}
            </p>
          </div>
          <div className="w-24" />
        </div>

        <p className="text-center text-muted-foreground mb-8">
          難易度を選択してください
        </p>

        {/* 難易度選択 */}
        <div className="space-y-4">
          <SelectionCard
            id="easy"
            title="簡単"
            description="4択問題形式"
            detail="基本的なパターンを4つの選択肢から選択します。"
            icon="⭐"
            difficulty="初級"
            color="bg-green-50 border-green-200 text-green-800"
            onClick={() => handleDifficultySelect("easy")}
          />

          <SelectionCard
            id="normal"
            title="普通"
            description="ヒント付き入力"
            detail="キーワードのヒントを参考に英文を入力します。"
            icon="⚡"
            difficulty="中級"
            color="bg-yellow-50 border-yellow-200 text-yellow-800"
            onClick={() => handleDifficultySelect("normal")}
          />

          <SelectionCard
            id="hard"
            title="難しい"
            description="ヒントなし入力"
            detail="ヒントなしで日本語を英語に翻訳します。"
            icon="👑"
            difficulty="上級"
            color="bg-red-50 border-red-200 text-red-800"
            onClick={() => handleDifficultySelect("hard")}
          />
        </div>

        {/* カテゴリー別の学習ポイント */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            📚 {categoryLabels[actualCategory]}の学習ポイント
          </h3>
          <div className="text-sm text-gray-700">
            {actualCategory === "parts-of-speech" && (
              <div className="space-y-2">
                <p>• <strong>名詞</strong>: 人・物・事の名前（student, book, happiness）</p>
                <p>• <strong>動詞</strong>: 動作・状態を表す（run, is, have）</p>
                <p>• <strong>形容詞</strong>: 名詞を修飾（beautiful, important）</p>
                <p>• <strong>副詞</strong>: 動詞・形容詞を修飾（quickly, very）</p>
              </div>
            )}
            {actualCategory === "word-order" && (
              <div className="space-y-2">
                <p>• <strong>基本語順</strong>: 主語 + 動詞 + 目的語（SVO）</p>
                <p>• <strong>修飾語の位置</strong>: 形容詞は名詞の前、副詞は動詞の後</p>
                <p>• <strong>疑問詞</strong>: 文頭に置く（What, Where, When）</p>
                <p>• <strong>時間・場所</strong>: 通常は文の最後に置く</p>
              </div>
            )}
            {actualCategory === "pronouns" && (
              <div className="space-y-2">
                <p>• <strong>人称代名詞</strong>: I/you/he/she/it/we/they</p>
                <p>• <strong>所有代名詞</strong>: my/your/his/her/its/our/their</p>
                <p>• <strong>目的格</strong>: me/you/him/her/it/us/them</p>
                <p>• <strong>疑問代名詞</strong>: who/what/which/whose</p>
              </div>
            )}
            {actualCategory === "articles" && (
              <div className="space-y-2">
                <p>• <strong>a/an</strong>: 初めて言及する可算名詞の単数形</p>
                <p>• <strong>the</strong>: 特定の物・既知の物・唯一の物</p>
                <p>• <strong>無冠詞</strong>: 不可算名詞・複数形の一般的言及</p>
                <p>• <strong>固有名詞</strong>: 通常は冠詞不要</p>
              </div>
            )}
            {actualCategory === "prepositions" && (
              <div className="space-y-2">
                <p>• <strong>時間</strong>: at(時刻), on(曜日), in(月・年)</p>
                <p>• <strong>場所</strong>: at(地点), on(表面), in(内部)</p>
                <p>• <strong>方向</strong>: to(到達点), from(起点), toward(方向)</p>
                <p>• <strong>手段</strong>: by(交通手段), with(道具・同伴)</p>
              </div>
            )}
            {/* 他のカテゴリーも同様に追加可能 */}
          </div>
        </div>
      </div>
    </div>
  );
}
