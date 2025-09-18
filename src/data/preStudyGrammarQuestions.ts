import { GrammarQuizQuestion } from "./grammarQuizCategorized";

/**
 * 事前学習のTOEIC例題を文法クイズ形式に変換した問題集
 * 事前学習完了後に文法クイズで出題される
 */
export const preStudyGrammarQuestions: GrammarQuizQuestion[] = [
  // 時制の完全マスター由来の問題
  {
    id: 10001,
    sentence: "The new employee _____ with our company for three months now.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "has been working" }],
    options: ["works", "worked", "has been working", "will work"],
    explanation:
      "【事前学習連携】「3か月間」という継続期間を表すfor three monthsがあるため、現在完了進行形has been workingが正解。過去から現在まで継続している状況を表現している。",
    level: "intermediate",
    category: "tenses",
    source: "prestudy",
    preStudyContentId: "tenses-theory",
    toeicPart: 5,
  },
  {
    id: 10002,
    sentence:
      "By the time the meeting starts, I _____ all the necessary documents.",
    blanks: [
      { id: "blank1", position: 7, correctAnswer: "will have prepared" },
    ],
    options: ["prepare", "prepared", "will prepare", "will have prepared"],
    explanation:
      "【事前学習連携】By the timeは「～する時までには」という意味で、未来のある時点までに完了している行動を表すため、未来完了形will have preparedが正解。",
    level: "intermediate",
    category: "tenses",
    source: "prestudy",
    preStudyContentId: "tenses-theory",
    toeicPart: 5,
  },
  {
    id: 10003,
    sentence: "Last year, our company _____ a 15% increase in revenue.",
    blanks: [{ id: "blank1", position: 4, correctAnswer: "experienced" }],
    options: [
      "experiences",
      "experienced",
      "has experienced",
      "will experience",
    ],
    explanation:
      "【事前学習連携】Last yearという過去の特定時点を示す語句があるため、過去形experiencedが正解。現在完了形は特定の過去時点を表す語句とは一緒に使えない。",
    level: "beginner",
    category: "tenses",
    source: "prestudy",
    preStudyContentId: "tenses-theory",
    toeicPart: 5,
  },
  {
    id: 10004,
    sentence:
      "The project manager _____ the team every Monday to discuss progress.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "meets" }],
    options: ["meets", "met", "has met", "will meet"],
    explanation:
      "【事前学習連携】every Mondayという習慣・反復を表す語句があるため、現在形meetsが正解。習慣的な行動は現在形で表現する。",
    level: "beginner",
    category: "tenses",
    source: "prestudy",
    preStudyContentId: "tenses-theory",
    toeicPart: 5,
  },

  // 助動詞由来の問題（将来追加予定）
  {
    id: 10005,
    sentence: "You _____ submit the report by Friday.",
    blanks: [{ id: "blank1", position: 1, correctAnswer: "must" }],
    options: ["can", "may", "must", "might"],
    explanation:
      "【事前学習連携】期限が決まっている義務を表すため、強い義務を示すmustが正解。",
    level: "intermediate",
    category: "auxiliaries",
    source: "prestudy",
    preStudyContentId: "modals-theory",
    toeicPart: 5,
  },
  {
    id: 10006,
    sentence: "_____ you help me with this project?",
    blanks: [{ id: "blank1", position: 0, correctAnswer: "Could" }],
    options: ["Can", "Could", "Will", "Should"],
    explanation:
      "【事前学習連携】丁寧な依頼を表すため、Couldが最も適切。ビジネス場面では丁寧さが重要。",
    level: "intermediate",
    category: "auxiliaries",
    source: "prestudy",
    preStudyContentId: "modals-theory",
    toeicPart: 5,
  },

  // 受動態由来の問題（将来追加予定）
  {
    id: 10007,
    sentence: "The new policy _____ implemented next month.",
    blanks: [{ id: "blank1", position: 3, correctAnswer: "will be" }],
    options: ["will", "will be", "is", "was"],
    explanation:
      "【事前学習連携】受動態の未来形。新しい方針が「実施される」ため、will be implementedが正解。",
    level: "intermediate",
    category: "passive-voice",
    source: "prestudy",
    preStudyContentId: "passive-theory",
    toeicPart: 5,
  },
  {
    id: 10008,
    sentence: "All employees _____ required to attend the training.",
    blanks: [{ id: "blank1", position: 2, correctAnswer: "are" }],
    options: ["is", "are", "was", "were"],
    explanation:
      "【事前学習連携】All employeesは複数形のため、areが正解。義務を表す受動態の現在形。",
    level: "beginner",
    category: "passive-voice",
    source: "prestudy",
    preStudyContentId: "passive-theory",
    toeicPart: 5,
  },
];

/**
 * 事前学習完了状況に基づいて利用可能な問題を取得
 */
export function getAvailablePreStudyQuestions(
  level?: "beginner" | "intermediate" | "advanced",
  category?: string
): GrammarQuizQuestion[] {
  // 完了した事前学習コンテンツを確認
  const completedContentsStr = localStorage.getItem(
    "entp-completed-prestudy-contents"
  );
  if (!completedContentsStr) {
    console.log("📚 事前学習未完了のため、事前学習由来の問題は0問");
    return [];
  }

  const completedContents = JSON.parse(completedContentsStr);

  // 完了した事前学習コンテンツに対応する問題のみを取得
  let availableQuestions = preStudyGrammarQuestions.filter((q) =>
    completedContents.includes(q.preStudyContentId)
  );

  // レベルフィルタリング
  if (level) {
    availableQuestions = availableQuestions.filter((q) => q.level === level);
  }

  // カテゴリフィルタリング
  if (category) {
    availableQuestions = availableQuestions.filter(
      (q) => q.category === category
    );
  }

  console.log(
    `📚 事前学習由来の利用可能問題: ${
      availableQuestions.length
    }問 (完了コンテンツ: ${completedContents.join(", ")})`
  );

  return availableQuestions;
}
