/**
 * Student Resource Input Validators
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Uses express-validator to validate student creation, updates, and URL parameter ObjectIds.
 */

const { body, param } = require('express-validator');
const { validate } = require('./authValidator');

const validCourses = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Artificial Intelligence & Machine Learning',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Master of Business Administration (MBA)',
  'Master of Computer Applications (MCA)',
];

const createStudentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('usn')
    .trim()
    .notEmpty()
    .withMessage('Student USN is required (e.g. 1NH23CS106)')
    .toUpperCase(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Student email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 16, max: 70 })
    .withMessage('Age must be an integer between 16 and 70'),
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Enrolled course is required')
    .isIn(validCourses)
    .withMessage('Course must be an accredited engineering or graduate degree program'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  validate,
];

const updateStudentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid student ID format in URL parameter'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('usn')
    .optional()
    .trim()
    .toUpperCase(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('age')
    .optional()
    .isInt({ min: 16, max: 70 })
    .withMessage('Age must be an integer between 16 and 70'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('phone')
    .optional()
    .trim(),
  body('course')
    .optional()
    .trim()
    .isIn(validCourses)
    .withMessage('Invalid course provided'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  validate,
];

const mongoIdParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid resource ID format in URL parameter'),
  validate,
];

module.exports = {
  createStudentValidation,
  updateStudentValidation,
  mongoIdParamValidation,
};
