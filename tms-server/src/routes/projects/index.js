const express = require('express');
const router = express.Router();
const {Projects, Project} = require('../../models/project');

/*router.get('/', async (req, res, next) => {
     try {
const project = await Projects.find({});
res.send(project); } 
catch (err) {
console.error(`Error while getting projects: ${err}`);
next(err); 
}
});*/

//GET: list
router.get('/', async (req, res, next) => {
     try {
          const projects = await Project.find();
          res.status(200).json(projects);  
     } 
     catch (error) {
     res.status(500).json({message: "An error occurred", error:error})
     }
});

//GET: get by id
router.get('/:id', async (req, res, next) => {
     try {
          const id = req.params.id;
          const project = await Project.findOne({ _id: id});
          res.status(200).json(project); 
          } 
     catch (error) {
          res.status(500).json({message: "An error occurred", error:error})
          }
});

//POST: create
router.post('/', async (req, res, next) => {
      try {
          const task = new Project(req.body);
          const savedProject = await project.save();
          res.status(200).json(savedProject); 
          } 
     catch (error) {
          res.status(500).json({message: "An error occurred", error:error})
          }
});



module.exports = router;