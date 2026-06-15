import express from 'express';
import { searchMulti } from '../controllers/searchController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);
router.get('/multi', searchMulti);

export default router;
