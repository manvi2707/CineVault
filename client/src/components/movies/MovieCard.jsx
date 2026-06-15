import { useNavigate } from 'react-router-dom';
import { posterUrl, ratingColor } from '../../utils/tmdb.js';
import { MyListIconButton } from './MyListButton.jsx';

const PLACEHOLDER = (
  <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surfaceHover gap-2">
    <svg className="w-10 h-10 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
    <span className="text-xs text-brand-border">No image</span>
  </div>
);

const MovieCard = ({ movie, size = 'md', mediaType }) => {
  const navigate = useNavigate();
  if (!movie) return null;

  const { id, poster_path, vote_average } = movie;
  // Support both movie (title/release_date) and TV (name/first_air_date) shapes
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date?.slice(0, 4);
  const rating = vote_average?.toFixed(1);
  const type = mediaType || movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
  const detailPath = type === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  const sizes = {
    sm: 'w-32 sm:w-36',
    md: 'w-36 sm:w-44',
    lg: 'w-44 sm:w-52',
  };

  return (
    <div
      className={`${sizes[size]} flex-shrink-0 group cursor-pointer`}
      onClick={() => navigate(detailPath)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(detailPath)}
      aria-label={`${title} (${year})`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-brand-surface border border-brand-border/30
                      group-hover:border-brand-accent/50 group-hover:scale-[1.03]
                      transition-all duration-300 shadow-lg">
        {poster_path ? (
          <img
            src={posterUrl(poster_path)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : PLACEHOLDER}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex flex-col justify-end p-3">
          <div className="flex items-center gap-1.5 mb-2">
            {/* Play button */}
            <button className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center
                               hover:bg-brand-accentHover transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate(detailPath); }}
              aria-label="View details">
              <svg className="w-4 h-4 text-brand-bg ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {/* My List toggle */}
            <MyListIconButton movie={movie} mediaType={type} />
          </div>
          <p className="text-xs text-brand-textPrimary font-medium leading-tight line-clamp-2">{title}</p>
        </div>

        {/* Media type badge (only show for TV to disambiguate in mixed grids) */}
        {type === 'tv' && (
          <div className="absolute top-2 left-2 bg-brand-accent/90 text-brand-bg px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
            Series
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
            <svg className="w-2.5 h-2.5 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className={ratingColor(vote_average)}>{rating}</span>
          </div>
        )}
      </div>

      {/* Title below */}
      <div className="mt-2 px-0.5">
        <p className="text-xs font-medium text-brand-textSecondary group-hover:text-brand-textPrimary
                      transition-colors line-clamp-1">{title}</p>
        {year && <p className="text-xs text-brand-border mt-0.5">{year}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
