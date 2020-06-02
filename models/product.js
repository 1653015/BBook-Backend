const mongoose = require('mongoose');

const product = mongoose.model(
    'product',
    mongoose.Schema({
        price: {
            type: String,
            required: true,
        },
        refItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
    })
);

module.exports = product;