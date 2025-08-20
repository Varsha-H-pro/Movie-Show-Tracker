import { Router } from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

function createToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await pool.execute(
      'INSERT INTO users (id, email, full_name, role, password_hash) VALUES (?, ?, ?, ?, ?)',
      [id, email, fullName, 'user', passwordHash]
    );

    const [rows] = await pool.execute('SELECT id, email, full_name as fullName, role FROM users WHERE id = ?', [id]);
    const user = rows[0];
    const token = createToken(user);
    res.json({ user, token });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const publicUser = { id: user.id, email: user.email, fullName: user.full_name, role: user.role };
    const token = createToken(publicUser);
    res.json({ user: publicUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const [rows] = await pool.execute('SELECT id, email, full_name as fullName, role FROM users WHERE id = ?', [payload.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;

