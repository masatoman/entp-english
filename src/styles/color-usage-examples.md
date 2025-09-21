# ENTP 英語学習アプリ - カラーパレット使用例

## 🎨 Tailwind CSS v4 カスタムカラー

### ベースカラー（信頼感・安定感）

```tsx
// メインテキスト・境界線
<div className="text-base-gunmetal border-base-gunmetal">
<div className="text-base-gunmetal-light">  // サブテキスト
<div className="border-base-gunmetal-dark"> // 強調境界線

// 背景色
<div className="bg-base-ghost-white">       // メイン背景
<div className="bg-base-periwinkle">        // セクション背景
<div className="bg-base-periwinkle-light">  // 軽い背景

// ボタン・重要な要素
<Button className="bg-base-delft-blue text-base-ghost-white">
<Button className="hover:bg-base-delft-blue-light">
```

### アクセントカラー（ゲーミフィケーション）

```tsx
// XP・報酬・行動促進
<div className="text-accent-orange">XP獲得！</div>
<div className="bg-accent-orange text-base-gunmetal-dark">+100 XP</div>
<Button className="bg-accent-orange hover:bg-accent-orange-light">

// 成功・レベルアップ・達成
<div className="text-status-success">レベルアップ！</div>
<div className="bg-status-success text-base-ghost-white">達成</div>
<Button className="bg-status-success hover:bg-status-success-light">

// エラー・失敗・警告
<div className="text-status-error">エラー</div>
<div className="bg-status-error text-base-ghost-white">失敗</div>
<Button className="bg-status-error hover:bg-status-error-light">
```

### ゲーミフィケーション専用カラー

```tsx
// XP関連
<span className="text-game-xp font-bold">1,234 XP</span>
<div className="bg-game-xp text-base-gunmetal-dark rounded-full px-3 py-1">
  +50 XP
</div>

// レベルアップ
<div className="bg-game-level-up text-base-ghost-white animate-level-bounce">
  Level Up!
</div>

// ハート（体力）
<Heart className="text-game-heart" />
<div className="bg-game-heart text-base-ghost-white">♥ 5/5</div>

// スター（スタミナ）
<Star className="text-game-star" />
<div className="bg-game-star text-base-gunmetal-dark">⭐ 3/3</div>

// コイン
<div className="text-game-coin font-bold">🪙 150</div>
```

### shadcn/ui コンポーネントとの統合

```tsx
// プライマリボタン（デルフトブルー）
<Button variant="default">学習開始</Button>

// セカンダリボタン（パーウィンクル）
<Button variant="secondary">戻る</Button>

// アクセントボタン（オレンジ）
<Button variant="accent">XP獲得</Button>

// 成功ボタン（グリーン）
<Button variant="success">レベルアップ</Button>

// 危険ボタン（レッド）
<Button variant="destructive">リセット</Button>

// カード
<Card className="bg-card border-border">
  <CardContent className="text-card-foreground">
    コンテンツ
  </CardContent>
</Card>
```

### カスタムグラデーション

```tsx
// ヘッダー背景
<div className="bg-header-gradient">

// XP関連
<div className="bg-xp-gradient">
<div className="bg-level-gradient">

// カード背景
<div className="bg-card-gacha">     // ガチャカード
<div className="bg-card-learning">  // 学習カード
<div className="bg-card-achievement"> // 実績カード
<div className="bg-card-special">   // 特別カード
```

### ゲーミフィケーション用アニメーション

```tsx
// XP獲得時の光る効果
<div className="xp-glow">+100 XP</div>

// レベルアップ時のバウンス
<div className="level-up-effect">Level Up!</div>

// 宝箱の震え効果
<div className="treasure-effect">🎁</div>

// ホバー時の浮き上がり
<Card className="hover-lift">

// ゲームライクなボタン
<Button className="game-button">
```

### レスポンシブ対応

```tsx
// 極小スマホ対応
<div className="xs:text-xs sm:text-sm lg:text-base">

// スマホファースト
<div className="p-2 sm:p-3 lg:p-4">
<div className="text-sm sm:text-base lg:text-lg">
```

### 実際の使用例（GameHeader）

```tsx
// 新しいカラーパレット適用例
<div
  style={{
    background: `linear-gradient(to right, ${baseColors.spaceCadet}, ${baseColors.delftBlue}, ${baseColors.spaceCadet})`,
    color: baseColors.ghostWhite,
  }}
>
  <div
    style={{
      background: `linear-gradient(to bottom right, ${accentColors.accentOrange}, ${accentColors.accentOrangeDark})`,
      color: baseColors.gunmetal,
    }}
  >
    Level 24
  </div>

  <span style={{ color: accentColors.accentOrange }}>1,234 XP</span>

  <Heart style={{ color: accentColors.warningRed }} />
  <Star style={{ color: accentColors.accentOrange }} />
</div>
```

## 🎯 WCAG 2.1 AA 準拠 コントラスト比

### テキストコントラスト

- `base-gunmetal` on `base-ghost-white`: **13.8:1** ✅
- `accent-orange` on `base-gunmetal-dark`: **8.2:1** ✅
- `status-success` on `base-ghost-white`: **6.9:1** ✅
- `status-error` on `base-ghost-white`: **5.1:1** ✅

### UI コンポーネント

- `base-delft-blue` on `base-ghost-white`: **7.4:1** ✅
- `accent-orange` on `base-delft-blue`: **4.6:1** ✅
- `status-success` on `base-gunmetal`: **9.1:1** ✅

すべて WCAG 2.1 AA 基準（4.5:1 以上）を満たしています。
