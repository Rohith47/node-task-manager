import express = require('express');
import './db/mongoose';
import { Application } from 'express'
// const express = require('express');
// require('./db/mongoose');
const userRouter =  require("./routers/user");
const taskRouter =  require("./routers/task");

const app: Application = express();
const port = process.env.PORT || 3002;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled!!')
//     } else {
//         next();
//     }
// });

// app.use((req, res, next) => {
//     res.status(503).send()
// });

app.use(express.json());

app.use([userRouter, taskRouter]);


app.listen(port, () => {
    console.log('Server is up on port ', port);
    
});


const multer = require('multer');

const upload = new multer({
    dest: 'images'
});

app.post('/upload', upload.single('upload'), (req,res) => {
    res.send();
});


