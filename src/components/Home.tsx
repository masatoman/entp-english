import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { SelectionCard } from "./ui/selection-card";

export default function Home() {
  const navigate = useNavigate();

  const handleStartLearning = (type: string) => {
    switch (type) {
      case "grammar":
        navigate("/learning/grammar/category");
        break;
      case "vocabulary":
        navigate("/learning/vocabulary/difficulty");
        break;
      case "listening":
        navigate("/listening");
        break;
      case "writing":
        navigate("/learning/essay-writing");
        break;
      case "combined":
        navigate("/learning/combined-test");
        break;
      case "timeattack":
        navigate("/learning/time-attack");
        break;
      case "gacha":
        navigate("/games/gacha");
        break;
      case "achievements":
        navigate("/progress/achievements");
        break;
      case "skill-tree":
        navigate("/learning/skill-tree");
        break;
      case "synergy":
        navigate("/learning/synergy");
        break;
      case "toeic-mock":
        navigate("/toeic/mock-test");
        break;
      case "toeic-dashboard":
        navigate("/toeic/dashboard");
        break;
      case "learning-path":
        navigate("/learning-path-challenges");
        break;
      case "pre-study":
        navigate("/learning/pre-study/menu");
        break;
      case "integrated":
        navigate("/learning/integrated/intermediate/toeic/mixed");
        break;
      case "analytics":
        navigate("/analytics/detailed");
        break;
      case "feedback":
        navigate("/feedback");
        break;
      case "settings":
        navigate("/settings/app");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* タイトル */}
        <div className="text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ENTP英語学習アプリ
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            あなたの英語学習をサポートします
          </p>
        </div>

        {/* 学習モード選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 文法クイズ */}
          <SelectionCard
            id="grammar-quiz"
            title="文法クイズ"
            description="9つのカテゴリーから文法問題に挑戦"
            icon="✏️"
            difficulty="文法"
            detail="基本学習"
            onClick={() => handleStartLearning("grammar")}
          />

          {/* 語彙学習 */}
          <SelectionCard
            id="vocabulary"
            title="語彙学習"
            description="レベル別・カテゴリー別の単語学習"
            icon="📚"
            difficulty="語彙"
            detail="基本学習"
            onClick={() => handleStartLearning("vocabulary")}
          />

          {/* リスニング学習 */}
          <SelectionCard
            id="listening"
            title="リスニング学習"
            description="TOEIC形式のリスニング問題で耳を鍛える"
            icon="🎧"
            difficulty="リスニング"
            detail="基本学習"
            onClick={() => handleStartLearning("listening")}
          />

          {/* TOEIC単語ガチャ */}
          <SelectionCard
            id="gacha"
            title="TOEIC単語ガチャ"
            description="新しい単語をゲット！レアカードを集めよう"
            icon="🎁"
            difficulty="ガチャ"
            detail="XP消費"
            onClick={() => handleStartLearning("gacha")}
          />

          {/* 事前学習 */}
          <SelectionCard
            id="pre-study"
            title="事前学習"
            description="理論を理解してから実践へ"
            icon="⭐️"
            difficulty="理論"
            detail="準備学習"
            onClick={() => handleStartLearning("pre-study")}
          />

          {/* スキルツリー */}
          <SelectionCard
            id="skill-tree"
            title="スキルツリー"
            description="英語学習の全体マップと進捗確認"
            icon="🌳"
            difficulty="進捗"
            detail="体力不要"
            onClick={() => handleStartLearning("skill-tree")}
          />

          {/* シナジー効果 */}
          <SelectionCard
            id="synergy-effect"
            title="シナジー効果"
            description="学習の相乗効果を最大化して効率アップ"
            icon="🧠"
            difficulty="相乗効果"
            detail="学習効果向上"
            onClick={() => handleStartLearning("synergy")}
          />

          {/* TOEIC模擬テスト */}
          <SelectionCard
            id="toeic-mock-test"
            title="TOEIC模擬テスト"
            description="本格的なTOEIC形式の模擬テストに挑戦"
            icon="📊"
            difficulty="模擬テスト"
            detail="本格テスト"
            onClick={() => handleStartLearning("toeic-mock")}
          />

          {/* TOEIC統合ダッシュボード */}
          <SelectionCard
            id="toeic-dashboard"
            title="TOEIC統合ダッシュボード"
            description="全システムの進捗とシナジー効果を確認"
            icon="📈"
            difficulty="統合分析"
            detail="全機能統合"
            onClick={() => handleStartLearning("toeic-dashboard")}
          />

          {/* 学習パスチャレンジ */}
          <SelectionCard
            id="learning-path-challenges"
            title="学習パスチャレンジ"
            description="最適な学習パスに基づく段階的チャレンジ"
            icon="🎯"
            difficulty="チャレンジ"
            detail="段階的学習"
            onClick={() => handleStartLearning("learning-path")}
          />

          {/* 統合学習 */}
          <SelectionCard
            id="integrated"
            title="統合学習"
            description="単語と問題を組み合わせた効率的学習"
            icon="🧠"
            difficulty="統合"
            detail="効率学習"
            onClick={() => handleStartLearning("integrated")}
          />

          {/* 総合テスト */}
          <SelectionCard
            id="combined-test"
            title="総合テスト"
            description="全分野から出題される総合テスト"
            icon="🎯"
            difficulty="総合"
            detail="総合テスト"
            onClick={() => handleStartLearning("combined")}
          />

          {/* タイムアタック */}
          <SelectionCard
            id="time-attack"
            title="タイムアタック"
            description="制限時間内で問題を解くスピード重視モード"
            icon="⏰"
            difficulty="スピード"
            detail="スピードテスト"
            onClick={() => handleStartLearning("timeattack")}
          />

          {/* 英作文 */}
          <SelectionCard
            id="essay"
            title="英作文"
            description="文法・語彙を実践で活用する英作文課題"
            icon="✍️"
            difficulty="ライティング"
            detail="実践学習"
            onClick={() => handleStartLearning("writing")}
          />

          {/* 実績 */}
          <SelectionCard
            id="achievements"
            title="実績"
            description="学習の進捗とアチーブメントを確認"
            icon="🏆"
            difficulty="進捗"
            detail="体力不要"
            onClick={() => handleStartLearning("achievements")}
          />

          {/* 詳細学習分析 */}
          <SelectionCard
            id="analytics"
            title="詳細学習分析"
            description="学習データの詳細分析とレポート"
            icon="📊"
            difficulty="分析"
            detail="データ分析"
            onClick={() => handleStartLearning("analytics")}
          />

          {/* フィードバック */}
          <SelectionCard
            id="feedback"
            title="フィードバック"
            description="学習フィードバックとアプリ改善提案"
            icon="💬"
            difficulty="フィードバック"
            detail="意見・提案"
            onClick={() => handleStartLearning("feedback")}
          />

          {/* 設定 */}
          <SelectionCard
            id="settings"
            title="アプリ設定"
            description="アプリケーションの設定とカスタマイズ"
            icon="⚙️"
            difficulty="設定"
            detail="カスタマイズ"
            onClick={() => handleStartLearning("settings")}
          />
        </div>

        {/* フィードバックボタン */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => handleStartLearning("feedback")}
            className="flex items-center space-x-2"
          >
            <span>学習フィードバック</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStartLearning("analytics")}
            className="flex items-center space-x-2"
          >
            <span>学習分析</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
