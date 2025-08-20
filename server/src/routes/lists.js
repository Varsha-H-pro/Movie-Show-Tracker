import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT m.* FROM user_favorites uf 
       JOIN movies m ON m.id = uf.movie_id 
       WHERE uf.user_id = ?
       ORDER BY uf.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('List favorites error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/watchlist', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT m.* FROM user_watchlist uw 
       JOIN movies m ON m.id = uw.movie_id 
       WHERE uw.user_id = ?
       ORDER BY uw.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('List watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/favorites', requireAuth, async (req, res) => {
  const { movie_id } = req.body;
  const id = uuidv4();
  try {
    await pool.execute('INSERT INTO user_favorites (id, user_id, movie_id) VALUES (?, ?, ?)', [id, req.user.id, movie_id]);
    res.status(201).json({ id, user_id: req.user.id, movie_id });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already in favorites' });
    console.error('Add favorite error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/favorites/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;
  try {
    await pool.execute('DELETE FROM user_favorites WHERE user_id = ? AND movie_id = ?', [req.user.id, movieId]);
    res.status(204).end();
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/watchlist', requireAuth, async (req, res) => {
  const { movie_id } = req.body;
  const id = uuidv4();
  try {
    await pool.execute('INSERT INTO user_watchlist (id, user_id, movie_id) VALUES (?, ?, ?)', [id, req.user.id, movie_id]);
    res.status(201).json({ id, user_id: req.user.id, movie_id });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already in watchlist' });
    console.error('Add watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/watchlist/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;
  try {
    await pool.execute('DELETE FROM user_watchlist WHERE user_id = ? AND movie_id = ?', [req.user.id, movieId]);
    res.status(204).end();
  } catch (err) {
    console.error('Remove watchlist error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

