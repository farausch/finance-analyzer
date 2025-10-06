#!/bin/zsh

# Navigate to the backend directory
echo "Starting backend..."
cd backend || exit 1
source pyenv/bin/activate
uvicorn api:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Navigate to the frontend directory
echo "Starting frontend..."
cd ../frontend || exit 1
npm run dev &
FRONTEND_PID=$!

# Wait for both processes to finish or allow the user to terminate them
trap "echo 'Stopping applications...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

echo "Both backend and frontend are running."
wait
