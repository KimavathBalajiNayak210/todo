# Production-Grade Todo Application

A secure, scalable, and feature-rich Todo list application built with the PERN stack (PostgreSQL, Express, React, Node.js).

## 🚀 Features

- **Authentication**: Secure Login & Registration using JWT and Bcrypt.
- **Todo Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **Filtering**: Filter tasks by Status (Pending/Completed) and Priority (High/Medium/Low).
- **Security**: 
  - Protected API routes.
  - Ownership enforcement (Users only access their own data).
  - Passwords hashed via Bcrypt.
- **UX**: Loading states, responsive design, and error handling.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, PostgreSQL (Supabase), JWT.
- **Infrastructure**: Vercel (Frontend), Render (Backend).

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., Supabase)

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   npm install
   ```
2. Configure Environment:
   ```bash
   cp .env.example .env
   # Update .env with your DATABASE_URL and JWT_SECRET
   ```
3. Initialize Database:
   ```bash
   node src/utils/initDb.js
   ```
4. Start Server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Configure Environment:
   ```bash
   cp .env.example .env
   # Update .env with VITE_API_URL=http://localhost:5000/api
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)

### Todos
- `GET /api/todos` - List todos (supports `?status=` & `?priority=`)
- `POST /api/todos` - Create todo
- `GET /api/todos/:id` - Get specific todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## 🧠 Interview Guide

### Architecture Decisions
- **Separation of Concerns**: Frontend handles UI/State, Backend handles Data/Logic.
- **JWT Authentication**: chosen for stateless scalability over session-based auth.
- **Controller-Service Pattern**: Backend logic is isolated in controllers, keeping routes clean.

### Security
- **Parameter Injection Protection**: Used parameterized queries (`$1`, `$2`) to prevent SQL injection.
- **Middleware Pattern**: `authMiddleware` ensures centralized and consistent route protection.

### Scalability
- **Database**: PostgreSQL handles relations efficiently. Indexes can be added to `user_id` for faster lookups.
- **Stateless Backend**: The API is stateless, making it easy to scale horizontally on platforms like Render/AWS.
