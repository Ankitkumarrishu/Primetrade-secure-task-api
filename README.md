# PrimeTrade AI – Scalable REST API & Full-Stack Portal

This project is a high-performance, secure, and scalable REST API built with Node.js, Express, and MongoDB, featuring a premium dark-themed frontend portal.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)

### 2. Installation
```bash
# Clone the repository
# git clone [your-repo-url]

# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the root (use `.env.example` as a template):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primetrade_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run the Application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```
The server will start on `http://localhost:5000`.

## 📖 API Documentation
Once the server is running, visit:
- **Interactive Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## 🛠 Features
- **Secure Authentication**: JWT-based auth with password hashing (bcryptjs).
- **Role-Based Access (RBAC)**: Distinct permissions for `user` and `admin` roles.
- **Task Management**: Full CRUD operations with filtering and pagination.
- **Security First**: 
  - Helmet for secure HTTP headers.
  - Express Rate Limit to prevent Brute-force attacks.
  - Input sanitization and validation (express-validator).
- **Premium UI**: Responsive dark-themed dashboard with glassmorphism design.

## 📦 Project Structure
- `src/models`: Mongoose schemas.
- `src/controllers`: API logic.
- `src/routes`: API versioned endpoints.
- `src/middleware`: Auth, error handling, and validation.
- `frontend/`: Vanilla JS single-page style portal.
