# ENTP英語学習アプリ - 技術仕様

## 1. アーキテクチャ概要

### 1.1 システム構成
```
┌─────────────────┐
│   Frontend      │
│   (React SPA)   │
└─────────────────┘
         │
┌─────────────────┐
│   Static Host   │
│   (Vercel/Netlify) │
└─────────────────┘
```

### 1.2 技術スタック詳細

#### フロントエンド
- **React 18.3.1**: メインのUIフレームワーク
- **TypeScript**: 型安全性の確保
- **Vite 6.3.5**: 高速な開発環境とビルドツール
- **SWC**: 高速なTypeScript/JavaScriptコンパイラ

#### スタイリング
- **Tailwind CSS**: ユーティリティファーストのCSS
- **Radix UI**: アクセシブルなUIコンポーネント
- **Lucide React**: アイコンライブラリ
- **Motion**: アニメーションライブラリ

#### PWA機能
- **Vite PWA Plugin**: PWA機能の自動生成
- **Workbox**: Service Workerの管理
- **Web App Manifest**: アプリのメタデータ
- **オフライン対応**: ネットワーク不要での学習継続

#### ゲーム機能
- **タワーディフェンス**: ゲーミフィケーション要素
- **クリッカー要素**: 即座の達成感
- **XPシステム**: 学習進捗の可視化

#### 状態管理
- **React Hooks**: useState, useEffect等の標準フック
- **Local State**: コンポーネント内での状態管理
- **DataManager**: 学習データの永続化

## 2. プロジェクト構造

```
src/
├── components/           # Reactコンポーネント
│   ├── ui/              # 再利用可能なUIコンポーネント
│   ├── Home.tsx         # ホーム画面
│   ├── VocabularyCard.tsx # 語彙学習
│   ├── GrammarQuiz.tsx  # 文法クイズ
│   ├── CombinedTest.tsx # 総合テスト
│   ├── TimeAttackMode.tsx # タイムアタックモード
│   ├── SimpleTowerDefense.tsx # タワーディフェンスゲーム
│   ├── Achievements.tsx # 実績画面
│   ├── PWAInstallPrompt.tsx # PWAインストールプロンプト
│   ├── PWAUpdatePrompt.tsx # PWA更新プロンプト
│   └── ...
├── data/                # データファイル
│   ├── questions.ts     # 問題データ
│   ├── vocabulary.ts    # 語彙データ
│   ├── achievements.ts  # 実績データ
│   ├── combinedTest.ts  # 総合テストデータ
│   ├── xpShop.ts        # XPショップデータ
│   └── ...
├── types/               # TypeScript型定義
│   ├── index.ts         # 基本型定義
│   └── simple-game.ts   # ゲーム関連型定義
├── constants/           # 定数定義
│   └── index.ts
├── utils/               # ユーティリティ関数
│   ├── dataManager.ts   # データ管理
│   ├── xpCalculator.ts  # XP計算
│   ├── tower-defense-data.ts # ゲームデータ
│   └── ...
├── styles/              # スタイルファイル
│   └── globals.css
├── App.tsx              # メインアプリケーション
└── main.tsx             # エントリーポイント
```

## 3. データ構造

### 3.1 型定義

```typescript
// カテゴリー定義
export type Category = 
  | 'basic-grammar' | 'tenses' | 'modals' | 'passive' 
  | 'relative' | 'subjunctive' | 'comparison' 
  | 'participle' | 'infinitive';

// 難易度定義
export type Difficulty = 'easy' | 'normal' | 'hard';

// 問題データ
export interface QuestionData {
  id: number;
  japanese: string;
  correctAnswer: string;
  explanation: string;
  choices?: string[]; // 簡単モードのみ
}

// ユーザー回答
export interface UserAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

// 語彙データ
export interface VocabularyWord {
  id: number;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'all' | 'toeic' | 'business' | 'daily' | 'academic';
}

// 実績データ
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'vocabulary' | 'grammar' | 'quiz' | 'score';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirement: number;
  xpReward: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

// ゲーム関連型定義
export interface GameState {
  level: number;
  xp: number;
  coins: number;
  towers: Tower[];
  enemies: Enemy[];
  wave: number;
  score: number;
}

export interface Tower {
  id: string;
  type: 'basic' | 'advanced' | 'special';
  level: number;
  damage: number;
  range: number;
  cost: number;
  position: { x: number; y: number };
}

export interface Enemy {
  id: string;
  type: 'basic' | 'fast' | 'tank' | 'boss';
  health: number;
  speed: number;
  reward: number;
  position: { x: number; y: number };
}
```

### 3.2 データ管理

#### 問題データ構造
```typescript
export const questionsByCategory: Record<Category, Record<Difficulty, QuestionData[]>> = {
  'basic-grammar': {
    easy: [...],
    normal: [...],
    hard: [...]
  },
  // 他のカテゴリーも同様
};
```

#### 語彙データ構造
```typescript
export const vocabularyWords: VocabularyWord[] = [
  {
    id: 1,
    word: "accomplish",
    meaning: "達成する、成し遂げる",
    partOfSpeech: "動詞",
    example: "She accomplished her goal of learning English.",
    exampleTranslation: "彼女は英語を学ぶという目標を達成した。",
    level: "intermediate"
  },
  // 他の単語も同様
];
```

## 4. コンポーネント設計

### 4.1 画面遷移管理

```typescript
type Screen = 'home' | 'vocabulary' | 'grammar-quiz' | 'combined-test' 
            | 'achievements' | 'category' | 'difficulty' | 'question' | 'results';

// App.tsxでの状態管理
const [currentScreen, setCurrentScreen] = useState<Screen>('home');
```

### 4.2 主要コンポーネント

#### Home.tsx
- アプリケーションのメイン画面
- 各学習モードへのナビゲーション
- 実績の概要表示

#### Question.tsx
- 問題表示と回答受付
- 正誤判定と解説表示
- 進捗表示

#### Results.tsx
- テスト結果の表示
- 正答率と詳細分析
- 復習機能への導線

#### SimpleTowerDefense.tsx
- タワーディフェンスゲーム
- ゲーミフィケーション要素
- XPシステムとの連携

#### TimeAttackMode.tsx
- 制限時間内での集中学習
- タイマー機能
- スコア表示

#### PWAInstallPrompt.tsx
- PWAインストールプロンプト
- ブラウザ対応チェック
- インストール誘導

#### PWAUpdatePrompt.tsx
- PWA更新通知
- 新バージョンの案内
- 更新実行

### 4.3 UIコンポーネント

#### Radix UIベースのコンポーネント
- Button, Card, Dialog, Progress等
- アクセシビリティ対応済み
- カスタマイズ可能なスタイリング

## 5. ビルド設定

### 5.1 Vite設定

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 5.2 パッケージ管理

#### 主要依存関係
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-*": "^1.x.x",
    "lucide-react": "^0.487.0",
    "tailwind-merge": "^3.3.1",
    "clsx": "^2.1.1",
    "motion": "*",
    "next-themes": "^0.4.6",
    "recharts": "^2.15.2",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.10.2",
    "vite": "6.3.5",
    "vite-plugin-pwa": "^1.0.3",
    "workbox-window": "^7.3.0",
    "@types/node": "^20.10.0"
  }
}
```

## 6. パフォーマンス最適化

### 6.1 バンドル最適化
- **Tree Shaking**: 未使用コードの除去
- **Code Splitting**: 動的インポートによる分割
- **SWC**: 高速なコンパイル

### 6.2 ランタイム最適化
- **React.memo**: 不要な再レンダリングの防止
- **useMemo/useCallback**: 計算結果のメモ化
- **Lazy Loading**: コンポーネントの遅延読み込み

### 6.3 アセット最適化
- **画像最適化**: WebP形式の使用
- **フォント最適化**: 必要な文字のみの読み込み
- **CSS最適化**: 未使用スタイルの除去

## 7. セキュリティ対策

### 7.1 フロントエンドセキュリティ
- **XSS対策**: 入力値のサニタイズ
- **CSRF対策**: SameSite Cookieの設定
- **Content Security Policy**: CSPヘッダーの設定

### 7.2 データ保護
- **型安全性**: TypeScriptによる型チェック
- **入力検証**: クライアントサイドでの検証
- **エラーハンドリング**: 適切なエラー処理

## 8. 開発環境

### 8.1 開発ツール
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **TypeScript**: 型チェック
- **Vite Dev Server**: 高速な開発サーバー

### 8.2 デバッグ
- **React DevTools**: コンポーネントのデバッグ
- **Browser DevTools**: パフォーマンス分析
- **Console Logging**: 開発時のログ出力

## 9. デプロイメント

### 9.1 ビルドプロセス
```bash
# 開発環境
npm run dev

# 本番ビルド
npm run build
```

### 9.2 ホスティング
- **静的サイト**: Vercel/Netlifyでのホスティング
- **CDN**: グローバル配信
- **HTTPS**: SSL証明書の自動設定

## 10. 監視・ログ

### 10.1 パフォーマンス監視
- **Core Web Vitals**: LCP, FID, CLSの測定
- **Bundle Size**: バンドルサイズの監視
- **Load Time**: ページ読み込み時間の測定

### 10.2 エラー監視
- **Error Boundary**: Reactエラーの捕捉
- **Console Errors**: JavaScriptエラーの監視
- **Network Errors**: API通信エラーの監視