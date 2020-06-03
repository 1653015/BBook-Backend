const mongoose = require('mongoose');

const item = mongoose.model(
    'item',
    mongoose.Schema({
        quant: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        },
        refItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
    })
);



module.exports = item;