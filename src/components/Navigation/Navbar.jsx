import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import './Navbar.css';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [openFav, setOpenFav] = useState(false);
  const [openWatch, setOpenWatch] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setFavorites([]);
        setWatchlist([]);
        return;
      }
      try {
        const [favRes, watchRes] = await Promise.all([
          api.get('/favorites'),
          api.get('/watchlist'),
        ]);
        setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
        setWatchlist(Array.isArray(watchRes.data) ? watchRes.data : []);
      } catch (e) {
        // ignore navbar load errors
      }
    };
    load();

    const onChanged = () => load();
    window.addEventListener('lists:changed', onChanged);
    return () => window.removeEventListener('lists:changed', onChanged);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>🎬 Movie Tracker</h2>
        </div>
        
        {user && (
          <div className="navbar-menu">
            <span className="user-greeting">
              Welcome, {user.full_name}
              {user.role === 'admin' && <span className="admin-badge">Admin</span>}
            </span>

            <div className="nav-list">
              <button className="nav-toggle" onClick={() => setOpenFav((v) => !v)}>
                ❤️ Favorites ({favorites.length})
              </button>
              {openFav && (
                <div className="nav-dropdown">
                  {favorites.length === 0 && <div className="nav-empty">No favorites yet</div>}
                  {favorites.map((m) => (
                    <div key={m.id} className="nav-item" onClick={() => { setOpenFav(false); navigate(`/movie/${m.id}`); }}>
                      <img src={m.poster_url} alt={m.title} />
                      <span>{m.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="nav-list">
              <button className="nav-toggle" onClick={() => setOpenWatch((v) => !v)}>
                📝 Watchlist ({watchlist.length})
              </button>
              {openWatch && (
                <div className="nav-dropdown">
                  {watchlist.length === 0 && <div className="nav-empty">No watchlist yet</div>}
                  {watchlist.map((m) => (
                    <div key={m.id} className="nav-item" onClick={() => { setOpenWatch(false); navigate(`/movie/${m.id}`); }}>
                      <img src={m.poster_url} alt={m.title} />
                      <span>{m.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;