import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 健壮的 React 错误边界类组件
 * 专门配合 Suspense 及 React 19 的 use(promise) 捕获 Promise reject 错误
 */
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
    console.error('ErrorBoundary 捕获到组件异常:', error, errorInfo);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          reset: this.reset,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h3 className="text-lg font-semibold mb-2">组件加载出错</h3>
          <p className="text-sm font-mono bg-red-100 p-2 rounded mb-4">
            {this.state.error.message || '未知错误'}
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
