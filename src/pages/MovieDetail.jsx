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
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });

  const extractYouTubeId = (urlOrId) => {
    if (!urlOrId) return '';
    // If input looks like a bare key (TMDB video key)
    if (/^[a-zA-Z0-9_-]{6,}$/.test(urlOrId) && !/http/i.test(urlOrId)) return urlOrId;
    try {
      const url = new URL(urlOrId);
      if (url.hostname.includes('youtu.be')) {
        return url.pathname.replace('/', '');
      }
      if (url.hostname.includes('youtube.com')) {
        return url.searchParams.get('v') || '';
      }
    } catch (_) {
      // not a URL, return empty
    }
    return '';
  };

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

        // Fetch trailer (videos)
        let trailerUrl = '';
        try {
          const vids = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${apiKey}&language=en-US`);
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
          // ignore trailer errors silently
        }

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
          trailer_url: trailerUrl,
        });
      } catch (e) {
        setError(e.message || 'Failed to load movie');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        if (!id || String(id).startsWith('tmdb_')) return;
        const { data } = await api.get(`/reviews/movie/${id}`);
        setReviews(data.reviews || []);
        setAvgRating(data.aggregates?.avgRating ?? null);
      } catch (_) {}
    };
    loadReviews();
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
          {avgRating && (
            <div style={{ margin: '8px 0' }}>User Rating: ⭐ {avgRating}/10</div>
          )}
          {movie.description && (
            <p style={{ lineHeight: 1.6 }}>{movie.description}</p>
          )}

          {movie.trailer_url && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: '12px 0' }}>Trailer</h3>
              {extractYouTubeId(movie.trailer_url) ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8 }}>
                  <iframe
                    title="Trailer"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(movie.trailer_url)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <a href={movie.trailer_url} target="_blank" rel="noreferrer" style={{ color: '#667eea' }}>
                  Watch Trailer
                </a>
              )}
            </div>
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

          {/* Reviews Section (DB movies only) */}
          {!isTMDB && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {reviews.length === 0 && <div style={{ color: '#666' }}>No reviews yet.</div>}
                {reviews.map((r) => (
                  <div key={r.id} style={{ background: '#f7f7fb', padding: 12, borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                        {r.avatarUrl ? <img src={r.avatarUrl} alt={r.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                      <strong>{r.fullName}</strong>
                      <span style={{ color: '#999' }}>⭐ {r.rating}/10</span>
                    </div>
                    {r.comment && <div style={{ color: '#333' }}>{r.comment}</div>}
                  </div>
                ))}
              </div>
              {user && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!reviewForm.rating) return;
                    try {
                      await api.post(`/reviews/movie/${id}`, {
                        rating: Number(reviewForm.rating),
                        comment: reviewForm.comment || '',
                      });
                      const { data } = await api.get(`/reviews/movie/${id}`);
                      setReviews(data.reviews || []);
                      setAvgRating(data.aggregates?.avgRating ?? null);
                      setReviewForm({ rating: '', comment: '' });
                    } catch (_) {}
                  }}
                  style={{ display: 'grid', gap: 8 }}
                >
                  <label>
                    Your Rating (1-10)
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}
                      style={{ marginLeft: 8, width: 80 }}
                      required
                    />
                  </label>
                  <textarea
                    placeholder="Write a short review (optional)"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    rows={3}
                    style={{ padding: 8, borderRadius: 6 }}
                  />
                  <button type="submit" style={{ alignSelf: 'start' }}>Submit Review</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
