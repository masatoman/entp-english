import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

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
        return "bg-green-100 text-green-800 border-green-200";
      case "初〜中級":
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "中級":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "上級":
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const cardClassName = cn(
    "cursor-pointer transition-all duration-200 border-2 hover:shadow-lg active:scale-[0.98]",
    isLocked && "cursor-not-allowed opacity-60",
    isCompleted && "border-green-300 bg-green-50",
    isRecommended && "ring-2 ring-blue-400 ring-opacity-50",
    !isLocked && !isCompleted && color,
    isLocked && "bg-gray-50 border-gray-200"
  );

  return (
    <Card className={cardClassName} onClick={() => !isLocked && onClick(id)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <CardTitle className="text-lg">{title}</CardTitle>
            {isCompleted && <span className="text-green-600">✓</span>}
            {isLocked && <span className="text-gray-400">🔒</span>}
          </div>
          <div className="flex gap-2">
            {difficulty && (
              <Badge
                variant="outline"
                className={cn("text-xs", getDifficultyColor(difficulty))}
              >
                {difficulty}
              </Badge>
            )}
            {level && (
              <Badge variant="outline" className="text-xs">
                Level {level}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className={isLocked ? "text-gray-400" : ""}>
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
