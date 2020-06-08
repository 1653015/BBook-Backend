const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { authenticate } = require('./middleware');

const Transaction = require('../../models/transaction');
const User = require('../../models/user');
const Book = require('../../models/book');

// tạo phiên giao dịch
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;
    const cart = req.body.items.map(item => item.id);

    const transaction = new Transaction({
        user: userID,
        items: cart,
        total: req.body.total,
        destination: req.body.destination,
        contactNumbers: req.body.numbers
    });

    transaction.save().then((transaction) => {
        User.findByIdAndUpdate(userID, {
            $push: {transactions: transaction._id}
        }).then((user) => {
            return res.status(200).json({
                success: true,
                message: "Tạo phiên giao dịch thành công"
            })
        })
    }).catch(next);
});

// Complete transaction :: Admin api
router.put('/complete', (req, res, next) => {
    const transID = req.body.transID;

    Transaction.findByIdAndUpdate(transID, {
        $set: {completed: true}
    }).then(transaction => {
        User.findByIdAndUpdate(transaction.user, {
            $addToSet: { books: { $each: transaction.items } }
        }, { new: true }).then(user => {
            return res.status(200).json({
                success: true,
                user: user
            })
        })
    }).catch(next);
});

router.post('/complete/:id', authenticate, (req, res, next) => {
    const transID = req.params.id;
    const userID = req.params.userID;

    Transaction.findOneAndUpdate({_id: transID, user: userID, completed: false}, {
        $set: {completed: true}
    }).then(transaction => {
        User.findByIdAndUpdate(userID, {
            $addToSet: { books: { $each: transaction.items } }
        }, { new: true }).then(user => {
            return res.status(200).json({
                success: true,
                user: user
            })
        })
    }).catch(next);
});

module.exports = router;