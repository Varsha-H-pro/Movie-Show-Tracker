import React from 'react';
import api from '../../config/api';

const MovieList = ({ movies, loading, onMovieDeleted }) => {
  const handleDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    try {
      await api.delete(`/movies/${movieId}`);
      onMovieDeleted(movieId);
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Error deleting movie');
    }
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movie-list">
      <h2>Manage Movies ({movies.length})</h2>
      
      {movies.length === 0 ? (
        <p className="no-movies">No movies found. Add some movies to get started!</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <div className="movie-poster">
                {movie.poster_url ? (
                  <img src={movie.poster_url} alt={movie.title} />
                ) : (
                  <div className="no-poster">No Poster</div>
                )}
              </div>
              
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-year">{movie.release_year}</p>
                <p className="movie-genre">{movie.genre}</p>
                {movie.rating && (
                  <p className="movie-rating">⭐ {movie.rating}/10</p>
                )}
                
                <div className="movie-actions">
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;