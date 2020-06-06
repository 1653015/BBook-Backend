const express = require('express');
const router = express.Router();

const {authenticate, pushBackToStash, takeFromStash} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Trade = require('../../models/trade');

// Start a trade session
router.put('/begin/:id', (req, res, next) => {
    const tradeID = req.params.id;

    Trade.findByIdAndUpdate(tradeID, {
        $set: {duration: Date.now() + req.body.duration, onGoing: true}
    }).then(trade => {
        return res.status(200).json({
            success: true,
            message: "Thành công"
        });
    }).catch(next);
});

// End a trade session
router.put('/finish/:id', (req, res, next) => {
    const tradeID = req.params.id;

    Trade.findById(tradeID)
        .then(trade => {
            req.body.pairA = {
                id: trade.userA,
                book: trade.bookA
            }
            req.body.pairB = {
                id: trade.userB,
                book: trade.bookB
            }

            Trade.findByIdAndDelete(tradeID)
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: "Thành công"
                    });
                });
        }).catch(next);
}, pushBackToStash);

module.exports = router;