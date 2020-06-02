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
        categories: [{
            type: String
        }]
    }),
);

module.exports = book;