#!/bin/bash

# Stop the BACKEND (whatever is running on port 3000)
find_PID_on_PORT3000=$(lsof -ti tcp:3000)
kill -9 $find_PID_on_PORT3000 2>/dev/null

# Stop the FRONTEND (whatever is running on port 5173)
find_PID_on_PORT5173=$(lsof -ti tcp:5173)
kill -9 $find_PID_on_PORT5173 2>/dev/null

echo "Stopped backend and frontend."
