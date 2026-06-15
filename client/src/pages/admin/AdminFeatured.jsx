import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { posterUrl, ratingColor } from '../../utils/tmdb.js';
import { useMultiSearch } from '../../hooks/useMovies.js';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const FeaturedRow = ({ item, index, total, onMove, onRemove }) => {
  const title = item.title;
  const year = item.release_date?.slice(0, 4);
  const poster = posterUrl(item.poster_path, 'w92');

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-brand-surfaceHover/40 border border-brand-border/40">
      <span className="text-xs text-brand-textSecondary w-5 text-center flex-shrink-0">{index + 1}</span>

      <div className="w-10 h-14 rounded overflow-hidden bg-brand-surface flex-shrink-0 border border-brand-border/40">
        {poster
          ? <img src={poster} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-brand-border text-xs">—</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-textPrimary truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-brand-textSecondary uppercase">{item.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          {year && <span className="text-xs text-brand-textSecondary">· {year}</span>}
          {item.vote_average && (
            <span className={`text-xs font-medium ${ratingColor(item.vote_average)}`}>
              ★ {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Reorder buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          className="w-7 h-7 rounded border border-brand-border flex items-center justify-center text-brand-textSecondary
                     hover:text-brand-textPrimary hover:border-brand-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Move up"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          className="w-7 h-7 rounded border border-brand-border flex items-center justify-center text-brand-textSecondary
                     hover:text-brand-textPrimary hover:border-brand-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Move down"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-brand-textSecondary hover:text-brand-danger transition-colors flex-shrink-0"
        aria-label={`Remove ${title} from featured`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const SearchResultRow = ({ item, onAdd, isFeatured, adding }) => {
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date?.slice(0, 4);
  const poster = posterUrl(item.poster_path, 'w92');
  const mediaType = item.media_type;

  if (mediaType !== 'movie' && mediaType !== 'tv') return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-brand-surfaceHover/40 transition-colors">
      <div className="w-10 h-14 rounded overflow-hidden bg-brand-surface flex-shrink-0 border border-brand-border/40">
        {poster
          ? <img src={poster} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-brand-border text-xs">—</div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-brand-textPrimary truncate">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-brand-textSecondary uppercase">{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          {year && <span className="text-xs text-brand-textSecondary">· {year}</span>}
        </div>
      </div>

      <button
        onClick={() => onAdd(item)}
        disabled={isFeatured || adding}
        className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 flex-shrink-0
                   ${isFeatured
                     ? 'border-brand-border text-brand-textSecondary opacity-50 cursor-not-allowed'
                     : 'border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-bg'
                   }`}
      >
        {isFeatured ? 'Added' : 'Add'}
      </button>
    </div>
  );
};

const AdminFeatured = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [addingId, setAddingId] = useState(null);
  const { data: searchData, loading: searchLoading } = useMultiSearch(query);

  const fetchFeatured = useCallback(() => {
    setLoading(true);
    api.get('/admin/featured')
      .then(({ data }) => setFeatured(data.featured))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchFeatured(); }, [fetchFeatured]);

  const isFeatured = (item) =>
    featured.some((f) => f.tmdbId === item.id && f.mediaType === item.media_type);

  const handleAdd = async (item) => {
    setAddingId(item.id);
    try {
      const { data } = await api.post('/admin/featured', {
        tmdbId: item.id,
        mediaType: item.media_type,
        title: item.title || item.name,
        overview: item.overview,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date,
        genre_ids: item.genre_ids || [],
      });
      setFeatured((prev) => [...prev, data.item]);
      toast.success(`Added "${item.title || item.name}" to featured`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/admin/featured/${id}`);
      setFeatured((prev) => prev.filter((f) => f._id !== id));
      toast.success('Removed from featured');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const newOrder = [...featured];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setFeatured(newOrder); // optimistic

    try {
      const { data } = await api.put('/admin/featured/reorder', {
        orderedIds: newOrder.map((f) => f._id),
      });
      setFeatured(data.featured);
    } catch (err) {
      toast.error(err.message);
      fetchFeatured(); // rollback
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Current featured */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-brand-textPrimary">
              Homepage Hero ({featured.length})
            </h2>
          </div>
          <p className="text-xs text-brand-textSecondary mb-4">
            These titles rotate in the homepage hero banner, in this order. If empty, trending movies are shown instead.
          </p>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : featured.length === 0 ? (
            <div className="card-surface p-8 text-center">
              <p className="text-sm text-brand-textSecondary">
                No featured titles yet. Search on the right and click "Add" to feature something.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {featured.map((item, i) => (
                <FeaturedRow
                  key={item._id}
                  item={item}
                  index={i}
                  total={featured.length}
                  onMove={handleMove}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Search to add */}
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-textPrimary mb-4">
            Search to Feature
          </h2>

          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textSecondary"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or series…"
              className="input-field pl-9 py-2.5 text-sm"
            />
          </div>

          <div className="card-surface p-2 min-h-[200px]">
            {!query ? (
              <p className="text-sm text-brand-textSecondary text-center py-12">
                Start typing to search TMDB
              </p>
            ) : searchLoading && !searchData ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : !searchData?.results?.length ? (
              <p className="text-sm text-brand-textSecondary text-center py-12">
                No results for "{query}"
              </p>
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {searchData.results.slice(0, 20).map((item) => (
                  <SearchResultRow
                    key={`${item.media_type}-${item.id}`}
                    item={item}
                    onAdd={handleAdd}
                    isFeatured={isFeatured(item)}
                    adding={addingId === item.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeatured;
