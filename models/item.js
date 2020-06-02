const mongoose = require('mongoose');

const item = mongoose.model(
    'item',
    mongoose.Schema({
        quant: {
            Type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        refItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
    })
);



module.exports = item;