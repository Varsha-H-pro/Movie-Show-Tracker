import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { fetchPopularMovies } from '../services/api';
import SearchBar from './SearchBar'; // 👈 Import your reusable component

function MovieGrid() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadMovies() {
      const data = await fetchPopularMovies();
      setMovies(data);
    }
    loadMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.5rem',
          padding: '1rem',
          justifyContent: 'center',
        }}
      >
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
