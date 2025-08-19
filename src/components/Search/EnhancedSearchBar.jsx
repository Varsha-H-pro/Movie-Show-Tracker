import React, { useState } from 'react';
import './EnhancedSearchBar.css';

const EnhancedSearchBar = ({ onSearch, placeholder = "Search for movies..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="enhanced-search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>
    </form>
  );
};

export default EnhancedSearchBar;