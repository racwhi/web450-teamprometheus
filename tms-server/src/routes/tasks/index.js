const express    = require('express');
const createError= require('http-errors');
const mongoose   = require('mongoose');
const Task       = require('../../models/task');

const router = express.Router();

// GET /api/task
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/task/:id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid Task ID'));
  }
  try {
    const task = await Task.findById(id);
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// POST /api/task
router.post('/', async (req, res, next) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// PUT /api/task/:id
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid Task ID'));
  }
  try {
    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return next(createError(404, 'Task not found'));
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/task/:id
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid Task ID'));
  }
  try {
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return next(createError(404, 'Task not found'));
    }
    res.json({ message: `Task "${deleted.title}" deleted successfully.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;