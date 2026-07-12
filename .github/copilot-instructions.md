# TransitOps Project Instructions

This is a MERN stack application for Transit Operations Management.

## Project Structure

- `/server` - Express.js backend with MongoDB
- `/client` - React frontend application
- `/package.json` - Root package with scripts for managing both applications

## Key Commands

- `npm install` - Install root dependencies, then server and client
- `npm run dev` - Run both server and client concurrently in development mode
- `npm run server` - Run backend server only
- `npm run client` - Run frontend server only
- `npm run build` - Build the React client for production

## Development Setup

1. Ensure MongoDB is running locally or update the connection string in `server/.env`
2. Create `server/.env` from `server/.env.example`
3. Install dependencies with `npm install`
4. Start development with `npm run dev`

## Backend

- Framework: Express.js
- Database: MongoDB
- ORM: Mongoose
- Authentication: JWT
- Port: 5000

## Frontend

- Framework: React 18
- Routing: React Router v6
- HTTP Client: Axios
- Port: 3000

## Notes

- Frontend proxy is configured to backend at localhost:5000
- Use nodemon for automatic backend restart during development
- Both server and client can be run with `npm run dev`
