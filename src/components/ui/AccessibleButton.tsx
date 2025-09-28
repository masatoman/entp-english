import { cn } from "@/lib/utils";
import React from "react";
import { Button, ButtonProps } from "./button";

interface AccessibleButtonProps extends ButtonProps {
  /**
   * スクリーンリーダー用の説明テキスト
   */
  ariaDescription?: string;
  /**
   * ボタンの状態を説明するテキスト
   */
  ariaLabel?: string;
  /**
   * ボタンが押されたときの説明テキスト
   */
  pressedAriaLabel?: string;
  /**
   * フォーカス時の説明テキスト
   */
  focusAriaLabel?: string;
  /**
   * キーボードショートカット
   */
  keyboardShortcut?: string;
  /**
   * ローディング状態
   */
  isLoading?: boolean;
  /**
   * ローディング時のテキスト
   */
  loadingText?: string;
}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(
  (
    {
      children,
      className,
      ariaDescription,
      ariaLabel,
      pressedAriaLabel,
      focusAriaLabel,
      keyboardShortcut,
      isLoading = false,
      loadingText = "読み込み中...",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const getAriaLabel = () => {
      if (isLoading) return loadingText;
      if (isPressed && pressedAriaLabel) return pressedAriaLabel;
      if (isFocused && focusAriaLabel) return focusAriaLabel;
      return ariaLabel || children?.toString();
    };

    const getAriaDescription = () => {
      const descriptions = [];
      if (ariaDescription) descriptions.push(ariaDescription);
      if (keyboardShortcut)
        descriptions.push(`キーボードショートカット: ${keyboardShortcut}`);
      if (isLoading) descriptions.push("読み込み中です");
      return descriptions.join(". ");
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-200",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "focus:outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "aria-pressed:bg-blue-600 aria-pressed:text-black",
          isLoading && "cursor-wait",
          className
        )}
        disabled={disabled || isLoading}
        aria-label={getAriaLabel()}
        aria-describedby={
          getAriaDescription() ? "button-description" : undefined
        }
        aria-pressed={isPressed}
        aria-busy={isLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{loadingText}</span>
          </div>
        ) : (
          children
        )}
        {getAriaDescription() && (
          <span id="button-description" className="sr-only">
            {getAriaDescription()}
          </span>
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
