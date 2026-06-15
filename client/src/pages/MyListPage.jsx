import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import MovieCard from '../components/movies/MovieCard.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useMyList } from '../context/MyListContext.jsx';

const MyListPage = () => {
  const { list, loading } = useMyList();
  const navigate = useNavigate();

  // Map stored list items into the shape MovieCard expects
  const movies = list.map((item) => {
    const isTV = item.mediaType === 'tv';
    return {
      id: item.movieId,
      mediaType: item.mediaType || 'movie',
      title: !isTV ? item.title : undefined,
      name: isTV ? item.title : undefined,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: !isTV ? item.release_date : undefined,
      first_air_date: isTV ? item.release_date : undefined,
    };
  });

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 bg-brand-accent rounded-full" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-textPrimary">My List</h1>
          {!loading && (
            <span className="text-sm text-brand-textSecondary">
              {movies.length} title{movies.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-brand-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
              </svg>
            </div>
            <p className="text-brand-textPrimary font-medium mb-2">Your list is empty</p>
            <p className="text-brand-textSecondary text-sm mb-6 max-w-sm">
              Tap the bookmark icon on any movie to save it here for later.
            </p>
            <button onClick={() => navigate('/movies')} className="btn-primary px-8">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {movies.map((movie) => (
              <MovieCard key={`${movie.mediaType}-${movie.id}`} movie={movie} mediaType={movie.mediaType} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
