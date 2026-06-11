import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard.jsx';
import Spinner from '../common/Spinner.jsx';

const SkeletonCard = () => (
  <div className="w-36 sm:w-44 flex-shrink-0">
    <div className="aspect-[2/3] rounded-lg bg-brand-surface animate-pulse" />
    <div className="mt-2 h-3 w-3/4 bg-brand-surface rounded animate-pulse" />
  </div>
);

const MovieRow = ({ title, movies, loading, error, seeAllPath }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
  };

  return (
    <section className="mb-12">
      {/* Row header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-brand-accent rounded-full flex-shrink-0" />
          <h2 className="font-display text-lg sm:text-xl font-semibold text-brand-textPrimary">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {seeAllPath && (
            <button
              onClick={() => navigate(seeAllPath)}
              className="text-xs text-brand-textSecondary hover:text-brand-accent transition-colors mr-2"
            >
              See all →
            </button>
          )}
          {/* Scroll arrows */}
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center
                       text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                       transition-all duration-200"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center
                       text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                       transition-all duration-200"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-brand-danger px-1">{error}</p>
      )}

      {/* Scrollable row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>
    </section>
  );
};

export default MovieRow;
