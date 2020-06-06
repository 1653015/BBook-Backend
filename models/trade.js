const mongoose = require('mongoose');

const trade = new mongoose.model(
    'trade',
    mongoose.Schema({
        op: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        interested: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        }],
        message: {
            type: String,
            required: true,
            default: 'lemme smash!!!'
        },
        offers: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'offer'
        },
    })
)

module.exports = trade;