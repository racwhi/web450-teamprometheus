// tms-server/src/routes/projects/index.js

const express = require('express')
const router  = express.Router()
const { Project } = require('../../models/project')
const { Task } = require('../../models/task')

// GET: list all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find()
    res.status(200).json(projects)
  }
  catch (error) {
    res.status(500).json({ message: 'An error occurred', error })
  }
})

// GET: get one project by id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    res.status(200).json(project)
  }
  catch (error) {
    res.status(500).json({ message: 'An error occurred', error })
  }
})

// POST: create
router.post('/', async (req, res) => {
  try {
    // create a new Project instance
    const project = new Project(req.body);
    // save it to the database
    const saved = await project.save();
    // on success, return 201 + the saved doc
    return res.status(201).json(saved);
  } catch (error) {
    console.error('Could not create project:', error);
    // return a 400 (bad request) with the real error message
    return res.status(400).json({ message: error.message });
  }
})



module.exports = router
