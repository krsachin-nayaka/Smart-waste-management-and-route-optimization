/**
 * User Management Controller (Admin Only)
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Handles listing, fetching, updating, and removing system user accounts.
 */

const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all registered users
// @route   GET /api/users
// @access  Private / Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    count: users.length,
    data: users,
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private / Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID '${req.params.id}' not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

// @desc    Update user details or role (Admin action)
// @route   PUT /api/users/:id
// @access  Private / Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID '${req.params.id}' not found`,
    });
  }

  // Check email collision
  if (req.body.email && req.body.email !== user.email) {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already in use by another user',
      });
    }
    user.email = req.body.email;
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.role) {
    if (!['admin', 'user'].includes(req.body.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided. Role must be either "admin" or "user"',
      });
    }
    user.role = req.body.role;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private / Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID '${req.params.id}' not found`,
    });
  }

  // Prevent admin from deleting their own active account
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Self-deletion prohibited: You cannot delete your own active administrator account',
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `User account '${user.name}' (${user.email}) deleted successfully`,
    data: { id: req.params.id },
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
