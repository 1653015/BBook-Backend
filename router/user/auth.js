const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { signinValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/', async(req, res) => {
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

    res.header('x-access-token', token).send(token);
});

module.exports = router;