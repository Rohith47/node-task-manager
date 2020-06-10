//const mongoose = require('mongoose');
import mongoose, { Schema, Document, Model, model } from 'mongoose'
const validator = require('validator');
import * as bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
const Task = require('./task');


const userSchema: Schema = new Schema({
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
        validate : {
            validator: (val: String) => {
                return !validator.isEmail(val)
            },
            msg: 'Email is invalid'            
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate : {
            validator: (val: String) => {
                return val.toLowerCase().includes('password')
            },
            msg: 'password cannot be \'password\''            
        },
    },
    age: {
        type: Number,
        default: 0,
        validate : {
            validator: (val: Number) => {
                return (val < 0)
            },
            msg: 'Age must be a positive number'            
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

interface Token {
    token: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    age?: number;
    tokens: Array<Token>;
    generateAuthToken(): string;
    toJSON(): JSON;

}

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
userSchema.statics.findByCredentials = async (email: string, password: string) => {
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
userSchema.pre<IUser>('save', async function(next) {
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


// model
export interface IUserModel extends Model<IUser> {
    // here we decalre statics
    
    findByCredentials(email: string, password: string): Model<IUser>
  }

const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;