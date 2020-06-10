const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');

// Tạo post trao đổi
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    const traderq = new Traderq({
        op: userID,
        book: req.body.book,
        interested: req.body.interested,
        message: req.body.message
    });

    traderq.save().then((traderq) => {
        User.findByIdAndUpdate(userID, {
            $push: {tradeRequests: traderq._id}
        }).then(() => {
            return res.status(200).json({
                success: true,
                traderq: traderq
            });
        })
    }).catch(next);
});

// Lấy info 1 traderq request bằng ID
router.get('/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.id;

    Traderq.findById(tradeID)
        .populate({
            path: 'interested offers book'
        })
        .then((traderq) => {
            if(!traderq) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài đăng này"
                });
            }

            return res.status(400).json({
                success: true,
                traderq: traderq
            })
        }).catch(next);
});

// lấy tất cả offer của 1 traderq request
router.get('/offer/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.id;

    Traderq.findByID(tradeID, 'offers')
        .populate('offers')
        .then(traderq => {
            if (!traderq) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài đăng này"
                });
            }

            return res.status(400).json({
                success: true,
                traderq: traderq
            });
        }).catch(next);
});

// delete traderq post
router.delete('/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.id;
    
    Traderq.findById(tradeID)
        .then((traderq) => {
            traderq.offers.forEach(offer => {
                Offer.findByIdAndDelete(offer);
            });

            return res.status(200).json({
                success: true,
                message: "Xóa thành công"
            });
        }).catch(next);
});

// Get all trade rq - user's traderq excluded
router.get('/', authenticate, (req, res, next) => {
    const userID = authenticate.userID;

    Traderq.find({op: {$ne: userID}})
        .then((posts) => {
            return res.status(200).json({
                success: true,
                posts: posts
            });
        }).catch(next);
});

// Get all my trade request
router.get('/user', authenticate, (req, res, next) => {
    const userID = authenticate.userID;

    Traderq.find({op: userID})
        .then((posts) => {
            return res.status(200).json({
                success: true,
                posts: posts
            });
        }).catch(next);
});

module.exports = router;