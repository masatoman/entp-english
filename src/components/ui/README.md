# UI Components Library

## Overview

このディレクトリには、ENTP 英語学習アプリで使用される再利用可能な UI コンポーネントが含まれています。shadcn/ui + Tailwind CSS ベースのデザインシステムを採用しています。

## Component Categories

### Base Components (shadcn/ui)

#### Layout Components

- `card.tsx` - 基本カードレイアウト
- `separator.tsx` - セクション区切り
- `scroll-area.tsx` - スクロール領域

#### Form Components

- `button.tsx` - ボタン要素
- `input.tsx` - 入力フィールド
- `select.tsx` - 選択ドロップダウン
- `checkbox.tsx` - チェックボックス
- `radio-group.tsx` - ラジオボタン

#### Feedback Components

- `alert.tsx` - アラート表示
- `badge.tsx` - ステータスバッジ
- `progress.tsx` - 進捗バー
- `skeleton.tsx` - ローディング状態

### Custom Components

#### Selection Components

- `selection-card.tsx` - 統一された選択カード UI

#### Accessible Components

- `AccessibleButton.tsx` - アクセシブルボタン
- `AccessibleCard.tsx` - アクセシブルカード
- `AccessibleProgress.tsx` - アクセシブル進捗バー

#### Animation Components

- `AnimatedCard.tsx` - アニメーション付きカード

## SelectionCard Component

### Purpose

文法クイズのカテゴリ選択と事前学習のコンテンツ選択で統一された UI を提供する共通コンポーネント。

### Props Interface

```typescript
export interface SelectionCardProps {
  id: string; // ユニークID
  title: string; // カードタイトル
  description: string; // 短い説明
  detail?: string; // 詳細説明（オプション）
  icon?: string; // アイコン絵文字（オプション）
  difficulty?: string; // 難易度バッジ（オプション）
  level?: string | number; // レベル表示（オプション）
  color?: string; // カスタムカラー（オプション）
  isLocked?: boolean; // ロック状態
  isCompleted?: boolean; // 完了状態
  isRecommended?: boolean; // 推奨状態
  duration?: string; // 所要時間（オプション）
  category?: string; // カテゴリ（オプション）
  keyPoints?: string[]; // 重要ポイント（オプション）
  onClick: (id: string) => void; // クリックハンドラー
}
```

### Usage Examples

#### Basic Usage

```tsx
<SelectionCard
  id="basic-grammar"
  title="基本文型"
  description="be動詞・一般動詞"
  detail="I am / You are / He has など基本的な文の構造"
  difficulty="初級"
  onClick={(id) => handleSelect(id)}
/>
```

#### With Icon and Level

```tsx
<SelectionCard
  id="theory-1"
  title="英語の基本構造"
  description="⭐️ 文法基礎"
  detail="理論学習 - theory"
  icon="💡"
  difficulty="beginner"
  level={1}
  duration="5分"
  onClick={(id) => handleSelect(id)}
/>
```

#### With States

```tsx
{
  /* ロック状態 */
}
<SelectionCard {...props} isLocked={true} />;

{
  /* 完了状態 */
}
<SelectionCard {...props} isCompleted={true} />;

{
  /* 推奨状態 */
}
<SelectionCard {...props} isRecommended={true} />;
```

### Visual States

#### Default State

- 白背景、グレーボーダー
- ホバー時：シャドウとスケールアップ
- アクティブ時：スケールダウン

#### Locked State

- グレー背景、透明度 60%
- 🔒 アイコン表示
- クリック無効

#### Completed State

- 緑背景、緑ボーダー
- ✓ チェックマーク表示

#### Recommended State

- 青いリング表示
- 🎯 推奨バッジ表示

### Accessibility Features

#### Keyboard Navigation

- Tab 順序でアクセス可能
- Enter キーでクリック実行
- フォーカス表示

#### Screen Reader Support

- 適切なセマンティック HTML
- ARIA 属性の実装
- 状態の音声読み上げ

#### Color Contrast

- WCAG 2.1 AA 準拠
- 4.5:1 以上のコントラスト比
- カラーブラインド対応

## Best Practices

### Component Creation

1. **shadcn/ui 優先**: 既存コンポーネントを最初に確認
2. **再利用性**: 汎用的なプロパティ設計
3. **型安全性**: TypeScript の厳密な型定義
4. **アクセシビリティ**: WCAG 2.1 AA 準拠

### Styling Guidelines

1. **Tailwind ユーティリティ**: 直接 CSS より優先
2. **一貫性**: 同じパターンのスタイリング
3. **レスポンシブ**: モバイルファーストのアプローチ
4. **パフォーマンス**: 不要なスタイルの削除

### Testing

1. **ユニットテスト**: コンポーネントの単体テスト
2. **アクセシビリティテスト**: スクリーンリーダー対応確認
3. **E2E テスト**: 実際のユーザー操作テスト
4. **視覚的回帰テスト**: デザインの一貫性確認

## Maintenance

### Regular Tasks

- [ ] 新しい shadcn/ui コンポーネントの確認
- [ ] Tailwind CSS アップデートの適用
- [ ] アクセシビリティ監査の実施
- [ ] パフォーマンス最適化

### Documentation Updates

- [ ] 新コンポーネント追加時のドキュメント更新
- [ ] 使用例の追加と更新
- [ ] ベストプラクティスの見直し
- [ ] トラブルシューティングガイドの更新
