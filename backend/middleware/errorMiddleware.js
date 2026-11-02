/**
 * Centralized Error Handling Middleware
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Catches 404s, Mongoose CastErrors, ValidationErrors, duplicate keys, and unexpected server errors.
 */

// 404 Not Found Handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - Cannot ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format for resource: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[duplicateField] : '';
    message = `Duplicate value '${value}' entered for ${duplicateField}. Must be unique.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorDetails = Object.values(err.errors).map((val) => val.message);
    message = `Validation Failed: ${errorDetails.join(', ')}`;
  }

  // Handle JWT Malformed / Expired
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
