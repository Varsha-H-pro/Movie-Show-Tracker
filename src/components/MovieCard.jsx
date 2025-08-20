function MovieCard({ movie }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '150px',
      }}
    >
      <img src={movie.poster} alt={movie.title} style={{ width: '100%', borderRadius: '4px' }} />
      <h3>{movie.title}</h3>
      <button style={{ marginTop: '0.5rem' }}>Add to Watchlist</button>
    </div>
  );
}

export default MovieCard;
