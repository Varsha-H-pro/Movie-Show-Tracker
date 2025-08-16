import MovieCard from './MovieCard';

function MovieGrid() {
  const dummyMovies = [
  {
    id: 1,
    title: 'Inception',
    poster: 'https://c8.alamy.com/comp/2JKYCTN/movie-poster-inception-2010-2JKYCTN.jpg'
  },
  {
    id: 2,
    title: 'Interstellar',
    poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
  },
];



  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {dummyMovies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;
