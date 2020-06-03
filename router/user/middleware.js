const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

authenticate = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
    	res.status(400).json({
            success: false,
            message: "Access denied"
		})
		
		next();
    }

    // Decode token
	jwt.verify(token, process.env.secret, (err, decoded) => {
		if (err) {
			res.json({
				success: false,
				message: 'Xác thực thất bại',
			});

			next();
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