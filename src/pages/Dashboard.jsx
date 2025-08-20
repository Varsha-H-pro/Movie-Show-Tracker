import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navigation/Navbar';
import AdminPanel from '../components/Admin/AdminPanel';
import EnhancedSearchBar from '../components/Search/EnhancedSearchBar';
import EnhancedMovieGrid from '../components/Movies/EnhancedMovieGrid';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [term, setTerm] = useState('');

  if (user?.role === 'admin') {
    return (
      <div className="dashboard">
        <Navbar />
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        <header className="dashboard-hero">
          <h1>🎬 Discover Amazing Movies</h1>
          <p>Find your next favorite film and build your personal collection</p>
          <div className="search-section">
            <EnhancedSearchBar onSearch={setTerm} />
          </div>
        </header>

        <section className="movies-section">
          <div className="section-header">
            <h2>Latest Movies</h2>
            <p>Explore our collection of movies</p>
          </div>
          <EnhancedMovieGrid searchTerm={term} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;