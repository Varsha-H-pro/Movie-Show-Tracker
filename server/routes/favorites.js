const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [favorites] = await db.execute(
      'SELECT * FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { movie_id, movie_title, poster_path, release_date } = req.body;

    if (!movie_id || !movie_title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    // Check if already in favorites
    const [existing] = await db.execute(
      'SELECT id FROM user_favorites WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movie_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }

    const [result] = await db.execute(
      'INSERT INTO user_favorites (user_id, movie_id, movie_title, poster_path, release_date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, movie_id, movie_title, poster_path, release_date]
    );

    const [favorites] = await db.execute(
      'SELECT * FROM user_favorites WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Added to favorites',
      favorite: favorites[0]
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    const [result] = await db.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movieId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found in favorites' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

module.exports = router;