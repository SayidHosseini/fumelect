const express = require('express');
const router = express.Router();
const token = require('../middlewares/token');
const rm = require('../static/responseMessages');

router.get('/token', token.validate, (req, res, next) => {
    return res.deliver(rm.loggedIn);
});

module.exports = router;
