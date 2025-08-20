-- Movie Tracker Database Schema for MySQL
-- Run these queries in your MySQL database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS movie_tracker;
USE movie_tracker;

-- Users table for authentication and user profiles
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Custom movies table (for admin-added movies)
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    genre VARCHAR(100),
    director VARCHAR(255),
    cast TEXT,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    poster_url TEXT,
    trailer_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_genre (genre),
    INDEX idx_release_year (release_year)
);

-- User favorites table (stores TMDB movie IDs and basic info)
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL, -- TMDB movie ID
    movie_title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie (user_id, movie_id),
    INDEX idx_user_id (user_id),
    INDEX idx_movie_id (movie_id)
);

-- User watchlist table (stores TMDB movie IDs and basic info)
CREATE TABLE IF NOT EXISTS user_watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL, -- TMDB movie ID
    movie_title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie (user_id, movie_id),
    INDEX idx_user_id (user_id),
    INDEX idx_movie_id (movie_id)
);

-- Insert sample admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, full_name, role) VALUES 
('admin@movietracker.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Admin User', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample regular user
-- Password: user123 (hashed with bcrypt)
INSERT INTO users (email, password, full_name, role) VALUES 
('user@movietracker.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Regular User', 'user')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample custom movies
INSERT INTO movies (title, description, release_year, genre, director, cast, rating, poster_url) VALUES 
(
    'The Shawshank Redemption',
    'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    1994,
    'Drama',
    'Frank Darabont',
    'Tim Robbins, Morgan Freeman, Bob Gunton',
    9.3,
    'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'
),
(
    'The Godfather',
    'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    1972,
    'Crime, Drama',
    'Francis Ford Coppola',
    'Marlon Brando, Al Pacino, James Caan',
    9.2,
    'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
),
(
    'The Dark Knight',
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    2008,
    'Action, Crime, Drama',
    'Christopher Nolan',
    'Christian Bale, Heath Ledger, Aaron Eckhart',
    9.0,
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
)
ON DUPLICATE KEY UPDATE title = title;

-- Show tables and their structure
SHOW TABLES;
DESCRIBE users;
DESCRIBE movies;
DESCRIBE user_favorites;
DESCRIBE user_watchlist;