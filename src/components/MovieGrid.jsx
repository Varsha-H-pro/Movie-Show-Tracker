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
    poster: 'https://www.themoviedb.org/t/p/original/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    id: 4,
    title: 'Tenet',
    poster: 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
  },
  {
    id: 5,
    title: 'Dunkirk',
    poster: 'https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMIaWg2uAbjn7TO5.jpg',
  },
  {
    id: 6,
    title: 'Oppenheimer',
    poster: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
  },
];



  return (
    <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1.5rem',
    padding: '1rem',
    justifyContent: 'center',
  }}
>
  {dummyMovies.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
  ))}
</div>
  );
}

export default MovieGrid;
