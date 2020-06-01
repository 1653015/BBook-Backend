const { registerValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bodyparser = require('body-parser');

router.post('/email', async(req, res) => {
    // user input validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details);

    // check exist
    const login_idExist = await User.findOne({login_id: req.body.login_id});
    if (login_idExist) return res.status(400).send('That username already exist. Please choose another one');
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('That email already exist. Forgot your password?');

    // Actually register user
    const user = new User({
        login_id: req.body.login_id,
        password: req.body.password,
        email: req.body.email,
    });

    user.save().then(() => {
        res.status(200).json({
            success: true,
            message: "Successfully registered."
        });
    }).catch(next);
})