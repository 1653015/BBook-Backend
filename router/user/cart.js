const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const Item = require('../../models/item');
const Book = require('../../models/book');
const User = require('../../models/user');
const {authenticate} = require('./middleware');

// kiểm tra item của cart
router.post('/validate', authenticate, (req, res, next) => {
    const cart = req.cookies['cart'];
    const validatedCart = {
        items: [],
        total: 0
    };

    cart.forEach(item => {
        Book.findById(item.id)
            .then((book) => {
                if (book.inStore >= item.quant) {
                    validatedCart.items.push({
                        id: item.id,
                        quant: item.quant,
                        price: book.price * item.quant
                    });

                    validatedCart.total += item.quant * item.price;

                    book.inStore -= item.quant;
                    book.markModified('inStore');
                    book.save();
                }
            })
    });

    return res.status(200).json({
        success: true,
        cart: validatedCart
    });
});

module.exports = router;