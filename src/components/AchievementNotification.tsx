/**
 * アチーブメント達成通知コンポーネント
 * リスニング学習でアチーブメントを達成した際の通知表示
 */

import { Award, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AchievementNotification } from "../utils/listeningAchievementManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface AchievementNotificationProps {
  notification: AchievementNotification;
  onClose: () => void;
}

export const AchievementNotificationComponent: React.FC<
  AchievementNotificationProps
> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // アニメーション用の表示遅延
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "uncommon":
        return "bg-green-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "コモン";
      case "uncommon":
        return "アンコモン";
      case "rare":
        return "レア";
      case "epic":
        return "エピック";
      case "legendary":
        return "レジェンダリー";
      default:
        return "コモン";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full ${getRarityColor(
                    notification.rarity
                  )} flex items-center justify-center text-white shadow-lg`}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getRarityColor(
                      notification.rarity
                    )} text-white`}
                  >
                    {getRarityText(notification.rarity)}
                  </Badge>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">
                  🏆 アチーブメント達成！
                </h3>
                <h4 className="font-semibold text-base text-gray-800 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.description}
                </p>

                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600 font-semibold">
                    +{notification.reward.xp} XP
                  </span>
                  {notification.reward.coins && (
                    <span className="text-yellow-600 font-semibold">
                      +{notification.reward.coins} コイン
                    </span>
                  )}
                  {notification.reward.items &&
                    notification.reward.items.length > 0 && (
                      <span className="text-blue-600 font-semibold">
                        +{notification.reward.items.length} アイテム
                      </span>
                    )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AchievementNotificationContainerProps {
  notifications: AchievementNotification[];
  onRemoveNotification: (id: string) => void;
}

export const AchievementNotificationContainer: React.FC<
  AchievementNotificationContainerProps
> = ({ notifications, onRemoveNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index,
          }}
        >
          <AchievementNotificationComponent
            notification={notification}
            onClose={() => onRemoveNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};
