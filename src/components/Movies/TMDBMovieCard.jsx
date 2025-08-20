import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { tmdbService } from '../../services/tmdbService';
import './TMDBMovieCard.css';

const TMDBMovieCard = ({ movie }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, movie.id]);

  const fetchUserData = async () => {
    try {
      const [favorites, watchlist] = await Promise.all([
        userService.getFavorites(),
        userService.getWatchlist()
      ]);
      
      setUserFavorites(favorites);
      setUserWatchlist(watchlist);
      
      setIsFavorite(favorites.some(fav => fav.movie_id === movie.id));
      setIsInWatchlist(watchlist.some(item => item.movie_id === movie.id));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        await userService.removeFromFavorites(movie.id);
        setIsFavorite(false);
      } else {
        await userService.addToFavorites(movie);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      if (isInWatchlist) {
        await userService.removeFromWatchlist(movie.id);
        setIsInWatchlist(false);
      } else {
        await userService.addToWatchlist(movie);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const posterUrl = tmdbService.getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className="tmdb-movie-card">
      <div className="movie-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} />
        ) : (
          <div className="no-poster">
            <span>🎬</span>
          </div>
        )}
        
        {movie.vote_average && (
          <div className="rating-badge">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>
        
        {movie.overview && (
          <p className="movie-description">
            {movie.overview.length > 120 
              ? `${movie.overview.substring(0, 120)}...` 
              : movie.overview
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

export default TMDBMovieCard;