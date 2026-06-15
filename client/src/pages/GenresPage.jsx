import { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import MovieGrid from '../components/movies/MovieGrid.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useGenres, useByGenre, useTVGenres, useTVByGenre } from '../hooks/useMovies.js';

// Decorative colors per genre for the genre cards
const GENRE_COLORS = [
  'from-indigo-900/60', 'from-purple-900/60', 'from-teal-900/60',
  'from-rose-900/60', 'from-amber-900/60', 'from-cyan-900/60',
  'from-emerald-900/60', 'from-fuchsia-900/60', 'from-orange-900/60',
  'from-sky-900/60', 'from-lime-900/60', 'from-pink-900/60',
  'from-violet-900/60', 'from-red-900/60', 'from-yellow-900/60',
  'from-blue-900/60', 'from-green-900/60', 'from-slate-700/60',
  'from-stone-700/60',
];

const GenreCard = ({ genre, index, onClick, isActive }) => (
  <button
    onClick={() => onClick(genre)}
    className={`relative overflow-hidden rounded-xl border p-6 text-left transition-all duration-200
                bg-gradient-to-br ${GENRE_COLORS[index % GENRE_COLORS.length]} to-brand-surface
                ${isActive
                  ? 'border-brand-accent scale-[1.02] shadow-lg shadow-brand-accent/10'
                  : 'border-brand-border hover:border-brand-accent/50 hover:scale-[1.01]'
                }`}
  >
    <span className="font-display font-semibold text-brand-textPrimary">{genre.name}</span>
    {isActive && (
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-accent" />
    )}
  </button>
);

const GenresPage = () => {
  const [mediaType, setMediaType] = useState('movie'); // 'movie' | 'tv'
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);

  const { data: movieGenres, loading: movieGenresLoading } = useGenres();
  const { data: tvGenres, loading: tvGenresLoading } = useTVGenres();

  const genresData = mediaType === 'movie' ? movieGenres : tvGenres;
  const genresLoading = mediaType === 'movie' ? movieGenresLoading : tvGenresLoading;

  const movieResults = useByGenre(mediaType === 'movie' ? activeGenre?.id : null, page);
  const tvResults = useTVByGenre(mediaType === 'tv' ? activeGenre?.id : null, page);
  const { data, loading, error } = mediaType === 'movie' ? movieResults : tvResults;

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setActiveGenre(null);
    setPage(1);
  };

  const handleGenreClick = (genre) => {
    if (activeGenre?.id === genre.id) {
      setActiveGenre(null);
    } else {
      setActiveGenre(genre);
      setPage(1);
      setTimeout(() => {
        document.getElementById('genre-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-brand-accent rounded-full" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-textPrimary">Genres</h1>
          </div>

          {/* Movie/Series toggle */}
          <div className="inline-flex border border-brand-border rounded-lg overflow-hidden">
            <button
              onClick={() => handleMediaTypeChange('movie')}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                mediaType === 'movie'
                  ? 'bg-brand-accent text-brand-bg'
                  : 'text-brand-textSecondary hover:text-brand-textPrimary'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => handleMediaTypeChange('tv')}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                mediaType === 'tv'
                  ? 'bg-brand-accent text-brand-bg'
                  : 'text-brand-textSecondary hover:text-brand-textPrimary'
              }`}
            >
              Series
            </button>
          </div>
        </div>

        {/* Genre grid */}
        {genresLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 19 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-brand-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genresData?.genres?.map((genre, i) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                index={i}
                onClick={handleGenreClick}
                isActive={activeGenre?.id === genre.id}
              />
            ))}
          </div>
        )}

        {/* Genre results */}
        {activeGenre && (
          <div id="genre-results" className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-brand-accent rounded-full" />
              <h2 className="font-display text-xl font-semibold text-brand-textPrimary">
                {activeGenre.name}
              </h2>
              {data?.total_results && (
                <span className="text-sm text-brand-textSecondary">
                  — {data.total_results.toLocaleString()} titles
                </span>
              )}
              <button
                onClick={() => setActiveGenre(null)}
                className="ml-auto text-xs text-brand-textSecondary hover:text-brand-danger transition-colors"
              >
                ✕ Clear
              </button>
            </div>

            <MovieGrid
              movies={data?.results}
              loading={loading}
              error={error}
              mediaType={mediaType}
              emptyMessage={`No ${mediaType === 'tv' ? 'series' : 'movies'} found.`}
            />

            <Pagination
              page={page}
              totalPages={data?.total_pages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenresPage;
