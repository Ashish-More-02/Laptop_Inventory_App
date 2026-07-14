#!/bin/bash

# Open a new Terminal window and start the BACKEND
osascript -e 'tell application "Terminal" to do script "cd \"/Users/ashishmore/Desktop/Dev-Workspace/Web Development/Laptop_inventry_app/Laptop_inventry_API\" && node index.js"'

# Open another new Terminal window and start the FRONTEND
osascript -e 'tell application "Terminal" to do script "cd \"/Users/ashishmore/Desktop/Dev-Workspace/Web Development/Laptop_inventry_app/frontend\" && npm run dev"'
