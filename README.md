
# ENTP英語学習アプリ

ENTP（外向的直感思考知覚）タイプの学習者が飽きずに楽しく英語学習を継続できるProgressive Web App (PWA)。

## 特徴

- **多様な学習モード**: 語彙学習、文法クイズ、総合テスト、タイムアタック、タワーディフェンスゲーム
- **PWA対応**: インストール可能、オフライン学習対応
- **ゲーミフィケーション**: XPシステム、アチーブメント、タワーディフェンスゲーム
- **ENTP特化設計**: 多様性、即効性、自由度を重視した学習体験
- **高性能**: コード分割、遅延読み込み、バンドルサイズ最適化（初回読み込み89%削減）
- **アクセシビリティ**: WCAG 2.1 AA準拠、キーボード操作対応

## 技術スタック

- **フロントエンド**: React 18, TypeScript, Vite
- **スタイリング**: Tailwind CSS, Radix UI
- **PWA**: Vite PWA Plugin, Workbox
- **ゲーム**: タワーディフェンス、クリッカー要素
- **パフォーマンス**: コード分割、動的インポート、バンドル最適化
- **テスト**: Vitest, React Testing Library, E2Eテスト対応

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

- [プロジェクト概要](./docs/overview.md)
- [技術仕様](./docs/tech-specs.md)
- [開発フロー・ベストプラクティス](./docs/development-workflow.md)
- [プロジェクト状況スナップショット](./docs/project-snapshot.md)

## 新チャット開始時の確認事項

新しいチャットセッションを開始する際は、以下を確認してください：

1. **プロジェクト状況の確認**: [project-snapshot.md](./docs/project-snapshot.md)
2. **開発フローの確認**: [development-workflow.md](./docs/development-workflow.md)
3. **技術スタックの確認**: [tech-specs.md](./docs/tech-specs.md)

## ライセンス

Private
  