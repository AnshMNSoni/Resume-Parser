export function LoadingSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-dark-600 border-t-accent-blue animate-spin`}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-dark-600 border-t-accent-blue animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-dark-700 border-b-accent-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm text-dark-400 animate-pulse">Processing...</p>
    </div>
  );
}
