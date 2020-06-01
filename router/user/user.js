const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bodyparser = require('body-parser');

router.use(bodyparser.json());

router.get('/', async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.json({ message: err});
    }
});


module.exports = router;