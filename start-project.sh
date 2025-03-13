#!/bin/bash

# Set backend and frontend directories
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Function to install dependencies and start the server
start_project() {
  local dir=$1
  local name=$2

  echo "Installing dependencies for $name..."
  cd "$dir" || { echo "Failed to enter $dir directory"; exit 1; }
  npm install

  echo "Starting $name..."
  npm run dev & disown  # Run in background

  cd - > /dev/null  # Return to root directory
}

# Install and start backend
if [ -d "$BACKEND_DIR" ]; then
  start_project "$BACKEND_DIR" "Backend"
else
  echo "Backend directory not found!"
fi

# Install and start frontend
if [ -d "$FRONTEND_DIR" ]; then
  start_project "$FRONTEND_DIR" "Frontend"
else
  echo "Frontend directory not found!"
fi

echo "Backend and frontend started successfully!"
