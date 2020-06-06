const mongoose = require('mongoose');

const book = mongoose.model(
    'book',
    mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        }],
        inStore: {
            type: Number,
            default: 0
        }
    }),
);

module.exports = book;