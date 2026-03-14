const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all tasks (admin: all tasks, user: own tasks only)
 * @route   GET /api/v1/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Users only see their own tasks; admins see all
    if (req.user.role !== 'admin') {
      filter.owner = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(
      new ApiResponse(200, {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      }, 'Tasks fetched successfully.')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name email role');

    if (!task) {
      return next(new ApiError(404, 'Task not found.'));
    }

    // Allow access only to owner or admin
    if (task.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You are not authorized to view this task.'));
    }

    res.status(200).json(new ApiResponse(200, { task }, 'Task fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
    });

    await task.populate('owner', 'name email role');

    res.status(201).json(new ApiResponse(201, { task }, 'Task created successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, 'Task not found.'));
    }

    // Allow updates only to owner or admin
    if (task.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You are not authorized to update this task.'));
    }

    const { title, description, status, priority, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    ).populate('owner', 'name email role');

    res.status(200).json(new ApiResponse(200, { task }, 'Task updated successfully.'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ApiError(404, 'Task not found.'));
    }

    // Allow delete only to owner or admin
    if (task.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You are not authorized to delete this task.'));
    }

    await task.deleteOne();

    res.status(200).json(new ApiResponse(200, {}, 'Task deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
