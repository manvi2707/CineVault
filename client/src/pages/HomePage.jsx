import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import HeroBanner from '../components/movies/HeroBanner.jsx';
import MovieRow from '../components/movies/MovieRow.jsx';
import { useHomeRows, useFetch } from '../hooks/useMovies.js';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trending, popular, topRated, upcoming, nowPlaying } = useHomeRows();
  const popularTV = useFetch('/tv/popular');
  const featured = useFetch('/movies/featured');

  const heroMovies = featured.data?.results?.length
    ? featured.data.results
    : trending.data?.results || [];

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* Hero */}
      <HeroBanner movies={heroMovies} />

      {/* Movie rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MovieRow
          title="Trending This Week"
          movies={trending.data?.results}
          loading={trending.loading}
          error={trending.error}
          seeAllPath="/movies"
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying.data?.results}
          loading={nowPlaying.loading}
          error={nowPlaying.error}
        />
        <MovieRow
          title="Popular Series"
          movies={popularTV.data?.results}
          loading={popularTV.loading}
          error={popularTV.error}
          seeAllPath="/series"
          mediaType="tv"
        />
        <MovieRow
          title="Popular Movies"
          movies={popular.data?.results}
          loading={popular.loading}
          error={popular.error}
          seeAllPath="/movies"
        />
        <MovieRow
          title="Top Rated"
          movies={topRated.data?.results}
          loading={topRated.loading}
          error={topRated.error}
          seeAllPath="/movies?sort=top-rated"
        />
        <MovieRow
          title="Coming Soon"
          movies={upcoming.data?.results}
          loading={upcoming.loading}
          error={upcoming.error}
        />
      </div>
    </div>
  );
};

export default HomePage;
