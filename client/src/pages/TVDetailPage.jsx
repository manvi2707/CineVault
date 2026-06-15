import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import MovieRow from '../components/movies/MovieRow.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { useTVShow } from '../hooks/useMovies.js';
import { MyListButton } from '../components/movies/MyListButton.jsx';
import { backdropUrl, posterUrl, formatRuntime, ratingColor } from '../utils/tmdb.js';

const Badge = ({ children }) => (
  <span className="text-xs border border-brand-border text-brand-textSecondary px-3 py-1 rounded-full">
    {children}
  </span>
);

const CastCard = ({ person }) => (
  <div className="flex-shrink-0 w-24 text-center">
    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-brand-surface border border-brand-border mb-2">
      {person.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
          alt={person.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-brand-border">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
          </svg>
        </div>
      )}
    </div>
    <p className="text-xs font-medium text-brand-textPrimary leading-tight line-clamp-2">{person.name}</p>
    <p className="text-xs text-brand-textSecondary mt-0.5 line-clamp-1">{person.character}</p>
  </div>
);

const SeasonCard = ({ season }) => {
  const poster = posterUrl(season.poster_path, 'w185');
  return (
    <div className="flex-shrink-0 w-32">
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-brand-surface border border-brand-border/40 mb-2">
        {poster
          ? <img src={poster} alt={season.name} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-brand-border text-xs">No Image</div>
        }
      </div>
      <p className="text-xs font-medium text-brand-textPrimary line-clamp-1">{season.name}</p>
      <p className="text-xs text-brand-textSecondary mt-0.5">
        {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
        {season.air_date && ` · ${season.air_date.slice(0, 4)}`}
      </p>
    </div>
  );
};

const TVDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: show, loading, error } = useTVShow(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <p className="text-brand-textSecondary mb-6">{error || 'Series not found.'}</p>
          <button onClick={() => navigate('/series')} className="btn-primary">Browse Series</button>
        </div>
      </div>
    );
  }

  const backdrop = backdropUrl(show.backdrop_path);
  const poster = posterUrl(show.poster_path, 'w500');
  const year = show.first_air_date?.slice(0, 4);
  const endYear = show.last_air_date?.slice(0, 4);
  const yearRange = show.status === 'Ended' && endYear && endYear !== year
    ? `${year}–${endYear}`
    : show.status === 'Ended' ? year : `${year}–`;
  const episodeRuntime = show.episode_run_time?.[0] ? formatRuntime(show.episode_run_time[0]) : null;
  const rating = show.vote_average?.toFixed(1);
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const creators = show.created_by || [];
  const seasons = (show.seasons || []).filter(s => s.season_number > 0);

  // Find a YouTube trailer
  const trailer = show.videos?.results?.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* Hero backdrop */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {backdrop && (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${backdrop})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/40" />

        {/* Back button */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-brand-textSecondary hover:text-brand-textPrimary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Poster */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <div className="w-48 sm:w-56 lg:w-64 rounded-2xl overflow-hidden border border-brand-border/40 shadow-2xl shadow-black/60">
              {poster
                ? <img src={poster} alt={show.name} className="w-full h-full object-cover" />
                : <div className="aspect-[2/3] bg-brand-surface flex items-center justify-center text-brand-border">No Image</div>
              }
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-textPrimary leading-tight mb-3">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-brand-accent text-sm italic mb-4">"{show.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge>Series</Badge>
              {yearRange && <Badge>{yearRange}</Badge>}
              {episodeRuntime && <Badge>{episodeRuntime}/ep</Badge>}
              {show.number_of_seasons && (
                <Badge>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</Badge>
              )}
              {show.status && <Badge>{show.status}</Badge>}
              {show.genres?.map(g => <Badge key={g.id}>{g.name}</Badge>)}
            </div>

            {/* Rating + vote count */}
            <div className="flex items-center gap-4 mb-6">
              {rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-brand-surface border border-brand-border px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className={`font-bold font-display text-lg ${ratingColor(show.vote_average)}`}>{rating}</span>
                    <span className="text-xs text-brand-textSecondary">/10</span>
                  </div>
                  <span className="text-xs text-brand-textSecondary">
                    {show.vote_count?.toLocaleString()} votes
                  </span>
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-brand-textSecondary leading-relaxed mb-8 max-w-2xl">
              {show.overview || 'No overview available.'}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}
              <MyListButton movie={show} mediaType="tv" />
            </div>

            {/* Creator info */}
            {creators.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-xs text-brand-textSecondary uppercase tracking-wider mb-1">
                    Creator{creators.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-brand-textPrimary font-medium">
                    {creators.map(c => c.name).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-brand-accent rounded-full" />
              <h2 className="font-display text-xl font-semibold text-brand-textPrimary">Seasons</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {seasons.map(season => <SeasonCard key={season.id} season={season} />)}
            </div>
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-brand-accent rounded-full" />
              <h2 className="font-display text-xl font-semibold text-brand-textPrimary">Cast</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {cast.map(person => <CastCard key={person.cast_id ?? person.id} person={person} />)}
            </div>
          </div>
        )}

        {/* Similar series */}
        {show.similar?.results?.length > 0 && (
          <div className="mt-14">
            <MovieRow
              title="You Might Also Like"
              movies={show.similar.results}
              loading={false}
              mediaType="tv"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TVDetailPage;
