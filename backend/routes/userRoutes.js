/**
 * User Administrative Routes
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Base Route: /api/users (Restricted to Administrator role)
 */

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { mongoIdParamValidation } = require('../validators/studentValidator');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Enforce authentication & Administrator role for all /api/users endpoints
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(mongoIdParamValidation, getUserById)
  .put(mongoIdParamValidation, updateUser)
  .delete(mongoIdParamValidation, deleteUser);

module.exports = router;
