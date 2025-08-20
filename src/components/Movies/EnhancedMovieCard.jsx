import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './EnhancedMovieCard.css';

const EnhancedMovieCard = ({ movie, onSaved, initialFavorite = false, initialWatchlist = false }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isInWatchlist, setIsInWatchlist] = useState(initialWatchlist);
  const [loading, setLoading] = useState(false);
  const isFromTMDB = typeof movie.id === 'string' && movie.id.startsWith('tmdb_');
  const navigate = useNavigate();

  const handleFavorite = async () => {
    if (!user) return;
    if (isFromTMDB) {
      alert('Save this movie to your library first to add it to Favorites.');
      return;
    }
    
    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${movie.id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { movie_id: movie.id });
        setIsFavorite(true);
      }
      window.dispatchEvent(new Event('lists:changed'));
    } catch (error) {
      if (error?.response?.status === 409) {
        setIsFavorite(true);
        window.dispatchEvent(new Event('lists:changed'));
      } else {
        console.error('Error updating favorites:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    if (!user) return;
    if (isFromTMDB) {
      alert('Save this movie to your library first to add it to Watchlist.');
      return;
    }
    
    setLoading(true);
    try {
      if (isInWatchlist) {
        await api.delete(`/watchlist/${movie.id}`);
        setIsInWatchlist(false);
      } else {
        await api.post('/watchlist', { movie_id: movie.id });
        setIsInWatchlist(true);
      }
      window.dispatchEvent(new Event('lists:changed'));
    } catch (error) {
      if (error?.response?.status === 409) {
        setIsInWatchlist(true);
        window.dispatchEvent(new Event('lists:changed'));
      } else {
        console.error('Error updating watchlist:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const payload = {
        title: movie.title,
        description: movie.description || '',
        release_year: movie.release_year ? parseInt(movie.release_year) : null,
        genre: movie.genre || '',
        director: movie.director || '',
        cast: movie.cast || '',
        rating: typeof movie.rating === 'number' ? movie.rating : null,
        poster_url: movie.poster_url || '',
        trailer_url: movie.trailer_url || '',
      };
      await api.post('/movies', payload);
      if (onSaved) onSaved();
    } catch (error) {
      console.error('Error saving movie to library:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enhanced-movie-card">
      <div className="movie-poster" onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>
        {movie.poster_url ? (
          <img src={movie.poster_url} alt={movie.title} />
        ) : (
          <div className="no-poster">
            <span>🎬</span>
          </div>
        )}
        
        {movie.rating && (
          <div className="rating-badge">
            ⭐ {movie.rating}
          </div>
        )}
      </div>
      
      <div className="movie-content">
        <h3 className="movie-title" onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>{movie.title}</h3>
        <p className="movie-year">{movie.release_year}</p>
        {movie.genre && <p className="movie-genre">{movie.genre}</p>}
        
        {movie.description && (
          <p className="movie-description">
            {movie.description.length > 100 
              ? `${movie.description.substring(0, 100)}...` 
              : movie.description
            }
          </p>
        )}
        
        {user && (
          <div className="movie-actions">
            <button
              onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
              disabled={loading}
              className={`action-button favorite ${isFavorite ? 'active' : ''}`}
            >
              {isFavorite ? '❤️' : '🤍'} Favorite
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleWatchlist(); }}
              disabled={loading}
              className={`action-button watchlist ${isInWatchlist ? 'active' : ''}`}
            >
              {isInWatchlist ? '✅' : '📝'} Watchlist
            </button>

            {user.role === 'admin' && isFromTMDB && (
              <button
                onClick={(e) => { e.stopPropagation(); handleSaveToLibrary(); }}
                disabled={loading}
                className="action-button"
              >
                💾 Save to My Library
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMovieCard;