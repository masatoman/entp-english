# 🧪 E2E テスト実行ルール

## 🚨 **必須要件**

### **Playwright MCP 使用義務**

- **✅ 必須**: 全ての E2E テストは Playwright MCP を使用すること
- **❌ 禁止**: 通常の Playwright コマンドライン（`npx playwright test`）の使用禁止
- **❌ 禁止**: ブラウザの手動操作による確認

## 🎯 **Playwright MCP を使用する理由**

### **1. 自動結果取得**

- **フリーズ防止**: 読み込み状態で止まらない
- **自動待機**: ページ読み込み完了まで自動で待機
- **確実な実行**: タイムアウトやハングアップの回避

### **2. リアルタイム確認**

- **ページ状態取得**: 現在のページ構造を完全に取得
- **要素確認**: 表示されている要素を正確に確認
- **動的コンテンツ**: JavaScript で生成されるコンテンツも確認

### **3. エラー自動検知**

- **JavaScript エラー**: 実行時エラーを自動検知・報告
- **コンソールメッセージ**: 警告・エラーメッセージを取得
- **詳細な情報**: エラーの詳細な位置・内容を提供

### **4. 実ブラウザ動作**

- **Chrome 実行**: 実際の Chrome ブラウザでの動作確認
- **完全レンダリング**: CSS や JavaScript を含む完全な表示
- **ユーザー体験**: 実際のユーザーと同じ環境での確認

### **5. インタラクション可能**

- **ボタンクリック**: 実際のボタン操作が可能
- **フォーム入力**: テキスト入力・選択操作
- **ナビゲーション**: ページ間の移動・戻る操作

## 📋 **実行手順**

### **基本的なページ確認**

```javascript
// 1. ページに移動
await page.goto("http://localhost:3000/target-page");

// 2. 読み込み完了を待機（自動）
await page.waitForLoadState("networkidle");

// 3. ページ状態を確認（自動）
// - ページタイトル
// - URL
// - 表示要素
// - コンソールエラー
```

### **要素の存在確認**

```javascript
// 特定の要素が表示されていることを確認
await expect(page.locator("text=期待するテキスト")).toBeVisible();
```

### **インタラクション実行**

```javascript
// ボタンクリック
await page.click("text=ボタンテキスト");

// フォーム入力
await page.fill("input[type='text']", "入力テキスト");

// 選択操作
await page.selectOption("select", "選択値");
```

## 🎯 **テスト対象ページ一覧**

### **必須確認ページ（21 ページ）**

- `/` - ホーム
- `/learning/vocabulary/difficulty` - 語彙難易度選択
- `/learning/vocabulary/category` - 語彙カテゴリー選択
- `/learning/vocabulary/study/:difficulty/:category` - 語彙学習
- `/learning/grammar/category` - 文法カテゴリー選択
- `/learning/grammar/difficulty/:category` - 文法難易度選択
- `/learning/grammar/quiz/:category/:difficulty` - Enhanced 文法クイズ
- `/learning/grammar/question/:category/:difficulty` - 文法問題
- `/learning/grammar/results/:category/:difficulty` - 文法結果
- `/learning/pre-study/menu` - 事前学習メニュー
- `/learning/pre-study/content/:contentId` - 事前学習コンテンツ
- `/learning/combined-test` - 総合テスト
- `/learning/time-attack` - タイムアタック
- `/learning/essay-writing` - 英作文
- `/games/tower-defense` - タワーディフェンス
- `/games/gacha` - ガチャシステム
- `/games/gacha/result` - ガチャ結果
- `/games/gacha/card/:cardId` - ガチャカード詳細
- `/progress/achievements` - 実績
- `/progress/dashboard` - 成長ダッシュボード
- `/settings/app` - アプリ設定

## 🔍 **確認項目**

### **基本確認**

- [ ] ページが空白でない（文字数 > 30 文字）
- [ ] JavaScript エラーがない
- [ ] ページタイトルが正しい
- [ ] 主要な要素が表示されている

### **Router 対応確認**

- [ ] `Cannot convert object to primitive value`エラーがない
- [ ] props 形式のコンポーネントが残っていない
- [ ] useParams/useNavigate が正しく動作している

### **ナビゲーション確認**

- [ ] 戻るボタンが正常に動作する
- [ ] ページ間の遷移が正常に動作する
- [ ] URL が正しく更新される

## 🚀 **実行例**

### **単一ページの確認**

```javascript
// ホーム画面の確認
await page.goto("http://localhost:3000/");
await expect(page.locator("text=ENTP英語学習アプリ")).toBeVisible();
```

### **フロー確認**

```javascript
// 文法クイズフロー
await page.click("text=文法クイズ");
await page.waitForURL("**/learning/grammar/category");
await page.click("text=時制");
await page.waitForURL("**/learning/grammar/difficulty/tenses");
await page.click("text=簡単");
await page.waitForURL("**/learning/grammar/question/tenses/easy");
```

## 🎊 **成功の指標**

### **✅ 正常動作の確認**

- ページが正常に表示される
- 主要な要素が見える
- エラーがない
- インタラクションが機能する

### **❌ 問題のある状態**

- 空白ページ
- JavaScript エラー
- 要素が表示されない
- ナビゲーションが機能しない

## 📝 **記録・報告**

### **成功時**

```
✅ ページ確認完了
- URL: /target-page
- 状態: 正常表示
- 要素: 期待する要素が表示
- エラー: なし
```

### **問題発見時**

```
❌ 問題発見
- URL: /problem-page
- 問題: JavaScript エラー / 空白ページ / 要素未表示
- エラー詳細: [具体的なエラーメッセージ]
- 修正要件: [必要な修正内容]
```

## 🎯 **まとめ**

**Playwright MCP の使用により：**

- ✅ **確実な結果取得**: フリーズなしで完全なテスト実行
- ✅ **効率的なデバッグ**: 問題の即座な発見と詳細な情報
- ✅ **包括的な確認**: 全ページの完全な動作確認
- ✅ **品質保証**: 実際のユーザー体験と同じ環境でのテスト

**ENTP の学習特性に最適化された相乗効果システムの品質を、Playwright MCP で確実に保証します！** 🌟
