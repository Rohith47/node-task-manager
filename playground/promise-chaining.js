require('../src/db/mongoose');
const User = require('../src/models/user');

// 5ec698ea28fd7b36980a7552

// User.findByIdAndUpdate('5ec698ea28fd7b36980a7552', {age: 1}).then((user) => {
//     console.log(user);
//     return User.countDocuments({age : 1});
// }).then((user) => {
//     console.log(user);
// }).catch((err) => {
//     console.log(err);
// })

const updateAgeAndCount = async (id, age) => {
    const result = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count;
};

updateAgeAndCount('5ec15e311379a332487e6e6e', 2).then((count) => {
    console.log(count);
}).catch((err) => {
    console.log(err);
})