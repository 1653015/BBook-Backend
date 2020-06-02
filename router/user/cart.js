const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const Product = require('../../models/product');

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