const express = require('express');
const axios = require('axios');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get movies from TMDB API
router.get('/tmdb/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&page=${page}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('TMDB API error:', error);
    res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
  }
});

// Search movies from TMDB API
router.get('/tmdb/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('TMDB search error:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Get movie details from TMDB
router.get('/tmdb/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=credits,videos`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('TMDB movie details error:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Get user's custom movies (admin added)
router.get('/custom', async (req, res) => {
  try {
    const [movies] = await db.execute(
      'SELECT * FROM movies ORDER BY created_at DESC'
    );
    res.json(movies);
  } catch (error) {
    console.error('Error fetching custom movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Add custom movie (admin only)
router.post('/custom', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      release_year,
      genre,
      director,
      cast,
      rating,
      poster_url,
      trailer_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await db.execute(
      `INSERT INTO movies (title, description, release_year, genre, director, cast, rating, poster_url, trailer_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, release_year, genre, director, cast, rating, poster_url, trailer_url]
    );

    const [movies] = await db.execute(
      'SELECT * FROM movies WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Movie added successfully',
      movie: movies[0]
    });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Delete custom movie (admin only)
router.delete('/custom/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM movies WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

module.exports = router;