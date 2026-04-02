import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mb-6">
        <span className="text-4xl font-bold gradient-text" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
          404
        </span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-sm text-dark-400 mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or the candidate may have been removed.
      </p>
      <Link
        href="/"
        className="gradient-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      >
        Go Home
      </Link>
    </div>
  );
}
