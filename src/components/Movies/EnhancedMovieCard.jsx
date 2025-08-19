import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import './EnhancedMovieCard.css';

const EnhancedMovieCard = ({ movie }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);
        
        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert([{
            user_id: user.id,
            movie_id: movie.id,
            created_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        const { error } = await supabase
          .from('user_watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);
        
        if (error) throw error;
        setIsInWatchlist(false);
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from('user_watchlist')
          .insert([{
            user_id: user.id,
            movie_id: movie.id,
            created_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enhanced-movie-card">
      <div className="movie-poster">
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
        <h3 className="movie-title">{movie.title}</h3>
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
              onClick={handleFavorite}
              disabled={loading}
              className={`action-button favorite ${isFavorite ? 'active' : ''}`}
            >
              {isFavorite ? '❤️' : '🤍'} Favorite
            </button>
            
            <button
              onClick={handleWatchlist}
              disabled={loading}
              className={`action-button watchlist ${isInWatchlist ? 'active' : ''}`}
            >
              {isInWatchlist ? '✅' : '📝'} Watchlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMovieCard;