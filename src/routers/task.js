const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
;
const Task = require("../models/task");

router.post('/tasks', auth, async (req, res) => {
    
    //task.owner = req.user._id;
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

router.get('/tasks', async (req,res) => {

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send('Internal Server Error!!');
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).send('Task not found!!'); 
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();  
    }
   
});



router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isOperationAllowed = updates.every(update => allowedUpdates.includes(update));

    if(!isOperationAllowed) {
        return res.status(400).send({error: 'Invalid Fileds!'});
    }
    try {
       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
       const task = await Task.findById(req.params.id);
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

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send('No Task Found!')
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = router;