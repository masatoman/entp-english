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
  private _isInitialized = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

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
    return 'speechSynthesis' in window;
  }

  /**
   * 利用可能な音声を初期化
   */
  private initializeVoices(): void {
    if (!this.isSupported()) {
      console.warn('Speech Synthesis is not supported');
      return;
    }

    // 音声リストが読み込まれるまで待機
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.availableVoices = speechSynthesis.getVoices();
        this._isInitialized = true;
        console.log(`🎤 TTS音声初期化完了: ${this.availableVoices.length}種類の音声を検出`);
      };
    } else {
      // 既に読み込まれている場合
      this.availableVoices = speechSynthesis.getVoices();
      this._isInitialized = true;
    }
  }

  /**
   * 英語音声を取得（優先順位: 米国 > 英国 > その他英語圏）
   */
  private getEnglishVoice(): SpeechSynthesisVoice | undefined {
    const englishVoices = this.availableVoices.filter(voice => 
      voice.lang.startsWith('en')
    );

    // 優先順位で選択
    const preferredVoices = [
      'en-US', // 米国英語
      'en-GB', // 英国英語
      'en-AU', // オーストラリア英語
      'en-CA', // カナダ英語
    ];

    for (const lang of preferredVoices) {
      const voice = englishVoices.find(v => v.lang === lang);
      if (voice) return voice;
    }

    // 見つからない場合は最初の英語音声
    return englishVoices[0];
  }

  /**
   * 音声を生成・再生
   */
  public async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech Synthesis is not supported');
    }

    // 既存の音声を停止
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // デフォルト設定
    utterance.rate = options.rate ?? 0.8; // TOEIC速度に調整
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    
    // 英語音声を設定
    const englishVoice = this.getEnglishVoice();
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // イベントリスナーを設定
    utterance.onstart = () => {
      console.log(`🎤 TTS音声開始: "${text.substring(0, 50)}..."`);
    };

    utterance.onend = () => {
      console.log('🎤 TTS音声終了');
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('🎤 TTS音声エラー:', event.error);
      this.currentUtterance = null;
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
      console.log('🎤 TTS音声一時停止');
    }
  }

  /**
   * 音声を再開
   */
  public resume(): void {
    if (this.isSupported() && speechSynthesis.paused) {
      speechSynthesis.resume();
      console.log('🎤 TTS音声再開');
    }
  }

  /**
   * 音声を停止
   */
  public stop(): void {
    if (this.isSupported()) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
      console.log('🎤 TTS音声停止');
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
    return this.availableVoices.filter(voice => 
      voice.lang.startsWith('en')
    );
  }

  /**
   * 音声設定をカスタマイズ
   */
  public setDefaultOptions(options: TTSOptions): void {
    // 将来的にユーザー設定として保存可能
    console.log('🎤 TTS設定更新:', options);
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
