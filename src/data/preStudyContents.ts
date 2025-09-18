import { PreStudyContent } from "../types/starSystem";

/**
 * 事前学習コンテンツデータ
 * 文法クイズ・英作文との相乗効果を狙った設計
 */
export const preStudyContents: PreStudyContent[] = [
  // 基本文型 (basic-grammar)
  {
    id: "basic-grammar-theory",
    title: "英文の基本構造",
    category: "grammar",
    subcategory: "basic-grammar",
    level: 1,
    contentType: "theory",
    duration: 300, // 5分
    difficulty: "beginner",
    content: `# 英文の基本構造

## 英語の語順：SVO
英語は**主語（S）→ 動詞（V）→ 目的語（O）**の順番が基本です。

### be動詞の文
- **肯定文**: I am a student. (私は学生です)
- **否定文**: I am not a teacher. (私は先生ではありません)
- **疑問文**: Are you happy? (あなたは幸せですか？)

### 一般動詞の文
- **肯定文**: I play tennis. (私はテニスをします)
- **否定文**: I don't play soccer. (私はサッカーをしません)
- **疑問文**: Do you like music? (あなたは音楽が好きですか？)

## なぜ大切？
この基本構造を理解することで：
- ✅ 文法クイズの基本文型問題が解けるようになります
- ✅ 英作文で正しい語順で書けるようになります
- ✅ TOEICのPart5-6での語順問題に強くなります`,
    keyPoints: [
      "英語の基本語順はSVO",
      "be動詞と一般動詞の使い分け",
      "疑問文・否定文の作り方",
      "文法クイズ・英作文の基礎",
    ],
    examples: [
      {
        english: "She is a teacher.",
        japanese: "彼女は先生です。",
        explanation: "be動詞の基本形（主語 + be動詞 + 補語）",
      },
      {
        english: "They study English every day.",
        japanese: "彼らは毎日英語を勉強します。",
        explanation: "一般動詞の基本形（主語 + 動詞 + 目的語）",
      },
    ],
    relatedProblems: ["basic-grammar"],
    prerequisites: [],
  },

  // 助動詞 (modals)
  {
    id: "modals-theory",
    title: "助動詞の基本",
    category: "grammar",
    subcategory: "modals",
    level: 1,
    contentType: "theory",
    duration: 300, // 5分
    difficulty: "beginner",
    content: `# 助動詞の基本

## 主要な助動詞
助動詞は動詞の前に置いて、話し手の気持ちや可能性を表します。

### can / could (可能・能力)
- **現在**: I can swim. (私は泳げます)
- **過去**: I could swim when I was young. (若い頃は泳げました)
- **丁寧**: Could you help me? (手伝っていただけますか？)

### will / would (意志・推量)
- **未来**: I will go tomorrow. (明日行きます)
- **丁寧**: Would you like some tea? (お茶はいかがですか？)

### should / must (義務・必要)
- **義務**: You should study hard. (一生懸命勉強すべきです)
- **必要**: I must go now. (今行かなければなりません)

## なぜ大切？
助動詞を理解することで：
- ✅ 文法クイズの助動詞問題が解けるようになります
- ✅ 英作文で自然な表現ができるようになります
- ✅ TOEICでの助動詞問題に強くなります`,
    keyPoints: [
      "can/could：可能・能力・許可",
      "will/would：意志・推量・丁寧な依頼",
      "should/must：義務・必要性",
      "助動詞＋動詞の原形",
    ],
    examples: [
      {
        english: "I can speak English.",
        japanese: "私は英語を話せます。",
        explanation: "canで能力を表現（can + 動詞の原形）",
      },
      {
        english: "You should try this.",
        japanese: "これを試してみるべきです。",
        explanation: "shouldで助言・推奨を表現",
      },
    ],
    relatedProblems: ["modals"],
    prerequisites: ["basic-grammar-theory"],
  },

  // 時制 (tenses)
  {
    id: "tenses-theory",
    title: "時制の完全マスター：基礎から応用まで",
    category: "grammar",
    subcategory: "tenses",
    level: 1,
    contentType: "theory",
    duration: 900, // 15分
    difficulty: "beginner",
    content: `# 時制の完全マスター：基礎から応用まで

## 1. 時制とは？
**時制**は「いつの話をしているか」を表現する英語の重要な文法要素です。正確な時制の使い分けは、TOEICスコアアップの鍵となります。

## 2. 現在形（Present Simple）

### 基本概念
現在形は「今この瞬間」だけでなく、**習慣・真理・状態**を表現します。

### 用法1：習慣・反復行動
- **構造**: 主語 + 動詞（三人称単数は+s/es）
- **例**: I **go** to work by train every day. （毎日電車で通勤します）
- **例**: She **studies** English on weekends. （彼女は週末に英語を勉強します）

### 用法2：一般的事実・真理
- **例**: The sun **rises** in the east. （太陽は東から昇る）
- **例**: Water **boils** at 100 degrees Celsius. （水は100度で沸騰する）

### 用法3：現在の状態
- **例**: I **live** in Tokyo. （東京に住んでいます）
- **例**: He **works** for a software company. （彼はソフトウェア会社で働いています）

### TOEIC頻出パターン
- **スケジュール表現**: The meeting **starts** at 2 PM. （会議は午後2時に始まります）
- **時刻表・予定表**: The train **leaves** at 8:30. （電車は8時30分に出発します）

## 3. 過去形（Past Simple）

### 基本概念
**完了した過去の行動・状態**を表現します。

### 規則動詞の変化
- **基本**: 動詞 + ed
- **例**: work → worked, study → studied, play → played

### 不規則動詞の重要パターン
| 現在形 | 過去形 | 意味 |
|--------|--------|------|
| go | went | 行く |
| come | came | 来る |
| take | took | 取る |
| make | made | 作る |
| have | had | 持つ |
| get | got | 得る |
| see | saw | 見る |
| know | knew | 知る |

### TOEIC頻出表現
- **会議・イベントの報告**: We **held** a conference last week. （先週会議を開催しました）
- **過去の経験**: I **worked** in sales for five years. （5年間営業で働いていました）

## 4. 未来形（Future）

### will vs be going to の使い分け

#### will の用法
1. **その場での決定**: I'll **help** you with that. （それをお手伝いします）
2. **予測・推測**: It **will** rain tomorrow. （明日雨が降るでしょう）
3. **約束・意志**: I **will** call you later. （後で電話します）

#### be going to の用法
1. **計画・予定**: I'm **going to** visit my parents. （両親を訪ねる予定です）
2. **根拠のある予測**: Look at those clouds! It's **going to** rain. （あの雲を見て！雨が降りそうです）

### その他の未来表現
- **現在進行形**: I'm **meeting** him tomorrow. （明日彼と会います）※確定した予定
- **現在形**: The conference **begins** next Monday. （会議は来週月曜日に始まります）※スケジュール

## 5. 現在完了形（Present Perfect）

### 基本構造
**have/has + 過去分詞**

### 用法1：継続（for/since）
- **for**: 期間を表す
  - I **have lived** here **for** 10 years. （10年間ここに住んでいます）
- **since**: 起点を表す
  - I **have worked** here **since** 2020. （2020年からここで働いています）

### 用法2：経験（ever/never）
- **ever**: 今までに（疑問文）
  - **Have** you **ever been** to Japan? （日本に行ったことがありますか？）
- **never**: 一度も～ない
  - I **have never seen** such a beautiful sunset. （こんなに美しい夕日は見たことがありません）

### 用法3：完了・結果（just/already/yet）
- **just**: ちょうど～したところ
  - I **have just finished** the report. （レポートを終えたところです）
- **already**: すでに（肯定文）
  - She **has already left**. （彼女はすでに出発しました）
- **yet**: まだ（否定文・疑問文）
  - **Have** you finished **yet**? （もう終わりましたか？）

## 6. 現在完了進行形（Present Perfect Continuous）

### 基本構造
**have/has + been + -ing**

### 用法
過去から現在まで**継続している行動**を強調
- I **have been studying** English for 3 years. （3年間英語を勉強し続けています）
- It **has been raining** since morning. （朝から雨が降り続いています）

## 7. 過去完了形（Past Perfect）

### 基本構造
**had + 過去分詞**

### 用法
「過去のある時点より前に完了していた行動」を表現
- When I arrived, the meeting **had already started**. （私が到着したとき、会議はすでに始まっていました）
- She **had worked** there for 5 years before she quit. （彼女は辞める前に5年間そこで働いていました）

## 8. ビジネス英語での時制活用

### メール・文書での表現
- **現在形**: We **provide** comprehensive solutions. （包括的なソリューションを提供しています）
- **現在完了**: We **have completed** the project. （プロジェクトを完了しました）
- **未来形**: We **will** send you the details shortly. （詳細を近日中にお送りします）

### 会議・プレゼンテーションでの表現
- **過去形**: Last quarter, sales **increased** by 15%. （前四半期、売上が15%増加しました）
- **現在完了**: We **have achieved** our target. （目標を達成しました）
- **未来形**: Next year, we **will expand** into new markets. （来年、新市場に進出します）

## 9. 実践への活用

### 文法クイズでの応用
- ✅ 時制の一致問題で満点
- ✅ 適切な時制選択で正答率向上
- ✅ 複雑な時制問題への対応力強化

### 英作文での応用
- ✅ 時系列を明確に表現
- ✅ 適切な時制で論理的な文章構成
- ✅ ビジネス文書での正確な時制使用

### TOEICでの応用
- ✅ Part5-6の時制問題で高得点
- ✅ Part7の文書理解で時系列把握
- ✅ Listeningでの時制聞き取り向上`,
    keyPoints: [
      "現在形：習慣・事実・状態を表現",
      "過去形：完了した過去の行動",
      "未来形：will（意志・予測）vs be going to（計画）",
      "現在完了：継続・経験・完了の3用法",
      "時制の一致でビジネス英語力向上",
      "TOEIC頻出パターンの完全理解",
    ],
    examples: [
      {
        english: "I have been working on this project since last month.",
        japanese: "先月からこのプロジェクトに取り組んでいます。",
        explanation: "現在完了進行形：過去から現在まで継続している行動を強調",
      },
      {
        english: "The conference will be held next Friday at 2 PM.",
        japanese: "会議は来週金曜日の午後2時に開催されます。",
        explanation: "未来受動態：確定した予定の丁寧な表現",
      },
      {
        english: "When I arrived at the office, everyone had already left.",
        japanese: "オフィスに着いたとき、みんなすでに帰っていました。",
        explanation: "過去完了：過去のある時点より前に完了していた行動",
      },
      {
        english: "Our sales have increased by 25% this quarter.",
        japanese: "今四半期、売上が25%増加しました。",
        explanation: "現在完了：過去から現在への結果を表現（ビジネス報告）",
      },
    ],
    toeicExamples: [
      {
        question:
          "The new employee _____ with our company for three months now.",
        choices: ["works", "worked", "has been working", "will work"],
        correctAnswer: 2,
        explanation:
          "「3か月間」という継続期間を表すfor three monthsがあるため、現在完了進行形has been workingが正解。過去から現在まで継続している状況を表現している。",
        type: "grammar",
        part: 5,
      },
      {
        question:
          "By the time the meeting starts, I _____ all the necessary documents.",
        choices: ["prepare", "prepared", "will prepare", "will have prepared"],
        correctAnswer: 3,
        explanation:
          "By the timeは「～する時までには」という意味で、未来のある時点までに完了している行動を表すため、未来完了形will have preparedが正解。",
        type: "grammar",
        part: 5,
      },
      {
        question: "Last year, our company _____ a 15% increase in revenue.",
        choices: [
          "experiences",
          "experienced",
          "has experienced",
          "will experience",
        ],
        correctAnswer: 1,
        explanation:
          "Last yearという過去の特定時点を示す語句があるため、過去形experiencedが正解。現在完了形は特定の過去時点を表す語句とは一緒に使えない。",
        type: "grammar",
        part: 5,
      },
      {
        question:
          "The project manager _____ the team every Monday to discuss progress.",
        choices: ["meets", "met", "has met", "will meet"],
        correctAnswer: 0,
        explanation:
          "every Mondayという習慣・反復を表す語句があるため、現在形meetsが正解。習慣的な行動は現在形で表現する。",
        type: "grammar",
        part: 5,
      },
    ],
    relatedProblems: ["tenses"],
    prerequisites: ["basic-grammar-theory"],
  },

  // 助動詞 (modals)
  {
    id: "modals-theory",
    title: "助動詞の意味と使い方",
    category: "grammar",
    subcategory: "modals",
    level: 3,
    contentType: "theory",
    duration: 360, // 6分
    difficulty: "intermediate",
    content: `# 助動詞の意味と使い方

## 助動詞とは？
動詞に**意味を付け加える**単語です。

### 能力・可能性
- **can**: できる、可能性がある
- **could**: できた、可能性があった（過去・丁寧）
- **例**: I can speak English. (英語を話せます)

### 意志・予測
- **will**: ～するつもり、～でしょう
- **would**: ～するつもりだった（過去・丁寧）
- **例**: It will rain tomorrow. (明日雨が降るでしょう)

### 義務・必要性
- **must**: ～しなければならない（強い義務）
- **should**: ～すべき（アドバイス）
- **have to**: ～しなければならない（外的義務）
- **例**: You must submit the report. (レポートを提出しなければなりません)

### 許可・依頼
- **may**: ～してもよい（許可）、～かもしれない（推量）
- **might**: ～かもしれない（弱い推量）
- **例**: May I use your phone? (電話をお借りしてもよいですか？)

## ビジネス英語での重要性
TOEICでは**丁寧な表現**が頻出：
- Could you help me? (手伝っていただけますか？)
- Would you like some coffee? (コーヒーはいかがですか？)

## 実践への活用
- ✅ 文法クイズの助動詞問題で満点
- ✅ 英作文で適切な丁寧さレベル
- ✅ TOEICのビジネス場面で高得点`,
    keyPoints: [
      "can/could: 能力・可能性",
      "will/would: 意志・予測",
      "must/should: 義務・アドバイス",
      "may/might: 許可・推量",
    ],
    examples: [
      {
        english: "Could you please send me the document?",
        japanese: "書類を送っていただけませんか？",
        explanation: "ビジネスでの丁寧な依頼表現",
      },
      {
        english: "You should check your email regularly.",
        japanese: "定期的にメールをチェックすべきです。",
        explanation: "アドバイスを表すshould",
      },
    ],
    relatedProblems: ["modals"],
    prerequisites: ["basic-grammar-theory", "tenses-theory"],
  },

  // 受動態 (passive)
  {
    id: "passive-theory",
    title: "受動態の理解と活用",
    category: "grammar",
    subcategory: "passive",
    level: 2,
    contentType: "theory",
    duration: 480, // 8分
    difficulty: "intermediate",
    content: `# 受動態の理解と活用

## 受動態とは？
**動作を受ける側**に焦点を当てた表現です。

### 基本形：be動詞 + 過去分詞
- **能動態**: Tom wrote this letter. (トムがこの手紙を書いた)
- **受動態**: This letter was written by Tom. (この手紙はトムによって書かれた)

### 時制別の受動態
#### 現在形
- **形**: am/is/are + 過去分詞
- **例**: English is spoken all over the world. (英語は世界中で話されています)

#### 過去形
- **形**: was/were + 過去分詞
- **例**: The meeting was canceled. (会議は中止されました)

#### 未来形
- **形**: will be + 過去分詞
- **例**: The report will be finished tomorrow. (レポートは明日完成します)

#### 現在完了形
- **形**: have/has been + 過去分詞
- **例**: The project has been completed. (プロジェクトは完了しました)

## ビジネス英語での重要性
### フォーマルな表現
- **能動**: We will send the documents.
- **受動**: The documents will be sent. (より丁寧・客観的)

### TOEIC頻出パターン
- The conference is held annually. (会議は毎年開催されます)
- All applications must be submitted by Friday. (全ての申請書は金曜日までに提出されなければなりません)

## 実践への活用
- ✅ 文法クイズの受動態問題で満点
- ✅ 英作文でフォーマルな表現
- ✅ TOEICのビジネス文書読解で高得点`,
    keyPoints: [
      "be動詞 + 過去分詞の基本形",
      "時制に応じたbe動詞の変化",
      "by + 行為者は省略可能",
      "ビジネスではフォーマルな印象",
    ],
    examples: [
      {
        english: "The new policy will be implemented next month.",
        japanese: "新しい方針は来月実施されます。",
        explanation: "ビジネスでの未来受動態",
      },
      {
        english: "All employees are required to attend the training.",
        japanese: "全従業員は研修への参加が義務付けられています。",
        explanation: "義務を表す受動態",
      },
    ],
    relatedProblems: ["passive"],
    prerequisites: ["basic-grammar-theory", "tenses-theory"],
  },

  // 関係詞 (relative)
  {
    id: "relative-theory",
    title: "関係詞で文を豊かに",
    category: "grammar",
    subcategory: "relative",
    level: 5,
    contentType: "theory",
    duration: 540, // 9分
    difficulty: "intermediate",
    content: `# 関係詞で文を豊かに

## 関係詞とは？
**2つの文を1つにつなげる**接続詞です。

### 関係代名詞
#### who（人）
- **例**: The man who is standing there is my teacher.
- **意味**: そこに立っている男性は私の先生です。

#### which（物・動物）
- **例**: The book which I bought yesterday is interesting.
- **意味**: 昨日買った本は面白いです。

#### that（人・物）
- **例**: The car that he drives is expensive.
- **意味**: 彼が運転する車は高価です。

### 関係副詞
#### where（場所）
- **例**: This is the place where I was born.
- **意味**: ここが私が生まれた場所です。

#### when（時）
- **例**: I remember the day when we first met.
- **意味**: 初めて会った日を覚えています。

## ビジネス英語での活用
### 効率的な情報伝達
- The client who called yesterday wants to reschedule. (昨日電話をかけた顧客は予定変更を希望しています)
- The project that we discussed is now approved. (私たちが話し合ったプロジェクトが承認されました)

### TOEIC頻出パターン
- The person who is responsible for... (責任者は...)
- The company which provides... (提供する会社は...)

## 実践への活用
- ✅ 文法クイズの関係詞問題で満点
- ✅ 英作文で複雑な文構造
- ✅ TOEICの長文読解で理解力向上`,
    keyPoints: [
      "who: 人を修飾",
      "which: 物・動物を修飾",
      "that: 人・物両方OK",
      "関係副詞で場所・時間を表現",
    ],
    examples: [
      {
        english: "The employee who works in accounting is very helpful.",
        japanese: "経理部で働く従業員はとても親切です。",
        explanation: "人を修飾するwho",
      },
      {
        english: "The software which we use is very efficient.",
        japanese: "私たちが使用するソフトウェアはとても効率的です。",
        explanation: "物を修飾するwhich",
      },
    ],
    relatedProblems: ["relative"],
    prerequisites: ["basic-grammar-theory", "tenses-theory"],
  },

  // 仮定法 (subjunctive)
  {
    id: "subjunctive-theory",
    title: "仮定法で表現力アップ",
    category: "grammar",
    subcategory: "subjunctive",
    level: 6,
    contentType: "theory",
    duration: 600, // 10分
    difficulty: "advanced",
    content: `# 仮定法で表現力アップ

## 仮定法とは？
**実際とは異なる仮定**を表現する文法です。

### 仮定法過去（現在の仮定）
#### 形：If + 主語 + 動詞の過去形, 主語 + would + 動詞原形
- **例**: If I were you, I would accept the offer.
- **意味**: もし私があなたなら、その申し出を受け入れるでしょう。
- **ポイント**: be動詞は人称に関係なく「were」

### 仮定法過去完了（過去の仮定）
#### 形：If + 主語 + had + 過去分詞, 主語 + would have + 過去分詞
- **例**: If I had studied harder, I would have passed the exam.
- **意味**: もっと勉強していたら、試験に合格していたでしょう。

### ビジネスでの仮定法
#### 丁寧な提案・依頼
- **Would you mind if...?**: ～していただけませんか？
- **I would appreciate if...**: ～していただければ幸いです
- **例**: I would appreciate if you could review this document.

#### 条件付きの話
- **If we had more budget, we could hire more staff.**
- **意味**: もっと予算があれば、より多くのスタッフを雇えるのですが。

## TOEIC攻略ポイント
### Part5-6での判別
- 仮定法のキーワード：if, wish, as if
- 時制の一致に注意
- wouldとwillの使い分け

### Part7での理解
- 提案書・企画書での仮定法表現
- 条件付きの契約条項

## 実践への活用
- ✅ 文法クイズの仮定法問題で満点
- ✅ 英作文で高度な表現力
- ✅ TOEICの上級問題で高得点`,
    keyPoints: [
      "仮定法過去：現在の非現実的仮定",
      "仮定法過去完了：過去の非現実的仮定",
      "ビジネスでの丁寧な表現",
      "TOEICでの頻出パターン",
    ],
    examples: [
      {
        english: "If I were the manager, I would change the policy.",
        japanese: "もし私がマネージャーなら、方針を変更するでしょう。",
        explanation: "仮定法過去：現在の非現実的な仮定",
      },
      {
        english: "I wish I could attend the conference.",
        japanese: "その会議に参加できればいいのですが。",
        explanation: "wishを使った願望の表現",
      },
    ],
    relatedProblems: ["subjunctive"],
    prerequisites: ["basic-grammar-theory", "tenses-theory", "modals-theory"],
  },

  // 比較 (comparison)
  {
    id: "comparison-theory",
    title: "比較表現をマスター",
    category: "grammar",
    subcategory: "comparison",
    level: 2,
    contentType: "theory",
    duration: 360, // 6分
    difficulty: "intermediate",
    content: `# 比較表現をマスター

## 比較の基本
**2つ以上のものを比べる**表現です。

### 比較級（2つを比較）
#### 形：-er / more + 形容詞 + than
- **短い語**: tall → taller
- **例**: Tokyo is larger than Osaka. (東京は大阪より大きいです)
- **長い語**: more + beautiful
- **例**: This car is more expensive than that one. (この車はあの車より高価です)

### 最上級（3つ以上で最も）
#### 形：the + -est / the most + 形容詞
- **短い語**: the tallest
- **例**: Mt. Fuji is the highest mountain in Japan. (富士山は日本で最も高い山です)
- **長い語**: the most + beautiful
- **例**: This is the most important meeting. (これは最も重要な会議です)

### 同等比較
#### 形：as + 形容詞 + as
- **例**: This book is as interesting as that one. (この本はあの本と同じくらい面白いです)
- **否定**: not as + 形容詞 + as = ～ほど...ではない

## ビジネス英語での活用
### 提案・比較検討
- **This solution is more cost-effective than the previous one.**
- **Our new system is the most efficient in the industry.**

### TOEIC頻出表現
- **比較級 + and + 比較級**: ますます～
  - The market is getting more and more competitive.
- **the + 比較級, the + 比較級**: ～すればするほど
  - The more you practice, the better you become.

## 実践への活用
- ✅ 文法クイズの比較問題で満点
- ✅ 英作文で説得力のある比較
- ✅ TOEICのグラフ・データ問題で高得点`,
    keyPoints: [
      "比較級：-er / more + than",
      "最上級：the -est / the most",
      "同等比較：as...as",
      "ビジネスでの比較表現",
    ],
    examples: [
      {
        english: "Our sales are higher than last year.",
        japanese: "売上は昨年より高いです。",
        explanation: "ビジネスでの比較級表現",
      },
      {
        english: "This is the best solution we can offer.",
        japanese: "これは私たちが提供できる最良の解決策です。",
        explanation: "最上級での強調表現",
      },
    ],
    relatedProblems: ["comparison"],
    prerequisites: ["basic-grammar-theory", "tenses-theory"],
  },

  // 分詞・動名詞 (participle)
  {
    id: "participle-theory",
    title: "分詞・動名詞の使い分け",
    category: "grammar",
    subcategory: "participle",
    level: 7,
    contentType: "theory",
    duration: 540, // 9分
    difficulty: "advanced",
    content: `# 分詞・動名詞の使い分け

## 現在分詞（-ing）
### 進行形
- **形**: be動詞 + -ing
- **例**: I am reading a book. (本を読んでいます)

### 形容詞的用法
- **前置修飾**: a running man (走っている男性)
- **後置修飾**: The man running over there is my friend. (向こうで走っている男性は友人です)

### 分詞構文
- **例**: Walking in the park, I met an old friend. (公園を歩いていて、旧友に会いました)

## 過去分詞（-ed）
### 受動態
- **例**: The book was written by Shakespeare. (その本はシェイクスピアによって書かれました)

### 形容詞的用法
- **例**: I found a broken window. (壊れた窓を見つけました)
- **例**: The letter written by him was beautiful. (彼によって書かれた手紙は美しかった)

## 動名詞（-ing）
### 名詞として使用
- **主語**: Swimming is good exercise. (水泳は良い運動です)
- **目的語**: I enjoy reading books. (読書を楽しんでいます)
- **前置詞の後**: Thank you for helping me. (手伝ってくれてありがとう)

### 動名詞 vs 不定詞
#### 動名詞を取る動詞
- enjoy, finish, avoid, mind, suggest
- **例**: I finished writing the report. (レポートを書き終えました)

#### 不定詞を取る動詞  
- want, decide, hope, plan, expect
- **例**: I decided to study abroad. (留学することを決めました)

## ビジネス英語での活用
### 効率的な表現
- **Having completed the project, we can focus on the next phase.**
- **The increasing demand requires more resources.**

## 実践への活用
- ✅ 文法クイズの分詞・動名詞問題で満点
- ✅ 英作文で洗練された表現
- ✅ TOEICの複雑な文構造理解`,
    keyPoints: [
      "現在分詞：進行・能動的修飾",
      "過去分詞：完了・受動的修飾",
      "動名詞：名詞としての-ing",
      "動名詞と不定詞の使い分け",
    ],
    examples: [
      {
        english: "The increasing sales show our success.",
        japanese: "増加している売上は私たちの成功を示しています。",
        explanation: "現在分詞の形容詞的用法",
      },
      {
        english: "I'm interested in learning new skills.",
        japanese: "新しいスキルを学ぶことに興味があります。",
        explanation: "前置詞の後の動名詞",
      },
    ],
    relatedProblems: ["participle"],
    prerequisites: ["basic-grammar-theory", "tenses-theory", "passive-theory"],
  },

  // 不定詞 (infinitive)
  {
    id: "infinitive-theory",
    title: "不定詞の3つの用法",
    category: "grammar",
    subcategory: "infinitive",
    level: 5,
    contentType: "theory",
    duration: 480, // 8分
    difficulty: "intermediate",
    content: `# 不定詞の3つの用法

## 不定詞とは？
**to + 動詞の原形**で、名詞・形容詞・副詞の働きをします。

### 名詞的用法（～すること）
#### 主語として
- **例**: To study English is important. (英語を勉強することは重要です)
- **改良**: It is important to study English. (英語を勉強することは重要です)

#### 目的語として
- **例**: I want to visit Japan. (日本を訪れたいです)
- **例**: I decided to change my job. (転職することを決めました)

### 形容詞的用法（～するための、～すべき）
#### 名詞を修飾
- **例**: I have something to tell you. (あなたに話すことがあります)
- **例**: This is the best way to solve the problem. (これが問題を解決する最良の方法です)

### 副詞的用法（～するために、～して）
#### 目的
- **例**: I came here to study English. (英語を勉強するためにここに来ました)
- **例**: We work hard to achieve our goals. (目標を達成するために一生懸命働きます)

#### 結果
- **例**: I woke up to find it was raining. (目を覚ますと雨が降っていました)

## ビジネス英語での重要性
### 目的・計画の表現
- **We need to improve our customer service.** (顧客サービスを改善する必要があります)
- **The goal is to increase sales by 20%.** (目標は売上を20%増加させることです)

### TOEIC頻出パターン
- **in order to**: ～するために（より丁寧）
- **so as to**: ～するために（否定形：so as not to）
- **too...to**: あまりに～すぎて...できない

## 実践への活用
- ✅ 文法クイズの不定詞問題で満点
- ✅ 英作文で目的・理由を明確に表現
- ✅ TOEICのビジネス文書で意図理解`,
    keyPoints: [
      "名詞的用法：～すること",
      "形容詞的用法：～するための",
      "副詞的用法：～するために",
      "ビジネスでの目的表現",
    ],
    examples: [
      {
        english: "Our company plans to expand overseas.",
        japanese: "私たちの会社は海外展開を計画しています。",
        explanation: "目的語としての不定詞",
      },
      {
        english: "We have a meeting to discuss the budget.",
        japanese: "予算について話し合う会議があります。",
        explanation: "形容詞的用法：meetingを修飾",
      },
    ],
    relatedProblems: ["infinitive"],
    prerequisites: ["basic-grammar-theory", "tenses-theory"],
  },

  // TOEIC語彙戦略
  {
    id: "toeic-vocabulary-strategy",
    title: "TOEIC語彙攻略法",
    category: "vocabulary",
    subcategory: "toeic",
    level: 3,
    contentType: "strategy",
    duration: 420, // 7分
    difficulty: "intermediate",
    content: `# TOEIC語彙攻略法

## TOEIC語彙の特徴
**ビジネス場面**に特化した実用的な語彙が中心です。

### スコア帯別語彙戦略
#### 400-500点レベル
- **基本ビジネス語彙**: meeting, office, schedule, report
- **日常語彙**: important, available, necessary, possible
- **戦略**: ガチャの基礎パックで基本語彙を固める

#### 500-600点レベル  
- **中級ビジネス語彙**: conference, presentation, deadline, budget
- **動詞**: implement, analyze, collaborate, optimize
- **戦略**: ガチャの中級パックで実用語彙を拡充

#### 600-700点レベル
- **上級ビジネス語彙**: acquisition, comprehensive, substantial
- **形容詞**: sophisticated, efficient, strategic
- **戦略**: ガチャの上級パックでレア語彙を収集

### 語彙学習の相乗効果
#### ガチャシステムとの連携
1. **ガチャでカード獲得** → 新しい語彙に出会う
2. **事前学習で理論理解** → 語彙の使い方を学ぶ
3. **語彙学習で実践** → 記憶定着を図る
4. **文法クイズで応用** → 文脈での使用練習

#### 効果的な学習順序
1. **事前学習**: 語彙の背景知識・使用場面を理解
2. **ガチャ**: 楽しみながら新語彙獲得
3. **語彙学習**: 集中的な記憶練習
4. **文法クイズ**: 実際の文での使用練習

## 実践への活用
- ✅ ガチャで獲得した語彙の効率的学習
- ✅ 文法クイズでの語彙問題対策
- ✅ TOEICスコア向上の戦略的アプローチ`,
    keyPoints: [
      "スコア帯別の語彙レベル",
      "ガチャシステムとの連携学習",
      "理論→実践の学習フロー",
      "ビジネス場面での実用性",
    ],
    examples: [
      {
        english: "The comprehensive report covers all aspects.",
        japanese: "包括的なレポートは全ての側面をカバーしています。",
        explanation: "上級語彙comprehensiveの使用例",
      },
      {
        english: "We need to optimize our workflow.",
        japanese: "ワークフローを最適化する必要があります。",
        explanation: "中級語彙optimizeの実用例",
      },
    ],
    relatedProblems: ["vocabulary"],
    prerequisites: [],
  },

  // 英作文戦略
  {
    id: "writing-strategy",
    title: "英作文で高得点を取る方法",
    category: "writing",
    subcategory: "strategy",
    level: 8,
    contentType: "strategy",
    duration: 480, // 8分
    difficulty: "advanced",
    content: `# 英作文で高得点を取る方法

## 英作文の基本戦略
**正確性**と**流暢性**のバランスが重要です。

### 文構造の基本パターン
#### シンプルな文から始める
1. **SVO**: I study English.
2. **SVC**: The meeting is important.
3. **SVOO**: He gave me a book.
4. **SVOC**: We found the solution effective.

#### 複雑な文への発展
1. **接続詞**: because, although, while
2. **関係詞**: who, which, that
3. **分詞構文**: Having finished the work, I went home.

### 語彙レベルの使い分け
#### 基本レベル（400-500点）
- **動詞**: go, come, make, take, get
- **形容詞**: good, bad, big, small, important
- **戦略**: 確実に使える語彙で文を構成

#### 中級レベル（500-600点）
- **動詞**: implement, analyze, collaborate
- **形容詞**: efficient, effective, appropriate
- **戦略**: ガチャで獲得した語彙を積極活用

#### 上級レベル（600-700点）
- **動詞**: optimize, enhance, facilitate
- **形容詞**: comprehensive, sophisticated, substantial
- **戦略**: レア語彙で表現力をアップ

### 文法クイズとの相乗効果
#### 学習した文法の実践
1. **基本文型** → 正確な語順で作文
2. **時制** → 適切な時制選択
3. **助動詞** → 丁寧さレベルの調整
4. **受動態** → フォーマルな表現
5. **関係詞** → 複雑な文構造
6. **仮定法** → 高度な表現力

## 実践への活用
- ✅ 文法クイズで学んだ知識の実践
- ✅ ガチャ語彙の効果的活用
- ✅ TOEICライティングセクション対策`,
    keyPoints: [
      "シンプルな文から複雑な文へ",
      "語彙レベルの戦略的使い分け",
      "文法知識の実践的応用",
      "ガチャ語彙との相乗効果",
    ],
    examples: [
      {
        english:
          "Having analyzed the data, we decided to implement the new strategy.",
        japanese: "データを分析した結果、新戦略を実施することを決定しました。",
        explanation: "分詞構文 + 上級語彙の組み合わせ",
      },
      {
        english:
          "The comprehensive report, which was written by our team, provides valuable insights.",
        japanese:
          "私たちのチームが作成した包括的なレポートは、貴重な洞察を提供します。",
        explanation: "関係詞 + 上級語彙での複雑な文構造",
      },
    ],
    relatedProblems: ["writing"],
    prerequisites: [
      "basic-grammar-theory",
      "tenses-theory",
      "relative-theory",
      "participle-theory",
    ],
  },
];

/**
 * レベル別コンテンツ取得
 */
export function getPreStudyContentsForLevel(
  userLevel: number
): PreStudyContent[] {
  return preStudyContents.filter((content) => content.level <= userLevel);
}

/**
 * カテゴリー別コンテンツ取得
 */
export function getPreStudyContentsByCategory(
  category: string
): PreStudyContent[] {
  if (category === "all") return preStudyContents;
  return preStudyContents.filter((content) => content.category === category);
}

/**
 * 文法カテゴリーに対応する事前学習コンテンツ取得
 */
export function getPreStudyContentForGrammarCategory(
  grammarCategory: string
): PreStudyContent | undefined {
  return preStudyContents.find(
    (content) => content.subcategory === grammarCategory
  );
}
