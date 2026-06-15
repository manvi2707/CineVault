import tmdb from '../utils/tmdb.js';

// GET /api/search/multi?q=...
// Returns combined movie + tv results, each tagged with media_type
export const searchMulti = async (req, res, next) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ message: 'Search query is required.' });

    const { data } = await tmdb.get('/search/multi', { params: { query: q.trim(), page } });

    // Filter out people — keep only movies and tv shows
    const results = (data.results || []).filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    res.json({ ...data, results });
  } catch (err) { next(err); }
};
