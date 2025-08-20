import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdbService';
import AddMovieForm from './AddMovieForm';
import MovieList from './MovieList';
import './AdminPanel.css';

const AdminPanel = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await tmdbService.getCustomMovies();
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieAdded = (newMovie) => {
    setMovies([newMovie, ...movies]);
  };

  const handleMovieDeleted = (movieId) => {
    setMovies(movies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage movies and content</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Movie
        </button>
        <button
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Movies
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'add' && (
          <AddMovieForm onMovieAdded={handleMovieAdded} />
        )}
        {activeTab === 'manage' && (
          <MovieList
            movies={movies}
            loading={loading}
            onMovieDeleted={handleMovieDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;