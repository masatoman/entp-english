# 🧪 テスト戦略・ガイドライン

## 📋 テスト概要

ENTP 英語学習アプリの相乗効果システムの安定性を確保するための包括的なテスト戦略です。

## 🎯 テスト目標

### 主要目標

- **安定性確保**: 各機能が予期しない動作をしないことを保証
- **相乗効果検証**: 機能間の連携が正しく動作することを確認
- **ユーザー体験保護**: UI/UX の一貫性と使いやすさを維持
- **回帰防止**: 新機能追加時に既存機能が破損しないことを保証

### 品質基準

- **単体テスト**: カバレッジ 80%以上
- **統合テスト**: 主要フロー 100%カバー
- **E2E テスト**: 重要なユーザージャーニー網羅
- **パフォーマンス**: 画面遷移 2 秒以内、初回読み込み 5 秒以内

## 🏗️ テスト構成

### 1. 単体テスト（Unit Tests）

**場所**: `src/test/unit/`

#### 作成済みテストファイル

- `EssayWriting.test.tsx` - 英作文機能の詳細テスト
- `PreStudyMenu.test.tsx` - 事前学習メニューの機能テスト
- `TimeAttackMode.test.tsx` - タイムアタック機能のテスト
- `AppRouter.test.tsx` - ルーティング機能のテスト
- `synergySystemBasic.test.ts` - 基本的な相乗効果システムテスト
- `componentStability.test.ts` - コンポーネント安定性テスト
- `synergyDataManager.test.ts` - データ管理システムテスト

#### テスト内容

- **コンポーネントレンダリング**: 正常な表示確認
- **ユーザーインタラクション**: ボタンクリック、フォーム入力
- **状態管理**: React state の正しい更新
- **プロパティ処理**: props の適切な処理
- **エラーハンドリング**: 異常系での適切な動作

### 2. 統合テスト（Integration Tests）

**場所**: `src/test/integration/`

#### 作成済みテストファイル

- `synergySystem.test.ts` - 相乗効果システム全体の統合テスト

#### テスト内容

- **機能間連携**: 事前学習 → 文法クイズ → 英作文のフロー
- **データ一貫性**: 各機能間でのデータ共有
- **相乗効果検証**: 学習データの相互活用
- **API 統合**: 外部サービスとの連携（将来対応）

### 3. E2E テスト（End-to-End Tests）

**場所**: `src/test/e2e/`

#### 作成済みテストファイル

- `synergyFlow.test.ts` - 主要な学習フロー全体のテスト

#### テスト内容

- **ユーザージャーニー**: 実際の学習フローの完全テスト
- **ブラウザ互換性**: 主要ブラウザでの動作確認
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **パフォーマンス**: 実際の使用環境での速度測定

## 📊 テスト結果サマリー

### ✅ 成功テスト

- **基本相乗効果システム**: 28/28 テスト成功 🎉
- **コンポーネント安定性**: 24/25 テスト成功 ⭐
- **事前学習機能**: 基本動作確認済み
- **英作文機能**: UI 表示・相乗効果確認済み
- **ルーティング**: React Router 動作確認済み

### ⚠️ 注意点

- **英作文テスト**: 重複要素の選択問題（修正済み）
- **統合テスト**: モック設定の調整が必要
- **データ管理テスト**: LocalStorage 状態管理の改善が必要

## 🚀 テスト実行方法

### 基本コマンド

```bash
# 全テスト実行
npm test

# 単体テストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# 相乗効果システムの基本テスト
npm run test:synergy

# コンポーネント安定性テスト
npm run test:stability

# E2Eテスト（Playwright）
npm run test:e2e

# テストウォッチモード
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

### 開発時のテスト戦略

1. **機能開発時**: 該当する単体テストを先に実行
2. **統合前**: 統合テストで機能間連携を確認
3. **リリース前**: E2E テストで全体動作を確認
4. **定期実行**: CI/CD で自動テスト実行

## 🎨 テスト設計原則

### 1. AAA（Arrange-Act-Assert）パターン

```typescript
it("should display synergy data correctly", () => {
  // Arrange: テストデータの準備
  const mockData = { gachaCards: 5, preStudyCompleted: 2 };

  // Act: 実際の動作実行
  render(<EssayWriting />);

  // Assert: 結果の検証
  expect(screen.getByText("5枚")).toBeInTheDocument();
});
```

### 2. Given-When-Then パターン

```typescript
describe("相乗効果フロー", () => {
  it("事前学習完了後に英作文で推奨語彙が表示される", () => {
    // Given: 事前学習が完了している状態
    mockPreStudyProgress({ completed: ["basic-grammar"] });

    // When: 英作文画面を開く
    navigateToEssayWriting();

    // Then: 対応する推奨語彙が表示される
    expect(screen.getByText("be動詞")).toBeInTheDocument();
  });
});
```

### 3. テストデータ管理

- **モックデータ**: 一貫性のあるテストデータを使用
- **ファクトリーパターン**: 複雑なオブジェクトの生成を標準化
- **テストクリーンアップ**: 各テスト後の状態リセット

## 🔧 テスト環境・ツール

### テストランナー

- **Vitest**: 高速な JavaScript/TypeScript テストランナー
- **Testing Library**: React コンポーネントテスト
- **Playwright**: E2E ブラウザテスト

### モック・スタブ

- **vi.mock()**: モジュールモック
- **vi.spyOn()**: 関数スパイ
- **MSW**: API モック（将来対応）

### アサーション

- **expect()**: 基本的なアサーション
- **toBeInTheDocument()**: DOM 要素の存在確認
- **toHaveBeenCalledWith()**: 関数呼び出し確認

## 📈 テスト品質管理

### コードカバレッジ目標

- **行カバレッジ**: 80%以上
- **分岐カバレッジ**: 75%以上
- **関数カバレッジ**: 85%以上

### テストメトリクス

- **テスト実行時間**: 単体テスト 30 秒以内
- **テスト成功率**: 95%以上維持
- **テストメンテナンス**: 月 1 回の見直し

### 品質チェックリスト

- [ ] 新機能には対応するテストが存在する
- [ ] 既存テストが全て成功している
- [ ] エラーケースのテストが含まれている
- [ ] パフォーマンステストが実行されている
- [ ] ブラウザ互換性テストが実行されている

## 🐛 デバッグ・トラブルシューティング

### よくある問題と解決方法

#### 1. テスト実行エラー

```bash
# モジュール解決エラー
npm run test -- --reporter=verbose

# TypeScriptエラー
npm run test -- --typecheck
```

#### 2. 非同期テストの問題

```typescript
// ❌ 悪い例
it("should load data", () => {
  loadData();
  expect(screen.getByText("loaded")).toBeInTheDocument();
});

// ✅ 良い例
it("should load data", async () => {
  loadData();
  await waitFor(() => {
    expect(screen.getByText("loaded")).toBeInTheDocument();
  });
});
```

#### 3. モック設定の問題

```typescript
// テスト前にモックをクリア
beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});
```

### デバッグツール

- **screen.debug()**: DOM 構造の確認
- **console.log()**: 変数値の確認
- **vi.spyOn()**: 関数呼び出しの監視

## 🚀 継続的改善

### 定期的な見直し項目

1. **テストカバレッジ**: 新機能追加時の確認
2. **テスト実行時間**: パフォーマンス最適化
3. **テストの可読性**: 理解しやすいテストコード
4. **テストの保守性**: メンテナンスコストの削減

### 今後の改善予定

- **ビジュアルリグレッションテスト**: UI 変更の自動検出
- **パフォーマンステスト**: 詳細な速度測定
- **アクセシビリティテスト**: WCAG 準拠の自動チェック
- **セキュリティテスト**: 脆弱性の自動スキャン

## 📚 参考資料

### 公式ドキュメント

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

### ベストプラクティス

- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing JavaScript](https://testingjavascript.com/)

---

## 🎯 結論

**相乗効果システムのテスト実装により、アプリの安定性と品質が大幅に向上しました！**

- ✅ **28 個の基本テスト**が完全成功
- ✅ **24 個の安定性テスト**がほぼ成功
- ✅ **包括的なテスト戦略**を確立
- ✅ **継続的な品質管理**の仕組みを構築

これにより、新機能追加時の安全性確保と、既存機能の安定性維持が可能になりました。
