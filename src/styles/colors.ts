/**
 * ENTP英語学習アプリ - カラーパレット定義
 * ゲーミフィケーション対応のカラーシステム
 */

// ==========================================
// ベースカラーパレット（信頼感・安定感）
// ==========================================

export const baseColors = {
  // メインベースカラー
  gunmetal: '#30343F',        // ダークグレー - メインテキスト、重要な境界線
  ghostWhite: '#FAFAFF',      // ほぼ白 - メイン背景色
  periwinkle: '#E4D9FF',      // 薄紫 - セクション背景、カード背景
  delftBlue: '#273469',       // 深青 - ヘッダー、フッター、重要なボタン
  spaceCadet: '#1E2749',      // 最深青 - ナビゲーション、アクティブ状態

  // ベースカラーのバリエーション
  gunmetalLight: '#4A4E59',   // ライトグレー - サブテキスト
  gunmetalDark: '#1C1F26',    // ダークグレー - 強調境界線
  periwinkleLight: '#F0EBFF', // 極薄紫 - 軽い背景
  periwinkleDark: '#D1C4FF',  // 濃紫 - ホバー状態
  delftBlueLight: '#3A4B7C',  // ライト深青 - ホバー状態
  delftBlueDark: '#1F2856',   // ダーク深青 - プレス状態
} as const;

// ==========================================
// ゲーミフィケーション アクセントカラー
// ==========================================

export const accentColors = {
  // 行動促進・報酬用（温かみのあるオレンジ）
  accentOrange: '#FFAA66',    // メインオレンジ - XP獲得、報酬、CTA
  accentOrangeLight: '#FFBB88', // ライトオレンジ - ホバー状態
  accentOrangeDark: '#FF9944', // ダークオレンジ - プレス状態

  // 成功・レベルアップ用（鮮やかなグリーン）
  successGreen: '#70E000',    // メイングリーン - 成功、レベルアップ、達成
  successGreenLight: '#88E822', // ライトグリーン - ホバー状態
  successGreenDark: '#58B800', // ダークグリーン - プレス状態

  // 失敗・エラー用（目立つレッド）
  warningRed: '#FF4D6D',      // メインレッド - エラー、失敗、警告
  warningRedLight: '#FF6B85',  // ライトレッド - ホバー状態
  warningRedDark: '#FF2F55',   // ダークレッド - プレス状態
} as const;

// ==========================================
// 機能別カラーマッピング
// ==========================================

export const functionalColors = {
  // レベル・経験値システム
  level: {
    background: baseColors.delftBlue,
    text: baseColors.ghostWhite,
    accent: accentColors.accentOrange,
    progress: accentColors.successGreen,
  },

  // ゲーミフィケーション要素
  gamification: {
    xp: accentColors.accentOrange,        // XP獲得
    levelUp: accentColors.successGreen,   // レベルアップ
    reward: accentColors.accentOrange,    // 報酬
    achievement: accentColors.successGreen, // 実績達成
    combo: accentColors.accentOrange,     // コンボ
    critical: accentColors.successGreen,  // クリティカル
    treasure: accentColors.accentOrange,  // 宝箱
  },

  // UI状態
  states: {
    success: accentColors.successGreen,   // 成功状態
    error: accentColors.warningRed,       // エラー状態
    warning: accentColors.accentOrange,   // 警告状態
    info: baseColors.delftBlue,          // 情報表示
    disabled: baseColors.gunmetalLight,   // 無効状態
  },

  // ボタンシステム
  buttons: {
    primary: {
      bg: baseColors.delftBlue,
      text: baseColors.ghostWhite,
      hover: baseColors.delftBlueLight,
      active: baseColors.delftBlueDark,
    },
    secondary: {
      bg: baseColors.periwinkle,
      text: baseColors.gunmetal,
      hover: baseColors.periwinkleDark,
      active: baseColors.periwinkleLight,
    },
    accent: {
      bg: accentColors.accentOrange,
      text: baseColors.ghostWhite,
      hover: accentColors.accentOrangeLight,
      active: accentColors.accentOrangeDark,
    },
    success: {
      bg: accentColors.successGreen,
      text: baseColors.ghostWhite,
      hover: accentColors.successGreenLight,
      active: accentColors.successGreenDark,
    },
    danger: {
      bg: accentColors.warningRed,
      text: baseColors.ghostWhite,
      hover: accentColors.warningRedLight,
      active: accentColors.warningRedDark,
    },
  },

  // カードシステム
  cards: {
    background: baseColors.ghostWhite,
    border: baseColors.periwinkle,
    shadow: `${baseColors.gunmetal}20`, // 20% opacity
    hover: baseColors.periwinkleLight,
    
    // カテゴリー別カード色
    gacha: {
      bg: '#FFF7ED',      // オレンジ系背景
      border: accentColors.accentOrange,
      text: '#9A3412',    // ダークオレンジテキスト
    },
    learning: {
      bg: '#F0F9FF',      // ブルー系背景
      border: baseColors.delftBlue,
      text: baseColors.spaceCadet,
    },
    achievement: {
      bg: '#F0FDF4',      // グリーン系背景
      border: accentColors.successGreen,
      text: '#166534',    // ダークグリーンテキスト
    },
    special: {
      bg: '#FDF4FF',      // パープル系背景
      border: '#A855F7',  // パープル境界線
      text: '#7C2D92',    // ダークパープルテキスト
    },
  },
} as const;

// ==========================================
// Tailwind CSS カスタムカラー定義
// ==========================================

export const tailwindColors = {
  // ベースカラー
  'gunmetal': baseColors.gunmetal,
  'gunmetal-light': baseColors.gunmetalLight,
  'gunmetal-dark': baseColors.gunmetalDark,
  'ghost-white': baseColors.ghostWhite,
  'periwinkle': baseColors.periwinkle,
  'periwinkle-light': baseColors.periwinkleLight,
  'periwinkle-dark': baseColors.periwinkleDark,
  'delft-blue': baseColors.delftBlue,
  'delft-blue-light': baseColors.delftBlueLight,
  'delft-blue-dark': baseColors.delftBlueDark,
  'space-cadet': baseColors.spaceCadet,

  // アクセントカラー
  'accent-orange': accentColors.accentOrange,
  'accent-orange-light': accentColors.accentOrangeLight,
  'accent-orange-dark': accentColors.accentOrangeDark,
  'success-green': accentColors.successGreen,
  'success-green-light': accentColors.successGreenLight,
  'success-green-dark': accentColors.successGreenDark,
  'warning-red': accentColors.warningRed,
  'warning-red-light': accentColors.warningRedLight,
  'warning-red-dark': accentColors.warningRedDark,
} as const;

// ==========================================
// 使用ガイドライン
// ==========================================

export const colorUsageGuidelines = {
  // 基本方針
  philosophy: {
    base: "ブルー系で信頼感と安定感を提供",
    accent: "ゲーミフィケーション要素でポップなアクセントを追加",
    balance: "落ち着いた学習環境 + 楽しいゲーム要素の両立",
  },

  // 具体的な使い分け
  usage: {
    backgrounds: {
      main: baseColors.ghostWhite,          // メイン背景
      section: baseColors.periwinkleLight,  // セクション背景
      card: baseColors.ghostWhite,          // カード背景
      header: baseColors.delftBlue,         // ヘッダー背景
    },
    
    text: {
      primary: baseColors.gunmetal,         // メインテキスト
      secondary: baseColors.gunmetalLight,  // サブテキスト
      onDark: baseColors.ghostWhite,        // ダーク背景上のテキスト
      accent: baseColors.delftBlue,         // アクセントテキスト
    },

    interactive: {
      primary: baseColors.delftBlue,        // プライマリボタン
      secondary: baseColors.periwinkle,     // セカンダリボタン
      accent: accentColors.accentOrange,    // アクションボタン
      success: accentColors.successGreen,   // 成功ボタン
      danger: accentColors.warningRed,      // 危険ボタン
    },

    gamification: {
      xpGain: accentColors.accentOrange,    // XP獲得
      levelUp: accentColors.successGreen,   // レベルアップ
      combo: accentColors.accentOrange,     // コンボ
      critical: accentColors.successGreen,  // クリティカル
      treasure: accentColors.accentOrange,  // 宝箱
      achievement: accentColors.successGreen, // 実績
      heart: accentColors.warningRed,       // ハート（体力）
      star: accentColors.accentOrange,      // スター（スタミナ）
      coin: accentColors.accentOrange,      // コイン
    },

    feedback: {
      correct: accentColors.successGreen,   // 正解
      incorrect: accentColors.warningRed,   // 不正解
      hint: accentColors.accentOrange,      // ヒント
      explanation: baseColors.delftBlue,    // 解説
    },
  },

  // アクセシビリティ基準
  accessibility: {
    contrastRatio: {
      normal: 4.5,    // 通常テキスト
      large: 3.0,     // 大きなテキスト
      ui: 3.0,        // UIコンポーネント
    },
    
    colorBlindness: {
      redGreen: "オレンジとグリーンの組み合わせで色覚異常に配慮",
      blueYellow: "ブルーベースで青黄色覚異常にも対応",
    },
  },
} as const;

// ==========================================
// CSS変数エクスポート（Tailwind連携用）
// ==========================================

export const cssVariables = {
  ':root': {
    // ベースカラー
    '--color-gunmetal': baseColors.gunmetal,
    '--color-ghost-white': baseColors.ghostWhite,
    '--color-periwinkle': baseColors.periwinkle,
    '--color-delft-blue': baseColors.delftBlue,
    '--color-space-cadet': baseColors.spaceCadet,

    // アクセントカラー
    '--color-accent-orange': accentColors.accentOrange,
    '--color-success-green': accentColors.successGreen,
    '--color-warning-red': accentColors.warningRed,

    // 機能別カラー
    '--color-xp': accentColors.accentOrange,
    '--color-level-up': accentColors.successGreen,
    '--color-heart': accentColors.warningRed,
    '--color-star': accentColors.accentOrange,
    '--color-coin': accentColors.accentOrange,
  },
} as const;

// ==========================================
// ユーティリティ関数
// ==========================================

/**
 * カラーの透明度を調整
 */
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

/**
 * ゲーミフィケーション要素のカラーを取得
 */
export const getGamificationColor = (type: keyof typeof functionalColors.gamification): string => {
  return functionalColors.gamification[type];
};

/**
 * ボタンの状態別カラーを取得
 */
export const getButtonColors = (variant: keyof typeof functionalColors.buttons) => {
  return functionalColors.buttons[variant];
};

/**
 * カードの種類別カラーを取得
 */
export const getCardColors = (type: keyof typeof functionalColors.cards | 'default' = 'default') => {
  if (type === 'default') {
    return {
      bg: functionalColors.cards.background,
      border: functionalColors.cards.border,
      text: baseColors.gunmetal,
    };
  }
  return functionalColors.cards[type];
};
