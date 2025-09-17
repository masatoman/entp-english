# PWA + SPA ルーティング ベストプラクティス (2025 年版)

## 🎯 URL 設計原則

### 1. 意味のある URL 構造

```
✅ 良い例:
/learning/vocabulary/study/intermediate/toeic
/progress/achievements/streak-master
/games/tower-defense/level/5

❌ 悪い例:
/page1
/component?id=123&type=vocab
/learning#vocabulary-intermediate
```

### 2. PWA 固有の考慮事項

#### Deep Linking 対応

- **要件**: アプリインストール後も直接アクセス可能
- **実装**: React Router + BrowserRouter
- **テスト**: `window.open('/learning/vocabulary')` が正常動作

#### オフライン対応

- **Service Worker**: 各ルートのキャッシュ戦略
- **Fallback**: ネットワーク切断時の代替表示
- **同期**: オンライン復帰時のデータ同期

#### ネイティブアプリライク UX

- **戻るボタン**: ブラウザナビゲーション対応
- **履歴管理**: 適切な history.push/replace
- **状態復元**: ページリロード時の状態保持

## 🚀 React Router v6 実装パターン

### 1. ネストルーティング

```typescript
<Route path="/learning" element={<LearningLayout />}>
  <Route path="vocabulary">
    <Route path="difficulty" element={<DifficultySelection />} />
    <Route path="study/:difficulty/:category" element={<VocabularyCard />} />
  </Route>
</Route>
```

### 2. プログラマティックナビゲーション

```typescript
const navigate = useNavigate();

// ✅ 推奨: パラメータ付きナビゲーション
navigate("/learning/vocabulary/study/intermediate/toeic");

// ✅ 推奨: 状態付きナビゲーション
navigate("/progress/achievements", {
  state: { fromLearning: true },
});

// ❌ 非推奨: window.location操作
window.location.href = "/learning";
```

### 3. URL パラメータ活用

```typescript
// URLから状態を復元
const { difficulty, category } = useParams();
const location = useLocation();

useEffect(() => {
  // URLパラメータに基づいて状態を初期化
  initializeVocabularyStudy(difficulty, category);
}, [difficulty, category]);
```

## 📱 PWA 最適化パターン

### 1. レイジーローディング

```typescript
// ✅ 推奨: ルート単位での分割
const VocabularyCard = lazy(() => import("../components/VocabularyCard"));
const GrammarQuiz = lazy(() => import("../components/GrammarQuiz"));

// ✅ 推奨: 機能単位での分割
const LearningModule = lazy(() => import("../modules/Learning"));
```

### 2. プリロード戦略

```typescript
// ✅ ホーム画面で次の画面をプリロード
useEffect(() => {
  // ユーザーが最も使用する機能を事前読み込み
  import("../components/VocabularyCard");
  import("../components/GrammarQuiz");
}, []);
```

### 3. Service Worker 連携

```typescript
// ✅ 重要ルートのキャッシュ
const CACHE_ROUTES = [
  "/",
  "/learning/vocabulary",
  "/learning/grammar",
  "/progress/achievements",
];
```

## 🎨 UX 最適化パターン

### 1. ローディング状態

```typescript
// ✅ ルート遷移時のローディング
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/learning/*" element={<LearningRoutes />} />
  </Routes>
</Suspense>
```

### 2. エラーハンドリング

```typescript
// ✅ ルート単位のエラーバウンダリー
<Route
  path="/learning/*"
  element={
    <ErrorBoundary fallback={<LearningErrorPage />}>
      <LearningRoutes />
    </ErrorBoundary>
  }
/>
```

### 3. 状態管理との連携

```typescript
// ✅ URLと状態の同期
const [difficulty, setDifficulty] = useState(
  params.difficulty || "intermediate"
);

useEffect(() => {
  navigate(`/learning/vocabulary/study/${difficulty}/${category}`, {
    replace: true,
  });
}, [difficulty, category]);
```

## 🔒 セキュリティ・パフォーマンス

### 1. URL 検証

```typescript
// ✅ パラメータバリデーション
const validDifficulties = ["beginner", "intermediate", "advanced"];
const { difficulty } = useParams();

if (!validDifficulties.includes(difficulty)) {
  return <Navigate to="/learning/vocabulary/difficulty" replace />;
}
```

### 2. メモリ最適化

```typescript
// ✅ 不要なコンポーネントのアンマウント
useEffect(() => {
  return () => {
    // クリーンアップ処理
    clearInterval(timers);
    cancelPendingRequests();
  };
}, []);
```

## 📊 分析・監視

### 1. ルート別分析

```typescript
// ✅ ページビュー追跡
useEffect(() => {
  analytics.track("page_view", {
    path: location.pathname,
    from: location.state?.from,
  });
}, [location]);
```

### 2. パフォーマンス監視

```typescript
// ✅ ルート遷移時間の測定
const measureRouteTransition = (routeName) => {
  performance.mark(`route-${routeName}-start`);

  return () => {
    performance.mark(`route-${routeName}-end`);
    performance.measure(
      `route-${routeName}`,
      `route-${routeName}-start`,
      `route-${routeName}-end`
    );
  };
};
```

## 🎯 実装優先順位

### Phase 1: 基盤 (完了済み ✅)

- [x] React Router 導入
- [x] 基本 URL 構造設計
- [x] AppRouter.tsx 実装

### Phase 2: コア機能移行 (推奨)

- [ ] NewHome.tsx ナビゲーション更新
- [ ] 学習機能の URL 対応
- [ ] パラメータベース状態管理

### Phase 3: 最適化 (将来)

- [ ] Service Worker 連携
- [ ] プリロード戦略
- [ ] オフライン対応

## 🚀 即座に実装可能な改善

現在の実装は既に非常に優秀です！
以下の小さな改善で完璧になります：

1. **navigate()使用**: onNavigateProps を useNavigate に変更
2. **URL パラメータ活用**: 状態を URL から復元
3. **履歴管理**: 適切な replace/push 使い分け

これらの変更により、2025 年基準の最先端 PWA が完成します！
