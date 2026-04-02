'use client';

export function ScoreGauge({
  score,
  label,
  size = 120,
  delay = 0,
}: {
  score: number;
  label: string;
  size?: number;
  delay?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: '#34d399', text: 'score-excellent', bg: 'score-bg-excellent' };
    if (s >= 65) return { stroke: '#6366f1', text: 'score-good', bg: 'score-bg-good' };
    if (s >= 50) return { stroke: '#fbbf24', text: 'score-average', bg: 'score-bg-average' };
    if (s >= 35) return { stroke: '#f97316', text: 'score-low', bg: 'score-bg-low' };
    return { stroke: '#f43f5e', text: 'score-poor', bg: 'score-bg-poor' };
  };

  const colors = getScoreColor(score);

  return (
    <div
      className="flex flex-col items-center gap-2 animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={6}
          />
          {/* Score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${colors.stroke}40)`,
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-bold font-[var(--font-mono)] ${colors.text}`}
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
          >
            {score}
          </span>
          <span className="text-[10px] text-dark-400 font-medium uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-dark-200 text-center">{label}</span>
    </div>
  );
}
