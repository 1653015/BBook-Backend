const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const Item = require('../../models/item');
const Book = require('../../models/book');
const User = require('../../models/user');
const {authenticate} = require('./middleware');

// to calculate total price of a cart
const calculateTotal = (cart) => {
    let total = 0;

    for (let i = 0; i < cart.products.length; i++) {
        Product.findById(cart.products[i], 'price')
            .then((product) => {
                total += product.price
            });
    }

    cart.total = total;
    cart.save();
}

// Tạo cart
router.post('/', authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    const cart = new Cart({
        items: [],
        total: 0
    });

    cart.save().then((cart) => {
        User.findByIdAndUpdate(userID, {
            $set: {cart: cart._id}
        }).then((user) => {
            user.markModified('cart');
            user.save();
        });

        return res.status(200).json({
            success: true,
            message: "Tạo giỏ hàng thành công"
        })
    })
});

// Thêm sản phẩm vào giỏ
router.put('/', (req, res, next) => {
    const bookID = req.body.bookID;
    const cartID = req.body.cartID;
    const quant = req.body.quant;

    let left = 0;
    let price = 0;

    Book.findById(bookID, 'inStore')
        .then((book) => {
            if (!book) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấy tựa sách này"
                });
            }

            left = book.inStore - quant;
            if (quant < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Tụa sách này không cò đủ sản phẩm tồn kho"
                });
            }
        });

    Book.findByIdAndUpdate(bookID, {inStore: left}, {new: true})
        .then((book) => {
            book.markModified('inStore');
            book.save();
            price = book.price;
        });
    
    const item = new Item({
        quant: quant,
        price: price,
        refItem: bookID
    });

    item.save()
        .then((item) => {
            Cart.findByIdAndUpdate(cartID, {
                    $push: {items: item._id},
                    $set: {total: item.quant * item.price}
                }, {new: true})
                .then((cart) => {
                    if (!cart) {
                        return res.status(400).json({
                            success: false,
                            message: "Không tìm thấy giỏ hàng"
                        })
                    }

                    cart.markModified('items');
                    cart.save();
                    cart.markModified('total');
                    cart.save();
                });
            
            return res.status(200).json({
                success: true,
                message: "Đã them sản phẩm thành công"
            })
        }).catch(next);
})

module.exports = router;