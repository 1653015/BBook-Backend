const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { registerValidation, signinValidation } = require('../../validation');

router.use(bodyparser.json());

router.get('/', async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.json({ message: err});
    }
});

router.post('/register', async(req, res) => {
    // user input validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details);

    // check exist
    const login_idExist = await User.findOne({login_id: req.body.login_id});
    if (login_idExist) return res.status(400).send('That username already exist. Please choose another one');
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('That email already exist. Forgot your password?');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Actually register user
    const user = new User({
        login_id: req.body.login_id,
        password: hashedPassword,
        email: req.body.email,
    });

    try {
        const savedUser = await user.save();
        res.status(200).json({ user: user._id });
    } catch(err) {
        res.status(400).json({ message: err });
    }
})

router.post('/signin', async(req, res) => {
    // validate user input
    const { error } = signinValidation(req.body);
    if (error) return res.status(400).send('Invalid username or password!!!');

    // check if user exist
    const user = await User.findOne({login_id: req.body.login_id});
    if (!user) return res.status(400).send('That user does not exist. Sign up?');

    // Compare hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Incorrect password. Better luck next time!');

    // Create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);
});

module.exports = router;