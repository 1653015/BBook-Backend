const mongoose = require('mongoose');
const bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

const user = mongoose.Schema({
    email: {
        type: String,
		trim: true,
		index: true,
		unique: true,
		sparse: true,
    },
    provider: {
        type: String,
		default: 'BBookUser',
		required: true,
    },
    providerUID: {
        type: String,
		trim: true,
		index: true,
		unique: true,
		sparse: true,
    },
    password: String,
    name: {
        type: String,
        required: true,
        default: "Jill Doe"
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    }],
    tradedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    }],
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction'
    }],
    tradeRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'traderq'
    }],
    resetPasswordToken: String,
    resetPasswordTokenExpiration: Date
});

user.methods.comparePassword = function(input, cb) {
    bcrypt.compare(input, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
}

user.pre('save', function(next) {
    let user = this;
    
    // only hash the password if it hasn't been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('user', user);