import express from 'express';
import {
  getFeatured,
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getNowPlaying,
  getGenres,
  getByGenre,
  searchMovies,
  getMovieById,
} from '../controllers/moviesController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// All movie routes require auth
router.use(protect);

router.get('/featured', getFeatured);
router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/upcoming', getUpcoming);
router.get('/now-playing', getNowPlaying);
router.get('/genres', getGenres);
router.get('/genre/:id', getByGenre);
router.get('/search', searchMovies);
router.get('/:id', getMovieById);

export default router;
