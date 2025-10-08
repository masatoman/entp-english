import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent, CardHeader, CardProps } from "./card";

interface AccessibleCardProps extends CardProps {
  /**
   * カードの役割
   */
  role?: "article" | "region" | "group" | "button" | "link";
  /**
   * カードのラベル
   */
  ariaLabel?: string;
  /**
   * カードの説明
   */
  ariaDescription?: string;
  /**
   * カードが展開可能かどうか
   */
  children?: React.ReactNode;
  className?: string;
  expandable?: boolean;
  /**
   * カードが展開されているかどうか
   */
  expanded?: boolean;
  /**
   * 展開状態の変更ハンドラー
   */
  onToggleExpanded?: () => void;
  /**
   * カードがクリック可能かどうか
   */
  clickable?: boolean;
  /**
   * クリックハンドラー
   */
  onClick?: () => void;
  /**
   * キーボードショートカット
   */
  keyboardShortcut?: string;
  /**
   * カードのレベル（見出しレベル）
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AccessibleCard = React.forwardRef<
  HTMLDivElement,
  AccessibleCardProps
>(
  (
    {
      children,
      className,
      role = "article",
      ariaLabel,
      ariaDescription,
      expandable = false,
      expanded = false,
      onToggleExpanded,
      clickable = false,
      onClick,
      keyboardShortcut,
      headingLevel = 2,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (clickable && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onClick?.();
      }
      if (expandable && event.key === "Enter") {
        event.preventDefault();
        onToggleExpanded?.();
      }
      if (keyboardShortcut && event.key === keyboardShortcut) {
        event.preventDefault();
        onClick?.();
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const getAriaLabel = () => {
      const labels = [];
      if (ariaLabel) labels.push(ariaLabel);
      if (expandable) labels.push(expanded ? "展開済み" : "折りたたみ済み");
      if (clickable) labels.push("クリック可能");
      return labels.join(", ");
    };

    const getAriaDescription = () => {
      const descriptions = [];
      if (ariaDescription) descriptions.push(ariaDescription);
      if (keyboardShortcut)
        descriptions.push(`キーボードショートカット: ${keyboardShortcut}`);
      if (clickable)
        descriptions.push("EnterキーまたはSpaceキーでアクティベート");
      if (expandable) descriptions.push("Enterキーで展開/折りたたみ");
      return descriptions.join(". ");
    };

    // const HeadingComponent = `h${headingLevel}` as keyof JSX.IntrinsicElements;

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-200",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "focus:outline-none",
          clickable && "cursor-pointer hover:shadow-lg",
          expandable && "cursor-pointer",
          isFocused && "ring-2 ring-blue-500 ring-offset-2",
          className
        )}
        role={role}
        aria-label={getAriaLabel()}
        aria-describedby={getAriaDescription() ? "card-description" : undefined}
        aria-expanded={expandable ? expanded : undefined}
        tabIndex={clickable || expandable ? 0 : undefined}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        {children}
        {getAriaDescription() && (
          <span id="card-description" className="sr-only">
            {getAriaDescription()}
          </span>
        )}
      </Card>
    );
  }
);

AccessibleCard.displayName = "AccessibleCard";

interface AccessibleCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AccessibleCardHeader = React.forwardRef<
  HTMLDivElement,
  AccessibleCardHeaderProps
>(({ children, className, headingLevel = 2, ...props }, ref) => {
  const HeadingComponent = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <CardHeader
      ref={ref}
      className={cn("space-y-1.5 p-6", className)}
      {...props}
    >
      <HeadingComponent className="text-2xl font-semibold leading-none tracking-tight">
        {children}
      </HeadingComponent>
    </CardHeader>
  );
});

AccessibleCardHeader.displayName = "AccessibleCardHeader";

interface AccessibleCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AccessibleCardContent = React.forwardRef<
  HTMLDivElement,
  AccessibleCardContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <CardContent ref={ref} className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </CardContent>
  );
});

AccessibleCardContent.displayName = "AccessibleCardContent";
