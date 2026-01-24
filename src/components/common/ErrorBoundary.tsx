import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../ui/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card variant="glass" padding="lg" className="max-w-2xl mx-auto my-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                오류가 발생했습니다
              </h2>
              <p className="text-gray-600 mb-4">
                {this.state.error?.message || '예상치 못한 오류가 발생했습니다.'}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className={cn(
                'flex items-center gap-2 px-4 py-2',
                'bg-purple-500 text-white rounded-lg',
                'hover:bg-purple-600 transition-colors',
                'font-medium'
              )}
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
