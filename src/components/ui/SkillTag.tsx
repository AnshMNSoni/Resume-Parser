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
        return 'bg-white/10 text-white border-white/20';
      case 'framework':
        return 'bg-dark-700 text-dark-100 border-dark-600';
      case 'tool':
        return 'bg-dark-800 text-dark-300 border-white/5';
      case 'database':
        return 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20';
      case 'cloud':
        return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
      case 'soft':
        return 'bg-transparent text-dark-400 border-dark-600';
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
