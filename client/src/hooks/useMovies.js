import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';

// Generic fetch hook
export const useFetch = (url, params = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.get(url, { params })
      .then(({ data }) => { if (!cancelled) setData(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, loading, error };
};

// Hook: trending movies
export const useTrending = () => useFetch('/movies/trending');

// Hook: homepage rows
export const useHomeRows = () => {
  const trending = useFetch('/movies/trending');
  const popular = useFetch('/movies/popular');
  const topRated = useFetch('/movies/top-rated');
  const upcoming = useFetch('/movies/upcoming');
  const nowPlaying = useFetch('/movies/now-playing');
  return { trending, popular, topRated, upcoming, nowPlaying };
};

// Hook: genres list
export const useGenres = () => useFetch('/movies/genres');

// Hook: movies by genre
export const useByGenre = (genreId, page = 1) =>
  useFetch(genreId ? `/movies/genre/${genreId}` : null, { page }, [genreId, page]);

// Hook: single movie detail
export const useMovie = (id) => useFetch(id ? `/movies/${id}` : null, {}, [id]);

// Hook: search with debounce
export const useSearch = (query, page = 1) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || !query.trim()) { setData(null); return; }
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      api.get('/movies/search', { params: { q: query.trim(), page } })
        .then(({ data }) => { if (!cancelled) setData(data); })
        .catch((err) => { if (!cancelled) setError(err.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, page]);

  return { data, loading, error };
};
