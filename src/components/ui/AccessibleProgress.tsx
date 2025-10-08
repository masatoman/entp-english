import React from "react";
// import { Progress } from './progress'
import { cn } from "@/lib/utils";

interface AccessibleProgressProps {
  /**
   * 進捗の値（0-100）
   */
  value: number;
  /**
   * 進捗の最大値
   */
  max?: number;
  /**
   * 進捗の最小値
   */
  min?: number;
  /**
   * 進捗のラベル
   */
  label?: string;
  /**
   * 進捗の説明
   */
  description?: string;
  /**
   * 進捗の単位
   */
  unit?: string;
  /**
   * 進捗の状態
   */
  status?: "normal" | "success" | "warning" | "error";
  /**
   * 進捗のサイズ
   */
  size?: "sm" | "md" | "lg";
  /**
   * 進捗の色
   */
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  /**
   * アニメーション
   */
  animated?: boolean;
  /**
   * カスタムクラス
   */
  className?: string;
  /**
   * 進捗の変更ハンドラー
   */
  onChange?: (value: number) => void;
  /**
   * 進捗のフォーカスハンドラー
   */
  onFocus?: () => void;
  /**
   * 進捗のブラーハンドラー
   */
  onBlur?: () => void;
}

export const AccessibleProgress = React.forwardRef<
  HTMLDivElement,
  AccessibleProgressProps
>(
  (
    {
      value,
      max = 100,
      min = 0,
      label,
      description,
      unit = "%",
      status = "normal",
      size = "md",
      color = "blue",
      animated = false,
      className,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const percentage = Math.min(
      Math.max(((value - min) / (max - min)) * 100, 0),
      100
    );
    const isComplete = percentage >= 100;
    const isIndeterminate = value === null || value === undefined;

    const getStatusColor = () => {
      if (status === "success" || isComplete) return "bg-green-500";
      if (status === "warning") return "bg-yellow-500";
      if (status === "error") return "bg-red-500";
      if (color === "green") return "bg-green-500";
      if (color === "yellow") return "bg-yellow-500";
      if (color === "red") return "bg-red-500";
      if (color === "purple") return "bg-purple-500";
      return "bg-blue-500";
    };

    const getSizeClasses = () => {
      if (size === "sm") return "h-1";
      if (size === "lg") return "h-3";
      return "h-2";
    };

    const getStatusText = () => {
      if (isIndeterminate) return "読み込み中";
      if (isComplete) return "完了";
      if (status === "error") return "エラー";
      if (status === "warning") return "注意が必要";
      return "進行中";
    };

    const getAriaLabel = () => {
      const labels = [];
      if (label) labels.push(label);
      labels.push(`${Math.round(percentage)}${unit}`);
      labels.push(getStatusText());
      return labels.join(", ");
    };

    const getAriaDescription = () => {
      const descriptions = [];
      if (description) descriptions.push(description);
      if (isIndeterminate) descriptions.push("進捗を計算中です");
      else descriptions.push(`${min}から${max}の範囲で${value}の値`);
      return descriptions.join(". ");
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (onChange && !isIndeterminate) {
        const step = (max - min) / 100;
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          onChange(Math.min(value + step, max));
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          onChange(Math.max(value - step, min));
        }
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
        {/* ラベルと値の表示 */}
        {(label || !isIndeterminate) && (
          <div className="flex items-center justify-between text-sm">
            {label && (
              <span className="font-medium text-foreground">{label}</span>
            )}
            {!isIndeterminate && (
              <span className="text-muted-foreground">
                {Math.round(percentage)}
                {unit}
              </span>
            )}
          </div>
        )}

        {/* プログレスバー */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-secondary",
            getSizeClasses(),
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "focus:outline-none",
            isFocused && "ring-2 ring-blue-500 ring-offset-2",
            onChange && "cursor-pointer"
          )}
          role="progressbar"
          aria-label={getAriaLabel()}
          aria-describedby={
            getAriaDescription() ? "progress-description" : undefined
          }
          aria-valuenow={isIndeterminate ? undefined : value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={`${Math.round(percentage)}${unit}`}
          tabIndex={onChange ? 0 : undefined}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              getStatusColor(),
              animated && "animate-pulse",
              isHovered && "brightness-110",
              isFocused && "brightness-110"
            )}
            style={{
              width: isIndeterminate ? "100%" : `${percentage}%`,
              transform: isIndeterminate
                ? "translateX(-100%)"
                : "translateX(0)",
              animation: isIndeterminate
                ? "indeterminate 2s infinite linear"
                : undefined,
            }}
          />
        </div>

        {/* 説明テキスト */}
        {description && (
          <p
            id="progress-description"
            className="text-xs text-muted-foreground"
          >
            {description}
          </p>
        )}

        {/* ステータステキスト */}
        <p className="text-xs text-muted-foreground sr-only">
          {getStatusText()}
        </p>

        {/* アニメーション用のCSS */}
        {animated && (
          <style>{`
            @keyframes indeterminate {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        )}
      </div>
    );
  }
);

AccessibleProgress.displayName = "AccessibleProgress";
