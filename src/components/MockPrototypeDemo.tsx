import {
  Eye,
  Gamepad2,
  MapPin,
  Play,
  Sparkles,
  Sword,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// モックページの型定義
interface MockPage {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
  icon: React.ReactNode;
  features: string[];
  targetExperience: string;
  status: "ready" | "demo" | "comingSoon";
}

// モックページのインポート
import BattleScreenMock from "./BattleScreenMock";
import ResultScreenMock from "./ResultScreenMock";
import WorldMapMock from "./WorldMapMock";

// モックページの定義
const mockPages: MockPage[] = [
  {
    id: "world-map",
    name: "ワールドマップ",
    description: "魔法の世界「ワードリア」を探索する冒険の出発点",
    component: WorldMapMock,
    icon: <MapPin className="w-6 h-6" />,
    features: [
      "4つのエリア（グリーン・ブルー・レッド・ゴールド）",
      "進捗の可視化とロック状態管理",
      "TOEICスコア別の難易度設定",
      "獲得報酬と実績の表示",
      "冒険者統計の表示",
    ],
    targetExperience: "ワクワクする冒険の始まり",
    status: "ready",
  },
  {
    id: "battle-screen",
    name: "バトル画面",
    description: "クリーチャーとの戦闘で英語力を鍛える",
    component: BattleScreenMock,
    icon: <Sword className="w-6 h-6" />,
    features: [
      "リアルタイムバトルシステム",
      "ターン制戦闘（攻撃・防御・魔法・アイテム）",
      "HP/MPシステムとコンボ機能",
      "タイマーによる緊張感の演出",
      "勝利・敗北の分岐とアニメーション",
    ],
    targetExperience: "アドレナリンドバドバの戦闘",
    status: "ready",
  },
  {
    id: "result-screen",
    name: "結果画面",
    description: "戦闘結果と獲得報酬を華やかに表示",
    component: ResultScreenMock,
    icon: <Trophy className="w-6 h-6" />,
    features: [
      "アニメーション付きスコア表示",
      "詳細統計（時間・コンボ・正確性）",
      "実績システム（レアリティ別）",
      "獲得報酬の表示",
      "レベルアップ演出",
    ],
    targetExperience: "達成感と成長実感",
    status: "ready",
  },
];

// ステータス別の色設定
const statusColors = {
  ready: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-800",
    badge: "bg-green-500",
  },
  demo: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    badge: "bg-blue-500",
  },
  comingSoon: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-800",
    badge: "bg-gray-500",
  },
};

// モックページカードコンポーネント
const MockPageCard: React.FC<{
  mockPage: MockPage;
  onView: () => void;
  onDemo: () => void;
}> = ({ mockPage, onView, onDemo }) => {
  const colors = statusColors[mockPage.status];

  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-300`}
    >
      <CardContent className="p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colors.badge} text-white`}>
              {mockPage.icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {mockPage.name}
              </h3>
              <p className={`text-sm ${colors.text} opacity-75`}>
                {mockPage.description}
              </p>
            </div>
          </div>

          <Badge className={`${colors.badge} text-white`}>
            {mockPage.status === "ready"
              ? "準備完了"
              : mockPage.status === "demo"
              ? "デモ可能"
              : "準備中"}
          </Badge>
        </div>

        {/* ターゲット体験 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className={`text-sm font-bold ${colors.text}`}>
              ターゲット体験
            </span>
          </div>
          <p className={`text-sm ${colors.text} opacity-75`}>
            {mockPage.targetExperience}
          </p>
        </div>

        {/* 機能一覧 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className={`text-sm font-bold ${colors.text}`}>主要機能</span>
          </div>
          <ul className="space-y-1">
            {mockPage.features.map((feature, index) => (
              <li
                key={index}
                className={`text-xs ${colors.text} opacity-75 flex items-start space-x-2`}
              >
                <span className="text-green-600 mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* アクションボタン */}
        <div className="flex space-x-2">
          <Button
            onClick={onView}
            variant="outline"
            size="sm"
            className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <Eye className="w-4 h-4 mr-1" />
            詳細確認
          </Button>

          {mockPage.status === "ready" && (
            <Button
              onClick={onDemo}
              size="sm"
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Play className="w-4 h-4 mr-1" />
              デモ実行
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
const MockPrototypeDemo: React.FC = () => {
  const [selectedMock, setSelectedMock] = useState<MockPage | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const handleViewDetails = (mockPage: MockPage) => {
    setSelectedMock(mockPage);
    setShowDemo(false);
  };

  const handleDemo = (mockPage: MockPage) => {
    setSelectedMock(mockPage);
    setShowDemo(true);
  };

  const handleBack = () => {
    setSelectedMock(null);
    setShowDemo(false);
  };

  // モックコンポーネントが選択されている場合はそれを表示
  if (selectedMock && showDemo) {
    const MockComponent = selectedMock.component;
    return (
      <div className="relative">
        {/* 戻るボタン */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100"
        >
          ← 戻る
        </Button>

        {/* モックコンポーネント */}
        <MockComponent />
      </div>
    );
  }

  // 詳細表示
  if (selectedMock && !showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2"
            >
              ← 戻る
            </Button>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg text-white">
                {selectedMock.icon}
              </div>
              <h1 className="text-3xl font-bold text-purple-800">
                {selectedMock.name}
              </h1>
            </div>
          </div>

          {/* 詳細情報 */}
          <Card className="mb-6 bg-white border-purple-200 border-2">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 基本情報 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    基本情報
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">
                        説明
                      </h3>
                      <p className="text-gray-600">
                        {selectedMock.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">
                        ターゲット体験
                      </h3>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
                        <p className="text-purple-800 font-medium">
                          {selectedMock.targetExperience}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 機能一覧 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    主要機能
                  </h2>

                  <ul className="space-y-3">
                    {selectedMock.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => handleDemo(selectedMock)}
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  デモを実行
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // メインページ
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              モックプロトタイプ
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>

          <p className="text-xl text-gray-600 mb-4">
            「アドレナリンドバドバ」体験の検証
          </p>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 border-2 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800 font-medium">
              💡
              各モックをクリックして「勉強したる感」が完全に排除されているか、
              <br />
              本当に楽しく続けられるかを確認してください！
            </p>
          </div>
        </div>

        {/* 検証ポイント */}
        <Card className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              🎯 検証ポイント
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🚫</span>
                </div>
                <h3 className="font-bold text-blue-800 mb-1">勉強感排除</h3>
                <p className="text-sm text-blue-700">
                  「勉強」という言葉が一切出てこない
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-bold text-blue-800 mb-1">アドレナリン</h3>
                <p className="text-sm text-blue-700">
                  ワクワク・ドキドキする体験
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🎮</span>
                </div>
                <h3 className="font-bold text-blue-800 mb-1">ゲーム感</h3>
                <p className="text-sm text-blue-700">
                  純粋にゲームとして楽しめる
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <h3 className="font-bold text-blue-800 mb-1">継続性</h3>
                <p className="text-sm text-blue-700">
                  飽きずに続けたくなる仕組み
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* モックページ一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPages.map((mockPage) => (
            <MockPageCard
              key={mockPage.id}
              mockPage={mockPage}
              onView={() => handleViewDetails(mockPage)}
              onDemo={() => handleDemo(mockPage)}
            />
          ))}
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300 border-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-green-800 mb-2">
                🎉 モックプロトタイプ完成！
              </h3>
              <p className="text-green-700">
                各モックを体験して、ENTP学習者にとって本当に楽しく続けられる
                <br />
                「アドレナリンドバドバ」の英語学習体験を検証してください。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockPrototypeDemo;
