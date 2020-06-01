const { registerValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/email', (req, res, next) => {
    // Actually register user
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });

    user.save().then(() => {
        res.status(200).json({
            success: true,
            message: "Successfully registered.",
            user: user
        });
    }).catch(next);
});

module.exports = router