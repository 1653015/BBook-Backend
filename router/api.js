const express = require('express');
const router = express.Router();
router.use(require('body-parser').json());

router.use('/user', require('./user/user'));
router.use('/auth', require('./user/auth'));
router.use('/register', require('./user/register'));
router.use('/book', require('./user/book'));

module.exports = router;