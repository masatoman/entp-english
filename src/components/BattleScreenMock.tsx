import {
  Clock,
  Crown,
  Flame,
  Heart,
  Shield,
  Star,
  Sword,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// クリーチャーの型定義
interface Creature {
  id: string;
  name: string;
  displayName: string;
  type: "basic" | "boss";
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  element: "forest" | "water" | "fire" | "lightning";
  description: string;
  rewards: {
    xp: number;
    items: string[];
  };
  image: string;
}

// プレイヤーの型定義
interface Player {
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  xp: number;
  items: string[];
}

// バトル状態の型定義
interface BattleState {
  phase: "encounter" | "battle" | "victory" | "defeat";
  currentCreature: Creature | null;
  player: Player;
  turnCount: number;
  comboCount: number;
  timeLeft: number;
  isPlayerTurn: boolean;
}

// モックデータ
const mockCreatures: Creature[] = [
  {
    id: "forest-sprite",
    name: "Forest Sprite",
    displayName: "森の精霊",
    type: "basic",
    level: 5,
    hp: 80,
    maxHp: 80,
    attack: 25,
    defense: 15,
    element: "forest",
    description: "優しい森の精霊。自然の力を操る。",
    rewards: {
      xp: 50,
      items: ["森の葉", "自然の力"],
    },
    image: "🌿",
  },
  {
    id: "water-golem",
    name: "Water Golem",
    displayName: "水のゴーレム",
    type: "boss",
    level: 8,
    hp: 150,
    maxHp: 150,
    attack: 45,
    defense: 30,
    element: "water",
    description: "洞窟の奥に住む水の守護者。強力な魔法を操る。",
    rewards: {
      xp: 200,
      items: ["水の結晶", "深層の知恵", "守護者の勲章"],
    },
    image: "💎",
  },
];

const initialPlayer: Player = {
  level: 15,
  hp: 120,
  maxHp: 120,
  mp: 80,
  maxMp: 80,
  attack: 35,
  defense: 25,
  xp: 2450,
  items: ["回復薬", "魔法の葉", "勇気の石"],
};

// エレメント別の色設定
const elementColors = {
  forest: {
    bg: "bg-gradient-to-br from-green-100 to-emerald-200",
    border: "border-green-300",
    text: "text-green-800",
    accent: "bg-green-500",
  },
  water: {
    bg: "bg-gradient-to-br from-blue-100 to-cyan-200",
    border: "border-blue-300",
    text: "text-blue-800",
    accent: "bg-blue-500",
  },
  fire: {
    bg: "bg-gradient-to-br from-red-100 to-orange-200",
    border: "border-red-300",
    text: "text-red-800",
    accent: "bg-red-500",
  },
  lightning: {
    bg: "bg-gradient-to-br from-yellow-100 to-amber-200",
    border: "border-yellow-300",
    text: "text-yellow-800",
    accent: "bg-yellow-500",
  },
};

// クリーチャーカードコンポーネント
const CreatureCard: React.FC<{
  creature: Creature;
  isActive: boolean;
}> = ({ creature, isActive }) => {
  const colors = elementColors[creature.element];

  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 ${
        isActive ? "ring-4 ring-yellow-400 ring-opacity-50" : ""
      } transition-all duration-300`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{creature.image}</span>
            <div>
              <h3 className={`text-2xl font-bold ${colors.text}`}>
                {creature.displayName}
              </h3>
              <p className={`text-sm ${colors.text} opacity-75`}>
                {creature.name} (Lv.{creature.level})
              </p>
            </div>
          </div>

          <div className="text-right">
            {creature.type === "boss" ? (
              <Badge className="bg-red-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                ボス
              </Badge>
            ) : (
              <Badge variant="secondary">通常</Badge>
            )}
          </div>
        </div>

        {/* HPバー */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={`${colors.text} font-medium`}>HP</span>
            <span className={`${colors.text} font-bold`}>
              {creature.hp}/{creature.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`${colors.accent} h-full transition-all duration-500 ease-out`}
              style={{ width: `${(creature.hp / creature.maxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* ステータス */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Sword className="w-4 h-4 text-red-600" />
              <span className={`text-sm font-bold ${colors.text}`}>
                攻撃: {creature.attack}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className={`text-sm font-bold ${colors.text}`}>
                防御: {creature.defense}
              </span>
            </div>
          </div>
        </div>

        {/* 説明 */}
        <p className={`text-sm ${colors.text} opacity-75 text-center`}>
          {creature.description}
        </p>
      </CardContent>
    </Card>
  );
};

// プレイヤーカードコンポーネント
const PlayerCard: React.FC<{
  player: Player;
  isActive: boolean;
}> = ({ player, isActive }) => {
  return (
    <Card
      className={`bg-gradient-to-br from-purple-100 to-blue-100 border-purple-300 border-2 ${
        isActive ? "ring-4 ring-purple-400 ring-opacity-50" : ""
      } transition-all duration-300`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚔️</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-800">
                ワードハンター
              </h3>
              <p className="text-sm text-purple-600">
                Lv.{player.level} - {player.xp} XP
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge className="bg-purple-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              レベル {player.level}
            </Badge>
          </div>
        </div>

        {/* HP/MPバー */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-800 font-medium">HP</span>
              <span className="text-purple-800 font-bold">
                {player.hp}/{player.maxHp}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-800 font-medium">MP</span>
              <span className="text-purple-800 font-bold">
                {player.mp}/{player.maxMp}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Sword className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-purple-800">
                攻撃: {player.attack}
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-purple-800">
                防御: {player.defense}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// バトルアクションコンポーネント
const BattleActions: React.FC<{
  onAttack: () => void;
  onDefend: () => void;
  onMagic: () => void;
  onItem: () => void;
  isPlayerTurn: boolean;
  mp: number;
}> = ({ onAttack, onDefend, onMagic, onItem, isPlayerTurn, mp }) => {
  if (!isPlayerTurn) {
    return (
      <Card className="bg-gray-100 border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 font-medium">敵のターンです...</span>
          </div>
          <p className="text-sm text-gray-500">
            クリーチャーが行動を考えています
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-100 to-blue-100 border-green-300">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          あなたのターン
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onAttack}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Sword className="w-4 h-4 mr-2" />
            攻撃
          </Button>

          <Button
            onClick={onDefend}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Shield className="w-4 h-4 mr-2" />
            防御
          </Button>

          <Button
            onClick={onMagic}
            disabled={mp < 20}
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50 font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            魔法 (20MP)
          </Button>

          <Button
            onClick={onItem}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50 font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <Heart className="w-4 h-4 mr-2" />
            アイテム
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// メインコンポーネント
const BattleScreenMock: React.FC = () => {
  const [battleState, setBattleState] = useState<BattleState>({
    phase: "battle",
    currentCreature: mockCreatures[0],
    player: initialPlayer,
    turnCount: 1,
    comboCount: 0,
    timeLeft: 30,
    isPlayerTurn: true,
  });

  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);

  // タイマー効果
  useEffect(() => {
    if (battleState.phase === "battle" && battleState.isPlayerTurn) {
      const timer = setInterval(() => {
        setBattleState((prev) => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [battleState.phase, battleState.isPlayerTurn]);

  // 攻撃アクション
  const handleAttack = () => {
    if (!battleState.currentCreature || !battleState.isPlayerTurn) return;

    const damage = Math.max(
      1,
      battleState.player.attack - battleState.currentCreature.defense
    );
    const newCreatureHp = Math.max(0, battleState.currentCreature.hp - damage);

    setBattleState((prev) => ({
      ...prev,
      currentCreature: prev.currentCreature
        ? {
            ...prev.currentCreature,
            hp: newCreatureHp,
          }
        : null,
      comboCount: prev.comboCount + 1,
      isPlayerTurn: false,
    }));

    // 勝利チェック
    if (newCreatureHp <= 0) {
      setTimeout(() => setShowVictory(true), 1000);
    } else {
      // 敵のターン
      setTimeout(() => handleEnemyTurn(), 1500);
    }
  };

  // 敵のターン
  const handleEnemyTurn = () => {
    if (!battleState.currentCreature) return;

    const damage = Math.max(
      1,
      battleState.currentCreature.attack - battleState.player.defense
    );
    const newPlayerHp = Math.max(0, battleState.player.hp - damage);

    setBattleState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        hp: newPlayerHp,
      },
      isPlayerTurn: true,
      timeLeft: 30,
    }));

    // 敗北チェック
    if (newPlayerHp <= 0) {
      setTimeout(() => setShowDefeat(true), 1000);
    }
  };

  // 防御アクション
  const handleDefend = () => {
    setBattleState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        defense: prev.player.defense + 10, // 一時的な防御力向上
      },
      isPlayerTurn: false,
    }));

    setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          defense: initialPlayer.defense, // 防御力を元に戻す
        },
        isPlayerTurn: true,
        timeLeft: 30,
      }));
    }, 2000);
  };

  // 魔法アクション
  const handleMagic = () => {
    if (battleState.player.mp < 20) return;

    const damage = battleState.player.attack * 1.5;
    const newCreatureHp = Math.max(
      0,
      (battleState.currentCreature?.hp || 0) - damage
    );

    setBattleState((prev) => ({
      ...prev,
      currentCreature: prev.currentCreature
        ? {
            ...prev.currentCreature,
            hp: newCreatureHp,
          }
        : null,
      player: {
        ...prev.player,
        mp: prev.player.mp - 20,
      },
      comboCount: prev.comboCount + 1,
      isPlayerTurn: false,
    }));

    if (newCreatureHp <= 0) {
      setTimeout(() => setShowVictory(true), 1000);
    } else {
      setTimeout(() => handleEnemyTurn(), 1500);
    }
  };

  // アイテム使用
  const handleItem = () => {
    setBattleState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        hp: Math.min(prev.player.maxHp, prev.player.hp + 30),
        mp: Math.min(prev.player.maxMp, prev.player.mp + 20),
      },
      isPlayerTurn: false,
    }));

    setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,
        isPlayerTurn: true,
        timeLeft: 30,
      }));
    }, 1500);
  };

  if (showVictory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-yellow-100 to-orange-200 border-yellow-300 border-2">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-orange-800 mb-4">勝利！</h2>
            <p className="text-lg text-orange-700 mb-6">
              {battleState.currentCreature?.displayName}を倒しました！
            </p>

            <div className="space-y-4">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <h3 className="font-bold text-orange-800 mb-2">獲得報酬</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-orange-800 font-bold">
                    +{battleState.currentCreature?.rewards.xp} XP
                  </span>
                </div>
                <div className="text-sm text-orange-700">
                  アイテム:{" "}
                  {battleState.currentCreature?.rewards.items.join(", ")}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-4">
                <Flame className="w-5 h-5 text-red-500" />
                <span className="text-orange-800 font-bold">
                  コンボ: {battleState.comboCount}連続
                </span>
              </div>

              <Button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                <Trophy className="w-4 h-4 mr-2" />
                次の戦闘へ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showDefeat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-100 to-red-200 border-red-300 border-2">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-3xl font-bold text-red-800 mb-4">敗北...</h2>
            <p className="text-lg text-red-700 mb-6">力が足りませんでした...</p>

            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              🔄 再挑戦
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ⚔️ バトル
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>ターン: {battleState.turnCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4" />
              <span>コンボ: {battleState.comboCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>残り時間: {battleState.timeLeft}秒</span>
            </div>
          </div>
        </div>

        {/* バトルフィールド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* プレイヤー */}
          <PlayerCard
            player={battleState.player}
            isActive={battleState.isPlayerTurn}
          />

          {/* クリーチャー */}
          {battleState.currentCreature && (
            <CreatureCard
              creature={battleState.currentCreature}
              isActive={!battleState.isPlayerTurn}
            />
          )}
        </div>

        {/* アクション */}
        <BattleActions
          onAttack={handleAttack}
          onDefend={handleDefend}
          onMagic={handleMagic}
          onItem={handleItem}
          isPlayerTurn={battleState.isPlayerTurn}
          mp={battleState.player.mp}
        />
      </div>
    </div>
  );
};

export default BattleScreenMock;
