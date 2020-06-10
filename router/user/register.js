const { registerValidation } = require('../../validation');
const express = require('express');
const router = express.Router();
const User = require('../../models/user');

const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

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
                    tradedBooks: [],
                    transactions: [],
                    tradeRequests: []
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

router.post('/email-activation', (req, res, next) => {
    const error = registerValidation(req.body);
    
    if (error.error) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            err: error,
        })
    }

    async.waterfall([
        (done) => {
            crypto.randomBytes(20, function(err, buf) {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
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
                            tradedBooks: [],
                            transactions: [],
                            tradeRequests: [],
                            activated: false,
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000
                        });

                        user.save(function(err) {
                            done(err, token, user);
                        })
                    }
                });
        },
        (token, user, done) => {
            let smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bbookteam@gmail.com',
                    pass: 'bbook1998'
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'bbookteam@gmail.com',
                subject: 'Account activation letter',
                text: 'This is an activation email, sent to you by BBook team.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'https://bbook-backend.herokuapp.com/register/validate/' + token + '\n\n' +
                    'If you did not request this, please ignore this email.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                res.status(200).json({
                    success: true,
                    message: "Tạo tài khoản thành công, email kích hoạt đã được gửi đến địa chỉ email của bạn"
                })
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/register');
    });
});

router.get('/validate/:token', (req, res, next) => {
    const token = req.params.token;

    User.findOne({resetPasswordToken: token})
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy user này"
                })
            }
            
            user.validated = true;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
                if (!err) {
                    return res.status(200).json({
                        success: true,
                        message: "Kích hoạt tài khoản thành công"
                    }).redirect('https://1653015.github.io/BBook-Frontend');
                } else {
                    return res.status(400).json({
                        success: false,
                        err: err
                    });
                }
            });
        })
})

module.exports = router