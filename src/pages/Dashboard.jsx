import React from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navigation/Navbar';
import AdminPanel from '../components/Admin/AdminPanel';
import EnhancedSearchBar from '../components/Search/EnhancedSearchBar';
import TMDBMovieGrid from '../components/Movies/TMDBMovieGrid';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

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
            <EnhancedSearchBar onSearch={handleSearch} />
          </div>
        </header>

        <section className="movies-section">
          <div className="section-header">
            <h2>Discover Movies</h2>
            <p>Explore popular movies and add them to your collection</p>
          </div>
          <TMDBMovieGrid searchQuery={searchQuery} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;