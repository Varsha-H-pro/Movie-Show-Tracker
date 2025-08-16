function MovieDetail() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Movie Title</h2>
      <img src="https://via.placeholder.com/300" alt="Poster" />
      <p>Cast: ...</p>
      <p>Rating: ...</p>
      <button style={{ marginTop: '1rem' }}>Add to Favorites</button>
    </div>
  );
}

export default MovieDetail;
