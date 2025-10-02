# 📚 ドキュメント構成ガイド

## 🎯 「ドキュメントを見て」指示への対応

**「ドキュメントを見て」の指示を受けた場合は、以下の順序で参照してください：**

### 1️⃣ **最優先参照**

- **[MASTER-DEVELOPMENT-GUIDE.md](./MASTER-DEVELOPMENT-GUIDE.md)** 📋
  - **目的**: 実装タスクの唯一の参照ドキュメント
  - **内容**: 現在状況・次期タスク・実装手順・品質基準
  - **使用場面**: 「ドキュメントを見て XX を実装してください」

### 2️⃣ **補助参照（必要時のみ）**

- **[project-snapshot.md](./project-snapshot.md)** 📊
  - **目的**: 現在の進捗状況の詳細
  - **内容**: 完了項目・システム評価・技術的成果
- **[tech-specs.md](./tech-specs.md)** 🔧
  - **目的**: 技術仕様の詳細
  - **内容**: 技術スタック・アーキテクチャ・設計方針

### 3️⃣ **特定用途ドキュメント**

- **[customer-journey.md](./customer-journey.md)** 🗺️ - カスタマージャーニーマップ
- **[testing-strategy.md](./testing-strategy.md)** 🧪 - テスト戦略
- **[design-system.md](./design-system.md)** 🎨 - デザインシステム
- **[pwa-features.md](./pwa-features.md)** 📱 - PWA 機能
- **[git-push-error-handling.md](./git-push-error-handling.md)** 🚨 - エラー対応

### 4️⃣ **TOEIC 拡張計画**

- **[comprehensive-toeic-plan.md](./comprehensive-toeic-plan.md)** 🎯 - TOEIC990 点達成包括計画
- **[toeic-implementation-roadmap.md](./toeic-implementation-roadmap.md)** 🚀 - 詳細実装計画

### 5️⃣ **設計判断記録**

- **[design-decision-records.md](./design-decision-records.md)** 🎯 - 設計判断の根拠と理由の記録

### 6️⃣ **開発進捗**

- **[progress-log.md](./progress-log.md)** 📊 - 開発進捗の詳細記録と振り返り

### 7️⃣ **アーカイブ（削除済み）**

- ~~**[archive/](./archive/)** 📦~~ ❌ **削除完了**
  - **削除理由**: 過去の問題・実装済み内容で現在は不要
  - **削除対象**: 8 個のアーカイブドキュメント
  - **代替**: MASTER-DEVELOPMENT-GUIDE.md に統合済み

---

## 🚀 実装時の推奨フロー

### 新しいタスクを受けた場合

```
1. MASTER-DEVELOPMENT-GUIDE.md を開く
2. 該当する実装パターンを確認
3. Step 1-4 の手順に従って実装
4. テスト・品質確認を実行
5. コミット
```

### 技術的詳細が必要な場合

```
1. MASTER-DEVELOPMENT-GUIDE.md で概要確認
2. tech-specs.md で技術詳細確認
3. 特定用途ドキュメントで詳細確認
```

### 現在状況を確認したい場合

```
1. project-snapshot.md で進捗確認
2. MASTER-DEVELOPMENT-GUIDE.md で次期タスク確認
```

---

## 📋 ドキュメント保守ルール

### 更新優先度

1. **MASTER-DEVELOPMENT-GUIDE.md** - 常に最新に保つ
2. **project-snapshot.md** - 重要な変更時に更新
3. **tech-specs.md** - 技術変更時に更新
4. **特定用途ドキュメント** - 該当機能変更時に更新

### 更新タイミング

- **実装完了時**: MASTER-DEVELOPMENT-GUIDE.md を更新
- **重要な成果**: project-snapshot.md を更新
- **技術変更**: tech-specs.md を更新
- **月次**: 全ドキュメントの整合性確認

---

## 🎯 効率的な開発のために

### 「ドキュメントを見て」指示の利点

- ✅ **即座開始**: 手順書があるので迷わない
- ✅ **品質維持**: チェックリストで品質確保
- ✅ **一貫性**: 統一された実装パターン
- ✅ **効率性**: 重複作業の回避

### 開発者への推奨事項

- **MASTER-DEVELOPMENT-GUIDE.md** をブックマーク
- 実装前に必ず該当セクションを確認
- 完了後は進捗をドキュメントに反映
- 新しい知見は適切なドキュメントに追記

---

**このドキュメント構成により、「ドキュメントを見て」の指示で迷わず効率的な開発が可能になります。**

_最終更新: 2025 年 1 月 1 日_
_管理対象: 8 個のドキュメント + 1 個のマスターガイド（アーカイブ 8 個削除済み）_
