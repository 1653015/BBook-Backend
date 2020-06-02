const mongoose = require('mongoose');

const cart = mongoose.model(
    'cart',
    mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            }
        ],
        total: Number
    })
);

module.exports = cart;