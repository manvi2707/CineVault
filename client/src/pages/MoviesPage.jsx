import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import MovieGrid from '../components/movies/MovieGrid.jsx';
import GenreFilter from '../components/movies/GenreFilter.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { useFetch, useByGenre, useGenres } from '../hooks/useMovies.js';
import usePageTitle from '../hooks/usePageTitle.js';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'now-playing', label: 'Now Playing' },
];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  usePageTitle('Movies', 'Browse thousands of movies by popularity, rating, and genre on CineVault.');
  const [selectedGenre, setSelectedGenre] = useState(null);

  const sort = searchParams.get('sort') || 'popular';
  const { data: genresData } = useGenres();

  // Fetch by genre or by sort
  const sortFetch = useFetch(
    selectedGenre ? null : `/movies/${sort}`,
    { page },
    [sort, page, selectedGenre]
  );
  const genreFetch = useByGenre(selectedGenre, page);

  const { data, loading, error } = selectedGenre ? genreFetch : sortFetch;

  const handleSort = (val) => {
    setSearchParams({ sort: val });
    setPage(1);
    setSelectedGenre(null);
  };

  const handleGenre = (id) => {
    setSelectedGenre(id);
    setPage(1);
  };

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 bg-brand-accent rounded-full" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-textPrimary">Movies</h1>
        </div>

        {/* Sort tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                sort === opt.value && !selectedGenre
                  ? 'bg-brand-accent text-brand-bg'
                  : 'border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Genre filter */}
        {genresData?.genres && (
          <div className="mb-8">
            <GenreFilter
              genres={genresData.genres}
              selected={selectedGenre}
              onSelect={handleGenre}
            />
          </div>
        )}

        {/* Results count */}
        {data?.total_results && (
          <p className="text-sm text-brand-textSecondary mb-6">
            {data.total_results.toLocaleString()} titles
            {selectedGenre && genresData?.genres && (
              <> in <span className="text-brand-accent">
                {genresData.genres.find(g => g.id === selectedGenre)?.name}
              </span></>
            )}
          </p>
        )}

        {/* Grid */}
        <MovieGrid
          movies={data?.results}
          loading={loading}
          error={error}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={data?.total_pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MoviesPage;
