// リスニング×ガチャ連携システム
import { VocabularyWord } from "../data/vocabulary";
import { dbManager, STORES } from "./IndexedDBManager";

export interface ListeningRecommendation {
  word: VocabularyWord;
  reason: string;
  priority: "high" | "medium" | "low";
  listeningContext: {
    part: string;
    difficulty: string;
    missedWords: string[];
    weakAreas: string[];
  };
}

export interface ListeningAnalysis {
  userId: string;
  weakVocabulary: string[];
  strongVocabulary: string[];
  listeningPatterns: {
    part1: { accuracy: number; weakWords: string[] };
    part2: { accuracy: number; weakWords: string[] };
    part3: { accuracy: number; weakWords: string[] };
    part4: { accuracy: number; weakWords: string[] };
  };
  recommendedWords: VocabularyWord[];
  lastUpdated: Date;
}

class ListeningGachaIntegration {
  private static instance: ListeningGachaIntegration;

  private constructor() {}

  public static getInstance(): ListeningGachaIntegration {
    if (!ListeningGachaIntegration.instance) {
      ListeningGachaIntegration.instance = new ListeningGachaIntegration();
    }
    return ListeningGachaIntegration.instance;
  }

  /**
   * リスニングスコアに基づいて語彙を分析し、推奨語彙を生成
   */
  public async analyzeListeningPerformance(
    userId: string
  ): Promise<ListeningAnalysis> {
    try {
      console.log(`🎯 リスニングパフォーマンス分析開始: ${userId}`);

      // リスニング進捗データを取得
      const allProgress = await dbManager.getAll(STORES.LISTENING_PROGRESS);
      const userProgress = allProgress.filter((p: any) => p.userId === userId);

      if (userProgress.length === 0) {
        console.log("リスニングデータが見つかりません");
        return this.createEmptyAnalysis(userId);
      }

      // パート別の分析
      const partAnalysis = {
        part1: await this.analyzePartPerformance(userProgress, "part1"),
        part2: await this.analyzePartPerformance(userProgress, "part2"),
        part3: await this.analyzePartPerformance(userProgress, "part3"),
        part4: await this.analyzePartPerformance(userProgress, "part4"),
      };

      // 弱い語彙と強い語彙を特定
      const weakVocabulary = this.extractWeakVocabulary(partAnalysis);
      const strongVocabulary = this.extractStrongVocabulary(partAnalysis);

      // 推奨語彙を生成
      const recommendedWords = await this.generateRecommendedWords(
        weakVocabulary,
        partAnalysis
      );

      const analysis: ListeningAnalysis = {
        userId,
        weakVocabulary,
        strongVocabulary,
        listeningPatterns: partAnalysis,
        recommendedWords,
        lastUpdated: new Date(),
      };

      // 分析結果を保存
      await this.saveAnalysis(analysis);

      console.log(
        `🎯 リスニング分析完了: 弱い語彙${weakVocabulary.length}個, 推奨語彙${recommendedWords.length}個`
      );
      return analysis;
    } catch (error) {
      console.error("リスニングパフォーマンス分析エラー:", error);
      return this.createEmptyAnalysis(userId);
    }
  }

  /**
   * 特定のパートのパフォーマンスを分析
   */
  private async analyzePartPerformance(
    userProgress: any[],
    part: string
  ): Promise<{ accuracy: number; weakWords: string[] }> {
    const partSessions = userProgress.filter((p: any) => p.part === part);

    if (partSessions.length === 0) {
      return { accuracy: 0, weakWords: [] };
    }

    // 平均スコアを計算
    const totalScore = partSessions.reduce(
      (sum, session) => sum + session.score,
      0
    );
    const averageAccuracy = totalScore / partSessions.length;

    // 間違えた問題から語彙を抽出
    const weakWords = new Set<string>();
    partSessions.forEach((session: any) => {
      if (session.questionResults) {
        session.questionResults.forEach((result: any) => {
          if (!result.isCorrect && result.vocabulary) {
            result.vocabulary.forEach((word: string) => {
              weakWords.add(word.toLowerCase());
            });
          }
        });
      }
    });

    return {
      accuracy: averageAccuracy,
      weakWords: Array.from(weakWords),
    };
  }

  /**
   * 弱い語彙を抽出
   */
  private extractWeakVocabulary(partAnalysis: any): string[] {
    const weakWords = new Set<string>();

    Object.values(partAnalysis).forEach((part: any) => {
      if (part.accuracy < 70 && part.weakWords.length > 0) {
        part.weakWords.forEach((word: string) => {
          weakWords.add(word);
        });
      }
    });

    return Array.from(weakWords);
  }

  /**
   * 強い語彙を抽出
   */
  private extractStrongVocabulary(partAnalysis: any): string[] {
    const strongWords = new Set<string>();

    Object.values(partAnalysis).forEach((part: any) => {
      if (part.accuracy >= 80) {
        // 高スコアのパートでは、そのパートで使われた語彙を強い語彙として扱う
        // 実際の実装では、正解した問題の語彙を抽出する必要がある
      }
    });

    return Array.from(strongWords);
  }

  /**
   * 推奨語彙を生成
   */
  private async generateRecommendedWords(
    weakVocabulary: string[],
    partAnalysis: any
  ): Promise<VocabularyWord[]> {
    try {
      // 語彙データを取得
      const allVocabulary = await dbManager.getAll(STORES.VOCABULARY);

      // 弱い語彙に関連する語彙を推奨
      const recommendedWords: VocabularyWord[] = [];
      const usedWords = new Set<string>();

      // 1. 弱い語彙と同じカテゴリの語彙を推奨
      weakVocabulary.forEach((weakWord) => {
        const relatedWords = (allVocabulary as VocabularyWord[]).filter(
          (word: VocabularyWord) => {
            if (
              usedWords.has(word.english) ||
              word.english.toLowerCase() === weakWord
            ) {
              return false;
            }

            // 同じカテゴリまたは関連するカテゴリ
            const isRelated =
              word.category === this.getCategoryForWord(weakWord) ||
              this.isSemanticallyRelated(word.english, weakWord);

            return (
              isRelated &&
              (typeof word.level === "number"
                ? word.level <= 3
                : parseInt(word.level) <= 3)
            ); // 中級まで
          }
        );

        // 最大3個の関連語彙を追加
        (relatedWords as VocabularyWord[])
          .slice(0, 3)
          .forEach((word: VocabularyWord) => {
            recommendedWords.push(word);
            usedWords.add(word.english);
          });
      });

      // 2. リスニングスコアが低いパートに関連する語彙を推奨
      Object.entries(partAnalysis).forEach(
        ([part, analysis]: [string, any]) => {
          if (analysis.accuracy < 70) {
            const partRelatedWords = (allVocabulary as VocabularyWord[]).filter(
              (word: VocabularyWord) => {
                if (usedWords.has(word.english)) return false;

                // パートに応じた語彙カテゴリ
                const isPartRelated = this.isWordRelatedToPart(word, part);
                return (
                  isPartRelated &&
                  (typeof word.level === "number"
                    ? word.level <= 3
                    : parseInt(word.level) <= 3)
                );
              }
            );

            // 最大2個のパート関連語彙を追加
            (partRelatedWords as VocabularyWord[])
              .slice(0, 2)
              .forEach((word: VocabularyWord) => {
                recommendedWords.push(word);
                usedWords.add(word.english);
              });
          }
        }
      );

      // 3. TOEIC頻出語彙を補完（弱い語彙が少ない場合）
      if (weakVocabulary.length < 5) {
        const toeicWords = (allVocabulary as VocabularyWord[]).filter(
          (word: VocabularyWord) => {
            if (usedWords.has(word.english)) return false;
            return (
              word.category === "toeic" ||
              word.category === "daily" ||
              word.category === "toeic"
            );
          }
        );

        (toeicWords as VocabularyWord[])
          .slice(0, 5)
          .forEach((word: VocabularyWord) => {
            recommendedWords.push(word);
            usedWords.add(word.english);
          });
      }

      // 重複を除去して最大20個まで
      const uniqueRecommendations = recommendedWords
        .filter(
          (word, index, self) =>
            index === self.findIndex((w) => w.english === word.english)
        )
        .slice(0, 20);

      console.log(`🎯 推奨語彙生成完了: ${uniqueRecommendations.length}個`);
      return uniqueRecommendations;
    } catch (error) {
      console.error("推奨語彙生成エラー:", error);
      return [];
    }
  }

  /**
   * 語彙のカテゴリを推定
   */
  private getCategoryForWord(word: string): string {
    // 簡単なカテゴリ推定ロジック
    const businessWords = [
      "meeting",
      "project",
      "deadline",
      "budget",
      "report",
    ];
    const academicWords = ["research", "study", "analysis", "theory", "method"];
    const dailyWords = ["food", "travel", "weather", "family", "home"];

    if (businessWords.some((bw) => word.includes(bw))) return "business";
    if (academicWords.some((aw) => word.includes(aw))) return "academic";
    if (dailyWords.some((dw) => word.includes(dw))) return "daily";

    return "general";
  }

  /**
   * 語彙の意味的関連性を判定
   */
  private isSemanticallyRelated(word1: string, word2: string): boolean {
    // 簡単な意味的関連性判定
    const word1Lower = word1.toLowerCase();
    const word2Lower = word2.toLowerCase();

    // 共通の語根や接頭辞・接尾辞
    const commonPrefixes = ["pre", "post", "un", "re", "dis"];
    const commonSuffixes = ["tion", "sion", "ing", "ed", "ly"];

    for (const prefix of commonPrefixes) {
      if (word1Lower.startsWith(prefix) && word2Lower.startsWith(prefix)) {
        return true;
      }
    }

    for (const suffix of commonSuffixes) {
      if (word1Lower.endsWith(suffix) && word2Lower.endsWith(suffix)) {
        return true;
      }
    }

    return false;
  }

  /**
   * パートに関連する語彙かどうかを判定
   */
  private isWordRelatedToPart(word: VocabularyWord, part: string): boolean {
    switch (part) {
      case "part1":
        // Part 1: 写真描写 - 日常的な語彙
        return ["daily", "transportation", "food", "clothing"].includes(
          word.category || ""
        );
      case "part2":
        // Part 2: 応答問題 - 会話的な語彙
        return ["daily", "communication", "social"].includes(
          word.category || ""
        );
      case "part3":
        // Part 3: 会話問題 - ビジネス・日常会話
        return ["business", "daily", "communication"].includes(
          word.category || ""
        );
      case "part4":
        // Part 4: 説明文問題 - アカデミック・ビジネス
        return ["business", "academic", "professional"].includes(
          word.category || ""
        );
      default:
        return false;
    }
  }

  /**
   * 分析結果を保存
   */
  private async saveAnalysis(analysis: ListeningAnalysis): Promise<void> {
    try {
      await dbManager.put(STORES.USER_PROGRESS, {
        id: `listening_analysis_${analysis.userId}`,
        userId: analysis.userId,
        type: "listening_analysis",
        data: analysis,
        lastUpdated: analysis.lastUpdated,
      });
      console.log(`🎯 リスニング分析結果を保存: ${analysis.userId}`);
    } catch (error) {
      console.error("リスニング分析結果保存エラー:", error);
    }
  }

  /**
   * 空の分析結果を作成
   */
  private createEmptyAnalysis(userId: string): ListeningAnalysis {
    return {
      userId,
      weakVocabulary: [],
      strongVocabulary: [],
      listeningPatterns: {
        part1: { accuracy: 0, weakWords: [] },
        part2: { accuracy: 0, weakWords: [] },
        part3: { accuracy: 0, weakWords: [] },
        part4: { accuracy: 0, weakWords: [] },
      },
      recommendedWords: [],
      lastUpdated: new Date(),
    };
  }

  /**
   * ユーザーのリスニング分析結果を取得
   */
  public async getListeningAnalysis(
    userId: string
  ): Promise<ListeningAnalysis | null> {
    try {
      const result = await dbManager.get(
        STORES.USER_PROGRESS,
        `listening_analysis_${userId}`
      );
      return result as ListeningAnalysis | null;
    } catch (error) {
      console.error("リスニング分析結果取得エラー:", error);
      return null;
    }
  }

  /**
   * リスニング学習後の推奨語彙を取得
   */
  public async getRecommendedWordsForGacha(
    userId: string
  ): Promise<ListeningRecommendation[]> {
    try {
      const analysis = await this.getListeningAnalysis(userId);
      if (!analysis || analysis.recommendedWords.length === 0) {
        // 分析結果がない場合は新しく分析を実行
        const newAnalysis = await this.analyzeListeningPerformance(userId);
        return this.convertToRecommendations(
          newAnalysis.recommendedWords,
          newAnalysis
        );
      }

      return this.convertToRecommendations(analysis.recommendedWords, analysis);
    } catch (error) {
      console.error("推奨語彙取得エラー:", error);
      return [];
    }
  }

  /**
   * 語彙を推奨形式に変換
   */
  private convertToRecommendations(
    words: VocabularyWord[],
    analysis: ListeningAnalysis
  ): ListeningRecommendation[] {
    return words.map((word, index) => {
      const priority = index < 5 ? "high" : index < 10 ? "medium" : "low";

      return {
        word,
        reason: this.generateRecommendationReason(word, analysis),
        priority,
        listeningContext: {
          part: this.getWeakestPart(analysis),
          difficulty: "intermediate",
          missedWords: analysis.weakVocabulary.slice(0, 3),
          weakAreas: this.getWeakAreas(analysis),
        },
      };
    });
  }

  /**
   * 推奨理由を生成
   */
  private generateRecommendationReason(
    word: VocabularyWord,
    analysis: ListeningAnalysis
  ): string {
    const weakPart = this.getWeakestPart(analysis);

    if (analysis.weakVocabulary.includes(word.english.toLowerCase())) {
      return `リスニングで間違えた語彙です。${weakPart}の理解を深めましょう。`;
    }

    if (this.isWordRelatedToPart(word, weakPart)) {
      return `${weakPart}のスコア向上に役立つ語彙です。`;
    }

    return "リスニングスコア向上に効果的な語彙です。";
  }

  /**
   * 最も弱いパートを特定
   */
  private getWeakestPart(analysis: ListeningAnalysis): string {
    const parts = Object.entries(analysis.listeningPatterns);
    const weakestPart = parts.reduce((weakest, [part, data]) => {
      return data.accuracy <
        analysis.listeningPatterns[
          weakest as keyof typeof analysis.listeningPatterns
        ].accuracy
        ? part
        : weakest;
    }, "part1");

    return weakestPart;
  }

  /**
   * 弱い領域を特定
   */
  private getWeakAreas(analysis: ListeningAnalysis): string[] {
    const weakAreas: string[] = [];

    Object.entries(analysis.listeningPatterns).forEach(([part, data]) => {
      if (data.accuracy < 70) {
        weakAreas.push(part);
      }
    });

    return weakAreas;
  }
}

// シングルトンインスタンスをエクスポート
export const listeningGachaIntegration =
  ListeningGachaIntegration.getInstance();
