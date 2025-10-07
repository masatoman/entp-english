import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
// import {
//   createInitialGameState,
//   updateGameState,
//   spawnEnemy,
//   placeTower,
//   selectTowerType,
//   setGameSpeed,
//   collectDropItem,
//   endGame,
//   resetProfile,
//   loadProfile,
//   addXP,
//   applyShopItemEffect
// } from '@/utils/tower-defense-data';
import type {
  GameState,
  Position,
  TowerType,
} from "@/types/simple-game";

// モック関数
const createInitialGameState = (): GameState => ({
  gameId: "tower-defense-1",
  level: 1,
  isRunning: false,
  health: 100,
  maxHealth: 100,
  lives: 3,
  money: 100,
  gold: 50,
  score: 0,
  xpEarned: 0,
  gameSpeed: 1,
  selectedTowerType: null,
  towers: [],
  enemies: [],
  dropItems: [],
  isGameOver: false,
  isPaused: false,
});

const updateGameState = (state: GameState, _deltaTime: number): GameState =>
  state;
const spawnEnemy = (state: GameState): GameState => state;
const placeTower = (
  state: GameState,
  position: Position,
  towerType: TowerType
): GameState => ({
  ...state,
  towers: [...state.towers, {
    id: Date.now().toString(),
    name: `${towerType} Tower`,
    position,
    type: towerType,
    damage: 10,
    range: 50,
    fireRate: 1000,
    lastFireTime: 0,
    level: 1,
    cost: 50,
  }],
  gold: state.gold - 20,
});
const selectTowerType = (
  state: GameState,
  towerType: TowerType
): GameState => ({
  ...state,
  selectedTowerType: towerType,
});
const setGameSpeed = (state: GameState, speed: number): GameState => ({
  ...state,
  gameSpeed: speed,
});
const collectDropItem = (state: GameState, itemId: string): GameState => ({
  ...state,
  dropItems: state.dropItems.filter((item) => item.id !== itemId),
});
const endGame = (state: GameState): void => {};
const resetProfile = (): TowerDefenseProfile => ({
  totalXP: 0,
  towerUpgrades: {},
});
const loadProfile = (): TowerDefenseProfile => ({
  totalXP: 100,
  towerUpgrades: {},
});
const addXP = (amount: number): void => {};
const applyShopItemEffect = (item: any, state: GameState): GameState => state;

export default function SimpleTowerDefense() {
  const navigate = useNavigate();
  useScrollToTop();
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [profile, setProfile] = useState<TowerDefenseProfile>(loadProfile());
  const [itemEffect, setItemEffect] = useState<{
    type:
      | "damage-boost"
      | "range-boost"
      | "speed-boost"
      | "gold-bonus"
      | "xp-bonus";
    value: number;
    isPercentage: boolean;
    rarity: "common" | "rare" | "epic" | "legendary";
  } | null>(null);

  // メモ化された計算値
  const calculatedValues = useMemo(() => {
    const healthPercentage = (gameState.health / gameState.maxHealth) * 100;
    const isGameOver = gameState.health <= 0;

    return {
      healthPercentage,
      isGameOver,
    };
  }, [gameState.health, gameState.maxHealth]);

  // メモ化されたタワーコスト
  const towerCosts = useMemo(
    () => ({
      basic: 20,
      sniper: 40,
      rapid: 30,
    }),
    []
  );

  // ゲームループ
  useEffect(() => {
    if (!gameState.isRunning) return;

    const gameLoop = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime;

      setGameState((prevState) => updateGameState(prevState, deltaTime));
      setLastUpdateTime(currentTime);

      // プロフィールを更新（XPの変更を反映）
      setProfile(loadProfile());
    }, 16); // 約60FPS

    return () => clearInterval(gameLoop);
  }, [gameState.isRunning, lastUpdateTime]);

  // 敵のスポーン（速度に応じて調整）
  useEffect(() => {
    if (!gameState.isRunning) return;

    const baseSpawnInterval = 3000; // 基本3秒間隔
    const adjustedSpawnInterval = baseSpawnInterval / gameState.gameSpeed;

    const spawnInterval = setInterval(() => {
      setGameState((prevState) => spawnEnemy(prevState));
    }, adjustedSpawnInterval);

    return () => clearInterval(spawnInterval);
  }, [gameState.isRunning, gameState.gameSpeed]);

  // ゲーム開始
  const startGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isRunning: true,
    }));
    setLastUpdateTime(Date.now());
  }, []);

  // ゲーム停止
  const stopGame = useCallback(() => {
    setGameState((prevState) => ({
      ...prevState,
      isRunning: false,
    }));
  }, []);

  // ゲームリセット
  const resetGame = useCallback(() => {
    if (gameState.isRunning) {
      endGame(gameState);
    }
    setGameState(createInitialGameState());
    setLastUpdateTime(Date.now());
    setProfile(loadProfile()); // プロフィールを更新
  }, [gameState]);

  // ゲームオーバー時の完全リセット
  const handleGameOver = useCallback(() => {
    // プロフィールをリセット（XPとタワー強化を初期化）
    const resetProfileData = resetProfile();
    setProfile(resetProfileData);

    // ゲーム状態をリセット
    setGameState(createInitialGameState());
    setLastUpdateTime(Date.now());
  }, []);

  // タワー配置
  const handleFieldClick = useCallback(
    (position: Position) => {
      if (!gameState.isRunning || !gameState.selectedTowerType) return;

      setGameState((prevState) =>
        placeTower(prevState, position, gameState.selectedTowerType!)
      );
    },
    [gameState.isRunning, gameState.selectedTowerType]
  );

  // タワータイプ選択
  const selectTowerType = useCallback((towerType: TowerType) => {
    setGameState((prevState) => ({
      ...prevState,
      selectedTowerType:
        prevState.selectedTowerType === towerType ? null : towerType,
    }));
  }, []);

  // ゲーム速度変更
  const handleSpeedChange = useCallback((speed: 1 | 2 | 3) => {
    setGameState((prevState) => setGameSpeed(prevState, speed));
  }, []);

  // ドロップアイテム収集
  const handleDropItemClick = useCallback(
    (itemId: string) => {
      const item = gameState.dropItems.find(
        (item) => item.id === itemId && !item.isCollected
      );
      if (item) {
        // アイテム効果を表示
        setItemEffect({
          type: item.type,
          value: item.value,
          isPercentage: item.isPercentage,
          rarity: item.rarity,
        });
      }
      setGameState((prevState) => collectDropItem(prevState, itemId));
    },
    [gameState.dropItems]
  );

  // アイテム効果モーダルを閉じる
  const closeItemEffect = useCallback(() => {
    setItemEffect(null);
  }, []);

  // タワータイプ別のコスト
  const getTowerCost = useCallback(
    (towerType: TowerType) => {
      return towerCosts[towerType];
    },
    [towerCosts]
  );

  // XPショップアイテム購入
  const handlePurchaseItem = useCallback(
    (item: any) => {
      if (profile.totalXP < item.cost) return;

      // XPを消費
      addXP(-item.cost);

      // ゲーム状態に効果を適用
      setGameState((prevState) => applyShopItemEffect(item, prevState));

      // プロフィールを更新
      setProfile(loadProfile());
    },
    [profile.totalXP]
  );

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-200">
            シンプル タワーディフェンス
          </h1>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
          >
            戻る
          </Button>
        </div>

        {/* コンパクトなゲーム制御と統計 */}
        <Card className="mb-4 border-gray-600 border-2 bg-gray-800 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* ゲーム開始/停止 */}
              <div className="flex gap-2">
                {!gameState.isRunning ? (
                  <Button
                    onClick={startGame}
                    disabled={calculatedValues.isGameOver}
                    className="bg-green-600 hover:bg-green-700 text-gray-200 font-semibold shadow-lg"
                  >
                    ゲーム開始
                  </Button>
                ) : (
                  <Button
                    onClick={stopGame}
                    className="bg-red-600 hover:bg-red-700 text-gray-200 font-semibold shadow-lg"
                  >
                    一時停止
                  </Button>
                )}
                <Button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-gray-200 font-semibold shadow-lg"
                >
                  リセット
                </Button>
              </div>

              {/* ゲーム速度 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">速度:</span>
                {[1, 2, 3].map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => handleSpeedChange(speed as 1 | 2 | 3)}
                    size="sm"
                    variant={
                      gameState.gameSpeed === speed ? "default" : "outline"
                    }
                    className={`text-xs ${
                      gameState.gameSpeed === speed
                        ? "bg-blue-600 text-gray-200"
                        : "bg-gray-700 text-gray-300 border-gray-600"
                    }`}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>

              {/* 統計情報 */}
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span className="font-bold text-yellow-400">
                    {gameState.gold}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💎</span>
                  <span className="font-bold text-blue-400">
                    {gameState.score}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span className="font-bold text-red-400">
                    {gameState.health}
                  </span>
                </div>
              </div>
            </div>

            {/* 体力バー */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                <span>体力</span>
                <span>
                  {gameState.health} / {gameState.maxHealth}
                </span>
              </div>
              <Progress
                value={calculatedValues.healthPercentage}
                className="h-2 bg-gray-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* ゲームオーバー時の処理 */}
        {calculatedValues.isGameOver && (
          <Card className="mb-4 border-red-600 border-2 bg-red-900/20 shadow-lg">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold text-red-400 mb-2">
                ゲームオーバー
              </h2>
              <p className="text-gray-300 mb-4">
                最終スコア: {gameState.score} | 獲得XP: {gameState.xpEarned}
              </p>
              <Button
                onClick={handleGameOver}
                className="bg-red-600 hover:bg-red-700 text-gray-200 font-semibold"
              >
                新しいゲームを開始
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ゲームフィールドとタワー選択 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* ゲームフィールド */}
          <div className="lg:col-span-3">
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-8 gap-1 aspect-[8/6]">
                  {Array.from({ length: 48 }, (_, index) => {
                    const row = Math.floor(index / 8);
                    const col = index % 8;
                    const position: Position = { row, col };

                    // パス判定（簡単な例）
                    const isPath =
                      (row === 0 && col >= 2 && col <= 5) ||
                      (row >= 1 && row <= 4 && col === 2) ||
                      (row === 4 && col >= 2 && col <= 5) ||
                      (row >= 5 && row <= 7 && col === 5);

                    const tower = gameState.towers.find(
                      (t) => t.position.row === row && t.position.col === col
                    );
                    const enemy = gameState.enemies.find(
                      (e) =>
                        Math.floor(e.position.y / 50) === row &&
                        Math.floor(e.position.x / 50) === col
                    );

                    return (
                      <div
                        key={index}
                        className={`
                          aspect-square border border-gray-600 cursor-pointer transition-colors
                          ${isPath ? "bg-yellow-900/30" : "bg-gray-700"}
                          ${
                            gameState.selectedTowerType && !tower && !isPath
                              ? "hover:bg-blue-600/30"
                              : ""
                          }
                          ${tower ? "bg-blue-600" : ""}
                          ${enemy ? "bg-red-600" : ""}
                        `}
                        onClick={() => handleFieldClick(position)}
                      >
                        {tower && (
                          <div className="w-full h-full flex items-center justify-center text-black text-xs">
                            {tower.type === "basic"
                              ? "🔫"
                              : tower.type === "sniper"
                              ? "🎯"
                              : "⚡"}
                          </div>
                        )}
                        {enemy && (
                          <div className="w-full h-full flex items-center justify-center text-black text-xs">
                            👾
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* タワー選択とショップ */}
          <div className="space-y-4">
            {/* タワー選択 */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-200 mb-3">
                  タワー選択
                </h3>
                <div className="space-y-2">
                  {(["basic", "sniper", "rapid"] as TowerType[]).map(
                    (towerType) => (
                      <Button
                        key={towerType}
                        onClick={() => selectTowerType(towerType)}
                        className={`w-full justify-start ${
                          gameState.selectedTowerType === towerType
                            ? "bg-blue-600 text-gray-200"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        disabled={gameState.gold < getTowerCost(towerType)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {towerType === "basic"
                              ? "🔫"
                              : towerType === "sniper"
                              ? "🎯"
                              : "⚡"}
                          </span>
                          <div className="text-left">
                            <div className="font-medium">
                              {towerType === "basic"
                                ? "基本タワー"
                                : towerType === "sniper"
                                ? "スナイパー"
                                : "ラピッド"}
                            </div>
                            <div className="text-xs text-gray-400">
                              💰 {getTowerCost(towerType)}
                            </div>
                          </div>
                        </div>
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* XPショップ */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-200 mb-3">
                  XPショップ
                </h3>
                <div className="text-sm text-gray-300 mb-3">
                  所持XP:{" "}
                  <span className="font-bold text-blue-400">
                    {profile.totalXP}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "damage-boost",
                      name: "ダメージ強化",
                      cost: 50,
                      effect: "+10% ダメージ",
                    },
                    {
                      id: "range-boost",
                      name: "射程強化",
                      cost: 30,
                      effect: "+15% 射程",
                    },
                    {
                      id: "speed-boost",
                      name: "攻撃速度強化",
                      cost: 40,
                      effect: "+20% 攻撃速度",
                    },
                    {
                      id: "gold-bonus",
                      name: "ゴールドボーナス",
                      cost: 25,
                      effect: "+25% ゴールド獲得",
                    },
                    {
                      id: "xp-bonus",
                      name: "XPボーナス",
                      cost: 35,
                      effect: "+30% XP獲得",
                    },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      onClick={() => handlePurchaseItem(item)}
                      className="w-full justify-start bg-gray-700 text-gray-300 hover:bg-gray-600"
                      disabled={profile.totalXP < item.cost}
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-400">
                          💎 {item.cost} | {item.effect}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ドロップアイテム表示 */}
        {gameState.dropItems.length > 0 && (
          <Card className="mt-4 border-gray-600 border-2 bg-gray-800 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-200 mb-3">
                ドロップアイテム
              </h3>
              <div className="flex flex-wrap gap-2">
                {gameState.dropItems
                  .filter((item) => !item.isCollected)
                  .map((item) => (
                    <Badge
                      key={item.id}
                      className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-gray-200"
                      onClick={() => handleDropItemClick(item.id)}
                    >
                      {item.type === "damage-boost"
                        ? "⚔️"
                        : item.type === "range-boost"
                        ? "🎯"
                        : item.type === "speed-boost"
                        ? "⚡"
                        : item.type === "gold-bonus"
                        ? "💰"
                        : "💎"}
                      {item.value}
                      {item.isPercentage ? "%" : ""}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* アイテム効果モーダル */}
        {itemEffect && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg max-w-sm">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                  アイテム効果
                </h3>
                <div className="text-4xl mb-2">
                  {itemEffect.type === "damage-boost"
                    ? "⚔️"
                    : itemEffect.type === "range-boost"
                    ? "🎯"
                    : itemEffect.type === "speed-boost"
                    ? "⚡"
                    : itemEffect.type === "gold-bonus"
                    ? "💰"
                    : "💎"}
                </div>
                <p className="text-gray-300 mb-4">
                  {itemEffect.value}
                  {itemEffect.isPercentage ? "%" : ""} の効果を獲得しました！
                </p>
                <Button
                  onClick={closeItemEffect}
                  className="bg-blue-600 hover:bg-blue-700 text-gray-200"
                >
                  閉じる
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
