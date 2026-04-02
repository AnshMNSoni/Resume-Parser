'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose';
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'blue',
  delay = 0,
}: StatCardProps) {
  const colorMap = {
    blue: {
      iconBg: 'bg-accent-blue/10',
      iconText: 'text-accent-blue',
      glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]',
    },
    purple: {
      iconBg: 'bg-accent-purple/10',
      iconText: 'text-accent-purple',
      glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]',
    },
    emerald: {
      iconBg: 'bg-accent-emerald/10',
      iconText: 'text-accent-emerald',
      glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
    },
    amber: {
      iconBg: 'bg-accent-amber/10',
      iconText: 'text-accent-amber',
      glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]',
    },
    cyan: {
      iconBg: 'bg-accent-cyan/10',
      iconText: 'text-accent-cyan',
      glow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]',
    },
    rose: {
      iconBg: 'bg-accent-rose/10',
      iconText: 'text-accent-rose',
      glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.08)]',
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`gradient-card rounded-2xl p-5 transition-all duration-300 ${c.glow} hover:-translate-y-0.5 animate-slide-up opacity-0`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}>
          <span className={c.iconText}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
        {value}
      </p>
      <p className="text-xs text-dark-400 font-medium">{label}</p>
    </div>
  );
}
