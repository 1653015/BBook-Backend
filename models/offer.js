const mongoose = require('mongoose');

const offer = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: {
            select: '-password -providerUID -books -tradedBooks -transactions -tradeRequests -resetPasswordToken'
        }
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: {
            select: '-password -providerUID -books -tradedBooks -transactions -tradeRequests -resetPasswordToken'
        }
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        autopopulate: {
            select: '-inStore'
        }
    },
    offering: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        autopopulate: {
            select: '-inStore'
        }
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trade'
    }
})

offer.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('offer', offer);