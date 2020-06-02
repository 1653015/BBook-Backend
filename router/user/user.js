const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const {authenticate} = require('./middleware');


router.get("/", authenticate, (req, res, next) => {
    const userID = req.decoded.userID;

    User.findById(userID)
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấy user"
                });
            }

            return res.status(200).json({
                success: true,
                user: user
            });
        }).catch(next);
});




module.exports = router;