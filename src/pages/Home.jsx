import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import '../App.css'; // Make sure this is imported if not already

function Home() {
  return (
    <div className="home-wrapper">
      <h1>🎬 Movie Tracker</h1>
      <SearchBar />
      <MovieGrid />
    </div>
  );
}

export default Home;
