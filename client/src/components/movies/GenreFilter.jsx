const GenreFilter = ({ genres, selected, onSelect }) => {
  if (!genres?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
          selected === null
            ? 'bg-brand-accent text-brand-bg border-brand-accent'
            : 'border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-textSecondary'
        }`}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
            selected === g.id
              ? 'bg-brand-accent text-brand-bg border-brand-accent'
              : 'border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-textSecondary'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
