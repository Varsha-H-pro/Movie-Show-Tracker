const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's watchlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [watchlist] = await db.execute(
      'SELECT * FROM user_watchlist WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add to watchlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { movie_id, movie_title, poster_path, release_date } = req.body;

    if (!movie_id || !movie_title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    // Check if already in watchlist
    const [existing] = await db.execute(
      'SELECT id FROM user_watchlist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movie_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    const [result] = await db.execute(
      'INSERT INTO user_watchlist (user_id, movie_id, movie_title, poster_path, release_date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, movie_id, movie_title, poster_path, release_date]
    );

    const [watchlist] = await db.execute(
      'SELECT * FROM user_watchlist WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Added to watchlist',
      watchlist: watchlist[0]
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove from watchlist
router.delete('/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;

    const [result] = await db.execute(
      'DELETE FROM user_watchlist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, movieId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;