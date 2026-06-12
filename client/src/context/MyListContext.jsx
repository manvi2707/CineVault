import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const MyListContext = createContext(null);

export const MyListProvider = ({ children }) => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load list when user logs in
  useEffect(() => {
    if (!user) {
      setList([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.get('/user/mylist')
      .then(({ data }) => { if (!cancelled) setList(data.list || []); })
      .catch(() => { if (!cancelled) setList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const isInList = useCallback(
    (movieId) => list.some((m) => m.movieId === movieId),
    [list]
  );

  const addToList = useCallback(async (movie) => {
    const payload = {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    };
    // Optimistic update
    setList((prev) => [{ ...payload, addedAt: new Date().toISOString() }, ...prev]);
    try {
      const { data } = await api.post('/user/mylist', payload);
      setList(data.list || []);
      toast.success('Added to My List');
    } catch (err) {
      setList((prev) => prev.filter((m) => m.movieId !== movie.id));
      toast.error(err.message);
    }
  }, []);

  const removeFromList = useCallback(async (movieId) => {
    const prevList = list;
    setList((prev) => prev.filter((m) => m.movieId !== movieId));
    try {
      const { data } = await api.delete(`/user/mylist/${movieId}`);
      setList(data.list || []);
      toast.success('Removed from My List');
    } catch (err) {
      setList(prevList);
      toast.error(err.message);
    }
  }, [list]);

  const toggleList = useCallback((movie) => {
    if (isInList(movie.id)) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  }, [isInList, addToList, removeFromList]);

  return (
    <MyListContext.Provider value={{ list, loading, isInList, addToList, removeFromList, toggleList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const ctx = useContext(MyListContext);
  if (!ctx) throw new Error('useMyList must be used within MyListProvider');
  return ctx;
};
