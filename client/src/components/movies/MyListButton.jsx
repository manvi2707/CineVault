import { useMyList } from '../../context/MyListContext.jsx';

const BookmarkIcon = ({ filled }) => (
  <svg
    className="w-4 h-4"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
  </svg>
);

// Compact circular icon button — used on MovieCard hover overlay
export const MyListIconButton = ({ movie, className = '' }) => {
  const { isInList, toggleList } = useMyList();
  const inList = isInList(movie.id);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleList(movie); }}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                  ${inList
                    ? 'bg-brand-accent text-brand-bg'
                    : 'bg-black/50 text-brand-textPrimary hover:bg-brand-accent hover:text-brand-bg border border-brand-border/50'
                  } ${className}`}
      aria-label={inList ? 'Remove from My List' : 'Add to My List'}
      title={inList ? 'Remove from My List' : 'Add to My List'}
    >
      <BookmarkIcon filled={inList} />
    </button>
  );
};

// Full button with label — used on MovieDetailPage
export const MyListButton = ({ movie, className = '' }) => {
  const { isInList, toggleList } = useMyList();
  const inList = isInList(movie.id);

  return (
    <button
      onClick={() => toggleList(movie)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 text-sm font-medium
                  ${inList
                    ? 'bg-brand-accent text-brand-bg border-brand-accent hover:bg-brand-accentHover'
                    : 'border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent'
                  } ${className}`}
    >
      <BookmarkIcon filled={inList} />
      {inList ? 'In My List' : 'Add to My List'}
    </button>
  );
};
