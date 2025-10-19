# 🚀 Complete Local Setup Guide - Arbitrage Scanner

Follow these steps to run your arbitrage scanner on your local machine.

---

## 📋 Prerequisites

Install these on your local machine:

1. **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
3. **Redis** - [Download](https://redis.io/download/)
4. **Git** - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version    # Should show v20.x.x or higher
npm --version     # Should show v10.x.x or higher
psql --version    # Should show PostgreSQL 15.x
redis-cli --version  # Should show Redis version
```

---

## 🔧 Part 1: Backend Setup

### Step 1: Clone Your Backend Repository

```bash
# Clone from GitHub
git clone https://github.com/owenwebDe/ArbitrageBotWeb.git
cd ArbitrageBotWeb
```

### Step 2: Install Backend Dependencies

```bash
npm install
# This will take a few minutes
```

### Step 3: Setup PostgreSQL Database

#### On Windows:
1. Open pgAdmin or use SQL Shell (psql)
2. Create database:
```sql
CREATE DATABASE arbitrage_scanner;
ALTER USER postgres WITH PASSWORD 'postgres123';
```

#### On Mac/Linux:
```bash
# Start PostgreSQL (if not running)
brew services start postgresql  # Mac
sudo service postgresql start   # Linux

# Create database
psql -U postgres -c "CREATE DATABASE arbitrage_scanner;"
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres123';"
```

### Step 4: Setup Redis

#### On Windows:
- Download Redis from: https://github.com/microsoftarchive/redis/releases
- Install and start Redis service
- Or use Windows Subsystem for Linux (WSL) with Redis

#### On Mac:
```bash
brew install redis
brew services start redis
```

#### On Linux:
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

### Step 5: Configure Environment Variables

The `.env` file should already exist in your backend folder. Verify it has these settings:

```bash
# Check your .env file
cat .env

# It should contain:
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/arbitrage_scanner
REDIS_URL=redis://localhost:6379
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Step 6: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database with exchanges and trading pairs
npx ts-node prisma/seed.ts
```

You should see:
```
✅ Seeded 53 exchanges
✅ Seeded 61 trading pairs
```

### Step 7: Start Backend Server

Open a terminal and run:

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Database connected successfully
✅ Redis connected successfully
```

**✅ Backend server is now running on http://localhost:5000**

Keep this terminal open!

### Step 8: Start Backend Worker (New Terminal)

Open a **NEW terminal window** in the same backend directory:

```bash
npm run worker:dev
```

You should see:
```
✅ All workers started successfully
Worker process is running...
Syncing prices for X trading pairs
```

**✅ Worker is now running and fetching prices**

Keep this terminal open too!

---

## 🎨 Part 2: Frontend Setup

### Step 9: Download Frontend Files

I'll create a zip file with all the frontend code for you:

```bash
# On the server (where I built it), run:
cd /app
tar -czf arbitrage-frontend.tar.gz frontend/
```

Or you can manually create the frontend on your local machine:

### Step 10: Create Frontend Folder Locally

```bash
# In a new location (outside the backend folder)
mkdir arbitrage-frontend
cd arbitrage-frontend
```

### Step 11: Initialize Next.js Project

```bash
# Initialize package.json
npm init -y

# Install dependencies
npm install next@14 react@19 react-dom@19
npm install socket.io-client axios recharts react-toastify
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react next-themes date-fns

# Install dev dependencies
npm install -D typescript @types/react @types/node
npm install -D eslint eslint-config-next
```

### Step 12: Create Frontend Structure

**I'll provide you with all the files to copy. Here's the folder structure:**

```
arbitrage-frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── trades/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   └── badge.tsx
│   │   └── dashboard/
│   │       ├── DashboardLayout.tsx
│   │       ├── OpportunitiesTable.tsx
│   │       └── TradeModal.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       └── utils.ts
├── public/
├── .env.local
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### Step 13: Create Configuration Files

**Create `.env.local`:**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

**Create `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

**Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Create `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Create `postcss.config.js`:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Step 14: Copy All Frontend Source Files

**I can provide you with a download link or you can:**

**Option A:** Download from the server
```bash
# I'll create a zip for you
# Then download and extract it to your local machine
```

**Option B:** I'll share all the code files individually
- Let me know which files you need and I'll show you the content

### Step 15: Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### Step 16: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.33
- Local: http://localhost:3000
✓ Ready in 1.2s
```

**✅ Frontend is now running on http://localhost:3000**

---

## 🎯 Part 3: Test Everything

### Check All Services Are Running:

**Terminal 1:** Backend Server (port 5000)
```bash
# Should show logs of API requests
```

**Terminal 2:** Backend Worker
```bash
# Should show price fetching logs
```

**Terminal 3:** Frontend (port 3000)
```bash
# Should show Next.js running
```

### Test the Application:

1. **Open Browser:** http://localhost:3000
2. **Register:** Create a new account
3. **Login:** Sign in with your credentials
4. **Dashboard:** View live opportunities (wait 30-60 seconds for first scan)
5. **Navigate:** Try Trades, Analytics, Settings pages

---

## 📦 Quick Commands Reference

### Start Everything (from 3 different terminals):

**Terminal 1 - Backend Server:**
```bash
cd ArbitrageBotWeb
npm run dev
```

**Terminal 2 - Worker:**
```bash
cd ArbitrageBotWeb
npm run worker:dev
```

**Terminal 3 - Frontend:**
```bash
cd arbitrage-frontend
npm run dev
```

### Stop Everything:
Press `Ctrl+C` in each terminal

### Restart Database:
```bash
# PostgreSQL
brew services restart postgresql  # Mac
sudo service postgresql restart   # Linux

# Redis
brew services restart redis  # Mac
sudo service redis-server restart  # Linux
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
```bash
# Find and kill the process
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 2: "Cannot connect to PostgreSQL"
```bash
# Check if PostgreSQL is running
# Mac: brew services list
# Linux: sudo service postgresql status
# Windows: Check Services

# Restart it if needed
```

### Issue 3: "Redis connection failed"
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not, start Redis
```

### Issue 4: Database migration errors
```bash
# Reset database
psql -U postgres -c "DROP DATABASE arbitrage_scanner;"
psql -U postgres -c "CREATE DATABASE arbitrage_scanner;"
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

## ✅ Success Checklist

- [ ] Node.js installed (v20+)
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Backend repo cloned
- [ ] Backend dependencies installed
- [ ] Database created and migrated
- [ ] Database seeded with exchanges
- [ ] Backend server running (Terminal 1)
- [ ] Worker process running (Terminal 2)
- [ ] Frontend created and dependencies installed
- [ ] Frontend running (Terminal 3)
- [ ] Can access http://localhost:3000
- [ ] Can register/login
- [ ] Can see dashboard with opportunities

---

## 📞 Need Help?

If you get stuck at any step, let me know:
1. What step you're on
2. What error message you see
3. What operating system you're using

I can also provide all the frontend files as a downloadable package if needed!

---

**Good luck! 🚀**
