const jwt = require('jsonwebtoken');
require('dotenv').config();

authenticate = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Access denied"
        })
    }

    // Decode token
	jwt.verify(token, process.env.secret, (err, decoded) => {
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

module.exports = {
    authenticate
}