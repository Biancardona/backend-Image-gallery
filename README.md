# Image Gallery Backend

A Node.js backend for an image gallery application with user authentication and admin capabilities.

## Features

- User authentication (register, login)
- Image upload and management
- User role-based access control (admin/user)
- Secure file handling
- MySQL database integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=image_gallery_db
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

4. Create the MySQL database:
   ```sql
   CREATE DATABASE image_gallery_db;
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Images
- POST `/api/images/upload` - Upload an image
- GET `/api/images` - Get all images
- GET `/api/images/:id` - Get specific image
- PUT `/api/images/:id` - Update image
- DELETE `/api/images/:id` - Delete image

### Admin Routes
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get specific user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Security Features

- Password hashing using bcrypt
- JWT authentication
- Role-based access control
- File type validation
- File size limits
- Secure file storage

## Error Handling

The API includes comprehensive error handling for:
- Authentication errors
- File upload errors
- Database errors
- Validation errors

## Development

To run the server in development mode with hot reloading:
```bash
npm run dev
```

## Production

To run the server in production mode:
```bash
npm start
```

## Testing

To run tests:
```bash
npm test
``` 