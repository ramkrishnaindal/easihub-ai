#!/bin/bash
# Start backend server
cd ../backend && npm start &
sleep 2
# Start frontend
cd ../frontend
BROWSER=none PORT=3001 react-scripts start &
sleep 3
open "http://localhost:3001?username=easdevhub&avatar_template=https%3A%2F%2Fcdn.easihub.com%2Fuser_avatar%2Feasihub.com%2Fsaish_patil%2F288%2F340_2.png"