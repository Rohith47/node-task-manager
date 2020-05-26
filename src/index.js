const express = require('express');
require('./db/mongoose');
const userRouter =  require("./routers/user");
const taskRouter =  require("./routers/task");

const app = express();
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

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5ecd8e6c61b201654c5454e7')
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    const user = User.findById('5ecd8e4f61b201654c5454e5');
    await (await user.populate('tasks')).execPopulate();
    console.log(user.tasks);
}

main()