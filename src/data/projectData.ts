/**
 * Project Data & Codebase Registry
 * Project: Student Management REST API (USN: 1NH23CS106)
 */

export interface ProjectFile {
  name: string;
  path: string;
  folder: string;
  language: string;
  description: string;
  whyNeeded: string;
  code: string;
  lineExplanations: { lines: string; explanation: string }[];
}

export const USN_CODE = '1NH23CS106';

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'package.json',
    path: 'package.json',
    folder: 'root',
    language: 'json',
    description: 'Manifest defining project dependencies, metadata, and execution scripts.',
    whyNeeded: 'Node.js requires package.json to track installed packages like express, mongoose, bcryptjs, and to run scripts like npm run dev.',
    code: `{
  "name": "student-management-api",
  "version": "1.0.0",
  "description": "Professional Student Management REST API with Node.js, Express, MongoDB, JWT & Role-Based Access Control - USN 1NH23CS106",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seed.js"
  },
  "keywords": [
    "nodejs",
    "express",
    "mongodb",
    "mongoose",
    "jwt",
    "student-management",
    "rest-api",
    "1NH23CS106"
  ],
  "author": "Sachin (USN: 1NH23CS106)",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "express-validator": "^7.2.1",
    "helmet": "^8.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.12.0",
    "morgan": "^1.12.1",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}`,
    lineExplanations: [
      { lines: 'Line 2-6', explanation: 'Specifies application name, version, and server.js as the primary entry point.' },
      { lines: 'Line 7-11', explanation: '"scripts" defines CLI shortcuts: "start" runs node in production, "dev" uses nodemon for auto-reload.' },
      { lines: 'Line 21-33', explanation: 'Lists production dependencies: Express (server framework), Mongoose (ODM), JWT & bcryptjs (auth), Helmet & CORS (security).' },
      { lines: 'Line 34-36', explanation: 'nodemon is placed under devDependencies so it is not bundled into production containers.' },
    ],
  },
  {
    name: '.env.example',
    path: '.env.example',
    folder: 'root',
    language: 'bash',
    description: 'Template outlining necessary environment variables without revealing secret values.',
    whyNeeded: 'Prevents accidentally committing secrets (database passwords, JWT secret) to GitHub while giving teammates clear instructions on what variables to configure.',
    code: `# Server Port
PORT=5000

# Environment Mode (development | production | test)
NODE_ENV=development

# MongoDB Connection String (Atlas URI or local mongodb://localhost:27017/student_management_db)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_management_1NH23CS106?retryWrites=true&w=majority

# JWT Authentication Secret (use a 64+ char random string in production)
JWT_SECRET=super_secret_jwt_key_student_management_api_usn_1NH23CS106_secure_key

# JWT Token Expiration (e.g. 1d, 7d, 24h)
JWT_EXPIRES_IN=7d

# Allowed Client Origin for CORS
CLIENT_URL=http://localhost:3000

# Project Metadata
PROJECT_USN=1NH23CS106`,
    lineExplanations: [
      { lines: 'Line 2', explanation: 'PORT=5000 defines which local port the Express server listens on.' },
      { lines: 'Line 8', explanation: 'MONGO_URI contains the database connection string with credentials, cluster address, and db name.' },
      { lines: 'Line 11-14', explanation: 'JWT_SECRET signs and verifies JWT cryptographic signatures. JWT_EXPIRES_IN defines session duration.' },
    ],
  },
  {
    name: 'server.js',
    path: 'server.js',
    folder: 'root',
    language: 'javascript',
    description: 'Central server file that boots Express, connects to DB, mounts security middleware, routes, and error handling.',
    whyNeeded: 'Acts as the orchestrator of your backend application. All incoming HTTP requests arrive here first.',
    code: `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Database configuration
const connectDB = require('./config/db');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');

// Swagger API Documentation
const { setupSwagger } = require('./docs/swagger');

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express App
const app = express();

// Connect to MongoDB Database
connectDB();

// 1. Security Middlewares
app.use(helmet());

// 2. CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// 3. HTTP Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiting to prevent brute-force and DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes',
  },
});
app.use('/api', apiLimiter);

// 5. Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Swagger Documentation UI
setupSwagger(app);

// 7. Mount RESTful API Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// 8. Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🎓 Student Management REST API Running on Port \${PORT}\`);
  console.log(\`👤 Author USN: 1NH23CS106\`);
  console.log(\`📚 Documentation: http://localhost:\${PORT}/api-docs\`);
});`,
    lineExplanations: [
      { lines: 'Line 1', explanation: 'dotenv loads key-value pairs from .env into Node process.env.' },
      { lines: 'Line 2-6', explanation: 'Imports core HTTP infrastructure: express, cors, helmet, morgan, rate-limit.' },
      { lines: 'Line 22', explanation: 'connectDB() establishes the connection to MongoDB before traffic is accepted.' },
      { lines: 'Line 25-28', explanation: 'helmet() sets HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.).' },
      { lines: 'Line 53-56', explanation: 'Mounts modular routers onto specific path prefixes (/api/auth, /api/students, /api/users).' },
      { lines: 'Line 58-60', explanation: 'Centralized error handlers MUST be declared last so unhandled errors trickle down to them.' },
    ],
  },
  {
    name: 'config/db.js',
    path: 'config/db.js',
    folder: 'config',
    language: 'javascript',
    description: 'MongoDB connection manager using Mongoose.',
    whyNeeded: 'Decouples database initialization logic from server.js for cleaner testability and maintenance.',
    code: `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(\`[MongoDB Connected]: Host -> \${conn.connection.host} (Database: \${conn.connection.name})\`);
  } catch (error) {
    console.error(\`[MongoDB Connection Error]: \${error.message}\`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;`,
    lineExplanations: [
      { lines: 'Line 5-8', explanation: 'mongoose.connect() reads MONGO_URI and establishes connection pooling with a 5000ms timeout.' },
      { lines: 'Line 10', explanation: 'Prints the connected host name and database name to the terminal upon successful handshake.' },
      { lines: 'Line 12-16', explanation: 'Catches connection errors; exits with status 1 in production to alert container orchestrators (Docker/K8s).' },
    ],
  },
  {
    name: 'models/User.js',
    path: 'models/User.js',
    folder: 'models',
    language: 'javascript',
    description: 'Mongoose schema for user accounts with bcrypt pre-save hashing and role validation.',
    whyNeeded: 'Enforces data integrity, unique emails, automatic password hashing before DB writes, and prevents returning password hashes.',
    code: `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role. Allowed roles are: admin, user',
      },
      default: 'user',
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Strips sensitive fields from JSON serialization
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);`,
    lineExplanations: [
      { lines: 'Line 28', explanation: 'select: false ensures user.password is never returned in find() queries unless explicitly requested.' },
      { lines: 'Line 30-36', explanation: 'role enum limits permissions strictly to "admin" or "user", defaulting to "user".' },
      { lines: 'Line 43-48', explanation: 'Pre-save middleware hashes plain-text passwords using a bcrypt salt cost factor of 10.' },
      { lines: 'Line 56-62', explanation: 'Custom toJSON method deletes password and tokens before returning the document to the client.' },
    ],
  },
  {
    name: 'models/Student.js',
    path: 'models/Student.js',
    folder: 'models',
    language: 'javascript',
    description: 'Mongoose schema for student records featuring USN (e.g. 1NH23CS106), course enum, and indexes.',
    whyNeeded: 'Validates student details, prevents duplicate USN or Email entries, and indexes search terms for fast queries.',
    code: `const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    usn: {
      type: String,
      required: [true, 'Student USN is required (e.g. 1NH23CS106)'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      match: [
        /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/i,
        'Please enter a valid USN format (e.g., 1NH23CS106)',
      ],
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Student age is required'],
      min: [16, 'Age must be at least 16 years'],
      max: [70, 'Age cannot exceed 70 years'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Enrolled course is required'],
      trim: true,
      index: true,
      enum: [
        'Computer Science & Engineering',
        'Information Science & Engineering',
        'Artificial Intelligence & Machine Learning',
        'Electronics & Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Master of Business Administration (MBA)',
        'Master of Computer Applications (MCA)',
      ],
    },
    address: {
      type: String,
      required: [true, 'Residential address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

studentSchema.index({ name: 'text', usn: 'text', course: 'text' });

module.exports = mongoose.model('Student', studentSchema);`,
    lineExplanations: [
      { lines: 'Line 11-22', explanation: 'USN field validation enforces standard university registration format (e.g., 1NH23CS106) with unique indexing.' },
      { lines: 'Line 52-64', explanation: 'Course field enforces allowed degree programs via enum validation.' },
      { lines: 'Line 78', explanation: 'Text index on name, usn, and course empowers high-speed text search across large datasets.' },
    ],
  },
  {
    name: 'middleware/authMiddleware.js',
    path: 'middleware/authMiddleware.js',
    folder: 'middleware',
    language: 'javascript',
    description: 'Verifies incoming Authorization Bearer JWTs and populates req.user.',
    whyNeeded: 'Guarantees that protected API endpoints can only be accessed by authenticated users with a valid token.',
    code: `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.name === 'TokenExpiredError'
          ? 'Session expired. Please log in again'
          : 'Not authorized. Invalid token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided in request header',
    });
  }
};

module.exports = { protect };`,
    lineExplanations: [
      { lines: 'Line 7-9', explanation: 'Checks for the standard HTTP header: "Authorization: Bearer <token>".' },
      { lines: 'Line 10-12', explanation: 'Splits out the raw token and verifies signature & expiry using jwt.verify().' },
      { lines: 'Line 21', explanation: 'Attaches the authenticated user object directly to req.user for use in controllers.' },
    ],
  },
  {
    name: 'middleware/roleMiddleware.js',
    path: 'middleware/roleMiddleware.js',
    folder: 'middleware',
    language: 'javascript',
    description: 'Role-Based Access Control (RBAC) middleware verifying user roles.',
    whyNeeded: 'Restricts sensitive endpoints (such as deleting students or editing user roles) strictly to Administrators.',
    code: `const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to permission verification',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: \`Forbidden: Role '\${req.user.role}' is not authorized to access this resource. Required: [\${roles.join(', ')}]\`,
      });
    }

    next();
  };
};

module.exports = { authorize };`,
    lineExplanations: [
      { lines: 'Line 1', explanation: 'Higher-order function that accepts permitted roles: authorize("admin").' },
      { lines: 'Line 9-14', explanation: 'Compares req.user.role with allowed roles. If unauthorized, returns HTTP 403 Forbidden.' },
    ],
  },
  {
    name: 'middleware/errorMiddleware.js',
    path: 'middleware/errorMiddleware.js',
    folder: 'middleware',
    language: 'javascript',
    description: 'Centralized error handler catching 404s, invalid Mongo IDs, duplicate keys, and validation exceptions.',
    whyNeeded: 'Ensures the API never crashes silently or returns unhandled HTML errors to client applications.',
    code: `const notFound = (req, res, next) => {
  const error = new Error(\`Resource Not Found - Cannot \${req.method} \${req.originalUrl}\`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = \`Invalid ID format for resource: \${err.value}\`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = \`Duplicate value entered for \${field}. Must be unique.\`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const details = Object.values(err.errors).map((val) => val.message);
    message = \`Validation Failed: \${details.join(', ')}\`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };`,
    lineExplanations: [
      { lines: 'Line 1-5', explanation: 'notFound handler intercepts any URL route that does not match an Express endpoint and formats a 404.' },
      { lines: 'Line 11-14', explanation: 'Catches invalid MongoDB ObjectId inputs (CastError) and converts them to HTTP 400.' },
      { lines: 'Line 16-20', explanation: 'Catches MongoDB 11000 duplicate key errors and returns clear HTTP 409 Conflict messages.' },
    ],
  },
  {
    name: 'controllers/studentController.js',
    path: 'controllers/studentController.js',
    folder: 'controllers',
    language: 'javascript',
    description: 'Business logic for Student CRUD, multi-criteria filtering, regex searching, and pagination.',
    whyNeeded: 'Keeps routes lightweight while housing the exact database query transformations and business rules.',
    code: `const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/students (Admin Only)
const createStudent = asyncHandler(async (req, res) => {
  const { name, usn, email, age, gender, phone, course, address } = req.body;

  const existingUSN = await Student.findOne({ usn: usn.toUpperCase() });
  if (existingUSN) {
    return res.status(409).json({
      success: false,
      message: \`A student with USN '\${usn.toUpperCase()}' already exists\`,
    });
  }

  const student = await Student.create({
    name,
    usn: usn.toUpperCase(),
    email,
    age,
    gender,
    phone,
    course,
    address,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Student record created successfully',
    data: student,
  });
});

// GET /api/students (Search, Filter, Pagination, Sorting)
const getAllStudents = asyncHandler(async (req, res) => {
  const { search, course, gender, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { usn: { $regex: search, $options: 'i' } },
    ];
  }
  if (course) query.course = course;
  if (gender) query.gender = gender;

  const sortDirection = order === 'asc' ? 1 : -1;
  const sortOptions = { [sortBy]: sortDirection };

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('createdBy', 'name email role')
    .sort(sortOptions)
    .skip(skip)
    .limit(parsedLimit);

  res.status(200).json({
    success: true,
    message: 'Students fetched successfully',
    data: {
      students,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / parsedLimit) || 1,
        limit: parsedLimit,
        hasPrev: parsedPage > 1,
        hasNext: parsedPage < Math.ceil(total / parsedLimit),
      },
    },
  });
});

module.exports = { createStudent, getAllStudents };`,
    lineExplanations: [
      { lines: 'Line 5-28', explanation: 'createStudent verifies USN uniqueness before creating the student and tagging createdBy.' },
      { lines: 'Line 35-43', explanation: 'Constructs dynamic MongoDB queries supporting case-insensitive regex for Name & USN search.' },
      { lines: 'Line 49-56', explanation: 'Implements skip-and-limit pagination math and returns comprehensive pagination metadata.' },
    ],
  },
];

export const STAGES = [
  {
    id: 1,
    title: 'Stage 1: Setup & Architecture',
    subtitle: 'Node.js initialization, dependencies, directory tree, & environment',
    status: 'current',
    summary: 'Initialize the project with npm, set up package.json, configure environment variables, and create the MVC folder structure.',
  },
  {
    id: 2,
    title: 'Stage 2: Database & Models',
    subtitle: 'Mongoose connection, User & Student schemas with USN 1NH23CS106',
    status: 'upcoming',
    summary: 'Configure MongoDB connection with resilient pooling. Design User and Student Mongoose models with validation, pre-save hooks, and indexes.',
  },
  {
    id: 3,
    title: 'Stage 3: JWT Auth & RBAC',
    subtitle: 'bcrypt password hashing, token generation, protect & role middlewares',
    status: 'upcoming',
    summary: 'Implement secure registration, login with bcrypt password matching, JWT signing, authentication middleware, and role authorization (Admin vs User).',
  },
  {
    id: 4,
    title: 'Stage 4: Student CRUD & Queries',
    subtitle: 'Create, Read, Update, Delete, Search, Course Filter, Pagination & Sort',
    status: 'upcoming',
    summary: 'Implement all Student REST endpoints with query params: search by USN/name, filter by course, sort asc/desc, and skip/limit pagination.',
  },
  {
    id: 5,
    title: 'Stage 5: User Management & Security',
    subtitle: 'Admin user control, profile updates, Helmet, CORS & Rate Limiting',
    status: 'upcoming',
    summary: 'Build admin endpoints to inspect and manage system users. Lock down profile updates to prevent role escalation. Enforce Helmet headers and rate limits.',
  },
  {
    id: 6,
    title: 'Stage 6: Swagger Docs & Postman',
    subtitle: 'OpenAPI 3.0 specification & Postman collection export',
    status: 'upcoming',
    summary: 'Mount Swagger UI on /api-docs and generate importable JSON Postman collection for all API endpoints.',
  },
  {
    id: 7,
    title: 'Stage 7: Deployment & Interview Q&A',
    subtitle: 'MongoDB Atlas, Render/Railway hosting, CI/CD & technical interview prep',
    status: 'upcoming',
    summary: 'Step-by-step instructions to deploy the API to Render or Railway with MongoDB Atlas, and common interview questions with answers.',
  },
];
