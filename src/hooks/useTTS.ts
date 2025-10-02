// React Hook for Text-to-Speech functionality
import { useState, useEffect, useCallback } from 'react';
import { ttsManager, TTSOptions, TTSStatus } from '../utils/ttsManager';

export interface UseTTSReturn {
  // 状態
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  availableVoices: SpeechSynthesisVoice[];
  
  // 操作関数
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  
  // ユーティリティ
  getStatus: () => TTSStatus;
  testVoiceQuality: () => Promise<void>;
}

/**
 * TTS機能を使用するためのReact Hook
 */
export const useTTS = (): UseTTSReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 初期化
  useEffect(() => {
    const initialize = () => {
      const supported = ttsManager.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        // 音声リストを取得
        const voices = ttsManager.getAvailableEnglishVoices();
        setAvailableVoices(voices);
        
        console.log(`🎤 TTS Hook初期化完了: ${voices.length}種類の英語音声を検出`);
      }
    };

    // 即座に実行
    initialize();
    
    // 音声リストが遅延読み込みされる場合があるため、少し待って再実行
    const timer = setTimeout(initialize, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 状態更新用のポーリング
  useEffect(() => {
    if (!isSupported) return;

    const updateStatus = () => {
      const status = ttsManager.getStatus();
      setIsPlaying(status.isPlaying);
      setIsPaused(status.isPaused);
    };

    // 100msごとに状態をチェック
    const interval = setInterval(updateStatus, 100);
    
    return () => clearInterval(interval);
  }, [isSupported]);

  // 音声再生
  const speak = useCallback(async (text: string, options?: TTSOptions) => {
    try {
      await ttsManager.speak(text, options);
    } catch (error) {
      console.error('TTS音声再生エラー:', error);
    }
  }, []);

  // 音声停止
  const stop = useCallback(() => {
    ttsManager.stop();
  }, []);

  // 音声一時停止
  const pause = useCallback(() => {
    ttsManager.pause();
  }, []);

  // 音声再開
  const resume = useCallback(() => {
    ttsManager.resume();
  }, []);

  // 状態取得
  const getStatus = useCallback(() => {
    return ttsManager.getStatus();
  }, []);

  // 音声品質テスト
  const testVoiceQuality = useCallback(async () => {
    try {
      await ttsManager.testVoiceQuality();
    } catch (error) {
      console.error('音声品質テストエラー:', error);
    }
  }, []);

  return {
    // 状態
    isSupported,
    isPlaying,
    isPaused,
    availableVoices,
    
    // 操作関数
    speak,
    stop,
    pause,
    resume,
    
    // ユーティリティ
    getStatus,
    testVoiceQuality,
  };
};
