import { Crown, Diamond, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { WordCard } from "../../types/gacha";
import { Badge } from "./badge";
import { Card } from "./card";

interface GachaCardProps {
  card: WordCard;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  isNew?: boolean;
  isAnimated?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function GachaCard({
  card,
  onClick,
  className,
  size = "md",
  showDetails = true,
  isNew = false,
  isAnimated = true,
  isFavorite = false,
  onFavoriteToggle,
}: GachaCardProps) {
  // レアリティに応じた情報を取得
  const getRarityInfo = (rarity: WordCard["rarity"]) => {
    switch (rarity) {
      case "common":
        return {
          icon: Star,
          gradient: "from-gray-400 via-gray-500 to-gray-600",
          bgGradient: "from-white to-white",
          borderColor: "border-gray-400",
          shadowColor: "shadow-gray-200/50",
          glowColor: "shadow-gray-400/20",
          textColor: "text-gray-900",
          badgeColor: "bg-gray-500",
          name: "コモン",
        };
      case "uncommon":
        return {
          icon: Star,
          gradient: "from-green-400 via-green-500 to-green-600",
          bgGradient: "from-white to-white",
          borderColor: "border-green-500",
          shadowColor: "shadow-green-200/50",
          glowColor: "shadow-green-400/30",
          textColor: "text-gray-900",
          badgeColor: "bg-green-500",
          name: "アンコモン",
        };
      case "rare":
        return {
          icon: Zap,
          gradient: "from-blue-400 via-blue-500 to-blue-600",
          bgGradient: "from-white to-white",
          borderColor: "border-blue-500",
          shadowColor: "shadow-blue-200/50",
          glowColor: "shadow-blue-400/40",
          textColor: "text-gray-900",
          badgeColor: "bg-blue-500",
          name: "レア",
        };
      case "epic":
        return {
          icon: Crown,
          gradient: "from-purple-400 via-purple-500 to-purple-600",
          bgGradient: "from-white to-white",
          borderColor: "border-purple-500",
          shadowColor: "shadow-purple-200/50",
          glowColor: "shadow-purple-400/50",
          textColor: "text-gray-900",
          badgeColor: "bg-purple-500",
          name: "エピック",
        };
      case "legendary":
        return {
          icon: Diamond,
          gradient: "from-yellow-400 via-amber-500 to-orange-500",
          bgGradient: "from-white to-white",
          borderColor: "border-yellow-500",
          shadowColor: "shadow-yellow-200/50",
          glowColor: "shadow-yellow-400/60",
          textColor: "text-gray-900",
          badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
          name: "レジェンダリー",
        };
      default:
        return {
          icon: Star,
          gradient: "from-gray-400 via-gray-500 to-gray-600",
          bgGradient: "from-white to-white",
          borderColor: "border-gray-400",
          shadowColor: "shadow-gray-200/50",
          glowColor: "shadow-gray-400/20",
          textColor: "text-gray-900",
          badgeColor: "bg-gray-500",
          name: "コモン",
        };
    }
  };

  const rarityInfo = getRarityInfo(card.rarity);

  // サイズに応じたクラス
  const sizeClasses = {
    sm: {
      card: "p-2 min-h-[120px]",
      icon: "w-3 h-3",
      title: "text-xs font-bold",
      meaning: "text-xs",
      badge: "text-xs px-1.5 py-0.5",
      phonetic: "text-xs",
    },
    md: {
      card: "p-3 min-h-[140px]",
      icon: "w-4 h-4",
      title: "text-sm font-bold",
      meaning: "text-xs",
      badge: "text-xs px-2 py-1",
      phonetic: "text-xs",
    },
    lg: {
      card: "p-4 min-h-[160px]",
      icon: "w-5 h-5",
      title: "text-base font-bold",
      meaning: "text-sm",
      badge: "text-sm px-3 py-1",
      phonetic: "text-sm",
    },
  };

  const sizeClass = sizeClasses[size];

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer border-2 transition-all duration-300",
        "bg-white", // 純白背景
        // サイズ別の角丸 (デフォルトのrounded-smから調整)
        size === "sm" ? "!rounded-md" : "!rounded-sm",
        rarityInfo.borderColor,
        rarityInfo.shadowColor,
        sizeClass.card,
        // ホバー効果
        "hover:scale-105 hover:-translate-y-1",
        `hover:${rarityInfo.glowColor}`,
        "hover:shadow-xl",
        // アニメーション
        isAnimated && "transform-gpu",
        // 新しいカードの場合
        isNew && "ring-2 ring-yellow-400 ring-opacity-75",
        className
      )}
      onClick={onClick}
    >
      {/* 背景は純白 - グラデーション装飾なし */}

      {/* 新しいカードのバッジ */}
      {isNew && (
        <div
          className={cn(
            "absolute top-2 z-10",
            onFavoriteToggle ? "right-10" : "right-2"
          )}
        >
          <Badge className="bg-yellow-500 text-white text-xs animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
      )}

      {/* お気に入りボタン */}
      {onFavoriteToggle && (
        <button
          className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-black/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
        >
          <Star
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorite
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            )}
          />
        </button>
      )}

      {/* レアリティアイコンは削除 - ボーダーカラーで判別 */}

      {/* カード内容 */}
      <div className="relative z-10 h-full flex flex-col justify-between pt-2">
        {/* 単語情報 */}
        <div className="text-center flex-1 flex flex-col justify-center space-y-2">
          <h3
            className={cn(
              sizeClass.title,
              rarityInfo.textColor,
              "line-clamp-1"
            )}
          >
            {card.word}
          </h3>

          {card.phonetic && (
            <p className={cn(sizeClass.phonetic, "text-gray-500 font-mono")}>
              {card.phonetic}
            </p>
          )}

          <p className={cn(sizeClass.meaning, "text-gray-600 line-clamp-2")}>
            {card.meaning}
          </p>

          {showDetails && card.partOfSpeech && (
            <p className="text-xs text-gray-500 italic">{card.partOfSpeech}</p>
          )}
        </div>

        {/* フッター */}
        {showDetails && (
          <div className="flex justify-end mt-4">
            <div className="text-xs text-gray-500">#{card.id}</div>
          </div>
        )}
      </div>

      {/* ホバー時のオーバーレイは削除 - 純白背景を維持 */}
    </Card>
  );
}
