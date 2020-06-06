const mongoose = require('mongoose');

const offer = mongoose.model(
    'offer',
    mongoose.Schema({
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        for: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
        offerings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        }],
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trade'
        }
    })
)

module.exports = offer;