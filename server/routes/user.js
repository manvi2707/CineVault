import express from 'express';
import {
  updateProfile,
  changePassword,
  getMyList,
  addToMyList,
  removeFromMyList,
} from '../controllers/userController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', changePassword);

router.get('/mylist', getMyList);
router.post('/mylist', addToMyList);
router.delete('/mylist/:movieId', removeFromMyList);

export default router;
