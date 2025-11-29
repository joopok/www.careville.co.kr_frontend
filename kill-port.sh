#!/bin/bash

# Kill process using port 8001 on Cafe24 server
PORT=${1:-8001}

echo "🔍 Checking for processes on port $PORT..."

# Find process ID using the port
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✅ Port $PORT is free"
  exit 0
else
  echo "⚠️  Found process $PID using port $PORT"
  echo "🔪 Killing process..."

  kill -9 $PID

  if [ $? -eq 0 ]; then
    echo "✅ Process $PID killed successfully"
    echo "🚀 Port $PORT is now free"
  else
    echo "❌ Failed to kill process $PID"
    echo "💡 Try: sudo kill -9 $PID"
    exit 1
  fi
fi
