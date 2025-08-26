# Movie Tracker App

A full-featured movie tracking application with user authentication, admin panel, and personal movie collections.

## Features

### User Features
- **Authentication**: Secure login and signup system
- **Movie Discovery**: Browse and search through movie collections
- **Personal Collections**: Add movies to favorites and watchlist
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Movie Management**: Add, edit, and delete movies
- **Content Control**: Full CRUD operations for movie database
- **Admin Dashboard**: Dedicated interface for content management

## Technology Stack

- **Frontend**: React 19, React Router DOM
- **Backend**: Supabase (PostgreSQL database with real-time features)
- **Authentication**: Supabase Auth with Row Level Security
- **Styling**: Custom CSS with modern design principles
- **State Management**: React Context API

## Database Schema

The application uses the following database tables:

### Users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- full_name (VARCHAR)
- role (VARCHAR) - 'user' or 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Movies Table
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- release_year (INTEGER)
- genre (VARCHAR)
- director (VARCHAR)
- cast (TEXT)
- rating (DECIMAL)
- poster_url (TEXT)
- trailer_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### User Favorites Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- movie_id (UUID, Foreign Key)
- created_at (TIMESTAMP)
```

### User Watchlist Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- movie_id (UUID, Foreign Key)
- created_at (TIMESTAMP)
```
---
## 📸 Screenshots

###  Login View
<p align="center">
<img width="700" height="714" alt="Screenshot 2025-08-21 at 5 16 53 PM" src="https://github.com/user-attachments/assets/662e0655-d585-4c6e-b81c-99c17f90aad6" />
</p>

###  Dashboard (Movie List)
<p align="center">
<img width="700" height="714" alt="Screenshot 2025-08-21 at 5 18 28 PM" src="https://github.com/user-attachments/assets/e5c0d69a-14a7-4d65-8ef8-9dbf4ad4b44d" />
</p>

###  MovieCard
<p align="center">
<img width="700" height="714" alt="Screenshot 2025-08-21 at 5 20 09 PM" src="https://github.com/user-attachments/assets/4a0a383d-214a-4b0d-8ebf-71583ffbe261" />
</p>

###  Favorites and Watchlist
<p align="center">
<img width="700" height="714" alt="Screenshot 2025-08-21 at 5 22 20 PM" src="https://github.com/user-attachments/assets/70353fc8-4235-4f48-be70-1616f6d629e4" />
</p>

###  Admin Panel
<p align="center">
<img width="700" height="714" alt="Screenshot 2025-08-21 at 5 24 45 PM" src="https://github.com/user-attachments/assets/b340dea7-2411-49ea-89a4-34c2a39a3fff" />
</p>

---
## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

1. **Start the development server**
   ```bash
   npm start
   ```

## User Roles

### Regular Users
- Can view all movies
- Can add movies to favorites and watchlist
- Can manage their own collections
- Cannot add or modify movie data

### Admin Users
- All user permissions
- Can add new movies to the database
- Can edit existing movie information
- Can delete movies
- Access to admin dashboard

## Security Features

- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own data
- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Role-based access control for admin features
- **Data Validation**: Input validation on both client and server side

## API Integration

The app is designed to work with movie databases. You can integrate with:
- The Movie Database (TMDb) API
- Custom movie data sources







