// シンプルなタワーディフェンスゲームの型定義

// 基本的な位置情報
export interface Position {
  x: number;
  y: number;
  row: number;
  col: number;
}

// 敵の型定義（シンプル版）
export type EnemyType =
  | "basic" // 基本敵
  | "fast" // 高速敵
  | "tank" // 重装甲敵
  | "regen" // 再生敵
  | "shield" // シールド敵
  | "stealth" // ステルス敵
  | "boss"; // ボス敵

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  position: Position;
  maxHealth: number;
  currentHealth: number;
  speed: number; // ピクセル/秒
  isAlive: boolean;
  // 英語学習関連
  englishWord?: string; // 敵が表す英単語
  difficulty: "easy" | "normal" | "hard";
  // 特殊能力関連
  armor: number; // ダメージ軽減 (0-0.8で80%軽減まで)
  shield: number; // シールド（追加防御）
  maxShield: number; // 最大シールド
  regenRate: number; // 再生速度（秒あたり）
  isVisible: boolean; // ステルス状態
  lastRegenTime: number; // 最後の再生時間
  processed: boolean; // 報酬処理済みフラグ
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  isActive: boolean;
}

// タワーの種類
export type TowerType =
  | "basic" // 基本タワー（バランス型）
  | "sniper" // スナイパータワー（高攻撃力・低射程）
  | "rapid"; // ラピッドタワー（低攻撃力・高射程・高速）

// タワーの型定義（シンプル版）
export interface Tower {
  id: string;
  name: string;
  type: TowerType;
  position: Position;
  damage: number;
  range: number; // ピクセル
  attackSpeed: number; // 攻撃間隔（ミリ秒）
  lastAttackTime: number;
  cost: number; // タワーのコスト
  // ドロップアイテムによる一時強化
  tempBoosts: {
    damageBoost: number; // 攻撃力ブースト値
    rangeBoost: number; // 射程ブースト値
    speedBoost: number; // 攻撃速度ブースト値（割合）
  };
}

// ゲーム状態
export interface GameState {
  gameId: string;
  level: number;
  score: number;
  lives: number;
  money: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  isGameOver: boolean;
  isPaused: boolean;
  isRunning: boolean;
  health: number; // プレイヤーの体力
  maxHealth: number;
  // リソース
  gold: number;
  xp: number;
  xpEarned: number;
  // ウェーブシステム
  currentWave: number;
  waveStartTime: number;
  enemiesSpawnedInWave: number;
  timeElapsed: number; // ゲーム開始からの経過時間（秒）
  // ゲーム速度
  gameSpeed: 1 | 2 | 3; // 1倍、2倍、3倍
  // ドロップアイテム
  dropItems: DropItem[];
  // タワー選択
  selectedTowerType: TowerType | null;
  // アクティブなブースト
  activeBoosts: {
    damageBoost: number;
    rangeBoost: number;
    speedBoost: number;
    goldMultiplier: number;
    xpMultiplier: number;
  };
}

// ドロップアイテムの種類
export type DropItemType =
  | "damage-boost" // 攻撃力アップ
  | "range-boost" // 射程アップ
  | "speed-boost" // 攻撃速度アップ
  | "gold-bonus" // ゴールドボーナス
  | "xp-bonus"; // XPボーナス

// XPショップアイテムの種類
export type XPShopItemType =
  | "damage-boost" // 全タワー攻撃力+5 (30秒)
  | "range-boost" // 全タワー射程+20 (30秒)
  | "speed-boost" // 全タワー攻撃速度+50% (30秒)
  | "gold-multiplier" // ゴールド獲得+100% (60秒)
  | "xp-multiplier" // XP獲得+100% (60秒)
  | "health-regen" // 体力+20
  | "wave-skip" // 現在のウェーブをスキップ
  | "learning-boost" // 学習効率ブースト
  | "vocabulary-boost" // 語彙習得ブースト
  | "grammar-boost" // 文法習得ブースト
  | "synergy-boost" // シナジー効果ブースト
  | "focus-boost"; // 集中力ブースト

// XPショップアイテム
export interface XPShopItem {
  id: string;
  type: XPShopItemType;
  name: string;
  description: string;
  cost: number;
  icon: string;
  duration?: number; // 効果時間（秒）
}

// ドロップアイテム
export interface DropItem {
  id: string;
  type: DropItemType;
  position: Position;
  value: number; // 効果の値
  isPercentage: boolean; // パーセンテージ効果かどうか
  rarity: "common" | "rare" | "epic" | "legendary";
  spawnTime: number; // 生成時刻
  lifetime: number; // 生存時間（ミリ秒）
  isCollected: boolean; // 収集済みフラグ
}

// ゲーム設定
export interface GameConfig {
  // フィールドサイズ
  fieldWidth: number;
  fieldHeight: number;
  // 敵の進路（シンプルに直線）
  enemyPath: Position[];
  // 初期設定
  initialHealth: number;
  initialGold: number;
}
