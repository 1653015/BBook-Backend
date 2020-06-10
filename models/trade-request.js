const mongoose = require('mongoose');

const traderq = new mongoose.Schema({
    op: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: {
            select: 'name -_id'
        }
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        autopopulate: {
            select: 'name image -_id'
        }
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
});

traderq.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('traderq', traderq);