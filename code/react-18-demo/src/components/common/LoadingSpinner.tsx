export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({
  size = 'md',
  label,
  className = '',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerElement = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeMap[size]}`}
        role="status"
        aria-label={label || '加载中'}
      />
      {label && <span className="text-sm font-medium text-gray-500">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}

export default LoadingSpinner;
