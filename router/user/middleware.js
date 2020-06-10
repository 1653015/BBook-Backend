const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const User = require('../../models/user');

authenticate = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
    	return res.status(400).json({
            success: false,
            message: "Access denied"
		})
	}
	
    // Decode token
	jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.json({
				success: false,
				message: 'Xác thực thất bại',
			});
		} else {
			// If everything is good, save to request for use in other routes
			req.decoded = decoded;
			next();
		}
	});
}

removeSensitiveDataFromUser = (user) => {
	let userObj = user.toObject();
	delete userObj.password;
	delete userObj.providerUID;
	return userObj;
};

removeSensitiveDataFromBook = (book) => {
	let bookObj = book.toObject();
	delete bookObj.inStore;
	
	return bookObj;
};

pushBackToStash = (req, res, next) => {
	const pairA = req.body.pairA;
	const pairB = req.body.pairB;

	User.findByIdAndUpdate(pairA.id, {
		$push: {books: pairA.book},
		$pull: {tradedBooks: pairA.book}
	});

	User.findByIdAndUpdate(pairB.id, {
		$push: {books: pairB.book},
		$pull: {tradedBooks: pairB.book}
	});

	next();
}

takeFromStash = (req, res, next) => {
	const pairA = req.body.pairA;
	const pairB = req.body.pairB;

	User.findByIdAndUpdate(pairA.id, {
		$pull: {books: pairA.book},
		$push: {tradedBooks: pairA.book}
	});

	User.findByIdAndUpdate(pairB.id, {
		$pull: {books: pairB.book},
		$push: {tradedBooks: pairB.book}
	});

	next();
}

module.exports = {
	authenticate,
	pushBackToStash,
	takeFromStash,
	removeSensitiveDataFromUser,
	removeSensitiveDataFromBook
}