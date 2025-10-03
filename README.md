# ENTP 英語学習アプリ

ENTP（外向的直感思考知覚）タイプの学習者が飽きずに楽しく英語学習を継続できる Progressive Web App (PWA)。

## 特徴

### 🎯 学習機能

- **多様な学習モード**: 語彙学習、文法クイズ、リスニング、英作文、総合テスト、タイムアタック
- **TOEIC 模擬テスト**: 本格的な TOEIC 形式の模擬テスト（事前学習連携・スキルツリー連動）
- **学習パスチャレンジ**: 最適な学習パスに基づく段階的チャレンジシステム
- **事前学習システム**: 理論学習から実践への橋渡し
- **スキルツリー**: 文法スキルの可視化と進捗管理

### 🎮 ゲーミフィケーション

- **XP システム**: 学習成果に応じた経験値獲得
- **アチーブメント**: 多様な達成目標と報酬システム
- **ガチャシステム**: 語彙カード収集とコレクション機能
- **ハートシステム**: 学習スタミナ管理
- **デイリーチャレンジ**: 日々の学習継続をサポート
- **タワーディフェンス**: 学習要素を含むゲーム

### 🔗 統合システム

- **シナジー効果**: 異なる学習モード間の連携ボーナス
- **インテリジェント推薦**: AI による個別化された問題推薦
- **統合ダッシュボード**: 全学習データの一元管理
- **詳細学習分析**: 個人の学習パターン分析と改善提案

### 💻 技術的特徴

- **PWA 対応**: インストール可能、オフライン学習対応
- **ENTP 特化設計**: 多様性、即効性、自由度を重視した学習体験
- **高性能**: 初回読み込み 13.5ms、全ブラウザ対応
- **アクセシビリティ**: WCAG 2.1 AA 準拠、キーボード操作対応
- **レスポンシブ**: デスクトップ・モバイル完全対応

## 技術スタック

### フロントエンド

- **React 18**: 最新の React 機能とパフォーマンス最適化
- **TypeScript**: 型安全性と開発効率の向上
- **Vite**: 高速ビルドと HMR（Hot Module Replacement）

### スタイリング・UI

- **Tailwind CSS v4**: ユーティリティファーストの CSS フレームワーク
- **shadcn/ui**: 高品質な UI コンポーネントライブラリ
- **Radix UI**: アクセシブルなプリミティブコンポーネント
- **Lucide React**: 一貫性のあるアイコンセット

### PWA・パフォーマンス

- **Vite PWA Plugin**: Service Worker 自動生成
- **Workbox**: キャッシュ戦略とオフライン対応
- **IndexedDB**: クライアントサイドデータ永続化
- **コード分割**: 動的インポートによる最適化

### データ管理・状態管理

- **React Hooks**: useState, useEffect, useContext
- **カスタムフック**: useDataManager, useLevelSystem, useHeartSystem
- **ローカルストレージ**: 学習進捗とユーザー設定の永続化

### テスト・品質保証

- **Playwright MCP**: E2E テスト自動化
- **Serena MCP**: コードベース分析
- **Linting**: ESLint, Prettier によるコード品質管理

## 開発開始

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# テスト実行
npm run test

# 本番ビルド
npm run build
```

## ドキュメント

### 📋 プロジェクト管理

- [プロジェクト概要](./docs/overview.md) - 全体像と目的
- [技術仕様](./docs/tech-specs.md) - アーキテクチャと技術詳細
- [開発フロー・ベストプラクティス](./docs/development-workflow.md) - 開発ガイドライン
- [プロジェクト状況スナップショット](./docs/project-snapshot.md) - 現在の進捗状況

### 🎯 機能ドキュメント

- [ユーザー構造](./docs/user-structure.md) - ユーザー体験設計
- [要件定義](./docs/requirements.md) - 機能要件と非機能要件
- [タイムライン](./docs/timeline.md) - 開発スケジュール
- [PWA 機能](./docs/pwa-features.md) - Progressive Web App 機能

### 🧪 テスト・品質

- [テスト戦略](./docs/testing-strategy.md) - テスト方針と実装
- [E2E テストルール](./docs/e2e-testing-rules.md) - エンドツーエンドテスト
- [Git Push エラー対応](./docs/git-push-error-handling.md) - 品質管理ルール

### 🎮 ゲーム・システム設計

- [スキルツリーデザイン](./docs/comprehensive-skill-tree-design.md) - スキルツリーシステム
- [シナジーシステム設計](./docs/synergy-system-design.md) - 学習モード間連携
- [タワーディフェンス設計](./docs/tower-defense-clicker-design.md) - ゲーム機能設計

## 新チャット開始時の確認事項

新しいチャットセッションを開始する際は、以下を確認してください：

1. **プロジェクト状況の確認**: [project-snapshot.md](./docs/project-snapshot.md)
2. **開発フローの確認**: [development-workflow.md](./docs/development-workflow.md)
3. **技術スタックの確認**: [tech-specs.md](./docs/tech-specs.md)

## ライセンス

Private
