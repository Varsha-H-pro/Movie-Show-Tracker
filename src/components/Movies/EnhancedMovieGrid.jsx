import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import EnhancedMovieCard from './EnhancedMovieCard';
import './EnhancedMovieGrid.css';

const EnhancedMovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
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
    <div className="enhanced-movie-grid">
      {movies.map(movie => (
        <EnhancedMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default EnhancedMovieGrid;