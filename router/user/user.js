const express = require('express');
const router = express.Router();

const {authenticate} = require('./middleware');

const User = require('../../models/user');
const Offer = require('../../models/offer');
const Traderq = require('../../models/trade-request');

router.get("/", authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấy user"
                });
            }

            return res.status(200).json({
                success: true,
                user: user
            });
        }).catch(next);
});

// Lấy tất cả sách trong kho của 1 user
router.get('/books/stash', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID, 'books -_id')
        .populate('books')
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Lấy tất cả các sách user đang cho mượn
router.get('/books/traded', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID, 'tradedBooks -_id')
        .populate('tradedBooks')
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Lấy tất cả các offer đến user này
router.get('/offer/received', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Offer.find({to: userID})
        .then((offers) => {
            return res.status(200).json({
                success: true,
                offers: offers
            });
        }).catch(next);
});

// all sent offers
router.get('/offer/sent', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    Offer.find({from: userID})
        .then((offers) => {
            return res.status(200).json({
                success: true,
                offers: offers
            });
        }).catch(next);
})

router.put('/book/stash/add', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;
    const books = req.body.books;

    User.findByIdAndUpdate(userID, {
        $addToSet: { books: { $each: books }}
    }).then(user => {
        return res.status(200).json({
            success: true,
            books: user.books
        })
    }).catch(next);
})

// Lấy tất cả các trade post của user
router.get('/traderq', authenticate, (req, res, next) => {
    const userID = req.decoded.user;
    
    Traderq.find({op: userID})
        .then((trades) => {
            return res.status(200).json({
                success: true,
                trades: trades
            });
        }).catch(next);
});

// chuyển sách từ kho sang cho mượn
router.put('/books/traded/:id', authenticate, (req, res, next) => {
    const bookID = req.params.id;
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, {
        $push: {tradedBooks: bookID},
        $pull: {books: bookID}
    }).then((user) => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }).catch(next);
});

// Chuyển sách từ trạng thái cho mượn về kho
router.put('/books/stash/:id', authenticate, (req, res, next) => {
    const bookID = req.params.id;
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, {
        $pull: {tradedBooks: bookID},
        $push: {books: bookID}
    }).then((user) => {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }).catch(next);
});

// Đổi địa chỉ
router.put('/address', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, {
        $set: { address: req.body.address }
    }).then((user) => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy user"
                });
            }

            return res.status(200).json({
                success: true,
                user: removeSensitiveData(user)
            });
        }).catch(next);
});

// Đổi sđt
router.put('/numbers', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findByIdAndUpdate(userID, { $set: { phone: req.body.phone } })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy user"
                });
            }

            return res.status(200).json({
                success: true,
                user: removeSensitiveData(user)
            });
        }).catch(next);
});

// Đổi mật khẩu
router.put('/password', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID)
        .then((user) => {
            user.comparePassword(req.body.oldPassword, (err, matched) => {
                if (matched) {
                    user.password = req.body.newPassword;
                    user.markModified('password');
                    user.save();

                    return res.status(200).json({
                        success: true,
                        message: "Đổi mật khẩu thành công"
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Mật khẩu hiện tại không đúng"
                    });
                }
            })
        }).catch(next);
});

const removeSensitiveData = (user) => {
	let userObj = user.toObject();
	delete userObj.password;
	delete userObj.providerUID;
	return userObj;
};

module.exports = router;