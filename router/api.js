const express = require('express');
const router = express.Router();

router.use('/user', require('./user/user'));
router.use('/book', require('./user/book'));
router.use('/booktitle', require('./user/booktitle'));
router.use('/cart', require('./user/cart'));
router.use('/genre', require('./user/genre'));
router.use('/request', require('./user/request'));

module.exports = router;