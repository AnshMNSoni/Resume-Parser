export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-dark-600 border-t-accent-blue animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-dark-700 border-b-accent-purple animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
      </div>
      <p className="text-sm text-dark-400 animate-pulse">Loading...</p>
    </div>
  );
}
