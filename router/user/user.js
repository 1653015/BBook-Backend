const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bodyparser = require('body-parser');
const {authenticate} = require('./middleware');

router.use(bodyparser.json());
router.use(require('cookie-parser'));

router.get('/', (req, res, next) => {
    console.log(req.cookies);
    next();
});


module.exports = router;