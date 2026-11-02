# Student Management REST API
**Author USN:** `1NH23CS106`  
**Technology Stack:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Helmet, CORS, Swagger

---

## 📌 Project Overview
A production-ready, industry-standard RESTful API for Student and User Management built using the MVC (Model-View-Controller) pattern with role-based access control (Admin & User), bcrypt password security, express-validator sanitization, pagination, text search, filtering, and OpenAPI / Swagger 3.0 documentation.

---

## 🚀 Quick Setup & Run (Local Development)

### 1. Clone repository & install dependencies
```bash
git clone <repo-url>
cd student-management-api
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_mgmt?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_student_management_api_usn_1NH23CS106_secure_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
PROJECT_USN=1NH23CS106
```

### 3. Start Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:5000`  
Swagger UI Docs: `http://localhost:5000/api-docs`

---

## 📁 Clean MVC Architecture

```
student-management-api/
├── config/
│   └── db.js                 # MongoDB Mongoose connection
├── controllers/
│   ├── authController.js     # User authentication & password reset
│   ├── studentController.js  # Student CRUD, search, filter, pagination
│   └── userController.js     # Admin user management
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token protection
│   ├── errorMiddleware.js    # 404 & Centralized error handler
│   └── roleMiddleware.js     # RBAC (Admin vs User)
├── models/
│   ├── User.js               # User schema with bcrypt hash & methods
│   └── Student.js            # Student schema with USN (1NH23CS106)
├── routes/
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── studentRoutes.js      # /api/students endpoints
│   └── userRoutes.js         # /api/users endpoints
├── validators/
│   ├── authValidator.js      # Validation rules for auth
│   └── studentValidator.js   # Validation rules for students
├── utils/
│   ├── generateToken.js      # JWT signing utility
│   └── asyncHandler.js       # Higher-order async catch wrapper
├── docs/
│   └── swagger.js            # OpenAPI 3.0 specification & Swagger UI
├── .env.example              # Environment variables template
├── package.json              # Project dependencies & scripts
├── postman_collection.json   # Ready-to-import Postman collection
└── server.js                 # Express application entry point
```

---

## 🔑 Default Roles & Access Control
- **Admin**: Full access (Create, Read, Update, Delete students, Manage system users).
- **User**: Read student records, manage own profile and change password.

---

## 🧪 Postman Testing
Import `postman_collection.json` into Postman:
1. Run `POST /api/auth/login` with admin credentials.
2. The collection variable `{{token}}` will authorize protected requests automatically.
3. Test `GET /api/students?search=1NH23CS106` to inspect search and pagination.
