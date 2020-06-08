const express = require('express');
const router = express.Router();

const Cart = require('../../models/cart');
const Book = require('../../models/book');
const {authenticate} = require('./middleware');

// kiểm tra item của cart
router.post('/validate', authenticate, (req, res, next) => {
    const cart = req.body.cart;
    let validatedCart = {
        items: [],
        total: 0
    }
    let promises = [];

    cart.forEach(item => {
        promises.push(
            Book.findById(item.id)
                .then((book) => {
                    if (book.inStore >= item.quant) {
                        validatedCart.items.push({
                            book: removeUnwantedFields(book),
                            quant: item.quant
                        });

                        validatedCart.total += item.quant * book.price;

                        book.inStore -= item.quant;
                        book.markModified('inStore');
                        book.save();
                    }
                })
        );
    });

    Promise.all(promises)
        .then(() => {
            return res.status(200).json({
                cart: validatedCart
            })
        }).catch(next);
});

// Trả lại item từ giở hàng
router.put('/return', authenticate,(req, res, next) => {
    const items = req.body.cart;
    let promises = [];

    items.forEach(item => {
        promises.push(
            Book.findByIdAndUpdate(item.id, {
                $inc: { inStore: item.quant }
            })
        );
    });

    Promise.all(promises)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Hoàn trả thành công"
            })
        }).catch(next);
});

const removeUnwantedFields = (book) => {
	let bookObj = book.toObject();
	delete bookObj.categories;
	delete bookObj.inStore;
	return bookObj;
};

module.exports = router;