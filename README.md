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

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

   ```

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
- Open Movie Database (OMDb) API
- Custom movie data sources

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@movietracker.com or create an issue in the repository.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
