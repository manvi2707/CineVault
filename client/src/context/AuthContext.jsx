import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'cinevault_token'; // single source of truth for the key name

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, if a token exists in localStorage, verify it with the backend
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false); // no token, skip the API call entirely
        return;
      }
      try {
        const { data } = await api.get('/auth/me'); // token auto-attached by interceptor
        setUser(data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY); // token invalid/expired, clean up
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem(TOKEN_KEY, data.token); // ← save token
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token); // ← save token
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    localStorage.removeItem(TOKEN_KEY); // ← clear token
    setUser(null);
  }, []);

  const updateProfile = useCallback(async ({ name, avatar }) => {
    const { data } = await api.put('/user/profile', { name, avatar });
    setUser(data.user);
    return data.user;
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const { data } = await api.put('/user/password', { currentPassword, newPassword });
    return data;
  }, []);

  const value = { user, loading, register, login, logout, updateProfile, changePassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};