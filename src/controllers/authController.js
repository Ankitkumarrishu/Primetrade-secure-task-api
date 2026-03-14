const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, 'User with this email already exists.'));
    }

    // Only allow admin creation if requester is an admin (or no admin exists yet)
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = generateToken(user._id);

    res.status(201).json(
      new ApiResponse(201, { user, token }, 'User registered successfully.')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password.'));
    }

    if (!user.isActive) {
      return next(new ApiError(401, 'Account is deactivated. Please contact support.'));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ApiError(401, 'Invalid email or password.'));
    }

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(200, { user, token }, 'Login successful.')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(
      new ApiResponse(200, { user: req.user }, 'User profile fetched successfully.')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/v1/auth/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(
      new ApiResponse(200, { users, count: users.length }, 'Users fetched successfully.')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, getAllUsers };
