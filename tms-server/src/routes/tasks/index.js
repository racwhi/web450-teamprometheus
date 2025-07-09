
const express = require('express');
const router = express.Router();
const Task = require('../../models/task');
const { error } = require('ajv/dist/vocabularies/applicator/dependencies');
const mongoose = require('mongoose');

//GET: list
router.get('/', async (req, res, next) => {
     try {
          const tasks = await Task.find();
          res.status(200).json(tasks);  
     } 
     catch (error) {
     res.status(500).json({message: "An error occurred", error:error})
     }
});

// Get all tasks (Read all)
router.get('/tasks', (req, res) => {
  res.json(tasks);
});

//GET: get by id
router.get('/:id', async (req, res, next) => {
     try {
          const id = req.params.id;
          const task = await Task.findOne({ _id: id});
          res.status(200).json(task); 
          } 
     catch (error) {
          res.status(500).json({message: "An error occurred", error:error})
          }
});

//POST: create
router.post('/', async (req, res, next) => {
      try {
          const task = new Task(req.body);
          const savedTask = task.save();//const savedTask = await task.save();
          res.status(200).json(savedTask); 
          } 
     catch (error) {
          res.status(500).json({message: "An error occurred", error:error})
          }
});

//PUT: update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('PUT request to /api/task/' + id);
  console.log('Payload:', req.body);

    // Validate ObjectId for id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Task ID' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task [id=' + id + ']:', err);  
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,      // provide error message
      name: err.name,          // include error type
      errors: err.errors       // show validation errors if present
    });
  }
});



//Delete: delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId for id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Task ID' });
  }

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: `Task "${task.title}" deleted successfully.` });
  } catch (error) {
    console.error('DELETE /api/task/:id error:', error.message);
    res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
});
module.exports = router;