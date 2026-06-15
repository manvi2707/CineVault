import express from 'express';
import {
  getTrendingTV,
  getPopularTV,
  getTopRatedTV,
  getOnTheAir,
  getAiringToday,
  getTVGenres,
  getTVByGenre,
  searchTV,
  getTVById,
} from '../controllers/tvController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.get('/trending', getTrendingTV);
router.get('/popular', getPopularTV);
router.get('/top-rated', getTopRatedTV);
router.get('/on-the-air', getOnTheAir);
router.get('/airing-today', getAiringToday);
router.get('/genres', getTVGenres);
router.get('/genre/:id', getTVByGenre);
router.get('/search', searchTV);
router.get('/:id', getTVById);

export default router;
