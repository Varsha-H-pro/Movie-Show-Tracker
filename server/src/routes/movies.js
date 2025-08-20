import { Router } from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (q) {
      const like = `%${q}%`;
      const [rows] = await pool.execute(
        `SELECT * FROM movies 
         WHERE title LIKE ? OR description LIKE ? OR genre LIKE ? OR director LIKE ?
         ORDER BY created_at DESC`,
        [like, like, like, like]
      );
      return res.json(rows);
    }
    const [rows] = await pool.execute('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('List movies error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM movies WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get movie error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const id = uuidv4();
  const { title, description, release_year, genre, director, cast, rating, poster_url, trailer_url } = req.body;
  try {
    await pool.execute(
      `INSERT INTO movies (id, title, description, release_year, genre, director, cast, rating, poster_url, trailer_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description || null, release_year || null, genre || null, director || null, cast || null, rating || null, poster_url || null, trailer_url || null]
    );
    const [rows] = await pool.execute('SELECT * FROM movies WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create movie error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('Delete movie error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

