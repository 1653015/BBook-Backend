const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');
const async = require('async');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');
const Trade = require('../../models/trade');


// new offer
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    let offer = new Offer({
        from: userID,
        to: req.body.to,
        for: req.body.for,
        offering: req.body.offering,
        post: req.body.post
    });

    offer.save().then((offer) => {
        Traderq.findByIdAndUpdate(offer.post, {
            $push: {offers: offer._id}
        }).then(() => {
            return res.status(200).json({
                success: true,
                offer: offer,
            });
        });
    }).catch(next);
});

// Lấy 1 offer
router.get('/:id', authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findById(offerID)
        .then((offer) => {
            if (!offer) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy offer theo yêu cầu"
                });
            }

            return res.status(200).json({
                success: true,
                offer: offer
            });
        }).catch(next);
});

// Lấy các tựa sách của 1 đề nghị
router.get('/books/:id', authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findById(offerID, 'offering')
        .populate('offering')
        .then((books) => {
            if (!books) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy lời đề nghị theo yêu cầu"
                });
            }

            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Dùng để từ chối 
router.delete('/decline/:id', authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findByIdAndDelete(offerID)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Xóa thành công"
            });
        }).catch(next);
});

// Dùng để accept offer - tạo 1 trade session
router.delete('/accept/:id', authenticate, (req, res, next) => {
    const offerID = req.params.id;
    const userID = req.decoded.userID;

    Offer.findById(offerID)
        .then((offer) => {
            if (!offer) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy offer"
                });
            }

            User.findByIdAndUpdate(userID, {
                $pull: {books: offer.for},
                $push: {tradedBooks: offer.for}
            });

            User.findByIdAndUpdate(offer.from, {
                $pull: {books: offer.offering},
                $push: {tradedBooks: offer.offering}
            });

            let trade = new Trade({
                userA: offer.to,
                bookA: offer.for,
                userB: offer.from,
                bookB: offer.offering,
                deadLine: Date.now + new Date(7 * 86400000)
            });

            trade.save().then((trade) => {
                Offer.findOneAndDelete(offerID)
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: 'Hoàn thành',
                            trade: trade
                        });
                    })
            })
        }).catch(next);
});

module.exports = router;