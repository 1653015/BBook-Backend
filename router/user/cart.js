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
                            id: item.id,
                            quant: item.quant,
                            price: book.price * item.quant
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
        })
});

module.exports = router;