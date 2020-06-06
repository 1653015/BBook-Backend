const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Trade = require('../../models/trade');

// new offer
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    let offer = new Offer({
        from: userID,
        to: req.body.toUser,
        for: req.body.forBook,
        offering: req.body.offering,
        post: req.body.tradePost
    });

    offer.save().then((offer) => {
        Trade.findByIdAndUpdate(offer.post, {
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

    Offer.findById(offerID, 'offerings')
        .populate('offerings')
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
router.delete('/:id', authenticate, (req, res, next) => {
    const offerID = req.params.id;

    Offer.findByIdAndDelete(offerID)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Xóa thành công"
            });
        }).catch(next);
});

// Dùng để accept offer


module.exports = router;