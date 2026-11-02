/**
 * JWT Token Generator
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Generates signed JSON Web Tokens for authenticated users
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a JWT with user id and role payload
 * @param {string} id - User ID
 * @param {string} role - User role ('admin' | 'user')
 * @returns {string} Signed JWT token string
 */
const generateToken = (id, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_student_api_1NH23CS106';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

module.exports = generateToken;
