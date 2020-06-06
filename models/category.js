const mongoose = require('mongoose');

const category = new mongoose.model(
    'category',
    mongoose.Schema({
        name: {
            type: String,
            required: true,
            default: ""
        }
    })
)

module.exports = category;