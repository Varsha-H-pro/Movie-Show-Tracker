function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '250px',
          marginRight: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={() => {}}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
