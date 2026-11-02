/**
 * Authentication Middleware (JWT Protect)
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Validates incoming Bearer tokens and attaches authenticated user profile to req.user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature and expiration
      const secret = process.env.JWT_SECRET || 'fallback_secret_student_api_1NH23CS106';
      const decoded = jwt.verify(token, secret);

      // Fetch user from DB excluding password
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
      console.error('[Auth Error]:', error.message);
      return res.status(401).json({
        success: false,
        message:
          error.name === 'TokenExpiredError'
            ? 'Session expired. Please log in again'
            : 'Not authorized. Invalid or tampered token',
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

module.exports = { protect };
