import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./card";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "読み込み中...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`min-h-screen p-4 flex items-center justify-center ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-muted-foreground text-sm">
              コンポーネントを読み込んでいます
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
