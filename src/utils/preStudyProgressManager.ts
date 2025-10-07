import { GrammarQuizQuestion } from "../data/grammarQuizCategorized";
import { preStudyContents } from "../data/preStudyContents";
import { TOEICExample } from "../types/starSystem";

/**
 * 事前学習の進捗を管理し、学習済みコンテンツを文法クイズに反映
 */
export class PreStudyProgressManager {
  private static readonly COMPLETED_CONTENTS_KEY =
    "entp-completed-prestudy-contents";
  private static readonly TOEIC_ANSWERS_KEY = "entp-toeic-answers";

  /**
   * 完了した事前学習コンテンツを保存
   */
  static markContentAsCompleted(contentId: string): void {
    const completed = this.getCompletedContents();
    if (!completed.includes(contentId)) {
      completed.push(contentId);
      localStorage.setItem(
        this.COMPLETED_CONTENTS_KEY,
        JSON.stringify(completed)
      );
      console.log(`📚 事前学習「${contentId}」を完了としてマーク`);
    }
  }

  /**
   * 完了した事前学習コンテンツ一覧を取得
   */
  static getCompletedContents(): string[] {
    try {
      const stored = localStorage.getItem(this.COMPLETED_CONTENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("完了コンテンツの読み込みエラー:", error);
      return [];
    }
  }

  /**
   * 特定のコンテンツが完了済みかチェック
   */
  static isContentCompleted(contentId: string): boolean {
    return this.getCompletedContents().includes(contentId);
  }

  /**
   * TOEIC例題の解答結果を保存
   */
  static saveToeicAnswers(
    contentId: string,
    answers: Record<number, number>
  ): void {
    try {
      const allAnswers = this.getAllToeicAnswers();
      allAnswers[contentId] = answers;
      localStorage.setItem(this.TOEIC_ANSWERS_KEY, JSON.stringify(allAnswers));
      console.log(`🎯 ${contentId}のTOEIC解答結果を保存:`, answers);
    } catch (error) {
      console.error("TOEIC解答結果の保存エラー:", error);
    }
  }

  /**
   * 全てのTOEIC例題解答結果を取得
   */
  static getAllToeicAnswers(): Record<string, Record<number, number>> {
    try {
      const stored = localStorage.getItem(this.TOEIC_ANSWERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("TOEIC解答結果の読み込みエラー:", error);
      return {};
    }
  }

  /**
   * 特定コンテンツのTOEIC解答結果を取得
   */
  static getToeicAnswers(contentId: string): Record<number, number> {
    const allAnswers = this.getAllToeicAnswers();
    return allAnswers[contentId] || {};
  }

  /**
   * 事前学習のTOEIC例題を文法クイズ形式に変換
   */
  static convertToeicToGrammarQuiz(
    toeicExample: TOEICExample,
    contentId: string,
    baseId: number
  ): GrammarQuizQuestion {
    // TOEIC形式の4択問題を文法クイズの穴埋め形式に変換
    const sentence = toeicExample.question.replace("_____", "_____");
    const correctAnswer = toeicExample.choices[toeicExample.correctAnswer];

    return {
      id: baseId,
      sentence: sentence,
      blanks: [
        {
          id: "blank1",
          position: this.findBlankPosition(sentence),
          correctAnswer: correctAnswer,
        },
      ],
      options: toeicExample.choices,
      explanation: `【事前学習連携】${toeicExample.explanation}`,
      level: this.mapToeicDifficultyToLevel(toeicExample.type),
      category: this.mapToeicCategoryToGrammarCategory(toeicExample.type),
      source: "prestudy", // 事前学習由来であることを示す
      preStudyContentId: contentId, // 関連する事前学習コンテンツID
      toeicPart: toeicExample.part,
    };
  }

  /**
   * 文中の空欄位置を特定
   */
  private static findBlankPosition(sentence: string): number {
    const words = sentence.split(" ");
    return words.findIndex((word) => word.includes("_____"));
  }

  /**
   * TOEIC問題タイプを文法クイズレベルにマッピング
   */
  private static mapToeicDifficultyToLevel(
    type: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (type) {
      case "vocabulary":
        return "intermediate";
      case "grammar":
        return "intermediate";
      case "reading":
        return "advanced";
      default:
        return "intermediate";
    }
  }

  /**
   * TOEIC問題タイプを文法クイズカテゴリにマッピング
   */
  private static mapToeicCategoryToGrammarCategory(
    type: string
  ):
    | "tenses"
    | "subjunctive"
    | "comparison"
    | "basic-sentence-patterns"
    | "auxiliaries"
    | "passive-voice"
    | "relative-clauses"
    | "participles-gerunds"
    | "infinitives" {
    switch (type) {
      case "grammar":
        return "tenses"; // 多くのTOEIC文法問題は時制関連
      case "vocabulary":
        return "basic-sentence-patterns";
      case "reading":
        return "relative-clauses";
      default:
        return "tenses";
    }
  }

  /**
   * 学習済み事前学習コンテンツから文法クイズ問題を生成
   */
  static generateGrammarQuestionsFromPreStudy(): GrammarQuizQuestion[] {
    const completedContents = this.getCompletedContents();
    const allAnswers = this.getAllToeicAnswers();
    const generatedQuestions: GrammarQuizQuestion[] = [];

    // 事前学習コンテンツから問題を生成
    try {
      let questionId = 10000; // 事前学習由来の問題は10000番台

      completedContents.forEach((contentId) => {
        const content = preStudyContents.find((c) => c.id === contentId);
        if (content?.toeicExamples && allAnswers[contentId]) {
          content.toeicExamples.forEach((toeicExample) => {
            const grammarQuestion = this.convertToeicToGrammarQuiz(
              toeicExample,
              contentId,
              questionId++
            );
            generatedQuestions.push(grammarQuestion);
          });
        }
      });

      console.log(
        `📚 事前学習から${generatedQuestions.length}問の文法クイズを生成`
      );
    } catch (error) {
      console.error("事前学習問題生成エラー:", error);
    }

    return generatedQuestions;
  }

  /**
   * 統計情報を取得
   */
  static getStats(): {
    completedContents: number;
    totalToeicAnswers: number;
    generatedQuestions: number;
  } {
    const completed = this.getCompletedContents();
    const answers = this.getAllToeicAnswers();
    const totalAnswers = Object.values(answers).reduce(
      (sum, contentAnswers) => sum + Object.keys(contentAnswers).length,
      0
    );

    return {
      completedContents: completed.length,
      totalToeicAnswers: totalAnswers,
      generatedQuestions: this.generateGrammarQuestionsFromPreStudy().length,
    };
  }

  /**
   * 進捗データをリセット
   */
  static resetProgress(): void {
    localStorage.removeItem(this.COMPLETED_CONTENTS_KEY);
    localStorage.removeItem(this.TOEIC_ANSWERS_KEY);
    console.log("🔄 事前学習進捗データをリセット");
  }
}
