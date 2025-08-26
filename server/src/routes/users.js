import { Router } from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get own profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name as fullName, role, avatar_url as avatarUrl, created_at as createdAt FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update own profile (full name, avatar)
router.patch('/me', requireAuth, async (req, res) => {
  const { fullName, avatarUrl } = req.body || {};
  try {
    await pool.execute(
      'UPDATE users SET full_name = COALESCE(?, full_name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
      [fullName ?? null, avatarUrl ?? null, req.user.id]
    );
    const [rows] = await pool.execute(
      'SELECT id, email, full_name as fullName, role, avatar_url as avatarUrl, created_at as createdAt FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('Update me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid current password' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public profile with shared lists summary
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [[user]] = await pool.query(
      'SELECT id, full_name as fullName, avatar_url as avatarUrl, created_at as createdAt FROM users WHERE id = ?',
      [id]
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    const [favorites] = await pool.query(
      `SELECT m.id, m.title, m.poster_url FROM user_favorites uf JOIN movies m ON m.id = uf.movie_id WHERE uf.user_id = ? ORDER BY uf.created_at DESC LIMIT 20`,
      [id]
    );
    const [watchlist] = await pool.query(
      `SELECT m.id, m.title, m.poster_url FROM user_watchlist uw JOIN movies m ON m.id = uw.movie_id WHERE uw.user_id = ? ORDER BY uw.created_at DESC LIMIT 20`,
      [id]
    );
    res.json({ user, favorites, watchlist });
  } catch (err) {
    console.error('Public profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

