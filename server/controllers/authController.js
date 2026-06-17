import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: generate JWT and return it in response body
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(statusCode).json({ user, token }); // ← token now in body, no cookie
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill in all fields.' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ message });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please enter your email and password.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password.' });

    user.password = undefined;
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Logout is now handled entirely on the frontend (clear localStorage)
// This route can stay for a clean API, but does nothing server-side
export const logout = (req, res) => {
  res.status(200).json({ message: 'Signed out successfully.' });
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};