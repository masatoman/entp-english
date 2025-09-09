// Web Speech APIを使用した音声合成機能

export interface SpeechOptions {
  rate?: number;    // 読み上げ速度 (0.1 - 10)
  pitch?: number;   // 音の高さ (0 - 2)
  volume?: number;  // 音量 (0 - 1)
  lang?: string;    // 言語コード
}

// デフォルトの音声設定
const DEFAULT_OPTIONS: SpeechOptions = {
  rate: 0.8,
  pitch: 1.0,
  volume: 1.0,
  lang: 'en-US'
};

/**
 * テキストを音声で読み上げる
 * @param text 読み上げるテキスト
 * @param options 音声オプション
 */
export function speakText(text: string, options: SpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // ブラウザがSpeech Synthesis APIをサポートしているかチェック
    if (!('speechSynthesis' in window)) {
      reject(new Error('このブラウザは音声合成をサポートしていません'));
      return;
    }

    // 既存の音声を停止
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    // 音声設定を適用
    utterance.rate = finalOptions.rate!;
    utterance.pitch = finalOptions.pitch!;
    utterance.volume = finalOptions.volume!;
    utterance.lang = finalOptions.lang!;

    // イベントハンドラー
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`音声合成エラー: ${event.error}`));

    // 音声を開始
    speechSynthesis.speak(utterance);
  });
}

/**
 * 英語の単語を発音する
 * @param word 発音する単語
 */
export function speakEnglishWord(word: string): Promise<void> {
  return speakText(word, {
    lang: 'en-US',
    rate: 0.7,  // 少しゆっくりめ
    pitch: 1.0,
    volume: 1.0
  });
}

/**
 * 日本語のテキストを読み上げる
 * @param text 読み上げるテキスト
 */
export function speakJapaneseText(text: string): Promise<void> {
  return speakText(text, {
    lang: 'ja-JP',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  });
}

/**
 * 音声合成を停止する
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

/**
 * 音声合成がサポートされているかチェック
 */
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * 利用可能な音声の一覧を取得
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return speechSynthesis.getVoices();
}

/**
 * 英語の音声を取得（優先度順）
 */
export function getEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  // 英語の音声を優先度順で検索
  const englishVoices = voices.filter(voice => 
    voice.lang.startsWith('en')
  );

  // 優先度: US > GB > その他の英語
  const usVoice = englishVoices.find(voice => voice.lang === 'en-US');
  if (usVoice) return usVoice;

  const gbVoice = englishVoices.find(voice => voice.lang === 'en-GB');
  if (gbVoice) return gbVoice;

  return englishVoices[0] || null;
}
