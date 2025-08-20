import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdbService';
import TMDBMovieCard from './TMDBMovieCard';
import './TMDBMovieGrid.css';

const TMDBMovieGrid = ({ searchQuery = '' }) => {
  const [movies, setMovies] = useState([]);
  const [customMovies, setCustomMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
    fetchCustomMovies();
  }, [searchQuery, page]);

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      if (searchQuery.trim()) {
        response = await tmdbService.searchMovies(searchQuery, page);
      } else {
        response = await tmdbService.getPopularMovies(page);
      }
      
      setMovies(response.results || []);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies from TMDB');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomMovies = async () => {
    try {
      const customMoviesData = await tmdbService.getCustomMovies();
      setCustomMovies(customMoviesData);
    } catch (error) {
      console.error('Error fetching custom movies:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && page === 1) {
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

  const allMovies = [...customMovies, ...movies];

  if (allMovies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎬</div>
        <h3>No movies found</h3>
        <p>{searchQuery ? `No results for "${searchQuery}"` : 'No movies available'}</p>
      </div>
    );
  }

  return (
    <div className="tmdb-movie-grid-container">
      {customMovies.length > 0 && !searchQuery && (
        <div className="custom-movies-section">
          <h3 className="section-title">Featured Movies</h3>
          <div className="tmdb-movie-grid">
            {customMovies.map(movie => (
              <TMDBMovieCard 
                key={`custom-${movie.id}`} 
                movie={{
                  ...movie,
                  poster_path: movie.poster_url?.replace('https://image.tmdb.org/t/p/w500', ''),
                  release_date: `${movie.release_year}-01-01`,
                  vote_average: movie.rating,
                  overview: movie.description
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <div className="tmdb-movies-section">
          <h3 className="section-title">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          </h3>
          <div className="tmdb-movie-grid">
            {movies.map(movie => (
              <TMDBMovieCard key={`tmdb-${movie.id}`} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="pagination-button"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TMDBMovieGrid;