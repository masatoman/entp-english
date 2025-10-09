# 懸念点と対策（超シンプル版）

## 🎯 このドキュメントの目的

3ヶ月継続のための3つの重大な懸念点と対策。

---

## 🚨 懸念点1: 継続率の低さ（最重要）

### 問題
- 過去に英会話3ヶ月で挫折
- 機能が多いと「今日は何をしよう？」で悩む
- 成長を実感できないと続かない

### 対策

#### A. 1日9分だけ（超重要）

```typescript
interface DailyMission {
  morning: {
    task: "朝の3分クイズ";
    time: "3分";
    reward: "+50 XP";
  };
  lunch: {
    task: "昼の1問チャレンジ";
    time: "1分";
    reward: "+30 XP";
  };
  evening: {
    task: "夜の振り返り3問";
    time: "2分";
    reward: "+40 XP";
  };
  total: "9分で+120 XP";
}
```

**実装場所:**
- `src/components/DailyMission.tsx`
- `src/components/Home.tsx`（今日の目標セクション）

#### B. 学力診断テスト

```typescript
interface DiagnosticTest {
  duration: "10分";
  output: {
    toeicPrediction: 320; // 現在地
    targetAfter3Months: 450; // 目標
    dailyTimeNeeded: "9分";
    confidence: "90%";
  };
}
```

**実装場所:**
- `src/components/DiagnosticTest.tsx`
- 初回起動時のみ表示

#### C. 成長ダッシュボード

```typescript
interface GrowthDashboard {
  toeicPrediction: {
    current: 420;
    target: 450;
    progress: 60; // %
  };
  weeklyComparison: {
    accuracy: "+5%";
    studyTime: "+20分";
    newWords: "+15語";
  };
  milestones: ["15日連続 🔥", "100問達成 (78/100)", "50単語習得 ✅"];
}
```

**実装場所:**
- `src/components/GrowthDashboard.tsx`
- ホーム画面の「📈 成長」ボタンから遷移

---

## 🚨 懸念点2: 「暗記は苦手」問題

### 問題
- 「暗記」「復習」という言葉がストレス
- 意識的な反復学習に抵抗

### 対策

#### A. 用語変更（最重要）

```typescript
const terminology = {
  禁止: ["復習", "暗記", "テスト", "間違い"],
  使用: ["チャレンジ", "身につける", "クイズ", "成長のチャンス"],
};
```

**実装タスク:**
- 全コンポーネントの用語を一括置換
- UIテキストの見直し

#### B. ガチャで無意識に反復

```typescript
interface GachaRepetition {
  mechanism: "正解するとガチャ券獲得";
  effect: "集めたい → 問題解く → 無意識に反復";
  result: "暗記している自覚なく定着";
}
```

#### C. 問題に単語を自然に含める

```typescript
// 文法問題の例文に頻出単語を使用
const question = {
  japanese: "彼は目標を達成しました";
  answer: "He accomplished his goal.";
  // "accomplish"を文法学習中に自然に触れる
};
```

---

## 🚨 懸念点3: モチベーション維持

### 問題
- 「いつかは」という漠然とした目標では続かない
- 長期目標（TOEIC800点）は遠すぎる

### 対策

#### A. 3ヶ月の明確な目標

```typescript
interface ThreeMonthGoal {
  current: 320;
  target: 450;
  increase: "+130点";
  achievable: "90%";
  dailyTime: "9分";
}
```

**実装場所:**
- `src/components/GoalSettingWizard.tsx`
- 診断テスト後に表示

#### B. ストリーク保護システム

```typescript
interface StreakProtection {
  cards: 3; // 月3枚
  usage: "1日ログインなしでも使える";
  effect: "ストリーク継続";
  message: "大丈夫！明日から頑張りましょう";
}
```

**実装場所:**
- `src/utils/streakProtection.ts`
- `src/components/StreakDisplay.tsx`

#### C. 緊急モチベーション回復

```typescript
interface EmergencyRecovery {
  trigger: "3日間ログインなし";
  action: {
    email: "これまでの成長データを送信";
    challenge: "1問だけ解く（30秒）";
    reward: "カムバックボーナス +100XP";
  };
}
```

---

## 📊 成功指標

- **7日継続率**: 70%
- **30日継続率**: 50%
- **90日完走率**: 40%
- **TOEIC予測スコア**: +130点

---

## 🎯 実装優先順位

### Phase 1（今週）
1. ホーム画面の超シンプル化
2. 学力診断テスト
3. 3ヶ月目標設定
4. 成長ダッシュボード
5. 毎日の小さな勝利システム

### Phase 2（2週間以内）
6. ストリーク保護
7. 用語一括変更
8. ガチャシステム最適化
9. 週次チェックポイント
10. 緊急モチベーション回復
