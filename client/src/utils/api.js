import axios from 'axios';

// In dev, Vite's proxy forwards /api to localhost:5000 (see vite.config.js).
// In production, there's no dev server to proxy — so we point straight at
// the deployed backend URL via an env var set at build time on Vercel.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for consistent error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
