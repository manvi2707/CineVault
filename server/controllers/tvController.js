import tmdb from '../utils/tmdb.js';

// GET /api/tv/trending
export const getTrendingTV = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/trending/tv/week');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/popular
export const getPopularTV = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/tv/popular', { params: { page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/top-rated
export const getTopRatedTV = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/tv/top_rated', { params: { page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/on-the-air
export const getOnTheAir = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/tv/on_the_air');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/airing-today
export const getAiringToday = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/tv/airing_today');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/genres
export const getTVGenres = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/genre/tv/list');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/genre/:id
export const getTVByGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/discover/tv', {
      params: { with_genres: id, sort_by: 'popularity.desc', page },
    });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/search?q=...
export const searchTV = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ message: 'Search query is required.' });
    const { data } = await tmdb.get('/search/tv', { params: { query: q.trim(), page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/tv/:id
export const getTVById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [details, credits, videos, similar] = await Promise.all([
      tmdb.get(`/tv/${id}`),
      tmdb.get(`/tv/${id}/credits`),
      tmdb.get(`/tv/${id}/videos`),
      tmdb.get(`/tv/${id}/similar`),
    ]);
    res.json({
      ...details.data,
      credits: credits.data,
      videos: videos.data,
      similar: similar.data,
    });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ message: 'Series not found.' });
    next(err);
  }
};
