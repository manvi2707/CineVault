import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backdropUrl, posterUrl } from '../../utils/tmdb.js';

const HeroBanner = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const featured = movies.slice(0, 6);
  const movie = featured[current];

  // Auto-rotate every 7s
  useEffect(() => {
    if (featured.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % featured.length);
        setFading(false);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const goTo = (idx) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 300);
  };

  if (!movie) {
    return <div className="h-[70vh] bg-brand-surface animate-pulse" />;
  }

  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path, 'w342');
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const overview = movie.overview?.length > 200
    ? movie.overview.slice(0, 200) + '…'
    : movie.overview;

  return (
    <section className="relative h-[75vh] min-h-[500px] overflow-hidden">
      {/* Backdrop image */}
      {backdrop && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg/30" />

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-10 max-w-3xl">
            {/* Poster thumbnail — desktop only */}
            {poster && (
              <div className="hidden lg:block flex-shrink-0">
                <img
                  src={poster}
                  alt={movie.title}
                  className="w-36 rounded-xl shadow-2xl border border-brand-border/30"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-brand-accent uppercase tracking-[0.2em]">
                  Featured Film
                </span>
                {year && (
                  <>
                    <span className="text-brand-border">·</span>
                    <span className="text-xs text-brand-textSecondary">{year}</span>
                  </>
                )}
                {rating && (
                  <>
                    <span className="text-brand-border">·</span>
                    <span className="flex items-center gap-1 text-xs text-brand-accent font-semibold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {rating}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-textPrimary
                             leading-[1.05] mb-4 drop-shadow-lg">
                {movie.title}
              </h1>

              {/* Overview */}
              <p className="text-brand-textSecondary text-base leading-relaxed mb-8 max-w-xl drop-shadow">
                {overview}
              </p>

              {/* Genres */}
              {movie.genre_ids?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {movie.genre_ids.slice(0, 3).map((gid) => (
                    <span key={gid} className="text-xs border border-brand-border/60 text-brand-textSecondary
                                               px-3 py-1 rounded-full">
                      Genre {gid}
                    </span>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="btn-primary flex items-center gap-2 px-7 py-3"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  View Details
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-brand-border
                             text-brand-textSecondary hover:text-brand-textPrimary hover:border-brand-accent
                             transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-6 h-1.5 bg-brand-accent'
                  : 'w-1.5 h-1.5 bg-brand-border hover:bg-brand-textSecondary'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg to-transparent" />
    </section>
  );
};

export default HeroBanner;
