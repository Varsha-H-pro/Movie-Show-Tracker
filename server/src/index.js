import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureDatabaseInitialized } from './setup.js';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import listsRoutes from './routes/lists.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes);
app.use('/', listsRoutes);

const PORT = process.env.PORT || 4000;

ensureDatabaseInitialized()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

