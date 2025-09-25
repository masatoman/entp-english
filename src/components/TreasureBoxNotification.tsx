import { useEffect, useState } from "react";
import { TreasureBox } from "../types/adrenalineSystem";
import { adrenalineManager } from "../utils/adrenalineManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface TreasureBoxNotificationProps {
  onClose?: () => void;
}

export default function TreasureBoxNotification({
  onClose,
}: TreasureBoxNotificationProps) {
  const [treasureBoxes, setTreasureBoxes] = useState<TreasureBox[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadTreasureBoxes = () => {
      const system = adrenalineManager.getSystem();
      const unopenedBoxes = system.treasureBoxes.filter((box) => !box.isOpened);
      setTreasureBoxes(unopenedBoxes);

      // 宝箱がある場合は表示
      if (unopenedBoxes.length > 0) {
        setIsVisible(true);
      }
    };

    loadTreasureBoxes();

    // 宝箱獲得イベントをリスン
    const handleTreasureBoxEarned = () => {
      loadTreasureBoxes();
    };

    window.addEventListener("treasureBoxEarned", handleTreasureBoxEarned);

    // 定期的に宝箱リストを更新
    const interval = setInterval(loadTreasureBoxes, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("treasureBoxEarned", handleTreasureBoxEarned);
    };
  }, []);

  const getBoxIcon = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "📦";
      case "silver":
        return "🎁";
      case "gold":
        return "✨";
      case "rainbow":
        return "🌈";
      default:
        return "📦";
    }
  };

  const getBoxColor = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-100";
      case "silver":
        return "border-gray-400 bg-gradient-to-r from-gray-50 to-slate-100";
      case "gold":
        return "border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-100";
      case "rainbow":
        return "border-purple-400 bg-gradient-to-r from-purple-50 to-pink-100";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getBoxName = (type: TreasureBox["type"]) => {
    switch (type) {
      case "bronze":
        return "ブロンズ宝箱";
      case "silver":
        return "シルバー宝箱";
      case "gold":
        return "ゴールド宝箱";
      case "rainbow":
        return "レインボー宝箱";
      default:
        return "宝箱";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // 宝箱がない場合は表示しない
  if (!isVisible || treasureBoxes.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <Card
        className={`border-2 shadow-lg max-w-sm ${getBoxColor(
          treasureBoxes[0].type
        )}`}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-bounce">
                {getBoxIcon(treasureBoxes[0].type)}
              </span>
              <div>
                <div className="font-bold text-sm">
                  {getBoxName(treasureBoxes[0].type)}を獲得！
                </div>
                <div className="text-xs text-gray-600">
                  未開封の宝箱 {treasureBoxes.length}個
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                回答後に開封
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
