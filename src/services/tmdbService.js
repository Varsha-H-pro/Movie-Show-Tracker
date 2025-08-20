import api from '../config/api';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const tmdbService = {
  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await api.get(`/movies/tmdb/popular?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch popular movies');
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await api.get(`/movies/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search movies');
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await api.get(`/movies/tmdb/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch movie details');
    }
  },

  // Get full poster URL
  getPosterUrl: (posterPath) => {
    return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null;
  },

  // Get custom movies (admin added)
  getCustomMovies: async () => {
    try {
      const response = await api.get('/movies/custom');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch custom movies');
    }
  },

  // Add custom movie (admin only)
  addCustomMovie: async (movieData) => {
    try {
      const response = await api.post('/movies/custom', movieData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add movie');
    }
  },

  // Delete custom movie (admin only)
  deleteCustomMovie: async (movieId) => {
    try {
      const response = await api.delete(`/movies/custom/${movieId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete movie');
    }
  },
};