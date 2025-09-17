import { Heart, Timer, Zap } from "lucide-react";
import { useEffect } from "react";
import { useHeartSystem } from "../hooks/useHeartSystem";
import { HeartSystem } from "../types";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface HeartSystemDisplayProps {
  onHeartChange?: (hearts: HeartSystem) => void;
  showRecoveryTime?: boolean;
  compact?: boolean;
}

export function HeartSystemDisplay({
  onHeartChange,
  showRecoveryTime = true,
  compact = false,
}: HeartSystemDisplayProps) {
  const { heartSystem, processRecovery, refreshHearts } = useHeartSystem();

  useEffect(() => {
    onHeartChange?.(heartSystem);
  }, [heartSystem, onHeartChange]);

  const consumeHeart = () => {
    const manager = getLevelManager();
    if (manager.consumeHeart()) {
      refreshHearts();
      saveLevelManager();
    }
  };

  const recoverAllHearts = () => {
    const manager = getLevelManager();
    const hearts = manager.getHeartSystem();
    hearts.current = hearts.max;
    refreshHearts();
    saveLevelManager();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium">
          {heartSystem.current}/{heartSystem.max}
        </span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          体力システム
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ハート表示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: heartSystem.max }, (_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < heartSystem.current
                    ? "text-red-500 fill-red-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <Badge variant="outline" className="ml-2">
              {heartSystem.current}/{heartSystem.max}
            </Badge>
          </div>
        </div>

        {/* 回復時間表示 */}
        {showRecoveryTime && heartSystem.current < heartSystem.max && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4" />
            <span>
              次の回復まで:{" "}
              {Math.ceil((heartSystem.nextRecoveryTime - Date.now()) / 60000)}分
            </span>
          </div>
        )}

        {/* 回復プログレス */}
        {heartSystem.current < heartSystem.max && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>回復進行度</span>
              <span>
                {Math.floor(
                  ((Date.now() - heartSystem.lastUsedTime) / (5 * 60 * 1000)) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={Math.floor(
                ((Date.now() - heartSystem.lastUsedTime) / (5 * 60 * 1000)) *
                  100
              )}
              className="h-2"
            />
          </div>
        )}

        {/* 体力不足時の警告 */}
        {heartSystem.current === 0 && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              体力が不足しています。5分待つか、アイテムで回復してください。
            </AlertDescription>
          </Alert>
        )}

        {/* 操作ボタン */}
        <div className="flex gap-2">
          <Button
            onClick={consumeHeart}
            variant="outline"
            size="sm"
            disabled={heartSystem.current === 0}
            className="flex-1"
          >
            体力消費
          </Button>
          <Button
            onClick={recoverAllHearts}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            完全回復
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
