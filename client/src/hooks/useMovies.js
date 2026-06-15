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

// ──────────────────────────────
// MOVIES
// ──────────────────────────────

// Hook: trending movies
export const useTrending = () => useFetch('/movies/trending');

// Hook: homepage rows (movies)
export const useHomeRows = () => {
  const trending = useFetch('/movies/trending');
  const popular = useFetch('/movies/popular');
  const topRated = useFetch('/movies/top-rated');
  const upcoming = useFetch('/movies/upcoming');
  const nowPlaying = useFetch('/movies/now-playing');
  return { trending, popular, topRated, upcoming, nowPlaying };
};

// Hook: genres list (movies)
export const useGenres = () => useFetch('/movies/genres');

// Hook: movies by genre
export const useByGenre = (genreId, page = 1) =>
  useFetch(genreId ? `/movies/genre/${genreId}` : null, { page }, [genreId, page]);

// Hook: single movie detail
export const useMovie = (id) => useFetch(id ? `/movies/${id}` : null, {}, [id]);

// ──────────────────────────────
// TV SERIES
// ──────────────────────────────

// Hook: homepage rows (TV series)
export const useTVHomeRows = () => {
  const trending = useFetch('/tv/trending');
  const popular = useFetch('/tv/popular');
  const topRated = useFetch('/tv/top-rated');
  const onTheAir = useFetch('/tv/on-the-air');
  const airingToday = useFetch('/tv/airing-today');
  return { trending, popular, topRated, onTheAir, airingToday };
};

// Hook: TV genres list
export const useTVGenres = () => useFetch('/tv/genres');

// Hook: TV shows by genre
export const useTVByGenre = (genreId, page = 1) =>
  useFetch(genreId ? `/tv/genre/${genreId}` : null, { page }, [genreId, page]);

// Hook: single TV show detail
export const useTVShow = (id) => useFetch(id ? `/tv/${id}` : null, {}, [id]);

// ──────────────────────────────
// SEARCH
// ──────────────────────────────

// Hook: search movies only (debounced)
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

// Hook: multi-search across movies + TV (debounced)
export const useMultiSearch = (query, page = 1) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || !query.trim()) { setData(null); return; }
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      api.get('/search/multi', { params: { q: query.trim(), page } })
        .then(({ data }) => { if (!cancelled) setData(data); })
        .catch((err) => { if (!cancelled) setError(err.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, page]);

  return { data, loading, error };
};
