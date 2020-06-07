const express = require('express');
const router = express.Router();
router.use(require('body-parser').json());

router.use('/user', require('./user/user'));
router.use('/auth', require('./user/auth'));
router.use('/register', require('./user/register'));
router.use('/book', require('./user/book'));
router.use('/cart', require('./user/cart'));
router.use('/transaction', require('./user/transaction'));
router.use('/category', require('./user/category'));
router.use('/traderq', require('./user/trade-request'));
router.use('/trade', require('./user/trade'));
router.use('/offer', require('./user/offer'));

module.exports = router;