import pool from './db.js';
import bcrypt from 'bcryptjs';

const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  release_year INT,
  genre VARCHAR(100),
  director VARCHAR(255),
  \`cast\` TEXT,
  rating DECIMAL(3,1),
  poster_url TEXT,
  trailer_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_favorites (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  movie_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_movie (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_watchlist (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  movie_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_movie_watch (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
`;

export async function ensureDatabaseInitialized() {
  const connection = await pool.getConnection();
  try {
    for (const statement of schemaSql.split(';')) {
      const trimmed = statement.trim();
      if (trimmed.length === 0) continue;
      await connection.query(trimmed);
    }
    // Optionally create a default admin if env vars provided
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminFullName = process.env.ADMIN_FULL_NAME || 'Admin User';
    if (adminEmail && adminPassword) {
      const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
      if (rows.length === 0) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        // Simple UUID alternative for MySQL if uuid() function is not used: generate in app
        const [[uuidRow]] = await connection.query('SELECT UUID() as id');
        const id = uuidRow.id;
        await connection.query(
          'INSERT INTO users (id, email, full_name, role, password_hash) VALUES (?, ?, ?, ?, ?)',
          [id, adminEmail, adminFullName, 'admin', passwordHash]
        );
        // eslint-disable-next-line no-console
        console.log('Created default admin user:', adminEmail);
      }
    }
  } finally {
    connection.release();
  }
}

