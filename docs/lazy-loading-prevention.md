# 🚨 Lazy Loading 問題予防ガイド

## 📋 **問題の要約**

2025 年 9 月 18 日に発生した「真っ白ページ問題」の根本原因と予防策をまとめます。

## 🔍 **根本原因**

### **1. Lazy Loading の設定問題**

- **症状**: 全ての lazy loaded コンポーネントが「読み込み中...」で永続停止
- **原因**: Suspense の fallback 状態から抜け出せない
- **影響**: 15 ページが真っ白になる重大な問題

### **2. Export/Import 不整合**

- **症状**: "does not provide an export named" エラー
- **原因**: 名前付き export と default import の不一致
- **影響**: コンポーネントの読み込み失敗

### **3. Router 対応の不完全性**

- **症状**: "Cannot convert object to primitive value" エラー
- **原因**: props 形式のコンポーネントを Router 経由で呼び出し
- **影響**: ページ遷移時のクラッシュ

## 🛡️ **予防策**

### **A. Lazy Loading 使用ルール**

#### **✅ 推奨パターン**

```typescript
// 1. 直接import（推奨）
import Component from "../components/Component";

// 2. lazy loading使用時は必ずテスト
const Component = lazy(() => import("../components/Component"));
// → 必ずPlaywright MCPで動作確認
```

#### **❌ 禁止パターン**

```typescript
// lazy loading後のテストなし
const Component = lazy(() => import("../components/Component"));
// → 本番環境で突然動かなくなるリスク
```

### **B. Export/Import 統一ルール**

#### **✅ 推奨パターン**

```typescript
// コンポーネントファイル
export default function Component() { ... }

// import側
import Component from "./Component";
```

#### **❌ 禁止パターン**

```typescript
// 混在パターン（危険）
export const Component = ... // 名前付き
import Component from "..." // default import
```

### **C. Router 対応チェックリスト**

#### **新規コンポーネント作成時**

- [ ] `useNavigate()` を使用
- [ ] `useParams()` でパラメータ取得
- [ ] props 形式のコールバック関数を削除
- [ ] default export を使用

#### **既存コンポーネント修正時**

- [ ] props interface を削除
- [ ] onBack/onComplete 等を navigate 呼び出しに変更
- [ ] Router 経由での呼び出しに変更

## 🧪 **必須テスト手順**

### **1. コンポーネント変更後**

```bash
# Playwright MCPで必ず確認
# 1. 該当ページの表示確認
# 2. ナビゲーション動作確認
# 3. エラーコンソールチェック
```

### **2. Router 変更後**

```bash
# 全ページの動作確認（36ページ）
# 1. 基本21ページ
# 2. 深い階層15ページ
# 3. エラーハンドリング
```

## 🚨 **警告サイン**

### **即座に修正が必要な症状**

- [ ] 「読み込み中...」で止まるページ
- [ ] "does not provide an export" エラー
- [ ] "Cannot convert object to primitive value" エラー
- [ ] 空白ページ（文字数 < 30）

### **チェック方法**

```typescript
// 1. コンソールエラー確認
console.errors.length === 0;

// 2. ページ内容確認
document.body.textContent.length > 50;

// 3. 主要要素の存在確認
document.querySelector("h1") !== null;
```

## 🎯 **今後の開発フロー**

### **1. コンポーネント作成・修正**

1. Router 対応で作成
2. default export を使用
3. props 形式を避ける

### **2. 変更後の確認**

1. **必須**: Playwright MCP で動作確認
2. **必須**: 関連ページの動作確認
3. **必須**: エラーコンソールチェック

### **3. リリース前**

1. **必須**: 全 36 ページの動作確認
2. **必須**: ユーザージャーニーテスト
3. **必須**: エラーハンドリング確認

## 📈 **成功指標**

### **品質目標**

- **正常動作率**: 95%以上（36 ページ中 34 ページ以上）
- **エラーページ**: 0 ページ
- **読み込み時間**: 3 秒以内
- **JavaScript エラー**: 0 件

### **監視項目**

- ページ表示の成功率
- ナビゲーションの成功率
- エラーハンドリングの適切性
- ユーザー体験の一貫性

## 🌟 **まとめ**

**Lazy Loading 問題は、ENTP の特性である「即座の反応」を阻害する重大な問題でした。**

**今後は：**

- ✅ 直接 import を優先使用
- ✅ Playwright MCP による必須確認
- ✅ Router 対応の徹底
- ✅ Export/Import 統一

**これにより、ENTP の学習者が「待たされる」ストレスなく、スムーズに学習を継続できる環境を維持します！** 🚀
