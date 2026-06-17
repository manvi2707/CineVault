import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import MovieGrid from '../components/movies/MovieGrid.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useMultiSearch } from '../hooks/useMovies.js';
import usePageTitle from '../hooks/usePageTitle.js';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  usePageTitle('Search', 'Search movies and series on CineVault.');
  const [query, setQuery] = useState(initialQ);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useMultiSearch(query, page);

  const handleInput = (e) => {
    setQuery(e.target.value);
    setPage(1);
    if (e.target.value) {
      setSearchParams({ q: e.target.value });
    } else {
      setSearchParams({});
    }
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
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-textPrimary">Search</h1>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mb-10">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-textSecondary">
            {loading && query
              ? <Spinner size="sm" />
              : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
                </svg>
              )
            }
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search for movies, series, titles…"
            autoFocus
            className="w-full bg-brand-surface text-brand-textPrimary placeholder-brand-textSecondary
                       pl-12 pr-12 py-4 rounded-xl border border-brand-border
                       focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent
                       text-base transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSearchParams({}); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-textSecondary hover:text-brand-textPrimary transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Empty state */}
        {!query && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-brand-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
              </svg>
            </div>
            <p className="text-brand-textSecondary">Type a title, genre, or keyword to begin</p>
          </div>
        )}

        {/* Results */}
        {query && (
          <>
            {data?.total_results !== undefined && (
              <p className="text-sm text-brand-textSecondary mb-6">
                {data.total_results === 0
                  ? `No results for "${query}"`
                  : `${data.total_results.toLocaleString()} results for "${query}"`
                }
              </p>
            )}

            <MovieGrid
              movies={data?.results}
              loading={loading && !data}
              error={error}
              emptyMessage={`No results found for "${query}"`}
            />

            <Pagination
              page={page}
              totalPages={data?.total_pages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
