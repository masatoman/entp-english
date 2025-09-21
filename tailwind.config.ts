import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ==========================================
      // ENTP英語学習アプリ カスタムカラーパレット
      // ==========================================
      colors: {
        // ベースカラー（信頼感・安定感）
        base: {
          gunmetal: {
            DEFAULT: "#30343F", // メインテキスト、重要な境界線
            light: "#4A4E59", // サブテキスト
            dark: "#1C1F26", // 強調境界線
          },
          "ghost-white": "#FAFAFF", // メイン背景色
          periwinkle: {
            DEFAULT: "#E4D9FF", // セクション背景、カード背景
            light: "#F0EBFF", // 軽い背景
            dark: "#D1C4FF", // ホバー状態
          },
          "delft-blue": {
            DEFAULT: "#273469", // ヘッダー、フッター、重要なボタン
            light: "#3A4B7C", // ホバー状態
            dark: "#1F2856", // プレス状態
          },
          "space-cadet": "#1E2749", // ナビゲーション、アクティブ状態
        },

        // アクセントカラー（ゲーミフィケーション）
        accent: {
          orange: {
            DEFAULT: "#FFAA66", // 行動促進・報酬・XP獲得
            light: "#FFBB88", // ホバー状態
            dark: "#FF9944", // プレス状態
          },
        },

        // ステータスカラー
        status: {
          success: {
            DEFAULT: "#70E000", // 成功・レベルアップ・達成
            light: "#88E822", // ホバー状態
            dark: "#58B800", // プレス状態
          },
          error: {
            DEFAULT: "#FF4D6D", // 失敗・エラー・警告
            light: "#FF6B85", // ホバー状態
            dark: "#FF2F55", // プレス状態
          },
          warning: {
            DEFAULT: "#FFAA66", // 注意・ヒント（オレンジと同じ）
            light: "#FFBB88",
            dark: "#FF9944",
          },
          info: {
            DEFAULT: "#273469", // 情報表示（デルフトブルーと同じ）
            light: "#3A4B7C",
            dark: "#1F2856",
          },
        },

        // ゲーミフィケーション専用カラー
        game: {
          xp: "#FFAA66", // XP関連
          "level-up": "#70E000", // レベルアップ
          heart: "#FF4D6D", // ハート（体力）
          star: "#FFAA66", // スター（スタミナ）
          coin: "#FFAA66", // コイン
          combo: "#FFAA66", // コンボ
          critical: "#70E000", // クリティカル
          treasure: "#FFAA66", // 宝箱
          achievement: "#70E000", // 実績
        },

        // フィードバック専用カラー
        feedback: {
          correct: "#70E000", // 正解
          incorrect: "#FF4D6D", // 不正解
          hint: "#FFAA66", // ヒント
          explanation: "#273469", // 解説
        },

        // shadcn/ui互換カラー（既存システムとの統合）
        border: "#E4D9FF", // デフォルト境界線
        input: "#F0EBFF", // 入力フィールド背景
        ring: "#273469", // フォーカスリング
        background: "#FAFAFF", // ページ背景
        foreground: "#30343F", // メインテキスト
        primary: {
          DEFAULT: "#273469", // プライマリボタン
          foreground: "#FAFAFF", // プライマリボタンテキスト
        },
        secondary: {
          DEFAULT: "#E4D9FF", // セカンダリボタン
          foreground: "#30343F", // セカンダリボタンテキスト
        },
        destructive: {
          DEFAULT: "#FF4D6D", // 危険ボタン
          foreground: "#FAFAFF", // 危険ボタンテキスト
        },
        muted: {
          DEFAULT: "#F0EBFF", // ミュート背景
          foreground: "#4A4E59", // ミュートテキスト
        },
        accent: {
          DEFAULT: "#FFAA66", // アクセント
          foreground: "#1C1F26", // アクセントテキスト
        },
        popover: {
          DEFAULT: "#FAFAFF", // ポップオーバー背景
          foreground: "#30343F", // ポップオーバーテキスト
        },
        card: {
          DEFAULT: "#FAFAFF", // カード背景
          foreground: "#30343F", // カードテキスト
        },
      },

      // ==========================================
      // カスタムグラデーション
      // ==========================================
      backgroundImage: {
        // ベースグラデーション
        "app-gradient": "linear-gradient(135deg, #FAFAFF 0%, #F0EBFF 100%)",
        "header-gradient":
          "linear-gradient(90deg, #1E2749 0%, #273469 50%, #1E2749 100%)",

        // ゲーミフィケーション用グラデーション
        "xp-gradient": "linear-gradient(90deg, #FFAA66 0%, #FF9944 100%)",
        "level-gradient": "linear-gradient(90deg, #70E000 0%, #58B800 100%)",
        "heart-gradient": "linear-gradient(90deg, #FF4D6D 0%, #FF2F55 100%)",
        "star-gradient": "linear-gradient(90deg, #FFAA66 0%, #FFBB88 100%)",
        "coin-gradient": "linear-gradient(90deg, #FFAA66 0%, #FF9944 100%)",

        // カード用グラデーション
        "card-gacha": "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        "card-learning": "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
        "card-achievement": "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
        "card-special": "linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 100%)",
      },

      // ==========================================
      // カスタムシャドウ
      // ==========================================
      boxShadow: {
        game: "0 4px 14px 0 rgba(30, 39, 73, 0.15)",
        card: "0 2px 8px 0 rgba(48, 52, 63, 0.1)",
        button: "0 2px 4px 0 rgba(30, 39, 73, 0.2)",
        level: "0 0 20px 0 rgba(255, 170, 102, 0.3)",
        success: "0 0 15px 0 rgba(112, 224, 0, 0.3)",
        warning: "0 0 15px 0 rgba(255, 77, 109, 0.3)",
        xp: "0 0 12px 0 rgba(255, 170, 102, 0.4)",
        heart: "0 0 8px 0 rgba(255, 77, 109, 0.3)",
        star: "0 0 8px 0 rgba(255, 170, 102, 0.3)",
      },

      // ==========================================
      // ゲーミフィケーション用アニメーション
      // ==========================================
      animation: {
        "xp-pulse": "xp-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "level-bounce": "level-bounce 1s ease-in-out 3",
        "treasure-shake": "treasure-shake 0.5s ease-in-out",
        "combo-glow": "combo-glow 2s ease-in-out infinite",
        "critical-flash": "critical-flash 0.8s ease-out",
      },

      keyframes: {
        "xp-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 12px 0 rgba(255, 170, 102, 0.4)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
            boxShadow: "0 0 20px 0 rgba(255, 170, 102, 0.6)",
          },
        },
        "level-bounce": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -15px, 0)" },
          "70%": { transform: "translate3d(0, -7px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
        "treasure-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        "combo-glow": {
          "0%, 100%": {
            boxShadow: "0 0 8px 0 rgba(255, 170, 102, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 16px 0 rgba(255, 170, 102, 0.6)",
          },
        },
        "critical-flash": {
          "0%": {
            backgroundColor: "rgba(112, 224, 0, 0.2)",
            transform: "scale(1)",
          },
          "50%": {
            backgroundColor: "rgba(112, 224, 0, 0.4)",
            transform: "scale(1.02)",
          },
          "100%": {
            backgroundColor: "transparent",
            transform: "scale(1)",
          },
        },
      },

      // ==========================================
      // レスポンシブ拡張
      // ==========================================
      screens: {
        xs: "320px", // 極小スマホ
        sm: "640px", // スマホ
        md: "768px", // タブレット
        lg: "1024px", // デスクトップ
        xl: "1280px", // 大画面
        "2xl": "1536px", // 超大画面
      },

      // ==========================================
      // フォントサイズ拡張
      // ==========================================
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },

      // ==========================================
      // スペーシング拡張
      // ==========================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
