export function ScoreBadge({ score }: { score: number }) {
  const getConfig = (s: number) => {
    if (s >= 80) return { classes: 'score-bg-excellent score-excellent', label: 'Excellent' };
    if (s >= 65) return { classes: 'score-bg-good score-good', label: 'Good' };
    if (s >= 50) return { classes: 'score-bg-average score-average', label: 'Average' };
    if (s >= 35) return { classes: 'score-bg-low score-low', label: 'Below Avg' };
    return { classes: 'score-bg-poor score-poor', label: 'Low' };
  };

  const config = getConfig(score);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.classes}`}
      style={{ fontFamily: 'var(--font-mono, monospace)' }}
      title={config.label}
    >
      {score}
    </span>
  );
}
