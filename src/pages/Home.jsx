import MovieGrid from '../components/MovieGrid';
import '../App.css';

function Home() {
  return (
    <div className="home-wrapper">
      <header className="hero-section">
        <h1>🎬 Movie Show Tracker</h1>
        <p>Track your favorite movies and TV shows. Search, explore, and build your watchlist!</p>
        {/* Removed <SearchBar /> */}
      </header>

      <section className="grid-section">
        <h2>Popular Picks</h2>
        <MovieGrid />
      </section>
    </div>
  );
}

export default Home;
