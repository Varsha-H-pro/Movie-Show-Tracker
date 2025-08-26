import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// List reviews for a movie with aggregates
router.get('/movie/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    let rows;
    try {
      const [_rows] = await pool.execute(
        `SELECT r.id, r.rating, r.comment, r.created_at as createdAt,
                u.id as userId, u.full_name as fullName, u.avatar_url as avatarUrl
         FROM reviews r JOIN users u ON u.id = r.user_id
         WHERE r.movie_id = ?
         ORDER BY r.created_at DESC`,
        [movieId]
      );
      rows = _rows;
    } catch (err) {
      // Fallback for older schemas without users.avatar_url
      if (err && err.code === 'ER_BAD_FIELD_ERROR') {
        const [_rows] = await pool.execute(
          `SELECT r.id, r.rating, r.comment, r.created_at as createdAt,
                  u.id as userId, u.full_name as fullName, NULL as avatarUrl
           FROM reviews r JOIN users u ON u.id = r.user_id
           WHERE r.movie_id = ?
           ORDER BY r.created_at DESC`,
          [movieId]
        );
        rows = _rows;
      } else {
        throw err;
      }
    }
    const [[agg]] = await pool.execute(
      'SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE movie_id = ?',
      [movieId]
    );
    const count = Number(agg?.count ?? 0);
    const avgRaw = agg?.avgRating;
    const avgNum = avgRaw == null ? null : Number(avgRaw);
    const avgRating = avgNum == null || Number.isNaN(avgNum) ? null : Number(avgNum.toFixed(1));
    res.json({ reviews: rows, aggregates: { count, avgRating } });
  } catch (err) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update own review for a movie
router.post('/movie/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;
  let { rating, comment } = req.body || {};
  rating = Number(rating);
  if (!rating || rating < 1 || rating > 10) return res.status(400).json({ error: 'Rating must be 1-10' });
  try {
    // Upsert: if exists, update; else insert
    const id = uuidv4();
    const [existing] = await pool.execute('SELECT id FROM reviews WHERE user_id = ? AND movie_id = ?', [req.user.id, movieId]);
    if (existing.length) {
      await pool.execute('UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [rating, comment || null, existing[0].id]);
      return res.json({ id: existing[0].id, rating, comment: comment || null });
    }
    await pool.execute('INSERT INTO reviews (id, user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?, ?)', [id, req.user.id, movieId, rating, comment || null]);
    res.status(201).json({ id, rating, comment: comment || null });
  } catch (err) {
    console.error('Upsert review error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

