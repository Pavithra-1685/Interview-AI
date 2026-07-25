# Interview AI

Interview-AI is a full-stack authentication app built with React on the frontend and Express + MongoDB on the backend. It includes user registration, login, logout, and authenticated user profile retrieval.

## Features

- User registration with password hashing
- User login with JWT authentication
- Logout with token blacklisting
- Protected user profile endpoint
- Responsive React frontend with route-based pages

## Project Structure

- backend/ - Express server, authentication routes, MongoDB connection, and middleware
- frontend/ - Vite + React app for the user interface

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT
- bcryptjs
- cookie-parser

### Frontend
- React
- Vite
- React Router
- Sass

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a .env file inside the backend folder with the following variables:

```env
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Installation

1. Clone the repository
2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run at:

```text
http://localhost:3000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run at the Vite development URL shown in the terminal.

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/logout
- GET /api/auth/get-me
 
## Notes

- The backend expects authentication cookies to be sent for protected routes.
- Keep your .env file private and do not commit it to Git.
