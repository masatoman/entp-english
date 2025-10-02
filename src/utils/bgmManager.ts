/**
 * BGM管理システム
 * 全ページでBGMを再生・制御するためのマネージャー
 */

export interface BGMSettings {
  enabled: boolean;
  volume: number; // 0.0 - 1.0
  loop: boolean;
}

class BGMManager {
  private audio: HTMLAudioElement | null = null;
  private settings: BGMSettings = {
    enabled: false, // デフォルトミュート
    volume: 0.3, // デフォルト30%
    loop: true,
  };
  private isInitialized = false;

  constructor() {
    this.loadSettings();
  }

  /**
   * BGMを初期化
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // BGMファイルのパス
      const bgmPath = "/BGM2.mp3";

      this.audio = new Audio(bgmPath);
      this.audio.loop = this.settings.loop;
      this.audio.volume = this.settings.volume;
      this.audio.preload = "auto";

      // エラーハンドリング
      this.audio.addEventListener("error", (e) => {
        console.warn("BGM読み込みエラー:", e);
      });

      // 再生準備完了
      this.audio.addEventListener("canplaythrough", () => {
        console.log("🎵 BGM準備完了");
      });

      this.isInitialized = true;
    } catch (error) {
      console.warn("BGM初期化エラー:", error);
    }
  }

  /**
   * BGMを再生
   */
  async play(): Promise<void> {
    if (!this.settings.enabled || !this.audio) return;

    try {
      await this.audio.play();
      console.log("🎵 BGM再生開始");
    } catch (error) {
      console.warn("BGM再生エラー:", error);
    }
  }

  /**
   * BGMを一時停止
   */
  pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      console.log("🎵 BGM一時停止");
    }
  }

  /**
   * BGMを停止
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      console.log("🎵 BGM停止");
    }
  }

  /**
   * 音量を設定
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.settings.volume = clampedVolume;

    if (this.audio) {
      this.audio.volume = clampedVolume;
    }

    this.saveSettings();
    console.log(`🎵 音量設定: ${Math.round(clampedVolume * 100)}%`);
  }

  /**
   * BGM有効/無効を切り替え
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;

    if (enabled) {
      this.play();
    } else {
      this.pause();
    }

    this.saveSettings();
    console.log(`🎵 BGM ${enabled ? "有効" : "無効"}`);
  }

  /**
   * ループ設定を変更
   */
  setLoop(loop: boolean): void {
    this.settings.loop = loop;

    if (this.audio) {
      this.audio.loop = loop;
    }

    this.saveSettings();
  }

  /**
   * 現在の設定を取得
   */
  getSettings(): BGMSettings {
    return { ...this.settings };
  }

  /**
   * 現在の音量を取得
   */
  getVolume(): number {
    return this.settings.volume;
  }

  /**
   * BGMが有効かどうか
   */
  isEnabled(): boolean {
    return this.settings.enabled;
  }

  /**
   * BGMが再生中かどうか
   */
  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  /**
   * 設定をローカルストレージに保存
   */
  private saveSettings(): void {
    try {
      localStorage.setItem("bgmSettings", JSON.stringify(this.settings));
    } catch (error) {
      console.warn("BGM設定保存エラー:", error);
    }
  }

  /**
   * 設定をローカルストレージから読み込み
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem("bgmSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (error) {
      console.warn("BGM設定読み込みエラー:", error);
    }
  }

  /**
   * ページが非表示になった時の処理
   */
  handleVisibilityChange(): void {
    if (document.hidden) {
      // ページが非表示になったら一時停止
      this.pause();
    } else if (this.settings.enabled) {
      // ページが表示されたら再開
      this.play();
    }
  }

  /**
   * リソースをクリーンアップ
   */
  destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.isInitialized = false;
  }
}

// シングルトンインスタンス
export const bgmManager = new BGMManager();

// ページの可視性変更を監視
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    bgmManager.handleVisibilityChange();
  });
}
