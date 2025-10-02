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
   * 英語音声を取得（高品質な音声を優先選択）
   */
  private getEnglishVoice(): SpeechSynthesisVoice | undefined {
    const englishVoices = this.availableVoices.filter(voice => 
      voice.lang.startsWith('en')
    );

    // 高品質な音声の優先順位（実際の音声名で判定）
    const highQualityVoices = [
      // macOSの高品質音声
      'Alex', 'Samantha', 'Victoria', 'Daniel', 'Moira',
      // Windowsの高品質音声
      'Microsoft David Desktop', 'Microsoft Zira Desktop', 'Microsoft Hazel Desktop',
      // その他の高品質音声
      'Google US English', 'Amazon Polly', 'Azure Neural Voice'
    ];

    // 高品質音声を優先的に探す
    for (const voiceName of highQualityVoices) {
      const voice = englishVoices.find(v => 
        v.name.includes(voiceName) || v.name.toLowerCase().includes(voiceName.toLowerCase())
      );
      if (voice) {
        console.log(`🎤 高品質音声を選択: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // 地域別の優先順位で選択
    const preferredLangs = [
      'en-US', // 米国英語
      'en-GB', // 英国英語
      'en-AU', // オーストラリア英語
      'en-CA', // カナダ英語
    ];

    for (const lang of preferredLangs) {
      const voice = englishVoices.find(v => v.lang === lang);
      if (voice) {
        console.log(`🎤 地域別音声を選択: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }

    // 見つからない場合は最初の英語音声
    const fallbackVoice = englishVoices[0];
    if (fallbackVoice) {
      console.log(`🎤 フォールバック音声を選択: ${fallbackVoice.name} (${fallbackVoice.lang})`);
    }
    return fallbackVoice;
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
    
    // デフォルト設定（聞き取りやすさ重視）
    utterance.rate = options.rate ?? 0.7; // よりゆっくりに調整（TOEIC標準）
    utterance.pitch = options.pitch ?? 0.9; // 少し低めのピッチで聞きやすく
    utterance.volume = options.volume ?? 0.9; // 少し控えめな音量
    
    // 英語音声を設定
    const englishVoice = this.getEnglishVoice();
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // イベントリスナーを設定
    utterance.onstart = () => {
      console.log(`🎤 TTS音声開始: "${text.substring(0, 50)}..."`);
      console.log(`🎤 使用音声: ${utterance.voice?.name || 'デフォルト'} (${utterance.voice?.lang || '不明'})`);
      console.log(`🎤 音声設定: rate=${utterance.rate}, pitch=${utterance.pitch}, volume=${utterance.volume}`);
    };

    utterance.onend = () => {
      console.log('🎤 TTS音声終了');
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('🎤 TTS音声エラー:', event.error);
      this.currentUtterance = null;
    };

    utterance.onboundary = (event) => {
      // 単語境界でのイベント（デバッグ用）
      if (event.name === 'word') {
        console.log(`🎤 単語境界: "${text.substring(event.charIndex, event.charIndex + 20)}..."`);
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

  /**
   * 利用可能な音声一覧を取得（デバッグ用）
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  /**
   * 音声品質をテスト
   */
  public async testVoiceQuality(): Promise<void> {
    const testText = "Hello, this is a test of the text-to-speech quality. How does it sound?";
    console.log('🎤 音声品質テスト開始...');
    
    // 複数の音声でテスト
    const testVoices = this.getAvailableEnglishVoices().slice(0, 3);
    
    for (let i = 0; i < testVoices.length; i++) {
      const voice = testVoices[i];
      console.log(`🎤 テスト音声 ${i + 1}: ${voice.name} (${voice.lang})`);
      
      await this.speak(testText, {
        rate: 0.7,
        pitch: 0.9,
        volume: 0.9,
        voice: voice,
      });
      
      // 音声が終了するまで待機
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('🎤 音声品質テスト完了');
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
