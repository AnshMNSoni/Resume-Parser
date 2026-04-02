'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-accent-rose/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-accent-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-sm text-dark-400 mb-6 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="gradient-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      >
        Try Again
      </button>
    </div>
  );
}
