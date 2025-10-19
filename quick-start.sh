#!/bin/bash

# Quick Start Script for Arbitrage Scanner
# Run this after installing prerequisites

echo "╔═══════════════════════════════════════════════════╗"
echo "║   Arbitrage Scanner - Quick Start Script         ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if command_exists node; then
    echo -e "${GREEN}✓${NC} Node.js: $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js v20+"
    exit 1
fi

if command_exists npm; then
    echo -e "${GREEN}✓${NC} npm: $(npm --version)"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

if command_exists psql; then
    echo -e "${GREEN}✓${NC} PostgreSQL installed"
else
    echo -e "${RED}✗${NC} PostgreSQL not found. Please install PostgreSQL"
    exit 1
fi

if command_exists redis-cli; then
    echo -e "${GREEN}✓${NC} Redis installed"
else
    echo -e "${RED}✗${NC} Redis not found. Please install Redis"
    exit 1
fi

echo ""
echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# Ask which component to start
echo "What would you like to start?"
echo "1) Backend Server only"
echo "2) Backend Worker only"
echo "3) Frontend only"
echo "4) Backend (Server + Worker)"
echo "5) Everything (Backend + Worker + Frontend)"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "Starting Backend Server..."
        cd backend
        npm run dev
        ;;
    2)
        echo "Starting Backend Worker..."
        cd backend
        npm run worker:dev
        ;;
    3)
        echo "Starting Frontend..."
        cd frontend
        npm run dev
        ;;
    4)
        echo "Starting Backend (Server + Worker)..."
        echo "This will open 2 terminal windows"
        cd backend
        # Start in background
        npm run dev &
        npm run worker:dev
        ;;
    5)
        echo "Starting Everything..."
        echo "This requires 3 terminals"
        echo ""
        echo "Run these commands in separate terminals:"
        echo ""
        echo -e "${YELLOW}Terminal 1:${NC}"
        echo "cd backend && npm run dev"
        echo ""
        echo -e "${YELLOW}Terminal 2:${NC}"
        echo "cd backend && npm run worker:dev"
        echo ""
        echo -e "${YELLOW}Terminal 3:${NC}"
        echo "cd frontend && npm run dev"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
