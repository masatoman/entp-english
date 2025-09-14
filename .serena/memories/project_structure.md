# プロジェクト構造詳細

## ディレクトリ構成
```
entp-english/
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   │   ├── ui/            # 再利用可能なUIコンポーネント (48個)
│   │   ├── Home.tsx       # ホーム画面
│   │   ├── VocabularyCard.tsx # 語彙学習
│   │   ├── GrammarQuiz.tsx # 文法クイズ
│   │   ├── CombinedTest.tsx # 総合テスト
│   │   ├── TimeAttackMode.tsx # タイムアタックモード
│   │   ├── SimpleTowerDefense.tsx # タワーディフェンスゲーム
│   │   ├── Achievements.tsx # 実績画面
│   │   ├── PWAInstallPrompt.tsx # PWAインストールプロンプト
│   │   ├── PWAUpdatePrompt.tsx # PWA更新プロンプト
│   │   └── ...
│   ├── data/              # データファイル
│   │   ├── questions.ts   # 問題データ
│   │   ├── vocabulary.ts  # 語彙データ
│   │   ├── achievements.ts # 実績データ
│   │   ├── combinedTest.ts # 総合テストデータ
│   │   ├── xpShop.ts     # XPショップデータ
│   │   └── ...
│   ├── types/             # TypeScript型定義
│   │   ├── index.ts      # 基本型定義
│   │   └── simple-game.ts # ゲーム関連型定義
│   ├── utils/             # ユーティリティ関数
│   │   ├── dataManager.ts # データ管理
│   │   ├── xpCalculator.ts # XP計算
│   │   ├── tower-defense-data.ts # ゲームデータ
│   │   └── ...
│   ├── styles/            # スタイルファイル
│   │   └── globals.css
│   ├── test/              # テストファイル
│   │   ├── e2e/          # E2Eテスト
│   │   ├── integration/  # 統合テスト
│   │   └── unit/         # ユニットテスト
│   ├── App.tsx           # メインアプリケーション
│   └── main.tsx          # エントリーポイント
├── docs/                  # ドキュメント
│   ├── overview.md       # プロジェクト概要
│   ├── tech-specs.md     # 技術仕様
│   ├── development-workflow.md # 開発フロー
│   └── ...
├── public/               # 静的ファイル
│   ├── pwa-192x192.png  # PWAアイコン
│   ├── pwa-512x512.png  # PWAアイコン
│   └── sw-custom.js     # カスタムService Worker
├── build/                # ビルド出力
├── dist/                 # 配布用ファイル
├── test-results/         # テスト結果
├── playwright-report/    # Playwrightテストレポート
├── package.json         # パッケージ設定
├── vite.config.ts       # Vite設定
├── playwright.config.ts # Playwright設定
└── README.md            # プロジェクト説明
```

## 主要ファイルの役割

### エントリーポイント
- `src/main.tsx`: アプリケーションのエントリーポイント
- `src/App.tsx`: メインアプリケーションコンポーネント

### コンポーネント
- `src/components/Home.tsx`: ホーム画面
- `src/components/Question.tsx`: 問題表示コンポーネント
- `src/components/Results.tsx`: 結果表示コンポーネント
- `src/components/SimpleTowerDefense.tsx`: タワーディフェンスゲーム

### データ管理
- `src/data/questions.ts`: 文法問題データ
- `src/data/vocabulary.ts`: 語彙データ
- `src/data/achievements.ts`: 実績データ
- `src/utils/dataManager.ts`: データ管理ユーティリティ

### 型定義
- `src/types/index.ts`: 基本型定義
- `src/types/simple-game.ts`: ゲーム関連型定義

### 設定ファイル
- `vite.config.ts`: Viteビルド設定
- `playwright.config.ts`: Playwrightテスト設定
- `package.json`: パッケージ依存関係

## コンポーネント設計パターン

### 画面コンポーネント
- 各学習モードに対応する画面コンポーネント
- 状態管理とナビゲーション機能

### UIコンポーネント
- 再利用可能な48個のUIコンポーネント
- Radix UIベースのアクセシブルなコンポーネント

### ゲームコンポーネント
- タワーディフェンスゲーム
- XPシステムと実績システム

### PWAコンポーネント
- インストールプロンプト
- 更新通知
- オフライン対応