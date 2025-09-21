import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { baseColors, accentColors } from "../../styles/colors";

export interface SelectionCardProps {
  id: string;
  title: string;
  description: string;
  detail?: string;
  icon?: string;
  difficulty?: string;
  level?: string | number;
  color?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  isRecommended?: boolean;
  duration?: string;
  category?: string;
  keyPoints?: string[];
  onClick: (id: string) => void;
}

export function SelectionCard({
  id,
  title,
  description,
  detail,
  icon,
  difficulty,
  level,
  color = "bg-white border-gray-200",
  isLocked = false,
  isCompleted = false,
  isRecommended = false,
  duration,
  category,
  keyPoints,
  onClick,
}: SelectionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初級":
      case "beginner":
        return {
          backgroundColor: `${accentColors.successGreen}20`,
          color: accentColors.successGreen,
          borderColor: `${accentColors.successGreen}40`,
        };
      case "初〜中級":
      case "intermediate":
        return {
          backgroundColor: `${accentColors.accentOrange}20`,
          color: accentColors.accentOrangeDark,
          borderColor: `${accentColors.accentOrange}40`,
        };
      case "中級":
        return {
          backgroundColor: `${baseColors.delftBlue}20`,
          color: baseColors.delftBlue,
          borderColor: `${baseColors.delftBlue}40`,
        };
      case "上級":
      case "advanced":
        return {
          backgroundColor: `${accentColors.warningRed}20`,
          color: accentColors.warningRed,
          borderColor: `${accentColors.warningRed}40`,
        };
      default:
        return {
          backgroundColor: `${baseColors.gunmetalLight}20`,
          color: baseColors.gunmetal,
          borderColor: `${baseColors.gunmetalLight}40`,
        };
    }
  };

  // カードの状態別スタイル
  const getCardStyle = () => {
    if (isLocked) {
      return {
        backgroundColor: `${baseColors.gunmetalLight}10`,
        borderColor: `${baseColors.gunmetalLight}30`,
        color: baseColors.gunmetalLight,
      };
    }
    if (isCompleted) {
      return {
        backgroundColor: `${accentColors.successGreen}15`,
        borderColor: accentColors.successGreen,
        color: baseColors.gunmetal,
      };
    }
    return {
      backgroundColor: baseColors.ghostWhite,
      borderColor: baseColors.periwinkle,
      color: baseColors.gunmetal,
    };
  };

  const cardStyle = getCardStyle();
  const cardClassName = cn(
    "cursor-pointer transition-all duration-200 border-2 hover:shadow-card game-button",
    isLocked && "cursor-not-allowed opacity-60",
    isRecommended && "ring-2 ring-opacity-50",
  );

  return (
    <Card 
      className={cardClassName} 
      onClick={() => !isLocked && onClick(id)}
      style={{
        ...cardStyle,
        ...(isRecommended && {
          boxShadow: `0 0 0 2px ${accentColors.accentOrange}80`,
        }),
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <CardTitle className="text-lg">{title}</CardTitle>
            {isCompleted && <span style={{ color: accentColors.successGreen }}>✓</span>}
            {isLocked && <span style={{ color: baseColors.gunmetalLight }}>🔒</span>}
          </div>
          <div className="flex gap-2">
            {difficulty && (
              <Badge
                variant="outline"
                className="text-xs border"
                style={getDifficultyColor(difficulty)}
              >
                {difficulty}
              </Badge>
            )}
            {level && (
              <Badge 
                variant="outline" 
                className="text-xs border"
                style={{
                  backgroundColor: `${baseColors.delftBlue}15`,
                  color: baseColors.delftBlue,
                  borderColor: `${baseColors.delftBlue}40`,
                }}
              >
                Level {level}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription 
          style={{ 
            color: isLocked ? baseColors.gunmetalLight : baseColors.gunmetalLight 
          }}
        >
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {detail && (
          <p
            className={cn(
              "text-sm",
              isLocked ? "text-gray-400" : "text-gray-600"
            )}
          >
            {detail}
          </p>
        )}

        {/* メタ情報 */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {duration && (
            <span className="flex items-center gap-1">⏱️ {duration}</span>
          )}
          {category && <span className="capitalize">{category}</span>}
        </div>

        {/* キーポイント */}
        {keyPoints && keyPoints.length > 0 && (
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">重要ポイント:</div>
            <ul className="list-disc list-inside space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index} className="truncate">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 推奨バッジ */}
        {isRecommended && (
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
            🎯 推奨コンテンツ
          </div>
        )}
      </CardContent>
    </Card>
  );
}
