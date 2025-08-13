# EASIHUB Application

This application serves the React frontend as static files from the Express backend on port 3001.

## Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Option 1: Using the start script (Recommended)
```bash
./start.sh
```

### Option 2: Manual steps
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

## Access

- **Application**: http://localhost:3001
- **API Endpoints**: http://localhost:3001/api/*

The backend serves:
- Static React files at the root path
- API endpoints under `/api/*`
- All other routes redirect to React for client-side routing

## Configuration

- Backend runs on port 3001
- Frontend is built and served as static files
- API calls use relative paths (`/api/*`) since frontend is served from the same origin