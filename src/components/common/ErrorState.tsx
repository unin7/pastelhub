import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "데이터를 불러올 수 없습니다.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-500">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}