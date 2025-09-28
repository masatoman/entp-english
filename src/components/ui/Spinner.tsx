import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const Spinner = ({ size = "md", className, text }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-blue-600",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({
  text = "読み込み中...",
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        className
      )}
    >
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <Spinner size="lg" text={text} />
      </div>
    </div>
  );
};

export const InlineSpinner = ({
  size = "sm",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <Spinner size={size} />
    </div>
  );
};

export default Spinner;
