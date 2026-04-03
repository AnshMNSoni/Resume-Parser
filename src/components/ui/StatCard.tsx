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
      iconBg: 'bg-accent-emerald/10',
      iconText: 'text-accent-emerald',
      glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
    },
    purple: {
      iconBg: 'bg-accent-teal/10',
      iconText: 'text-accent-teal',
      glow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]',
    },
    emerald: {
      iconBg: 'bg-accent-emerald/10',
      iconText: 'text-accent-emerald',
      glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]',
    },
    amber: {
      iconBg: 'bg-white/10',
      iconText: 'text-white',
      glow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]',
    },
    cyan: {
      iconBg: 'bg-accent-teal/10',
      iconText: 'text-accent-teal',
      glow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.08)]',
    },
    rose: {
      iconBg: 'bg-white/5',
      iconText: 'text-dark-200',
      glow: 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]',
    },
  };

  const c = colorMap[color] || colorMap.emerald;

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
