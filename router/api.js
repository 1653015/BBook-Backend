const express = require('express');
const router = express.Router();

router.use('/user', require('./user/user'));
router.use('/auth', require('./user/auth'));
router.use('/register', require('./user/register'));

module.exports = router;