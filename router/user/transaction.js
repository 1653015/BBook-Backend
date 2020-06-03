const mongoose = require('mongoose');
const router = mongoose.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const { authenticate } = require('./middleware');

const Transaction = require('../../models/transaction');
const Item = require('../../models/item');
const User = require('../../models/user');
const Book = require('../../models/book');

// tạo phiên giao dịch
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;
    const cart = req.body.cart.map(item => item.id);

    const transaction = new Transaction({
        user: userID,
        items: cart,
        total: req.body.total
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
})

module.exports = router;