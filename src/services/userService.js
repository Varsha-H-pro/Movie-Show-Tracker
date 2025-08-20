import api from '../config/api';

export const userService = {
  // Favorites
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch favorites');
    }
  },

  addToFavorites: async (movie) => {
    try {
      const response = await api.post('/favorites', {
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to favorites');
    }
  },

  removeFromFavorites: async (movieId) => {
    try {
      const response = await api.delete(`/favorites/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove from favorites');
    }
  },

  // Watchlist
  getWatchlist: async () => {
    try {
      const response = await api.get('/watchlist');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch watchlist');
    }
  },

  addToWatchlist: async (movie) => {
    try {
      const response = await api.post('/watchlist', {
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to watchlist');
    }
  },

  removeFromWatchlist: async (movieId) => {
    try {
      const response = await api.delete(`/watchlist/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove from watchlist');
    }
  },
};