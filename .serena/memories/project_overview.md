# ENTP英語学習アプリ - プロジェクト概要

## プロジェクトの目的
ENTP（外向的直感思考知覚）タイプの学習者が飽きずに楽しく英語学習を継続できるProgressive Web App (PWA)。

## 主要機能
- **多様な学習モード**: 語彙学習、文法クイズ、総合テスト、タイムアタック、タワーディフェンスゲーム
- **PWA対応**: インストール可能、オフライン学習対応
- **ゲーミフィケーション**: XPシステム、アチーブメント、タワーディフェンスゲーム
- **ENTP特化設計**: 多様性、即効性、自由度を重視した学習体験

## 技術スタック
- **フロントエンド**: React 18.3.1, TypeScript, Vite 6.3.5
- **スタイリング**: Tailwind CSS, Radix UI (48個のUIコンポーネント)
- **PWA**: Vite PWA Plugin, Workbox, カスタムService Worker
- **ゲーム**: タワーディフェンス、クリッカー要素
- **テスト**: Vitest, Playwright (MCP Playwright Server対応)
- **ビルド**: Vite + SWC (高速コンパイル)

## アーキテクチャ
- **レイヤードアーキテクチャ**: プレゼンテーション層、ビジネスロジック層、データ層の明確な分離
- **コンポーネント駆動**: 再利用可能なUIコンポーネントによる統一されたデザインシステム
- **状態管理**: 中央集権型のDataManagerと分散型のuseStateのハイブリッド
- **型安全性**: 厳密なTypeScript型定義による型安全性の確保

## プロジェクト構造
```
src/
├── components/           # Reactコンポーネント
│   ├── ui/              # 再利用可能なUIコンポーネント (48個)
│   ├── Home.tsx         # ホーム画面
│   ├── VocabularyCard.tsx # 語彙学習
│   ├── GrammarQuiz.tsx  # 文法クイズ
│   ├── CombinedTest.tsx # 総合テスト
│   ├── TimeAttackMode.tsx # タイムアタックモード
│   ├── SimpleTowerDefense.tsx # タワーディフェンスゲーム
│   ├── Achievements.tsx # 実績画面
│   └── ...
├── data/                # データファイル
│   ├── questions.ts     # 問題データ
│   ├── vocabulary.ts    # 語彙データ
│   ├── achievements.ts  # 実績データ
│   └── ...
├── types/               # TypeScript型定義
├── utils/               # ユーティリティ関数
├── styles/              # スタイルファイル
├── App.tsx              # メインアプリケーション
└── main.tsx             # エントリーポイント
```

## 開発環境
- **OS**: Darwin (macOS)
- **Node.js**: 最新版
- **パッケージマネージャー**: npm
- **開発サーバー**: Vite Dev Server (ポート3000)
- **ビルド出力**: build/ ディレクトリ