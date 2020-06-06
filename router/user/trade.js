const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Trade = require('../../models/trade');

// Tạo post trao đổi
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    const trade = new Trade({
        op: userID,
        interested: req.body.interested,
        message: req.body.message,
        offers: []
    });

    trade.save().then((trade) => {
        User.findByIdAndUpdate(userID, {
            $push: {tradeRequests: trade._id}
        }).then(() => {
            return res.status(200).json({
                success: true,
                trade: trade
            });
        })
    }).catch(next);
});

// Lấy info 1 trade request bằng ID
router.get('/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.tradeID;

    Trade.findByID(tradeID)
        .populate({
            path: 'interested op offers'
        })
        .then((trade) => {
            if(!trade) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài đăng này"
                });
            }

            return res.status(400).json({
                success: true,
                trade: trade
            })
        }).catch(next);
});

// lấy tất cả offer của 1 trade request
router.get('/offer/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.id;

    Trade.findByID(tradeID, 'offers')
        .populate('offers')
        .then(trade => {
            if (!trade) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài đăng này"
                });
            }

            return res.status(400).json({
                success: true,
                trade: trade
            });
        }).catch(next);
});

// delete trade post
router.delete('/:id', authenticate, (req, res, next) => {
    const tradeID = req.params.id;
    
    Trade.findByIdAndDelete(tradeID)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Xóa thành công"
            });
        }).catch(next);
});

module.exports = router;