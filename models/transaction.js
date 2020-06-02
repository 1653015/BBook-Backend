const mongoose = require('mongoose');

const transaction = mongoose.model(
    'transaction',
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
        destination: {
            type: String,
            required: true
        },
        contactNumbers: String,
        total: {
            type: Number,
            default: 0
        }
    })
);

module.exports = transaction;