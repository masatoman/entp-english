/**
 * 高度音声認識システム
 * 英語発音練習・リスニング強化・音声フィードバック機能
 */

import { handleError } from "./errorHandler";
import { logError, logInfo } from "./logger";

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  pronunciation: PronunciationAnalysis;
  feedback: string[];
  score: number;
}

export interface PronunciationAnalysis {
  accuracy: number; // 0-100の発音精度
  rhythm: number; // リズム・強勢の正確性
  intonation: number; // イントネーションの自然性
  clarity: number; // 明瞭性
  fluency: number; // 流暢性
  weakPoints: string[]; // 改善点
  strongPoints: string[]; // 良い点
}

export interface VoiceFeedback {
  overallScore: number;
  detailedAnalysis: {
    phonemes: PhonemeAnalysis[];
    words: WordAnalysis[];
    sentences: SentenceAnalysis[];
  };
  improvementSuggestions: string[];
  practiceRecommendations: string[];
}

export interface PhonemeAnalysis {
  phoneme: string;
  accuracy: number;
  frequency: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface WordAnalysis {
  word: string;
  pronunciationScore: number;
  stressPattern: boolean;
  commonMistakes: string[];
}

export interface SentenceAnalysis {
  sentence: string;
  intonationScore: number;
  rhythmScore: number;
  pausePattern: boolean;
}

export class AdvancedSpeechRecognition {
  private static recognition: any = null;
  private static isListening = false;
  // private static readonly _CONFIDENCE_THRESHOLD = 0.7;

  /**
   * 音声認識システムの初期化
   */
  static initialize(): boolean {
    try {
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        logError("音声認識がサポートされていません");
        return false;
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      // 基本設定
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
      this.recognition.maxAlternatives = 3;

      logInfo("高度音声認識システムを初期化");
      return true;
    } catch (error) {
      handleError(error as Error, {
        component: "AdvancedSpeechRecognition",
        action: "initialize",
      });
      return false;
    }
  }

  /**
   * 発音練習セッションの開始
   */
  static async startPronunciationPractice(
    targetText: string,
    difficulty: "beginner" | "intermediate" | "advanced" = "intermediate"
  ): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.recognition) {
          throw new Error("音声認識が初期化されていません");
        }

        if (this.isListening) {
          throw new Error("既に音声認識が実行中です");
        }

        this.isListening = true;
        let finalTranscript = "";
        let bestConfidence = 0;

        // 結果処理
        this.recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];

            if (result.isFinal) {
              finalTranscript = result[0].transcript;
              bestConfidence = result[0].confidence;
            }
          }
        };

        // 認識終了時の処理
        this.recognition.onend = () => {
          this.isListening = false;

          const analysis = this.analyzePronunciation(
            targetText,
            finalTranscript,
            bestConfidence
          );
          const feedback = this.generatePronunciationFeedback(
            analysis,
            difficulty
          );
          const score = this.calculatePronunciationScore(analysis);

          const result: SpeechRecognitionResult = {
            transcript: finalTranscript,
            confidence: bestConfidence,
            pronunciation: analysis,
            feedback,
            score,
          };

          logInfo("発音練習完了", {
            targetText,
            transcript: finalTranscript,
            confidence: bestConfidence,
            score,
          });

          resolve(result);
        };

        // エラー処理
        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          const error = new Error(`音声認識エラー: ${event.error}`);
          handleError(error, {
            component: "AdvancedSpeechRecognition",
            targetText,
            errorType: event.error,
          });
          reject(error);
        };

        // 認識開始
        this.recognition.start();
        logInfo("発音練習開始", { targetText, difficulty });
      } catch (error) {
        this.isListening = false;
        handleError(error as Error, {
          component: "AdvancedSpeechRecognition",
          action: "start-pronunciation-practice",
          targetText,
        });
        reject(error);
      }
    });
  }

  /**
   * リスニング理解度テスト
   */
  static async startListeningComprehension(
    audioText: string,
    questions: Array<{ question: string; correctAnswer: string }>
  ): Promise<{
    listeningScore: number;
    comprehensionScore: number;
    answers: Array<{
      question: string;
      userAnswer: string;
      isCorrect: boolean;
    }>;
    feedback: string[];
  }> {
    try {
      logInfo("リスニング理解度テスト開始", {
        questionsCount: questions.length,
      });

      // 音声再生（実際の実装では音声ファイルを再生）
      await this.playAudio(audioText);

      // 質問への回答収集
      const answers = [];
      for (const question of questions) {
        const userAnswer = await this.getVoiceAnswer(question.question);
        const isCorrect = this.compareAnswers(
          userAnswer,
          question.correctAnswer
        );
        answers.push({
          question: question.question,
          userAnswer,
          isCorrect,
        });
      }

      // スコア計算
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const comprehensionScore = (correctAnswers / questions.length) * 100;
      const listeningScore = this.calculateListeningScore(answers);

      // フィードバック生成
      const feedback = this.generateListeningFeedback(
        answers,
        comprehensionScore
      );

      logInfo("リスニング理解度テスト完了", {
        listeningScore,
        comprehensionScore,
        correctAnswers,
        totalQuestions: questions.length,
      });

      return {
        listeningScore,
        comprehensionScore,
        answers,
        feedback,
      };
    } catch (error) {
      handleError(error as Error, {
        component: "AdvancedSpeechRecognition",
        action: "listening-comprehension",
      });
      return {
        listeningScore: 0,
        comprehensionScore: 0,
        answers: [],
        feedback: ["リスニングテストでエラーが発生しました"],
      };
    }
  }

  /**
   * 音声フィードバックシステム
   */
  static generateVoiceFeedback(
    recognitionResults: SpeechRecognitionResult[],
    learningGoals: string[]
  ): VoiceFeedback {
    try {
      // 全体的な分析
      const overallScore =
        recognitionResults.reduce((sum, r) => sum + r.score, 0) /
        recognitionResults.length;

      // 詳細分析
      const phonemeAnalysis = this.analyzePhonemes(recognitionResults);
      const wordAnalysis = this.analyzeWords(recognitionResults);
      const sentenceAnalysis = this.analyzeSentences(recognitionResults);

      // 改善提案
      const improvementSuggestions = this.generateImprovementSuggestions(
        phonemeAnalysis,
        wordAnalysis,
        sentenceAnalysis
      );

      // 練習推奨
      const practiceRecommendations = this.generatePracticeRecommendations(
        recognitionResults,
        learningGoals
      );

      return {
        overallScore,
        detailedAnalysis: {
          phonemes: phonemeAnalysis,
          words: wordAnalysis,
          sentences: sentenceAnalysis,
        },
        improvementSuggestions,
        practiceRecommendations,
      };
    } catch (error) {
      handleError(error as Error, {
        component: "AdvancedSpeechRecognition",
        action: "generate-voice-feedback",
      });
      return {
        overallScore: 0,
        detailedAnalysis: { phonemes: [], words: [], sentences: [] },
        improvementSuggestions: [
          "音声フィードバック生成でエラーが発生しました",
        ],
        practiceRecommendations: [],
      };
    }
  }

  /**
   * 発音分析
   */
  private static analyzePronunciation(
    target: string,
    actual: string,
    confidence: number
  ): PronunciationAnalysis {
    // 簡略化された発音分析
    const similarity = this.calculateSimilarity(
      target.toLowerCase(),
      actual.toLowerCase()
    );

    return {
      accuracy: similarity * confidence * 100,
      rhythm: 75 + Math.random() * 20, // 実際の実装では音声解析
      intonation: 70 + Math.random() * 25,
      clarity: confidence * 100,
      fluency: 80 + Math.random() * 15,
      weakPoints: similarity < 0.8 ? ["単語の発音", "文の流れ"] : [],
      strongPoints: confidence > 0.8 ? ["明瞭性", "自信"] : [],
    };
  }

  /**
   * 文字列類似度計算
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * レーベンシュタイン距離
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // 他のヘルパーメソッド（実装は簡略化）
  private static generatePronunciationFeedback(
    analysis: PronunciationAnalysis,
    _difficulty: string
  ): string[] {
    const feedback = [];

    if (analysis.accuracy > 80) {
      feedback.push("素晴らしい発音です！");
    } else if (analysis.accuracy > 60) {
      feedback.push("良い発音です。もう少し練習すると更に向上します。");
    } else {
      feedback.push(
        "発音練習を続けましょう。基本的な音から始めることをお勧めします。"
      );
    }

    return feedback;
  }

  private static calculatePronunciationScore(
    analysis: PronunciationAnalysis
  ): number {
    return Math.round(
      analysis.accuracy * 0.4 +
        analysis.clarity * 0.3 +
        analysis.fluency * 0.2 +
        analysis.rhythm * 0.1
    );
  }

  private static async playAudio(_text: string): Promise<void> {
    // 実際の実装では音声ファイルまたはTTSを使用
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  private static async getVoiceAnswer(_question: string): Promise<string> {
    // 実際の実装では音声認識で回答を取得
    return "sample answer";
  }

  private static compareAnswers(
    userAnswer: string,
    correctAnswer: string
  ): boolean {
    const similarity = this.calculateSimilarity(
      userAnswer.toLowerCase(),
      correctAnswer.toLowerCase()
    );
    return similarity > 0.7;
  }

  private static calculateListeningScore(_answers: any[]): number {
    // リスニングスコアの計算（簡略化）
    return 75;
  }

  private static generateListeningFeedback(
    _answers: any[],
    score: number
  ): string[] {
    return [`リスニング理解度: ${score}%`];
  }

  private static analyzePhonemes(
    _results: SpeechRecognitionResult[]
  ): PhonemeAnalysis[] {
    // 音素分析（簡略化）
    return [];
  }

  private static analyzeWords(
    _results: SpeechRecognitionResult[]
  ): WordAnalysis[] {
    // 単語分析（簡略化）
    return [];
  }

  private static analyzeSentences(
    _results: SpeechRecognitionResult[]
  ): SentenceAnalysis[] {
    // 文章分析（簡略化）
    return [];
  }

  private static generateImprovementSuggestions(
    _phonemes: PhonemeAnalysis[],
    _words: WordAnalysis[],
    _sentences: SentenceAnalysis[]
  ): string[] {
    return ["継続的な発音練習をお勧めします"];
  }

  private static generatePracticeRecommendations(
    _results: SpeechRecognitionResult[],
    _goals: string[]
  ): string[] {
    return ["毎日5分間の発音練習を継続してください"];
  }
}
