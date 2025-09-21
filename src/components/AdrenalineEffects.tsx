import { useEffect, useState } from "react";
import {
  AdrenalineEventData,
  AdrenalineSystem,
} from "../types/adrenalineSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface AdrenalineEffectsProps {
  onEventTriggered?: (event: AdrenalineEventData) => void;
}

export default function AdrenalineEffects({
  onEventTriggered,
}: AdrenalineEffectsProps) {
  const [system, setSystem] = useState<AdrenalineSystem>(
    adrenalineManager.getSystem()
  );
  const [comboStatus, setComboStatus] = useState(
    adrenalineManager.getComboStatus()
  );
  const [feverStatus, setFeverStatus] = useState(
    adrenalineManager.getFeverTimeStatus()
  );
  const [pressureStatus, setPressureStatus] = useState(
    adrenalineManager.getPressureGaugeStatus()
  );
  const [activeEvents, setActiveEvents] = useState<AdrenalineEventData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystem(adrenalineManager.getSystem());
      setComboStatus(adrenalineManager.getComboStatus());
      setFeverStatus(adrenalineManager.getFeverTimeStatus());
      setPressureStatus(adrenalineManager.getPressureGaugeStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const triggerEvent = (event: AdrenalineEventData) => {
    setActiveEvents((prev) => [...prev, event]);
    onEventTriggered?.(event);

    // イベント表示を3秒後に削除
    setTimeout(() => {
      setActiveEvents((prev) =>
        prev.filter((e) => e.timestamp !== event.timestamp)
      );
    }, 3000);
  };

  // 外部から呼び出し可能なメソッドを公開
  useEffect(() => {
    (window as any).triggerAdrenalineEvent = triggerEvent;
  }, []);

  return (
    <>
      {/* デスクトップ表示 */}
      <div className="hidden md:block fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {/* アクティブイベント表示 */}
        {activeEvents.map((event) => (
        <Card
          key={event.timestamp}
          className={`
            animate-bounce border-2 shadow-lg
            ${
              event.type === "critical_hit"
                ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50"
                : ""
            }
            ${
              event.type === "combo_start"
                ? "border-red-400 bg-gradient-to-r from-red-50 to-pink-50"
                : ""
            }
            ${
              event.type === "fever_time_start"
                ? "border-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50"
                : ""
            }
            ${
              event.type === "pressure_burst"
                ? "border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50"
                : ""
            }
          `}
        >
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">{event.message}</div>
              {event.effects.includes("critical_flash") && (
                <div className="text-xs text-yellow-600">
                  ✨ 画面が金色に光る ✨
                </div>
              )}
              {event.effects.includes("combo_multiplier") && (
                <div className="text-xs text-red-600">🔥 燃え上がる効果 🔥</div>
              )}
              {event.effects.includes("fever_background") && (
                <div className="text-xs text-purple-600">
                  🎊 キラキラエフェクト 🎊
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 常時表示ステータス */}
      <Card className="bg-white/90 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-2 sm:p-3 space-y-2 sm:space-y-3">
          {/* コンボ表示 */}
          {comboStatus.combo > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">🔥</span>
                <span className="text-xs sm:text-sm font-bold">
                  {comboStatus.combo}連続コンボ
                </span>
              </div>
              <Badge variant="destructive" className="text-xs">
                ×{comboStatus.multiplier.toFixed(1)}
              </Badge>
            </div>
          )}

          {/* フィーバータイム表示 */}
          {feverStatus.isActive && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500 animate-pulse">🎊</span>
                <span className="text-xs sm:text-sm font-bold text-purple-600">
                  FEVER TIME!
                </span>
                </div>
                <Badge variant="secondary" className="text-xs bg-purple-100">
                  ×{system.feverTime.multiplier}
                </Badge>
              </div>
              <Progress
                value={(feverStatus.timeLeft / system.feverTime.duration) * 100}
                className="h-2"
              />
              <div className="text-xs text-purple-600 text-center">
                残り {Math.ceil(feverStatus.timeLeft / 1000)}秒
              </div>
            </div>
          )}

          {/* プレッシャーゲージ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">💪</span>
                <span className="text-xs font-medium">プレッシャー</span>
              </div>
              <span className="text-xs text-gray-600">
                {pressureStatus.current}/{pressureStatus.max}
              </span>
            </div>
            <Progress
              value={pressureStatus.percentage}
              className={`h-2 ${
                pressureStatus.canBurst ? "animate-pulse" : ""
              }`}
            />
            {pressureStatus.canBurst && (
              <div className="text-xs text-blue-600 text-center animate-pulse">
                💥 バースト準備完了！
              </div>
            )}
          </div>

          {/* デイリーボーナス */}
          {system.dailyBonus.currentMultiplier > 1.0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">📅</span>
                <span className="text-xs font-medium">
                  {system.dailyBonus.consecutiveDays}日連続
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                ×{system.dailyBonus.currentMultiplier.toFixed(1)}
              </Badge>
            </div>
          )}

          {/* 総合乗数 */}
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">総合効果</span>
              <Badge
                variant="default"
                className={`
                  text-sm font-bold
                  ${
                    adrenalineManager.calculateTotalMultiplier() >= 3.0
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : ""
                  }
                  ${
                    adrenalineManager.calculateTotalMultiplier() >= 2.0
                      ? "bg-gradient-to-r from-purple-400 to-pink-500"
                      : ""
                  }
                  ${
                    adrenalineManager.calculateTotalMultiplier() >= 1.5
                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                      : ""
                  }
                `}
              >
                ×{adrenalineManager.calculateTotalMultiplier().toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 宝箱通知 */}
      {system.treasureBoxes.filter((box) => !box.isOpened).length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 animate-pulse">
          <CardContent className="p-3">
            <div className="text-center">
              <div className="text-lg">🎁</div>
              <div className="text-xs font-bold text-yellow-700">
                未開封の宝箱{" "}
                {system.treasureBoxes.filter((box) => !box.isOpened).length}個
              </div>
              <div className="text-xs text-yellow-600">タップして開封！</div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* スマホ用簡易表示（下部固定、コンパクト） */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        {/* 重要なイベントのみ表示 */}
        {activeEvents.filter(event => 
          event.type === "critical_hit" || 
          event.type === "combo_start" || 
          event.type === "fever_time_start"
        ).map((event) => (
          <Card 
            key={event.timestamp} 
            className="animate-bounce border-2 shadow-lg bg-white/95 backdrop-blur-sm mb-2"
          >
            <CardContent className="p-2 text-center">
              <div className="text-sm font-bold">{event.message}</div>
            </CardContent>
          </Card>
        ))}
        
        {/* コンパクトステータス表示 */}
        {(comboStatus.combo > 0 || feverStatus.isActive || pressureStatus.percentage > 50) && (
          <Card className="bg-white/90 backdrop-blur-sm border shadow-md">
            <CardContent className="p-2 flex items-center space-x-2">
              {comboStatus.combo > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-red-500 text-sm">🔥</span>
                  <span className="text-xs font-bold">{comboStatus.combo}</span>
                </div>
              )}
              {feverStatus.isActive && (
                <div className="flex items-center space-x-1">
                  <span className="text-purple-500 text-sm animate-pulse">🎊</span>
                  <span className="text-xs font-bold">FEVER</span>
                </div>
              )}
              {pressureStatus.percentage > 50 && (
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500 text-sm">💪</span>
                  <span className="text-xs">{Math.round(pressureStatus.percentage)}%</span>
                </div>
              )}
              <div className="text-xs font-bold text-gray-700">
                ×{adrenalineManager.calculateTotalMultiplier().toFixed(1)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

// アドレナリンイベントをトリガーするヘルパー関数
export const triggerAdrenalineEvent = (
  isCorrect: boolean,
  isCritical: boolean = false
): AdrenalineEventData[] => {
  if (isCorrect) {
    const events = adrenalineManager.processCorrectAnswer();

    // クリティカルヒットの追加処理
    if (isCritical) {
      const criticalEvent: AdrenalineEventData = {
        type: "critical_hit",
        value: 3.0,
        multiplier: 3.0,
        message: "⚡ CRITICAL HIT! 超大量XP獲得！",
        timestamp: Date.now(),
        effects: ["critical_flash", "screen_shake", "golden_effect"],
      };
      events.push(criticalEvent);
    }

    return events;
  } else {
    return adrenalineManager.processIncorrectAnswer();
  }
};

// XP計算ヘルパー
export const calculateAdrenalineXP = (
  baseXP: number,
  isCritical: boolean = false
) => {
  return adrenalineManager.calculateBoostedXP(baseXP, isCritical);
};
