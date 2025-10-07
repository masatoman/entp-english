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
  async load(audioId: string): Promise<void> {
    const audioFile = AUDIO_FILES[audioId];
    if (!audioFile) {
      throw new Error(`Audio file not found: ${audioId}`);
    }
    await this.loadFile(audioFile);
  }

  async loadAudio(audioId: string): Promise<void> {
    return this.load(audioId);
  }

  async play(): Promise<void> {
    return this.start();
  }

  pause(): void {
    this.pauseAudio();
  }

  stop(): void {
    this.stopAudio();
  }

  cleanupAudioCache(): void {
    this.audio = null;
    this.currentFile = null;
    this.state = {
      isPlaying: false,
      isPaused: false,
      isLoaded: false,
      currentTime: 0,
      duration: 0,
      volume: 1.0,
      playbackRate: 1.0,
      loop: false,
    };
  }

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

  // 音声ファイルをロードする
  private async loadFile(audioFile: AudioFileInfo): Promise<void> {
    try {
      // 既存のオーディオを停止
      if (this.audio) {
        this.stopAudio();
      }

      // 新しいオーディオを作成
      this.audio = new Audio(audioFile.url);
      this.currentFile = audioFile;

      // イベントリスナーを設定
      this.setupEventListeners();

      // ロード完了を待つ
      await new Promise<void>((resolve, reject) => {
        if (!this.audio) return;

        const handleLoad = () => {
          this.state.isLoaded = true;
          this.state.duration = this.audio?.duration || 0;
          resolve();
        };

        const handleError = () => {
          reject(new Error(`Failed to load audio: ${audioFile.url}`));
        };

        this.audio.addEventListener("canplaythrough", handleLoad, {
          once: true,
        });
        this.audio.addEventListener("error", handleError, { once: true });
        this.audio.load();
      });
    } catch (error) {
      console.error("Audio load error:", error);
      throw error;
    }
  }

  // イベントリスナーを設定
  private setupEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener("play", () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
    });

    this.audio.addEventListener("pause", () => {
      this.state.isPaused = true;
      this.state.isPlaying = false;
    });

    this.audio.addEventListener("ended", () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.currentTime = 0;
    });

    this.audio.addEventListener("timeupdate", () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
      }
    });
  }

  // 音声を再生する
  async start(): Promise<void> {
    if (!this.audio || !this.state.isLoaded) {
      throw new Error("Audio not loaded");
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error("Audio play error:", error);
      throw error;
    }
  }

  // 音声を一時停止する
  pauseAudio(): void {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
    }
  }

  // 音声を停止する
  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.currentTime = 0;
    }
  }

  // 音量を設定する
  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.state.volume;
    }
  }

  // 再生速度を設定する
  setPlaybackRate(rate: number): void {
    this.state.playbackRate = Math.max(0.5, Math.min(2, rate));
    if (this.audio) {
      this.audio.playbackRate = this.state.playbackRate;
    }
  }

  // ループを設定する
  setLoop(loop: boolean): void {
    this.state.loop = loop;
    if (this.audio) {
      this.audio.loop = loop;
    }
  }

  // 現在の状態を取得する
  getState(): AudioPlayerState {
    return { ...this.state };
  }

  // 現在のファイル情報を取得する
  getCurrentFile(): AudioFileInfo | null {
    return this.currentFile;
  }
}

// 音声ファイルの定義
export const AUDIO_FILES: Record<string, AudioFileInfo> = {
  // 語彙学習用音声
  "vocab-basic-001": {
    id: "vocab-basic-001",
    url: "/audio/vocabulary/basic/001.mp3",
    title: "Basic Vocabulary 001",
    category: "vocabulary",
    difficulty: "easy",
  },
  "vocab-basic-002": {
    id: "vocab-basic-002",
    url: "/audio/vocabulary/basic/002.mp3",
    title: "Basic Vocabulary 002",
    category: "vocabulary",
    difficulty: "easy",
  },
  // 効果音
  correct: {
    id: "correct",
    url: "/audio/effects/correct.mp3",
    title: "Correct Answer",
    category: "effect",
  },
  incorrect: {
    id: "incorrect",
    url: "/audio/effects/incorrect.mp3",
    title: "Incorrect Answer",
    category: "effect",
  },
  "level-up": {
    id: "level-up",
    url: "/audio/effects/level-up.mp3",
    title: "Level Up",
    category: "effect",
  },
};

// シングルトンインスタンス
export const audioManager = new AudioManager();
