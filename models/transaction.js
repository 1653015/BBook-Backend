const mongoose = require('mongoose');

const transaction = mongoose.model(
    'transaction',
    mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'item'
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
        },
        completed: {
            type: Boolean,
            default: false
        }
    })
);

module.exports = transaction;