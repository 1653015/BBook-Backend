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

    User.findOne({email: req.body.email})
        .then((user) => {
            if (!user) {
                 // Actually register user
                const user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,    
                    address: req.body.address,
                    phone: req.body.phone,
                    books: [],
                    transactions: [],
                });

                user.save().then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Successfully registered."
                    });
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "user already exist"
                })
            }
        }).catch(next);
});

module.exports = router