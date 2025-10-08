import {
  CheckCircle,
  Lock,
  MapPin,
  Shield,
  Star,
  Sword,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

// ゲームエリアの型定義
interface GameArea {
  id: string;
  name: string;
  displayName: string;
  theme: "green" | "blue" | "red" | "gold";
  targetScore: { min: number; max: number };
  isLocked: boolean;
  isCompleted: boolean;
  progress: number; // 0-100%
  completedCreatures: number;
  totalCreatures: number;
  defeatedBosses: number;
  conqueredDate?: string;
  description: string;
  rewards: string[];
}

// モックデータ
const mockAreas: GameArea[] = [
  {
    id: "green-zone",
    name: "グリーンゾーン",
    displayName: "初心者の森",
    theme: "green",
    targetScore: { min: 400, max: 499 },
    isLocked: false,
    isCompleted: true,
    progress: 100,
    completedCreatures: 50,
    totalCreatures: 50,
    defeatedBosses: 1,
    conqueredDate: "2025/01/15",
    description: "魔法の森に住む優しいクリーチャーたちとの出会い",
    rewards: ["森の守護者の勲章", "自然の力", "平和の魔法"],
  },
  {
    id: "blue-zone",
    name: "ブルーゾーン",
    displayName: "冒険者の洞窟",
    theme: "blue",
    targetScore: { min: 500, max: 599 },
    isLocked: false,
    isCompleted: false,
    progress: 65,
    completedCreatures: 32,
    totalCreatures: 50,
    defeatedBosses: 0,
    description: "深い洞窟の奥に潜む水のクリーチャーたち",
    rewards: ["水の守護者の勲章", "流れる知恵", "深層の洞察"],
  },
  {
    id: "red-zone",
    name: "レッドゾーン",
    displayName: "勇者の城",
    theme: "red",
    targetScore: { min: 600, max: 699 },
    isLocked: false,
    isCompleted: false,
    progress: 20,
    completedCreatures: 10,
    totalCreatures: 50,
    defeatedBosses: 0,
    description: "燃え盛る城に住む炎のクリーチャーたち",
    rewards: ["炎の守護者の勲章", "燃える情熱", "戦いの勇気"],
  },
  {
    id: "gold-zone",
    name: "ゴールドゾーン",
    displayName: "英雄の神殿",
    theme: "gold",
    targetScore: { min: 700, max: 799 },
    isLocked: true,
    isCompleted: false,
    progress: 0,
    completedCreatures: 0,
    totalCreatures: 50,
    defeatedBosses: 0,
    description: "神々が住む黄金の神殿 - 最高の試練が待つ",
    rewards: ["雷神の勲章", "神々の祝福", "究極の力"],
  },
];

// テーマ別の色設定
const themeColors = {
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-100",
    border: "border-green-200",
    accent: "bg-green-500",
    text: "text-green-800",
    icon: "text-green-600",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
    border: "border-blue-200",
    accent: "bg-blue-500",
    text: "text-blue-800",
    icon: "text-blue-600",
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 to-orange-100",
    border: "border-red-200",
    accent: "bg-red-500",
    text: "text-red-800",
    icon: "text-red-600",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-50 to-amber-100",
    border: "border-yellow-200",
    accent: "bg-gradient-to-r from-yellow-400 to-amber-500",
    text: "text-amber-800",
    icon: "text-amber-600",
  },
};

// エリアアイコン
const getAreaIcon = (theme: string) => {
  switch (theme) {
    case "green":
      return "🌱";
    case "blue":
      return "🌊";
    case "red":
      return "🔥";
    case "gold":
      return "⚡";
    default:
      return "🗺️";
  }
};

// エリアカードコンポーネント
const AreaCard: React.FC<{
  area: GameArea;
  onClick: () => void;
}> = ({ area, onClick }) => {
  const colors = themeColors[area.theme];
  const icon = getAreaIcon(area.theme);

  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className={`text-xl font-bold ${colors.text}`}>
                {area.name}
              </h3>
              <p className={`text-sm ${colors.text} opacity-75`}>
                {area.displayName}
              </p>
            </div>
          </div>

          {/* ステータスバッジ */}
          <div className="flex flex-col items-end space-y-1">
            {area.isCompleted ? (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                制圧済み
              </Badge>
            ) : area.isLocked ? (
              <Badge variant="secondary">
                <Lock className="w-3 h-3 mr-1" />
                ロック中
              </Badge>
            ) : (
              <Badge className={`${colors.accent} text-white`}>
                <Sword className="w-3 h-3 mr-1" />
                挑戦可能
              </Badge>
            )}

            <div className={`text-xs ${colors.text} opacity-75`}>
              TOEIC {area.targetScore.min}-{area.targetScore.max}点
            </div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={`${colors.text} font-medium`}>制圧進捗</span>
            <span className={`${colors.text} font-bold`}>{area.progress}%</span>
          </div>
          <div
            className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden`}
          >
            <div
              className={`${colors.accent} h-full transition-all duration-1000 ease-out`}
              style={{ width: `${area.progress}%` }}
            />
          </div>
        </div>

        {/* 詳細情報 */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className={`${colors.text} opacity-75`}>
              クリーチャー討伐
            </span>
            <span className={`${colors.text} font-bold`}>
              {area.completedCreatures}/{area.totalCreatures}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className={`${colors.text} opacity-75`}>ボス討伐</span>
            <span className={`${colors.text} font-bold`}>
              {area.defeatedBosses > 0 ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  討伐済み
                </span>
              ) : (
                <span className="text-orange-600">挑戦可能</span>
              )}
            </span>
          </div>

          {area.conqueredDate && (
            <div className="flex justify-between text-sm">
              <span className={`${colors.text} opacity-75`}>制圧日</span>
              <span className={`${colors.text} font-bold`}>
                {area.conqueredDate}
              </span>
            </div>
          )}
        </div>

        {/* 説明 */}
        <p className={`text-sm ${colors.text} opacity-75 mb-4`}>
          {area.description}
        </p>

        {/* 報酬 */}
        <div className="space-y-2">
          <h4 className={`text-sm font-bold ${colors.text}`}>獲得報酬</h4>
          <div className="flex flex-wrap gap-1">
            {area.rewards.map((reward, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`${colors.border} ${colors.text} text-xs`}
              >
                {reward}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
const WorldMapMock: React.FC = () => {
  const [_selectedArea, setSelectedArea] = useState<GameArea | null>(null);

  const handleAreaClick = (area: GameArea) => {
    if (area.isLocked) {
      alert(
        `🔒 ${area.displayName}はまだロックされています。\n\n制圧条件: レッドゾーンのボスを討伐`
      );
      return;
    }

    setSelectedArea(area);
    alert(`🗺️ ${area.displayName}に移動します！\n\n準備はできていますか？`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MapPin className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ワードリア
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">魔法の英語世界へようこそ</p>
          <p className="text-sm text-gray-500">
            エリアを選択して冒険を始めましょう！
          </p>
        </div>

        {/* プレイヤー統計 */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="text-2xl font-bold text-purple-800">
                      1
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">制圧エリア</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Sword className="w-5 h-5 text-red-600" />
                    <span className="text-2xl font-bold text-purple-800">
                      87
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">討伐クリーチャー</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-purple-800">
                      2,450
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">獲得XP</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-bold text-purple-800">
                    レベル 15
                  </span>
                </div>
                <p className="text-sm text-gray-600">ワードハンター</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* エリアグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAreas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onClick={() => handleAreaClick(area)}
            />
          ))}
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 ヒント: エリアを制圧すると新しいエリアがアンロックされます！
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMapMock;
