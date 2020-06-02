const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
;
const Task = require("../models/task");

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


// Get /tasks
// GET tasks/limit=10&skip=0
// GET tasks/sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;  // -1 is desc and 1 is for asc
    }
    try {
       // const tasks = await Task.find({ owner: req.user._id }); // Normal way
       await req.user.populate({
           path: 'tasks',
           match,
           options: {
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
           }
       }).execPopulate(); // Using virtual field
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            res.status(404).send('Task not found!!'); 
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();  
    }
   
});



router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isOperationAllowed = updates.every(update => allowedUpdates.includes(update));

    if(!isOperationAllowed) {
        return res.status(400).send({error: 'Invalid Fileds!'});
    }
    try {
       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
       //const task = await Task.findById(req.params.id);
       const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Task not found!!'); 
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send(e);  
    }
   
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('No Task Found!')
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;