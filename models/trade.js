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
        turninDeadline: {
            type: Date,
        },
        onGoing: {
            type: Boolean,
            default: false
        },
        returnDeadline: {
            type: Date,
        },
        reserveDays: Number
    }),
);

module.exports = trade;