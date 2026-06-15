import express from 'express';
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getFeatured,
  addFeatured,
  removeFeatured,
  reorderFeatured,
} from '../controllers/adminController.js';
import { protect } from '../middleware/protect.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/stats', getStats);

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/featured', getFeatured);
router.post('/featured', addFeatured);
router.delete('/featured/:id', removeFeatured);
router.put('/featured/reorder', reorderFeatured);

export default router;
