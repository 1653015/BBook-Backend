const mongoose = require('mongoose');

const traderq = mongoose.model(
    'traderq',
    mongoose.Schema({
        op: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
        interested: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'book'
            }],
            default: []
        },
        message: {
            type: String,
            required: true,
            default: 'lemme smash!!!'
        },
        offers: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'offer'
            }],
            default: []
        }
    })
)

module.exports = traderq;