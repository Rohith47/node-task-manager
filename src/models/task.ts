import mongoose, { Schema, Document, Model, model } from 'mongoose'
import { IUser } from './user';


export interface ITask extends Document {
    description: string;
    completed: boolean;
    owner: IUser['_id'];
}


const taskSchema = new Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});
const Task: Model<ITask> = model('Task',taskSchema);

module.exports = Task;  