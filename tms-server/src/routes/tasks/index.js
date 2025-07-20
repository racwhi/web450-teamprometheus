const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Task     = require('../../models/task');

// GET /api/tasks
router.get('/', async (req, res, next) => {
  console.log('🛎  HIT /api/tasks →', req.query);

  try {
    const { dueDate, q, priority } = req.query;
    const filters = {};

    // text search
    if (q) {
      filters.$or = [
        { title:       new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    // priority filter
    if (priority) {
      filters.priority = priority;
    }

    // due date filter
    if (dueDate) {
      const [y, m, d] = dueDate.split('-').map(Number);
      const end = new Date(y, m - 1, d + 1, 0, 0, 0);
      console.log(`→ including tasks due before ${end.toISOString()}`);
      filters.dueDate = { $lt: end };
    }

   
    const tasks = await Task.find(filters);
    
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid Task ID');
    err.status = 400;
    return next(err);
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      const notFound = new Error('Task not found');
      notFound.status = 404;
      return next(notFound);
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid Task ID');
    err.status = 400;
    return next(err);
  }

  try {
    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      const notFound = new Error('Task not found');
      notFound.status = 404;
      return next(notFound);
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid Task ID');
    err.status = 400;
    return next(err);
  }

  try {
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      const notFound = new Error('Task not found');
      notFound.status = 404;
      return next(notFound);
    }
    res.status(200).json({ message: `Task "${deleted.title}" deleted.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
