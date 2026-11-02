/**
 * Authentication Controller
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Handles registration, login, logout, profile updates, and password lifecycle.
 */

const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists',
    });
  }

  // Create user (password will be automatically hashed by UserSchema pre-save)
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
  });

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
    });
  }

  // Verify password using schema method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
    });
  }

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

// @desc    Logout user / invalidate session
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please clear the client authorization header/storage.',
  });
});

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User profile fetched successfully',
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Security enforcement: Users CANNOT change their own role via profile update!
  if (req.body.role) {
    return res.status(403).json({
      success: false,
      message: 'Security Violation: Modifying user role via profile update is prohibited',
    });
  }

  // Update permitted fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) {
    // Verify email uniqueness if changed
    if (req.body.email !== user.email) {
      const emailTaken = await User.findOne({ email: req.body.email });
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: 'The requested email address is already in use',
        });
      }
      user.email = req.body.email;
    }
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Validate current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password provided is incorrect',
    });
  }

  // Set new password (will be re-hashed by pre('save'))
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in with your new password.',
  });
});

// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return standard message to prevent email enumeration attacks
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset token has been dispatched',
    });
  }

  // Generate 20-byte random hex token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token for database storage
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour validity

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully',
    data: {
      resetToken,
      expiresIn: '1 hour',
      instructions: 'Send POST to /api/auth/reset-password with { token, newPassword }',
    },
  });
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token',
    });
  }

  // Update password and clear reset fields
  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password has been successfully reset. You may now log in.',
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
