#!/bin/bash

echo "Starting EASIHUB application..."
echo "Building frontend..."
cd frontend && npm run build
echo "Starting backend server with frontend on port 3001..."
cd ../backend && npm start