const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');

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

// Lấy tất cả sách trong kho của 1 user
router.get('/books/stash', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID, 'books')
        .populate('books')
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Lấy tất cả các sách user đang cho mượn
router.get('/books/traded', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID, 'tradedBooks')
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Lấy tất cả các offer đến user này
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

// Lấy tất cả các trade post của user
router.get('/traderq', authenticate, (req, res, next) => {
    const userID = req.decoded.user;
    
    Traderq.find({op: userID})
        .then((trades) => {
            return res.status(200).json({
                success: true,
                trades: trades
            });
        }).catch(next);
});

// chuyển sách từ kho sang cho mượn
router.put('/books/traded/:id', authenticate, (req, res, next) => {
    const bookID = req.params.id;
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, {
        $push: {tradedBooks: bookID},
        $pull: {books: bookID}
    }).then((user) => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }).catch(next);
});

// Chuyển sách từ trạng thái cho mượn về kho
router.put('/books/stash/:id', authenticate, (req, res, next) => {
    const bookID = req.params.id;
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, {
        $pull: {tradedBooks: bookID},
        $push: {books: bookID}
    }).then((user) => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }).catch(next);
});

module.exports = router;