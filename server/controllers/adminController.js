import User from '../models/User.js';
import FeaturedContent from '../models/FeaturedContent.js';

// ──────────────────────────────
// DASHBOARD
// ──────────────────────────────

// @route  GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalFeatured = await FeaturedContent.countDocuments();

    // New users in the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Aggregate total saved (myList) items across all users
    const listAgg = await User.aggregate([
      { $project: { count: { $size: { $ifNull: ['$myList', []] } } } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]);
    const totalSavedItems = listAgg[0]?.total || 0;

    // Recent signups
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email avatar role createdAt');

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalFeatured,
      newThisWeek,
      totalSavedItems,
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────
// USER MANAGEMENT
// ──────────────────────────────

// @route  GET /api/admin/users?page=1&q=
export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 20;
    const q = (req.query.q || '').trim();

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "user" or "admin".' });
    }

    if (req.params.id === String(req.user._id) && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own admin access.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.role = role;
    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account here.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────
// FEATURED CONTENT
// ──────────────────────────────

// @route  GET /api/admin/featured
// Also used publicly via /api/movies or homepage — but exposed here for admin management
export const getFeatured = async (req, res, next) => {
  try {
    const featured = await FeaturedContent.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ featured });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/admin/featured
export const addFeatured = async (req, res, next) => {
  try {
    const {
      tmdbId, mediaType = 'movie', title, overview,
      poster_path, backdrop_path, vote_average, release_date, genre_ids,
    } = req.body;

    if (!tmdbId || !title) {
      return res.status(400).json({ message: 'tmdbId and title are required.' });
    }

    const exists = await FeaturedContent.findOne({ tmdbId, mediaType });
    if (exists) {
      return res.status(409).json({ message: 'This title is already featured.' });
    }

    const count = await FeaturedContent.countDocuments();

    const item = await FeaturedContent.create({
      tmdbId, mediaType, title, overview, poster_path, backdrop_path,
      vote_average, release_date, genre_ids, order: count, addedBy: req.user._id,
    });

    res.status(201).json({ item });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This title is already featured.' });
    }
    next(err);
  }
};

// @route  DELETE /api/admin/featured/:id
export const removeFeatured = async (req, res, next) => {
  try {
    const item = await FeaturedContent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Featured item not found.' });
    res.status(200).json({ message: 'Removed from featured.' });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/featured/reorder
// @desc   Accepts an ordered array of featured item IDs and updates their order field
export const reorderFeatured = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds must be an array.' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        FeaturedContent.findByIdAndUpdate(id, { order: index })
      )
    );

    const featured = await FeaturedContent.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ featured });
  } catch (err) {
    next(err);
  }
};
