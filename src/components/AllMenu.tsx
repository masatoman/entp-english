import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { getLevelManager } from "../utils/levelManager";
import { canUseStars } from "../utils/starUtils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";

export default function AllMenu() {
  const navigate = useNavigate();
  const { heartSystem } = useHeartSystem();
  const levelManager = getLevelManager();
  const starSystem = levelManager.getStarSystem();

  const canStartLearning = heartSystem.current > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ホームに戻る
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            すべての機能
          </h1>
          <p className="text-gray-600">
            詳細な学習機能・設定・分析ツール
          </p>
        </div>

        {/* 文法学習 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">文法学習</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="grammar-quiz"
              title="文法クイズ"
              description="9つのカテゴリーから選択"
              icon="✏️"
              difficulty="文法"
              detail="必要体力: 1 ♥"
              onClick={() =>
                canStartLearning && navigate("/learning/grammar/category")
              }
            />
            <SelectionCard
              id="essay"
              title="英作文"
              description="文法・語彙を実践で活用"
              icon="✍️"
              difficulty="ライティング"
              detail="必要体力: 1 ♥"
              onClick={() => {
                if (canStartLearning) {
                  if (levelManager.consumeHeart()) {
                    navigate("/learning/essay-writing");
                  } else {
                    alert("体力が不足しています。");
                  }
                }
              }}
            />
          </div>
        </div>

        {/* 語彙学習 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">語彙学習</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="vocabulary"
              title="語彙学習"
              description="レベル別・カテゴリー別"
              icon="📚"
              difficulty="語彙"
              detail="必要体力: 1 ♥"
              onClick={() =>
                canStartLearning && navigate("/learning/vocabulary/difficulty")
              }
            />
            <SelectionCard
              id="gacha"
              title="単語ガチャ"
              description="TOEIC特化カード収集"
              icon="🎁"
              difficulty="ガチャ"
              detail="XP消費"
              onClick={() => navigate("/games/gacha")}
            />
          </div>
        </div>

        {/* リスニング・TOEIC */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            リスニング・TOEIC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="listening"
              title="リスニング学習"
              description="TOEIC形式のリスニング"
              icon="🎧"
              difficulty="リスニング"
              detail="必要体力: 1 ♥"
              onClick={() => canStartLearning && navigate("/listening")}
            />
            <SelectionCard
              id="toeic-mock-test"
              title="TOEIC模擬テスト"
              description="本格的な模擬テスト"
              icon="📊"
              difficulty="模擬テスト"
              detail="本格テスト"
              onClick={() => navigate("/toeic/mock-test")}
            />
            <SelectionCard
              id="toeic-dashboard"
              title="TOEIC統合ダッシュボード"
              description="全システムの進捗確認"
              icon="📈"
              difficulty="統合分析"
              detail="全機能統合"
              onClick={() => navigate("/toeic/dashboard")}
            />
          </div>
        </div>

        {/* チャレンジ・テスト */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            チャレンジ・テスト
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="time-attack"
              title="タイムアタック"
              description="制限時間内でスピード重視"
              icon="⏰"
              difficulty="スピード"
              detail="必要体力: 1 ♥"
              onClick={() =>
                canStartLearning && navigate("/learning/time-attack")
              }
            />
            <SelectionCard
              id="combined-test"
              title="総合テスト"
              description="全分野から出題"
              icon="🎯"
              difficulty="総合"
              detail="必要体力: 1 ♥"
              onClick={() =>
                canStartLearning && navigate("/learning/combined-test")
              }
            />
            <SelectionCard
              id="learning-path-challenges"
              title="学習パスチャレンジ"
              description="段階的チャレンジ"
              icon="🎯"
              difficulty="チャレンジ"
              detail="段階的学習"
              onClick={() => navigate("/learning-path-challenges")}
            />
          </div>
        </div>

        {/* 高度な機能 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            高度な機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="integrated"
              title="統合学習"
              description="単語と問題を組み合わせ"
              icon="🧠"
              difficulty="統合"
              detail="必要体力: 1 ♥"
              onClick={() =>
                canStartLearning &&
                navigate("/learning/integrated/intermediate/toeic/mixed")
              }
            />
            <SelectionCard
              id="pre-study"
              title="事前学習"
              description="理論を理解してから実践"
              icon="⭐️"
              difficulty="理論"
              detail="必要スター: 1 ⭐️"
              onClick={() =>
                canUseStars(starSystem) && navigate("/learning/pre-study/menu")
              }
            />
            <SelectionCard
              id="skill-tree"
              title="スキルツリー"
              description="学習の全体マップ"
              icon="🌳"
              difficulty="進捗"
              detail="体力不要"
              onClick={() => navigate("/learning/skill-tree")}
            />
            <SelectionCard
              id="synergy-effect"
              title="シナジー効果"
              description="相乗効果を最大化"
              icon="🧠"
              difficulty="相乗効果"
              detail="学習効果+30-260%"
              onClick={() => navigate("/learning/synergy")}
            />
          </div>
        </div>

        {/* 分析・進捗 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            分析・進捗
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="growth-dashboard"
              title="成長ダッシュボード"
              description="学習成長を可視化"
              icon="📈"
              difficulty="分析"
              detail="体力不要"
              onClick={() => navigate("/progress/dashboard")}
            />
            <SelectionCard
              id="achievements"
              title="実績"
              description="進捗とアチーブメント"
              icon="🏆"
              difficulty="進捗"
              detail="体力不要"
              onClick={() => navigate("/progress/achievements")}
            />
            <SelectionCard
              id="detailed-analytics"
              title="詳細学習分析"
              description="個人の学習パターン分析"
              icon="📊"
              difficulty="詳細分析"
              detail="体力不要"
              onClick={() => navigate("/analytics/detailed")}
            />
            <SelectionCard
              id="insights"
              title="学習インサイト"
              description="改善提案とフィードバック"
              icon="💡"
              difficulty="インサイト"
              detail="体力不要"
              onClick={() => navigate("/progress/insights")}
            />
          </div>
        </div>

        {/* ゲーム・その他 */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            ゲーム・その他
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectionCard
              id="tower-defense"
              title="タワーディフェンス"
              description="🚧 機能改善中（近日公開）"
              icon="🎮"
              difficulty="準備中"
              detail="機能改善中"
              onClick={() => {}}
            />
            <SelectionCard
              id="app-settings"
              title="アプリ設定"
              description="通知・表示設定など"
              icon="⚙️"
              difficulty="設定"
              detail="体力不要"
              onClick={() => navigate("/settings/app")}
            />
            <SelectionCard
              id="feedback"
              title="フィードバック"
              description="アプリの改善要望"
              icon="💬"
              difficulty="フィードバック"
              detail="体力不要"
              onClick={() => navigate("/feedback")}
            />
          </div>
        </div>

        {/* 体力不足の警告 */}
        {!canStartLearning && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-center text-sm text-yellow-800">
                💡 体力が不足している場合、体力不要の機能（ガチャ・分析・設定等）をご利用ください
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

