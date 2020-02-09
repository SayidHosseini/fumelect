const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const rm = require('../static/responseMessages');

router.get('/token', validate.token, (req, res, next) => {
    return res.deliver(rm.loggedIn);
});

module.exports = router;
