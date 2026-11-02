/**
 * Student Resource Routes
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Base Route: /api/students
 */

const express = require('express');
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  patchStudent,
  deleteStudent,
} = require('../controllers/studentController');

const {
  createStudentValidation,
  updateStudentValidation,
  mongoIdParamValidation,
} = require('../validators/studentValidator');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All student routes require authentication
router.use(protect);

// GET all students (Users & Admins) | POST student (Admin only)
router
  .route('/')
  .get(getAllStudents)
  .post(authorize('admin'), createStudentValidation, createStudent);

// Student resource operations by ID
router
  .route('/:id')
  .get(mongoIdParamValidation, getStudentById)
  .put(authorize('admin'), updateStudentValidation, updateStudent)
  .patch(authorize('admin'), mongoIdParamValidation, patchStudent)
  .delete(authorize('admin'), mongoIdParamValidation, deleteStudent);

module.exports = router;
