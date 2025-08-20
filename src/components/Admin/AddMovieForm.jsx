import React, { useState } from 'react';
import api from '../../config/api';

const AddMovieForm = ({ onMovieAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: '',
    genre: '',
    director: '',
    cast: '',
    rating: '',
    poster_url: '',
    trailer_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        release_year: formData.release_year ? parseInt(formData.release_year) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };
      const { data } = await api.post('/movies', payload);

      setSuccess('Movie added successfully!');
      setFormData({
        title: '',
        description: '',
        release_year: '',
        genre: '',
        director: '',
        cast: '',
        rating: '',
        poster_url: '',
        trailer_url: ''
      });
      
      if (onMovieAdded) {
        onMovieAdded(data);
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie-form">
      <h2>Add New Movie</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="release_year">Release Year *</label>
            <input
              type="number"
              id="release_year"
              name="release_year"
              value={formData.release_year}
              onChange={handleChange}
              min="1900"
              max="2030"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Action, Drama, Comedy..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rating">Rating (1-10)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="director">Director</label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cast">Cast</label>
          <input
            type="text"
            id="cast"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Actor 1, Actor 2, Actor 3..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="poster_url">Poster URL</label>
          <input
            type="url"
            id="poster_url"
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="trailer_url">Trailer URL</label>
          <input
            type="url"
            id="trailer_url"
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Adding Movie...' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
};

export default AddMovieForm;