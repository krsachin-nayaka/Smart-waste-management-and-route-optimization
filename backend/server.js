/**
 * Server Entry Point
 * Project: Professional Student Management REST API
 * Author: Sachin (USN: 1NH23CS106)
 * Tech Stack: Node.js, Express.js, MongoDB, Mongoose, JWT, Helmet, CORS
 */

require('dotenv').config();
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
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// 3. HTTP Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiting to prevent brute-force and DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
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

// 6. Root Health & Identification Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management REST API is operating normally',
    project: 'Student Management System',
    authorUSN: '1NH23CS106',
    documentation: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

// 7. Swagger Documentation UI
setupSwagger(app);

// 8. Mount RESTful API Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// 9. Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

// 10. Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🎓 Student Management REST API Running on Port ${PORT}`);
  console.log(` 👤 Project Author USN: 1NH23CS106`);
  console.log(` 📚 Documentation: http://localhost:${PORT}/api-docs`);
  console.log(` ⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
