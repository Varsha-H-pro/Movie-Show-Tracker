function SearchBar() {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="Search for movies..."
        style={{
          padding: '0.5rem',
          width: '250px',
          marginRight: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button style={{ padding: '0.5rem 1rem' }}>Search</button>
    </div>
  );
}

export default SearchBar;
