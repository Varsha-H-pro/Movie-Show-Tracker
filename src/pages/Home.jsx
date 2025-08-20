import React, { useState } from 'react';
import EnhancedSearchBar from '../components/Search/EnhancedSearchBar';
import EnhancedMovieGrid from '../components/Movies/EnhancedMovieGrid';
import '../App.css';

function Home() {
  const [term, setTerm] = useState('');
  return (
    <div className="home-wrapper">
      <header className="hero-section">
        <h1>🎬 Movie Show Tracker</h1>
        <p>Track your favorite movies and TV shows. Search, explore, and build your watchlist!</p>
        <EnhancedSearchBar onSearch={setTerm} />
      </header>

      <section className="grid-section">
        <h2>Popular Picks</h2>
        <EnhancedMovieGrid searchTerm={term} />
      </section>
    </div>
  );
}

export default Home;
