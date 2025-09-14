import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { SimpleGameField } from './SimpleGameField';
import { ItemEffectModal } from './ItemEffectModal';
import { XPShop } from './XPShop';
import { GameState, Position, TowerType } from '../types/simple-game';
import {
  createInitialGameState,
  updateGameState,
  spawnEnemy,
  placeTower,
  endGame,
  setGameSpeed,
  collectDropItem
} from '../utils/simple-game-logic';
import {
  loadProfile,
  getLevelName,
  getXPToNextLevel,
  resetProfile,
  TowerDefenseProfile,
  addXP
} from '../utils/tower-defense-data';
import { applyShopItemEffect } from '../data/xpShop';

interface SimpleTowerDefenseProps {
  onBack: () => void;
}

export function SimpleTowerDefense({ onBack }: SimpleTowerDefenseProps) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [profile, setProfile] = useState<TowerDefenseProfile>(loadProfile());
  const [itemEffect, setItemEffect] = useState<{
    type: 'damage-boost' | 'range-boost' | 'speed-boost' | 'gold-bonus' | 'xp-bonus';
    value: number;
    isPercentage: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  } | null>(null);

  // ゲームループ
  useEffect(() => {
    if (!gameState.isRunning) return;

    const gameLoop = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime;
      
      setGameState(prevState => updateGameState(prevState, deltaTime));
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
      setGameState(prevState => spawnEnemy(prevState));
    }, adjustedSpawnInterval);

    return () => clearInterval(spawnInterval);
  }, [gameState.isRunning, gameState.gameSpeed]);

  // ゲーム開始
  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isRunning: true
    }));
    setLastUpdateTime(Date.now());
  }, []);

  // ゲーム停止
  const stopGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isRunning: false
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
  const handleFieldClick = useCallback((position: Position) => {
    if (!gameState.isRunning || !gameState.selectedTowerType) return;
    
    setGameState(prevState => placeTower(prevState, position, gameState.selectedTowerType!));
  }, [gameState.isRunning, gameState.selectedTowerType]);

  // タワータイプ選択
  const selectTowerType = useCallback((towerType: TowerType) => {
    setGameState(prevState => ({
      ...prevState,
      selectedTowerType: prevState.selectedTowerType === towerType ? null : towerType
    }));
  }, []);

  // 手動で敵を追加
  const addEnemy = useCallback(() => {
    setGameState(prevState => spawnEnemy(prevState));
  }, []);

  // ゲーム速度変更
  const handleSpeedChange = useCallback((speed: 1 | 2 | 3) => {
    setGameState(prevState => setGameSpeed(prevState, speed));
  }, []);

  // ドロップアイテム収集
  const handleDropItemClick = useCallback((itemId: string) => {
    const item = gameState.dropItems.find(item => item.id === itemId && !item.isCollected);
    if (item) {
      // アイテム効果を表示
      setItemEffect({
        type: item.type,
        value: item.value,
        isPercentage: item.isPercentage,
        rarity: item.rarity
      });
    }
    setGameState(prevState => collectDropItem(prevState, itemId));
  }, [gameState.dropItems]);

  // アイテム効果モーダルを閉じる
  const closeItemEffect = useCallback(() => {
    setItemEffect(null);
  }, []);

  // タワータイプ別のコスト
  const getTowerCost = useCallback((towerType: TowerType) => {
    const costs = {
      basic: 20,
      sniper: 40,
      rapid: 30
    };
    return costs[towerType];
  }, []);

  // XPショップアイテム購入
  const handlePurchaseItem = useCallback((item: any) => {
    if (profile.totalXP < item.cost) return;
    
    // XPを消費
    addXP(-item.cost);
    
    // ゲーム状態に効果を適用
    setGameState(prevState => applyShopItemEffect(item, prevState));
    
    // プロフィールを更新
    setProfile(loadProfile());
  }, [profile.totalXP]);

  // 体力の割合
  const healthPercentage = (gameState.health / gameState.maxHealth) * 100;

  // ゲームオーバー判定
  const isGameOver = gameState.health <= 0;

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-200">
            シンプル タワーディフェンス
          </h1>
          <Button 
            onClick={onBack} 
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
                    disabled={isGameOver}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                  >
                    ゲーム開始
                  </Button>
                ) : (
                  <Button 
                    onClick={stopGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                  >
                    一時停止
                  </Button>
                )}
                
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="bg-gray-600 hover:bg-gray-500 text-gray-200 border-gray-500 font-semibold shadow-lg"
                >
                  リセット
                </Button>
              </div>

              {/* コンパクトな統計表示 */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">{gameState.score}</span>
                  <span className="text-gray-600">スコア</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-600 font-bold">{gameState.gold}</span>
                  <span className="text-gray-600">ゴールド</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-600 font-bold">{profile.totalXP}</span>
                  <span className="text-gray-600">XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-600 font-bold">Lv{profile.currentLevel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600 font-bold">W{gameState.currentWave}</span>
                </div>
              </div>

              {/* 速度切り替え（1つのボタン） */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-medium">速度:</span>
                <Button 
                  onClick={() => {
                    const nextSpeed = gameState.gameSpeed === 3 ? 1 : gameState.gameSpeed + 1;
                    handleSpeedChange(nextSpeed as 1 | 2 | 3);
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg min-w-[60px]"
                >
                  {gameState.gameSpeed}x
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isGameOver && (
          <Card className="mb-4 bg-red-600 border-red-500 text-white">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold mb-2">ゲームオーバー！</h2>
              <p className="mb-2">最終スコア: {gameState.score}</p>
              <p className="mb-4 text-yellow-200 text-sm">
                ⚠️ タワー強化とXPがリセットされました
              </p>
              <Button onClick={handleGameOver} className="bg-white text-red-600 hover:bg-gray-100">
                もう一度プレイ
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* メインゲームエリア */}
          <div className="lg:col-span-2 space-y-4">
            {/* 進捗表示（コンパクト） */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardContent className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* レベル進捗 */}
                  <div>
                    <div className="flex justify-between text-gray-300 text-sm mb-1">
                      <span>{getLevelName(profile.currentLevel)}</span>
                      <span className="text-purple-600 font-bold">Lv{profile.currentLevel}</span>
                    </div>
                    {profile.currentLevel < 100 && (
                      <Progress 
                        value={100 - (getXPToNextLevel(profile.totalXP) / 50) * 100} 
                        className="h-2"
                      />
                    )}
                  </div>
                  
                  {/* ウェーブ進捗 */}
                  {gameState.isRunning && (
                    <div>
                      <div className="flex justify-between text-gray-300 text-sm mb-1">
                        <span>ウェーブ {gameState.currentWave}</span>
                        <span className="text-yellow-600">{Math.max(0, Math.floor(20 - (gameState.timeElapsed - gameState.waveStartTime)))}秒</span>
                      </div>
                      <Progress 
                        value={((gameState.timeElapsed - gameState.waveStartTime) / 20) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {/* 体力バー */}
                  <div>
                    <div className="flex justify-between text-gray-300 text-sm mb-1">
                      <span>体力</span>
                      <span className="text-red-600">{gameState.health}/{gameState.maxHealth}</span>
                    </div>
                    <Progress 
                      value={healthPercentage} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ゲームフィールド */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200 text-center">戦場</CardTitle>
                {gameState.selectedTowerType && (
                  <div className="text-center text-blue-600 text-sm font-medium">
                    選択中: {gameState.selectedTowerType === 'basic' ? '基本タワー' : 
                            gameState.selectedTowerType === 'sniper' ? 'スナイパータワー' : 'ラピッドタワー'}
                  </div>
                )}
              </CardHeader>
              <CardContent>
              <SimpleGameField 
                gameState={gameState} 
                onFieldClick={handleFieldClick}
                onDropItemClick={handleDropItemClick}
              />
              </CardContent>
            </Card>
          </div>

          {/* サイドパネル */}
          <div className="space-y-4">

            {/* タワー選択 */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200">タワー選択</CardTitle>
                <p className="text-xs text-gray-400">タワーを選択してフィールドに配置</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 基本タワー */}
                <Button
                  onClick={() => selectTowerType('basic')}
                  className={`w-full ${
                    gameState.selectedTowerType === 'basic'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  disabled={gameState.gold < getTowerCost('basic')}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span>⚔️</span>
                      <span>基本タワー</span>
                    </div>
                    <span className="text-sm">{getTowerCost('basic')}G</span>
                  </div>
                </Button>

                {/* スナイパータワー */}
                <Button
                  onClick={() => selectTowerType('sniper')}
                  className={`w-full ${
                    gameState.selectedTowerType === 'sniper'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                  disabled={gameState.gold < getTowerCost('sniper')}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span>🎯</span>
                      <span>スナイパー</span>
                    </div>
                    <span className="text-sm">{getTowerCost('sniper')}G</span>
                  </div>
                </Button>

                {/* ラピッドタワー */}
                <Button
                  onClick={() => selectTowerType('rapid')}
                  className={`w-full ${
                    gameState.selectedTowerType === 'rapid'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                  disabled={gameState.gold < getTowerCost('rapid')}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span>⚡</span>
                      <span>ラピッド</span>
                    </div>
                    <span className="text-sm">{getTowerCost('rapid')}G</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* XPショップ */}
            <XPShop 
              currentXP={profile.totalXP}
              onPurchaseItem={handlePurchaseItem}
            />

            {/* テスト機能 */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200">テスト機能</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={addEnemy}
                  size="sm"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  敵を追加
                </Button>
              </CardContent>
            </Card>

            {/* 説明 */}
            <Card className="border-gray-600 border-2 bg-gray-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200">遊び方</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>1. ゲーム開始ボタンを押す</p>
                <p>2. タワーを選択してフィールドに配置</p>
                <p>3. 敵を倒してスコア・ゴールド・XPを獲得</p>
                <p>4. XPショップで一時的なブーストを購入</p>
                <p>5. 20秒ごとに敵が強化される（ウェーブシステム）</p>
                <p>6. ゲーム速度を2倍・3倍に変更可能</p>
                <p className="text-cyan-600 font-semibold">タワーの種類:</p>
                <p className="text-xs">⚔️ 基本タワー（バランス型） 🎯 スナイパー（高攻撃力・低射程） ⚡ ラピッド（低攻撃力・高射程・高速）</p>
                <p className="text-cyan-600 font-semibold">XPショップ:</p>
                <p className="text-xs">⚔️ 攻撃力+5 🎯 射程+20 ⚡ 攻撃速度+50% 💰 ゴールド倍増 ⭐ XP倍増 ❤️ 体力回復 ⏭️ ウェーブスキップ</p>
                <p className="text-cyan-600 font-semibold">敵の種類:</p>
                <p className="text-xs">🔴 基本敵 🟢 高速敵 🔵 重装甲敵 🟣 再生敵 🔵 シールド敵 ⚫ ステルス敵 🟠 ボス敵</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* アイテム効果モーダル */}
      <ItemEffectModal 
        effect={itemEffect} 
        onClose={closeItemEffect} 
      />
    </div>
  );
}
