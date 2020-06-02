const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Email is invalid')
            }
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('password cannot be \'password\'');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(val){
            if(val < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Virtual refrence to tasks Collection
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisismyfirsttoken');

    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    return userObj;
}

// custom function to find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email}) // emial:email - shorthand is used.

    if (!user) {
        throw new Error('Unable to login')
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Unable to login');
    }
    return user;
}

// add a pre validator / function, just before saving the user.
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        // hash the user password using bcrypt
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();  // required to let mongoose know, custom changes are done, before saving
})

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id});
    next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;