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

router.post('/', async(req, res) => {
    const user = new User({
        login_id: req.body.login_id,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch(err) {
        res.status(404).json({ message: err });
    }
})

router.get('/:login_id', async(req, res) => {
    try {
        const user = await User.find({ login_id: req.params.login_id });
        res.status(200).json(user);
    } catch(err) {
        res.status(404).json({ message: err });
    }
});

module.exports = router;