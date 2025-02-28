# Note-Taking Application

A full-stack note-taking application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- User authentication (register/login)
- Create, read, update, and delete notes
- Secure API endpoints with JWT authentication
- Responsive design
- Real-time updates

## Prerequisites

- Node.js
- MongoDB
- Web browser

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
JWT_EXPIRES_IN = your_expiry_time_limit
```

4. Start the server:
```bash
npm start
```

5. Access the application at `http://localhost:3000/`

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
  - Body: `{ username, email, password }`
- POST `/api/users/login` - Login user
  - Body: `{ email, password }`

### Notes
All note endpoints require Authentication header: `Bearer <token>`

- GET `/api/notes` - Get all notes for authenticated user
- POST `/api/notes` - Create a new note
  - Body: `{ title, content }`
- PUT `/api/notes/:id` - Update an existing note
  - Body: `{ title, content }`
- DELETE `/api/notes/:id` - Delete a note
