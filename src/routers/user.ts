import express = require('express');
import {Request, Response} from 'express';
const router: express.Router = express.Router();
//const User = require("../models/user");
import User, { IUser } from '../models/user'
const auth = require('../middleware/auth');
import * as multer from "multer";
import { Model } from 'mongoose';

router.post('/users', async (req: Request, res: Response) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req: Request, res: Response) => {
    try {
        const user: Model<IUser> = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch(err) {
        res.status(400).send(err);
    }
});


router.post('/users/logout', auth, async (req: Request, res: Response) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req: Request, res: Response) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});


router.get('/users/me', auth, async (req: Request, res: Response) => {
    res.send(req.user);
})

// not required
// router.get('/users/:id', async (req, res) => {

//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             res.status(404).send('User not found!!');
//         }        
//         res.send(user);
//     } catch(err) {
//         res.status(500).send();
//     }
// });

router.patch('/users/me', auth, async (req,res) => {

    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);
    const isOperaionAllowed = updates.every((update) => allowedUpdates.includes(update));

    if (!isOperaionAllowed) {
        return res.status(400).send({error: ' invalid fileds!'})
    }

    try {

        // findByIdAndUpdate - Bypasses mongoose and performs direct update on Databse.
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        // const user = await User.findById(req.params.id);
       
       
        // if (!user) {
        //     return res.status(404).send();
        // }

        updates.forEach((updateFiled) => req.user[updateFiled] = req.body[updateFiled]);

        await req.user.save();

        res.send(req.user);

    } catch(err) {
        res.status(400).send(err);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err)
    }
});

const upload = new multer({
    dest: 'avatar',
    limits: {
        fileSize: 1000000 // 1 megabyte
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a PDF'));
        }

        cb(undefined, true);
    } 
});
router.post('/users/me/avatar',  upload.single('avatar'), (req,res) => {
    res.send();
});

module.exports = router;