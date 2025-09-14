// 効果音管理ユーティリティ
export class SoundManager {
  private static audioContext: AudioContext | null = null;
  private static isEnabled = true;

  // AudioContextの初期化
  private static initAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // 効果音の有効/無効を切り替え
  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('sound-enabled', enabled.toString());
  }

  // 効果音の有効状態を取得
  static getEnabled(): boolean {
    const saved = localStorage.getItem('sound-enabled');
    return saved ? saved === 'true' : true;
  }

  // 効果音を再生
  static playSound(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.isEnabled) return;

    try {
      const audioContext = this.initAudioContext();
      
      // ユーザーインタラクションが必要な場合、AudioContextを再開
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      // 音量のエンベロープ（フェードイン・フェードアウト）
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('効果音の再生に失敗しました:', error);
    }
  }

  // 定義済みの効果音
  static sounds = {
    // 単語をはめた時の音（カチッ）
    drop: () => this.playSound(800, 0.1, 'square'),
    
    // 正解音
    correct: () => this.playSound(523, 0.2, 'sine'), // C5
    
    // 不正解音
    incorrect: () => this.playSound(200, 0.3, 'sawtooth'),
    
    // ボタンクリック音
    click: () => this.playSound(600, 0.05, 'square'),
    
    // 完了音
    complete: () => {
      this.playSound(523, 0.2, 'sine'); // C5
      setTimeout(() => this.playSound(659, 0.2, 'sine'), 100); // E5
      setTimeout(() => this.playSound(784, 0.3, 'sine'), 200); // G5
    },
    
    // レベルアップ音
    levelUp: () => {
      this.playSound(523, 0.15, 'sine'); // C5
      setTimeout(() => this.playSound(659, 0.15, 'sine'), 80); // E5
      setTimeout(() => this.playSound(784, 0.15, 'sine'), 160); // G5
      setTimeout(() => this.playSound(1047, 0.4, 'sine'), 240); // C6
    },
    
    // 実績解除音
    achievement: () => {
      this.playSound(392, 0.2, 'sine'); // G4
      setTimeout(() => this.playSound(523, 0.2, 'sine'), 100); // C5
      setTimeout(() => this.playSound(659, 0.2, 'sine'), 200); // E5
      setTimeout(() => this.playSound(784, 0.4, 'sine'), 300); // G5
    },
    
    // 警告音
    warning: () => this.playSound(300, 0.5, 'sawtooth'),
    
    // 通知音
    notification: () => this.playSound(440, 0.3, 'sine'), // A4
  };

  // 初期化時に設定を読み込み
  static init(): void {
    this.isEnabled = this.getEnabled();
  }
}

// 初期化
SoundManager.init();
