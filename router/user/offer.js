const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');
const async = require('async');
const cors = require('cors');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');
const Trade = require('../../models/trade');


// new offer
router.post('/', cors(), authenticate, (req, res, next) => {
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
router.get('/:id', cors(), authenticate, (req, res, next) => {
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
router.get('/books/:id', cors(), authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findById(offerID, 'offering')
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


router.delete('/:id', cors(), authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findById(offerID)
        .then((offer) => {
            Traderq.findByIdAndUpdate(offer.post, {
                $pull: {offers: offer._id}
            }).then(() => {
                Offer.findByIdAndDelete(offerID)
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: "Xóa thành công"
                        });
                    });
            });
        }).catch(next);
})

// Dùng để từ chối 
router.delete('/decline/:id', cors(), authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findById(offerID)
        .then((offer) => {
            Traderq.findByIdAndUpdate(offer.post, {
                $pull: {offers: offer._id}
            }).then(() => {
                Offer.findByIdAndDelete(offerID)
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: "Xóa thành công"
                        });
                    });
            })
        }).catch(next);
});

// Dùng để accept offer - tạo 1 trade session
router.delete('/accept/:id', cors(), authenticate, (req, res, next) => {
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
            }).then(() => {
                User.findByIdAndUpdate(offer.to, {
                    $pull: {books: offer.offering},
                    $push: {tradedBooks: offer.offering}
                }).then(() => {
                    Traderq.findById(offer.post)
                        .then(traderq => {
                            reserveDays = traderq.duration;
                            let now = new Date()
                            const reserveDays = 0;

                            let trade = new Trade({
                                userA: offer.to,
                                bookA: offer.for,
                                userB: offer.from,
                                bookB: offer.offering,
                                deadLine: now.setDate(now.getDate() + 7),
                                reserveDays: reserveDays
                            });

                            trade.save().then((trade) => {
                                return res.status(200).json({
                                    success: true,
                                    message: 'Hoàn thành',
                                    trade: trade
                                });
                            });
                        });
                })
            })
        }).catch(next);
});

module.exports = router;