const express = require('express');
const router = express.Router();

const {authenticate, pushBackToStash, takeFromStash} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Trade = require('../../models/trade');

// Start a trade session
router.put('/begin/:id', (req, res, next) => {
    const tradeID = req.params.id;
    let now = new Date();

    Trade.findByIdAndUpdate(tradeID, {
        $set: {returnDeadline: now.setDate(now.getDate() + req.body.duration), onGoing: true}
    }).then(trade => {
        return res.status(200).json({
            success: true,
            trade: trade
        });
    }).catch(next);
});

// End a trade session
router.put('/finish/:id', (req, res, next) => {
    const tradeID = req.params.id;

    Trade.findById(tradeID)
        .then(trade => {
            User.findByIdAndUpdate(trade.userA, {
                $pull: {tradedBooks: trade.bookA},
                $push: {Books: trade.bookA}
            });

            User.findByIdAndUpdate(trade.userB, {
                $pull: {tradedBooks: trade.bookB},
                $push: {Books: trade.bookB}
            });

            Trade.findByIdAndDelete(tradeID)
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: "Thành công"
                    });
                });
        }).catch(next);
});

module.exports = router;