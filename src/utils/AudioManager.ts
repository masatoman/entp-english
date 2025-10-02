/**
 * 音声ファイル管理システム
 * 音声の再生、一時停止、リピート機能
 */

import { AudioFile, dbManager } from "./IndexedDBManager";

// 音声プレイヤーの状態
export interface AudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoaded: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  loop: boolean;
}

// 音声ファイル情報
export interface AudioFileInfo {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: "vocabulary" | "grammar" | "listening" | "effect";
  part?: "Part1" | "Part2" | "Part3" | "Part4";
  difficulty?: "easy" | "medium" | "hard";
  duration?: number;
  size?: number;
}

// 音声プレイヤークラス
export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentFile: AudioFileInfo | null = null;
  private state: AudioPlayerState = {
    isPlaying: false,
    isPaused: false,
    isLoaded: false,
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playbackRate: 1.0,
    loop: false,
  };

  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.setupAudioElement();
  }

  /**
   * 音声要素のセットアップ
   */
  private setupAudioElement(): void {
    this.audio = new Audio();
    this.audio.preload = "metadata";

    // イベントリスナーの設定
    this.audio.addEventListener("loadstart", () => this.emit("loadstart"));
    this.audio.addEventListener("loadedmetadata", () => {
      this.state.duration = this.audio?.duration || 0;
      this.state.isLoaded = true;
      this.emit("loadedmetadata", { duration: this.state.duration });
    });
    this.audio.addEventListener("canplay", () => this.emit("canplay"));
    this.audio.addEventListener("play", () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.emit("play");
    });
    this.audio.addEventListener("pause", () => {
      this.state.isPlaying = false;
      this.state.isPaused = true;
      this.emit("pause");
    });
    this.audio.addEventListener("ended", () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      if (this.state.loop && this.audio) {
        this.audio.currentTime = 0;
        this.play();
      } else {
        this.emit("ended");
      }
    });
    this.audio.addEventListener("timeupdate", () => {
      this.state.currentTime = this.audio?.currentTime || 0;
      this.emit("timeupdate", { currentTime: this.state.currentTime });
    });
    this.audio.addEventListener("error", (event) => {
      console.error("Audio error:", event);
      this.emit("error", event);
    });
    this.audio.addEventListener("volumechange", () => {
      this.state.volume = this.audio?.volume || 1.0;
      this.emit("volumechange", { volume: this.state.volume });
    });
    this.audio.addEventListener("ratechange", () => {
      this.state.playbackRate = this.audio?.playbackRate || 1.0;
      this.emit("ratechange", { playbackRate: this.state.playbackRate });
    });
  }

  /**
   * 音声ファイルの読み込み
   */
  async loadAudio(fileInfo: AudioFileInfo): Promise<void> {
    try {
      this.currentFile = fileInfo;

      // IndexedDBから音声ファイルを取得
      let audioFile = await dbManager.getAudioFile(fileInfo.id);

      if (!audioFile) {
        // キャッシュにない場合はダウンロード
        console.log(`🎵 Downloading audio file: ${fileInfo.url}`);
        const response = await fetch(fileInfo.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }

        const blob = await response.blob();
        await dbManager.saveAudioFile(fileInfo.id, fileInfo.url, blob);
        audioFile = await dbManager.getAudioFile(fileInfo.id);
      }

      if (!audioFile || !this.audio) {
        throw new Error("Failed to load audio file");
      }

      // Blob URLを作成
      const audioUrl = URL.createObjectURL(audioFile.blob);
      this.audio.src = audioUrl;

      // メタデータの更新
      if (audioFile.duration) {
        this.state.duration = audioFile.duration;
      }

      this.emit("load", { fileInfo, audioFile });
    } catch (error) {
      console.error("Failed to load audio:", error);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * 音声の再生
   */
  async play(): Promise<void> {
    if (!this.audio) {
      throw new Error("Audio not initialized");
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
      this.emit("error", error);
      throw error;
    }
  }

  /**
   * 音声の一時停止
   */
  pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  /**
   * 音声の停止
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * 再生位置の設定
   */
  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.state.duration));
    }
  }

  /**
   * 音量の設定
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * 再生速度の設定
   */
  setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = Math.max(0.25, Math.min(4, rate));
    }
  }

  /**
   * ループの設定
   */
  setLoop(loop: boolean): void {
    this.state.loop = loop;
    if (this.audio) {
      this.audio.loop = loop;
    }
  }

  /**
   * リピート再生（指定回数）
   */
  async repeat(times: number = 1): Promise<void> {
    if (times <= 0) return;

    const originalLoop = this.state.loop;
    this.setLoop(false);

    for (let i = 0; i < times; i++) {
      this.stop();
      await this.play();

      // 再生完了を待つ
      await new Promise<void>((resolve, reject) => {
        const onEnded = () => {
          this.audio?.removeEventListener("ended", onEnded);
          resolve();
        };
        const onError = (error: Event) => {
          this.audio?.removeEventListener("error", onError);
          reject(error);
        };

        this.audio?.addEventListener("ended", onEnded);
        this.audio?.addEventListener("error", onError);
      });
    }

    this.setLoop(originalLoop);
  }

  /**
   * 音声ファイルのプリロード
   */
  async preloadAudio(fileInfo: AudioFileInfo): Promise<void> {
    try {
      // 既にキャッシュされているかチェック
      const cachedFile = await dbManager.getAudioFile(fileInfo.id);
      if (cachedFile) {
        console.log(`🎵 Audio file already cached: ${fileInfo.id}`);
        return;
      }

      console.log(`🎵 Preloading audio file: ${fileInfo.url}`);
      const response = await fetch(fileInfo.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      const blob = await response.blob();
      await dbManager.saveAudioFile(fileInfo.id, fileInfo.url, blob);

      console.log(`✅ Audio file preloaded: ${fileInfo.id}`);
    } catch (error) {
      console.error("Failed to preload audio:", error);
      throw error;
    }
  }

  /**
   * 複数音声ファイルのプリロード
   */
  async preloadMultipleAudio(fileInfos: AudioFileInfo[]): Promise<void> {
    const promises = fileInfos.map((fileInfo) =>
      this.preloadAudio(fileInfo).catch((error) => {
        console.warn(`Failed to preload ${fileInfo.id}:`, error);
      })
    );

    await Promise.all(promises);
  }

  /**
   * キャッシュされた音声ファイルのクリーンアップ
   */
  async cleanupAudioCache(maxAgeHours: number = 24): Promise<void> {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);

    try {
      const audioFiles = await dbManager.getByRange<AudioFile>(
        "audioFiles",
        "lastAccessed",
        IDBKeyRange.upperBound(cutoffTime)
      );

      for (const audioFile of audioFiles) {
        await dbManager.delete("audioFiles", audioFile.id);
        console.log(`🗑️ Cleaned up audio cache: ${audioFile.id}`);
      }
    } catch (error) {
      console.error("Failed to cleanup audio cache:", error);
    }
  }

  /**
   * 現在の状態を取得
   */
  getState(): AudioPlayerState {
    return { ...this.state };
  }

  /**
   * 現在のファイル情報を取得
   */
  getCurrentFile(): AudioFileInfo | null {
    return this.currentFile;
  }

  /**
   * イベントリスナーの追加
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * イベントリスナーの削除
   */
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * イベントの発生
   */
  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * リソースのクリーンアップ
   */
  dispose(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }

    this.listeners.clear();
    this.currentFile = null;
  }
}

// シングルトンインスタンス
export const audioManager = new AudioManager();

// 音声ファイル情報の定義
export const AUDIO_FILES: Record<string, AudioFileInfo> = {
  // 語彙音声
  "vocabulary-word-1": {
    id: "vocabulary-word-1",
    url: "/audio/vocabulary/word-1.mp3",
    title: "Word Pronunciation",
    category: "vocabulary",
    difficulty: "easy",
  },

  // 文法音声
  "grammar-example-1": {
    id: "grammar-example-1",
    url: "/audio/grammar/example-1.mp3",
    title: "Grammar Example",
    category: "grammar",
    difficulty: "medium",
  },

  // リスニング音声
  "listening-part1-1": {
    id: "listening-part1-1",
    url: "/audio/listening/part1-1.mp3",
    title: "Part 1 Question 1",
    category: "listening",
    part: "Part1",
    difficulty: "easy",
  },

  // 効果音
  "effect-correct": {
    id: "effect-correct",
    url: "/audio/effects/correct.mp3",
    title: "Correct Answer",
    category: "effect",
  },

  "effect-incorrect": {
    id: "effect-incorrect",
    url: "/audio/effects/incorrect.mp3",
    title: "Incorrect Answer",
    category: "effect",
  },

  "effect-levelup": {
    id: "effect-levelup",
    url: "/audio/effects/levelup.mp3",
    title: "Level Up",
    category: "effect",
  },
};
