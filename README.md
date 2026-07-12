# TransitOps

Transit Operations Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
TransitOps/
├── server/          # Node.js/Express backend
├── client/          # React frontend
└── package.json     # Root package for managing both servers
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

### 1. Clone the repository and navigate to the project

```bash
cd TransitOps
```

### 2. Install root dependencies

```bash
npm install
```

This will install `concurrently` and `nodemon` for development.

### 3. Install server dependencies

```bash
cd server
npm install
cd ..
```

### 4. Install client dependencies

```bash
cd client
npm install
cd ..
```

### 5. Configure environment variables

Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and update the MongoDB URI and other configuration as needed.

## Running the Project

### Development Mode (both server and client)

```bash
npm run dev
```

This will run:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Run only the server

```bash
npm run server
```

### Run only the client

```bash
npm run client
```

### Production Build

```bash
npm run build
```

## API Endpoints

### Health Check

- **GET** `/api/health` - Check if the server is running

## Available Scripts

### Root Level

- `npm start` - Start the production server
- `npm run server` - Start development server with nodemon
- `npm run client` - Start React development server
- `npm run dev` - Run both server and client concurrently
- `npm run build` - Build the React client

### Server

- `npm start` - Start the server
- `npm run dev` - Start with nodemon

### Client

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client

## Development Workflow

1. The backend server runs on port 5000
2. The frontend runs on port 3000
3. The frontend is configured to proxy API requests to the backend (see `client/package.json`)
4. Use `npm run dev` to run both concurrently during development

## Environment Variables

### Server (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/transitops
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

## Project Next Steps

1. Set up MongoDB connection
2. Create data models (schemas)
3. Build API routes
4. Implement authentication
5. Create React components
6. Connect frontend to backend APIs

## License

ISC

## Author

Your Name
