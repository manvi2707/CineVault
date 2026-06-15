import tmdb from '../utils/tmdb.js';
import FeaturedContent from '../models/FeaturedContent.js';

// GET /api/movies/featured
// Public (protected by login only) - returns admin-curated hero content
export const getFeatured = async (req, res, next) => {
  try {
    const featured = await FeaturedContent.find().sort({ order: 1, createdAt: -1 });
    res.json({ results: featured.map((f) => ({
      id: f.tmdbId,
      media_type: f.mediaType,
      title: f.title,
      name: f.title,
      overview: f.overview,
      poster_path: f.poster_path,
      backdrop_path: f.backdrop_path,
      vote_average: f.vote_average,
      release_date: f.release_date,
      first_air_date: f.mediaType === 'tv' ? f.release_date : undefined,
      genre_ids: f.genre_ids || [],
    })) });
  } catch (err) { next(err); }
};

// GET /api/movies/trending
export const getTrending = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/trending/movie/week');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/popular
export const getPopular = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/movie/popular', { params: { page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/top-rated
export const getTopRated = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/movie/top_rated', { params: { page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/upcoming
export const getUpcoming = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/movie/upcoming');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/now-playing
export const getNowPlaying = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/movie/now_playing');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/genres
export const getGenres = async (req, res, next) => {
  try {
    const { data } = await tmdb.get('/genre/movie/list');
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/genre/:id
export const getByGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: id, sort_by: 'popularity.desc', page },
    });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/search?q=...
export const searchMovies = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ message: 'Search query is required.' });
    const { data } = await tmdb.get('/search/movie', { params: { query: q.trim(), page } });
    res.json(data);
  } catch (err) { next(err); }
};

// GET /api/movies/:id
export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [details, credits, videos, similar] = await Promise.all([
      tmdb.get(`/movie/${id}`, { params: { append_to_response: 'release_dates' } }),
      tmdb.get(`/movie/${id}/credits`),
      tmdb.get(`/movie/${id}/videos`),
      tmdb.get(`/movie/${id}/similar`),
    ]);
    res.json({
      ...details.data,
      credits: credits.data,
      videos: videos.data,
      similar: similar.data,
    });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ message: 'Movie not found.' });
    next(err);
  }
};
