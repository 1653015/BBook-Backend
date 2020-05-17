const mongoose = require('mongoose');

const user = mongoose.Schema({
    login_id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('user', user);