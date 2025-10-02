// TTS音声品質設定コンポーネント
import React, { useState, useEffect } from 'react';
import { useTTS } from '../hooks/useTTS';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Volume2, Gauge, Mic } from 'lucide-react';

interface TTSQualitySettingsProps {
  onClose?: () => void;
}

export const TTSQualitySettings: React.FC<TTSQualitySettingsProps> = ({ onClose }) => {
  const { isSupported, availableVoices, testVoiceQuality } = useTTS();
  const [rate, setRate] = useState(0.7);
  const [pitch, setPitch] = useState(0.9);
  const [volume, setVolume] = useState(0.9);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // 高品質音声を優先表示
  const highQualityVoices = availableVoices.filter(voice => 
    ['Alex', 'Samantha', 'Victoria', 'Daniel', 'Moira'].some(name => 
      voice.name.includes(name)
    )
  );

  const testSettings = async () => {
    const testText = "Hello, this is a test of the current voice settings. How does it sound?";
    console.log('🎤 音声設定テスト:', { rate, pitch, volume, voice: selectedVoice });
    
    // 実際のテストはTTSManagerで実装
    await testVoiceQuality();
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            音声設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            TTS（Text-to-Speech）がサポートされていません。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          音声品質設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 速度設定 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            <label className="text-sm font-medium">速度</label>
            <Badge variant="outline">{rate.toFixed(1)}</Badge>
          </div>
          <Slider
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
            min={0.3}
            max={1.2}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ゆっくり</span>
            <span>標準</span>
            <span>速い</span>
          </div>
        </div>

        {/* ピッチ設定 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <label className="text-sm font-medium">ピッチ</label>
            <Badge variant="outline">{pitch.toFixed(1)}</Badge>
          </div>
          <Slider
            value={[pitch]}
            onValueChange={(value) => setPitch(value[0])}
            min={0.5}
            max={1.5}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>低い</span>
            <span>標準</span>
            <span>高い</span>
          </div>
        </div>

        {/* 音量設定 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <label className="text-sm font-medium">音量</label>
            <Badge variant="outline">{Math.round(volume * 100)}%</Badge>
          </div>
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            min={0.3}
            max={1.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>小さい</span>
            <span>標準</span>
            <span>大きい</span>
          </div>
        </div>

        {/* 音声選択 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">音声</label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {highQualityVoices.map((voice) => (
              <Button
                key={voice.name}
                variant={selectedVoice === voice.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVoice(voice.name)}
                className="justify-start text-xs"
              >
                <span className="truncate">{voice.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {voice.lang}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* テストボタン */}
        <div className="flex gap-2">
          <Button onClick={testSettings} className="flex-1">
            音声テスト
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
          )}
        </div>

        {/* 現在の設定表示 */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p><strong>現在の設定:</strong></p>
          <p>速度: {rate.toFixed(1)} | ピッチ: {pitch.toFixed(1)} | 音量: {Math.round(volume * 100)}%</p>
          {selectedVoice && <p>音声: {selectedVoice}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
