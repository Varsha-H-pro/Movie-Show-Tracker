import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTMDB = String(id || '').startsWith('tmdb_');

  useEffect(() => {
    const load = async () => {
      try {
        // If this is a DB id (UUID), fetch from our API
        if (id && !String(id).startsWith('tmdb_')) {
          const { data } = await api.get(`/movies/${id}`);
          setMovie(data);
          return;
        }

        // Otherwise fetch details from TMDB
        const tmdbId = String(id).replace('tmdb_', '');
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
        if (!apiKey) {
          throw new Error('TMDB API key missing. Set REACT_APP_TMDB_API_KEY in .env and restart.');
        }
        const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);
        if (!res.ok) throw new Error('Failed to fetch movie from TMDB');
        const m = await res.json();
        setMovie({
          id: `tmdb_${m.id}`,
          title: m.title,
          description: m.overview,
          release_year: m.release_date ? m.release_date.split('-')[0] : '',
          genre: (m.genres || []).map(g => g.name).join(', '),
          director: '',
          cast: '',
          rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : null,
          poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          trailer_url: '',
        });
      } catch (e) {
        setError(e.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem' }}>{error}</div>;
  if (!movie) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ minWidth: 300 }}>
          {movie.poster_url ? (
            <img src={movie.poster_url} alt={movie.title} style={{ width: 300, borderRadius: 8 }} />
          ) : (
            <div style={{ width: 300, height: 450, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>🎬</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>{movie.title}</h2>
          <div style={{ color: '#777', marginBottom: 8 }}>
            {movie.release_year} {movie.genre ? `• ${movie.genre}` : ''}
          </div>
          {movie.rating && (
            <div style={{ margin: '8px 0' }}>⭐ {movie.rating}/10</div>
          )}
          {movie.description && (
            <p style={{ lineHeight: 1.6 }}>{movie.description}</p>
          )}

          {user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {/* Favorites */}
              <button
                onClick={async () => {
                  try {
                    if (isTMDB) {
                      alert('Save this movie to your library first to add it to Favorites.');
                      return;
                    }
                    await api.post('/favorites', { movie_id: movie.id });
                    window.dispatchEvent(new Event('lists:changed'));
                  } catch (e) {
                    if (e?.response?.status === 409) {
                      window.dispatchEvent(new Event('lists:changed'));
                    } else {
                      alert('Failed to add to favorites');
                    }
                  }
                }}
              >
                ❤️ Add to Favorites
              </button>

              {/* Watchlist */}
              <button
                onClick={async () => {
                  try {
                    if (isTMDB) {
                      alert('Save this movie to your library first to add it to Watchlist.');
                      return;
                    }
                    await api.post('/watchlist', { movie_id: movie.id });
                    window.dispatchEvent(new Event('lists:changed'));
                  } catch (e) {
                    if (e?.response?.status === 409) {
                      window.dispatchEvent(new Event('lists:changed'));
                    } else {
                      alert('Failed to add to watchlist');
                    }
                  }
                }}
              >
                📝 Add to Watchlist
              </button>

              {/* Save TMDB to Library for Admins */}
              {user.role === 'admin' && isTMDB && (
                <button
                  onClick={async () => {
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
                      const { data } = await api.post('/movies', payload);
                      // Navigate to DB-backed detail page
                      navigate(`/movie/${data.id}`);
                    } catch (e) {
                      alert('Failed to save to library');
                    }
                  }}
                >
                  💾 Save to My Library
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
