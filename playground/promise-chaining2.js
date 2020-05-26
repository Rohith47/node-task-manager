require('../src/db/mongoose');
const Task = require('../src/models/task');

// 5ec698ea28fd7b36980a7552

// Task.findByIdAndDelete('5ec15e9bf0e76f16645f8fcf').then((task) => {
//     console.log(task);
//     return Task.countDocuments({completed : false});
// }).then((task) => {
//     console.log(task);
// }).catch((err) => {
//     console.log(err);
// })

const deleteAndUpdate = async (id, age) => {
    const result = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed : false});
    return count;
};

deleteAndUpdate('5ec69b6ae75a4849bcb25b8a').then((count) => {
    console.log(count);
}).catch((err) => {
    console.log(err);
})