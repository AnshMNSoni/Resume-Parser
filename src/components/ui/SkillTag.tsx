export function SkillTag({
  name,
  category,
}: {
  name: string;
  category: string;
}) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'language':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'framework':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'tool':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'database':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cloud':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'soft':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-white/5 text-dark-300 border-white/10';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:scale-105 ${getCategoryColor(
        category
      )}`}
      title={`Category: ${category}`}
    >
      {name}
    </span>
  );
}
