const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const { signinValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/signin', (req, res, next) => {
    // validate user input
    const { error } = signinValidation(req.body);
    if (error) return res.status(400).json({
        success: false,
        err: error
    });

    User
        .findOne({email: req.body.email})
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "No user with that email"
                });
            }

            user.comparePassword(req.body.password, (err, matched) => {
                console.log(matched);
                
                if (!matched) {
					return res.status(401).json({
						success: false,
						message: 'Sai mật khẩu!',
					});
                }
                
                let token = jwt.sign({ userID: user._id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '24h' }
                );

                return res.status(200)
                    .cookie("name", user.name, {maxAge: 36000000})
                    .header("x-access-token", token)
                    .json({
                        success: true,
                        message: "Đăng nhập thành công"
                    });
            })

        }).catch(next);
});

router.post('/signout', (req, res, next) => {
    res.clearCookie('token');
    next();
});

module.exports = router;