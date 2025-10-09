# TOEIC 実装ロードマップ - 詳細実装計画

**作成日**: 2025 年 1 月 20 日  
**バージョン**: 1.0  
**ステータス**: 詳細設計・実装準備中

---

## 🎯 実装優先順位

### 最優先（TOEIC600 点達成に必須）

#### 1. ガチャ分類システム再設計

**期間**: 1 週間  
**重要度**: 🔴 最重要

**実装内容**:

- [ ] 3 軸分類システム（頻出度・難易度・コンテンツタイプ）
- [ ] 新しいパック構成の設計
- [ ] レアリティシステムの調整
- [ ] 既存 98 語の分類再構築

**技術詳細**:

```typescript
// 新しいガチャカード型定義
interface EnhancedGachaCard {
  id: string;
  type: "vocabulary" | "grammar" | "phrase" | "listening";
  frequency: "ultra_high" | "high" | "medium" | "low";
  difficulty: "basic" | "intermediate" | "advanced";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  toeicParts: number[];
  targetScore: string;
  content: WordCard | GrammarCard | PhraseCard | ListeningCard;
}
```

#### 2. 語彙データベース拡張

**期間**: 1 週間  
**重要度**: 🔴 最重要

**実装内容**:

- [ ] 98 語 → 500 語に拡張
- [ ] TOEIC 頻出語彙の追加
- [ ] 分野別語彙分類（ビジネス・日常生活・学術）
- [ ] 既存データとの統合

**拡張計画**:

```
Week 1: 基礎ビジネス語彙（100語）
Week 2: 日常生活語彙（100語）
Week 3: 学術・技術語彙（100語）
Week 4: 高度ビジネス語彙（100語）
```

#### 3. 構文・熟語カード追加

**期間**: 1 週間  
**重要度**: 🔴 最重要

**実装内容**:

- [ ] 構文カード 50 個の追加
- [ ] 熟語カード 30 個の追加
- [ ] ガチャシステムへの統合
- [ ] 学習システムとの連携

**構文カード例**:

```typescript
interface GrammarCard {
  id: string;
  pattern: string; // "be supposed to"
  meaning: string; // "〜することになっている"
  examples: GrammarExample[];
  toeicParts: number[];
  difficulty: "basic" | "intermediate" | "advanced";
  businessContext: string;
}
```

### 高優先（TOEIC800 点達成に必要）

#### 4. リスニング基盤システム

**期間**: 2 週間  
**重要度**: 🟡 重要

**実装内容**:

- [ ] 音声ファイル管理システム
- [ ] Part1-2 問題 20 問の実装
- [ ] 基本的なリスニング機能
- [ ] 音声速度調整機能

**技術詳細**:

```typescript
interface AudioManager {
  // 音声ファイルの管理
  loadAudio(filePath: string): Promise<HTMLAudioElement>;
  playAudio(audio: HTMLAudioElement): Promise<void>;
  pauseAudio(audio: HTMLAudioElement): void;
  setPlaybackRate(rate: number): void;

  // リスニング問題の管理
  createListeningQuestion(config: ListeningQuestionConfig): ListeningQuestion;
  evaluateListeningAnswer(question: ListeningQuestion, answer: string): boolean;
}
```

#### 5. 統合学習システム

**期間**: 2 週間  
**重要度**: 🟡 重要

**実装内容**:

- [ ] ガチャコンテンツの統合学習への追加
- [ ] シナジー効果システム
- [ ] 推奨システムの実装
- [ ] 進捗追跡システム

### 中優先（TOEIC990 点達成に必要）

#### 6. 英作文シナジー強化

**期間**: 2 週間  
**重要度**: 🟢 推奨

#### 7. リスニング × ガチャ連携

**期間**: 2 週間  
**重要度**: 🟢 推奨

#### 8. 模擬試験・分析機能

**期間**: 3 週間  
**重要度**: 🟢 推奨

---

## 🔧 技術実装詳細

### 1. データ構造の拡張

#### 既存型定義の拡張

```typescript
// src/types/gacha.ts の拡張
export interface EnhancedWordCard extends WordCard {
  frequency: "ultra_high" | "high" | "medium" | "low";
  difficulty: "basic" | "intermediate" | "advanced";
  businessContext: string;
  dailyContext: string;
  academicContext: string;
  toeicParts: number[];
  targetScore: string;
  relatedCards: string[]; // 関連するカードのID
}

export interface GrammarCard {
  id: string;
  pattern: string;
  meaning: string;
  examples: GrammarExample[];
  toeicParts: number[];
  difficulty: "basic" | "intermediate" | "advanced";
  businessContext: string;
  frequency: "ultra_high" | "high" | "medium" | "low";
}

export interface PhraseCard {
  id: string;
  phrase: string;
  meaning: string;
  examples: PhraseExample[];
  category: "business" | "daily" | "academic";
  toeicParts: number[];
  difficulty: "basic" | "intermediate" | "advanced";
  frequency: "ultra_high" | "high" | "medium" | "low";
}

export interface ListeningCard {
  id: string;
  audioFile: string;
  transcript: string;
  questions: ListeningQuestion[];
  part: 1 | 2 | 3 | 4;
  difficulty: "basic" | "intermediate" | "advanced";
  targetScore: string;
  relatedVocabulary: string[]; // 関連語彙のID
}
```

#### 新しいパック型定義

```typescript
export interface EnhancedGachaPack {
  id: string;
  name: string;
  description: string;
  type: "vocabulary" | "grammar" | "phrase" | "listening" | "mixed";
  content: {
    vocabulary?: EnhancedWordCard[];
    grammar?: GrammarCard[];
    phrases?: PhraseCard[];
    listening?: ListeningCard[];
  };
  cost: number;
  targetScore: string;
  difficulty: "basic" | "intermediate" | "advanced";
  frequency: "ultra_high" | "high" | "medium" | "low";
}
```

### 2. システム統合

#### 統合学習マネージャー

```typescript
// src/utils/integratedLearningManager.ts
export class IntegratedLearningManager {
  private gachaManager: GachaManager;
  private vocabularyManager: VocabularyManager;
  private grammarManager: GrammarManager;
  private phraseManager: PhraseManager;
  private listeningManager: ListeningManager;
  private essayManager: EssayManager;

  constructor() {
    this.gachaManager = new GachaManager();
    this.vocabularyManager = new VocabularyManager();
    this.grammarManager = new GrammarManager();
    this.phraseManager = new PhraseManager();
    this.listeningManager = new ListeningManager();
    this.essayManager = new EssayManager();
  }

  // ガチャコンテンツを統合学習に追加
  async addGachaContent(cards: EnhancedGachaCard[]): Promise<void> {
    for (const card of cards) {
      switch (card.type) {
        case "vocabulary":
          await this.vocabularyManager.addCard(
            card.content as EnhancedWordCard
          );
          break;
        case "grammar":
          await this.grammarManager.addCard(card.content as GrammarCard);
          break;
        case "phrase":
          await this.phraseManager.addCard(card.content as PhraseCard);
          break;
        case "listening":
          await this.listeningManager.addCard(card.content as ListeningCard);
          break;
      }
    }
  }

  // シナジー効果の計算
  calculateSynergies(cards: EnhancedGachaCard[]): SynergyEffect {
    const synergies: SynergyEffect = {
      vocabulary: { withGrammar: 0, withPhrases: 0, withListening: 0 },
      grammar: { withVocabulary: 0, withPhrases: 0, withEssay: 0 },
      phrases: { withVocabulary: 0, withGrammar: 0, withListening: 0 },
    };

    // 実装詳細...
    return synergies;
  }

  // 推奨システム
  getRecommendations(userProgress: UserProgress): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // 弱点分析に基づく推奨
    const weakAreas = this.analyzeWeakAreas(userProgress);
    for (const area of weakAreas) {
      recommendations.push({
        type: "gacha_pack",
        packId: this.getRecommendedPack(area),
        reason: `弱点分野「${area}」の改善`,
        priority: "high",
      });
    }

    return recommendations;
  }
}
```

### 3. リスニングシステム

#### 音声管理システム

```typescript
// src/utils/audioManager.ts
export class AudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentAudio: HTMLAudioElement | null = null;

  async loadAudio(filePath: string): Promise<HTMLAudioElement> {
    if (this.audioCache.has(filePath)) {
      return this.audioCache.get(filePath)!;
    }

    const audio = new Audio(filePath);
    audio.preload = "auto";

    return new Promise((resolve, reject) => {
      audio.addEventListener("canplaythrough", () => {
        this.audioCache.set(filePath, audio);
        resolve(audio);
      });
      audio.addEventListener("error", reject);
    });
  }

  async playAudio(audio: HTMLAudioElement): Promise<void> {
    this.currentAudio = audio;
    return new Promise((resolve, reject) => {
      audio.addEventListener("ended", resolve);
      audio.addEventListener("error", reject);
      audio.play();
    });
  }

  pauseAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
  }
}
```

#### リスニング問題管理

```typescript
// src/utils/listeningManager.ts
export class ListeningManager {
  private audioManager: AudioManager;
  private questions: Map<string, TOEICListeningQuestion> = new Map();

  constructor() {
    this.audioManager = new AudioManager();
  }

  async createListeningQuestion(
    config: ListeningQuestionConfig
  ): Promise<TOEICListeningQuestion> {
    const audio = await this.audioManager.loadAudio(config.audioFile);

    const question: TOEICListeningQuestion = {
      id: config.id,
      part: config.part,
      audioFile: config.audioFile,
      transcript: config.transcript,
      questions: config.questions,
      difficulty: config.difficulty,
      targetScore: config.targetScore,
      relatedGachaCards: config.relatedGachaCards,
    };

    this.questions.set(config.id, question);
    return question;
  }

  async playListeningQuestion(questionId: string): Promise<void> {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    const audio = await this.audioManager.loadAudio(question.audioFile);
    await this.audioManager.playAudio(audio);
  }

  evaluateListeningAnswer(
    questionId: string,
    questionIndex: number,
    answer: string
  ): boolean {
    const question = this.questions.get(questionId);
    if (!question) {
      return false;
    }

    const targetQuestion = question.questions[questionIndex];
    if (!targetQuestion) {
      return false;
    }

    return answer === targetQuestion.options[targetQuestion.correctAnswer];
  }
}
```

---

## 📊 実装進捗管理

### 週次進捗チェックリスト

#### Week 1: ガチャ分類システム再設計

- [ ] 新しい型定義の作成
- [ ] 既存データの移行
- [ ] パック構成の再設計
- [ ] レアリティシステムの調整
- [ ] テストの実装

#### Week 2: 語彙データベース拡張

- [ ] 新しい語彙データの作成
- [ ] 既存システムとの統合
- [ ] 分類システムの適用
- [ ] テストの実装

#### Week 3: 構文・熟語カード追加

- [ ] 構文カードデータの作成
- [ ] 熟語カードデータの作成
- [ ] ガチャシステムへの統合
- [ ] 学習システムとの連携

### 品質チェックリスト

#### コード品質

- [ ] TypeScript 型安全性の確保
- [ ] エラーハンドリングの実装
- [ ] テストカバレッジの確保
- [ ] パフォーマンス最適化

#### ユーザビリティ

- [ ] ENTP の特性に配慮した設計
- [ ] 直感的な UI/UX
- [ ] レスポンシブデザイン
- [ ] アクセシビリティ対応

#### 機能性

- [ ] 既存機能との互換性
- [ ] データの整合性
- [ ] システムの安定性
- [ ] 拡張性の確保

---

## 🚀 次のステップ

### 即座に開始すべき作業

1. **新しい型定義の作成** - `src/types/enhancedGacha.ts`
2. **既存データの移行** - 98 語の分類再構築
3. **パック構成の再設計** - 新しいパックタイプの実装

### 並行して進める作業

1. **語彙データベース拡張** - 500 語への拡張
2. **構文カードの作成** - 50 個の構文カード
3. **熟語カードの作成** - 30 個の熟語カード

### 段階的テスト

1. **単体テスト** - 各コンポーネントのテスト
2. **統合テスト** - システム間の連携テスト
3. **E2E テスト** - ユーザーフローのテスト

---

**このロードマップに従って、段階的に TOEIC990 点達成システムを構築していきます。**
