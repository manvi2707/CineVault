import User from '../models/User.js';

// @route  PUT /api/user/profile
// @desc   Update name and/or avatar
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters.' });
      }
      user.name = name.trim();
    }

    if (avatar !== undefined) {
      const avatarNum = Number(avatar);
      if (Number.isNaN(avatarNum) || avatarNum < 0 || avatarNum > 5) {
        return res.status(400).json({ message: 'Invalid avatar selection.' });
      }
      user.avatar = avatarNum;
    }

    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ message });
    }
    next(err);
  }
};

// @route  PUT /api/user/password
// @desc   Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide your current and new password.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/user/mylist
// @desc   Get current user's saved list
export const getMyList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // Most recently added first
    const list = [...user.myList].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    res.status(200).json({ list });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/user/mylist
// @desc   Add a movie to the list
export const addToMyList = async (req, res, next) => {
  try {
    const { movieId, title, poster_path, vote_average, release_date } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: 'movieId is required.' });
    }

    const user = await User.findById(req.user._id);
    const exists = user.myList.some((m) => m.movieId === movieId);

    if (exists) {
      return res.status(200).json({ list: user.myList, message: 'Already in your list.' });
    }

    user.myList.unshift({ movieId, title, poster_path, vote_average, release_date });
    await user.save();
    res.status(201).json({ list: user.myList, message: 'Added to your list.' });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/user/mylist/:movieId
// @desc   Remove a movie from the list
export const removeFromMyList = async (req, res, next) => {
  try {
    const movieId = Number(req.params.movieId);
    const user = await User.findById(req.user._id);

    user.myList = user.myList.filter((m) => m.movieId !== movieId);
    await user.save();

    res.status(200).json({ list: user.myList, message: 'Removed from your list.' });
  } catch (err) {
    next(err);
  }
};
