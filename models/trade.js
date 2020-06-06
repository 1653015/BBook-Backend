const mongoose = require('mongoose');

const trade = mongoose.model(
    'trade',
    mongoose.Schema({
        userA : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        bookA: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
        userB : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        bookB: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
        deadLine: {
            type: Date,
            default: '7d'
        },
        onGoing: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Date,
            default: 0
        }
    }),
);

module.exports = trade;