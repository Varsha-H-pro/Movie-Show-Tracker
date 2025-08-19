import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, signOut } = useAuth();

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