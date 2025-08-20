import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import EnhancedMovieCard from './EnhancedMovieCard';
import './EnhancedMovieGrid.css';

const EnhancedMovieGrid = ({ searchTerm = '' }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const initialSource = user ? 'db' : 'tmdb';
  const [source, setSource] = useState(initialSource); // 'db' | 'tmdb'
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  useEffect(() => {
    // If auth state changes, adjust default source
    setSource(user ? 'db' : 'tmdb');
  }, [user]);

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, user]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) {
        setFavoriteIds(new Set());
        setWatchlistIds(new Set());
        return;
      }
      try {
        const [favRes, watchRes] = await Promise.all([
          api.get('/favorites'),
          api.get('/watchlist'),
        ]);
        const favIds = new Set((favRes.data || []).map((m) => m.id));
        const watchIds = new Set((watchRes.data || []).map((m) => m.id));
        setFavoriteIds(favIds);
        setWatchlistIds(watchIds);
      } catch (e) {
        // ignore silently
      }
    };
    loadLists();
  }, [user]);

  const fetchMovies = async () => {
    try {
      // Load from DB when source is 'db' and user is logged in
      if (source === 'db' && user) {
        const { data } = await api.get('/movies', { params: { q: searchTerm || undefined } });
        setMovies(data || []);
        return;
      }

      // Otherwise, show popular movies from TMDB using the public API key
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      if (!apiKey) {
        setError('TMDB API key missing. Set REACT_APP_TMDB_API_KEY in .env');
        return;
      }
      const endpoint = searchTerm
        ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&query=${encodeURIComponent(searchTerm)}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch TMDB');
      const json = await res.json();
      const mapped = (json.results || []).map((m) => ({
        id: `tmdb_${m.id}`,
        title: m.title,
        description: m.overview,
        release_year: m.release_date ? m.release_date.split('-')[0] : '',
        genre: '',
        director: '',
        cast: '',
        rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : null,
        poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
        trailer_url: '',
      }));
      setMovies(mapped);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedToLibrary = () => {
    // Optionally, when saving from TMDB, you could switch to DB view or show a toast.
    // For now we keep the current TMDB list in place.
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchMovies} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎬</div>
        <h3>No movies available</h3>
        <p>Check back later for new releases!</p>
      </div>
    );
  }

  return (
    <>
      {user?.role === 'admin' && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0 0 12px 0' }}>
          <span style={{ fontWeight: 600 }}>Source:</span>
          <button
            className={`tab-button ${source === 'db' ? 'active' : ''}`}
            onClick={() => setSource('db')}
          >
            My Library
          </button>
          <button
            className={`tab-button ${source === 'tmdb' ? 'active' : ''}`}
            onClick={() => setSource('tmdb')}
          >
            TMDB Popular
          </button>
        </div>
      )}

      <div className="enhanced-movie-grid">
        {movies.map(movie => (
          <EnhancedMovieCard
            key={movie.id}
            movie={movie}
            onSaved={handleSavedToLibrary}
            initialFavorite={favoriteIds.has(movie.id)}
            initialWatchlist={watchlistIds.has(movie.id)}
          />
        ))}
      </div>
    </>
  );
};

export default EnhancedMovieGrid;