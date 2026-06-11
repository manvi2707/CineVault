import axios from 'axios';

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY },
  timeout: 15000,  // increase timeout
});

// Add retry interceptor
tmdb.interceptors.response.use(null, async (error) => {
  if (error.config && !error.config.__retried) {
    error.config.__retried = true;
    await new Promise(res => setTimeout(res, 1000)); // wait 1s
    return tmdb(error.config);
  }
  return Promise.reject(error);
});

export default tmdb;