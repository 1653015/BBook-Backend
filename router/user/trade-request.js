const express = require('express');
const router = express.Router();
const cors = require('cors');

const {authenticate, 
    removeSensitiveDataFromBook, 
    removeSensitiveDataFromUser} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');

// Tạo post trao đổi
router.post('/', cors(), authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Traderq.findOne({book: req.body.book})
        .then(traderq => {
            if (traderq) {
                return res.status(400).json({
                    success: false,
                    message: "Bạn đã có 1 bài đăng yêu cầu trao đổi tựa sách này"
                });
            } else {
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
                })
            }
        }).catch(next);
});

// Lấy info 1 traderq request bằng ID
router.get('/:id', cors(), authenticate, (req, res, next) => {
    const tradeID = req.params.id;

    Traderq.findById(tradeID)
        .populate({
            path: 'interested offers book op',
            select: '-inStore'
        })
        .then((traderq) => {
            if(!traderq) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài đăng này"
                });
            }

            traderq.op = removeSensitiveDataFromUser(traderq.op);

            return res.status(200).json({
                success: true,
                traderq: traderq
            })
        }).catch(next);
});

// lấy tất cả offer của 1 traderq request
router.get('/offer/:id', cors(), authenticate, (req, res, next) => {
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
router.delete('/:id', cors(), authenticate, (req, res, next) => {
    const tradeID = req.params.id;
    
    Traderq.findById(tradeID)
        .then((traderq) => {
            traderq.offers.forEach(offer => {
                Offer.findByIdAndDelete(offer);
            });
        });

    Traderq.findByIdAndDelete(tradeID)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Đã xóa post thành công"
            });
        }).catch(next);
});

router.delete('/test/:id', cors(), authenticate, (req, res, next) => {
    const tradeID = req.params.id;
    let promises = [];
    
    Traderq.findById(tradeID)
        .then((traderq) => {
            traderq.offers.forEach(offer => {
                promises.push(Offer.findByIdAndDelete(offer))
            });

            promises.push(Traderq.findByIdAndDelete(tradeID))

            Promise.all(promises)
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: "Đã xóa post thành công"
                    });
                })
        }).catch(next);
});

// Get all trade rq - user's traderq excluded
router.get('/', cors(), authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Traderq.find({op: {$ne: userID}}, {
            op: 1,
            book: 1
        })
        .populate({
            path: 'op book',
            select: 'name image'
        })
        .then((posts) => {
            return res.status(200).json({
                success: true,
                posts: posts
            });
        }).catch(next);
});

router.post('/user', cors(), authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Traderq.find({op: userID})
        .populate({
            path: 'book interested',
            select: '-inStore'
        })
        .then(posts => {
            return res.status(200).json({
                success: true,
                posts: posts
            });
        }).catch(next);
});

module.exports = router;