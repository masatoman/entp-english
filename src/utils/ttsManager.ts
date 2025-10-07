// Text-to-Speech Manager for Listening Questions
// Web Speech API を使用した音声生成システム

export interface TTSOptions {
  rate?: number; // 話す速度 (0.1 - 10)
  pitch?: number; // 音の高さ (0 - 2)
  volume?: number; // 音量 (0 - 1)
  voice?: SpeechSynthesisVoice; // 音声の種類
}

export interface TTSStatus {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentUtterance: SpeechSynthesisUtterance | null;
  availableVoices: SpeechSynthesisVoice[];
}

class TTSManager {
  private static instance: TTSManager;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private _isInitialized: boolean = false;

  private constructor() {
    this.initializeVoices();
  }

  public static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager();
    }
    return TTSManager.instance;
  }

  /**
   * TTSがサポートされているかチェック
   */
  public isSupported(): boolean {
    return "speechSynthesis" in window;
  }

  /**
   * 利用可能な音声を初期化
   */
  private initializeVoices(): void {
    if (!this.isSupported()) {
      console.warn("Speech Synthesis is not supported");
      return;
    }

    // 音声リストが読み込まれるまで待機
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.availableVoices = speechSynthesis.getVoices();
        this._isInitialized = true;
        console.log(
          `🎤 TTS音声初期化完了: ${this.availableVoices.length}種類の音声を検出`
        );
      };
    } else {
      // 既に読み込まれている場合
      this.availableVoices = speechSynthesis.getVoices();
      this._isInitialized = true;
    }
  }

  /**
   * 英語音声を取得（ネイティブ英語発音を優先選択）
   */
  private getEnglishVoice(): SpeechSynthesisVoice | undefined {
    // 日本語音声を除外し、ネイティブ英語音声のみを対象とする
    const englishVoices = this.availableVoices.filter((voice) => {
      // 日本語音声を除外
      if (voice.lang.includes("ja") || voice.lang.includes("JP")) {
        return false;
      }
      // 英語音声のみを対象
      return voice.lang.startsWith("en");
    });

    console.log(`🎤 利用可能な英語音声: ${englishVoices.length}種類`);
    englishVoices.forEach((voice) => {
      console.log(`  - ${voice.name} (${voice.lang})`);
    });

    // ネイティブ英語音声の優先順位（発音品質重視）
    const nativeEnglishVoices = [
      // macOSのネイティブ英語音声（高品質）
      "Alex", // 米国男性（高品質）
      "Samantha", // 米国女性（高品質）
      "Victoria", // 英国女性（高品質）
      "Daniel", // 英国男性（高品質）
      "Moira", // アイルランド女性（高品質）
      "Karen", // オーストラリア女性
      "Lee", // オーストラリア男性
      // Windowsのネイティブ英語音声
      "Microsoft David Desktop", // 米国男性
      "Microsoft Zira Desktop", // 米国女性
      "Microsoft Hazel Desktop", // 英国女性
      "Microsoft Susan Desktop", // 英国女性
      // その他の高品質音声
      "Google US English",
      "Amazon Polly",
      "Azure Neural Voice",
    ];

    // ネイティブ英語音声を優先的に探す
    for (const voiceName of nativeEnglishVoices) {
      const voice = englishVoices.find(
        (v) =>
          v.name.includes(voiceName) ||
          v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log(
          `🎤 ネイティブ英語音声を選択: ${voice.name} (${voice.lang})`
        );
        return voice;
      }
    }

    // 地域別の優先順位で選択（ネイティブ発音重視）
    const preferredLangs = [
      "en-US", // 米国英語（最優先）
      "en-GB", // 英国英語
      "en-AU", // オーストラリア英語
      "en-CA", // カナダ英語
      "en-IE", // アイルランド英語
      "en-NZ", // ニュージーランド英語
    ];

    for (const lang of preferredLangs) {
      const voice = englishVoices.find((v) => v.lang === lang);
      if (voice) {
        console.log(`🎤 地域別英語音声を選択: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // 最後の手段：英語音声の中で最も品質が高そうなものを選択
    const fallbackVoice =
      englishVoices.find(
        (voice) =>
          voice.name.toLowerCase().includes("english") ||
          voice.name.toLowerCase().includes("us") ||
          voice.name.toLowerCase().includes("uk")
      ) || englishVoices[0];

    if (fallbackVoice) {
      console.log(
        `🎤 フォールバック英語音声を選択: ${fallbackVoice.name} (${fallbackVoice.lang})`
      );
    }
    return fallbackVoice;
  }

  /**
   * 音声を生成・再生
   */
  public async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error("Speech Synthesis is not supported");
    }

    // 既存の音声を停止
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // デフォルト設定（ネイティブ英語発音重視）
    utterance.rate = options.rate ?? 0.75; // TOEIC標準速度（ネイティブ発音を保つ）
    utterance.pitch = options.pitch ?? 1.0; // 自然なピッチでネイティブらしさを維持
    utterance.volume = options.volume ?? 0.9; // 適度な音量

    // 英語音声を設定（ネイティブ発音を強制）
    const englishVoice = this.getEnglishVoice();
    if (englishVoice) {
      utterance.voice = englishVoice;
      utterance.lang = englishVoice.lang;
      console.log(
        `🎤 音声言語設定: ${englishVoice.lang} (${englishVoice.name})`
      );
    } else {
      // フォールバック：米国英語を強制設定
      utterance.lang = "en-US";
      console.log(`🎤 フォールバック音声言語: en-US`);
    }

    // 日本語発音を防ぐための追加設定
    utterance.lang = utterance.lang || "en-US"; // 確実に英語を設定

    // イベントリスナーを設定
    utterance.onstart = () => {
      console.log(`🎤 TTS音声開始: "${text.substring(0, 50)}..."`);
      console.log(
        `🎤 使用音声: ${utterance.voice?.name || "デフォルト"} (${
          utterance.voice?.lang || "不明"
        })`
      );
      console.log(
        `🎤 音声設定: rate=${utterance.rate}, pitch=${utterance.pitch}, volume=${utterance.volume}`
      );
    };

    utterance.onend = () => {
      console.log("🎤 TTS音声終了");
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error("🎤 TTS音声エラー:", event.error);
      this.currentUtterance = null;
    };

    utterance.onboundary = (event) => {
      // 単語境界でのイベント（デバッグ用）
      if (event.name === "word") {
        console.log(
          `🎤 単語境界: "${text.substring(
            event.charIndex,
            event.charIndex + 20
          )}..."`
        );
      }
    };

    this.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  }

  /**
   * 音声を一時停止
   */
  public pause(): void {
    if (this.isSupported() && speechSynthesis.speaking) {
      speechSynthesis.pause();
      console.log("🎤 TTS音声一時停止");
    }
  }

  /**
   * 音声を再開
   */
  public resume(): void {
    if (this.isSupported() && speechSynthesis.paused) {
      speechSynthesis.resume();
      console.log("🎤 TTS音声再開");
    }
  }

  /**
   * 音声を停止
   */
  public stop(): void {
    if (this.isSupported()) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
      console.log("🎤 TTS音声停止");
    }
  }

  /**
   * 現在の状態を取得
   */
  public getStatus(): TTSStatus {
    return {
      isSupported: this.isSupported(),
      isPlaying: speechSynthesis.speaking,
      isPaused: speechSynthesis.paused,
      currentUtterance: this.currentUtterance,
      availableVoices: this.availableVoices,
    };
  }

  /**
   * 利用可能な英語音声一覧を取得
   */
  public getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices.filter((voice) => voice.lang.startsWith("en"));
  }

  /**
   * 音声設定をカスタマイズ
   */
  public setDefaultOptions(options: TTSOptions): void {
    // 将来的にユーザー設定として保存可能
    console.log("🎤 TTS設定更新:", options);
  }

  /**
   * 利用可能な音声一覧を取得（デバッグ用）
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  /**
   * 音声品質をテスト（ネイティブ発音重視）
   */
  public async testVoiceQuality(): Promise<void> {
    const testText =
      "Hello, this is a test of native English pronunciation. How does it sound?";
    console.log("🎤 ネイティブ英語発音テスト開始...");

    // ネイティブ英語音声のみでテスト
    const nativeVoices = this.availableVoices
      .filter((voice) => {
        if (voice.lang.includes("ja") || voice.lang.includes("JP"))
          return false;
        return (
          voice.lang.startsWith("en") &&
          (voice.name.includes("Alex") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Victoria") ||
            voice.name.includes("Daniel") ||
            voice.name.includes("Microsoft David") ||
            voice.name.includes("Microsoft Zira"))
        );
      })
      .slice(0, 3);

    if (nativeVoices.length === 0) {
      console.log(
        "🎤 ネイティブ英語音声が見つかりません。利用可能な音声でテストします。"
      );
      const testVoices = this.getAvailableEnglishVoices().slice(0, 2);
      for (let i = 0; i < testVoices.length; i++) {
        const voice = testVoices[i];
        console.log(`🎤 テスト音声 ${i + 1}: ${voice.name} (${voice.lang})`);

        await this.speak(testText, {
          rate: 0.75,
          pitch: 1.0,
          volume: 0.9,
          voice: voice,
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    } else {
      for (let i = 0; i < nativeVoices.length; i++) {
        const voice = nativeVoices[i];
        console.log(
          `🎤 ネイティブ英語音声テスト ${i + 1}: ${voice.name} (${voice.lang})`
        );

        await this.speak(testText, {
          rate: 0.75,
          pitch: 1.0,
          volume: 0.9,
          voice: voice,
        });

        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    }

    console.log("🎤 ネイティブ英語発音テスト完了");
  }
}

// シングルトンインスタンスをエクスポート
export const ttsManager = TTSManager.getInstance();

// 便利な関数をエクスポート
export const speakText = (text: string, options?: TTSOptions) =>
  ttsManager.speak(text, options);

export const stopSpeaking = () => ttsManager.stop();

export const pauseSpeaking = () => ttsManager.pause();

export const resumeSpeaking = () => ttsManager.resume();
