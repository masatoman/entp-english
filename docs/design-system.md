# ENTP 英語学習アプリ - デザインシステム

## 概要

このプロジェクトでは **shadcn/ui + Tailwind CSS** を使用したデザインシステムを採用しています。一貫性のある UI/UX を提供し、開発効率を向上させるために体系化されたコンポーネントライブラリを構築しています。

## 技術スタック

### Core Technologies

- **Tailwind CSS v4**: ユーティリティファーストの CSS フレームワーク
- **shadcn/ui**: Radix UI ベースの高品質コンポーネントライブラリ
- **Radix UI**: アクセシブルなプリミティブコンポーネント
- **TypeScript**: 型安全性を確保

### Utility Libraries

- **clsx**: 条件付きクラス名の管理
- **tailwind-merge**: Tailwind クラスの競合解決
- **class-variance-authority**: バリアントベースのスタイリング

## デザイントークン

### カラーパレット

#### Primary Colors

- **Blue**: `blue-50` to `blue-900` - メイン色彩
- **Indigo**: `indigo-50` to `indigo-900` - アクセント色

#### Semantic Colors

- **Success**: `green-50` to `green-900` - 成功状態
- **Warning**: `yellow-50` to `yellow-900` - 警告状態
- **Error**: `red-50` to `red-900` - エラー状態
- **Info**: `blue-50` to `blue-900` - 情報表示

#### System Colors

- **Gray**: `gray-50` to `gray-900` - テキスト・背景
- **White**: `white` - 基本背景
- **Black**: `black` - 強調テキスト

### Typography

#### Font Sizes

- **text-xs**: 12px - 補助情報
- **text-sm**: 14px - 通常テキスト
- **text-base**: 16px - 本文
- **text-lg**: 18px - 小見出し
- **text-xl**: 20px - 見出し
- **text-2xl**: 24px - 大見出し
- **text-3xl**: 30px - ページタイトル

#### Font Weights

- **font-normal**: 400 - 通常テキスト
- **font-medium**: 500 - 強調テキスト
- **font-semibold**: 600 - 小見出し
- **font-bold**: 700 - 見出し

### Spacing

#### Margins & Padding

- **1**: 4px - 最小間隔
- **2**: 8px - 小間隔
- **3**: 12px - 通常間隔
- **4**: 16px - 中間隔
- **6**: 24px - 大間隔
- **8**: 32px - 最大間隔

#### Grid Gaps

- **gap-2**: 8px - 密なグリッド
- **gap-3**: 12px - 通常グリッド
- **gap-4**: 16px - 広いグリッド
- **gap-6**: 24px - 最大グリッド

### Border Radius

- **rounded**: 4px - 基本角丸
- **rounded-lg**: 8px - 大きな角丸
- **rounded-full**: 50% - 完全な円形

## コンポーネントライブラリ

### Base Components (shadcn/ui)

#### Layout Components

- **Card**: `src/components/ui/card.tsx` - 基本カードレイアウト
- **Separator**: `src/components/ui/separator.tsx` - セクション区切り
- **Scroll Area**: `src/components/ui/scroll-area.tsx` - スクロール領域

#### Form Components

- **Button**: `src/components/ui/button.tsx` - ボタン要素
- **Input**: `src/components/ui/input.tsx` - 入力フィールド
- **Select**: `src/components/ui/select.tsx` - 選択ドロップダウン
- **Checkbox**: `src/components/ui/checkbox.tsx` - チェックボックス
- **Radio Group**: `src/components/ui/radio-group.tsx` - ラジオボタン

#### Feedback Components

- **Alert**: `src/components/ui/alert.tsx` - アラート表示
- **Badge**: `src/components/ui/badge.tsx` - ステータスバッジ
- **Progress**: `src/components/ui/progress.tsx` - 進捗バー
- **Skeleton**: `src/components/ui/skeleton.tsx` - ローディング状態

#### Navigation Components

- **Tabs**: `src/components/ui/tabs.tsx` - タブナビゲーション
- **Breadcrumb**: `src/components/ui/breadcrumb.tsx` - パンくずリスト
- **Pagination**: `src/components/ui/pagination.tsx` - ページネーション

#### Overlay Components

- **Dialog**: `src/components/ui/dialog.tsx` - モーダルダイアログ
- **Popover**: `src/components/ui/popover.tsx` - ポップオーバー
- **Tooltip**: `src/components/ui/tooltip.tsx` - ツールチップ

### Custom Components

#### Selection Components

- **SelectionCard**: `src/components/ui/selection-card.tsx` - 統一された選択カード

#### Accessible Components

- **AccessibleButton**: `src/components/ui/AccessibleButton.tsx` - アクセシブルボタン
- **AccessibleCard**: `src/components/ui/AccessibleCard.tsx` - アクセシブルカード
- **AccessibleProgress**: `src/components/ui/AccessibleProgress.tsx` - アクセシブル進捗バー

#### Animation Components

- **AnimatedCard**: `src/components/ui/AnimatedCard.tsx` - アニメーション付きカード

#### Feedback Components

- **FeedbackToast**: `src/components/ui/FeedbackToast.tsx` - フィードバックトースト

## デザインパターン

### Card Patterns

#### Basic Card

```tsx
<Card className="p-4">
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明文</CardDescription>
  </CardHeader>
  <CardContent>コンテンツ</CardContent>
</Card>
```

#### Selection Card

```tsx
<SelectionCard
  id="item-1"
  title="タイトル"
  description="説明文"
  detail="詳細情報"
  difficulty="初級"
  onClick={(id) => console.log(id)}
/>
```

#### Interactive Card

```tsx
<Card className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
  {/* コンテンツ */}
</Card>
```

### Button Patterns

#### Primary Button

```tsx
<Button variant="default" size="lg">
  メインアクション
</Button>
```

#### Secondary Button

```tsx
<Button variant="outline" size="md">
  サブアクション
</Button>
```

#### Icon Button

```tsx
<Button variant="ghost" size="icon">
  <Icon className="w-4 h-4" />
</Button>
```

### Layout Patterns

#### Page Layout

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
  <div className="max-w-4xl mx-auto">
    {/* ヘッダー */}
    <div className="flex items-center justify-between mb-6">
      <Button variant="outline" onClick={onBack}>
        ← 戻る
      </Button>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">ページタイトル</h1>
        <p className="text-gray-600 mt-2">説明文</p>
      </div>
      <div className="w-24" />
    </div>

    {/* コンテンツ */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* グリッドアイテム */}
    </div>
  </div>
</div>
```

#### Grid Layout

```tsx
{
  /* レスポンシブグリッド */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id}>{/* カードコンテンツ */}</Card>
  ))}
</div>;
```

### State Patterns

#### Loading State

```tsx
<Card className="p-4">
  <Skeleton className="h-4 w-full mb-2" />
  <Skeleton className="h-3 w-3/4" />
</Card>
```

#### Error State

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>エラー</AlertTitle>
  <AlertDescription>エラーメッセージ</AlertDescription>
</Alert>
```

#### Success State

```tsx
<Alert variant="default" className="border-green-200 bg-green-50">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertTitle className="text-green-800">成功</AlertTitle>
  <AlertDescription className="text-green-700">成功メッセージ</AlertDescription>
</Alert>
```

## アクセシビリティガイドライン

### WCAG 2.1 AA 準拠

#### Color Contrast

- **テキスト**: 最低 4.5:1 のコントラスト比
- **大きなテキスト**: 最低 3:1 のコントラスト比
- **UI 要素**: 最低 3:1 のコントラスト比

#### Keyboard Navigation

- **Tab 順序**: 論理的なタブ順序を確保
- **フォーカス表示**: 明確なフォーカスインジケーター
- **キーボード操作**: 全機能にキーボードでアクセス可能

#### Screen Reader Support

- **セマンティック HTML**: 適切な HTML 要素を使用
- **ARIA 属性**: 必要に応じて ARIA 属性を追加
- **ラベル**: 全フォーム要素に適切なラベル

### 実装例

#### Accessible Button

```tsx
<Button
  aria-label="詳細情報を表示"
  className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  詳細
</Button>
```

#### Accessible Card

```tsx
<Card
  role="button"
  tabIndex={0}
  aria-label="文法クイズを開始"
  className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onKeyDown={(e) => e.key === "Enter" && onClick()}
>
  {/* カードコンテンツ */}
</Card>
```

## レスポンシブデザイン

### Breakpoints

- **sm**: 640px 以上 - スマートフォン（横向き）
- **md**: 768px 以上 - タブレット
- **lg**: 1024px 以上 - ラップトップ
- **xl**: 1280px 以上 - デスクトップ
- **2xl**: 1536px 以上 - 大型ディスプレイ

### Grid Patterns

```tsx
{
  /* モバイルファースト */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* アイテム */}
</div>;

{
  /* フレキシブルレイアウト */
}
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">メインコンテンツ</div>
  <div className="w-full md:w-80">サイドバー</div>
</div>;
```

## アニメーション

### Transition Classes

- **transition-all**: 全プロパティのトランジション
- **transition-colors**: 色のトランジション
- **transition-transform**: 変形のトランジション
- **duration-200**: 200ms（高速）
- **duration-300**: 300ms（通常）
- **duration-500**: 500ms（ゆっくり）

### Hover Effects

```tsx
{
  /* カードホバー */
}
<Card className="hover:shadow-lg hover:scale-105 transition-all duration-200">
  {/* コンテンツ */}
</Card>;

{
  /* ボタンホバー */
}
<Button className="hover:bg-blue-600 transition-colors duration-200">
  ボタン
</Button>;
```

### Active States

```tsx
{
  /* アクティブ状態 */
}
<Card className="active:scale-[0.98] transition-transform duration-100">
  {/* コンテンツ */}
</Card>;
```

## コンポーネント使用ガイドライン

### SelectionCard（新規）

#### 基本使用法

```tsx
<SelectionCard
  id="grammar-basic"
  title="基本文型"
  description="be動詞・一般動詞"
  detail="I am / You are / He has など基本的な文の構造"
  difficulty="初級"
  color="bg-blue-50 border-blue-200 text-blue-800"
  onClick={(id) => handleSelect(id)}
/>
```

#### 状態バリエーション

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

### Button Variants

#### Variant Types

- **default**: プライマリアクション
- **destructive**: 削除・危険なアクション
- **outline**: セカンダリアクション
- **secondary**: 補助アクション
- **ghost**: 最小限のスタイル
- **link**: リンクスタイル

#### Size Types

- **default**: 通常サイズ
- **sm**: 小サイズ
- **lg**: 大サイズ
- **icon**: アイコンのみ

### Card Patterns

#### Information Card

```tsx
<Card className="p-4">
  <CardHeader className="pb-2">
    <CardTitle className="text-lg">情報タイトル</CardTitle>
    <CardDescription>説明文</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-gray-600">詳細情報</p>
  </CardContent>
</Card>
```

#### Interactive Card

```tsx
<Card
  className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
  onClick={handleClick}
>
  {/* インタラクティブコンテンツ */}
</Card>
```

#### Status Card

```tsx
<Card className="border-green-300 bg-green-50">
  <CardContent className="p-4">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <span className="text-green-800">完了状態</span>
    </div>
  </CardContent>
</Card>
```

## 開発ガイドライン

### コンポーネント作成原則

#### 1. 再利用性

- 汎用的なプロパティ設計
- バリアントによる柔軟性
- TypeScript による型安全性

#### 2. アクセシビリティ

- セマンティック HTML 使用
- ARIA 属性の適切な実装
- キーボードナビゲーション対応

#### 3. パフォーマンス

- 不要な再レンダリング防止
- 適切なメモ化
- 遅延読み込みの活用

### 命名規則

#### コンポーネント名

- **PascalCase**: `SelectionCard`, `HeartSystem`
- **説明的**: 機能が分かる名前
- **一貫性**: 同じパターンの統一

#### CSS Classes

- **Tailwind 優先**: ユーティリティクラス使用
- **カスタムクラス**: 必要最小限
- **BEM 記法**: カスタムクラス使用時

### ファイル構造

```
src/components/ui/
├── layout/
│   ├── card.tsx           # 基本カード
│   ├── separator.tsx      # 区切り線
│   └── scroll-area.tsx    # スクロール領域
├── forms/
│   ├── button.tsx         # ボタン
│   ├── input.tsx          # 入力フィールド
│   ├── select.tsx         # 選択ドロップダウン
│   └── checkbox.tsx       # チェックボックス
├── feedback/
│   ├── alert.tsx          # アラート
│   ├── badge.tsx          # バッジ
│   ├── progress.tsx       # 進捗バー
│   └── skeleton.tsx       # スケルトン
├── navigation/
│   ├── tabs.tsx           # タブ
│   ├── breadcrumb.tsx     # パンくず
│   └── pagination.tsx     # ページネーション
├── overlay/
│   ├── dialog.tsx         # ダイアログ
│   ├── popover.tsx        # ポップオーバー
│   └── tooltip.tsx        # ツールチップ
└── custom/
    ├── selection-card.tsx # 選択カード
    ├── AccessibleButton.tsx
    ├── AccessibleCard.tsx
    └── AnimatedCard.tsx
```

## 使用例

### 文法クイズカテゴリ選択

```tsx
import { SelectionCard } from "./ui/selection-card";

const categories = [
  {
    id: "basic-grammar",
    title: "基本文型",
    description: "be動詞・一般動詞",
    detail: "I am / You are / He has など基本的な文の構造",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    difficulty: "初級",
  },
  // ... 他のカテゴリ
];

export function CategorySelection({ onSelectCategory, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <SelectionCard
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              detail={category.detail}
              difficulty={category.difficulty}
              color={category.color}
              onClick={onSelectCategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 事前学習メニュー

```tsx
import { SelectionCard } from "../ui/selection-card";

export const PreStudyContentCard = ({
  content,
  isLocked,
  isCompleted,
  onSelect,
}) => {
  return (
    <SelectionCard
      id={content.id}
      title={content.title}
      description={`⭐️ ${content.category}`}
      detail={`理論学習 - ${content.contentType}`}
      icon={getContentTypeIcon(content.contentType)}
      difficulty={content.difficulty}
      level={content.level}
      duration={`${Math.ceil(content.duration / 60)}分`}
      category={content.category}
      keyPoints={content.keyPoints}
      isLocked={isLocked}
      isCompleted={isCompleted}
      onClick={onSelect}
    />
  );
};
```

## ベストプラクティス

### 1. 一貫性の確保

- 同じ目的のコンポーネントは同じパターンを使用
- カラーパレットの統一
- スペーシングの一貫性

### 2. パフォーマンス最適化

- 不要な再レンダリングの防止
- 適切なメモ化の使用
- バンドルサイズの監視

### 3. 保守性の向上

- コンポーネントの単一責任原則
- プロパティの明確な定義
- ドキュメントの充実

### 4. ユーザビリティ

- 直感的なインタラクション
- 明確なフィードバック
- エラーハンドリング

## 今後の拡張計画

### Phase 1: 基盤強化

- [ ] 既存コンポーネントの最適化
- [ ] デザイントークンの体系化
- [ ] アクセシビリティ監査

### Phase 2: 機能拡張

- [ ] 新しいコンポーネントパターン
- [ ] アニメーションライブラリ統合
- [ ] テーマシステム実装

### Phase 3: 品質向上

- [ ] ユニットテストの充実
- [ ] E2E テストの自動化
- [ ] パフォーマンス最適化

## 参考リソース

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
