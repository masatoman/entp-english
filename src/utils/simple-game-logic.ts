import {
  DropItem,
  DropItemType,
  Enemy,
  EnemyType,
  GameConfig,
  GameState,
  Position,
  Tower,
  TowerType,
} from "../types/simple-game";
import { addXP, updateGameStats } from "./tower-defense-data";

// ゲーム設定（定数）
export const GAME_CONFIG: GameConfig = {
  fieldWidth: 800,
  fieldHeight: 400,
  // 敵の進路：左端から右端へ直線移動
  enemyPath: [
    { x: 0, y: 200, row: 0, col: 0 }, // 開始点（左端中央）
    { x: 800, y: 200, row: 0, col: 0 }, // 終了点（右端中央）
  ],
  initialHealth: 100,
  initialGold: 50,
};

// 初期ゲーム状態を作成
export function createInitialGameState(): GameState {
  return {
    isRunning: false,
    score: 0,
    health: GAME_CONFIG.initialHealth,
    maxHealth: GAME_CONFIG.initialHealth,
    level: 1,
    enemies: [],
    towers: [],
    gold: GAME_CONFIG.initialGold,
    xp: 0,
    // ウェーブシステム
    currentWave: 1,
    waveStartTime: 0,
    enemiesSpawnedInWave: 0,
    timeElapsed: 0,
    // ゲーム速度
    gameSpeed: 1,
    // ドロップアイテム
    dropItems: [],
    // タワー選択
    selectedTowerType: null,
    // アクティブなブースト
    activeBoosts: {
      damageBoost: 0,
      rangeBoost: 0,
      speedBoost: 0,
      goldMultiplier: 1,
      xpMultiplier: 1,
    },
    // 不足しているプロパティを追加
    gameId: "default",
    lives: 3,
    money: GAME_CONFIG.initialGold,
    projectiles: [],
    xpEarned: 0,
  };
}

// 敵タイプの定義
const ENEMY_TYPES = {
  basic: {
    name: "基本敵",
    healthMultiplier: 1,
    speedMultiplier: 1,
    armor: 0,
    regenRate: 0,
    color: "#ff4444",
  },
  fast: {
    name: "高速敵",
    healthMultiplier: 0.7,
    speedMultiplier: 2,
    armor: 0,
    regenRate: 0,
    color: "#44ff44",
  },
  tank: {
    name: "重装甲敵",
    healthMultiplier: 2.5,
    speedMultiplier: 0.4,
    armor: 0.5, // 50%ダメージ軽減
    regenRate: 0,
    color: "#4444ff",
  },
  regen: {
    name: "再生敵",
    healthMultiplier: 1.5,
    speedMultiplier: 0.8,
    armor: 0,
    regenRate: 2, // 秒あたり2回復
    color: "#ff44ff",
  },
  shield: {
    name: "シールド敵",
    healthMultiplier: 1,
    speedMultiplier: 1,
    armor: 0,
    regenRate: 0,
    color: "#44ffff",
  },
  stealth: {
    name: "ステルス敵",
    healthMultiplier: 0.8,
    speedMultiplier: 1.5,
    armor: 0,
    regenRate: 0,
    color: "#888888",
  },
  boss: {
    name: "ボス敵",
    healthMultiplier: 5,
    speedMultiplier: 0.6,
    armor: 0.3,
    regenRate: 5,
    color: "#ff8800",
  },
} as const;

// ウェーブに基づいて敵のタイプを決定
function getEnemyTypeForWave(wave: number): EnemyType {
  // ボス敵は5の倍数ウェーブ
  if (wave % 5 === 0) return "boss";

  // ウェーブが進むにつれて特殊敵が出現
  const rand = Math.random();

  if (wave <= 2) {
    return "basic";
  } else if (wave <= 5) {
    return rand < 0.7 ? "basic" : "fast";
  } else if (wave <= 8) {
    if (rand < 0.4) return "basic";
    if (rand < 0.7) return "fast";
    return "tank";
  } else if (wave <= 12) {
    if (rand < 0.3) return "basic";
    if (rand < 0.5) return "fast";
    if (rand < 0.7) return "tank";
    return "regen";
  } else if (wave <= 16) {
    if (rand < 0.2) return "basic";
    if (rand < 0.4) return "fast";
    if (rand < 0.6) return "tank";
    if (rand < 0.8) return "regen";
    return "shield";
  } else {
    // 高ウェーブ：全種類登場
    const types: EnemyType[] = [
      "basic",
      "fast",
      "tank",
      "regen",
      "shield",
      "stealth",
    ];
    return types[Math.floor(Math.random() * types.length)];
  }
}

// ウェーブに基づいて敵の強さを計算
export function calculateEnemyStats(wave: number): {
  type: EnemyType;
  health: number;
  speed: number;
  difficulty: "easy" | "normal" | "hard";
  name: string;
  armor: number;
  shield: number;
  maxShield: number;
  regenRate: number;
} {
  const type = getEnemyTypeForWave(wave);
  const typeData = ENEMY_TYPES[type];

  // ウェーブごとに敵が強くなる（より厳しく）
  const baseHealth = 40; // 25→40に増加
  const baseSpeed = 30; // 35→30に減少（速度を下げて体力で勝負）

  // より急激な強化カーブ
  const healthMultiplier = 1 + (wave - 1) * 0.8; // 各ウェーブで80%増加（50%→80%）
  const speedMultiplier = 1 + (wave - 1) * 0.25; // 各ウェーブで25%増加（15%→25%）

  const health = Math.floor(
    baseHealth * healthMultiplier * typeData.healthMultiplier
  );
  const speed = Math.floor(
    baseSpeed * speedMultiplier * typeData.speedMultiplier
  );

  // シールド敵の特殊処理
  let shield = 0;
  let maxShield = 0;
  if (type === "shield") {
    shield = Math.floor(health * 0.5); // 体力の50%のシールド
    maxShield = shield;
  }

  // 難易度を決定
  let difficulty: "easy" | "normal" | "hard";
  if (wave <= 4) {
    difficulty = "easy";
  } else if (wave <= 10) {
    difficulty = "normal";
  } else {
    difficulty = "hard";
  }

  const name = `${typeData.name} (W${wave})`;

  return {
    type,
    health,
    speed,
    difficulty,
    name,
    armor: typeData.armor,
    shield,
    maxShield,
    regenRate: typeData.regenRate,
  };
}

// 敵を生成（ウェーブベース）
export function createEnemy(id: string, wave: number): Enemy {
  const stats = calculateEnemyStats(wave);

  return {
    id,
    name: stats.name,
    type: stats.type,
    position: { ...GAME_CONFIG.enemyPath[0] }, // 開始位置
    maxHealth: stats.health,
    currentHealth: stats.health,
    speed: stats.speed,
    isAlive: true,
    englishWord: "test", // 後で実装
    difficulty: stats.difficulty,
    armor: stats.armor,
    shield: stats.shield,
    maxShield: stats.maxShield,
    regenRate: stats.regenRate,
    isVisible: stats.type !== "stealth" || Math.random() < 0.7, // ステルス敵は30%の確率で透明
    lastRegenTime: Date.now(),
    processed: false, // 報酬処理済みフラグを初期化
  };
}

// タワータイプ別の設定
const TOWER_TYPES = {
  basic: {
    name: "基本タワー",
    damage: 15,
    range: 100,
    attackSpeed: 1000,
    cost: 20,
    color: "#4CAF50",
  },
  sniper: {
    name: "スナイパータワー",
    damage: 35,
    range: 150,
    attackSpeed: 2000,
    cost: 40,
    color: "#2196F3",
  },
  rapid: {
    name: "ラピッドタワー",
    damage: 8,
    range: 80,
    attackSpeed: 400,
    cost: 30,
    color: "#FF9800",
  },
} as const;

// タワーを生成（タイプ別）
export function createTower(
  id: string,
  position: Position,
  type: TowerType
): Tower {
  const towerConfig = TOWER_TYPES[type];

  return {
    id,
    name: towerConfig.name,
    type,
    position: { ...position },
    damage: towerConfig.damage,
    range: towerConfig.range,
    attackSpeed: towerConfig.attackSpeed,
    lastAttackTime: 0,
    cost: towerConfig.cost,
    // 一時強化の初期化
    tempBoosts: {
      damageBoost: 0,
      rangeBoost: 0,
      speedBoost: 0,
    },
  };
}

// 距離計算
export function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 敵の移動処理
export function moveEnemy(enemy: Enemy, deltaTime: number): Enemy {
  if (!enemy.isAlive) return enemy;

  const start = GAME_CONFIG.enemyPath[0];
  const end = GAME_CONFIG.enemyPath[1];

  // 移動方向を計算
  const direction = {
    x: end.x - start.x,
    y: end.y - start.y,
  };
  const distance = Math.sqrt(
    direction.x * direction.x + direction.y * direction.y
  );

  // 正規化
  const normalizedDirection = {
    x: direction.x / distance,
    y: direction.y / distance,
  };

  // 移動量を計算（ピクセル/秒 × 秒 = ピクセル）
  const moveDistance = enemy.speed * (deltaTime / 1000);

  // 新しい位置を計算
  const newPosition = {
    x: enemy.position.x + normalizedDirection.x * moveDistance,
    y: enemy.position.y + normalizedDirection.y * moveDistance,
    row: 0,
    col: 0,
  };

  // 終点に到達したかチェック
  if (newPosition.x >= end.x) {
    return {
      ...enemy,
      position: { ...end },
      isAlive: false, // 終点到達で消滅
    };
  }

  return {
    ...enemy,
    position: newPosition,
  };
}

// タワーの攻撃処理
export function towerAttack(
  tower: Tower,
  enemies: Enemy[],
  currentTime: number,
  activeBoosts?: any
): {
  updatedEnemies: Enemy[];
  attackHappened: boolean;
} {
  // 攻撃クールダウンチェック
  if (currentTime - tower.lastAttackTime < tower.attackSpeed) {
    return { updatedEnemies: enemies, attackHappened: false };
  }

  // 一時強化とアクティブブーストを適用した射程とダメージを計算
  const boostedRange =
    tower.range + tower.tempBoosts.rangeBoost + (activeBoosts?.rangeBoost || 0);
  const boostedDamage =
    tower.damage +
    tower.tempBoosts.damageBoost +
    (activeBoosts?.damageBoost || 0);
  const speedBoostMultiplier =
    1 + tower.tempBoosts.speedBoost / 100 + (activeBoosts?.speedBoost || 0);

  // 射程内の生きている敵を探す（ステルス敵は見えない場合がある）
  const targetEnemy = enemies.find(
    (enemy) =>
      enemy.isAlive &&
      enemy.isVisible &&
      calculateDistance(tower.position, enemy.position) <= boostedRange
  );

  if (!targetEnemy) {
    return { updatedEnemies: enemies, attackHappened: false };
  }

  // 敵にダメージを与える（特殊能力考慮）
  const updatedEnemies = enemies.map((enemy) => {
    if (enemy.id === targetEnemy.id) {
      let damage = boostedDamage; // 強化されたダメージを使用

      // アーマーによるダメージ軽減
      if (enemy.armor > 0) {
        damage = damage * (1 - enemy.armor);
      }

      let newShield = enemy.shield;
      let newHealth = enemy.currentHealth;

      // シールドから先にダメージを適用
      if (newShield > 0) {
        if (damage >= newShield) {
          damage -= newShield;
          newShield = 0;
          newHealth = Math.max(0, newHealth - damage);
        } else {
          newShield = Math.max(0, newShield - damage);
          damage = 0;
        }
      } else {
        newHealth = Math.max(0, newHealth - damage);
      }

      return {
        ...enemy,
        currentHealth: newHealth,
        shield: newShield,
        isAlive: newHealth > 0,
      };
    }
    return enemy;
  });

  return { updatedEnemies, attackHappened: true };
}

// 敵の特殊能力を処理
function processEnemyAbilities(enemy: Enemy): Enemy {
  if (!enemy.isAlive) return enemy;

  let updatedEnemy = { ...enemy };
  const currentTime = Date.now();

  // 再生能力
  if (enemy.regenRate > 0 && currentTime - enemy.lastRegenTime >= 1000) {
    const regenAmount = enemy.regenRate;
    const newHealth = Math.min(
      enemy.maxHealth,
      enemy.currentHealth + regenAmount
    );
    updatedEnemy.currentHealth = newHealth;
    updatedEnemy.lastRegenTime = currentTime;
  }

  // ステルス能力（ランダムに見えたり見えなくなったり）
  if (enemy.type === "stealth" && Math.random() < 0.03) {
    // 3%の確率で状態変更
    updatedEnemy.isVisible = !enemy.isVisible;
  }

  return updatedEnemy;
}

// ドロップアイテム生成
function createDropItem(enemy: Enemy): DropItem | null {
  // ドロップ率を大幅に下げる：基本2%、ボス敵は15%
  const dropRate = enemy.type === "boss" ? 0.15 : 0.02;

  if (Math.random() > dropRate) {
    return null; // ドロップしない
  }

  // レアリティ決定
  const rarityRoll = Math.random();
  let rarity: "common" | "rare" | "epic" | "legendary";

  if (rarityRoll < 0.6) rarity = "common";
  else if (rarityRoll < 0.85) rarity = "rare";
  else if (rarityRoll < 0.97) rarity = "epic";
  else rarity = "legendary";

  // アイテムタイプ決定
  const itemTypes: DropItemType[] = [
    "damage-boost",
    "range-boost",
    "speed-boost",
    "gold-bonus",
    "xp-bonus",
  ];
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  // レアリティに応じた効果値
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2.5,
    legendary: 4,
  };

  let value: number;
  let isPercentage: boolean;
  let lifetime: number;

  switch (type) {
    case "damage-boost":
      value = Math.floor(5 * rarityMultiplier[rarity]); // +5/7/12/20ダメージ
      isPercentage = false;
      lifetime = 30000; // 30秒
      break;
    case "range-boost":
      value = Math.floor(15 * rarityMultiplier[rarity]); // +15/22/37/60ピクセル
      isPercentage = false;
      lifetime = 30000;
      break;
    case "speed-boost":
      value = Math.floor(10 * rarityMultiplier[rarity]); // +10/15/25/40%速度向上
      isPercentage = true;
      lifetime = 25000; // 25秒
      break;
    case "gold-bonus":
      value = Math.floor(10 * rarityMultiplier[rarity]); // +10/15/25/40ゴールド
      isPercentage = false;
      lifetime = 15000; // 15秒（すぐ消える）
      break;
    case "xp-bonus":
      value = Math.floor(5 * rarityMultiplier[rarity]); // +5/7/12/20XP
      isPercentage = false;
      lifetime = 20000; // 20秒
      break;
  }

  return {
    id: `drop_${Date.now()}_${Math.random()}`,
    type,
    position: {
      x: enemy.position.x + (Math.random() - 0.5) * 50, // 敵の位置周辺にランダム配置
      y: enemy.position.y + (Math.random() - 0.5) * 50,
      row: 0,
      col: 0,
    },
    value,
    isPercentage,
    rarity,
    spawnTime: Date.now(),
    lifetime,
    isCollected: false,
  };
}

// ゲーム状態更新
export function updateGameState(
  gameState: GameState,
  deltaTime: number
): GameState {
  if (!gameState.isRunning) return gameState;

  // 速度倍率を適用
  const acceleratedDeltaTime = deltaTime * gameState.gameSpeed;
  const acceleratedTimeIncrement = (deltaTime / 1000) * gameState.gameSpeed;

  const currentTime = Date.now();
  let updatedEnemies = gameState.enemies;
  let updatedScore = gameState.score;
  let updatedHealth = gameState.health;
  let updatedXp = gameState.xp;
  let updatedGold = gameState.gold;
  let updatedDropItems = gameState.dropItems;
  let updatedTimeElapsed = gameState.timeElapsed + acceleratedTimeIncrement;
  let updatedWave = gameState.currentWave;
  let updatedWaveStartTime = gameState.waveStartTime;
  let updatedEnemiesSpawnedInWave = gameState.enemiesSpawnedInWave;

  // ウェーブ進行の判定（20秒ごとに新しいウェーブ）
  const timeSinceWaveStart = updatedTimeElapsed - updatedWaveStartTime;
  if (timeSinceWaveStart >= 20) {
    updatedWave += 1;
    updatedWaveStartTime = updatedTimeElapsed;
    updatedEnemiesSpawnedInWave = 0;
    console.log(`🌊 ウェーブ ${updatedWave} 開始！敵が強化されました`);
  }

  // 敵の移動処理（速度倍率適用）
  updatedEnemies = updatedEnemies.map((enemy) =>
    moveEnemy(enemy, acceleratedDeltaTime)
  );

  // 敵の特殊能力処理
  updatedEnemies = updatedEnemies.map((enemy) =>
    processEnemyAbilities(enemy, acceleratedDeltaTime)
  );

  // 終点に到達した敵の処理
  const enemiesReachedEnd = updatedEnemies.filter(
    (enemy) => !enemy.isAlive && enemy.position.x >= GAME_CONFIG.enemyPath[1].x
  );

  // 体力減少（敵が通過した数に応じて）
  const healthLoss = enemiesReachedEnd.length * 15; // 10→15に増加（より厳しく）
  updatedHealth -= healthLoss;

  // ゲームオーバー判定
  if (updatedHealth <= 0) {
    updatedHealth = 0;
    // ゲームを停止
    return {
      ...gameState,
      isRunning: false,
      health: 0,
      enemies: updatedEnemies,
      score: updatedScore,
      xp: updatedXp,
      gold: updatedGold,
      timeElapsed: updatedTimeElapsed,
      currentWave: updatedWave,
      waveStartTime: updatedWaveStartTime,
      enemiesSpawnedInWave: updatedEnemiesSpawnedInWave,
      gameSpeed: gameState.gameSpeed,
      dropItems: updatedDropItems,
    };
  }

  // タワーの攻撃処理（速度倍率を考慮）
  gameState.towers.forEach((tower) => {
    // 速度倍率に応じて攻撃頻度を調整
    const adjustedAttackSpeed = tower.attackSpeed / gameState.gameSpeed;
    const canAttack = currentTime - tower.lastAttackTime >= adjustedAttackSpeed;

    if (canAttack) {
      const attackResult = towerAttack(
        tower,
        updatedEnemies,
        currentTime,
        gameState.activeBoosts
      );
      updatedEnemies = attackResult.updatedEnemies;

      if (attackResult.attackHappened) {
        // タワーの最終攻撃時間を更新
        tower.lastAttackTime = currentTime;
      }
    }
  });

  // 倒された敵の処理（まだ処理されていない敵のみ）
  const defeatedEnemies = updatedEnemies.filter(
    (enemy) => !enemy.isAlive && enemy.currentHealth <= 0 && !enemy.processed
  );

  // スコアとXP獲得（敵の強さに応じて）+ ドロップアイテム生成
  defeatedEnemies.forEach((enemy) => {
    // ウェーブに応じた報酬計算（より厳しく調整）
    const baseScore = 5; // 10→5に減少
    const baseXP = 3; // 5→3に減少
    const baseGold = 1; // 3→1に大幅減少

    // 難易度による倍率
    const difficultyMultiplier = {
      easy: 1,
      normal: 1.2, // 1.5→1.2に減少
      hard: 1.5, // 2→1.5に減少
    };

    const multiplier = difficultyMultiplier[enemy.difficulty];
    const scoreGain = Math.floor(baseScore * multiplier);
    const xpGain = Math.floor(
      baseXP * multiplier * gameState.activeBoosts.xpMultiplier
    );
    const goldGain = Math.floor(
      baseGold * multiplier * gameState.activeBoosts.goldMultiplier
    );

    updatedScore += scoreGain;
    updatedGold += goldGain;
    addXP(xpGain);
    updatedXp += xpGain;

    // デバッグ用ログ
    console.log(`敵を倒しました！ +${xpGain}XP (難易度: ${enemy.difficulty})`);

    // ドロップアイテム生成（確率を大幅に下げる）
    const dropItem = createDropItem(enemy);
    if (dropItem) {
      updatedDropItems.push(dropItem);
    }

    // 処理済みフラグを設定（重複処理を防ぐ）
    const enemyIndex = updatedEnemies.findIndex((e) => e.id === enemy.id);
    if (enemyIndex !== -1) {
      updatedEnemies[enemyIndex] = {
        ...updatedEnemies[enemyIndex],
        processed: true,
      };
    }
  });

  // 死んだ敵を除去（生きている敵のみ残す）
  updatedEnemies = updatedEnemies.filter(
    (enemy) => enemy.isAlive && enemy.currentHealth > 0
  );

  // ドロップアイテムの時間切れ処理
  updatedDropItems = updatedDropItems.filter((item) => {
    const age = currentTime - item.spawnTime;
    return age < item.lifetime && !item.isCollected;
  });

  return {
    ...gameState,
    enemies: updatedEnemies,
    score: updatedScore,
    health: Math.max(0, updatedHealth),
    xp: updatedXp,
    gold: updatedGold,
    timeElapsed: updatedTimeElapsed,
    currentWave: updatedWave,
    waveStartTime: updatedWaveStartTime,
    enemiesSpawnedInWave: updatedEnemiesSpawnedInWave,
    gameSpeed: gameState.gameSpeed,
    dropItems: updatedDropItems,
  };
}

// 新しい敵をスポーン（現在のウェーブに応じた強さ）
export function spawnEnemy(gameState: GameState): GameState {
  const newEnemyId = `enemy_${Date.now()}`;
  const newEnemy = createEnemy(newEnemyId, gameState.currentWave);

  return {
    ...gameState,
    enemies: [...gameState.enemies, newEnemy],
    enemiesSpawnedInWave: gameState.enemiesSpawnedInWave + 1,
  };
}

// タワーを配置
export function placeTower(
  gameState: GameState,
  position: Position,
  towerType: TowerType
): GameState {
  if (!towerType) {
    return gameState; // タワータイプが選択されていない
  }

  const towerConfig = TOWER_TYPES[towerType];
  const towerCost = towerConfig.cost;

  if (gameState.gold < towerCost) {
    return gameState; // ゴールドが足りない
  }

  const newTowerId = `tower_${Date.now()}`;
  const newTower = createTower(newTowerId, position, towerType);

  return {
    ...gameState,
    towers: [...gameState.towers, newTower],
    gold: gameState.gold - towerCost,
  };
}

// ドロップアイテム収集
export function collectDropItem(
  gameState: GameState,
  itemId: string
): GameState {
  const item = gameState.dropItems.find(
    (item) => item.id === itemId && !item.isCollected
  );

  if (!item) {
    return gameState; // アイテムが見つからない
  }

  let updatedGameState = { ...gameState };

  // アイテム効果を適用
  switch (item.type) {
    case "gold-bonus":
      updatedGameState.gold += item.value;
      break;
    case "xp-bonus":
      addXP(item.value);
      updatedGameState.xp += item.value;
      break;
    case "damage-boost":
    case "range-boost":
    case "speed-boost":
      // タワー強化系は最も近いタワーに適用
      const nearestTower = findNearestTower(
        updatedGameState.towers,
        item.position
      );
      if (nearestTower) {
        updatedGameState = applyBoostToTower(
          updatedGameState,
          nearestTower.id,
          item
        );
      }
      break;
  }

  // アイテムを収集済みにマーク
  updatedGameState.dropItems = updatedGameState.dropItems.map((dropItem) =>
    dropItem.id === itemId ? { ...dropItem, isCollected: true } : dropItem
  );

  return updatedGameState;
}

// 最も近いタワーを見つける
function findNearestTower(towers: Tower[], position: Position): Tower | null {
  if (towers.length === 0) return null;

  let nearestTower = towers[0];
  let minDistance = calculateDistance(towers[0].position, position);

  for (let i = 1; i < towers.length; i++) {
    const distance = calculateDistance(towers[i].position, position);
    if (distance < minDistance) {
      minDistance = distance;
      nearestTower = towers[i];
    }
  }

  return nearestTower;
}

// タワーにブーストを適用
function applyBoostToTower(
  gameState: GameState,
  towerId: string,
  item: DropItem
): GameState {
  const updatedTowers = gameState.towers.map((tower) => {
    if (tower.id === towerId) {
      const newTempBoosts = { ...tower.tempBoosts };

      switch (item.type) {
        case "damage-boost":
          newTempBoosts.damageBoost += item.value;
          break;
        case "range-boost":
          newTempBoosts.rangeBoost += item.value;
          break;
        case "speed-boost":
          newTempBoosts.speedBoost += item.value; // パーセンテージ
          break;
      }

      return {
        ...tower,
        tempBoosts: newTempBoosts,
      };
    }
    return tower;
  });

  return {
    ...gameState,
    towers: updatedTowers,
  };
}

// ゲーム終了時の処理
export function endGame(gameState: GameState): void {
  const enemiesDefeated = gameState.enemies.filter(
    (enemy) => !enemy.isAlive && enemy.currentHealth <= 0
  ).length;

  updateGameStats(gameState.score, enemiesDefeated);
}

// ゲーム速度を変更
export function setGameSpeed(
  gameState: GameState,
  speed: 1 | 2 | 3
): GameState {
  return {
    ...gameState,
    gameSpeed: speed,
  };
}
