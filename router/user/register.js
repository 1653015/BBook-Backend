const { registerValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/email', (req, res, next) => {
    const error = registerValidation(req.body);
    if (error.error) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            err: error,
        })
    }

    // Actually register user
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
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