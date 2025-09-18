/**
 * 音声合成ユーティリティ
 * Web Speech APIを使用した英語発音機能
 */

export interface SpeechOptions {
  rate?: number; // 話速 (0.1-10)
  pitch?: number; // 音程 (0-2)
  volume?: number; // 音量 (0-1)
  voice?: string; // 音声名
}

export class SpeechSynthesisManager {
  private static defaultOptions: Required<SpeechOptions> = {
    rate: 0.8, // 少し遅めで聞き取りやすく
    pitch: 1.0,
    volume: 0.8,
    voice: "en-US", // 英語音声
  };

  /**
   * 利用可能な英語音声を取得
   */
  static getEnglishVoices(): SpeechSynthesisVoice[] {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported");
      return [];
    }

    const voices = window.speechSynthesis.getVoices();
    return voices.filter(
      (voice) => voice.lang.startsWith("en") && voice.localService
    );
  }

  /**
   * 最適な英語音声を選択
   */
  static getBestEnglishVoice(): SpeechSynthesisVoice | null {
    const englishVoices = this.getEnglishVoices();

    // 優先順位: en-US > en-GB > その他の英語
    const preferredVoices = ["en-US", "en-GB", "en-AU", "en-CA"];

    for (const preferredLang of preferredVoices) {
      const voice = englishVoices.find((v) => v.lang === preferredLang);
      if (voice) return voice;
    }

    // 見つからない場合は最初の英語音声
    return englishVoices[0] || null;
  }

  /**
   * 英語テキストを読み上げ
   */
  static speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("Speech Synthesis not supported"));
        return;
      }

      // 既存の音声を停止
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const finalOptions = { ...this.defaultOptions, ...options };

      // 音声設定
      utterance.rate = finalOptions.rate;
      utterance.pitch = finalOptions.pitch;
      utterance.volume = finalOptions.volume;

      // 最適な英語音声を設定
      const bestVoice = this.getBestEnglishVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = "en-US";
      }

      // イベントハンドラ
      utterance.onend = () => resolve();
      utterance.onerror = (event) =>
        reject(new Error(`Speech error: ${event.error}`));

      // 読み上げ開始
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * 単語と例文を順番に読み上げ
   */
  static async speakWordWithExample(
    word: string,
    example?: string,
    options: SpeechOptions = {}
  ): Promise<void> {
    try {
      // 単語を読み上げ
      await this.speak(word, { ...options, rate: 0.6 }); // 単語は少し遅く

      // 短い間隔
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 例文があれば読み上げ
      if (example) {
        await this.speak(example, { ...options, rate: 0.8 }); // 例文は通常速度
      }
    } catch (error) {
      console.error("Speech synthesis error:", error);
      throw error;
    }
  }

  /**
   * 音声合成が利用可能かチェック
   */
  static isSupported(): boolean {
    return "speechSynthesis" in window;
  }

  /**
   * 現在再生中の音声を停止
   */
  static stop(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
