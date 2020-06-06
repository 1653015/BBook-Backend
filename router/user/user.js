const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Trade = require('../../models/trade');

router.get("/", authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấy user"
                });
            }

            return res.status(200).json({
                success: true,
                user: user
            });
        }).catch(next);
});

router.get('/books', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID, 'books')
        .then((user) => {
            return res.status(200).json({
                success: true,
                user: user
            });
        }).catch(next);
});

router.get('/offered', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Offer.find({to: userID})
        .then((offers) => {
            return res.status(200).json({
                success: true,
                offers: offers
            });
        }).catch(next);
});

router.get('/trade', authenticate, (req, res, next) => {
    const userID = req.decoded.user;
    
    Trade.find({op: userID})
        .then((trades) => {
            return res.status(200).json({
                success: true,
                trades: trades
            });
        }).catch(next);
});

module.exports = router;