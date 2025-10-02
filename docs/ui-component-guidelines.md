# 🎨 UI コンポーネント設計ガイドライン

**作成日**: 2025 年 1 月 20 日  
**目的**: SelectionCard を中心とした一貫した UI 設計の実現

---

## 🎯 基本方針

### 設計原則

- **カードベース UI の統一**
- **SelectionCard の積極的活用**
- **既存パターンの継承**
- **拡張性を考慮した設計**

### 対象範囲

- **新機能の UI 設計**
- **既存機能の改善**
- **ゲーム化要素の統合**
- **レスポンシブ対応**

---

## 📱 SelectionCard 使用ガイドライン

### ✅ 必須使用場面

#### 機能選択画面

```typescript
// ✅ 正しい使用例
<SelectionCard
  id="word-quest"
  title="ワードクエスト"
  description="魔法のクリーチャーを討伐してエリアを制圧！"
  icon="⚔️"
  difficulty="冒険"
  detail="体力消費: 1 ❤️"
  onClick={() => navigate("/games/word-quest")}
/>
```

#### カテゴリ・難易度選択

```typescript
// ✅ 正しい使用例
<SelectionCard
  id="green-zone"
  title="🌱 グリーンゾーン"
  description="初心者の森 - 優しいクリーチャーが待っている"
  icon="🌿"
  difficulty="初級"
  detail="進捗: 80% (40/50討伐)"
  isCompleted={greenZoneProgress >= 100}
  onClick={() => navigate("/games/word-quest/green-zone")}
/>
```

### ❌ 使用禁止場面

#### 単純なボタン

```typescript
// ❌ 避けるべき例
<Button onClick={() => navigate("/some-page")}>
  ページに移動
</Button>

// ✅ 推奨例
<SelectionCard
  id="some-page"
  title="ページ名"
  description="ページの説明"
  icon="📄"
  onClick={() => navigate("/some-page")}
/>
```

#### 設定項目

```typescript
// ❌ 避けるべき例
<SelectionCard
  id="settings"
  title="設定"
  description="アプリの設定を変更"
  onClick={() => navigate("/settings")}
/>

// ✅ 推奨例（設定は別途専用UI）
<div className="settings-panel">
  <Switch label="通知設定" />
  <Slider label="音量" />
</div>
```

---

## 🎮 ゲーム要素統合パターン

### エリア選択パターン

#### 基本構造

```typescript
interface GameAreaCardProps {
  area: GameArea;
  progress: number;
  isUnlocked: boolean;
  onClick: () => void;
}

const GameAreaCard: React.FC<GameAreaCardProps> = ({
  area,
  progress,
  isUnlocked,
  onClick,
}) => {
  return (
    <SelectionCard
      id={area.id}
      title={`${area.themeIcon} ${area.displayName}`}
      description={area.description}
      icon={area.icon}
      difficulty={area.difficultyLabel}
      detail={`進捗: ${progress}% (${area.completedCount}/${area.totalCount}討伐)`}
      isLocked={!isUnlocked}
      isCompleted={progress >= 100}
      onClick={onClick}
    />
  );
};
```

#### エリアテーマ別アイコン

```typescript
const AREA_THEMES = {
  green: {
    icon: "🌱",
    themeIcon: "🌿",
    difficultyLabel: "初級",
    color: "text-green-600",
  },
  blue: {
    icon: "🌊",
    themeIcon: "💎",
    difficultyLabel: "中級",
    color: "text-blue-600",
  },
  red: {
    icon: "🔥",
    themeIcon: "🏰",
    difficultyLabel: "上級",
    color: "text-red-600",
  },
  gold: {
    icon: "⚡",
    themeIcon: "🏛️",
    difficultyLabel: "最上級",
    color: "text-yellow-600",
  },
};
```

### バトル選択パターン

#### クリーチャータイプ選択

```typescript
const CreatureTypeCard: React.FC<{
  type: CreatureType;
  count: number;
  onClick: () => void;
}> = ({ type, count, onClick }) => {
  return (
    <SelectionCard
      id={type.id}
      title={type.displayName}
      description={`${type.description} (${count}体)`}
      icon={type.icon}
      difficulty={type.rarity}
      detail={`経験値: ${type.baseExp}XP`}
      onClick={onClick}
    />
  );
};
```

### 報酬・アイテムパターン

#### ガチャパック選択

```typescript
const GachaPackCard: React.FC<{
  pack: GachaPack;
  canAfford: boolean;
  onClick: () => void;
}> = ({ pack, canAfford, onClick }) => {
  return (
    <SelectionCard
      id={pack.id}
      title={pack.name}
      description={pack.description}
      icon="🎁"
      difficulty="ガチャ"
      detail={`コスト: ${pack.cost} XP`}
      isLocked={!canAfford}
      onClick={onClick}
    />
  );
};
```

---

## 🎨 デザインパターン集

### 進捗表示パターン

#### 基本進捗

```typescript
const ProgressDetail = ({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) => {
  const percentage = Math.round((current / total) * 100);
  return `進捗: ${percentage}% (${current}/${total}${label})`;
};
```

#### エリア制圧進捗

```typescript
const AreaProgressDetail = ({ area }: { area: GameArea }) => {
  const { completedCreatures, totalCreatures, defeatedBosses } = area;
  const creatureProgress = Math.round(
    (completedCreatures / totalCreatures) * 100
  );

  return (
    <div className="space-y-1">
      <div>
        進捗: {creatureProgress}% ({completedCreatures}/{totalCreatures}討伐)
      </div>
      <div>ボス: {defeatedBosses > 0 ? "✅ 討伐済み" : "⚔️ 挑戦可能"}</div>
    </div>
  );
};
```

### 状態表示パターン

#### ロック状態

```typescript
const LockedCard = ({ unlockCondition }: { unlockCondition: string }) => {
  return (
    <SelectionCard
      id="locked"
      title="🔒 ロック中"
      description="このエリアはまだ解放されていません"
      icon="🔒"
      difficulty="未解放"
      detail={`解放条件: ${unlockCondition}`}
      isLocked={true}
      onClick={() => {}} // 空の関数
    />
  );
};
```

#### 完了状態

```typescript
const CompletedCard = ({ area }: { area: GameArea }) => {
  return (
    <SelectionCard
      id={area.id}
      title={`✅ ${area.displayName}`}
      description="エリア制圧完了！"
      icon={area.icon}
      difficulty="制圧済み"
      detail={`制圧日: ${area.completedDate}`}
      isCompleted={true}
      onClick={() => navigate(`/games/word-quest/${area.id}/review`)}
    />
  );
};
```

---

## 🛠️ 実装テンプレート

### 新機能追加テンプレート

#### 1. ホーム画面への追加

```typescript
// NewHome.tsx に追加
<SelectionCard
  id="new-feature"
  title="新機能名"
  description="新機能の説明文"
  icon="🎯"
  difficulty="難易度"
  detail="詳細情報"
  onClick={() => navigate("/new-feature")}
/>
```

#### 2. ルート設定

```typescript
// App.tsx またはルーターファイルに追加
<Route path="/new-feature" element={<NewFeatureSelection />} />
<Route path="/new-feature/:category" element={<NewFeatureCategory />} />
```

#### 3. 選択画面コンポーネント

```typescript
const NewFeatureSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center">新機能</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectionCard
            id="option1"
            title="オプション1"
            description="オプション1の説明"
            icon="🎯"
            difficulty="初級"
            detail="詳細情報"
            onClick={() => navigate("/new-feature/option1")}
          />
          {/* 他のオプション */}
        </div>
      </div>
    </div>
  );
};
```

### ゲーム機能追加テンプレート

#### 1. ゲームエリア定義

```typescript
// src/data/gameAreas.ts
export const gameAreas: GameArea[] = [
  {
    id: "new-game",
    name: "new-game",
    displayName: "新ゲーム",
    theme: "green",
    targetScore: { min: 400, max: 499 },
    vocabulary: [],
    bosses: [],
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
  },
];
```

#### 2. エリア選択コンポーネント

```typescript
const NewGameAreaSelection: React.FC = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<GameArea[]>([]);

  useEffect(() => {
    // エリアデータの読み込み
    setAreas(gameAreas);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center">新ゲーム</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area) => (
            <GameAreaCard
              key={area.id}
              area={area}
              progress={area.progress}
              isUnlocked={area.isUnlocked}
              onClick={() => navigate(`/games/new-game/${area.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 品質チェックポイント

### ✅ デザイン統一性

#### 必須チェック項目

- [ ] **SelectionCard を使用している**
- [ ] **アイコンが適切に設定されている**
- [ ] **難易度表示が統一されている**
- [ ] **詳細情報が適切に表示されている**

#### 状態管理

- [ ] **ロック状態が適切に実装されている**
- [ ] **完了状態が適切に実装されている**
- [ ] **推奨状態が適切に実装されている**

### ✅ ユーザビリティ

#### 操作性

- [ ] **クリック領域が適切**
- [ ] **ホバー効果が統一**
- [ ] **ローディング状態が適切**

#### 情報設計

- [ ] **情報の階層が明確**
- [ ] **必要な情報が適切に表示**
- [ ] **エラー状態が適切に処理**

### ✅ アクセシビリティ

#### 基本要件

- [ ] **キーボードナビゲーション対応**
- [ ] **スクリーンリーダー対応**
- [ ] **適切なコントラスト比**

---

## 🔄 継続的改善

### パターン更新

- **新パターンの発見時**: ガイドラインに追加
- **既存パターンの改善時**: テンプレートを更新
- **問題発見時**: チェックポイントを追加

### 品質向上

- **ユーザーフィードバック**: デザイン改善
- **使用データ分析**: 使いやすさ向上
- **技術的改善**: パフォーマンス最適化

---

_このガイドラインにより、ENTP 英語学習アプリの一貫した UI 設計とユーザー体験を実現します。_
