const mongoose = require('mongoose');

const cart = mongoose.model(
    'cart',
    mongoose.Schema({
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'book'
            }
        ],
        total: Number
    })
);

module.exports = cart;