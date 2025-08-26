import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import AddMovieForm from './AddMovieForm';
import MovieList from './MovieList';
import './AdminPanel.css';

const AdminPanel = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await api.get('/movies');
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

  const handleImportTMDB = async () => {
    setImporting(true);
    setImportError('');
    try {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      if (!apiKey) {
        throw new Error('TMDB API key missing. Set REACT_APP_TMDB_API_KEY in .env and restart the frontend server.');
      }
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
      if (!res.ok) throw new Error('Failed to fetch popular movies from TMDB');
      const json = await res.json();
      const results = Array.isArray(json.results) ? json.results : [];

      // Fetch genre list once and build an id->name map
      let genreIdToName = new Map();
      try {
        const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        if (genreRes.ok) {
          const { genres } = await genreRes.json();
          if (Array.isArray(genres)) {
            for (const g of genres) {
              if (g && typeof g.id === 'number' && g.name) {
                genreIdToName.set(g.id, g.name);
              }
            }
          }
        }
      } catch (_) {
        // ignore genre fetch errors, fallback to empty genre
      }

      const createdMovies = [];
      for (const m of results) {
        // Attempt to fetch a YouTube trailer link for this movie
        let trailerUrl = '';
        try {
          const vids = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${apiKey}&language=en-US`);
          if (vids.ok) {
            const vjson = await vids.json();
            const videos = Array.isArray(vjson.results) ? vjson.results : [];
            const preferred = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
                              videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
                              videos.find(v => v.site === 'YouTube');
            if (preferred?.key) {
              trailerUrl = `https://www.youtube.com/watch?v=${preferred.key}`;
            }
          }
        } catch (_) {
          // ignore trailer errors
        }

        const payload = {
          title: m.title,
          description: m.overview || '',
          release_year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
          genre: Array.isArray(m.genre_ids) && m.genre_ids.length
            ? m.genre_ids.map((gid) => genreIdToName.get(gid)).filter(Boolean).join(', ')
            : '',
          director: '',
          cast: '',
          rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : null,
          poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          trailer_url: trailerUrl,
        };
        try {
          const { data } = await api.post('/movies', payload);
          if (data) createdMovies.push(data);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to add movie to DB:', m?.title, err);
        }
      }

      if (createdMovies.length > 0) {
        setMovies((prev) => [...createdMovies, ...prev]);
      }
    } catch (e) {
      setImportError(e.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage movies and content</p>
        <div>
          <button
            className="tab-button"
            onClick={handleImportTMDB}
            disabled={importing}
          >
            {importing ? 'Importing from TMDB...' : 'Import Popular from TMDB'}
          </button>
        </div>
      </div>

      {importError && (
        <div className="error-message" style={{ margin: '0 1rem' }}>
          {importError}
        </div>
      )}

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