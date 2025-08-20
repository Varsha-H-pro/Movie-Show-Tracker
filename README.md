# Movie Tracker App

A full-featured movie tracking application with MySQL backend, TMDB API integration, user authentication, admin panel, and personal movie collections.

## Features

### User Features
- **Authentication**: Secure login and signup system
- **Movie Discovery**: Browse popular movies from TMDB API and search functionality
- **Personal Collections**: Add movies to favorites and watchlist
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Movie Management**: Add, edit, and delete movies
- **Content Control**: Full CRUD operations for movie database
- **Admin Dashboard**: Dedicated interface for content management

## Technology Stack

- **Frontend**: React 19, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MySQL
- **Authentication**: JWT tokens with bcrypt password hashing
- **External API**: The Movie Database (TMDB) API
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Context API

## Database Schema

The application uses the following MySQL database tables:

### Users Table
```sql
- id (INT, Auto Increment, Primary Key)
- email (VARCHAR(255), Unique)
- password (VARCHAR(255), Hashed)
- full_name (VARCHAR(255))
- role (ENUM) - 'user' or 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Movies Table
```sql
- id (INT, Auto Increment, Primary Key)
- title (VARCHAR(255))
- description (TEXT)
- release_year (INTEGER)
- genre (VARCHAR(100))
- director (VARCHAR(255))
- cast (TEXT)
- rating (DECIMAL)
- poster_url (TEXT)
- trailer_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### User Favorites Table
```sql
- id (INT, Auto Increment, Primary Key)
- user_id (INT, Foreign Key)
- movie_id (INT) - TMDB Movie ID
- movie_title (VARCHAR(255))
- poster_path (VARCHAR(255))
- release_date (DATE)
- created_at (TIMESTAMP)
```

### User Watchlist Table
```sql
- id (INT, Auto Increment, Primary Key)
- user_id (INT, Foreign Key)
- movie_id (INT) - TMDB Movie ID
- movie_title (VARCHAR(255))
- poster_path (VARCHAR(255))
- release_date (DATE)
- created_at (TIMESTAMP)
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- TMDB API account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL Database**
   - Create a MySQL database
   - Run the SQL queries from `database_schema.sql`
   - Note your database credentials

4. **Get TMDB API Key**
   - Sign up at [TMDB](https://www.themoviedb.org/settings/api)
   - Get your API key

5. **Environment Variables**
   Create a `.env` file in the root directory (copy from `.env.example`):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=movie_tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
   PORT=5000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and React app (port 3000)

## User Roles

### Regular Users
- Can view all movies
- Can add movies to favorites and watchlist
- Can manage their own collections
- Cannot add or modify custom movie data

### Admin Users
- All user permissions
- Can add new custom movies to the database
- Can delete custom movies
- Access to admin dashboard

## Test Accounts

The database comes with pre-created test accounts:

**Admin Account:**
- Email: admin@movietracker.com
- Password: admin123

**Regular User Account:**
- Email: user@movietracker.com
- Password: user123

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Authorization Middleware**: Role-based access control
- **Authorization**: Role-based access control for admin features
- **Input Validation**: Server-side validation for all inputs

## API Integration

The app integrates with:
- **The Movie Database (TMDB) API**: For popular movies, search, and movie details
- **Custom Movie Database**: Admin-added movies stored in MySQL

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/tmdb/popular` - Get popular movies from TMDB
- `GET /api/movies/tmdb/search` - Search movies on TMDB
- `GET /api/movies/tmdb/:id` - Get movie details from TMDB
- `GET /api/movies/custom` - Get custom movies
- `POST /api/movies/custom` - Add custom movie (admin only)
- `DELETE /api/movies/custom/:id` - Delete custom movie (admin only)

### User Collections
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:movieId` - Remove from favorites
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:movieId` - Remove from watchlist
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run server`

Runs only the backend server on port 5000.

### `npm run dev`

Runs both the backend server and React app concurrently.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, create an issue in the repository.

