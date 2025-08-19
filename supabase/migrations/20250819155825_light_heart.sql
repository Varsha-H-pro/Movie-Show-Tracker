/*
# Movie Tracker Database Schema

This file contains all the SQL queries needed to set up the database schema for the Movie Tracker application.

## Tables Created:
1. users - User profiles and authentication
2. movies - Movie information
3. user_favorites - User's favorite movies
4. user_watchlist - User's watchlist

## Security:
- Row Level Security (RLS) enabled on all tables
- Policies for authenticated users
- Admin-only policies for movie management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movies table for storing movie information
CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INTEGER,
    genre VARCHAR(100),
    director VARCHAR(255),
    cast TEXT,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    poster_url TEXT,
    trailer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- User watchlist table
CREATE TABLE IF NOT EXISTS user_watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Movies table policies
CREATE POLICY "Anyone can read movies" ON movies
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert movies" ON movies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update movies" ON movies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete movies" ON movies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User favorites policies
CREATE POLICY "Users can read own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- User watchlist policies
CREATE POLICY "Users can read own watchlist" ON user_watchlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to watchlist" ON user_watchlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from watchlist" ON user_watchlist
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies(release_year);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_movie_id ON user_favorites(movie_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_movie_id ON user_watchlist(movie_id);

-- Insert sample admin user (password should be hashed in real application)
-- Note: This is just for demonstration. In Supabase, users are created through auth.users
INSERT INTO users (id, email, full_name, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@movietracker.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample movies
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
    ),
    (
        'Pulp Fiction',
        'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        1994,
        'Crime, Drama',
        'Quentin Tarantino',
        'John Travolta, Uma Thurman, Samuel L. Jackson',
        8.9,
        'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'
    ),
    (
        'Forrest Gump',
        'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        1994,
        'Drama, Romance',
        'Robert Zemeckis',
        'Tom Hanks, Robin Wright, Gary Sinise',
        8.8,
        'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'
    )
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();